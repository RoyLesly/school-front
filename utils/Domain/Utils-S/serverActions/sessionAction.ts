'use server';
import { defaultSession, SessionInter, sessionOptions } from "@/serverActions/interfaces";
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"


export const getSession = async () => {
    const session = await getIronSession<SessionInter>(cookies(), sessionOptions)
    if (!session.isLoggedIn){
        session.exp = defaultSession.exp;
        session.created_at = defaultSession.created_at;
        session.isLoggedIn = defaultSession.isLoggedIn;
    }

    return session;
}


export const logout = async () => {
    const session = await getIronSession<SessionInter>(cookies(), sessionOptions)
    session.destroy()
}

