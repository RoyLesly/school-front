import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import SessionExpired from '@/section-h/common/SessionExpired';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Session } from 'inspector';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl, GetMainCourseUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { DomainInter, LevelInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const domainData: any = await getData(protocol + GetDomainUrl, { fieldList: [ "id", "domain_name" ]});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Pre-Select Create Course" 
          pageName1="Settings" 
          pageName2="Courses" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {domainData && domainData["unauthorized"] && <SessionExpired />}
        
        {domainData && <Create params={params} domainData={domainData} />}

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Course-Create",
  description: "This is Course Page",
};

const Create = async ({ params, domainData }: any) => {

  const mainCourseData: any = await getData(protocol + GetMainCourseUrl, { nopage: true, fieldList: [ "id", "course_name" ]});
  const levelData: any = await getData(protocol + GetLevelUrl, { fieldList: [ "id", "level" ]});
  const academicYearData: any = await getData(protocol + AcademicYearUrl, {});
  const thisYear = new Date().getFullYear()

  console.log(domainData, 58)
  console.log(mainCourseData, 59)


  if (mainCourseData == "ECONNREFUSED") return <ServerError />

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

      var domain_id = formData.get("domain_id");
      var academic_year = formData.get("academic_year");
      var level_id = formData.get("level_id");
    
    const data = {
      domain_id: domain_id ? parseInt(domain_id.toString()) : 0,
      academic_year: academic_year ? academic_year : "",
      level_id:  level_id ? parseInt(level_id.toString()) : 0,
    }

    if (data.domain_id && data.level_id && data.academic_year) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/create?main_specialty__field__domain__id=${data.domain_id}&academic_year=${data.academic_year}&level__id=${data.level_id}`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/pre-select?error=Please Select All Fields`)
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

              <form className="flex flex-col gap-10 p-6.5" action={onSubmitServerAction}>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-lg">
                    Select Domain
                  </label>
                  <select
                    name='domain_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                      true ? "text-black dark:text-white" : ""
                    }`}
                  >
                    <option value={0}>------------------</option>
                    {domainData.results && domainData.results.map((item: DomainInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.domain_name}
                      </option>)
                    )}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-lg">
                    Select Level
                  </label>
                  <select
                    name='level_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                      true ? "text-black dark:text-white" : ""
                    }`}
                  >
                    <option value={0}>------------------</option>
                    {levelData.results && levelData.results.map((item: LevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.level}
                      </option>)
                    )}
                    
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-lg">
                    Select Academic Year
                  </label>
                  <select
                    name='academic_year'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                      true ? "text-black dark:text-white" : ""
                    }`}
                  >
                    <option value={""}>---------------</option>
                    {academicYearData.results.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                      </option>)
                    )}
                    
                  </select>
                </div>

                <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Next</button>

              </form>

            </div>


          </div>
        </div>
      </div>
    
    </div>
  )
}
