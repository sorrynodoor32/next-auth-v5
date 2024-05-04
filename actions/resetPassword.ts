"use server"
import * as z from 'zod'
import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid Email!" }
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
        return { error: "Email not found!" }
    }

    //TODO: Generate token & email
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail({
        email: passwordResetToken.email,
        token: passwordResetToken.token
    })

    return { success: "Reset email sent!" }
}

