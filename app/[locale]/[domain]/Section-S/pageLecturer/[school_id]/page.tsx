import { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { getData } from '@/functions'
import { GetSchoolInfoInter } from '@/Domain/Utils-H/appControl/appInter'
import { GetSchoolInfoUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { getSession } from '@/serverActions/sessionAction'
import Image from 'next/image'
import { ConfigData, protocol } from '@/config'
import NotLoggedIn from '@/section-s/common/NotLoggedIn'
import SessionExpired from '@/section-s/common/SessionExpired'


interface PageProps {
  id: number
  title: string
  link: string
}
const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const session = await getSession();
  const apiSchool: GetSchoolInfoInter[] | any = await getData(protocol + GetSchoolInfoUrl, { nopage: true, id: params.school_id })
  console.log(apiSchool)

  if (!session.isLoggedIn) {
    return <NotLoggedIn />
  }

  if (session.isLoggedIn) {
    revalidatePath("/Section-S/pageAdministration")

    if (new Date(session.exp) < new Date()) {
      return <SessionExpired />
    }

    return (

      <>
        {apiSchool && apiSchool.length == 1 &&
          <div className='flex flex-col gap-20 h-screen items-center justify-center px-10 tracking-widest'>
            <div className="hidden md:flex">
              <Image
                width={200}
                height={200}
                src={ConfigData.Logo.lg512.h}
                alt="Logo"
                style={{ borderRadius: 150 }}
                priority
              />
            </div>

            <div className="flex md:hidden">
              <Image
                width={130}
                height={130}
                src={ConfigData.Logo.sm256.h}
                alt="Logo"
                style={{ borderRadius: 150 }}
                priority
              />
            </div>
            <div className='flex flex-col font-bold gap-10 items-center justify-center md:text-4xl text-2xl'>
              <div>WELCOME TO</div>
              <div className='flex text-center' >{apiSchool[0].school_name}</div>
            </div>
            <Link href={`/Section-S/pageLecturer/${params.school_id}/pageDashboard`} className="bg-bluedark font-medium px-10 py-2 rounded text-white text-xl">Continue</Link>
          </div>
        }
      </>

    )
  }
}

export default page

export const metadata: Metadata = {
  title:
    "Admin-Page",
};