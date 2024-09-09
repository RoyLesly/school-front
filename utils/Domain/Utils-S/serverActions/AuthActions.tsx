"use server";

import { axiosRequest } from '@/functions';
import { jwtDecode } from 'jwt-decode';
import { getSession } from './sessionAction';
import { SchemaCheckUser, SchemaConfirmResetPassword, SchemaCreatePassword, SchemaResetPassword } from '../schemas/schemas-authentication';
import { CheckPasswordUrl, CreatePasswordUrl, ResetPasswordConfirmUrl, ResetPasswordUrl } from '../userControl/userConfig';
import { SchemaLogin } from '@/NoDomain/schemas/schemas-authentication';
import { LoginUrl } from '@/NoDomain/configDom';
import { protocol } from '@/config';

export const ActionLogin = async (loginData: unknown) => {

    var config = {}
    const result = SchemaLogin.safeParse(loginData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: protocol + LoginUrl,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: config
    })

    if (response) {
        if (response?.data) {
            if (response?.data.access) {
                const token = jwtDecode(response.data.access)
                const session = await getSession()
                session.user_id = token.user_id
                session.username = token.username
                session.role = token.role
                session.is_superuser = token.is_superuser
                session.dept = token.dept
                session.school = token.school
                session.exp = new Date(token.exp * 1000)
                session.created_at = new Date(token.iat * 1000)
                session.isLoggedIn = true
                session.access = response.data.access
                session.refresh = response.data.refresh
                await session.save();
                return session
            }
            if (response.data.detail){
                return { detail: response.data.detail }
            } 
            if (response?.data.error) {
                return { error: response.data.error }
            }           
        }
        return response;
    }
    return { detail: "SERVER ERROR"}

}

export const ActionLogout = async () => {
    const session = await getSession()
    session.user_id = 0
    session.username = ''
    session.role = ''
    session.dept = []
    session.is_superuser = false
    session.isLoggedIn = false
    session.exp = new Date()
    session.created_at = new Date()
    await session.save();
    return session;
}

export const ActionCheckUser = async (checkData: unknown) => {

    var config = {}
    const result = SchemaCheckUser.safeParse(checkData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: CheckPasswordUrl,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: config    
    })
    console.log(107, response)

    if (response) {
        if (response?.data) {
            return response.data
        }
        console.log("error")
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

export const ActionCreatePassword = async (loginData: unknown, id: string) => {

    const result = SchemaCreatePassword.safeParse(loginData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "put",
        url: `${CreatePasswordUrl}/${id}`,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: {}
    })


    if (response) {
        if (response?.data) {
            return response.data
        }
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

export const ActionResetPassword = async (emailData: unknown) => {

    const result = SchemaResetPassword.safeParse(emailData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: ResetPasswordUrl,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: {}
    })

    if (response) {
        if (response?.data) {
            return response.data
        }
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

export const ActionConfirmResetPassword = async (emailData: unknown) => {

    const result = SchemaConfirmResetPassword.safeParse(emailData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: ResetPasswordConfirmUrl,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: {}
    })

    if (response) {
        if (response?.data) {
            return response.data
        }
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

