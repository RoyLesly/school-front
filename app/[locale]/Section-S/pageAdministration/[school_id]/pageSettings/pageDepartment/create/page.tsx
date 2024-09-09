import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/section-s/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { SchemaCreateEditDepartment } from '@/NoDomain/Utils-S/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { DepartmentUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { DEPARTMENT_CHOICES } from '@/NoDomain/Utils-S/data';
import { protocol } from '@/config';

const CreatePage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName="Create Department"
                    pageName1="Settings"
                    pageName2="Department"
                    link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
                    link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment`}
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}
                <Create params={params} />
            </>
        </LayoutAdmin>
    )
}

export default CreatePage



export const metadata: Metadata = {
    title:
        "Department-Create",
    description: "This is Department Page",
};


const Create = async ({ params }: any) => {


    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        const data = {
            name: formData.get("name"),
        }

        const response = await ActionCreate(data, SchemaCreateEditDepartment, protocol + DepartmentUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment`)

        if (response.error) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
        }
        if (response.errors) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
        }
        if (response?.detail) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
        }
        if (response?.id) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment?created=Successfully-Created-${JSON.stringify(response.name).replaceAll(" ", "-")}`)
        }
        if (response) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response).replaceAll(" ", "-")}`)
        }
    }

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

            <div className='md:p-6 p-2'>
                <div className="gap-9 grid grid-cols-1">
                    <div className="flex flex-col gap-9">
                        {/* <!-- Input Fields --> */}
                        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">


                            <form className="flex flex-col gap-5.5 p-6.5 text-lg" action={onSubmitServerAction}>

                                <div>
                                    <label className="block dark:text-white font-medium mb-3 text-black">
                                        Department Name
                                    </label>
                                    <select
                                        className='border px-4 py-2 rounded w-full'
                                        name="name"
                                    >
                                        <option value={""}>-------------</option>
                                        {DEPARTMENT_CHOICES.map((item: string) => <option key={item} value={item}>{item}</option>)}
                                    </select>
                                </div>

                                <div className='flex items-end justify-end'>
                                    <MyButtonSubmitCreate />
                                </div>
                            </form>

                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}
