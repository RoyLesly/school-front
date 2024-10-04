import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import MyButtonCustom from '@/section-h/common/MyButtonCustom';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import { getData } from '@/functions';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import { RiDeleteBin2Line, RiSearch2Fill } from 'react-icons/ri';
import { AcademicYearUrl, GetCourseUrl, GetDomainUrl, GetLevelUrl, GetMainCourseUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetCourseInter, GetLevelInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import Table from '@/componentsTwo/Table';
import { TableRowClassName } from '@/constants';
import FormModal from '@/componentsTwo/FormModal';
import { MdModeEdit } from 'react-icons/md';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, lecturer_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  // const apiDomains: any[] = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true })
  // const apiMainCourses: any[] = await getData(protocol + "api" + params.domain + GetMainCourseUrl, { nopage: true })
  const coursesData: any = await getData(protocol + "api" + params.domain + GetCourseUrl, {
    ...searchParams, nopage: true, assigned_to__id: params.lecturer_id, specialty__school__campus__id: params.school_id, fieldList: [
      "id",
      "main_course__course_name",
      "main_course__id",
      "specialty__main_specialty__specialty_name",
      "specialty__academic_year",
      "specialty__level__level",
      "specialty__id",
      "specialty__main_specialty__field__domain__id",
      "specialty__main_specialty__field__domain__domain_name",
      "course_credit", "course_code",
      "course_type", "hours", "hours_left",
      "semester",

    ]
  })

  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="My Courses"
          pageName1="Home"
          pageName2="My Courses"
          link1={`/${params.domain}/Section-H/pageLecturer/${params.school_id}`}
          link2={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {coursesData == "ECONNREFUSED" && <ServerError />}
        {coursesData && coursesData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {/* {coursesData != "ECONNREFUSED" && <List apiData={coursesData} params={params} apiDomains={apiDomains} apiMainCourses={apiMainCourses} />} */}
        {coursesData != "ECONNREFUSED" && <List apiData={coursesData} params={params} />}

      </>
    </LayoutLecturer>
  )
}

export default page


export const metadata: Metadata = {
  title:
    "My Courses",
  description: "This is MyCourses Page",
};


const List = ({ apiData, params }: any) => {

  const renderRow = (item: GetCourseInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.lg}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.main_course__course_name}</td>
      <td className="hidden md:table-cell">{item.specialty__main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.specialty__academic_year}</td>
      <td className="hidden md:table-cell">{item.semester}</td>
      <td>
        <span className="bg-blue-300 border flex gap-2 h-9 items-center justify-center rounded-full w-9">
          <FormModal table="course" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} extra_data={
            // { "apiDomains": apiDomains, "canEdit": false, "apiMainCourses": apiMainCourses }
            { "apiDomains": [], "canEdit": false, "apiMainCourses": [] }
          } />
        </span>
      </td>
    </tr>
  );

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex gap-2 justify-between md:px-4 p-2">
        <span className="dark:text-white font-semibold md:text-xl text-black">
          Count ({apiData.length})
        </span>

        <SearchLecturerCourses params={params} />

      </div>

      <div className="bg-white dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

        {apiData && <Table key={1}
          columns={columns}
          renderRow={renderRow}
          headerClassName='py-2 h-12'
          data={apiData}
        />
        }

      </div>

    </div>
  )
}


const SearchLecturerCourses = async ({ params }: any) => {
  const acadYear = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id});
  const lev = await getData(protocol + "api" + params.domain + GetLevelUrl, { fieldList: ["id", "level"] });
  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'

    var value = formData.get("value")
    const year = formData.get("year")
    const level = formData.get("level")

    if (value && value.toString().length > 1) {
      redirect(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}?main_course__course_name=${value}&specialty__academic_year=${year}&specialty__level__id=${level}`)
    }
    if (year || level) {
      redirect(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}?specialty__academic_year=${year}&specialty__level__id=${level}`)
    }
    redirect(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}`)

  }
  return (
    <>

      <form action={onSearchDrugServerAction} className='flex flex-row gap-2 text-black'>
        <input name='value' placeholder='Search Courses ...' className='border-2 border-slate-700 flex md:w-60 px-2 py-1 rounded text-black w-full' />

        <select
          name='year'
          className='border-2 border-slate-700 hidden md:flex md:w-28 px-2 py-1 rounded text-black'
        >
          <option value="">-----</option>
          {acadYear && acadYear.count && acadYear.results.map((item: string) => (
            <option key={item} value={item} className='md:w-28'>{item}</option>
          ))}
        </select>

        <select
          name='level'
          className='border-2 border-slate-700 hidden md:flex md:w-28 px-2 py-1 rounded text-black'
        >
          <option value="">-----</option>
          {lev && lev.count && lev.results.map((item: GetLevelInter) => (
            <option key={item.id} value={item.id} className='md:w-28'>{item.level}</option>
          ))}
        </select>

        <button type='submit' className='hidden items-center justify-center md:flex ml-2'><RiSearch2Fill size={23} /></button>
      </form>

    </>
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
    accessor: "main_course__course_name",
    className: "table-cell w-10/12 md:w-4/12",
  },
  {
    header: "class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-2/12 md:w-3/12",
  },
  {
    header: "Level",
    accessor: "specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Year",
    accessor: "specialty__academic_year",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Sem",
    accessor: "semester",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12",
  },
];