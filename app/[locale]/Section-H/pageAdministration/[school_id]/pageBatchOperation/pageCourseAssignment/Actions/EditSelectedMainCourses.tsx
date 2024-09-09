import React, { FC, useState} from 'react'
import { FaLeftLong, FaRightLong } from 'react-icons/fa6'
import { SelectedMainCousesAssignProps } from './CourseAssignAction'
import MyButtonLoading from '@/NoDomain/section-h/common/MyButtons/MyButtonLoading'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SearchLecturer from './SearchLecturer'
import { SchemaCreateEditCourse } from '@/NoDomain/schemas/schemas'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { GetCustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter'
import { CourseUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'


interface PageProps {
    selectedMainCoursesAssign: any
    setData: any
    setPage: any
    page: number
    apiLecturer: any
    apiAdmin: any
}
const EditSelectedMainCourses: FC<PageProps> = ({ selectedMainCoursesAssign, setPage, page, setData, apiLecturer, apiAdmin }) => {

    return (
        <div>
            <List data={selectedMainCoursesAssign} setPage={setPage} page={page} setData={setData} apiLecturer={apiLecturer} apiAdmin={apiAdmin} />
        </div>
    )
}

export default EditSelectedMainCourses



interface ListProps {
    data: SelectedMainCousesAssignProps[]
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

    const updateCourseCode = (main_course_id: number, code: string) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.main_course_id == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.main_course_id === main_course_id);
            found.course_code = code.toUpperCase()
            data[index] = found
        }
    }
    const updateCourseCredit = (main_course_id: number, credit: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.main_course_id == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.main_course_id === main_course_id);
            found.course_credit = credit
            data[index] = found
        }
    }
    const updateCourseType = (main_course_id: number, type: string) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.main_course_id == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.main_course_id === main_course_id);
            found.course_type = type
            data[index] = found
        }
    }
    const updateCourseHours = (main_course_id: number, hours: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.main_course_id == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.main_course_id === main_course_id);
            found.hours = hours
            found.hours_left = hours
            data[index] = found
        }
    }
    const updateCourseAssignedTo = (main_course_id: number, lecturer_id: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.main_course_id == main_course_id)
        if (found) {
            console.log(found, 83)
            var index = data.findIndex((d) => d.main_course_id === main_course_id);
            found.assigned_to_id = lecturer_id
            data[index] = found
        }
    }
    const removeItem = (main_course_id: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.main_course_id == main_course_id)
        if (found) {
            var newData = data.filter((d: SelectedMainCousesAssignProps) => d.main_course_id != main_course_id);
            setData([...newData])
        }
    }

    const submit = async () => {
        var checkCode = data.filter((item: SelectedMainCousesAssignProps) => !item.course_code)
        var checkCredit = data.filter((item: SelectedMainCousesAssignProps) => !item.course_credit)
        var checkHours = data.filter((item: SelectedMainCousesAssignProps) => !item.hours)
        var checkType = data.filter((item: SelectedMainCousesAssignProps) => !item.course_type)
        if (checkCode.length < 1 && checkCredit.length < 1 && checkHours.length < 1 && checkType.length < 1 && pathname) {
            var pn = pathname.toString().match(/\d+/g)
            setLoading(true)
            if (data && data.length > 0 && pn) {
                await Promise.allSettled(data.map((item: SelectedMainCousesAssignProps, index: number) => {
                    return (
                        ActionCreate(item, SchemaCreateEditCourse, protocol + CourseUrl)
                    )
                }))
                .then(res => {
                    console.log(103, res)
                    if (res && res.length > 0 && pn) {
                        const t = res.map(item => item.status)
                        console.log(t)
                        if (!t.includes("fulfilled")){
                            router.push(`/Section-H/pageAdministration/${pn[0]}/pageBatchOperation/pageCourseAssignment?error=Operation Successful`);
                        } else {
                            router.push(`/Section-H/pageAdministration/${pn[0]}/pageBatchOperation/pageCourseAssignment?created=Operation Successful`);
                        }
                        setLoading(false);
                    }
                })
                .catch(err => {
                    if (pn){
                        router.push(`/Section-H/pageAdministration/${pn[0]}/pageBatchOperation/pageCourseAssignment?specialty_id=${searchParams.get("specialty_id")}&semester=${searchParams.get("semester")}&error=${JSON.stringify(err)}`);
                    }
                })
                return
            } else {
                console.log(103, "Not Logged In")
            }
            const response = await ActionCreate(data[0], SchemaCreateEditCourse, CourseUrl)
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
            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-10 md:px-4 px-2 py-1 text-teal-50">

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
                    <span className="font-medium">Hours</span>
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
                data && data.length > 0 && data.map((item: SelectedMainCousesAssignProps, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t dark:bg-slate-700 dark:border-strokedark font-semibold grid grid-cols-10 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                    >

                        <div className="col-span-3 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.main_course__course_name}
                            </span>
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.course_code}
                                type='text'
                                onChange={(e) => { updateCourseCode(item.main_course_id, e.target.value) }}
                                className='border-2 px-2 py-1 text-black w-20'
                            />
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.course_credit}
                                type='number'
                                onChange={(e) => { updateCourseCredit(item.main_course_id, parseInt( e.target.value)) }}
                                className='border-2 px-2 py-1 text-black w-16'
                            />
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.hours}
                                type='number'
                                onChange={(e) => { updateCourseHours(item.main_course_id, parseInt(e.target.value)) }}
                                className='border-2 px-2 py-1 text-black w-16'
                            />
                        </div>

                        <div className="items-center justify-center md:flex">
                            <select defaultValue={item.course_type} onChange={(e) => { updateCourseType(item.main_course_id, e.target.value) }} className='border-2 px-1 py-1 rounded'>
                                <option value={""}>-------------</option>
                                <option value={"Transversal"}>Transversal</option>
                                <option value={"Fundamental"}>Fundamental</option>
                                <option value={"Professional"}>Professional</option>
                            </select>
                        </div>

                        <>
                            <SearchLecturer apiLecturer={[...apiLecturer, ...apiAdmin]} updateCourseAssignedTo={updateCourseAssignedTo} item={item} />
                        </>

                        <div className="hidden items-center justify-center md:flex">
                            <button onClick={(e) => { removeItem(item.main_course_id)}} className='font-bold text-xl'>-</button>
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