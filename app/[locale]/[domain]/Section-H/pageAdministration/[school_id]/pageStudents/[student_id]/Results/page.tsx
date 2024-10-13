import { Metadata } from 'next'
import React, { FC } from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { ConfigData, protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { GetSchoolFeesUrl, TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter'
import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig'
import Link from 'next/link'
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineDone } from 'react-icons/md'
import AccountActivation from './AccountActivation'
import Table from '@/componentsTwo/Table'
import { TableRowClassName } from '@/constants'
import { redirect } from 'next/navigation'
import { collectMoney } from '@/payment'
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas'
import { ActionCreate } from '@/serverActions/actionGeneral'
import TabsStudents from '@/componentsTwo/TabsProfiles/TabsStudents'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, {
    nopage: true, id: params.student_id, ...searchParams, fieldList: [
      "id", "user__matricle", "user__full_name", "specialty__main_specialty__specialty_name",
      "specialty__academic_year", "specialty__level__level", "specialty__id",
      "specialty__tuition"
    ]
  })

  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <TabsStudents params={params} page={4} />

        {apiData && <EditDelete apiStudentInfo={apiData[0]} params={params} searchParams={searchParams} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Results",
  description: "This is Results Page",
};


interface EditDeleteProps {
  searchParams: any
  params: any
  apiStudentInfo: GetUserProfileInter
}


const EditDelete: FC<EditDeleteProps> = async ({ apiStudentInfo, params }) => {

  const apiMyResultsI: any = await getData(protocol + "api" + params.domain + GetResultUrl, { active: true, nopage: true, student__id: apiStudentInfo.id, course__specialty__id: apiStudentInfo.specialty__id, course__semester: "I", fieldList: ["id", "course__main_course__course_name", "course__assigned_to__full_name", "course__semester", "ca", "exam", "resit", "average", "validated"] });
  const apiMyResultsII: any = await getData(protocol + "api" + params.domain + GetResultUrl, { active: true, nopage: true, student__id: apiStudentInfo.id, course__specialty__id: apiStudentInfo.specialty__id, course__semester: "II", fieldList: ["id", "course__main_course__course_name", "course__assigned_to__full_name", "course__semester", "ca", "exam", "resit", "average", "validated"] });
  const apiSchoolFeesInfo: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, {
    userprofile__id: apiStudentInfo.id, nopage: true, fieldList: [
      'id', "userprofile__id", "platform_paid", "balance", "userprofile__specialty__tuition", "platform_charges",
      "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
    ]
  });

  if (apiSchoolFeesInfo && apiSchoolFeesInfo.length && !apiSchoolFeesInfo[0].platform_paid) {
    const onActivate = async (formData: FormData) => {
      "use server"

      var payer = formData.get("telephone");
      var operator = formData.get("operator");
      var url = formData.get("url");
      var origin = formData.get("origin");

      const data = {
        schoolfees_id: apiSchoolFeesInfo[0].id,
        telephone: payer,
        operator: operator,
        payment_method: operator,
        amount: apiSchoolFeesInfo[0].platform_charges,
        reason: "Platform Charges",
        account: "PLATFORM CHARGES",
        status: "completed",
        operation_type: "other",
        origin: origin,
      }

      var pay: any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer });

      if (!pay.operation && pay.transaction == "could-not-perform-transaction") {
        redirect(`${url}?customerror=Transaction Cancelled by User`)
      }
      if (!pay.operation && pay.transaction == "low-balance-payer") {
        redirect(`${url}?customerror=Not Enough Funds`)
      }
      if (!pay.operation && pay.transaction == "ENOTFOUND") {
        redirect(`${url}?error=Transaction Error`)
      }
      if (!pay.operation && !pay.transaction) {
        redirect(`${url}?error=Transaction Error`)
      }

      if (pay.operation) {
        const response = await ActionCreate(data, SchemaTransactionCreate, protocol + "api" + params.domain + TransactionUrl)
        console.log(response, 80)

        if (response.error) {
          redirect(`${url}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
        }
        if (response?.errors) {
          redirect(`${url}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
        }
        if (response?.detail) {
          redirect(`${url}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
        }
        if (response?.id) {
          redirect(`${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees?success=Successfully Activated-${JSON.stringify(response.schoolfees.userprofile.user.full_name).replaceAll(" ", "-")}`)
        }
      } else {
        redirect(`${url}/${params.schoolfees_id}?error=Transaction Failed`)
      }
    }

    return <div className="flex item justify-center mx-4 text-center">
      <AccountActivation
        onActivate={onActivate}
        params={params}
        schoolfees={apiSchoolFeesInfo[0]}
        url={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results`}
      />

    </div>
  }

  const renderRow = (item: GetResultInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="font-medium">{index + 1}</td>
      <td className="font-medium">{item.course__main_course__course_name}</td>
      <td className="font-medium">{item.ca}</td>
      <td className="font-medium">{item.exam}</td>
      <td className="font-medium">{item.resit}</td>
      <td className="font-medium">{item.average}</td>
      <td className="flex items-center justify-center w-full">{item.average ? item.validated ? <MdOutlineDone /> : <IoMdClose /> : <span>-</span>}</td>
    </tr>
  );



  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark p-2 rounded-sm shadow-default">

      <div className='flex items-center justify-between p-2'>
        <div className='flex font-medium gap-4 items-center justify-center'>
          <span>Class: </span>
          <span>{apiStudentInfo.specialty__main_specialty__specialty_name}</span>
        </div>
        <div className='flex font-medium gap-4 items-center justify-center'>
          <span>Year: </span>
          <span>{apiStudentInfo.specialty__academic_year}</span>
        </div>
        <div className='flex font-medium gap-4 items-center justify-center'>
          <span>Level: </span>
          <span>{apiStudentInfo.specialty__level__level}</span>
        </div>
        <div className='flex font-medium gap-4 items-center justify-center'>
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results/edit`} className='bg-teal-700 font-medium px-10 py-2 rounded text-[18px] text-white'>Edit Result</Link>
        </div>
      </div>



      <div className='flex flex-col p-2'>
        <div className='flex gap-20 items-center text-xl'>
          <span>Semster I</span>
          <span>{apiMyResultsI.count} - Courses</span>
        </div>

        {
          (apiSchoolFeesInfo[0].userprofile__specialty__tuition - apiSchoolFeesInfo[0].balance) >= (apiSchoolFeesInfo[0].userprofile__specialty__tuition * ConfigData[params.domain].higher.schoolfees_control[1]) ?
            <Table columns={columns} renderRow={renderRow} data={apiMyResultsI} />
            :
            <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>
              Not Meeting Minimum School Fee Requirements {(apiSchoolFeesInfo[0].userprofile__specialty__tuition * ConfigData[params.domain].higher.schoolfees_control[1]).toLocaleString()} F</div>
        }
      </div>


      <div className='flex flex-col p-2'>
        <div className='flex gap-20 items-center text-xl'>
          <span>Semster II</span>
          <span>{apiMyResultsII.count} - Courses</span>
        </div>

        {
          (apiSchoolFeesInfo[0].userprofile__specialty__tuition - apiSchoolFeesInfo[0].balance) >= (apiSchoolFeesInfo[0].userprofile__specialty__tuition * ConfigData[params.domain].higher.schoolfees_control[3]) ?
            <Table columns={columns} renderRow={renderRow} data={apiMyResultsII} />
            :
            <div className='flex font-medium italic items-center justify-center py-32 text-xl tracking-wide'>Not Meeting Minimum School Fee Requirements {(apiSchoolFeesInfo[0].userprofile__specialty__tuition * ConfigData[params.domain].higher.schoolfees_control[3]).toLocaleString()} F</div>
        }

      </div>



    </div>
  )
}

const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Course Name",
    accessor: "course__main_course__course_name",
    className: "hidden md:table-cell w-2/12 md:w-6/12",
  },
  {
    header: "Ca",
    accessor: "ca",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Exam",
    accessor: "exam",
    className: "table-cell w-3/12 md:w-1/12",
  },
  {
    header: "Resit",
    accessor: "resit",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Total",
    accessor: "resit",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Status",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12 text-center ",
  },
];