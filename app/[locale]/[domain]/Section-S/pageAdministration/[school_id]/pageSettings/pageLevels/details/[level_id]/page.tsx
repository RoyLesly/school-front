import { GetLevelUrl, LevelUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { GetLevelInter, LevelInter } from '@/Domain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-s/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaCreateEditLevel } from '@/Domain/Utils-S/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { LEVEL_CHOICES } from '@/Domain/Utils-S/data';
import { protocol } from '@/config';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, level_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: LevelInter | any = await getData( protocol  + "api" + params.domain + GetLevelUrl, { id: params.level_id });
  console.log(apiData, 26)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Level"
          pageName1="Settings"
          pageName2="Levels"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels`}
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}

        {apiData.count && <EditDelete apiData={apiData.results[0]} params={params} />}
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
  apiData: GetLevelInter
  params: any
}

const EditDelete: FC<EditDeleteProps> = ({ apiData, params }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    var option = formData.get("option")

    const data = {
      level_id: params.level_id,
      level: formData.get("level"),
      option: option ? option?.toString().toUpperCase() : ""
    }

    const response = await ActionEdit(data, params.level_id, SchemaCreateEditLevel, LevelUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels`)

    if (response.error) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response.errors) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels?updated=Successfully-Updated-${JSON.stringify(response.level).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(LevelUrl, params.level_id)

    if (response?.error) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${params.level_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${params.level_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels?deleted=Successfuly-Deleted-!!!`)
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
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Level
                  </label>
                  <select
                    className='border px-4 py-2 rounded w-full'
                    name="level"
                    defaultValue={apiData.level}
                  >
                    <option value={""}>-------------</option>
                    {LEVEL_CHOICES.map((item: string) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Option
                  </label>
                  <input
                    type="text"
                    name="option"
                    defaultValue={apiData.option}
                    placeholder="Enter Option"
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