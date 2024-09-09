import { Metadata } from 'next'
import React, { FC } from 'react'
import { getData } from '@/functions'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import { GetCustomUserUrl } from '@/Domain/Utils-S/userControl/userConfig'
import { GetCustomUserInter } from '@/Domain/Utils-S/userControl/userInter'
import NotificationError from '@/section-s/common/NotificationError';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import MyButtonCustom from '@/section-s/common/MyButtonCustom';
import Notification from '@/section-s/common/Notification';
import MyPagination from '@/section-s/common/Pagination/MyPagination';
import { protocol } from '@/config';

const StudentList = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiDataAdmin: any[] | any = await getData(
    protocol + GetCustomUserUrl, {...searchParams, role: "admin", is_staff: false, school__id: params.school_id},
  );
  const apiDataLect: any[] | any = await getData(
    protocol + GetCustomUserUrl, {...searchParams, role: "teacher", is_staff: false, school__id: params.school_id},
  );

  console.log(apiDataLect, 31)

  return (
    <LayoutAdmin>
      <div className='flex flex-col gap-6 md:gap-16'>
        <Breadcrumb
          pageName="Admin & Lecturer List"
          pageName1="Dashboard"
          link1={`/Section-S/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiDataAdmin && <ListAdmin apiDataAdmin={apiDataAdmin} searchParams={searchParams} params={params} />}

        {apiDataLect && <List apiDataLect={apiDataLect} searchParams={searchParams} params={params} />}

      </div>
    </LayoutAdmin>
  )
}

export default StudentList

export const metadata: Metadata = {
  title:
    "Lecturer List",
  description: "This is Lecturer List Page",
};


const List = ({ apiDataLect, searchParams, params }: any) => {

  return (
    <div className="bg-white border-4 border-stroke dark:bg-slate-900 dark:border-strokedark p-2 rounded-sm shadow-default">
      <Notification searchParams={searchParams} />
      <div className="flex justify-between md:px-6 px-2 py-2">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Lecturer ({apiDataLect?.count})
        </h4>

        <SearchUserProfile params={params} role="teacher" />

      </div>

      <div className="bg-bluedark dark:border-strokedark grid grid-cols-3 md:grid-cols-5 px-2 py-1 text-lg text-white tracking-wider">
        <div className="flex items-center justify-between md:mx-4 mx-2">
          <p className="font-medium">Username</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Full Name</p>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <p className="font-medium">Telephone</p>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <p className="font-medium">Title</p>
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiDataLect.results && apiDataLect.results.length > 0 && apiDataLect.results.map((item: GetCustomUserInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-3 md:grid-cols-5 md:px-4 odd:bg-slate-50 odd:dark:bg-slate-800 px-3 py-1"
          key={key}
        >
          <div className="flex items-center justify-between lg:mr-4 mx-2">
            <p className="dark:text-white text-black">
              {item.matricle}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.full_name}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white text-black">
              {item?.telephone}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="dark:text-white items-center text-black">
              {item?.title}
            </span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center text-sm">
            <button>
              <MyButtonCustom
                title='View'
                type='view'
                href={`/Section-S/pageAdministration/pageLecturers/details/${item.id}`}
              />
            </button>
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiDataLect.previous}
        nextLink={apiDataLect.next}
        count={apiDataLect.count}
        thisUrl={`/Section-S/pageAdministration/${params.school_id}/pageLecturers?user__role=student`}
      />

    </div>
  )
}



const SearchUserProfile = ({ params, role }: any) => {
  const onSearchUserProfileServerAction = async (formData: FormData) => {
    'use server'

    const value = formData.get("value")

    if (value && value.toString().length > 1) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageLecturers?full_name=${value}`)
    }
    redirect(`/Section-S/pageAdministration/${params.school_id}/pageLecturers`)

  }
  return (
    <>

      <form action={onSearchUserProfileServerAction} className='flex flex-row gap-2 text-black'>
        <input name='value' placeholder='Search By Name ...' className='border-2 border-slate-700 flex px-4 py-1 rounded text-black w-72' />
        <button type='submit' className='flex items-center justify-center ml-2'><RiSearch2Fill size={23} /></button>
      </form>
    </>
  )
}


const ListAdmin = ({ apiDataAdmin, searchParams, params }: any) => {

  return (
    <div className="bg-white border-4 border-stroke dark:bg-slate-900 dark:border-strokedark p-2 rounded-sm shadow-default">
      <NotificationError errorMessage={searchParams} />
      <div className="flex justify-between md:px-6 px-2 py-2">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Admin ({apiDataAdmin?.count})
        </h4>

        <SearchUserProfile params={params}  role="admin" />

        <MyButtonCustom
          title={`+ Add Admin`}
          type='add'
          href={`/Section-S/pageAdministration/${params.school_id}/pageUsers/pageAddAdminUser`}
        />
      </div>
      
      <div className="bg-greendark dark:border-strokedark grid grid-cols-3 md:grid-cols-5 px-2 py-1 text-lg text-white tracking-wider">

        <div className="flex items-center justify-between md:mx-4">
          <p className="font-medium">Username</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Full Name</p>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <p className="font-medium">Telephone</p>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <p className="font-medium">Title</p>
        </div>
        <div className="flex items-center justify-center">
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiDataAdmin.results && apiDataAdmin.results.length > 0 && apiDataAdmin.results.filter((a: GetCustomUserInter) => !a.is_staff).map((item: GetCustomUserInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-3 md:grid-cols-5 md:px-4 odd:bg-slate-50 odd:dark:bg-slate-800 px-3 py-1"
          key={key}
        >
          <div className="flex items-center justify-between lg:mr-4 mx-2">
            <p className="dark:text-white text-black">
              {item.matricle}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.full_name}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white text-black">
              {item?.telephone}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white items-center text-black">
              {item?.title}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center text-sm">
            <button>
              <MyButtonCustom
                title='View'
                type='add'
                href={`/Section-S/pageAdministration/pageLecturers/details/${item.id}`}
              />
            </button>
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiDataAdmin.previous}
        nextLink={apiDataAdmin.next}
        count={apiDataAdmin.count}
        thisUrl={"/Section-S/pageAdministration/pageLecturers?user__role=teacher"}
      />

    </div>
  )
}