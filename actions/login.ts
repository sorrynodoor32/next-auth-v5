"use server"
import * as z from 'zod'
import { signIn } from '@/auth.mjs'
import { LoginSchema } from '@/schemas/index'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/user'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'


export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { email, password, code } = validateFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success: "Confirmation email sent!" }
    }


    //Verified 2FA
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            //TODO: Verify code
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            console.log(twoFactorToken)
            if (!twoFactorToken) {
                return { error: "Invalid code!" }
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if (hasExpired) {
                return { error: "Code expired!" }
            }

            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail({
                email: twoFactorToken.email,
                token: twoFactorToken.token
            })
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } catch (err) {
        //TO DO
        if (err instanceof AuthError) {
            switch (err.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw err
    }
}   