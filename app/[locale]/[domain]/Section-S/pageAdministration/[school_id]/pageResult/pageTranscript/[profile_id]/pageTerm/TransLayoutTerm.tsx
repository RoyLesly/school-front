'use client';
import React, { FC, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { GetSchoolInfoInter } from '@/Domain/Utils-S/appControl/appInter';
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter';
import TransTermStudentInfo from './TransTermStudentInfo';
import TransTermHeader from './TransTermHeader';
import TranscriptTerm from './TranscripTerm';
import TransTermFooter from './TransTermFooter';


interface TransProps {
    term: string | number
    results: any
    schoolinfo: GetSchoolInfoInter
    studentInfo: GetSecondaryProfileInter
}
const TransLayoutTerm:FC<TransProps> = ({ results, schoolinfo, studentInfo, term }: any) => {

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
                        <TransTermHeader schoolinfo={schoolinfo} />
                        <TransTermStudentInfo studentInfo={studentInfo} term={term} />
                        <div className='h-[590px]'>
                            <div className='flex flex-col h-[100%] items-center justify-center'>
                                <TranscriptTerm results={results} term={term} />
                            </div>
                        </div>
                        <TransTermFooter results={results} schoolinfo={schoolinfo} term={term} />
                    </div>
                </div>

            </div>

            <div className='flex items-center justify-center'>
                <button onClick={() => { handlePrint(null, () => contentToPrint.current); }} className='bg-blue-700 font-medium px-6 py-2 rounded text-white text-xl'>Print</button>
            </div>
        </div>
    )
}

export default TransLayoutTerm