import { ConfigData } from '@/config'
import { getData } from '@/functions'
import Image from 'next/image'
import React from 'react'

const TransAllHeader = ({ schoolinfo }: any) => {

    // const apiDomains = await getData()

    return (
        <div className='flex flex-col'>
            <div className="flex flex-row h-[150px] py-2 text-black">

                {/* <div className='flex flex-col pt-2 px-2 w-[320px]'>
                    <div className='flex font-bold items-center justify-center mb-2 text-lg tracking-widest'></div>
                    <div className='flex font-medium items-center pl-2 text-xs'>No: </div>
                    <div className='flex font-medium items-start pl-2 text-xs'>PO Box: {schoolinfo.po_box}, {schoolinfo.town}, {schoolinfo.campus__region} - {schoolinfo.country}</div>
                    <div className='flex font-medium gap-4 justify-start pl-2'>Email: <span className='italic text-blue-600'>{schoolinfo.email}</span></div>
                </div> */}
                <div className='flex flex-col gap-0 items-center justify-center px-4 w-[320px]'>
                    <div className='font-bold h-[14px] mb-1 text-[15px] tracking-widest'>REPUBLIC OF CAMEROON</div>
                    <div className='font-medium h-[10px] mb-1 text-[14px]'><span>Peace - Work - Fatherland</span></div>
                    <div className='font-medium h-[10px] text-[13px]'>{schoolinfo.campus__region} REGION</div>
                    <div className='flex font-medium h-[6px] items-center mt-3 p-0 text-[11px]'>*********************</div>
                    <div className='font-medium h-[11px] mb-1 text-[13px]'>REGIONAL DELEGATION OF </div>
                    <div className='font-medium h-[10px] text-[13px]'>SECONDARY EDUCATION</div>
                    <div className='flex font-medium h-[6px] items-center mb-0 mt-3 p-0 text-[11px]'>*********************</div>
                    <div className='font-medium h-[11px] mb-1 text-[13px]'>{schoolinfo.po_box}, +237 {schoolinfo.telephone_one}</div>
                    <div className='font-medium h-[10px] text-[12px]'>{schoolinfo.niu}</div>
                    {/* <div className='font-medium h-[10px] text-[12px]'>{schoolinfo.email}</div> */}
                </div>

                <div className='flex items-center justify-center w-[170px]'>
                    <Image
                        width={170}
                        height={170}
                        src={ConfigData.Logo.lg512.s}
                        alt="Logo"
                        style={{ borderRadius: 0 }}
                        priority
                    />
                </div>

                <div className='flex flex-col gap-0 items-center justify-center px-4 w-[320px]'>
                    <div className='font-bold h-[14px] mb-1 text-[15px] tracking-widest'>REPUBLIC OF CAMEROON</div>
                    <div className='font-medium h-[10px] mb-1 text-[14px]'><span>Peace - Work - Fatherland</span></div>
                    <div className='font-medium h-[10px] text-[13px]'>{schoolinfo.campus__region} REGION</div>
                    <div className='flex font-medium h-[6px] items-center mt-3 p-0 text-[11px]'>*********************</div>
                    <div className='font-medium h-[11px] mb-1 text-[13px]'>REGIONAL DELEGATION OF </div>
                    <div className='font-medium h-[10px] text-[13px]'>SECONDARY EDUCATION</div>
                    <div className='flex font-medium h-[6px] items-center mb-0 mt-3 p-0 text-[11px]'>*********************</div>
                    <div className='font-medium h-[11px] mb-1 text-[13px]'>GENERAL, TECHNICAL, COMMERCIAL</div>
                    <div className='font-medium h-[10px] text-[12px]'>EDUCATION PUTTING WINGS ON DREAMS</div>
                </div>
            </div>

            <div className='flex flex-col gap-2 items-center justify-center my-2 tracking-widest'>
                <span className='font-bold h-[18px] text-[20px]'>{schoolinfo.school_name}</span>
                {/* <span className='font-semibold text-[12px]'>{schoolinfo.niu}</span> */}
                <span className='font-semibold tracking-wide'>STUDENT REPORT CARD</span>
            </div>

        </div>
    )
}

export default TransAllHeader