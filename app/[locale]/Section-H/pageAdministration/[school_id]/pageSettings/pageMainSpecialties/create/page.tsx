import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { GetFieldUrl, MainSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateEditMainSpecialty } from '@/NoDomain/schemas/schemas';
import { FieldInter } from '@/NoDomain/Utils-H/appControl/appInter';
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
          pageName="Create Specialty Title" 
          pageName1="Settings" 
          pageName2="Specialty" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`}
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
    "Specialty-Create",
  description: "This is Specialty Page",
};

const Create = async ({ params }: any) => {
  const fieldData = await getData(protocol + GetFieldUrl, {})

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const specialty_name = formData.get("specialty_name")
    const field_id = formData.get("field_id")
    const data = {
      specialty_name: specialty_name ? specialty_name?.toString().toUpperCase() : "",
      field_id: field_id ? field_id : 0,
    }
    const response = await ActionCreate(data, SchemaCreateEditMainSpecialty, protocol + MainSpecialtyUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`)

    if (response.error) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/create?error=${response.error.replaceAll(" ", "-")}` )
    }
    if (response.errors) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/create?error=${response.errors.replaceAll(" ", "-")}` )
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/create?error=${response.detail.replaceAll(" ", "-")}` )
    }
    if (response?.id) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties?created=Successfully-Created-${JSON.stringify(response.specialty_name)}`)
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
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Specialty Name
                  </label>
                  <input
                    type="text"
                    name="specialty_name"
                    placeholder="Enter Specialty Name"
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 md:mt-4 mt-2 text-black text-sm">
                    Select Field
                  </label>
                  <select
                    name="field_id"
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  >
                    <option value="">-----------</option>
                    {fieldData && fieldData.count && fieldData.results.map((item: FieldInter) => (
                      <option key={item.id} value={item.id}>{item.field_name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-10 px-5 py-2.5 rounded text-center text-lg text-white tracking-widest w-full">Save</button>

              </form>

            </div>


          </div>
        </div>
      </div>
    
    </div>
  )
}