import { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import SessionExpired from '@/section-s/common/SessionExpired'
import { revalidatePath } from 'next/cache'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import { getSession } from '@/serverActions/sessionAction'
import NotLoggedIn from '@/section-s/common/NotLoggedIn'


interface PageProps {
  id: number
  title: string
  link: string
}
const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const session = await getSession();
  if (!session.isLoggedIn) {
    return <NotLoggedIn />
  }
  
  if (session.isLoggedIn){
    revalidatePath(`/Section-S/pageAdministration/${params.school_id}/pageStudents`)
  
    if (new Date(session.exp) < new Date()){
      return <SessionExpired />
    }

    const Pages: PageProps[] = [
      { id: 1, title: "Domains", link: `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDomains` },
      { id: 2, title: "Fields", link: `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageFields` },
      { id: 3, title: "Specialties", link: `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSpecialties` },
      { id: 4, title: "Specialty Titles", link: `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties` },
      { id: 5, title: "Courses", link: `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageCourses` },
      { id: 6, title: "Course Titles", link: `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainCourses` },
    ]
  
    return (
      <LayoutAdmin>
        <>
          <Breadcrumb
            pageName="Settings" 
            pageName1="Dashboard" 
            link1="/pageAdministration" 
          />

          <div className='gap-4 grid grid-cols-2 h-full md:gap-10 md:grid-cols-3 md:p-6'>
            {
              Pages.map((item: PageProps) => (
                <div key={item.id} className='border-2 cursor-pointer flex hover:bg-teal-400 hover:text-white items-center justify-center md:font-bold text-center text-lg w-full'>
                  <Link className="md:py-40 md:text-4xl py-10" href={item.link}>{item.title}</Link>
                </div>
              ))
            }          
          </div>
        </>
      </LayoutAdmin>
    )
  }
}

export default page

export const metadata: Metadata = {
  title:
    "Settings",
  description: "This is Settings Page",
};