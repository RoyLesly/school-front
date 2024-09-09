import { GetSubjectUrl, GetMainSubjectUrl, GetClassroomUrl, SubjectUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { GetSubjectInter, GetMainSubjectInter, GetClassroomInter} from '@/NoDomain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaCreateEditSubject } from '@/NoDomain/Utils-S/schemas/schemas';
import { ActionEdit, DeleteAction } from '@/serverActions/actionGeneral';
import { GetCustomUserUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { GetCustomUserInter } from '@/NoDomain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { protocol } from '@/config';

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, subject_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiData: any = await getData(protocol + GetSubjectUrl, { id: params.subject_id, fieldList: [ 
        "id", "subject_code", "subject_type", "classroom__id", "assigned_to__id", "main_subject__id", "subject_coefficient",
        "main_subject__subject_name", "main_subject__id",
    ] });

    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName="Subject Details"
                    pageName1="Dashboard"
                    pageName2="Subjects"
                    link1={`/Section-S/pageAdministration/${params.school_id}`}
                    link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`}
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}

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
    apiData: GetSubjectInter
    params: { school_id: string, subject_id: string }
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params }) => {

    const apiDataLecturers: any = await getData(GetCustomUserUrl, { is_active: true, is_superuser: false, notstudent: true, fieldList: [ "id", "full_name", ] });
    const apiDataClassrooms: any = await getData(GetClassroomUrl, { school__campus__id: params.school_id, academic_year: new Date().getFullYear(), nopage: true, fieldList: [ "id", "level__level", "level__option", "academic_year",] });
    const apiDataMainSubjects: any = await getData(GetMainSubjectUrl, { school__campus__id: params.school_id, academic_year: new Date().getFullYear(), nopage: true, fieldList: [ "id", "subject_name" ] });
    {apiDataClassrooms == "ECONNREFUSED" && <ServerError />}
    {apiDataClassrooms && apiDataClassrooms.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        const main_subject_id = formData.get("main_subject_id")
        const classroom_id = formData.get("classroom_id")
        const subject_code = formData.get("subject_code")
        const subject_type = formData.get("subject_type")
        const subject_coefficient = formData.get("subject_coefficient")
        const assigned_to_id = formData.get("assigned_to_id")

        if (!assigned_to_id) { return }

        const data = {
            main_subject_id: main_subject_id ? main_subject_id : apiData.main_subject__id,
            classroom_id: classroom_id ? parseInt(classroom_id.toString()) : 0,
            subject_code: subject_code ? subject_code : "",
            subject_coefficient: subject_coefficient ? parseInt(subject_coefficient.toString()) : 0,
            subject_type: subject_type ? subject_type : "",
            assigned_to_id: assigned_to_id,
            date_assigned: apiData.date_assigned ? apiData.date_assigned : new Date().toISOString().slice(0, 10),
            assigned: assigned_to_id ? true : false,
        }

        const response = await ActionEdit(data, parseInt(params.subject_id), SchemaCreateEditSubject, SubjectUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`)

        if (response.error) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/details/${params.subject_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
        }
        if (response.errors) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/details/${params.subject_id}?error=${response.errors.replaceAll(" ", "-")}`)
        }
        if (response?.detail) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/details/${params.subject_id}?error=${response.detail.replaceAll(" ", "-")}`)
        }
        if (response?.id) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects?updated=Successfully-Updated-${JSON.stringify(response.main_subject.subject_name)}`)
        }
    }

    const onSubmitDeleteAction = async () => {
        'use server'

        const response = await DeleteAction(SubjectUrl, params.subject_id)

        if (response?.error) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/details/${params.subject_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
        }
        if (response?.detail) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/details/${params.subject_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
        }
        if (response?.success) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects?deleted=Successfuly-Deleted-!!!`)
        }
    }

    console.log(apiData, 127)

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

            <div className='md:p-6 p-2'>
                <div className="gap-9 grid grid-cols-1">
                    <div className="flex flex-col gap-9">
                        {/* <!-- Input Fields --> */}
                        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
                            <div className="border-b border-stroke dark:border-strokedark flex justify-between px-4 py-2">
                                <h3 className="dark:text-white font-medium text-black">
                                    Editing  {apiData.main_subject__subject_name}
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
                                            name="classroom_id"
                                            defaultValue={apiData?.classroom__id}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {apiDataClassrooms && apiDataClassrooms.sort((a: GetClassroomInter, b: GetClassroomInter) => (a.level__level > b.level__level ? 1 : a.level__level < b.level__level ? -1 : 0)).map((item: GetClassroomInter) => (
                                                <option key={item.id} value={item.id}>{item.level__level} - {item.level__option} {item.academic_year} </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Subject Title
                                        </label>
                                        <select
                                            name="main_subject_id"
                                            defaultValue={apiData.main_subject__id}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {apiDataMainSubjects && apiDataMainSubjects && apiDataMainSubjects.sort((a: GetMainSubjectInter, b: GetMainSubjectInter) => (a.subject_name > b.subject_name ? 1 : a.subject_name < b.subject_name ? -1 : 0)).map((item: GetMainSubjectInter) => (
                                                <option key={item.id} value={item.id}>{item.subject_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2 md:flex-row'>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Subject Code
                                        </label>
                                        <input
                                            type="text"
                                            name="subject_code"
                                            placeholder={apiData.subject_code}
                                            defaultValue={apiData.subject_code}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Subject Coefficient
                                        </label>
                                        <input
                                            type="number"
                                            name="subject_coefficient"
                                            placeholder={apiData.subject_coefficient}
                                            defaultValue={apiData.subject_coefficient}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block dark:text-white font-semibold mb-3 text-black">
                                            Subject Type
                                        </label>
                                        <select
                                            name="subject_type"
                                            defaultValue={apiData.subject_type}
                                            className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-2 rounded-lg text-black transition w-full"
                                        >
                                            {["General", "Practical", "Other"].map((item: string) => (
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