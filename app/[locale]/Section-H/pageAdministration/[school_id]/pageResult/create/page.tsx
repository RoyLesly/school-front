import { getData } from '@/functions';
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin';
import { getSession } from '@/serverActions/sessionAction';
import { GetCourseUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetCourseInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter';
import React from 'react'
import CreateMissingResults from './CreateMissingResultsD';
import Link from 'next/link';
import { protocol } from '@/config';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';


const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, publish_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {
    const subj: GetCourseInter[] = await getData(protocol + GetCourseUrl, {
        id: searchParams?.sub, nopage: true, fieldList: [
            "id", "course_code", "course_type", "course_credit", "specialty__main_specialty__specialty_name",
            "main_course__course_name", "specialty__id",
            "specialty__academic_year", "specialty__level__level"
        ]
    })

    return (
        <LayoutAdmin>
            <Breadcrumb
                pageName='Create Results'
            />

            {subj && subj.length == 1 && <Create subject={subj[0]} params={params} searchParams={searchParams} />}

        </LayoutAdmin>
    )
}

export default page



const Create = async ({ subject, params, searchParams }: any) => {
    console.log(subject, 19)
    const session = await getSession();

    const students: GetUserProfileInter[] = await getData(protocol + GetUserProfileUrl, { nopage: true, specialty__id: subject.specialty__id, fieldList: ["id", "user__telephone", "user__full_name", "user__matricle"] })

    return <div className='flex flex-col gap-4 md:flex-row'>
        <div className='flex flex-col gap-6 justify-center'>
            <div className='bg-white flex flex-col gap-2 p-10 rounded w-[500px]'>
                <div className='flex font-semibold items-center justify-center pb-4 text-[24px]'>Subject Info</div>
                <div className='flex gap-4'><span className='w-40'>Subject Name :</span><span className='w-full'>{subject.main_course__course_name}</span></div>
                <div className='flex gap-4'><span className='w-40'>Subject Code :</span><span className='w-full'>{subject.course_code}</span></div>
                <div className='flex gap-4'><span className='w-40'>Subject Credit :</span><span className='w-full'>{subject.course_credit}</span></div>
                <div className='flex gap-4'><span className='w-40'>Subject Type :</span><span className='w-full'>{subject.course_type}</span></div>
            </div>
            <div className='bg-white flex flex-col p-10 rounded w-[500px]'>
                <div className='flex font-semibold gap-2 items-center justify-center pb-4 text-[24px]'>Specialty Info</div>
                <div className='flex gap-4'><span className='w-40'>Specialty :</span><span className=''>{subject.specialty__main_specialty__specialty_name}</span></div>
                <div className='flex gap-4'><span className='w-40'>Academic Year :</span><span>{subject.specialty__academic_year}</span></div>
                <div className='flex gap-4'><span className='w-40'>Level :</span><span>{subject.specialty__level__level}</span></div>
            </div>

            {students && students.length > 0 && <CreateMissingResults filB={students} params={params} session={session} subject_id={searchParams?.sub} />}

            <div></div>
        </div>

        <div className='flex flex-col gap-2 w-full'>
            <div className='bg-bluedark font-medium grid grid-cols-11 px-2 text- text-[14px] text-white'>
                <span className='col-span-1'>No</span>
                <span className='col-span-2'>Matricle</span>
                <span className='col-span-5'>Full Name</span>
                <span className='col-span-3'>Telephone</span>
            </div>

            {students && students.length > 0 ? students.map((item: GetUserProfileInter, index: number) => (
                <div key={item.id} className='bg-white font-medium grid grid-cols-11 odd:bg-blue-50 px-2 rounded text-[14px] text-black'>
                    <span className='col-span-1'>{index + 1}</span>
                    <span className='col-span-2'>{item.user__matricle}</span>
                    <span className='col-span-5'>{item.user__full_name}</span>
                    <span className='col-span-3'>{item.user__telephone}</span>
                </div>
            )) 
            : 
            <div className='bg-slate-500 flex-col font-semibold gap-6 grid items-center justify-center pb-32 pt-32 rounded text-2xl text-white tracking-widest'>
                <div>No Students Found !!!</div>
                <Link href={`/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned`} className='bg-bluedark border px-6 py-1 rounded text-center'>Assign Student</Link>
            </div>
            }

        </div>
    </div>
}