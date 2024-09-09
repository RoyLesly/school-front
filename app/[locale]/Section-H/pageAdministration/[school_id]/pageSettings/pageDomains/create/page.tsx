import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { DomainUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { SchemaCreateEditDomain } from '@/NoDomain/schemas/schemas';
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
          pageName="Create Domain" 
          pageName1="Settings" 
          pageName2="Domains" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`} 
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains`} 
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
    "Domains-Create",
  description: "This is Domains Page",
};

const Create = ({ params }: any) => {



  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const d = formData.get("domain_name")

    const data = {
      domain_name: d ? d.toString().toUpperCase() : d,
    }
    const response = await ActionCreate(data, SchemaCreateEditDomain, protocol + DomainUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains`)

    if (response.error) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/create?error=${JSON.stringify(response.error)}` )
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/create?error=${JSON.stringify(response.detail)}` )
    }
    if (response?.id) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?created=Successfully-Created-${JSON.stringify(response.domain_name).replaceAll(" ", "-")}`)
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
                    Domain Name
                  </label>
                  <input
                    type="text"
                    name="domain_name"
                    placeholder="Enter Domain Name"
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