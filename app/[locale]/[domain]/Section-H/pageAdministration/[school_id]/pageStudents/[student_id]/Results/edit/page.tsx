import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
import { MdOutlineDone } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import NotificationError from '@/section-h/common/NotificationError';
import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetSchoolFeesUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import { UserProfileInter } from '@/serverActions/interfaces';
import MarksForm from './MarksForm';
import AccountActivation from '../AccountActivation';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiStudentInfo: UserProfileInter | any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.student_id, fieldList: ['id', "specialty__id", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level"] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Fill Marks"
          pageName1="Back"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results`}
        />

        <NotificationError errorMessage={searchParams} />

        {apiStudentInfo && apiStudentInfo.count == 1 && apiStudentInfo.results[0].specialty__id && <EditDelete apiStudentInfo={apiStudentInfo.results[0]} params={params} searchParams={searchParams} />}

      </>
    </LayoutAdmin>
  )
}

export default page


export const metadata: Metadata = {
  title: "Student-Result",
  description: "This is Student Result Page",
};


interface EditDeleteProps {
  searchParams: any
  params: any
  apiStudentInfo: GetUserProfileInter
}

const EditDelete: FC<EditDeleteProps> = async ({ apiStudentInfo, searchParams, params }) => {

  const apiMyResultsI: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.student_id, course__specialty__id: apiStudentInfo.specialty__id, nopage: true, student__specialty__school__campus__id: params.school_id, course__semester: "I", fieldList: ["id", "course__main_course__course_name", "course__id", "course__assigned_to__full_name", "course__semester", "ca", "exam", "resit", "average", "validated"] });
  const apiMyResultsII: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.student_id, course__specialty__id: apiStudentInfo.specialty__id, nopage: true, student__specialty__school__campus__id: params.school_id, course__semester: "II", fieldList: ["id", "course__main_course__course_name", "course__id", "course__assigned_to__full_name", "course__semester", "ca", "exam", "resit", "average", "validated"] });
  const apiPaymentInfo: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, {
    userprofile__id: apiStudentInfo.id, fieldList: [
      'id', "platform_paid", "balance", "userprofile__specialty__tuition", "userprofile__specialty__payment_one",
      "userprofile__user__full_name", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
    ]
  });

  if (apiPaymentInfo && apiPaymentInfo.count == 1 && !apiPaymentInfo.results[0].platform_paid) {
    return <></>
    // <AccountActivation onActivate={onActivate} params={params} schoolfees={apiSchoolFeesInfo[0]} url={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results`} />
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex items-center justify-between px-10'>
        <div className='flex font-medium gap-4 items-center justify-center my-2'>
          <span>Class: {apiStudentInfo.specialty__main_specialty__specialty_name}</span>
          <span>Year: {apiStudentInfo.specialty__academic_year}</span>
          <span>Level: {apiStudentInfo.specialty__level__level}</span>
        </div>
        <div className='flex font-medium gap-4 items-center justify-center my-2 text-[24px] text-black'>
          <span><b>{apiPaymentInfo.results[0].userprofile__user__full_name}</b></span>
        </div>
      </div>

      <div className='flex flex-col gap-2 p-2'>



        {apiMyResultsI && apiMyResultsI.length > 0 && <>
          <div className="flex items-center justify-center">Semester I</div>
          <MarksForm resultData={apiMyResultsI} params={params} />
        </>}

        {apiMyResultsII && apiMyResultsII.length > 0 && <>
          <div className="flex items-center justify-center">Semester II</div>
          <MarksForm resultData={apiMyResultsII} params={params} />
        </>}

      </div>


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
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">CA</span>
            <span className="font-medium">Exam</span>
            <span className="font-medium">Resit</span>
            <span className="font-medium">Total</span>
            <span className="font-medium">Status</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">Lecturer</span>
          </div>
        </div>

        {/* {(apiPaymentInfo.results[0].userprofile__specialty__tuition - apiPaymentInfo.results[0].balance) >= (apiPaymentInfo.results[0].userprofile__specialty__payment_one + apiPaymentInfo.results[0].userprofile__specialty__payment_two) ? apiMyResultsII.results.map((item: GetResultInter, index: number) => <div key={item.id} */}
        {true ? apiMyResultsII.results.map((item: GetResultInter, index: number) => <div key={item.id}
          className="dark:odd:bg-slate-700 dark:text-white grid grid-cols-3 md:grid-cols-10 odd:bg-blue-100 px-4 py-1 text-lg tracking-wide"
        >
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">{index + 1}</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span className="font-medium">{item.course__main_course__course_name}</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">{item.ca}</span>
            <span className="font-medium">{item.exam}</span>
            <span className="font-medium">{item.resit}</span>
            <span className="font-medium">{item.average}</span>
            <span className="font-medium">{item.average ? item.validated ? <MdOutlineDone /> : <IoMdClose /> : <span>-</span>}</span>
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