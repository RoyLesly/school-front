import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { FieldUrl, GetDomainUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateEditField } from '@/NoDomain/schemas/schemas';
import { DomainInter } from '@/NoDomain/Utils-H/appControl/appInter';
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
          pageName="Create Field"
          pageName1="Settings"
          pageName2="Fields"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields`}
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
    "Fields-Create",
  description: "This is Fields Page",
};

const Create = async ({ params }: any) => {

  const domainData: any = await getData(protocol + GetDomainUrl, {})

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const di = formData.get("domain_id")
    const fn = formData.get("field_name")

    const data = {
      domain_id: di ? di : 0,
      field_name: fn ? fn.toString().toUpperCase() : fn
    }
    const response = await ActionCreate(data, SchemaCreateEditField, protocol + FieldUrl)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields?created=Successfully-Created-${JSON.stringify(response.field_name).replaceAll(" ", "-")}`)
    }
  }


  return (
    <>
      {domainData == "ECONNREFUSED" && <ServerError />}

      {domainData && domainData != "ECONNREFUSED" && <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark roundedshadow-default">

        <div className='md:p-6 p-2'>
          <div className="gap-9 grid grid-cols-1">
            <div className="flex flex-col gap-9">
              {/* <!-- Input Fields --> */}
              <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

                <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                  <div>
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      Select Domain
                    </label>
                    <select
                      name="domain_id"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
                    >
                      <option value={0} key={0}>---------------------------</option>
                      {domainData && domainData.results.map((item: DomainInter) => (
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
                      placeholder="Enter Field Name"
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

      </div>}
    </>

  )
}