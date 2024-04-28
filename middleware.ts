// import { auth } from "./auth.mjs";

export default function auth(req: any) {
    const isLoggedIn = !!req.auth
    console.log("IS LOGGEDIN: ", isLoggedIn)
    console.log("Route: ", req.nextUrl.pathname)
}

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}