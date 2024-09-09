import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { jwtDecode } from 'jwt-decode'
import { getSession } from './serverActions/sessionAction';
import { CustomAxiosError } from './serverActions/interfaces';
import { RefreshTokenUrl } from './NoDomain/configDom';


const useAxios = async () => {

    const session = await getSession()

    const axiosInstance = axios.create({
        baseURL: "",
        headers: { Authorization: `Bearer ${session?.access}`}
    })

    axiosInstance.interceptors.request.use( async req => {
        const access = jwtDecode(session.access)
        const isExpired = (new Date().toISOString().slice(0, 16) > new Date(access.exp * 1000).toISOString().slice(0, 16))

        if (!isExpired) { return req }

        console.log(24, session)


        const response = await axios.post(RefreshTokenUrl, {
            refresh: session.refresh
        }).catch(
            (e: CustomAxiosError) => {
                // window.location.href = "/"
                console.log(32, e)
                return e.response
            }
        ) as AxiosResponse

        console.log(35, response)

        if (response.statusText == "Unauthorized") {
            return response.data
            console.log(response.statusText); console.log(response.statusText);
        }
        const token = jwtDecode(response.data.access)
        if (token) {
            const token = jwtDecode(response.data.access)
            const session = await getSession()
            session.user_id = token.user_id
            session.username = token.username
            session.role = token.role
            session.is_superuser = token.is_superuser
            session.dept = token.dept
            session.page = token.page
            session.school = token.school
            session.exp = new Date(token.exp * 1000)
            session.created_at = new Date(token.iat * 1000)
            session.isLoggedIn = true
            session.access = response.data.access
            session.refresh = response.data.refresh
            console.log(session)
            await session.save();
            return session
        }

        req.headers.Authorization = `Bearer ${response.data.access}`

        return req
    })


    axiosInstance.interceptors.response.use( async res => {
        return res
    })

    return axiosInstance
}

export default useAxios