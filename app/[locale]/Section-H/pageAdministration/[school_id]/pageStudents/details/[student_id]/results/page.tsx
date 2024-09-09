import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
import TabsStudent from '../TabsStudent';
import { MdOutlineDone } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import AccountActivation from './AccountActivation';
import Link from 'next/link';
import NotificationError from '@/section-h/common/NotificationError';
import { GetResultInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { GetSchoolFeesUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';
import { UserProfileInter } from '@/serverActions/interfaces';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiStudentInfo: UserProfileInter | any = await getData(GetUserProfileUrl, { id: params.student_id, fieldList: ['id', "specialty__id", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level"] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Result Info"
          pageName1="Student"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageStudents`}
        />

        <NotificationError errorMessage={searchParams} />

        <TabsStudent params={params} page={4} />

        {apiStudentInfo && apiStudentInfo.count == 1 && apiStudentInfo.results[0].specialty__id && <EditDelete apiStudentInfo={apiStudentInfo.results[0]} params={params} searchParams={searchParams} />}

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Student-Result",
  description: "This is Student DetResultail Page",
};


interface EditDeleteProps {
  searchParams: any
  params: any
  apiStudentInfo: GetUserProfileInter
}

const EditDelete: FC<EditDeleteProps> = async ({ apiStudentInfo, searchParams, params }) => {

  const apiMyResultsI: any = await getData(GetResultUrl, { active: true, student__id: apiStudentInfo.id, course__semester: "I", fieldList: ["id", "course__main_course__course_name", "course__assigned_to__full_name", "course__semester", "ca", "exam", "resit", "average", "validated"] });
  const apiMyResultsII: any = await getData(GetResultUrl, { active: true, student__id: apiStudentInfo.id, course__semester: "II", fieldList: ["id", "course__main_course__course_name", "course__assigned_to__full_name", "course__semester", "ca", "exam", "resit", "average", "validated"] });
  const apiPaymentInfo: any = await getData(GetSchoolFeesUrl, {
    userprofile__id: apiStudentInfo.id, fieldList: [
      'id', "platform_paid", "balance", "userprofile__specialty__tuition", "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
    ]
  });

  if (apiPaymentInfo && apiPaymentInfo.count == 1 && !apiPaymentInfo.results[0].platform_paid) {
    return <AccountActivation params={params} />
  }

  console.log(apiMyResultsI, 80)
  console.log(apiMyResultsII, 81)


  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex items-center justify-between px-10'>
        <div className='flex font-medium gap-4 items-center justify-center my-2'>
          <span>Class: {apiStudentInfo.specialty__main_specialty__specialty_name}</span>
          <span>Year: {apiStudentInfo.specialty__academic_year}</span>
          <span>Level: {apiStudentInfo.specialty__level__level}</span>
        </div>
        { apiPaymentInfo && apiPaymentInfo.count == 1 && apiPaymentInfo.results[0].platform_paid && <div className='flex font-medium gap-4 items-center justify-center my-2'>
          <Link href={`/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/editresults`} className='bg-bluedark font-medium px-10 py-2 rounded text-[18px] text-white'>Edit Result</Link>
        </div>}
      </div>

      {apiMyResultsI && apiMyResultsI.count && <div className='flex flex-col p-2'>

        <div className='flex gap-20 items-center text-xl'>
          <span>Semster I</span>
          <span>{apiMyResultsI.count} - Courses</span>
        </div>

        <div className="bg-bluedark grid grid-cols-3 md:grid-cols-10 px-4 py-1 text-lg text-white tracking-wide">
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">No</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span className="font-medium">Course Name</span>
          </div>
          <div className="col-span-4 grid grid-cols-10 lg:px-4">
            <span className="col-span-2 font-medium">CA</span>
            <span className="col-span-2 font-medium">Exam</span>
            <span className="col-span-2 font-medium">Resit</span>
            <span className="col-span-2 font-medium">Total</span>
            <span className="col-span-2 flex font-medium items-center justify-center">Status</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">Lecturer</span>
          </div>
        </div>

        {(apiPaymentInfo.results[0].userprofile__specialty__tuition - apiPaymentInfo.results[0].balance) >= (apiPaymentInfo.results[0].userprofile__specialty__payment_one) ? apiMyResultsI.results.map((item: GetResultInter, index: number) => <div key={item.id}
          className="dark:odd:bg-slate-700 dark:text-white grid grid-cols-3 md:grid-cols-10 odd:bg-blue-100 px-4 py-1 text-lg tracking-wide"
        >
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">{index + 1}</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span className="font-medium">{item.course__main_course__course_name}</span>
          </div>
          <div className="col-span-4 grid grid-cols-10 lg:px-4">
            <span className="col-span-2 font-medium">{item.ca}</span>
            <span className="col-span-2 font-medium">{item.exam}</span>
            <span className="col-span-2 font-medium">{item.resit}</span>
            <span className="col-span-2 font-medium">{item.average}</span>
            <span className="col-span-2 flex font-medium items-center justify-center">{item.average ? item.validated ? <MdOutlineDone /> : <IoMdClose /> : <span>-</span>}</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">{item.course__assigned_to__full_name}</span>
          </div>
        </div>)
          :
          <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>Not Meeting Minimum School Fee Requirements (1st Installment)</div>
        }
      </div>
      }


      {apiMyResultsII && apiMyResultsII.count && <div className='flex flex-col p-2'>

        <div className='flex gap-20 items-center text-xl'>
          <span>Semster II</span>
          <span>{apiMyResultsII.count} - Courses</span>
        </div>

        <div className="bg-bluedark grid grid-cols-3 md:grid-cols-10 px-4 py-1 text-lg text-white tracking-wide">
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">No</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span className="font-medium">Course Name</span>
          </div>
          <div className="col-span-4 grid grid-cols-10 lg:px-4">
            <span className="col-span-2 font-medium">CA</span>
            <span className="col-span-2 font-medium">Exam</span>
            <span className="col-span-2 font-medium">Resit</span>
            <span className="col-span-2 font-medium">Total</span>
            <span className="col-span-2 flex font-medium items-center justify-center">Status</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">Lecturer</span>
          </div>
        </div>

        {(apiPaymentInfo.results[0].userprofile__specialty__tuition - apiPaymentInfo.results[0].balance) >= (apiPaymentInfo.results[0].userprofile__specialty__payment_one + apiPaymentInfo.results[0].userprofile__specialty__payment_two) ? apiMyResultsII.results.map((item: GetResultInter, index: number) => <div key={item.id}
          className="dark:odd:bg-slate-700 dark:text-white grid grid-cols-3 md:grid-cols-10 odd:bg-blue-100 px-4 py-1 text-lg tracking-wide"
        >
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">{index + 1}</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span className="font-medium">{item.course__main_course__course_name}</span>
          </div>
          <div className="col-span-4 grid grid-cols-10 lg:px-4">
            <span className="col-span-2 font-medium">{item.ca}</span>
            <span className="col-span-2 font-medium">{item.exam}</span>
            <span className="col-span-2 font-medium">{item.resit}</span>
            <span className="col-span-2 font-medium">{item.average}</span>
            <span className="col-span-2 flex font-medium items-center justify-center">{item.average ? item.validated ? <MdOutlineDone /> : <IoMdClose /> : <span>-</span>}</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">{item.course__assigned_to__full_name}</span>
          </div>
        </div>)
          :
          <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>Not Meeting Minimum School Fee Requirements (2nd Installment)</div>
        }
      </div>
      }


    </div>
  )
}