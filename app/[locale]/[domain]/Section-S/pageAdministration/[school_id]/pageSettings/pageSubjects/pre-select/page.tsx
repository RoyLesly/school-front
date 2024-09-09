import { AcademicYearUrl, GetLevelUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { LevelInter } from '@/Domain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { DOMAIN_CHOICES } from '@/Domain/Utils-S/data';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Pre-Select Create Course"
          pageName1="Settings"
          pageName2="Courses"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubject`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <Create params={params} />

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

const Create = async ({ params }: any) => {

  // const mainSubjectData: any = await getData(GetMainSubjectUrl, { fieldList: [ "id", "subject_name" ]});
  const levelData: any = await getData( protocol  + "api" + params.domain + GetLevelUrl, {});
  const academicYearData: any = await getData( protocol  + "api" + params.domain + AcademicYearUrl, {});
  // const thisYear = new Date().getFullYear()


  // if (mainSubjectData == "ECONNREFUSED") return <ServerError />

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    var domain = formData.get("domain");
    var academic_year = formData.get("academic_year");
    var level_id = formData.get("level_id");

    const data = {
      domain: domain,
      academic_year: academic_year ? academic_year : "",
      level_id: level_id ? parseInt(level_id.toString()) : 0,
    }
    
    if (data.domain && data.level_id && data.academic_year) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/create?domain=${data.domain}&academic_year=${data.academic_year}&level__id=${data.level_id}`)
    }
    redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/pre-select?error=Please Select All Fields`)
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
                    name='domain'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={0}>------------------</option>
                    {DOMAIN_CHOICES.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                      {item}
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
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
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
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
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
