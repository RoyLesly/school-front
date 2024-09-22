import { getData } from '@/functions';
import { GetPublishUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetPublishInter } from '@/Domain/Utils-H/appControl/appInter';
import { Metadata } from 'next';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa6';
import { protocol } from '@/config';
import { GetSchoolFeesUrl, GetTranscriptApplicationUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { TableRowClassName } from '@/constants';
import { GetTranscriptApplicationInter } from '@/Domain/Utils-H/feesControl/feesInter';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import MessageModal from '@/componentsTwo/MessageModal';


export const metadata: Metadata = {
    title: "Exam Page",
    description: "Student Exam Page",
};

const page = async ({
    params,
    searchParams,
}: {
    params: { userprofile_id: string, domain: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const checkIFResultsPublished = (publish: GetPublishInter[] | any) => {
        var response = false;
        if (publish && publish.length) {
            response = true
            for (let index = 0; index < publish.length; index++) {
                const element = publish[index];
                const ObjKeys = Object.keys(element);
                for (let index = 0; index < ObjKeys.length; index++) {
                    if (element[ObjKeys[index]] === false) { response = false; break; };
                }
            }
        }
        return response
    }

    const apiPublish: any = await getData(protocol + "api" + params.domain + GetPublishUrl, {
        specialty__id: params.specialty_id, nopage: true, fieldList: [
            "id", "ca", "exam", "resit", "semester",
        ]
    });
    const apiTranscriptApplication: GetTranscriptApplicationInter[] | undefined = await getData(protocol + "api" + params.domain + GetTranscriptApplicationUrl, {
        nopage: true, userprofile__id: params.userprofile_id, fieldList: [
            "id", "userprofile__specialty__tuition", "userprofile__user__full_name", "userprofile__user__matricle",
            "userprofile__specialty__main_specialty__specialty_name", "status", "created_at",
            "userprofile__specialty__level__level", "userprofile__specialty__academic_year", "status", "created_at",
        ]
    });
    const schoolFeesInfo: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, {
        userprofile__id: params.userprofile_id, nopage: true, fieldList: [
            "id", "userprofile__id", "userprofile__specialty__tuition", "balance", "userprofile__user__full_name",
            "userprofile__user__matricle", "userprofile__specialty__main_specialty__specialty_name",
            "userprofile__specialty__academic_year", "userprofile__specialty__level__level", "platform_paid"
        ]
    });
    const publishStatus = await checkIFResultsPublished(apiPublish);

    return (
        <div className='h-screen mb-20 mt-16 mx-1 p-1 rounded text-black'>

            <div className='flex font-semibold items-center justify-center mb-6 mt-4 text-xl'>TRANSCRIPT REQUEST</div>

            {apiTranscriptApplication && apiTranscriptApplication.length ?
                <div className='flex flex-col gap-2 p-4'>
                    <div className='flex items-center w-full'>
                        <span className='w-30'>Full Name :</span>
                        <span className='bg-white px-4 py-1 rounded w-full'>{apiTranscriptApplication[0].userprofile__user__full_name}</span>
                    </div>
                    <div className='flex items-center w-full'>
                        <span className='w-30'>Class :</span>
                        <span className='bg-white px-4 py-1 rounded w-full'>{apiTranscriptApplication[0].userprofile__specialty__main_specialty__specialty_name}</span>
                    </div>
                    <div className='flex items-center w-full'>
                        <span className='w-30'>Year :</span>
                        <span className='bg-white px-4 py-1 rounded w-full'>{apiTranscriptApplication[0].userprofile__specialty__academic_year}</span>
                    </div>
                    <div className='flex items-center w-full'>
                        <span className='w-30'>Level :</span>
                        <span className='bg-white px-4 py-1 rounded w-full'>{apiTranscriptApplication[0].userprofile__specialty__level__level}</span>
                    </div>
                    <div className='flex items-center w-full'>
                        <span className='w-30'>Status :</span>
                        <span className={`${apiTranscriptApplication[0].status == "PENDING" ? "bg-bluelight" : apiTranscriptApplication[0].status == "APPROVED" ? "bg-green-300" : "bg-green-300"} px-4 py-1 rounded w-full`}>{apiTranscriptApplication[0].status}</span>
                    </div>
                    <div className='flex items-center w-full'>
                        <span className='w-30'>Date Applied: </span>
                        <span className='bg-white px-4 py-1 rounded w-full'>{apiTranscriptApplication[0].created_at.slice(0, 16)}</span>
                    </div>
                </div>
                :
                <>
                    {schoolFeesInfo && schoolFeesInfo.length ?
                        <>
                            <table className="text-black w-full">
                                <thead className="bg-blue-500 border border-slate-700 dark:bg-blue-700 h-8 text-white">
                                    <tr className="font-medium text-left text-lg">
                                        {columns.map((col) => (
                                            <th key={col.accessor} className={col.className}>{col.header}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="border-2 border-slate-300 font-semibold italic px-2 rounded-lg text-lg tracking-wide">
                                    <tr key={1} className={`${TableRowClassName.all + " " + TableRowClassName.lg}`}>
                                        <td className="hidden md:table-cell">{1}</td>
                                        <td className="table-cell">Account Status</td>
                                        <td className="table-cell">{schoolFeesInfo[0].platform_paid ? <GrStatusGood size={30} color='green' /> : <GrClose color='red' />}</td>
                                    </tr>
                                    <tr key={2} className={`${TableRowClassName.all + " " + TableRowClassName.lg}`}>
                                        <td className="hidden md:table-cell">{2}</td>
                                        <td className="table-cell">Tuition Status</td>
                                        <td className="table-cell">{schoolFeesInfo[0].balance == 0 ? <GrStatusGood size={30} color='green' /> : <GrClose color='red' />}</td>
                                    </tr>
                                    <tr key={3} className={`${TableRowClassName.all + " " + TableRowClassName.lg} `}>
                                        <td className="hidden md:table-cell">{3}</td>
                                        <td className="table-cell">All Results Published</td>
                                        <td className="table-cell">{publishStatus ? <GrStatusGood size={30} color='green' /> : <GrClose color='red' />}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {publishStatus && schoolFeesInfo[0].platform_paid && schoolFeesInfo[0].balance == 0 ?
                                <div className="flex items-center justify-center mt-4 p-4 w-full">
                                    <MessageModal
                                        table="confirm_apply_transcript" type="custom" params={params} data={schoolFeesInfo[0]} buttonTitle='Check' customClassName='flex gap-2 rounded py-2 px-6 bg-teal-700 tracking-widest text-white font-semibold' icon={<FaArrowRight size={23} />}
                                        extra_data={[`/${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}`]}
                                    />
                                </div>
                                :
                                <div className="flex font-semibold items-center justify-center my-4 p-4 text-red w-full">
                                    Not Ready
                                </div>
                            }
                        </>
                        :
                        <>No School Fee Info</>
                    }
                </>
            }

        </div>
    )
}

export default page


const columns = [
    {
        header: "No",
        accessor: "item",
        className: "hidden md:table-cell w-1/12",
    },
    {
        header: "Verification",
        accessor: "item",
        className: "table-cell w-10/12 md:w-9/12",
    },
    {
        header: "Status",
        accessor: "status",
        className: "table-cell w-2/12 ",
    },
]