'use client';
import { getData } from '@/functions';
import { UserProfileCreateSchema } from '@/schemas-user';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { GetUserProfileUrl, UserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { GetProgramInter, GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { GrStatusGood } from 'react-icons/gr'
import { SelectedPromoteStudentInter } from '@/serverActions/interfaces';
import { protocol } from '@/config';

const PromoteForm = ({ studentData, params, programs, nextSpecialty }: any) => {

    const router = useRouter();
    const [session, setSession] = useState<string>("Morning");
    const [studentDataFiltered, setStudentDataFiltered] = useState<GetUserProfileInter[] | undefined>();
    const [studentDataMatricles, setStudentDataMatricles] = useState<string[] | undefined>();
    const [programID, setProgramID] = useState<number>(0);
    const [nextSpecialtyID, setNextSpecialtyID] = useState<number>(0);
    const [submitClicked, setSubmitClicked] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [userID, setUserID] = useState<number>(0);
    const [ArrayStudentsToPromote, setStudentsToPromote] = useState<SelectedPromoteStudentInter[]>();
    const [ArrayStudentsToPromoteIDs, setStudentsToPromoteIDs] = useState<number[]>();

    useEffect(() => {
        if (count == 0) {
            var session = localStorage.getItem("session");
            if (session) {
                var user = jwtDecode(session);
                setUserID(parseInt(user.user_id ? user?.user_id.toString() : "0"));
                setCount(1);
            }
        }
        if (count == 1 && nextSpecialty.count == 1) {
            var nextProf = async () => {
                var a = await getData(GetUserProfileUrl, {
                    nopage: true, specialty__academic_year: nextSpecialty.results[0].academic_year, 
                    specialty__level__level: nextSpecialty.results[0].level__level,
                    fieldList: ["id", "user__matricle"]
                })
                console.log(a, 50)
                if (a && a.length > 0) {
                    var fil = a.map((item: GetUserProfileInter) => item.user__matricle)
                    setStudentDataMatricles(fil);
                } else { setStudentDataMatricles([]) }
                setCount(2)
            }
            nextProf()
        }
        if (count == 2 && studentDataMatricles) {
            console.log(studentDataMatricles, 58)
            var fil = studentData?.filter((item: GetUserProfileInter) => !studentDataMatricles?.includes(item.user__matricle));
            console.log(fil, 54)
            setStudentDataFiltered(fil);
            setCount(3);
        }
    }, [count, nextSpecialty, studentData, studentDataFiltered, studentDataMatricles])

    const RemoveStudentsID = (rowID: number) => {
        if (ArrayStudentsToPromoteIDs) {
            var a = ArrayStudentsToPromoteIDs
            var index = a.indexOf(rowID)
            if (index > -1) {
                a.splice(index, 1);
                setStudentsToPromoteIDs([...new Set([...a])])
            }
        }
        if (ArrayStudentsToPromote) {
            var b = ArrayStudentsToPromote
            var found: SelectedPromoteStudentInter | undefined = ArrayStudentsToPromote.find((item: SelectedPromoteStudentInter) => item.user_id == rowID)
            if (found) {
                var c = b.filter((item: SelectedPromoteStudentInter) => item.user_id != rowID);
                setStudentsToPromote([...new Set([...c])])
            }
        }
    }
    const AddStudentsToSubmit = (rowID: number) => {
        var newProf: SelectedPromoteStudentInter = {
            user_id: rowID,
            created_by_id: userID
        }

        if (!ArrayStudentsToPromote) {
            if (!ArrayStudentsToPromoteIDs) {
                setStudentsToPromoteIDs([rowID])
            } else {
                setStudentsToPromoteIDs([...new Set([...ArrayStudentsToPromoteIDs, rowID])])
            }
            setStudentsToPromote([newProf]);
        }
        if (ArrayStudentsToPromote) {
            if (!ArrayStudentsToPromoteIDs) {
                setStudentsToPromoteIDs([rowID])
            } else {
                setStudentsToPromoteIDs([...new Set([...ArrayStudentsToPromoteIDs, rowID])])
            }

            var found: SelectedPromoteStudentInter | undefined = ArrayStudentsToPromote.find((item: SelectedPromoteStudentInter) => item.user_id == rowID)
            if (found) {
                var index = ArrayStudentsToPromote.findIndex((m) => m.user_id === rowID);
                ArrayStudentsToPromote[index] = found;
            } else {
                setStudentsToPromote([...ArrayStudentsToPromote, newProf]);
            }
        }

    }

    const Submit = async () => {
        const promMine = (data: SelectedPromoteStudentInter) => {
            return (
                ActionCreate({ ...data, specialty_id: nextSpecialtyID, session: session, program_id: programID, active: true }, UserProfileCreateSchema, protocol + UserProfileUrl)
            )
        };

        if (ArrayStudentsToPromote && programID && session) {
            await Promise.allSettled(ArrayStudentsToPromote.map((item: SelectedPromoteStudentInter, index: number) => promMine(item)))
                .then(res => {
                    if (res && res.length > 0) {
                        const t = res.map(item => item.status)
                        console.log(100, t)
                        console.log(134, res)
                        if (t[0] == "fulfilled") {
                            router.push(`/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote?created=PROMOTED SUCCESSFULLY !!!`);
                        }
                        else {
                            router.push(`/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote/${params.specialty_id}?error=${t[0]}`);
                        }
                        setSubmitClicked(false);
                    }
                })
                .catch(err => {
                    console.log(98, err)
                })
            return null
        } else {
            console.log(103, "Not Logged In")
        }
    }

    return (
        <div>
            {studentData ?

                studentDataFiltered && studentDataFiltered.length > 0 ?

                    <div className='dark:text-slate-200 text-black'>

                        <div className='flex flex-row gap-4 p-2 w-full'>
                            <select onChange={(e) => { setSession(e.target.value) }} defaultValue={session} className='border-2 px-4 py-2 rounded w-full'>
                                <option value={"Morning"}>Morning</option>
                                <option value={"Evening"}>Evening</option>
                            </select>
                            <select onChange={(e) => { setProgramID(parseInt(e.target.value)) }} className='border-2 px-4 py-2 rounded w-full'>
                                <option>Select Program</option>
                                {programs.map((item: GetProgramInter) => <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>)}
                            </select>
                            {nextSpecialty && nextSpecialty.count ? <>
                                <span className='flex font-semibold items-center justify-center text-lg w-full'>Promote To</span>
                                <select onChange={(e) => { setNextSpecialtyID(parseInt(e.target.value)) }} className='border-2 px-4 py-2 rounded w-full'>
                                    <option value={""}>--------------------------</option>
                                    {nextSpecialty.results.map((item: GetSpecialtyInter) => <option key={item.id} value={item.id}>
                                        {item.main_specialty__specialty_name.slice(0, 14)} - {item.academic_year} - {item.level__level}
                                    </option>)}
                                </select>
                            </>
                                :
                                <span className='flex font-medium items-center justify-center text-blue-700 text-lg tracking-widest w-full'>No Next Class</span>}
                        </div>

                        <div className='dark:bg-slate-900 flex flex-col mt-2'>
                            <div className='bg-bluedark font-medium grid grid-cols-9 md:px-2 md:py-2 md:rounded-sm px-2 py-1 rounded-sm text-white'>
                                <div className=''>No</div>
                                <div className='col-span-2'>Matricle</div>
                                <div className='col-span-4'>Student Name</div>
                                <div className='col-span-2 flex justify-center'>Promote</div>
                            </div>
                            {studentDataFiltered && studentDataFiltered.map((item: GetUserProfileInter, index: number) => (
                                <div key={item.id} className='bg-slate-100 dark:bg-slate-800 grid grid-cols-9 md:px-2 odd:bg-slate-300 odd:dark:bg-slate-600 p-1'>

                                    <div className='md:text-lg text-sm'>{index + 1}</div>

                                    <div className='col-span-2 md:text-lg text-sm'>{item.user__matricle}</div>

                                    <div className='col-span-4 md:text-lg text-sm'>{item.user__full_name}</div>

                                    <div className='col-span-2 dark:text-black flex flex-col gap-1'>
                                        <div className='flex flex-row gap-1 items-center justify-between'>

                                            {!ArrayStudentsToPromoteIDs || (ArrayStudentsToPromoteIDs && !ArrayStudentsToPromoteIDs.includes(item.user__id)) ?
                                                <div className='dark:text-white flex items-center justify-center md:mr-4 md:px-2 text-sm w-full'>
                                                    <button onClick={() => { AddStudentsToSubmit(item.user__id) }} className='bg-bluelight dark:bg-bluedark font-medium md:px-4 md:py-1 px-1 rounded'><FaArrowRight /></button>
                                                </div>
                                                :
                                                <div className='dark:text-white flex items-center justify-center md:mr-4 md:px-2 text-sm w-full'>
                                                    <button onClick={() => { RemoveStudentsID(item.user__id) }} className='font-medium md:px-4 md:py-1 px-1 rounded'><GrStatusGood size={24} color='green' /></button>
                                                </div>
                                            }
                                        </div>

                                    </div>

                                </div>
                            ))}
                        </div>

                        {programID && session && ArrayStudentsToPromote && ArrayStudentsToPromote.length > 0 && !submitClicked ? <div className='flex items-center justify-center mb-2 mt-10'>
                            <button
                                onClick={() => { setSubmitClicked(true); Submit() }}
                                className='bg-green-900 flex font-medium gap-2 items-center justify-center px-6 py-1 rounded text-lg text-white tracking-wider'
                            >
                                Promote <FiSave />
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

                    <div className='flex font-semibold italic items-center justify-center py-40 text-xl tracking-widest'>All Students Promoted</div>

                :
                <div className='flex font-semibold italic items-center justify-center py-40 text-xl tracking-widest'>No Student in This Class</div>
            }
        </div>
    )
}

export default PromoteForm