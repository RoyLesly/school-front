import React from 'react'
import { getDataNotProtected } from '@/functions';
import { protocol } from '@/config';
import { Metadata } from 'next';
import { GetSchoolIdentificationInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetSchoolIdentificationUrl } from '@/Domain/Utils-H/appControl/appConfig';
import NotificationError from '@/section-h/common/NotificationError';
import PreForm from './New/PreForm';
import PreInsNavBar from './PreInsNavBar';

const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string, domain: string, registration_number: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiSchool: GetSchoolIdentificationInter[] | any = await getDataNotProtected(protocol + "api" + params.domain + GetSchoolIdentificationUrl, { nopage: true, name: params.domain })
 
  return (
    <>
      {searchParams && <NotificationError errorMessage={searchParams} />}

      {apiSchool && apiSchool.length ?
          <div className="flex flex-col gap-4 h-screen md:p-4 p-2 text-slate-900">
            <PreInsNavBar params={params} searchParams={searchParams} page={1} school_identification={apiSchool[0]} />

            <div className='flex flex-col gap-2 w-full'>
              <h1 className='flex item-center justify-center'>PRE-INSCRIPTION STATUS</h1>

              <PreForm params={params} data={apiSchool[0]} />

            </div>
          </div>        :
        <div>School Identification</div>
      }
    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "New Pre-Inscription Page",
  description: "New Pre-Inscription Page",
};
