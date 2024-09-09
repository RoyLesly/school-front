import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { DomainUrl, GetDomainUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { DomainInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { SchemaCreateEditDomain } from '@/NoDomain/schemas/schemas';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, domain_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: DomainInter | any = await getData(protocol + GetDomainUrl, {id: params.domain_id, nopage: true});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Domain" 
          pageName1="Settings" 
          pageName2="Domains" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData == "ECONNREFUSED" && <ServerError />}

        {apiData != "ECONNREFUSED" && apiData.length > 0 && <EditDelete apiData={apiData[0]} params={params} />}        
        
      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Domains-Details",
  description: "This is Domains Page",
};


interface EditDeleteProps {
  apiData: DomainInter | any
  params: any
}

const EditDelete:FC<EditDeleteProps> = ( { apiData, params }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const d = formData.get("domain_name")

    const data = {
      domain_name: d ? d.toString().toUpperCase() : d,
    }
    const response = await ActionEdit(data, params.domain_id, SchemaCreateEditDomain, protocol + DomainUrl)

    if (response.error) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/details/${params.domain_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}` )
    }
    if (response?.errors) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/details/${params.domain_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}` )
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/details/${params.domain_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}` )
    }
    if (response?.id) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?updated=Successfully-Updated-${JSON.stringify(response.domain_name).replaceAll(" ", "-")}`)
     }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(DomainUrl, params.domain_id)

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/${params.domain_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/${params.domain_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?deleted=Successfuly-Deleted-!!!`)
      }
    }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
            <div className="border-b border-stroke dark:border-strokedark flex justify-between px-6.5 py-4">
                <h3 className="dark:text-white font-medium text-black">
                  Editing ...  {apiData.domain_name}
                </h3>
                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    name="domain_name"
                    placeholder={apiData.domain_name}
                    defaultValue={apiData.domain_name}
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