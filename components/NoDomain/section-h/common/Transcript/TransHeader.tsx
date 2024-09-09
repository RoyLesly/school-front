import { ConfigData } from '@/config'
import Image from 'next/image'
import React from 'react'

const TransHeader = ({ schoolinfo }: any) => {

    return (
        <div className='flex flex-col'>
            <div className="flex flex-row h-[110px] text-black">

                <div className='flex flex-col items-center justify-center pt-0 px-2 w-[340px]'>
                    <div className='flex font-bold items-center justify-center mb-1 text-lg tracking-widest'>{schoolinfo.school_name}</div>
                    <div className='flex font-medium items-center pl-2 text-xs'>No: {schoolinfo.niu}</div>
                    <div className='flex font-medium items-start pl-2 text-ms'>PO Box: {schoolinfo.po_box}, {schoolinfo.town}, {schoolinfo.region} - {schoolinfo.country}</div>
                    <div className='flex font-medium gap-4 justify-start pl-2'>Email: <span className='italic text-blue-600'>{schoolinfo.email}</span></div>
                </div>

                <div className='flex items-center justify-center w-[113px]'>
                    <Image
                        width={150}
                        height={150}
                        src={ConfigData.Logo.lg512.h}
                        alt="Logo"
                        style={{ borderRadius: 100 }}
                        priority
                    />
                </div>

                <div className='flex flex-col items-center justify-center px-4 w-[330px]'>
                    <div className='font-bold tracking-widest'>REPUBLIC OF CAMEROON</div>
                    <div>Peace - Work - Fatherland</div>
                    <div>Ministry of Higher Education</div>
                </div>
            </div>

            <div className='flex font-bold items-center justify-center mt-2 text-lg tracking-wider'>
                <span>STUDENT ACADEMIC TRANSCRIPT</span>
            </div>

        </div>
    )
}

export default TransHeader