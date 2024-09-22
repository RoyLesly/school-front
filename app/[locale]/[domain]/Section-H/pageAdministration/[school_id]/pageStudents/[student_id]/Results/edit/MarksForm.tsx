'use client';
import { ConfigData, protocol } from '@/config';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaArrowRight} from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { GrStatusGood } from 'react-icons/gr'
import { ActionEdit } from '@/serverActions/actionGeneral';
import { SelectedResultInter } from '@/Domain/Utils-H/interfaces';
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter';
import { ResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { SchemaCreateEditResult } from '@/Domain/schemas/schemas';

const MarksForm = ({ resultData, params }: any) => {

    const router = useRouter();
    const [submitClicked, setSubmitClicked] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [userID, setUserID] = useState<number>(0);
    const [ArrayMarks, setArrayMarks] = useState<SelectedResultInter[]>();
    const [ArrayMarksToSubmit, setArrayMarksToSubmit] = useState<SelectedResultInter[]>();
    const [ArrayMarksToSubmitIDs, setArrayMarksToSubmitIDs] = useState<number[]>();

    useEffect(() => {
        if (count == 0) {
            var session = localStorage.getItem("session");
            if (session) {
                var user = jwtDecode(session);
                setUserID(parseInt(user.user_id ? user?.user_id.toString() : "0"));
                setCount(2);
            }
        }
    }, [count])

    const FieldChanged = (e: any, result: GetResultInter) => {
        if (e.name == "ca" && e.value > ConfigData[params.domain].higher.ca_limit.ca_limit){ return }
        if (e.name == "exam" && e.value > ConfigData[params.domain].higher.exam_limit.exam_limit){ return }
        if (ArrayMarksToSubmitIDs && ArrayMarksToSubmitIDs.length > 0) {
            var a = ArrayMarksToSubmitIDs.filter((item: number) => item != result.id)
            setArrayMarksToSubmitIDs(a);
        }
        if (ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0) {
            var b = ArrayMarksToSubmit.filter((item: SelectedResultInter) => item.id != result.id)
            setArrayMarksToSubmit(b);
        }
        var newRes: SelectedResultInter = {
            id: result.id, student_id: params.student_id, course_id: result.course__id,
            ca: 0, exam: 0, resit: 0,
            created_by_id: userID
        }
        if (e.name == "ca"){
            newRes = {
                id: result.id, student_id: params.student_id, course_id: result.course__id,
                ca: e.name == "ca" ? e.value : result.ca,
                created_by_id: userID
            }
        }
        if (e.name == "exam"){
            newRes = {
                id: result.id, student_id: params.student_id, course_id: result.course__id,
                exam: e.name == "exam" ? e.value : result.exam,
                created_by_id: userID
            }
        }
        if (e.name == "resit"){
            newRes = {
                id: result.id, student_id: params.student_id, course_id: result.course__id,
                resit: e.name == "resit" ? e.value : result.resit,
                created_by_id: userID
            }
        }
        if (!ArrayMarks) { setArrayMarks([newRes]); }

        if (ArrayMarks) {
            var found = ArrayMarks.find((item: SelectedResultInter) => item.id == result.id)
            if (found) {
                var index = ArrayMarks.findIndex((m) => m.id === result.id);
                if (e.name == "ca") { found.ca = parseFloat(e.value).toFixed(1) }
                if (e.name == "exam") { found.exam = parseFloat(e.value).toFixed(1) }
                if (e.name == "resit") { found.resit = parseFloat(e.value).toFixed(1) }
                ArrayMarks[index] = found
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

        if (ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0) {
            await Promise.allSettled(ArrayMarksToSubmit.map((item: SelectedResultInter, index: number) => {
                return (
                    ActionEdit(item, item.id.toString(), SchemaCreateEditResult, protocol  + "api" + params.domain + ResultUrl)
                )
            }))
            .then(res => {
                console.log(10500, res)
                if (res && res.length > 0) {
                    const t = res.map(item => item.status)
                    if (t[0] == "fulfilled"){ router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results?updated=SUCCESSFULLY !!!`); }
                    else { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Results/edit?error=${t[0]}`); }
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
            {resultData && resultData.length > 0 ?

                <div className='dark:text-slate-200 text-black'>

                    <div className='dark:bg-slate-900 flex flex-col md:mt-2'>
                        <div className='bg-bluedark font-medium grid grid-cols-12 md:px-2 md:py-2 md:rounded-sm px-2 py-1 rounded-sm text-white'>
                            <div className='col-span-1'>No</div>
                            <div className='col-span-5'>Course Name</div>
                            <div className='col-span-6 grid grid-cols-7'>
                                <div className='col-span-2 flex items-center justify-center'>CA</div>
                                <div className='col-span-2 flex items-center justify-center'>EXAM</div>
                                <div className='col-span-2 flex items-center justify-center'>RESIT</div>
                                <div className='col-span-1 flex items-center justify-center'>Add</div>
                            </div>
                        </div>
                        {resultData && resultData.sort((a: GetResultInter, b: GetResultInter) => (a.student__user__first_name > b.student__user__first_name) ? 1 : (a.student__user__first_name < b.student__user__first_name) ? -1 : 0).map((item: GetResultInter, index: number) => (
                            <div key={item.id} className='bg-slate-100 dark:bg-slate-800 grid grid-cols-12 md:px-2 odd:bg-slate-300 odd:dark:bg-slate-600 p-1'>

                                <div className='col-span-1 md:text-lg text-sm'>{index + 1}</div>

                                <div className='col-span-5 md:text-lg text-sm'>{item.course__main_course__course_name}</div>

                                <div className='col-span-6 dark:text-black gap-1 grid grid-cols-7'>
                                    <div className='col-span-2 flex item-center justify-center'>
                                        <input
                                            name="ca"
                                            className="bg-slate-200 border-2 border-bluelight font-medium italic md:mx-2 md:px-2 md:py-1 rounded text-sm w-24"
                                            defaultValue={item.ca}
                                            onChange={(e) => FieldChanged(e.target, item)}
                                            type='number'
                                            max={ConfigData[params.domain].higher.ca_limit}
                                            min={0}
                                        />
                                    </div>
                                    <div className='col-span-2 flex item-center justify-center'>
                                        <input
                                            name="exam"
                                            className="bg-slate-200 border-2 border-bluelight font-medium italic md:mx-2 md:px-2 md:py-1 rounded text-sm w-24"
                                            defaultValue={item.exam}
                                            onChange={(e) => FieldChanged(e.target, item)}
                                            type='number'
                                            max={ConfigData[params.domain].higher.exam_limit}
                                            min={0}
                                        />
                                    </div>
                                    <div className='col-span-2 flex item-center justify-center'>
                                        <input
                                            name="resit"
                                            className="bg-slate-200 border-2 border-bluelight font-medium italic md:mx-2 md:px-2 md:py-1 rounded text-sm w-24"
                                            defaultValue={item.resit}
                                            onChange={(e) => FieldChanged(e.target, item)}
                                            type='number'
                                            max={50}
                                            min={0}
                                        />
                                    </div>
                                    <div className='col-span-1 flex items-center justify-center'>

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