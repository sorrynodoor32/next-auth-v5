"use server"

import { signOut } from "@/auth.mjs"

export const logout = async () => {
    //some server stuff
    await signOut({
        redirectTo: "/auth/login"
    })
}