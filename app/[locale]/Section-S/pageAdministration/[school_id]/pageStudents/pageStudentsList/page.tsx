import { Metadata } from 'next'
import React, { FC } from 'react'
import { getData } from '@/functions'
import { GetSecondaryProfileUrl } from '@/NoDomain/Utils-S/userControl/userConfig'
import MyButtonAdd from '@/section-s/common/MyButtons/MyButtonAdd'
import MyButtonEdit from '@/section-s/common/MyButtons/MyButtonEdit'
import MyButtonDelete from '@/section-s/common/MyButtons/MyButtonDelete'
import MyPagination from '@/section-s/common/Pagination/MyPagination'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import { GetSecondaryProfileInter, } from '@/NoDomain/Utils-S/userControl/userInter'
import { protocol } from '@/config'

const StudentList = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: GetSecondaryProfileInter[] | any = await getData(
    protocol + GetSecondaryProfileUrl, {...searchParams, user__role: "student", nopage: true }
  );

  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Students List" 
          pageName1="Dashboard" 
          link1="/pageAdministration" 
        />

      <List apiData={apiData} />

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


interface Props {
  apiData: any | undefined
}
const List:FC<Props> = ( { apiData } ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Students List ({apiData?.count})
        </h4>
        <button className="bg-gray dark:bg-blue-800 font-semibold md:px-6 md:py-1 md:text-lg px-2 py-1 rounded text-secondary">
          {/* <Link href={"/pageAdministration/pageSettings/pageMainSpecialties"}>
            -
          </Link> */}
        </button>
        <MyButtonAdd
          href={"/pageAdministration/pageStudents/create"}
        />
      </div>

      <div className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 md:px-4 px-4 py-4">
        <div className="flex items-center">
          <p className="font-medium">Username</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Full Name</p>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <p className="font-medium">Telephone</p>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <p className="font-medium">classroom</p>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <p className="font-medium">Academic year</p>
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetSecondaryProfileInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 md:px-4 px-3 py-2"
          key={key}
        >
          <div className="flex items-center">
            <p className="dark:text-white text-black text-sm">
              {item.user__username}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black text-sm">
              {item.user__first_name} {item.user__last_name}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white text-black text-sm">
              {item.user__telephone} 
            </p>
          </div>
          <div className="dark:text-white gap-2 hidden justify-between md:flex w-full">
            {item.secondary_classroom__id ? 
              <>
                {/* <span className='flex'>{item.classroom?.main_classroom?.classroom_name}</span> */}
                <span className='flex'>{item.secondary_classroom__level__level}</span>
              </> 
              : 
              <span className='flex items-center justify-center px-auto text-center w-full'>-</span>} 
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white items-center text-black text-sm">
              {item.secondary_classroom__id ? <span>{item.secondary_classroom__academic_year}</span> : <span>-</span>} 
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center text-sm">
            <MyButtonEdit
              href={`/pageAdministration/pageStudents/edit/${item.id}`}
            />
            <MyButtonDelete
              href={`/pageAdministration/pageStudents/delete/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={"/pageAdministration/pageStudents?user__role=student"}
      />
    
    </div>
  )
}