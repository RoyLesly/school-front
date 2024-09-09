'use client';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import TransHeader from '@/section-s/common/Transcript/TransHeader';

const Transcript = ({ result, schoolinfo, studentInfo }: any) => {

    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: `Transcript - ${studentInfo.user__full_name}`,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    return (
        <div className='flex flex-col gap-1'>

            <div className='flex items-center justify-center'>

                <div ref={contentToPrint} className='bg-white border-[2px] flex flex-col h-[1121px] p-0 w-[793px]'>
                    <div className='m-1'>
                        <TransHeader schoolinfo={schoolinfo} />
                        {/* <TransStudentInfo studentInfo={studentInfo} /> */}
                        <div className='border h-[785px]'>
                            <div className='flex flex-col h-[100%] items-center justify-center'>
                                {/* <TranscriptAll results={result} /> */}
                            </div>
                        </div>
                        {/* <TransFooter result={result} schoolinfo={schoolinfo} /> */}
                    </div>
                </div>
                {/* <span className='bg-white flex font-medium italic rotate-180 text-[9px]'>001111111111111111111111111111111111111111111111</span> */}

            </div>

            <div className='flex items-center justify-center'>
                <button onClick={() => { handlePrint(null, () => contentToPrint.current); }} className='bg-blue-700 font-medium px-6 py-2 rounded text-white text-xl'>Print</button>
            </div>
        </div>
    )
}

export default Transcript