"use server"
import * as z from 'zod'
import bcrypt from 'bcrypt'
import { RegisterSchema } from '@/schemas/index'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'

export const register = async (value: z.infer<typeof RegisterSchema>) => {
    const invalidFields = RegisterSchema.safeParse(value)

    if (!invalidFields.success) {
        return { error: 'Invalid Fields' }
    }

    const { email, password, name } = invalidFields.data

    const hashPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: 'Email already in use!' }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })

    //Todo: Send verification token emai;

    return { success: 'User created!' }
}