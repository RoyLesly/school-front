import { protocol } from '@/config'
import { SchoolFeesUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { getData } from '@/functions'
import { AcademicYearUrl, GetLevelUrl, GetMainSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetLevelInter, GetMainSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { GetSchoolFeesUrl, GetTransactionUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig'
import { GetSchoolFeesInter, GetTransactionsInter } from '@/NoDomain/Utils-H/feesControl/feesInter'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import NotificationError from '@/section-h/common/NotificationError'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, schoolfees_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiTransactions = await getData(GetTransactionUrl, {
        school_fees__id: params.schoolfees_id,
        fieldList: [
            'id', "schoolfees__userprofile__user__matricle", "schoolfees__userprofile__user__full_name", "reason", "amount", "created_at"
        ]
    })
    console.log(apiTransactions, 43)

    return (
        <LayoutAccounting>
            <>
                <Breadcrumb
                    pageName="Transaction Details"
                    pageName1="Main Dashboard"
                    link1="/Section-H//pageAccounting"
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}

                {/* <SelectYear params={params} /> */}

                {apiTransactions && apiTransactions.count ? 
                
                    <List params={params} apiData={apiTransactions} /> 
                    :
                    <div className='bg-white flex flex-col gap-10 items-center justify-center my-2 pb-40 pt-32 rounded text-2xl tracking-widest'>
                        <div>No Filters Selected</div>
                    </div>
                }

            </>
        </LayoutAccounting>
    )
}

export default page

export const metadata: Metadata = {
    title: "Acc-Dash",
    description: "This is Acc Dash",
};


const List = ({ apiData, params }: any) => {

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark mt-2 rounded-sm shadow-default">
            <div className="flex justify-between md:px-4 py-2">
                <span className="dark:text-white font-semibold text-black text-xl">
                    My Transactions - List: ({apiData.count})
                </span>
                <Link href={`/Section-H/pageAccounting/${params.school_id}/pageFees/create/${params.schoolfees_id}`}>+ Transaction</Link>
                {/* <div className="md:px-2 px-4 py-1">
                    <span className="dark:text-white font-semibold gap-2 grid grid-cols-7 items-center justify-center text-black">
                        <span className='col-span-6'>Active Accounts:</span>
                        <span className='bg-green-200 border col-span-1 flex h-4 items-center justify-center rounded w-4'></span>
                    </span>
                    <span className="dark:text-white font-semibold gap-2 grid grid-cols-7 items-center justify-center text-black">
                        <span className='col-span-6'>In-Active Accounts:</span>
                        <span className='bg-orange-200 border col-span-1 flex h-4 rounded w-4'></span>
                    </span>
                </div> */}
            </div>



            <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-2 md:grid-cols-12 md:px-6 px-4 py-1 text-lg text-white">
                <div className="hidden items-center sm:flex">
                    <span className="font-medium">No</span>
                </div>
                <div className="col-span-2 flex items-center">
                    <span className="font-medium hidden md:flex">Matricle</span>
                </div>
                <div className="col-span-3 hidden items-center md:flex">
                    <span className="font-medium">Full Name</span>
                </div>
                <div className="col-span-2 hidden items-center md:flex">
                    <span className="font-medium">Reason</span>
                </div>
                <div className="col-span-2 hidden items-center md:flex">
                    <span className="font-medium">Balance</span>
                </div>
                <div className="col-span-2 hidden items-center md:flex">
                    <span className="font-medium">Date</span>
                </div>
            </div>
            {apiData.count && apiData.results.length > 0 ? apiData.results.map((item: GetTransactionsInter, key: number) => (
                <div
                    className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:grid-cols-12 md:px-6 px-4 py-2"
                    key={key}
                >
                    <div className="col-span-1 hidden items-center sm:flex">
                        <span className="dark:text-white text-black">
                            {key + 1}
                        </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <span className={`dark:text-white hidden md:flex rounded p-1 text-black `}>
                            {item.schoolfees__userprofile__user__matricle}
                        </span>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <span className="dark:text-white text-black">
                            {item.schoolfees__userprofile__user__full_name}
                        </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                        <span className="dark:text-white text-black">
                            {item.reason}
                        </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                        <span className="dark:text-white text-black">
                            {item.amount.toLocaleString()} F
                        </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                        <span className="dark:text-white text-black">
                            {item.created_at}
                        </span>
                    </div>
                </div>
            ))
                :
                <div className='flex items-center justify-center pb-60 pt-72 text-xl tracking-widest'>No Pending Platform Charges</div>
            }

            <MyPagination
                prevLink={apiData.previous}
                nextLink={apiData.next}
                count={apiData.count}
                thisUrl={`/Section-H/pageAccounting/${params.school_id}/pageSettings/pageUtilities/pagePlatformCharges`}
            />

        </div>
    )
}


const SelectYear = async ({ params }: any) => {

    const apiYears = await getData(protocol + AcademicYearUrl, { nopage: true })
    const apiLevels = await getData(protocol + GetLevelUrl, { nopage: true })
    const apiMainSpecialties = await getData(protocol + GetMainSpecialtyUrl, { nopage: true })

    const onSearch = async (formData: FormData) => {
        'use server'

        const sp = formData.get("selected_specialty")
        const sy = formData.get("selected_year")
        const sl = formData.get("selected_level")

        if (sp && sy && sl) {
            redirect(`/Section-H/pageAccounting/${params.school_id}/pageFees?selected_specialty=${sp}&selected_year=${sy}&selected_level=${sl}`)
        }
    }

    return <form action={onSearch} className='flex gap-2 items-center justify-center rounded'>

        {apiYears && apiYears.count && <select name="selected_year" className='border px-4 py-1 rounded'>
            <option>--------------</option>
            {apiYears.results.sort((a: string, b: string) => a[3] > b[3] ? -1 : a[3] < b[3] ? 1 : 0).map(
                (item: string) => <option key={item} value={item}>{item}</option>)}
        </select>}

        {apiMainSpecialties && apiMainSpecialties.length > 0 && <select name="selected_specialty" className='border px-4 py-1 rounded'>
            <option>------------------------</option>
            {apiMainSpecialties.sort((a: GetMainSpecialtyInter, b: GetMainSpecialtyInter) => a.specialty_name > b.specialty_name ? 1 : a.specialty_name < b.specialty_name ? -1 : 0).map(
                (item: GetMainSpecialtyInter) => <option key={item.id} value={item.id}>{item.specialty_name}</option>)}
        </select>}


        {apiLevels && apiLevels.length > 0 && <select name="selected_level" className='border px-4 py-1 rounded'>
            <option>----------</option>
            {apiLevels.sort((a: GetLevelInter, b: GetLevelInter) => a.level > b.level ? 1 : a.level < b.level ? -1 : 0).map(
                (item: GetLevelInter) => <option key={item.id} value={item.id}>{item.level}</option>)}
        </select>}

        <button type="submit" className='bg-bluedark px-4 py-1 rounded text-white'>Search</button>

    </form>
}