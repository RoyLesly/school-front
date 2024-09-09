import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { Metadata } from 'next';
import React, { FC } from 'react'
import TabsStudent from '../TabsStudent';
import { GetResultUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter';
import { GetResultInter } from '@/Domain/Utils-S/appControl/appInter';
import { MdOutlineDone } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import AccountActivation from './AccountActivation';
import { GetSecSchoolFeesUrl } from '@/Domain/Utils-S/feesControl/feesConfig';
import { protocol } from '@/config';
import { UserProfileInter } from '@/serverActions/interfaces';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiStudentInfo: UserProfileInter | any = await getData(protocol + GetSecondaryProfileUrl, {
    id: params.student_id, nopage: true, fieldList: [
      'id', "secondary_classroom__id", "secondary_classroom__level__level", "secondary_classroom__academic_year", "secondary_classroom__level__option"
    ]
  });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Result Info"
          pageName1="Student"
          link1={`/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={4} />

        {apiStudentInfo && apiStudentInfo.length == 1 && apiStudentInfo[0].secondary_classroom__id && <EditDelete apiStudentInfo={apiStudentInfo[0]} params={params} searchParams={searchParams} />}

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
  apiStudentInfo: GetSecondaryProfileInter
}

const EditDelete: FC<EditDeleteProps> = async ({ apiStudentInfo, searchParams, params }) => {

  const apiMyResults: any = await getData(GetResultUrl, {
    subject__classroom__id: apiStudentInfo.secondary_classroom__id, student__id: apiStudentInfo.id, fieldList: [
      "id", "subject__main_subject__subject_name", "subject__assigned_to__full_name",
      "seq_1", "seq_2", "seq_3", "seq_4", "seq_5", "seq_6", "passed_1", "passed_2", "passed_3", "average_term_1", "average_term_2", "average_term_3"
    ]
  });
  const apiPaymentInfo: any = await getData(GetSecSchoolFeesUrl, {
    userprofile__id: apiStudentInfo.id, nopage: true, fieldList: [
      'id', "platform_paid", "balance", "apiStudentInfoprofile__classroom__tuition", "secondaryprofile__classroom__payment_one",
      "secondaryprofile__classroom__payment_two", "secondaryprofile__classroom__payment_three"
    ]
  });

  console.log(apiMyResults, 83)

  if (apiPaymentInfo && apiPaymentInfo.count == 1 && !apiPaymentInfo.results[0].platform_paid) {
    return <AccountActivation params={params} />
  }


  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex font-medium gap-4 items-center justify-center my-2'>
        <span>{apiStudentInfo.secondary_classroom__level__level}</span>
        <span>{apiStudentInfo.secondary_classroom__level__option}</span>
        <span>{apiStudentInfo.secondary_classroom__academic_year}</span>
        <span>RESULTS</span>
      </div>

      {apiMyResults && apiMyResults.count && <div className='flex flex-col p-2'>

        <div className='flex gap-20 items-center justify-center py-1 text-xl'>
          <span className=''>First Term Results</span>
          <span>{apiMyResults.count} - Subjects</span>
        </div>

        <div className="bg-bluedark grid grid-cols-3 md:grid-cols-11 px-4 py-1 text-lg text-white tracking-wide">
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">No</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="font-medium">Course Name</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">1 Seq</span>
            <span className="font-medium">2 Seq</span>
            <span className="font-medium">Av</span>
            <span className="font-medium">Status</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">Lecturer</span>
          </div>
        </div>


        {/* FIRST TERM */}

        {(apiPaymentInfo[0].userprofile__classroom__tuition - apiPaymentInfo[0].balance) >= (apiPaymentInfo[0].userprofile__classroom__payment_one) ? apiMyResults.results.map((item: GetResultInter, index: number) => <div key={item.id}
          className="dark:odd:bg-slate-700 dark:text-white grid grid-cols-3 md:grid-cols-11 odd:bg-blue-100 px-4 py-1 text-lg tracking-wide"
        >
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">{index + 1}</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="font-medium">{item.subject__main_subject__subject_name}</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">{item.seq_1}</span>
            <span className="font-medium">{item.seq_2}</span>
            <span className="font-medium">{item.average_term_1 == null ? "-" : item.average_term_1}</span>
            <span className="font-medium">{item.average_term_1 == null ? "-" : item.passed_1 ? <MdOutlineDone /> : <IoMdClose />}</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">{item.subject__assigned_to__full_name}</span>
          </div>
        </div>)
          :
          <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>Not Meeting Minimum School Fee Requirements (1st Installment)</div>
        }


      </div>
      }



      {/* SECOND TERM */}

      {apiMyResults && apiMyResults.count && <div className='flex flex-col p-2'>

        <div className='flex gap-20 items-center justify-center py-1 text-xl'>
          <span className=''>Second Term Results</span>
          <span>{apiMyResults.count} - Subjects</span>
        </div>

        <div className="bg-bluedark grid grid-cols-3 md:grid-cols-11 px-4 py-1 text-lg text-white tracking-wide">
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">No</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="font-medium">Course Name</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">3 Seq</span>
            <span className="font-medium">4 Seq</span>
            <span className="font-medium">Av</span>
            <span className="font-medium">Status</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">Lecturer</span>
          </div>
        </div>


        {(apiPaymentInfo[0].userprofile__classroom__tuition - apiPaymentInfo[0].balance) >= (apiPaymentInfo[0].userprofile__classroom__payment_one + apiPaymentInfo[0].userprofile__classroom__payment_two) ? apiMyResults.results.map((item: GetResultInter, index: number) => <div key={item.id}
          className="dark:odd:bg-slate-700 dark:text-white grid grid-cols-3 md:grid-cols-11 odd:bg-blue-100 px-4 py-1 text-lg tracking-wide"
        >
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">{index + 1}</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="font-medium">{item.subject__main_subject__subject_name}</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">{item.seq_3}</span>
            <span className="font-medium">{item.seq_4}</span>
            <span className="font-medium">{item.average_term_2 == null ? "-" : item.average_term_2}</span>
            <span className="font-medium">{item.average_term_2 == null ? "-" : item.passed_2 ? <MdOutlineDone /> : <IoMdClose />}</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">{item.subject__assigned_to__full_name}</span>
          </div>
        </div>)
          :
          <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>Not Meeting Minimum School Fee Requirements (2nd Installment)</div>
        }

      </div>
      }


      {/* THIRD TERM */}

      {apiMyResults && apiMyResults.count && <div className='flex flex-col p-2'>

        <div className='flex gap-20 items-center justify-center py-1 text-xl'>
          <span className=''>Third Term Results</span>
          <span>{apiMyResults.count} - Subjects</span>
        </div>

        <div className="bg-bluedark grid grid-cols-3 md:grid-cols-11 px-4 py-1 text-lg text-white tracking-wide">
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">No</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="font-medium">Course Name</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">5 Seq</span>
            <span className="font-medium">6 Seq</span>
            <span className="font-medium">Av</span>
            <span className="font-medium">Status</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">Lecturer</span>
          </div>
        </div>


        {(apiPaymentInfo[0].userprofile__classroom__tuition - apiPaymentInfo[0].balance) >= (apiPaymentInfo[0].userprofile__classroom__payment_one + apiPaymentInfo[0].userprofile__classroom__payment_two + apiPaymentInfo[0].userprofile__classroom__payment_three ) ? apiMyResults.results.map((item: GetResultInter, index: number) => <div key={item.id}
          className="dark:odd:bg-slate-700 dark:text-white grid grid-cols-3 md:grid-cols-11 odd:bg-blue-100 px-4 py-1 text-lg tracking-wide"
        >
          <div className="flex items-center justify-between lg:mx-4 mx-2">
            <span className="font-medium">{index + 1}</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="font-medium">{item.subject__main_subject__subject_name}</span>
          </div>
          <div className="col-span-4 flex items-center justify-between lg:px-4">
            <span className="font-medium">{item.seq_5}</span>
            <span className="font-medium">{item.seq_6}</span>
            <span className="font-medium">{item.average_term_2 == null ? "-" : item.average_term_3}</span>
            <span className="font-medium">{item.average_term_2 == null ? "-" : item.passed_3 ? <MdOutlineDone /> : <IoMdClose />}</span>
          </div>
          <div className="col-span-2 hidden items-center justify-center lg:flex">
            <span className="font-medium">{item.subject__assigned_to__full_name}</span>
          </div>
        </div>)
          :
          <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>Not Meeting Minimum School Fee Requirements (3rd Installment)</div>
        }

      </div>
      }


    </div>
  )
}