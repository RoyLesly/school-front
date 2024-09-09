import { Metadata } from 'next'
import React, { Suspense } from 'react'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig'
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter'
import Link from 'next/link'
import { GetResultTranscriptUrl, GetSchoolInfoUrl } from '@/Domain/Utils-S/appControl/appConfig'
import { GetSecSchoolFeesUrl } from '@/Domain/Utils-S/feesControl/feesConfig'
import { redirect } from 'next/navigation'
import TransLayoutAll from './TransLayoutAll'
import { protocol } from '@/config'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, profile_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiMyResults: any = await getData(protocol + GetResultTranscriptUrl, { student__id: params.profile_id });
    const apiSchoolFees: any = await getData(protocol + GetSecSchoolFeesUrl, { userprofile__id: params.profile_id, nopage: true, fieldList: ["id", "platform_charges", "platform_paid", "balance"] });
    const apiSchoolInfo: any = await getData(protocol + GetSchoolInfoUrl, { campus__id: params.school_id, nopage: true, fieldList: ["id", "school_name", "address", "town", "po_box", "email", "telephone_one", "niu", "campus__region", "country", "website"] });
    const apiStudentInfo: any = await getData(protocol + GetSecondaryProfileUrl, { id: params.profile_id, nopage: true, fieldList: ["id", "user__matricle", "user__full_name", "user__sex", "user__dob", "user__email", "user__pob", "classroom__level__level", "classroom__level__option", "classroom__academic_year", "classroom__domain"] });

    console.log(apiSchoolInfo, 27)
    if (apiStudentInfo && apiStudentInfo.unauthorized) {
        redirect(`/pageAuthentication/pageSessionExpired`)
    } else {
        return (
            <LayoutAdmin>
                <>
                    <Breadcrumb
                        pageName="Generate Final Report Card"
                        pageName1="Back"
                        link1={`/Section-S/pageAdministration/${params.school_id}/pageResult/pageTranscript`}

                    />

                    <Suspense fallback={<div>Loading ...</div>}>
                        <div className='bg-black flex flex-col gap-4 p-4 rounded'>
                            {apiSchoolFees && apiSchoolFees.length > 0 && apiSchoolFees[0].balance < 0 ?
                                <div className="bg-white flex flex-col font-medium h-full italic items-center justify-center py-40 text-xl tracking-widest">
                                    <span>School Fee Not Completed</span>
                                    <Link href={`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.profile_id}/fees`} className='bg-bluedash my-6 px-10 py-2 rounded text-white'>Goto Payment</Link>
                                </div>
                                :
                                apiSchoolFees && apiSchoolFees.length > 0 ?
                                    apiSchoolFees[0].platform_paid ?
                                        <div className='flex font-semibold items-center justify-center py-40 text-white text-xl tracking-widest'>
                                            <span>Account Not Active</span>
                                            <Link href={`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${apiSchoolFees[0].id}`} className="bg-bluedark px-6 py-1 rounded text-white">Activate</Link>
                                        </div>
                                        :
                                        apiMyResults ?
                                            apiStudentInfo && apiSchoolInfo && apiStudentInfo.length > 0 && apiSchoolInfo.length > 0 ? 
                                                <TransLayoutAll results={apiMyResults} schoolinfo={apiSchoolInfo[0]} studentInfo={apiStudentInfo[0]} /> 
                                                : 
                                                <div className='flex flex-col font-semibold gap-10 items-center justify-center py-40 text-white text-xl tracking-widest'>
                                                    <div>NO STUDENT INFORMATION</div>
                                                    <div>NO SCHOOL INFORMATION</div>
                                                </div>
                                            : 
                                            <div className='flex flex-col font-semibold gap-10 items-center justify-center py-40 text-white text-xl tracking-widest'>
                                                <div>NO SUBJECT ASSIGNED TO THIS CLASS</div>
                                                <div>OR</div>
                                                <div>NO MARKS AVAILABLE FOR THIS STUDENT</div>
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


const GenerateTranscript = async ({ searchParams, params }: any) => {
    const apiData = await getData(GetSecondaryProfileUrl, {
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

                    apiData.results.map((item: GetSecondaryProfileInter) => (
                        <div key={item.id} className="border-stroke border-t dark:border-strokedark even:bg-slate-200 font-semibold grid grid-cols-4 md:grid-cols-6 md:px-6 md:text-lg px-4 py-2">
                            <div className='col-span-3 flex items-center justify-start'>{item.secondary_classroom__academic_year}</div>
                            <div className='col-span-2 flex items-center justify-between md:px-2 w-full'>
                                <div>{item.secondary_classroom__level__level}</div>
                                <div>{item.secondary_classroom__level__option}</div>
                            </div>
                            <div className='flex items-center justify-center tracking-widest'>
                                <Link href={`/Section-S/pageAdministration/${params.school_id}/pageResult/pageTranscript/${item.id}`} className="bg-bluedark px-4 py-1 rounded text-white">Select</Link>
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