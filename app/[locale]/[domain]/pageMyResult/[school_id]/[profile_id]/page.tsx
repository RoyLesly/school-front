import { Metadata } from 'next'
import React, { Suspense } from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Transcript from './Transcript'
import { GetResultTranscriptUrl, GetSchoolInfoUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetSchoolFeesUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { protocol } from '@/config'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, profile_id: string, domain: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {
    const domain = params.domain

    const apiMyResultsI: any = await getData(protocol + "api" + domain + GetResultTranscriptUrl, { student__id: params.profile_id, course__semester: "I", fieldList: ["id", "course__main_course__course_name", "course__course_code", "course__course_credit", "course__semester", "ca", "exam", "resit", "average", "validated", "wp"] });
    const apiMyResultsII: any = await getData(protocol + "api" + domain + GetResultTranscriptUrl, { student__id: params.profile_id, course__semester: "II", fieldList: ["id", "course__main_course__course_name", "course__course_code", "course__course_credit", "course__semester", "ca", "exam", "resit", "average", "validated", "wp"] });
    const apiMyResultsAll: any = await getData(protocol + "api" + domain + GetResultTranscriptUrl, { student__id: params.profile_id, fieldList: ["id", "course__main_course__course_name", "course__course_code", "course__course_credit", "course__semester", "ca", "exam", "resit", "average", "validated", "wp"] });
    const apiSchoolFees: any = await getData(protocol + "api" + domain + GetSchoolFeesUrl, { userprofile__id: params.profile_id, fieldList: ["id", "platform_charges", "platform_paid", "balance"] });
    const apiSchoolInfo: any = await getData(protocol + "api" + domain + GetSchoolInfoUrl, { campus__id: params.school_id, fieldList: ["id", "school_name", "address", "town", "po_box", "email", "telephone_one", "niu", "region", "country", "website"] });
    const apiStudentInfo: any = await getData(protocol + "api" + domain + GetUserProfileUrl, { id: params.profile_id, fieldList: ["id", "user__matricle", "user__full_name", "user__sex", "user__dob", "user__email", "user__telephone", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level", "specialty__main_specialty__field__field_name", "specialty__main_specialty__field__domain__domain_name"] });

    if (apiStudentInfo && apiStudentInfo.unauthorized) {
        redirect(`/pageAuthentication/pageSessionExpired`)
    } else {
        return (
                <div className='p-6'>
                    <Breadcrumb
                        pageName="Generate Transcript"
                        pageName1="Back"
                        link1={`/pageAdministration/${params.school_id}/pageResult/pageTranscript`}

                    />

                    <Suspense fallback={<div>Loading ...</div>}>
                        <div className='bg-black flex flex-col gap-4 p-4 rounded'>
                            {apiSchoolFees && apiSchoolFees.count && apiSchoolFees.results[0].balance > 0 ?
                                <div className="bg-white flex font-medium h-full italic items-center justify-center py-40 text-xl tracking-widest">School Fee Not Completed</div>
                                :
                                apiSchoolFees && apiSchoolFees.count && !apiSchoolFees.results[0].platform_paid ?
                                    <div className="bg-white flex font-medium h-full italic items-center justify-center py-40 text-xl tracking-widest">Platform Charge Not completed</div>
                                    :
                                    apiSchoolFees.count ? 
                                        apiMyResultsI && apiMyResultsII && apiMyResultsI.count && apiMyResultsII.count ?
                                            apiStudentInfo && apiSchoolInfo && apiStudentInfo.count && apiSchoolInfo.count ? <Transcript resultI={apiMyResultsI} resultII={apiMyResultsII} resultAll={apiMyResultsAll} params={params} schoolinfo={apiSchoolInfo.results[0]} studentInfo={apiStudentInfo.results[0]} /> 
                                                : 
                                                <div className='flex font-semibold items-center justify-center py-40 text-white text-xl tracking-widest'>NO STUDNET INFO</div>
                                            : 
                                            <div className='flex font-semibold items-center justify-center py-40 text-lg text-white tracking-widest'>NO COURSE ASSIGNED TO THIS CLASS</div>
                                        : 
                                        <div className='flex font-semibold items-center justify-center py-40 text-white text-xl tracking-widest'>NO SCHOOL FEE DATA</div>
                            }
                        </div>
                    </Suspense>

                </div>
        )
    }
}

export default page

export const metadata: Metadata = {
    title: "Transcript",
    description: "This is Transcript Page",
};


const GenerateTranscript = async ({ searchParams, params }: any) => {
    const apiData = await getData(GetUserProfileUrl, {
        ...searchParams, user__is_active: true, fieldList: [
            "id",
            "user__matricle",
            "user__full_name",
            "specialty__main_specialty__specialty_name",
            "specialty__academic_year",
            "specialty__level__level",
        ]
    })

    console.log(apiData)

    return (
        <div className='flex flex-col gap-4 px-2'>

            {apiData && apiData.count && <div className='flex flex-col gap-2 px-4'>
                <div>
                    <span className="flex items-center justify-start text-xl w-full">Full Name: {apiData.results[0].user__full_name}</span>
                    <h1 className="flex items-center justify-start text-xl w-full">Matricle: {apiData.results[0].user__matricle}</h1>
                    <h1 className="flex items-center justify-start text-xl w-full">Telephone: {apiData.results[0].user__telephone}</h1>
                    <h1 className="flex items-center justify-start text-xl w-full">Email: {apiData.results[0].user__email}</h1>
                </div>
            </div>}

            <div className='flex flex-col'>

                <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-6 md:px-6 md:text-lg px-4 py-2 text-white tracking-wider">
                    <div className="col-span-3 flex items-center">
                        <span>Class</span>
                    </div>
                    <div className='col-span-2 flex justify-between md:px-2 w-full'>
                        <span className="font-medium">Year</span>
                        <span className="font-medium">Level</span>
                    </div>
                    <div className="flex items-center justify-center text-center">
                        <span className="font-medium">Action</span>
                    </div>
                </div>

                {apiData && apiData.count ?

                    apiData.results.map((item: GetUserProfileInter) => (
                        <div key={item.id} className="border-stroke border-t dark:border-strokedark even:bg-slate-200 font-semibold grid grid-cols-4 md:grid-cols-6 md:px-6 md:text-lg px-4 py-2">
                            <div className='col-span-3 flex items-center justify-start'>{item.specialty__main_specialty__specialty_name}</div>
                            <div className='col-span-2 flex items-center justify-between md:px-2 w-full'>
                                <div>{item.specialty__academic_year}</div>
                                <div>{item.specialty__level__level}</div>
                            </div>
                            <div className='flex items-center justify-center tracking-widest'>
                                <Link href={`/pageAdministration/${params.school_id}/pageResult/pageTranscript/${item.id}`} className="bg-bluedark px-4 py-1 rounded text-white">Select</Link>
                            </div>
                        </div>
                    ))

                    :
                    <div>No Student With This Matricle</div>
                }
            </div>
        </div>
    )
}