import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { GetFieldUrl, GetMainSpecialtyUrl, MainSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { SchemaCreateEditMainSpecialty } from '@/NoDomain/schemas/schemas';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { GetFieldInter, GetMainSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, main_specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(`${protocol + GetMainSpecialtyUrl}/${params.main_specialty_id}`, { fieldList: [ "id", "field__id", "specialty_name" ]});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Specialty" 
          pageName1="Settings" 
          pageName2="Specialties" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData == "ECONNREFUSED" && <ServerError />}

        {apiData != "ECONNREFUSED" && <EditDelete apiData={apiData} params={params} />}        

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Specialty-Edit",
  description: "This is Specialty Page",
};


interface EditDeleteProps {
  apiData: GetMainSpecialtyInter
  params: any
}

const EditDelete:FC<EditDeleteProps> = async ( { apiData, params }) => {
  const fieldData = await getData(protocol + GetFieldUrl, {})

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const sn = formData.get("specialty_name")
    const fi = formData.get("field_id")

    const data = {
      specialty_name: sn ? sn.toString().toUpperCase() : sn,
      field_id: fi ? fi : 0,
    }
    const response = await ActionEdit(data, params.main_specialty_id, SchemaCreateEditMainSpecialty, protocol + MainSpecialtyUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`)

    if (response.error) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/details/${params.main_specialty_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}` )
    }
    if (response?.errors) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/details/${params.main_specialty_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}` )
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/details/${params.main_specialty_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}` )
    }
    if (response?.id) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties?updated=Successfully-Updated-${JSON.stringify(response.specialty_name).replaceAll(" ", "-")}`)
     }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              <div className="border-b border-stroke dark:border-strokedark px-6.5 py-4">
                <h3 className="dark:text-white font-medium text-black">
                  Editing ...  {apiData.specialty_name}
                </h3>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Specialty Name
                  </label>
                  <input
                    type="text"
                    name="specialty_name"
                    placeholder={apiData.specialty_name}
                    defaultValue={apiData.specialty_name}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Field
                  </label>
                  <select
                    defaultValue={apiData.field__id}
                    name='field_id'
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                      true ? "text-black dark:text-white" : ""
                    }`}
                  >
                    {fieldData && fieldData.count && fieldData.results.map((item: GetFieldInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.field_name}
                      </option>)
                    )}
                    
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