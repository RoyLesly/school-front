import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { FieldUrl, GetDomainUrl, GetFieldUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { SchemaCreateEditField } from '@/NoDomain/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { FieldInter, GetDomainInter, GetFieldInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, field_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: FieldInter | any = await getData(`${protocol + GetFieldUrl}/${params.field_id}`, { ...searchParams, fieldList: [ "id", "field_name", "domain__id"] });
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Field"
          pageName1="Settings"
          pageName2="Fields"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}

        { apiData && apiData != "ECONNREFUSED" && <EditDelete apiData={apiData} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Fields-Edit",
    description: "This is Fields Page",
};


interface EditDeleteProps {
  apiData: GetFieldInter
  params: any
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params }) => {

  const domainData: any = await getData(protocol + GetDomainUrl, {})

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const di = formData.get("domain_id")
    const fn = formData.get("field_name")

    const data = {
      domain_id: di ? di : 0,
      field_name: fn ? fn.toString().toUpperCase() : fn,
    }
    const response = await ActionEdit(data, params.field_id, SchemaCreateEditField, protocol + FieldUrl, `pageAdministration/${params.school_id}/pageSettings/pageFields`)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/details/${params.field_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/details/${params.field_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/details/${params.field_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields?updated=Successfully-Updated-${JSON.stringify(response.field_name).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(protocol + FieldUrl, params.field_id)

    if (response?.error) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageFields/${params.field_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageFields/${params.field_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageFields?deleted=Successfuly-Deleted-!!!`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              <div className="border-b border-stroke dark:border-strokedark flex justify-between px-5 py-3">
                <h3 className="dark:text-white font-medium text-black">
                  Editing ...  {apiData.field_name}
                </h3>
                <form action={onSubmitDeleteAction} className='flex'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Domain
                  </label>
                  <select
                    name="domain_id"
                    defaultValue={apiData.domain__id}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
                  >
                    <option value={0} key={0}>---------------------------</option>
                    {domainData && domainData.results.map((item: GetDomainInter) => (
                      <option key={item.id} value={item.id}>{item.domain_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Field Name
                  </label>
                  <input
                    type="text"
                    name="field_name"
                    placeholder={apiData.field_name}
                    defaultValue={apiData.field_name}
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