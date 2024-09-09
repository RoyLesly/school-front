import { GetResultInter } from '@/NoDomain/Utils-H/appControl/appInter'
import React from 'react'

const TransFooter = async ({ resultAll, schoolinfo }: any) => {
    const calcGPA = async () => {
        if (resultAll.count) {
            var fil = await resultAll.results.filter((item: GetResultInter) => item.average > 0)
            var t = fil.reduce((accum: number, cur: GetResultInter) => parseFloat(accum.toString()) + parseFloat(cur.average.toString()), 0)
            return (t / (fil.length * 25)).toFixed(2)
        }
    }
    const GPA = await calcGPA()

    return (
        <div className='border-2 flex flex-row gap-2 h-[120px] pl-2 text-black'>
            <div className='flex flex-col text-xs w-[300px]'>
                <div className="font-bold grid grid-cols-8 italic">
                    <div className='col-span-1 flex items-center justify-center text-center'>Grade</div>
                    <div className='col-span-1 flex items-center justify-center text-center'>Mark</div>
                    <div className='col-span-1 flex items-center justify-center text-center'>GP</div>
                    <div className='col-span-2 flex items-center justify-center text-center'>GPA</div>
                    <div className='col-span-3 flex items-center justify-center text-center'>Class of Degree</div>
                </div>
                <div className="font-medium grid grid-cols-8">
                    <div className='col-span-1 flex flex-col items-center justify-center text-[11px]'>
                        <div className='h-[12px]'>A</div>
                        <div className='h-[12px] pl-2'>B+</div>
                        <div className='h-[12px]'>B</div>
                        <div className='h-[12px] pl-2'>C+</div>
                        <div className='h-[12px]'>C</div>
                        <div className='h-[12px] pl-2'>D+</div>
                        <div className='h-[12px]'>D</div>
                        <div className='h-[12px]'>F</div>
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[11px]'>
                        <div className='h-[12px] pl-1'>{`>80`}</div>
                        <div className='h-[12px]'>70-79</div>
                        <div className='h-[12px]'>60-69</div>
                        <div className='h-[12px]'>55-59</div>
                        <div className='h-[12px]'>50-54</div>
                        <div className='h-[12px]'>45-49</div>
                        <div className='h-[12px]'>40-44</div>
                        <div className='h-[12px]'>{`<40`}</div>
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[11px]'>
                        <div className='h-[12px]'>4.0</div>
                        <div className='h-[12px]'>3.5</div>
                        <div className='h-[12px]'>3.0</div>
                        <div className='h-[12px]'>2.5</div>
                        <div className='h-[12px]'>2.0</div>
                        <div className='h-[12px]'>1.5</div>
                        <div className='h-[12px]'>1.0</div>
                        <div className='h-[12px]'>0.0</div>
                    </div>
                    <div className='col-span-2 flex flex-col items-center justify-center text-[11px]'>
                        <div className='h-[13px]'>3.60-4.00</div>
                        <div className='h-[13px]'>3.00-3.59</div>
                        <div className='h-[13px]'>2.50-2.99</div>
                        <div className='h-[13px]'>2.25-2.49</div>
                        <div className='h-[13px]'>2.00-2.24</div>
                        <div className='h-[13px]'>UD =</div>
                        <div className='h-[13px]'>LD =</div>
                    </div>
                    <div className='col-span-3 flex flex-col items-center justify-center text-[11px]'>
                        <div className='h-[13px]'>First Class</div>
                        <div className='h-[13px]'>Second Class - UD</div>
                        <div className='h-[13px]'>Second Class - LD</div>
                        <div className='h-[13px]'>Third Class</div>
                        <div className='h-[13px]'>Passed</div>
                        <div className='h-[13px]'>Upper Division</div>
                        <div className='h-[13px]'>Lower Division</div>
                    </div>
                </div>

            </div>

            <div className='flex flex-col text-[11px] text-xs w-[163px]'>
                <div className="font-medium grid grid-cols-3">
                    <div className='col-span-1 flex flex-col items-center justify-center text-[11px]'>
                        <div className='flex h-[13px] text-[4px]'><span>.</span></div>
                        <div className='flex h-[12px]'><span className='text-[14px]'>*</span></div>
                        <div className='flex h-[13px]'><span>I </span></div>
                        <div className='flex h-[13px]'><span>CV</span></div>
                        <div className='flex h-[13px]'><span>GP</span></div>
                        <div className='flex h-[13px]'><span>GPA</span></div>
                        <div className='flex h-[13px]'><span>WP</span></div>
                        <div className='flex h-[12px]'><span>GD</span></div>
                    </div>
                    <div className='col-span-2 flex flex-col items-center justify-center text-[10px]'>
                        <div className='flex h-[13px] text-[4px]'><span>.</span></div>
                        <div className='h-[12px]'>Obtain after Resit</div>
                        <div className='h-[13px]'>Incomplete</div>
                        <div className='h-[13px]'>Credit Value</div>
                        <div className='h-[13px]'>Grade Point</div>
                        <div className='h-[13px]'>Grade Point Average</div>
                        <div className='h-[13px]'>Weighted Point</div>
                        <div className='h-[13px]'>Grade</div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col w-[320px]'>
                <div className="font-medium grid grid-cols-3 h-[16px]">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[12px]'>
                        Total Credit Attempted
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[12px]'>
                        {resultAll.total_credit_attempted}
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-[16px]">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[12px]'>
                        Total Credit Earned
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[12px]'>
                        {resultAll.total_credit_earned}
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-[20px]">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[14px]'>
                        Cumulative GPA
                    </div>
                    <div className='col-span-1 flex flex-col font-bold items-center justify-center text-[14px]'>
                        {resultAll.gp.toFixed(2)}
                    </div>
                </div>
                <div className="font-medium grid grid-cols-3 h-20">
                    <div className='col-span-2 flex flex-col items-start justify-center text-[12px]'>
                        Done in {schoolinfo.town}
                    </div>
                    <div className='col-span-1 flex flex-col items-center justify-center text-[12px]'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransFooter