import React from 'react'
import PreInsNavBar from '../PreInsNavBar';
import { Metadata } from 'next';
import { getDataNotProtected } from '@/functions';
import { protocol } from '@/config';
import { GetSchoolIdentificationUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetSchoolIdentificationInter } from '@/Domain/Utils-H/appControl/appInter';
import NotificationError from '@/section-h/common/NotificationError';
import CheckForm from './CheckForm';


const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiSchool: GetSchoolIdentificationInter[] | any = await getDataNotProtected(protocol + "api" + params.domain + GetSchoolIdentificationUrl, { nopage: true, name: params.domain })

  return (
    <>
      {searchParams && <NotificationError errorMessage={searchParams} />}

      {apiSchool && apiSchool.length ? <div className="flex flex-col gap-4 h-screen md:p-4 p-2 text-slate-900 w-full">
        <PreInsNavBar params={params} searchParams={searchParams} page={2} school_identification={apiSchool[0]} />

        <div className='flex flex-col h-full items-center justify-center w-full'>
            <CheckForm params={params} />
        </div>
      </div>
        :
        <div>School Identification</div>
      }
    </>
  )
}

export default page

export const metadata: Metadata = {
  title: "Pre-Inscription Status Page",
  description: "Pre-Inscription Status Page",
};
