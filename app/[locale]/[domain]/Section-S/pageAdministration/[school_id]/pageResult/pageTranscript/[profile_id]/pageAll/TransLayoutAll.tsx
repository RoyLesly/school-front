'use client';
import React, { FC, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import TranscriptAll from './TranscriptAll';
import { GetSchoolInfoInter } from '@/Domain/Utils-S/appControl/appInter';
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter';
import TransAllFooter from './TransAllFooter';
import TransAllHeader from './TransAllHeader';
import TransAllStudentInfo from './TransAllStudentInfo';


interface TransProps {
    results: any
    schoolinfo: GetSchoolInfoInter
    studentInfo: GetSecondaryProfileInter
}
const TransLayoutAll:FC<TransProps> = ({ results, schoolinfo, studentInfo }: any) => {

    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: `Report - ${studentInfo.user__full_name}`,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    return (
        <div className='flex flex-col gap-1'>

            <div className='flex items-center justify-center'>

                <div ref={contentToPrint} className='bg-white border-[2px] flex flex-col h-[1121px] p-2 w-[793px]'>
                    <div className='m-1'>
                        <TransAllHeader schoolinfo={schoolinfo} />
                        <TransAllStudentInfo studentInfo={studentInfo} />
                        <div className='h-[590px]'>
                            <div className='flex flex-col h-[100%] items-center justify-center'>
                                <TranscriptAll results={results} />
                            </div>
                        </div>
                        <TransAllFooter results={results} schoolinfo={schoolinfo} />
                    </div>
                </div>

            </div>

            <div className='flex items-center justify-center'>
                <button onClick={() => { handlePrint(null, () => contentToPrint.current); }} className='bg-blue-700 font-medium px-6 py-2 rounded text-white text-xl'>Print</button>
            </div>
        </div>
    )
}

export default TransLayoutAll