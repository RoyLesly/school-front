'use client';
import TransFooter from '@/section-h/common/Transcript/TransFooter';
import TransHeader from '@/section-h/common/Transcript/TransHeader';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import TranscriptSemester from './TranscriptSemester';
import TransStudentInfo from '@/section-h/common/Transcript/TransStudentInfo';
import { url } from 'inspector';
import { ConfigData } from '@/config';
import MessageModal from '@/componentsTwo/MessageModal';
import { FaArrowRight } from 'react-icons/fa6';

const Transcript = ({ resultI, resultII, resultAll, schoolinfo, studentInfo, params }: any) => {

    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: `Transcript - ${studentInfo.user__full_name}`,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    const backgroundImageStyle = {
        backgroundImage: `url(${ConfigData[params.domain].bg.transcript})`,
        height: '100vh',
        margin: 0,
        padding: 2,
        alignItems: 'center',
    };

    return (
        <div className='flex flex-col gap-1'>

            <div className='flex items-center justify-center'>

                <div ref={contentToPrint} className='bg-white border-[2px] flex flex-col h-[1121px] p-0 text-black w-[793px]'>
                    <div style={backgroundImageStyle} className='bg-slate-100 m-1'>
                        <TransHeader schoolinfo={schoolinfo} params={params} />
                        <TransStudentInfo studentInfo={studentInfo} />
                        <div className='h-[750px]'>
                            <div className='flex flex-col h-[50%] items-center justify-center'>
                                <div className='font-semibold tracking-widest'>Semester I</div>
                                <TranscriptSemester semResults={resultI} />
                            </div>
                            <div className='flex flex-col h-[50%] items-center justify-center'>
                                <div className='font-semibold tracking-widest'>Semester II</div>
                                <TranscriptSemester semResults={resultII} />
                            </div>
                        </div>
                        <TransFooter resultAll={resultAll} schoolinfo={schoolinfo} />
                    </div>
                </div>

            </div>

            <div className='flex font-medium items-center justify-center px-6 py-2 rounded text-white text-xl'>
                <div className='bg-blue-700 cursor-pointer flex gap-2 px-6 py-1 rounded'>
                    <MessageModal table="confirm_print_transcript" type="custom" buttonTitle='Print' params={params} data={studentInfo}
                        icon={<FaArrowRight size={23} />}
                        customClassName='flex gap-2'
                        extra_data={[
                            `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`,
                            () => { handlePrint(null, () => contentToPrint.current)}
                        ]}
                    />
                </div>
                {/* <button onClick={() => { handlePrint(null, () => contentToPrint.current); }} className='bg-blue-700 font-medium px-6 py-2 rounded text-white text-xl'>Print</button> */}
            </div>
        </div>
    )
}

export default Transcript