import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import React, { FC } from 'react'
import Link from 'next/link';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import Form from './Form';
import { protocol } from '@/config';
import { GetSubjectUrl } from '@/Domain/Utils-S/appControl/appConfig';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string };
    searchParams?: { sub: string };
}) => {

    const apiSubject: any = await getData(protocol + GetSubjectUrl, {
        nopage: true, id: searchParams?.sub, fieldList: [
            "id", "classroom__id", "main_subject__subject_name", "classroom__level__level", "classroom__level__option", "classroom__academic_year"
        ]
    })

    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName="SELECT"
                    pageName1="Back"
                    link1={`/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
                />

                {searchParams && apiSubject && apiSubject.length == 1 ? <Form
                    subject={apiSubject[0]}
                    params={params}
                />
                    :
                    <div className='bg-black flex flex-col font-semibold gap-10 items-center justify-center py-32 rounded text-white text-xl'>
                        <div>Admit Student and Assign to Classroom</div>
                        <div>Create Subject and Assign to Classroom</div>
                        <div><Link href={`/pageAdministration/${params.school_id}/pageResult/create`} className='bg-bluedark my-2rounded p-2 px-6'>Generate Results</Link></div>
                    </div>
                }

            </>
        </LayoutAdmin>
    )
}

export default EditPage



export const metadata: Metadata = {
    title:
        "Select-Marks",
    description: "This is Marks Page",
};
