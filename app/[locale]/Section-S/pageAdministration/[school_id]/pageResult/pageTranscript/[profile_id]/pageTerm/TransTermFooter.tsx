import { GetResultInter, GetSchoolInfoInter } from '@/NoDomain/Utils-S/appControl/appInter'
import React, { FC } from 'react'


interface TransFooterProps {
    term: string | number
    results: any
    schoolinfo: GetSchoolInfoInter
}

const TransTermFooter:FC<TransFooterProps> = async ({ results, schoolinfo, term }: any) => {
    // console.log(schoolinfo, 5)
    // console.log(results, 6)
    const calcGPA = async () => {
        if (results) {
            // var fil = await result.filter((item: GetResultInter) => item.average > 0)
            // var t = fil.reduce((accum: number, cur: GetResultInter) => parseFloat(accum.toString()) + parseFloat(cur.average.toString()), 0)
            // return (t / (fil.length * 25)).toFixed(2)
        }
    }
    const GPA = await calcGPA()

    return (
        <div className='border-2 flex flex-row gap-2 h-[190px] pl-2 text-black'>
            <div className='flex flex-col w-[470px]'>
                <div className="font-bold grid grid-cols-8 italic">
                    <div className='col-span-1 flex items-center justify-center text-center'>Grade</div>
                    <div className='col-span-2 flex items-center justify-center text-center'>Mark</div>
                    <div className='col-span-3 flex items-center justify-center text-center'>Class of Degree</div>
                </div>
                <div className="font-medium grid grid-cols-8">
                    <div className='col-span-1 flex flex-col items-center justify-center text-[14px]'>
                        <div className='h-[25px]'>A</div>
                        <div className='h-[25px]'>B</div>
                        <div className='h-[25px]'>C</div>
                        <div className='h-[25px]'>D</div>
                        <div className='h-[25px]'>F</div>
                    </div>
                    <div className='col-span-2 flex flex-col items-center justify-center text-[14px]'>
                        <div className='h-[25px] pl-1'>{`> 17.5`}</div>
                        <div className='h-[25px]'>15.0 - 17.4</div>
                        <div className='h-[25px]'>13.0 - 14.9</div>
                        <div className='h-[25px]'>10.0 - 12.9</div>
                        <div className='h-[25px]'>8.0-9.9</div>
                    </div>

                </div>

            </div>

            <div className='flex flex-col px-2 w-[600px]'>
                <div className="font-medium grid grid-cols-3 h-[18px] pl-4">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[14px]'>
                        Attempted
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[14px]'>
                        {term == 1 ?
                            results.total_subject_attempted_1 
                            : term == 2 ?
                                results.total_subject_attempted_2
                                : 
                                results.total_subject_attempted_3
                        }
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-[16px] pl-4">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[14px]'>
                        Passed
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[14px]'>
                        {term == 1 ?
                            results.total_subject_earned_1 
                            : term == 2 ?
                                results.total_subject_earned_2
                                : 
                                results.total_subject_earned_3
                        }
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-[20px] pl-4">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[16px]'>
                        Average
                    </div>
                    <div className='col-span-1 flex flex-col font-bold items-center justify-center text-[16px]'>
                        {term == 1 ?
                            results.average_1 
                            : term == 2 ?
                                results.average_2
                                : 
                                results.average_3
                        } / 20
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-[20px] pl-4">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[16px]'>
                        Decision
                    </div>
                    <div className='col-span-1 flex flex-col font-bold items-center justify-center text-[4px]'>
                        .
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-40 pl-4">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[16px]'>
                        Done in {schoolinfo.town}
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[16px]'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransTermFooter