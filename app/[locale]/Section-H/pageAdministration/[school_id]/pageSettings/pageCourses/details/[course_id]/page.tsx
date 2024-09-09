import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { CourseUrl, GetCourseUrl, GetDomainUrl, GetMainCourseUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetCourseInter, GetMainCourseInter, GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { GetCustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { SchemaCreateEditCourse } from '@/NoDomain/schemas/schemas';
import { GetCustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { protocol } from '@/config';

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, course_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiData: any = await getData(protocol + GetCourseUrl, { id: params.course_id, fieldList: [ "id", "course_code", "specialty__id", "assigned_to__id", "main_course__id", "semester", "course_credit", "hours_left", "hours" ] });
    const apiDataDomains: any = await getData(protocol + GetDomainUrl, { ...searchParams, specialty__school__id: params.school_id });

    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName="Course Details"
                    pageName1="Dashboard"
                    pageName2="Courses"
                    link1={`/Section-H/pageAdministration/${params.school_id}`}
                    link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`}
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}
                {apiDataDomains == "ECONNREFUSED" && <ServerError />}
                {apiDataDomains && apiDataDomains.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}

                {apiData.count && apiData != "ECONNREFUSED" && <EditDelete apiData={apiData.results[0]} params={params} />}

            </>
        </LayoutAdmin>
    )
}

export default page


export const metadata: Metadata = {
    title:
        "Course-Detail",
    description: "This is Course Detail Page",
};



interface EditDeleteProps {
    apiData: GetCourseInter
    params: { school_id: string, course_id: string }
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params }) => {

    const apiDataLecturers: any = await getData(protocol + GetCustomUserUrl, { is_active: true, is_superuser: false, notstudent: true, fieldList: [ "id", "full_name", ] });
    const apiDataSpecialties: any = await getData(protocol + GetSpecialtyUrl, { school__campus__id: params.school_id, academic_year: new Date().getFullYear(), nopage: true, fieldList: [ "id", "main_specialty__specialty_name", "academic_year", "level__level",] });
    const apiDataMainCourses: any = await getData(protocol + GetMainCourseUrl, { school__campus__id: params.school_id, academic_year: new Date().getFullYear(), nopage: true, fieldList: [ "id", "course_name" ] });

    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        const main_course_id = formData.get("main_course_id")
        const specialty_id = formData.get("specialty_id")
        const course_code = formData.get("course_code")
        const course_type = formData.get("course_type")
        const semester = formData.get("semester")
        const course_credit = formData.get("course_credit")
        const hours = formData.get("hours")
        const hours_left = formData.get("hours_left")
        const assigned_to_id = formData.get("assigned_to_id")

        if (!assigned_to_id) { return }

        const data = {
            main_course_id: main_course_id ? main_course_id : apiData.main_course__id,
            specialty_id: specialty_id ? specialty_id : apiData.specialty__id,
            course_code: course_code ? course_code : "",
            course_credit: course_credit ? course_credit : "",
            course_type: course_type ? course_type : "",
            semester: semester ? semester : "",
            hours: hours ? hours : "",
            hours_left: hours_left ? hours_left : "",
            assigned_to_id: assigned_to_id,
            date_assigned: apiData.date_assigned ? apiData.date_assigned : new Date().toISOString().slice(0, 10),
            assigned: assigned_to_id ? true : false,
            completed: hours_left == "0" ? true : false,
        }
        const response = await ActionEdit(data, params.course_id, SchemaCreateEditCourse, protocol + CourseUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`)

        if (response.error) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/details/${params.course_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
        }
        if (response.errors) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/details/${params.course_id}?error=${response.errors.replaceAll(" ", "-")}`)
        }
        if (response?.detail) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/details/${params.course_id}?error=${response.detail.replaceAll(" ", "-")}`)
        }
        if (response?.id) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?updated=Successfully-Updated-${JSON.stringify(response.main_course.course_name)}`)
        }
    }

    const onSubmitDeleteAction = async () => {
        'use server'

        const response = await ActionDelete(CourseUrl, params.course_id)

        if (response?.error) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/details/${params.course_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
        }
        if (response?.detail) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/details/${params.course_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
        }
        if (response?.success) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?deleted=Successfuly-Deleted-!!!`)
        }
    }

    console.log(132, apiData)

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

            <div className='md:p-6 p-2'>
                <div className="gap-9 grid grid-cols-1">
                    <div className="flex flex-col gap-9">
                        {/* <!-- Input Fields --> */}
                        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
                            <div className="border-b border-stroke dark:border-strokedark flex justify-between px-4 py-2">
                                <h3 className="dark:text-white font-medium text-black">
                                    Editing  {apiData.main_course__course_name}
                                </h3>
                                <form action={onSubmitDeleteAction} className='flex mb-2'>
                                    <button className='bg-reddark font-semibold md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                                </form>
                            </div>

                            <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>


                                <div className='flex gap-4 justify-between'>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Class
                                        </label>
                                        <select
                                            name="specialty_id"
                                            defaultValue={apiData?.specialty__id}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {apiDataSpecialties && apiDataSpecialties.sort((a: GetSpecialtyInter, b: GetSpecialtyInter) => (a.main_specialty__specialty_name > b.main_specialty__specialty_name ? 1 : a.main_specialty__specialty_name < b.main_specialty__specialty_name ? -1 : 0)).map((item: GetSpecialtyInter) => (
                                                <option key={item.id} value={item.id}>{item.main_specialty__specialty_name} - {item.academic_year} - {item.level__level}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Course
                                        </label>
                                        <select
                                            name="main_course_id"
                                            defaultValue={apiData.main_course__id}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {apiDataMainCourses && apiDataMainCourses && apiDataMainCourses.sort((a: GetMainCourseInter, b: GetMainCourseInter) => (a.course_name > b.course_name ? 1 : a.course_name < b.course_name ? -1 : 0)).map((item: GetMainCourseInter) => (
                                                <option key={item.id} value={item.id}>{item.course_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2 md:flex-row'>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Course Code
                                        </label>
                                        <input
                                            type="text"
                                            name="course_code"
                                            placeholder={apiData.course_code}
                                            defaultValue={apiData.course_code}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Course Credit
                                        </label>
                                        <input
                                            type="number"
                                            name="course_credit"
                                            placeholder={apiData.course_credit}
                                            defaultValue={apiData.course_credit}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Course Type
                                        </label>
                                        <select
                                            name="course_type"
                                            defaultValue={apiData.course_type}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {["Fundamental", "Professional", "Transversal"].map((item: string) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>



                                <div className='flex flex-col gap-2 md:flex-row w-full'>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Course Hours
                                        </label>
                                        <input
                                            type="number"
                                            name="hours"
                                            defaultValue={apiData.hours}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Hours Left
                                        </label>
                                        <input
                                            type="number"
                                            name="hours_left"
                                            defaultValue={apiData.hours_left}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Semester
                                        </label>
                                        <select
                                            name="semester"
                                            defaultValue={apiData.semester}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {["I", "II"].map((item: string) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>



                                <div className='flex flex-col gap-2 md:flex-row'>

                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Course Instructor
                                        </label>
                                        <select
                                            name="assigned_to_id"
                                            defaultValue={apiData?.assigned_to__id}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            <option value="">--------------------</option>
                                            {apiDataLecturers && apiDataLecturers.results.sort((a: GetCustomUserInter, b: GetCustomUserInter) => (a.first_name > b.first_name ? 1 : a.first_name < b.first_name ? -1 : 0)).map((item: GetCustomUserInter) => (
                                                <option key={item.id} value={item.id}>{item.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="bg-bluedark bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mt-10 px-5 py-2.5 rounded text-center text-lg text-white tracking-widest w-full">Edit</button>

                            </form>

                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}