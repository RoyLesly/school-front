import React, { FC, useState} from 'react'
import { FaRightLong } from 'react-icons/fa6'
import { SelectedMainSubjectsAssignProps } from './SubjectAssignAction'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { SchemaCreateEditSubject } from '@/NoDomain/Utils-S/schemas/schemas'
import { SubjectUrl } from '@/NoDomain/Utils-S/appControl/appConfig'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { protocol } from '@/config'


interface PageProps {
    selectedMainSubjectsAssign: any
    setData: any
    setPage: any
    page: number
}
const SelectedMainSubject: FC<PageProps> = ({ selectedMainSubjectsAssign, setPage, page, setData }) => {

    return (
        <div>
            <List data={selectedMainSubjectsAssign} setPage={setPage} page={page} setData={setData} />
        </div>
    )
}

export default SelectedMainSubject



interface ListProps {
    data: SelectedMainSubjectsAssignProps[]
    setData?: any
    setPage: any
    page: number
}

const List: FC<ListProps> = ({ data, setPage, page, setData }) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
                            router.push(`/Section-S/pageAdministration/${pn[0]}/pageBatchOperation/pageSubjectAssignment?error=Operation Successful`);
                        } else {
                            router.push(`/Section-S/pageAdministration/${pn[0]}/pageBatchOperation/pageSubjectAssignment?created=Operation Successful`);
                        }
                        setLoading(false);
                    }
                })
                .catch(err => {
                    if (pn){
                        router.push(`/Section-S/Section-S/pageAdministration/${pn[0]}/pageBatchOperation/pageSubjectAssignment?classroom_id=${searchParams.get("classroom_id")}&error=${JSON.stringify(err)}`);

                    }
                })
                return
            } else {
                // console.log(103, "Not Logged In")
            }
            const response = await ActionCreate(data[0], SchemaCreateEditSubject, protocol + SubjectUrl)
            if (response?.error) {
            }
            if (response?.detail) { alert(response.detail) }
            setLoading(false)
        }
        return
    }

    return (
        <>
            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-5 md:px-4 px-2 py-1 text-teal-50">

                <div className="col-span-4 items-center justify-start md:flex">
                    <span className="font-medium">COURSE NAME</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Remove</span>
                </div>

            </div>
            {
                data && data.length > 0 && data.map((item: SelectedMainSubjectsAssignProps, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t dark:bg-slate-700 dark:border-strokedark font-semibold grid grid-cols-5 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                    >

                        <div className="col-span-4 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.main_subject__subject_name}
                            </span>
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <button onClick={(e) => { removeItem(item.main_subject_id)}} className='border font-bold px-2.5 rounded text-red text-xl'>x</button>
                        </div>

                    </div>
                ))
            }

            <div className='bg-white dark:bg-slate-300 flex flex-row font-semibold gap-4 justify-center mt-2 p-4 text-black text-lg tracking-widest'>
                
                <span className='flex items-center justify-end md:ml-20'>
                    {data && data.length > 0 && page == 1 && !loading && <button onClick={() => { setPage(2) }} className='bg-red flex gap-2 items-center justify-center px-6 py-2 rounded text-white'>
                        Next
                        <FaRightLong />
                    </button>}
                </span>


            </div>
        </>
    )
}