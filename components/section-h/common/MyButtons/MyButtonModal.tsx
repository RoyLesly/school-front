import React from 'react'
import MyButtonLoading from '../MyButtons/MyButtonLoading'

const MyButtonModal = ({ type, clicked }: { type: string, clicked: boolean }) => {

    return <>
        {clicked ?
        <button className={`p-2 rounded-md text-white flex items-center justify-center`}>
            <span className={`${type == "create" ? "border-green-500" : type == "update" ? "border-bluedash" : "border-redlight"} animate-spin border-6  border-t-transparent flex h-[34px]  rounded-full w-[34px]`}>.</span>
        </button>

            :
            <button className={`${type == "create" ? "bg-green-400" : type == "update" ? "bg-blue-400" : "bg-redlight"} p-2 rounded-md text-white`}>
                {type === "create" ? "Create" : type === "update" ? "Update" : type === "delete" ? "Delete" : type}
            </button>
        }
    </>


}

export default MyButtonModal