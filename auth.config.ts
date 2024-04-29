import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { getUserByEmail } from "./data/user"
import { LoginSchema } from "./schemas"

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await getUserByEmail(email)

                    if (!user || !password) return null

                    const passwordMatched = await bcrypt.compare(
                        password,
                        user.password as string
                    )

                    if (passwordMatched) return user

                }

                return null
            }
        })
    ]
}