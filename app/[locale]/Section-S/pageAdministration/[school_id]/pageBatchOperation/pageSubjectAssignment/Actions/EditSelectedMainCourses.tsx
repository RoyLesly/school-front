import React, { FC, useState} from 'react'
import { FaLeftLong, FaRightLong } from 'react-icons/fa6'
import { SelectedMainSubjectsAssignProps } from './SubjectAssignAction'
import MyButtonLoading from '@/section-s/common/MyButtons/MyButtonLoading'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { SchemaCreateEditSubject } from '@/NoDomain/Utils-S/schemas/schemas'
import { SubjectUrl } from '@/NoDomain/Utils-S/appControl/appConfig'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { GetCustomUserInter } from '@/NoDomain/Utils-S/userControl/userInter'
import SearchLecturer from './SearchLecturer'


interface PageProps {
    selectedMainSubjectsAssign: any
    setData: any
    setPage: any
    page: number
    apiLecturer: any
    apiAdmin: any
}
const EditSelectedMainSubjects: FC<PageProps> = ({ selectedMainSubjectsAssign, setPage, page, setData, apiLecturer, apiAdmin }) => {

    return (
        <div>
            <List data={selectedMainSubjectsAssign} setPage={setPage} page={page} setData={setData} apiLecturer={apiLecturer} apiAdmin={apiAdmin} />
        </div>
    )
}

export default EditSelectedMainSubjects



interface ListProps {
    data: SelectedMainSubjectsAssignProps[]
    setData?: any
    setPage: any
    page: number
    apiLecturer: GetCustomUserInter[]
    apiAdmin: GetCustomUserInter[]
}

const List: FC<ListProps> = ({ data, setPage, page, setData, apiLecturer , apiAdmin}) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateCourseCode = (main_subject_id: number, code: string) => {
        var found = data.find((item: SelectedMainSubjectsAssignProps) => item.main_subject_id == main_subject_id)
        if (found) {
            var index = data.findIndex((d) => d.main_subject_id === main_subject_id);
            found.subject_code = code.toUpperCase()
            data[index] = found
        }
    }
    const updateCourseCredit = (main_subject_id: number, credit: number) => {
        var found = data.find((item: SelectedMainSubjectsAssignProps) => item.main_subject_id == main_subject_id)
        if (found) {
            var index = data.findIndex((d) => d.main_subject_id === main_subject_id);
            found.subject_coefficient = credit
            data[index] = found
        }
    }
    const updateCourseType = (main_subject_id: number, type: string) => {
        var found = data.find((item: SelectedMainSubjectsAssignProps) => item.main_subject_id == main_subject_id)
        if (found) {
            var index = data.findIndex((d) => d.main_subject_id === main_subject_id);
            found.subject_type = type
            data[index] = found
        }
    }
    const updateCourseAssignedTo = (main_subject_id: number, lecturer_id: number) => {
        var found = data.find((item: SelectedMainSubjectsAssignProps) => item.main_subject_id == main_subject_id)
        if (found) {
            console.log(found, 83)
            var index = data.findIndex((d) => d.main_subject_id === main_subject_id);
            found.assigned_to_id = lecturer_id
            data[index] = found
        }
    }
    const removeItem = (main_subject_id: number) => {
        var found = data.find((item: SelectedMainSubjectsAssignProps) => item.main_subject_id == main_subject_id)
        if (found) {
            var newData = data.filter((d: SelectedMainSubjectsAssignProps) => d.main_subject_id != main_subject_id);
            setData([...newData])
        }
    }

    const submit = async () => {
        var checkCode = data.filter((item: SelectedMainSubjectsAssignProps) => !item.subject_code)
        var checkCredit = data.filter((item: SelectedMainSubjectsAssignProps) => !item.subject_coefficient)
        var checkType = data.filter((item: SelectedMainSubjectsAssignProps) => !item.subject_type)
        if (checkCode.length < 1 && checkCredit.length < 1 && checkType.length < 1 && pathname) {
            var pn = pathname.toString().match(/\d+/g)
            setLoading(true)
            if (data && data.length > 0 && pn) {
                await Promise.allSettled(data.map((item: SelectedMainSubjectsAssignProps, index: number) => {
                    return (
                        ActionCreate(item, SchemaCreateEditSubject, SubjectUrl)
                    )
                }))
                .then(res => {
                    console.log(103, res)
                    if (res && res.length > 0 && pn) {
                        const t = res.map(item => item.status)
                        console.log(t)
                        if (!t.includes("fulfilled")){
                            router.push(`/pageAdministration/${pn[0]}/pageBatchOperation/pageSubjectAssignment?error=Operation Successful`);
                        } else {
                            router.push(`/pageAdministration/${pn[0]}/pageBatchOperation/pageSubjectAssignment?created=Operation Successful`);
                        }
                        setLoading(false);
                    }
                })
                .catch(err => {
                    if (pn){
                        router.push(`/pageAdministration/${pn[0]}/pageBatchOperation/pageSubjectAssignment?specialty_id=${searchParams.get("specialty_id")}&semester=${searchParams.get("semester")}&error=${JSON.stringify(err)}`);
                    }
                })
                return
            } else {
                console.log(103, "Not Logged In")
            }
            const response = await ActionCreate(data[0], SchemaCreateEditSubject, SubjectUrl)
            if (response?.error) {
            }
            if (response?.detail) { alert(response.detail) }
            setLoading(false)
        }
        return
    }

    console.log(pathname, 128)

    return (
        <>
            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-9 md:px-4 px-2 py-1 text-teal-50">

                <div className="col-span-3 items-center justify-start md:col-span-3 md:flex">
                    <span className="font-medium">COURSE NAME</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Code</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Credit</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Type</span>
                </div>

                <div className="col-span-2 hidden items-center justify-center md:flex">
                    <span className="font-medium">Lecturer</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Remove</span>
                </div>

            </div>
            {
                data && data.length > 0 && data.map((item: SelectedMainSubjectsAssignProps, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t dark:bg-slate-700 dark:border-strokedark font-semibold grid grid-cols-9 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                    >

                        <div className="col-span-3 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.main_subject__subject_name}
                            </span>
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.subject_code}
                                type='text'
                                onChange={(e) => { updateCourseCode(item.main_subject_id, e.target.value) }}
                                className='border-2 px-2 py-1 text-black w-20'
                            />
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.subject_coefficient}
                                type='number'
                                onChange={(e) => { updateCourseCredit(item.main_subject_id, parseInt( e.target.value)) }}
                                className='border-2 px-2 py-1 text-black w-16'
                            />
                        </div>

                        <div className="items-center justify-center md:flex">
                            <select defaultValue={item.subject_type} onChange={(e) => { updateCourseType(item.main_subject_id, e.target.value) }} className='border-2 px-1 py-1 rounded'>
                                <option value={""}>-------------</option>
                                <option value={"General"}>General</option>
                                <option value={"Practical"}>Practical</option>
                                <option value={"Other"}>Other</option>
                            </select>
                        </div>

                        <>
                            <SearchLecturer apiLecturer={[...apiLecturer, ...apiAdmin]} updateCourseAssignedTo={updateCourseAssignedTo} item={item} />
                        </>

                        <div className="hidden items-center justify-center md:flex">
                            <button onClick={(e) => { removeItem(item.main_subject_id)}} className='font-bold text-xl'>-</button>
                        </div>

                    </div>
                ))
            }

            <div className='bg-white dark:bg-slate-300 flex flex-row font-semibold gap-4 justify-center mt-2 p-4 text-black text-lg tracking-widest'>
                {page == 2 && <div className='flex items-center justify-start'>
                    <button onClick={() => { setPage(1)}} className='bg-green-400 flex gap-2 items-center justify-center px-6 py-2 rounded'>                        
                        <FaLeftLong />
                        + Add
                    </button>
                </div>}
                
                <span className='flex items-center justify-end md:ml-20'>
                    {page == 2 && !loading ? <button onClick={() => { submit(); }} className='bg-red flex gap-2 items-center justify-center px-6 py-2 rounded text-white'>
                        Confirm And Save
                        <FaRightLong />
                    </button>
                    :
                    <MyButtonLoading title="Saving ..." />
                }
                </span>


            </div>
        </>
    )
}