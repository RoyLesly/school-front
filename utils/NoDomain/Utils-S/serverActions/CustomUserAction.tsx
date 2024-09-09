"use server";
import { axiosRequest } from '@/functions';
import { CustomUserUrl } from '../userControl/userConfig';

export const DeleteActionCustomUser = async (id: string) => {

    const response = await axiosRequest<any>({
        method: "delete",
        url: CustomUserUrl + "/" + id,
    })

    if (response.data) {
        return response.data
    }

    return { detail: "SERVER ERROR"}


}