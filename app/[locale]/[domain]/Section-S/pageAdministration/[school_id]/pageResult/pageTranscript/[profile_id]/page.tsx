import { Metadata } from 'next'
import React, { Suspense } from 'react'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, profile_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiStudentInfo: any = await getData(GetSecondaryProfileUrl, { id: params.profile_id, nopage: true, fieldList: ["id", "user__matricle", "user__full_name", "user__sex", "user__dob", "user__email", "user__pob", "classroom__level__level", "classroom__level__option", "classroom__academic_year", "classroom__domain"] });

    if (apiStudentInfo && apiStudentInfo.unauthorized) {
        redirect(`/pageAuthentication/pageSessionExpired`)
    } else {
        return (
            <LayoutAdmin>
                <>
                    <Breadcrumb
                        pageName="Generate Report Card"
                        pageName1="Back"
                        link1={`/pageAdministration/${params.school_id}/pageResult/pageTranscript`}

                    />

                    <div className='flex flex-col gap-10 items-center justify-center m-4 py-32'>
                        <Link href={`/pageAdministration/${params.school_id}/pageResult/pageTranscript/${params.profile_id}/pageTerm?term=1`} className='bg-bluedark font-semibold md:w-[300px] py-4 rounded-lg text-2xl text-center text-white tracking-widest'>First Term</Link>
                        <Link href={`/pageAdministration/${params.school_id}/pageResult/pageTranscript/${params.profile_id}/pageTerm?term=2`} className='bg-bluedark font-semibold md:w-[300px] py-4 rounded-lg text-2xl text-center text-white tracking-widest'>Second Term</Link>
                        <Link href={`/pageAdministration/${params.school_id}/pageResult/pageTranscript/${params.profile_id}/pageTerm?term=3`} className='bg-bluedark font-semibold md:w-[300px] py-4 rounded-lg text-2xl text-center text-white tracking-widest'>Third Term</Link>
                        <Link href={`/pageAdministration/${params.school_id}/pageResult/pageTranscript/${params.profile_id}/pageAll`} className='bg-bluedark font-semibold md:w-[300px] my-4 py-4 rounded-lg text-2xl text-center text-white tracking-widest'>Final Report Card</Link>
                    </div>

                </>
            </LayoutAdmin>
        )
    }
}

export default page

export const metadata: Metadata = {
    title: "Select Type",
    description: "This is Select Type Page",
};