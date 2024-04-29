import { auth } from "@/auth.mjs"
import { signOut } from "@/auth.mjs"

const SettingsPage = async () => {
    const session = await auth()
    return (
        <div>
            {JSON.stringify(session)}
            <form action={async () => {
                "use server"

                await signOut()
            }}>
                <button type="submit">Sign Out</button>
            </form>
        </div>
    )
}

export default SettingsPage
