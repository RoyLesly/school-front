import { SubjectUrl, GetClassroomUrl, GetMainSubjectUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { GetClassroomInter } from '@/NoDomain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import SearchMainSubject from './SearchMainSubject';
import { GetCustomUserUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { CustomUserInter } from '@/NoDomain/Utils-S/userControl/userInter';
import { SchemaCreateEditSubject } from '@/NoDomain/Utils-S/schemas/schemas';
import Link from 'next/link';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const classroomData: any = await getData(protocol + GetClassroomUrl, { ...searchParams, nopage: true, fieldList: ['id', "level__level", "level__option", "academic_year"] })
  const mainSubjectData: any = await getData(protocol + GetMainSubjectUrl, { nopage: true, fieldList: ["id", "subject_name"] })
  const lecturerData: any = await getData(protocol + GetCustomUserUrl, { role: "teacher", nopage: true, is_active: true, is_staff: false, school__campus__id: params.school_id });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Create Subject"
          pageName1="Settings"
          pageName2="Subjects"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`}
        />


        {searchParams && <NotificationError errorMessage={searchParams} />}
        {classroomData == "ECONNREFUSED" && <ServerError />}
        {classroomData && classroomData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {lecturerData && lecturerData.length > 0 ?
          classroomData && classroomData.length > 0 ? <Create params={params} classroomData={classroomData} mainSubjectData={mainSubjectData} lecturerData={lecturerData} searchParams={searchParams} />
            :
            <div className="flex flex-col font-semibold gap-10 items-center justify-center pb-32 pt-40 tracking-widest">
              <div className='italic text-2xl'>No Lecturer</div>
              <Link href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/create`} className='bg-bluedark px-6 py-1 rounded text-lg text-white'>New Lecturer</Link>
            </div>
          :
          <div className="flex flex-col font-semibold gap-10 items-center justify-center pb-32 pt-40 tracking-widest">
            <div className='italic text-2xl'>No Lecturer</div>
            <Link href={`/Section-S/pageAdministration/${params.school_id}/pageLecturers/pageAdmission`} className='bg-bluedark px-6 py-1 rounded text-lg text-white'>New Lecturer</Link>
          </div>
        }



      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Subject-Create",
  description: "This is Subject Page",
};

const Create = async ({ params, classroomData, mainSubjectData, lecturerData, searchParams }: any) => {

  if (mainSubjectData == "ECONNREFUSED") return <ServerError />
  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    var main_course_id = formData.get("main_course_id");
    var classroom_id = formData.get("classroom_id");
    var subject_coefficient = formData.get("subject_coefficient");
    var subject_type = formData.get("subject_type");
    var subject_code = formData.get("subject_code");
    var assigned_to_id = formData.get("assigned_to_id");

    const data = {
      main_subject_id: main_course_id ? parseInt(main_course_id.toString()) : 0,
      classroom_id: classroom_id ? parseInt(classroom_id.toString()) : 0,
      subject_code: subject_code ? subject_code : "",
      subject_coefficient: subject_coefficient ? parseInt(subject_coefficient.toString()) : 0,
      subject_type: subject_type ? subject_type : "",
      assigned_to_id: assigned_to_id ? assigned_to_id : 0,
      assigned: true,
      date_assigned: new Date().toISOString().slice(0, 10),
    }


    const response = await ActionCreate(data, SchemaCreateEditSubject, protocol + SubjectUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`)
console.log(searchParams, 102)
    console.log(response, 105)
    if (response.error) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/create?domain=${searchParams.domain}&academic_year=${searchParams.academic_year}&error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects?created=Successfully-Created-${JSON.stringify(response.main_subject.subject_name).replaceAll(" ", "-")}`)
    }
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
                  <SearchMainSubject mainSubjectData={mainSubjectData} />
                </div>

                <div className="flex flex-col text-lg">
                  <label className="block dark:text-white font-medium mb-2 text-black">
                    Search and Select Class
                  </label>
                  <select
                    name='classroom_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={0}>------------------</option>
                    {classroomData && classroomData.map((item: GetClassroomInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                      {item.academic_year} - Class: {item.level__level} {item.level__option}
                    </option>)
                    )}

                  </select>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:gap-4 text-lg">

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Subject Code
                    </label>
                    <input
                      type="text"
                      name="subject_code"
                      required={true}
                      placeholder="Enter Subject Code"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Subject Coefficient
                    </label>
                    <input
                      type="number"
                      name="subject_coefficient"
                      required={true}
                      min={1}
                      placeholder="Enter Subject Coefficient"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Subject Type
                    </label>
                    <select
                      name='subject_type'
                      required={true}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    >
                      <option value={""}>------------------</option>
                      {["General", "Practical", "Other"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                      </option>)
                      )}
                    </select>
                  </div>

                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6 text-lg">

                  <div className="flex flex-col w-1/3">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Select Lecturer
                    </label>
                    <select
                      name='assigned_to_id'
                      required={true}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option value={""}>------------------</option>
                      {lecturerData && lecturerData.map((item: CustomUserInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.full_name}
                      </option>)
                      )}

                    </select>
                  </div>

                </div>

                <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-6 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Save</button>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}
