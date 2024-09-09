import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'
import NotificationError from '@/section-s/common/NotificationError'
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter'
import Link from 'next/link'
import { protocol } from '@/config'

const StudentList = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const apiData: any[] | any = await getData(
    protocol + GetSecondaryProfileUrl,
    {...searchParams, user__role: "student", noclassroom: true, nopage: true, fieldList: [       
      "id", "user__matricle", "user__full_name", "user__telephone", "classroom__academic_year",
      "classroom__level__level", "classroom__level__option", "classroom__domain", "user__telephone",
  ] },
  );

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Un-Assigned Students List"
          pageName1="Dashboard"
          link1="/pageAdministration"
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.length > 0 ? <List apiData={apiData} searchParams={searchParams} params={params} /> 
        :
        <div className="flex flex-col font-semibold gap-10 items-center justify-center pb-32 pt-40 tracking-widest">
          <div className='italic text-2xl'>No Un-assigned Students</div>
          <Link href={`/pageAdministration/${params.school_id}/pageStudents/pageAdmission`} className='bg-bluedark px-6 py-1 rounded text-lg text-white'>New Student</Link>
        </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default StudentList

export const metadata: Metadata = {
  title:
    "Students List",
  description: "This is Students List Page",
};


const List = ({ apiData, params }: any) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex flex-col gap-2 justify-between md:flex-row md:px-6 px-4 py-6 xl:px-7.5">
        <span className="dark:text-white font-semibold text-black text-xl">
          Count ({apiData?.length})
        </span>

        <SearchUserProfile school_id={params.school_id} />

        <MyButtonCustom
          title={`+ Admit Student`}
          type="view"
          href={`/pageAdministration/${params.school_id}/pageStudents/pageAdmission`}
        />
      </div>

      <div 
        className="bg-bluedark grid grid-cols-3 md:grid-cols-6 px-4 py-2 text-lg text-white tracking-wide"
      >
        <div className="flex items-center justify-between lg:mx-4 mx-2">
          <p className="font-medium">Matricle</p>
          {/* <p className="font-medium">Username</p> */}
        </div>
        <div className="flex items-center">
          <p className="font-medium">Full Name</p>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <p className="font-medium">Telephone</p>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <p className="font-medium">Specialty</p>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <p className="font-medium">Academic year</p>
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData && apiData.map((item: GetSecondaryProfileInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-3 md:grid-cols-6 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 py-1 text-black"
          key={key}
        >
          <div className="flex items-center justify-between lg:mr-4 mx-2">
            <span className="dark:text-white text-black">
              {item.user__matricle}
            </span>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.user__full_name}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white text-black text-sm">
              {item.user__telephone}
            </p>
          </div>
          <div className="dark:text-white gap-2 hidden items-center justify-center md:flex w-full">
                <span className='flex'>{item.secondary_classroom__level__level}</span>
                <span className='flex'>{item.secondary_classroom__level__option}</span>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="dark:text-white items-center text-black text-sm">
              <span>{item.secondary_classroom__academic_year}</span>
            </span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center">
            <MyButtonCustom
              title='Assign'
              type='create'
              href={`/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${item.id}`}
              />
          </div>
        </div>
      ))}

    </div>
  )
}



const SearchUserProfile = ({school_id}: any) => {
  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'

    const field = formData.get("field")
    const value = formData.get("value")

    if (!value) {
      redirect(`/pageAdministration/${school_id}/pageStudentsUnAssigned`)
    }
    if (field == "specialty") {
      redirect(`/pageAdministration/${school_id}/pageStudentsUnAssigned?specialty__main_specialty__specialty_name=${value}`)
    }
    if (field == "academic_year") {
      if (value && value.toString().length == 4){
        redirect(`/pageAdministration/${school_id}/pageStudentsUnAssigned?specialty__academic_year=${value}/`)
      }
      redirect(`/pageAdministration/${school_id}/pageStudentsUnAssigned?specialty__academic_year=${value}`)
    }
    if (field && value && value.toString().length > 1) {
      redirect(`/pageAdministration/${school_id}/pageStudentsUnAssigned?user__${field}=${value}`)
    }
  }
  return (
    <>

      <form action={onSearchDrugServerAction} className='flex flex-row gap-2 text-black'>
        <select name='field' className='hidden md:flex'>
          <option value="full_name">Full Name</option>
          <option value="matricle">Matricle</option>
          <option value="telephone">Telephone</option>
          <option value="specialty">Specialty</option>
          <option value="academic_year">Academic Year</option>
        </select>
        <input name='value' placeholder='Search Student ...' className='border-2 border-slate-700 flex px-4 py-1 rounded text-black w-72' />
        <button type='submit' className='hidden items-center justify-center md:flex ml-2'><RiSearch2Fill size={23} /></button>
      </form>

    </>
  )
}