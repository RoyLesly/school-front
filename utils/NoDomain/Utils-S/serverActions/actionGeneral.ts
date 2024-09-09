import { axiosRequest } from "@/functions";
import { revalidatePath } from "next/cache";
import { getSession } from "./sessionAction";
import useAxios from "@/useAxios";
import { jwtDecode } from "jwt-decode";



export const ActionCreate = async (data: unknown, schema: any, url: string, revalUrl?: string) => {

    const session = await getSession()
    var created_by_id = null
    if (session){
        var t = jwtDecode(session.access)
        created_by_id = t.user_id
    }
    var config = {}

    const result = schema.safeParse(data);
    if (!result.success) {
        let errorMessage: any = {};

        result.error.issues.forEach((issue: any) => {
            errorMessage[issue.path[0]] = issue.message;
        });

        return { error: errorMessage }
    }
    if (session.access && session.access.length > 10) {
        config = { headers: { Authorization: `Bearer ${session.access}`}}
    }

    console.log(result, 33)
    console.log(result, 33)

    const response = await axiosRequest<any>({
        method: "post",
        url: url,
        payload: {
            ...result.data, created_by_id: created_by_id
        },
        params: "remove_payload",
        token: config
    })

    if (response) {
        if (response?.data.errors) {
            return { errors: response.data.errors };
        }
        if (response?.data.error?.toString().includes("[WinError]")) {
            return { Error: "Mail Error" };
        }
        if (response.data) {
            revalidatePath(`${revalUrl}`)
            return response.data
        }
    }

    return { detail: "SERVER ERROR"}
}


export const ActionEdit = async (data: unknown, id: number | string, schema: any, url: string, revalUrl?: string) => {
    
    const api = await useAxios();

    const session = await getSession()
    var config = {}
    if (session.access && session.access.length > 10) {
        config = { headers: { Authorization: `Bearer ${session.access}`}}
    }
    var updated_by_id = null
    if (session){
        var t = jwtDecode(session.access)
        updated_by_id = t.user_id
    }

    const result = schema.safeParse(data);

    if (!result.success) {
        let errorMessage: any = {};

        result.error.issues.forEach((issue: any) => {
            errorMessage[issue.path[0]] = issue.message;
        });

        return {
            error: errorMessage
        }
    }


    const response = await api.put(
        url + "/" + id,
        { ...result.data, updated_by_id: updated_by_id },
    )

    if (response) {
        if (response?.data.errors) {
            return { errors: response.data.errors };
        }
        if (response.data) {
            return response.data
        }
    }

    return { detail: "SERVER ERROR"}

}

export const DeleteAction = async (url:string, id: number | string) => {
    const session = await getSession()
    var config = {}
    if (session.access && session.access.length > 10) {
        config = { headers: { Authorization: `Bearer ${session.access}`}}
    }
    

    const response = await axiosRequest<any>({
        method: "delete",
        url: url  + "/" + id,
        params: "remove_payload",
        token: config
    })

    if (response?.data.error) {
        if (response.data.error.includes("Cannot delete")){ return { error: "Cannot Delete This Level" } }
        return { error: response.data.error}
    }
    if (response.data == '') {
        return { success: "DELETED" }
    }
    if (response.data) {
        return { error: response.data }
    }
   

    return { detail: "SERVER ERROR"}
}

