import { ConfigData } from '@/config'
import Image from 'next/image'
import React from 'react'

const TransTermHeader = ({ schoolinfo }: any) => {

    return (
        <div className='flex flex-col'>
            <div className="flex flex-row h-[150px] py-2 text-black">

                <div className='flex flex-col pt-2 px-2 w-[340px]'>
                    <div className='flex font-bold items-center justify-center mb-2 text-lg tracking-widest'>{schoolinfo.school_name}</div>
                    <div className='flex font-medium items-center pl-2 text-xs'>No: {schoolinfo.niu}</div>
                    <div className='flex font-medium items-start pl-2 text-xs'>PO Box: {schoolinfo.po_box}, {schoolinfo.town}, {schoolinfo.region} - {schoolinfo.country}</div>
                    <div className='flex font-medium gap-4 justify-start pl-2'>Email: <span className='italic text-blue-600'>{schoolinfo.email}</span></div>
                </div>

                <div className='flex items-center justify-center w-[145px]'>
                    <Image
                        width={160}
                        height={160}
                        src={ConfigData.Logo.lg512.s}
                        alt="Logo"
                        style={{ borderRadius: 100 }}
                        priority
                    />
                </div>

                <div className='flex flex-col items-center justify-center px-4 w-[330px]'>
                    <div className='font-bold tracking-widest'>REPUBLIC OF CAMEROON</div>
                    <div>Peace - Work - Fatherland</div>
                    <div>Ministry of Secondary Education</div>
                </div>
            </div>

            <div className='flex font-bold items-center justify-center my-4 text-lg tracking-wider'>
                <span>STUDENT REPORT CARD</span>
            </div>

        </div>
    )
}

export default TransTermHeader