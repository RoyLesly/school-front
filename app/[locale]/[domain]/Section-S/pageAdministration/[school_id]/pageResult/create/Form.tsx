"use client";
import { ResultUrl } from '@/Domain/Utils-S/appControl/appConfig'
import { GetSubjectInter } from '@/Domain/Utils-S/appControl/appInter'
import { getData } from '@/functions'
import { SchemaCreateEditResult } from '@/Domain/Utils-S/schemas/schemas'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter';
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { protocol } from '@/config';


interface SelectProps {
    subject: GetSubjectInter
    params: { school_id: string }
}
const Form: FC<SelectProps> = ({ subject, params }) => {

    const router = useRouter();
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(true);
    const [apiUserProfile, setApiUserProfile] = useState<GetSecondaryProfileInter[]>()

    useEffect(() => {
        if (count == 0) {
            var getProf = async () => {
                var prof = await getData(protocol + GetSecondaryProfileUrl, {
                    nopage: true, active: true, classroom__id: subject.classroom__id, fieldList: [
                        "id", "classroom__id", "user__full_name", "user__matricle"
                    ]
                })
                if (prof && prof.length > 0) { setApiUserProfile(prof) }
                setCount(1);
            }
            getProf()
        }
        if (count == 1) {
            setSearching(false);
        }
    }, [count, subject])

    const generate = async () => {
        console.log("object");
        var sess = localStorage.getItem("session");
        var token  = jwtDecode(sess ? sess : "")
        setLoading(true);
        if (apiUserProfile && token && token.user_id) {
            await Promise.allSettled(apiUserProfile.map((item: GetSecondaryProfileInter, index: number) => {
                var data = {
                    student_id: item.id,
                    subject_id: subject.id,
                    active: true,
                    created_by_id: token.user_id,
                    updated_by_id: token.user_id
                }
                return (
                    ActionCreate(data, SchemaCreateEditResult, ResultUrl)
                )
            }))
                .then(res => {
                    console.log(87, res)
                    if (res && res.length > 0) {
                        const t = res.map(item => item.status)
                        router.push(`/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`);
                        setLoading(false)
                    }
                })
                .catch(err => {
                    console.log(98, err)
                })
        }

    }

    console.log(apiUserProfile, 48)

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col gap-4 justify-center p-10 rounded-sm shadow-default">

            <div className='flex flex-col gap-2 items-center justify-center text-lg'>
                <div className='font-semibold text-2xl'>GENERATE RESULTS FOR</div>
                <div className='italic'>{subject.main_subject__subject_name}</div>
                <div className='italic'>{subject.classroom__academic_year}</div>
                <div className='italic'>{subject.classroom__level__level}</div>
                <div className='italic'>{subject.classroom__level__option}</div>
            </div>

            {!searching ?
                apiUserProfile && apiUserProfile.length > 0 ?
                    <div className='flex flex-col gap-2'>

                        <div className='bg-bluedark font-semibold grid grid-cols-6 p px-4 py-1 rounded-sm text-white'>
                            <div className='col-span-1'>No</div>
                            <div className='col-span-2'>MATRICLE</div>
                            <div className='col-span-3'>STUDENT NAME</div>
                        </div>
                        {apiUserProfile.map((item: GetSecondaryProfileInter, index: number) => <div key={item.id} className='bg-slate-50 grid grid-cols-6 odd:bg-blue-100 px-4 text-black'>
                            <div className='col-span-1'>{index + 1}</div>
                            <div className='col-span-2'>{item.user__matricle}</div>
                            <div className='col-span-3'>{item.user__full_name}</div>
                        </div>)}

                        {!loading ?
                            <div className='flex items-center justify-center mt-4'>
                                <button onClick={() => generate()} className='bg-bluedark font-semibold px-10 py-2 text-lg text-white'>Generate</button>
                            </div>
                            :
                            <div className='flex items-center justify-center my-10'>
                                <div className="animate-spin border-4 border-primary border-solid border-t-transparent flex h-[30px] items-center justify-center rounded-full w-[30px]"></div>
                            </div>
                        }

                    </div>
                    :
                    <div className='bg-black flex font-semibold italic items-center justify-center py-40 rounded text-2xl text-white tracking-widest w-full'>No Assigned Students To This Class</div>
                :
                <div className='flex items-center justify-center my-10'>
                    <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
                </div>
            }
        </div>
    )
}

export default Form