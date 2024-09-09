import { LevelUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/section-s/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { SchemaCreateEditLevel } from '@/NoDomain/Utils-S/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { LEVEL_CHOICES } from '@/NoDomain/Utils-S/data';
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
          pageName="Create Level"
          pageName1="Settings"
          pageName2="Levels"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels`}
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
    "Levels-Create",
  description: "This is levels Page",
};


const Create = async ({ params }: any) => {


  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    var option = formData.get("option")

    const data = {
      level: formData.get("level"),
      option: option ? option?.toString().toUpperCase() : ""
    }

    const response = await ActionCreate(data, SchemaCreateEditLevel, protocol + LevelUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels`)
    
    // console.log(response)
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
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels?created=Successfully-Created-${JSON.stringify(response.level).replaceAll(" ", "-")}`)
    }
    if (response) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response).replaceAll(" ", "-")}`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
        

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Level
                  </label>
                  <select
                    className='border px-4 py-2 rounded w-full'
                    name="level"
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
                    placeholder="Enter Option"
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
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
