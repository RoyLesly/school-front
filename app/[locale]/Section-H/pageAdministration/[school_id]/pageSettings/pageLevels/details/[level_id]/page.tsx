import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { GetLevelUrl, LevelUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { LevelInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { SchemaCreateEditLevel } from '@/NoDomain/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, level_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: LevelInter | any = await getData(`${protocol + GetLevelUrl}/${params.level_id}`, {});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Level" 
          pageName1="Settings" 
          pageName2="Levels" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels`}
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}

          <EditDelete apiData={apiData} params={params} />
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
  apiData: LevelInter | any
  params: any
}

const EditDelete:FC<EditDeleteProps> = ( { apiData, params }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const data = {
      level_id: params.level_id,
      level: formData.get("level"),
    }
    const response = await ActionEdit(data, params.level_id, SchemaCreateEditLevel, protocol + LevelUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels`)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels?updated=Successfully-Updated-${JSON.stringify(response.level).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(LevelUrl, params.level_id)

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${params.level_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${params.level_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels?deleted=Successfuly-Deleted-!!!`)
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
                  Editing ...  <b>{apiData.level}</b>
                </div>
                <form action={onSubmitDeleteAction} className='flex'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Level
                  </label>
                  <input
                    type="number"
                    name="level"
                    placeholder={apiData.Level}
                    defaultValue={apiData.level}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
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