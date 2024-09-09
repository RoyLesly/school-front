import React from 'react'

const MarksForm = () => {
  return (
    <div>MarksForm</div>
  )
}

export default MarksForm


// 'use client';
// import MyPagination100 from '@/section-h/common/Pagination/MyPagination100';
// import { SelectedResultInter } from '@/interfaces';
// import { jwtDecode } from 'jwt-decode';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { FaArrowRight} from 'react-icons/fa6';
// import { FiSave } from 'react-icons/fi';
// import { GrStatusGood } from 'react-icons/gr'
// import { SchemaCreateEditResult } from '@/Utils-H/schemas/schemas';
// import { ResultUrl } from '@/Utils-H/appControl/appConfig';
// import { ActionEdit } from '@/serverActions/actionGeneral';
// import { GetResultInter } from '@/Utils-H/appControl/appInter';

// const MarksForm = ({ resultData, params }: any) => {

//     const router = useRouter();
//     const [submitClicked, setSubmitClicked] = useState<boolean>(false);
//     const [count, setCount] = useState<number>(0);
//     const [userID, setUserID] = useState<number>(0);
//     const [ArrayMarks, setArrayMarks] = useState<SelectedResultInter[]>();
//     const [ArrayMarksToSubmit, setArrayMarksToSubmit] = useState<SelectedResultInter[]>();
//     const [ArrayMarksToSubmitIDs, setArrayMarksToSubmitIDs] = useState<number[]>();

//     useEffect(() => {
//         if (count == 0) {
//             var session = localStorage.getItem("session");
//             if (session) {
//                 var user = jwtDecode(session);
//                 setUserID(parseInt(user.user_id ? user?.user_id.toString() : "0"));
//                 setCount(2);
//             }
//         }
//     }, [count])

//     const FieldChanged = (e: any, result: GetResultInter) => {
//         if (ArrayMarksToSubmitIDs && ArrayMarksToSubmitIDs.length > 0) {
//             var a = ArrayMarksToSubmitIDs.filter((item: number) => item != result.id)
//             setArrayMarksToSubmitIDs(a);
//         }
//         if (ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0) {
//             var b = ArrayMarksToSubmit.filter((item: SelectedResultInter) => item.id != result.id)
//             setArrayMarksToSubmit(b);
//         }
//         var newRes: SelectedResultInter = {
//             ...result,
//             id: result.id, student_id: result.student__id, course_id: result.course__id,
//             exam: e.name == "exam" ? e.value : result.exam,
//             created_by_id: userID
//         }
//         if (!ArrayMarks) { setArrayMarks([newRes]); }

//         if (ArrayMarks) {
//             var found = ArrayMarks.find((item: SelectedResultInter) => item.id == result.id)
//             if (found) {
//                 var index = ArrayMarks.findIndex((m) => m.id === result.id);
//                 if (e.name == "exam") { found.exam = parseFloat(e.value).toFixed(1) }
//                 ArrayMarks[index] = found
//             } else {
//                 setArrayMarks([...ArrayMarks, newRes]);
//             }
//         }
//     }

//     const AddMarksToSubmit = (rowID: number) => {
//         if (!ArrayMarks) { }
//         if (ArrayMarks) {
//             var found = ArrayMarks.find((item: SelectedResultInter) => item.id == rowID)
//             if (found) {
//                 if (!ArrayMarksToSubmit) { setArrayMarksToSubmit([found]) }
//                 if (!ArrayMarksToSubmitIDs) { setArrayMarksToSubmitIDs([rowID]); }
//                 if (ArrayMarksToSubmit) {
//                     var foundTwo = ArrayMarksToSubmit.find((item: SelectedResultInter) => item.id == rowID)
//                     if (foundTwo) {
//                         var index = ArrayMarksToSubmit.findIndex((m) => m.id === rowID);
//                         ArrayMarksToSubmit[index] = foundTwo;
//                     } else {
//                         setArrayMarksToSubmit([...ArrayMarksToSubmit, found]);

//                     }
//                 }
//                 if (ArrayMarksToSubmitIDs) {
//                     if (ArrayMarksToSubmitIDs.length < 1) {
//                         setArrayMarksToSubmitIDs([rowID])
//                     } else {
//                         setArrayMarksToSubmitIDs([...new Set([...ArrayMarksToSubmitIDs, rowID])])
//                     }
//                 }
//             }
//             if (!ArrayMarksToSubmitIDs) { setArrayMarksToSubmitIDs([rowID]) }
//         }

//     }

//     const Submit = async () => {
//         if (ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0) {
//             await Promise.allSettled(ArrayMarksToSubmit.map((item: SelectedResultInter, index: number) => {
//                 return (
//                     ActionEdit(item, item.id.toString(), SchemaCreateEditResult, ResultUrl)
//                 )
//             }))
//             .then(res => {
//                 console.log(103, res)
//                 if (res && res.length > 0) {
//                     const t = res.map(item => item.status)
//                     router.push(`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}?updated="SUCCESSFULLY !!!`);
//                 }
//             })
//             .catch(err => {
//                 console.log(98, err)
//             })
//             return
//         } else {
//             console.log(103, "Not Logged In")
//         }

//     }

//     return (
//         <div>
//             {resultData && resultData.length > 0 ?

//                 <div className='dark:text-slate-200 text-black'>

//                     <div className='dark:bg-slate-900 flex flex-col px-2 rounded'>
//                         <div className='flex font-medium gap-6 items-center justify-between md:text-xl py-1'>
//                             {/* <span><b>{resultData.results[0].student__specialty__main_specialty__specialty_name}</b></span> */}
//                             {/* <span>{resultData.results[0].student__specialty__academic_year}</span> */}
//                             {/* <span>{resultData.results[0].student__specialty__level__level}</span> */}
//                         </div>

//                         <div className='flex gap-6 justify-center md:text-2xl pb-2 text-xl w-full'>
//                             <span><b>{resultData[0].course__main_course__course_name}</b></span>
//                         </div>
//                     </div>

//                     <div className='dark:bg-slate-900 flex flex-col md:mt-6'>
//                         <div className='bg-bluedark font-medium grid grid-cols-6 md:px-2 md:py-2 md:rounded-sm px-2 py-1 rounded-sm text-white'>
//                             <div className='col-span-4'>Student Name</div>
//                             <div className='col-span-2 flex justify-center'>EXAM</div>
//                         </div>
//                         {resultData && resultData.sort((a: GetResultInter, b: GetResultInter) => (a.student__user__first_name > b.student__user__first_name) ? 1 : (a.student__user__first_name < b.student__user__first_name) ? -1 : 0).map((item: GetResultInter, index: number) => (
//                             <div key={item.id} className='bg-slate-100 dark:bg-slate-800 grid grid-cols-6 md:px-2 odd:bg-slate-300 odd:dark:bg-slate-600 p-1'>

//                                 <div className='col-span-4 md:text-lg text-sm'>{item.student__user__full_name}</div>

//                                 <div className='col-span-2 dark:text-black flex flex-col gap-1'>
//                                     <div className='flex flex-row gap-1 items-center justify-between'>
//                                         <input
//                                             name="exam"
//                                             className="bg-slate-200 border-2 border-bluelight font-medium italic md:mx-2 md:px-2 md:py-1 md:w-full rounded text-sm w-full"
//                                             defaultValue={item.exam}
//                                             onChange={(e) => FieldChanged(e.target, item)}
//                                             type='number'
//                                             max={60}
//                                         />

//                                         {ArrayMarksToSubmitIDs ? !ArrayMarksToSubmitIDs.includes(item.id) ? <div className='dark:text-white flex items-center justify-center md:mr-4 md:px-2 text-sm w-full'>
//                                             <button onClick={() => { AddMarksToSubmit(item.id) }} className='bg-bluelight dark:bg-bluedark font-medium md:px-4 md:py-1 px-1 rounded'>OK</button>
//                                         </div>
//                                             :
//                                             <div><GrStatusGood size={24} color='green' /></div>
//                                             :
//                                             <div className='dark:text-white flex items-center justify-center md:mr-4 md:px-2 text-sm w-full'>
//                                                 <button onClick={() => { AddMarksToSubmit(item.id) }} className='bg-bluelight dark:bg-bluedark font-medium md:px-4 md:py-1 px-1 rounded'><FaArrowRight /></button>
//                                             </div>
//                                         }
//                                     </div>

//                                 </div>

//                             </div>
//                         ))}

//                     </div>

//                     {ArrayMarksToSubmit && ArrayMarksToSubmit.length > 0 && !submitClicked ? <div className='flex items-center justify-center mb-2 mt-10'>
//                         <button
//                             onClick={() => { setSubmitClicked(true); Submit() }}
//                             className='bg-green-900 flex font-medium gap-2 items-center justify-center px-6 py-1 rounded text-lg text-white tracking-wider'
//                         >
//                             Submit <FiSave />
//                         </button>
//                     </div>
//                         :
//                         <></>
//                     }
//                     {submitClicked && <div className='flex items-center justify-center mb-2 mt-10'>
//                         <div className="animate-spin border-4 border-primary border-solid border-t-transparent flex h-[30px] items-center justify-center rounded-full w-[30px]"></div>
//                     </div>}

//                 </div>

//                 :

//                 <div>No Student For this Course</div>

//             }
//         </div>
//     )
// }

// export default MarksForm