import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import SearchMainCourse from './SearchMainCourse';
import { CourseUrl, GetMainCourseUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetCustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { SchemaCreateEditCourse } from '@/NoDomain/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import { GetCustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const specialtyData: any = await getData(protocol + GetSpecialtyUrl, {...searchParams, school__id: params.school_id, fieldList: ["id", "academic_year", "level__level", "main_specialty__specialty_name"] })
  const mainCourseData: any = await getData(protocol + GetMainCourseUrl, { nopage: true, fieldList: ["id", "course_name"]})

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Create Course" 
          pageName1="Settings" 
          pageName2="Courses" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`}
        />


        {searchParams && <NotificationError errorMessage={searchParams} />}
        {specialtyData == "ECONNREFUSED" && <ServerError />}
        {specialtyData && specialtyData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {specialtyData && specialtyData.results && <Create params={params} specialtyData={specialtyData} mainCourseData={mainCourseData} />}
        
        

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

const Create = async ({ params, specialtyData, mainCourseData }: any) => {

  const lecturerData: any = await getData(protocol +  GetCustomUserUrl, { role: "teacher", nopage: true, is_active: true, is_staff: false, school__id: params.school_id });
  const adminData: any = await getData(protocol +  GetCustomUserUrl, { role: "admin", nopage: true, is_active: true, is_staff: false, school__id: params.school_id });

  if (mainCourseData == "ECONNREFUSED") return <ServerError />
  if (lecturerData == "ECONNREFUSED") return <ServerError />


  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    var main_course_id = formData.get("main_course_id");
    var specialty_id = formData.get("specialty_id");
    var course_code = formData.get("course_code");
    var course_credit = formData.get("course_credit");
    var course_type = formData.get("course_type");
    var semester = formData.get("semester");
    var hours = formData.get("hours");
    var assigned_to_id = formData.get("assigned_to_id");

    const data = {
      main_course_id: main_course_id != "0" ? main_course_id : 0,
      specialty_id: specialty_id != "0" ? specialty_id : 0,
      course_code: course_code ? course_code.toString().toUpperCase() : "",
      course_credit: course_credit != "0" ? course_credit: 0,
      course_type: course_type ? course_type : "",
      semester: semester != "" ? semester : 0,
      hours: hours ? hours : 0,
      hours_left: hours ? hours : 0,
      completed: false,
      paid: false,
      assigned_to_id: assigned_to_id ? assigned_to_id : 0,
      assigned: true,
      date_assigned: new Date().toISOString().slice(0, 10),
    }

    const response = await ActionCreate(data, SchemaCreateEditCourse, protocol + CourseUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?created=Successfully-Created-${JSON.stringify(response.main_course.course_name).replaceAll(" ", "-")}`)
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
                  <SearchMainCourse mainCourseData={mainCourseData} />
                </div>

                <div className="flex flex-col text-lg">
                  <label className="block dark:text-white font-medium mb-2 text-black">
                    Select and Select Specialty
                  </label>
                  <select
                    name='specialty_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                      true ? "text-black dark:text-white" : ""
                    }`}
                  >
                    <option value={0}>------------------</option>
                    {specialtyData.results && specialtyData.results.map((item: GetSpecialtyInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                      {item.main_specialty__specialty_name} - {item.academic_year} - {item.level__level} - 
                      </option>)
                    )}
                    
                  </select>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:gap-4 text-lg">

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Course Code
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      required={true}
                      placeholder="Enter Course Code"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Course Credit
                    </label>
                    <input
                      type="number"
                      name="course_credit"
                      required={true}
                      min={1}
                      placeholder="Enter Course Credit"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Course Type
                    </label>
                    <select
                      name='course_type'
                      required={true}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    >
                      <option value={""}>------------------</option>
                      {[ "Fundamental", "Transversal", "Professional"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                        </option>)
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Semester
                    </label>
                    <select
                      name='semester'
                      required={true}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    >
                      <option value={""}>------------------</option>
                      {[ "I", "II"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                        </option>)
                      )}
                    </select>
                  </div>

                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6 text-lg">

                  <div className="flex flex-col w-2/3">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Course Hours
                    </label>
                    <input
                      type="number"
                      name="hours"
                      required={true}
                      placeholder="Enter Course Hours"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-1/3">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Select Lecturer
                    </label>
                    <select
                      name='assigned_to_id'
                      required={true}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                        true ? "text-black dark:text-white" : ""
                      }`}
                    >
                      <option value={0}>------------------</option>
                      {lecturerData && lecturerData.length > 0 && lecturerData.map((item: GetCustomUserInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.full_name}
                      </option>)
                      )}
                      {adminData && adminData.length > 0 && adminData.map((item: GetCustomUserInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
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
