import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./data/user"
import { LoginSchema } from "./schemas"

export default {
    providers: [
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