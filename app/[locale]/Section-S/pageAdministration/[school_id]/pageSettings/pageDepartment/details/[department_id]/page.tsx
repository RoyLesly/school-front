import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-s/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaCreateEditDepartment } from '@/NoDomain/Utils-S/schemas/schemas';
import { ActionEdit, DeleteAction } from '@/serverActions/actionGeneral';
import { DepartmentUrl, GetDepartmentUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { GetDepartmentInter } from '@/NoDomain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { DEPARTMENT_CHOICES } from '@/NoDomain/Utils-S/data';
import { protocol } from '@/config';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, department_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: GetDepartmentInter | any = await getData(protocol + GetDepartmentUrl, { id: params.department_id, nopage: true });
  console.log(apiData, 26)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Department"
          pageName1="Settings"
          pageName2="Levels"
          link2={`/pageAdministration/${params.school_id}/pageSettings/pageDepartment`}
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}

        {apiData && <EditDelete apiData={apiData[0]} params={params} />}
      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Level-Edit",
  description: "This is Level Page",
};


interface EditDeleteProps {
  apiData: GetDepartmentInter
  params: any
}

const EditDelete: FC<EditDeleteProps> = ({ apiData, params }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const data = {
      name: formData.get("name"),
    }

    const response = await ActionEdit(data, params.department_id, SchemaCreateEditDepartment, DepartmentUrl, `/pageAdministration/${params.school_id}/pageSettings/pageDepartment`)

    if (response.error) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response.errors) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment?updated=Successfully-Updated-${JSON.stringify(response.name).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await DeleteAction(DepartmentUrl, params.level_id)

    if (response?.error) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment/details/${params.level_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment/details/${params.level_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageDepartment?deleted=Successfuly-Deleted-!!!`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              <div className="border-b border-stroke dark:border-strokedark flex justify-between px-4 py-2">
                <div className="dark:text-white flex font-medium items-center text-black">
                  Editing ...  <b>{apiData.name}</b>
                </div>
                <form action={onSubmitDeleteAction} className='flex'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Department Name
                  </label>
                  <select
                    className='border px-4 py-2 rounded w-full'
                    name="name"
                    defaultValue={apiData.name}
                  >
                    <option value={""}>-------------</option>
                    {DEPARTMENT_CHOICES.map((item: string) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

             
                <div className='flex items-end justify-end'>
                  <MyButtonSubmitEdit />
                </div>
              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}