import { Metadata } from 'next'
import React, { Suspense } from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Transcript from './Transcript'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { GetResultTranscriptUrl, GetSchoolInfoUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetSchoolFeesUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { protocol } from '@/config'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string,  domain: string, profile_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiMyResultsI: any = await getData(protocol + "api" + params.domain + GetResultTranscriptUrl, { student__id: params.profile_id, course__semester: "I", fieldList: ["id", "course__main_course__course_name", "course__course_code", "course__course_credit", "course__semester", "ca", "exam", "resit", "average", "validated", "wp"] });
    const apiMyResultsII: any = await getData(protocol + "api" + params.domain + GetResultTranscriptUrl, { student__id: params.profile_id, course__semester: "II", fieldList: ["id", "course__main_course__course_name", "course__course_code", "course__course_credit", "course__semester", "ca", "exam", "resit", "average", "validated", "wp"] });
    const apiMyResultsAll: any = await getData(protocol + "api" + params.domain + GetResultTranscriptUrl, { student__id: params.profile_id, fieldList: ["id", "course__main_course__course_name", "course__course_code", "course__course_credit", "course__semester", "ca", "exam", "resit", "average", "validated", "wp"] });
    const apiSchoolFees: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, { userprofile__id: params.profile_id, fieldList: ["id", "platform_charges", "platform_paid", "balance"] });
    const apiSchoolInfo: any = await getData(protocol + "api" + params.domain + GetSchoolInfoUrl, { campus__id: params.school_id, fieldList: ["id", "school_name", "address", "town", "po_box", "email", "telephone_one", "niu", "region", "country", "website", "telephone_two", "director"] });
    const apiStudentInfo: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.profile_id, fieldList: ["id", "user__matricle", "user__full_name", "user__sex", "user__dob", "user__pob", "user__email", "user__telephone", "program__name", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level", "specialty__main_specialty__field__field_name", "specialty__main_specialty__field__domain__domain_name"] });

    if (apiStudentInfo && apiStudentInfo.unauthorized) {
        redirect(`/pageAuthentication/pageSessionExpired`)
    } else {
        return (
            <LayoutAdmin>
                <>
                    <Breadcrumb
                        pageName="Generate Transcript"
                        pageName1="Back"
                        link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`}

                    />

                    <Suspense fallback={<div>Loading ...</div>}>
                        <div className='bg-black flex flex-col gap-4 p-4 rounded'>
                            {apiSchoolFees && apiSchoolFees.count && apiSchoolFees.results[0].balance < 0 ?
                                <div className="bg-white flex flex-col font-medium h-full italic items-center justify-center py-40 text-xl tracking-widest">
                                    <span>School Fee Not Completed</span>
                                    <Link href={`/pageAdministration/${params.school_id}/pageStudents/details/${params.profile_id}/fees`} className='bg-bluedash my-6 px-10 py-2 rounded text-white'>Goto Payment</Link>
                                </div>
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
                                            <div className='flex flex-col items-center p-40 text-lg text-white tracking-widest'>
                                                <h1 className="flex font-semibold text-center">No Results Found !!!</h1>
                                                <div className="flex text-center">Possible Causes</div>
                                                <div>NO COURSE ASSIGNED TO THIS CLASS</div>
                                                <div>NO COURSE FOR EITHER SEMESTER 1 OR SEMESTER 2</div>
                                                <div>NO RESULTS FOR THIS STUDENT</div>
                                            </div>
                                        : 
                                        <div className='flex font-semibold items-center justify-center py-40 text-white text-xl tracking-widest'>NO SCHOOL FEE DATA</div>
                            }
                        </div>
                    </Suspense>

                </>
            </LayoutAdmin>
        )
    }
}

export default page

export const metadata: Metadata = {
    title: "Transcript",
    description: "This is Transcript Page",
};
