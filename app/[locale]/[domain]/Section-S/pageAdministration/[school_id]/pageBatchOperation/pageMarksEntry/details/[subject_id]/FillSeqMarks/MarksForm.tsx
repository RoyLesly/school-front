'use client';
import { SelectedResultInter } from '@/Domain/Utils-H/interfaces';
import { ResultUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { GetResultInter } from '@/Domain/Utils-S/appControl/appInter';
import { SchemaCreateEditResult } from '@/Domain/Utils-S/schemas/schemas';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { SessionInter } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaArrowRight} from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { GrStatusGood } from 'react-icons/gr'

const MarksForm = ({ resultData, params, searchParams }: any) => {

    const router = useRouter();
    const [submitClicked, setSubmitClicked] = useState<boolean>(false);
    const [ArrayMarks, setArrayMarks] = useState<SelectedResultInter[]>();
    const [ArrayMarksToSubmit, setArrayMarksToSubmit] = useState<SelectedResultInter[]>();
    const [ArrayMarksToSubmitIDs, setArrayMarksToSubmitIDs] = useState<number[]>();

    const FieldChanged = (e: any, result: GetResultInter) => {
        if (ArrayMarksToSubmitIDs && ArrayMarksToSubmitIDs.length > 0) {
            var a = ArrayMarksToSubmitIDs.filter((item: number) => item != result.id)
            setArrayMarksToSubmitIDs(a);
        }
        if (ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0) {
            var b = ArrayMarksToSubmit.filter((item: SelectedResultInter) => item.id != result.id)
            setArrayMarksToSubmit(b);
        }
        var access = localStorage.getItem("session")
        var token: SessionInter | any = {}
        var user_id: number = 0
        if (access){ 
            token = jwtDecode(access);
            user_id = token.user_id
        }
        var newRes: SelectedResultInter | any = []
        if (searchParams.type == 1){ newRes = { id: result.id, student_id: result.student__id, subject_id: result.subject__id, seq_1: e.value, updated_by_id: user_id, created_by_id: result.created_by__id }}
        if (searchParams.type == 2){ newRes = { id: result.id, student_id: result.student__id, subject_id: result.subject__id, seq_2: e.value, updated_by_id: user_id, created_by_id: result.created_by__id }}
        if (searchParams.type == 3){ newRes = { id: result.id, student_id: result.student__id, subject_id: result.subject__id, seq_3: e.value, updated_by_id: user_id, created_by_id: result.created_by__id }}
        if (searchParams.type == 4){ newRes = { id: result.id, student_id: result.student__id, subject_id: result.subject__id, seq_4: e.value, updated_by_id: user_id, created_by_id: result.created_by__id }}
        if (searchParams.type == 5){ newRes = { id: result.id, student_id: result.student__id, subject_id: result.subject__id, seq_5: e.value, updated_by_id: user_id, created_by_id: result.created_by__id }}
        if (searchParams.type == 6){ newRes = { id: result.id, student_id: result.student__id, subject_id: result.subject__id, seq_6: e.value, updated_by_id: user_id, created_by_id: result.created_by__id }}
 
        if (!ArrayMarks) { setArrayMarks([newRes]); }

        if (ArrayMarks) {
            var found = ArrayMarks.find((item: SelectedResultInter) => item.id == result.id)
            if (found) {
                var index = ArrayMarks.findIndex((m) => m.id === result.id);
                // if (searchParams.type == 1){ found.seq_1 = parseFloat(e.value).toFixed(1) }
                // if (searchParams.type == 2){ found.seq_2 = parseFloat(e.value).toFixed(1) }
                // if (searchParams.type == 3){ found.seq_3 = parseFloat(e.value).toFixed(1) }
                // if (searchParams.type == 4){ found.seq_4 = parseFloat(e.value).toFixed(1) }
                // if (searchParams.type == 5){ found.seq_5 = parseFloat(e.value).toFixed(1) }
                // if (searchParams.type == 6){ found.seq_6 = parseFloat(e.value).toFixed(1) }
                // ArrayMarks[index] = found
            } else {
                setArrayMarks([...ArrayMarks, newRes]);
            }
        }
    }

    const AddMarksToSubmit = (rowID: number) => {
        if (!ArrayMarks) { }
        if (ArrayMarks) {
            var found = ArrayMarks.find((item: SelectedResultInter) => item.id == rowID)
            if (found) {
                if (!ArrayMarksToSubmit) { setArrayMarksToSubmit([found]) }
                if (!ArrayMarksToSubmitIDs) { setArrayMarksToSubmitIDs([rowID]); }
                if (ArrayMarksToSubmit) {
                    var foundTwo = ArrayMarksToSubmit.find((item: SelectedResultInter) => item.id == rowID)
                    if (foundTwo) {
                        var index = ArrayMarksToSubmit.findIndex((m) => m.id === rowID);
                        ArrayMarksToSubmit[index] = foundTwo;
                    } else {
                        setArrayMarksToSubmit([...ArrayMarksToSubmit, found]);

                    }
                }
                if (ArrayMarksToSubmitIDs) {
                    if (ArrayMarksToSubmitIDs.length < 1) {
                        setArrayMarksToSubmitIDs([rowID])
                    } else {
                        setArrayMarksToSubmitIDs([...new Set([...ArrayMarksToSubmitIDs, rowID])])
                    }
                }
            }
            if (!ArrayMarksToSubmitIDs) { setArrayMarksToSubmitIDs([rowID]) }
        }

    }

    const Submit = async () => {
        var sess = localStorage.getItem('session')
        var token = jwtDecode(sess ? sess : "")
        if (token && token.user_id && ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0) {           
            await Promise.allSettled(ArrayMarksToSubmit.map((item: SelectedResultInter, index: number) => {
                return (
                    ActionEdit({...item, created_by_id: token.user_id}, item.id, SchemaCreateEditResult, ResultUrl)
                )
            }))
            .then(res => {
                console.log(104, res)
                if (res && res.length > 0) {
                    const t = res.map(item => item.status)
                    router.push(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry?updated="SUCCESSFULLY !!!`);
                }
            })
            .catch(err => {
                console.log(98, err)
            })
            return
        } else {
            console.log(103, "Not Logged In")
        }

    }

    return (
        <div>
            {resultData.count && resultData.results.length > 0 ?

                <div className='dark:text-slate-200 text-black'>

                    <div className='dark:bg-slate-900 flex flex-col px-2 rounded'>
                        <div className='flex font-medium gap-6 items-center justify-between md:text-xl py-1'>
                            <span><b>{resultData.results[0].student__classroom__level__level}</b></span>
                            <span>{resultData.results[0].student__classroom__level__option}</span>
                            <span>{resultData.results[0].student__classroom__academic_year}</span>
                        </div>

                        <div className='flex gap-6 justify-center md:text-2xl pb-2 text-xl w-full'>
                            <span><b>{resultData.results[0].subject__main_subject__subject_name}</b></span>
                            <span className='underline'><b>Sequence {searchParams.type}</b></span>
                        </div>
                    </div>

                    <div className='dark:bg-slate-900 flex flex-col md:mt-6'>
                        <div className='bg-bluedark font-medium grid grid-cols-6 md:px-2 md:py-2 md:rounded-sm px-2 py-1 rounded-sm text-white'>
                            <div className='col-span-4'>Student Name</div>
                            <div className='col-span-2 flex justify-center'>Exam</div>
                        </div>
                        {resultData && resultData.results.map((item: GetResultInter) => (
                            <div key={item.id} className='bg-slate-100 dark:bg-slate-800 grid grid-cols-6 md:px-2 odd:bg-slate-300 odd:dark:bg-slate-600 p-1'>

                                <div className='col-span-4 md:text-lg text-sm'>{item.student__user__full_name}</div>

                                <div className='col-span-2 dark:text-black flex flex-col gap-1'>
                                    <div className='flex flex-row gap-1 items-center justify-between'>
                                        <input
                                            name="exam"
                                            className="bg-slate-200 border-2 border-bluelight font-medium italic md:mx-2 md:px-2 md:py-1 md:w-full rounded text-sm w-full"
                                            defaultValue={searchParams.type == 1 ? item.seq_1 : searchParams.type == 2 ? item.seq_2 : searchParams.type == 3 ? item.seq_3 : searchParams.type == "4" ? item.seq_4 : searchParams.type == "5" ? item.seq_5 : searchParams.type == "6" ? item.seq_6 : 0}
                                            onChange={(e) => FieldChanged(e.target, item)}
                                            type='number'
                                        />

                                        {ArrayMarksToSubmitIDs ? !ArrayMarksToSubmitIDs.includes(item.id) ? <div className='dark:text-white flex items-center justify-center md:mr-4 md:px-2 text-sm w-full'>
                                            <button onClick={() => { AddMarksToSubmit(item.id) }} className='bg-bluelight dark:bg-bluedark font-medium md:px-4 md:py-1 px-1 rounded'>OK</button>
                                        </div>
                                            :
                                            <div><GrStatusGood size={24} color='green' /></div>
                                            :
                                            <div className='dark:text-white flex items-center justify-center md:mr-4 md:px-2 text-sm w-full'>
                                                <button onClick={() => { AddMarksToSubmit(item.id) }} className='bg-bluelight dark:bg-bluedark font-medium md:px-4 md:py-1 px-1 rounded'><FaArrowRight /></button>
                                            </div>
                                        }
                                    </div>

                                </div>



                            </div>
                        ))}
                    </div>

                    {ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0 && !submitClicked ? <div className='flex items-center justify-center mb-2 mt-10'>
                        <button
                            onClick={() => { setSubmitClicked(true); Submit() }}
                            className='bg-green-900 flex font-medium gap-2 items-center justify-center px-6 py-1 rounded text-lg text-white tracking-wider'
                        >
                            Submit <FiSave />
                        </button>
                    </div>
                        :
                        <></>
                    }
                    {submitClicked && <div className='flex items-center justify-center mb-2 mt-10'>
                        <div className="animate-spin border-4 border-primary border-solid border-t-transparent flex h-[30px] items-center justify-center rounded-full w-[30px]"></div>
                    </div>}

                </div>

                :

                <div>No Student For this Course</div>

            }
        </div>
    )
}

export default MarksForm