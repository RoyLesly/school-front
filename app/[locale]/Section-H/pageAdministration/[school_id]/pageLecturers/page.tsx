import { Metadata } from 'next'
import React, { FC } from 'react'
import { getData } from '@/functions'
import MyPagination from '@/NoDomain/section-h/common/Pagination/MyPagination'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { redirect } from 'next/navigation'
import MyButtonCustom from '@/NoDomain/section-h/common/MyButtonCustom'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import { protocol } from '@/config'
import { GetCustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig'
import { GetCustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter'

const StudentList = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiDataLect: any[] | any = await getData(
    protocol + GetCustomUserUrl,
    {...searchParams, role: "teacher", school__id: params.school_id, nopage: true, is_staff: false,
      fieldList: [ "id", "full_name", "matricle", "telephone", "title" ]
    },
  );
  const apiDataAdmin: any[] | any = await getData(
    protocol + GetCustomUserUrl,
    {...searchParams, role: "admin", school__id: params.school_id, nopage: true, is_staff: false,
      fieldList: [ "id", "full_name", "matricle", "telephone", "title" ]
    },
  );

  return (
    <LayoutAdmin>
      <div className='flex flex-col gap-6 md:gap-16'>
        <Breadcrumb
          pageName="Admin & Lecturer List"
          pageName1="Dashboard"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageDashboard`}
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

const SearchUserProfile = ({ params, role }: any) => {
  const onSearchUserProfileServerAction = async (formData: FormData) => {
    'use server'

    const value = formData.get("value")

    if (value && value.toString().length > 1) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageLecturers?full_name=${value}`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageLecturers`)

  }
  return (
    <>

      <form action={onSearchUserProfileServerAction} className='flex flex-row gap-2 text-black'>
        <input name='value' placeholder='Search By Name ...' className='border-2 border-slate-700 flex px-4 py-1 rounded text-black w-72' />
        <button type='submit' className='bg-blue-200 border flex font-medium items-center justify-center ml-2 px-2 py-1 rounded'> Search</button>
      </form>
    </>
  )
}


const ListAdmin = ({ apiDataAdmin, params }: any) => {

  return (
    <div className="bg-white border-4 border-stroke dark:bg-slate-900 dark:border-strokedark p-2 rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-2 py-2">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Admin ({apiDataAdmin?.length})
        </h4>

        <SearchUserProfile params={params}  role="admin" />

        <MyButtonCustom
          title={`+ Add Admin`}
          type='add'
          href={`/Section-H/pageAdministration/${params.school_id}/pageUsers/pageAddAdminUser`}
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
      {apiDataAdmin && apiDataAdmin.length > 0 && apiDataAdmin.filter((a: GetCustomUserInter) => !a.is_superuser).map((item: GetCustomUserInter, key: number) => (
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
              {item.telephone}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white items-center text-black">
              {item.title}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center text-sm">
            <button>
              {/* <MyButtonCustom
                title='View'
                type='add'
                href={`/Section-H/pageAdministration/pageLecturers/details/${item.id}`}
              /> */}
            </button>
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiDataAdmin.previous}
        nextLink={apiDataAdmin.next}
        count={apiDataAdmin.count}
        thisUrl={"/Section-H/pageAdministration/pageLecturers?user__role=teacher"}
      />

    </div>
  )
}



const List = ({ apiDataLect, searchParams, params }: any) => {

  return (
    <div className="bg-white border-4 border-stroke dark:bg-slate-900 dark:border-strokedark p-2 rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-2 py-2">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Lecturer ({apiDataLect?.length})
        </h4>

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
      {apiDataLect && apiDataLect.length > 0 && apiDataLect.map((item: GetCustomUserInter, key: number) => (
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
              {item.telephone}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="dark:text-white items-center text-black">
              {item.title}
            </span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center text-sm">
            <button>
              {/* <MyButtonCustom
                title='View'
                type='view'
                href={`/Section-H/pageAdministration/${params.school_id}/pageLecturers/details/${item.id}`}
              /> */}
            </button>
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiDataLect.previous}
        nextLink={apiDataLect.next}
        count={apiDataLect.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageStudents?user__role=student`}
      />

    </div>
  )
}
