import { Metadata } from 'next'
import React from 'react'
import MyPagination from '@/section-s/common/Pagination/MyPagination'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { CustomUserInter } from '@/Domain/Utils-S/userControl/userInter'
import { GetCustomUserUrl } from '@/Domain/Utils-S/userControl/userConfig'
import { getData } from '@/functions'
import { redirect } from 'next/navigation'
import Notification from '@/section-s/common/Notification'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'
import Link from 'next/link'
import { FiRefreshCw } from "react-icons/fi";
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: CustomUserInter[] | any = await getData(protocol + GetCustomUserUrl, {...searchParams, role: "student", is_superuser: false});

  return (
    <LayoutAdmin>
      <>
      <Breadcrumb
          pageName="Students - Users" 
          pageName1="Dashboard" 
          pageName2="Users" 
          link1="/pageAdministration" 
          link2="/pageAdministration/pageUsers" 
        />

        <List apiData={apiData} searchParams={searchParams} school_id={params.school_id} />

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Users",
  description: "This is Users Page",
};



const List = ( { apiData, searchParams, school_id }: any ) => {
  console.log(searchParams)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <Notification searchParams={searchParams} />
      <div className="flex gap-2 justify-between md:px-3 md:py-3 px-2 py-1 xl:px-7.5">
        <h4 className="dark:text-white flex font-semibold text-black text-xl">
          List ({apiData.count})
        </h4>

        <SearchUser school_id={school_id} />

        <div className='flex flex-row gap-2'>
          <button className='bg-bluelight font-medium px-6 py-1 rounded text-black text-lg'><Link href={`/Section-S/pageAdministration/${school_id}/pageUsers`}>Lecturers</Link></button>
          <button className='bg-bluelight font-medium px-6 py-1 rounded text-black text-lg'><Link href={`/Section-S/pageAdministration/${school_id}/pageUsers/pageAdminUsers`}>Admins</Link></button>
        </div>

      </div>

      <div className="bg-bluedark dark:border-strokedark grid grid-cols-4 md:grid-cols-10 p-2 px-4 text-lg text-white tracking-wider">
        <div className="flex items-center">
          <p className="font-medium">Username</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Full Name</p>
        </div>
        <div className="hidden items-center md:flex">
          <p className="font-medium">Role</p>
        </div>
        <div className="hidden items-center md:flex">
          <p className="font-medium">Password</p>
        </div>
        <div className="col-span-2 hidden items-center md:flex">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-2 hidden items-center md:flex text-center">
          <p className="font-medium">Login / Active</p>
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: CustomUserInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-4 md:grid-cols-10 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 py-1 text-back"
          key={key}
        >
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.matricle}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="dark:text-white text-black">
              {item.full_name}
            </p>
          </div>
          <div className="hidden items-center md:flex">
            <p className="dark:text-white text-black">
              {item.role} 
            </p>
          </div>
          <div className="hidden items-center md:flex">
            <p className="dark:text-white items-center text-black">
              {item.password_set ? <span>OK</span> : <span>-</span>} 
            </p>
          </div>
          <div className="col-span-2 hidden items-center md:flex text-center">
            <p className="dark:text-black tracking-wider">
              {item.email ? 
                item.email_confirmed ?
                  <span className='bg-notigreen dark:bg-greenlight md:px-2 px-2 py-1 rounded text-black w-full'>{item.email}</span> 
                  :
                  <span className='bg-notired md:px-2 px-2 py-1 rounded text-black w-full'>{item.email}</span>
                :
                <span className='dark:text-white md:px-2 px-2 rounded w-full'>-</span>
              }
            </p>
          </div>
          <div className="col-span-2 hidden items-center justify-left md:flex text-black text-center w-full">
              {item.is_active ? 
                item.last_login ? 
                  <span className='bg-greenlight md:px-2 px-2 py-1 rounded w-full'>{item.last_login?.slice(0, 10) + " " + item.last_login?.slice(11, 16)}</span> 
                  : 
                  <span className='md:px-2 px-2 py-1 w-full'>-</span> 
                :
                item.last_login ? 
                  <span className='bg-notired md:px-2 px-2 py-1 rounded w-full'>{item.last_login?.slice(0, 10) + " " + item.last_login?.slice(11, 16)}</span> 
                  : 
                  <span className='md:px-2 px-2 py-1 w-full'>-</span> 
              }
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md">
          <MyButtonCustom
            title='View'
            href={`/Section-S/pageAdministration/${school_id}/pageUsers/details/${item.id}`}
            type="view"
          />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-S/pageAdministration/${school_id}/pageUsers/pageStutsUsers`}
      />
    
    </div>
  )
}


const SearchUser = ({ school_id }: any) => {
  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'
    const full_name = formData.get("full_name")

    if (full_name) {
        redirect(`/pageAdministration/${school_id}/pageUsers/pageStutsUsers?full_name=${full_name}`)
    }

  }
  return (
      <>

          <form action={onSearchDrugServerAction} className='flex flex-row gap-1'>
              <input name='full_name' placeholder='Search By Full Name ...' className='border-2 border-slate-700 flex md:px-2 md:w-72 px-2 rounded w-48' />
              <Link className='flex items-center justify-center' href={`/pageAdministration/${school_id}/pageUsers/pageStutsUsers`}><FiRefreshCw size={23} /></Link>
          </form>

      </>
  )
}