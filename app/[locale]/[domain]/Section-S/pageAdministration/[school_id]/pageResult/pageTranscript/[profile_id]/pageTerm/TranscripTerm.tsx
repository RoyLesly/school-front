import { GetTermResultInter } from '@/Domain/Utils-S/appControl/appInter'
import React from 'react'


const TranscriptTerm = async ({ results, term }: any) => {
  const getNum = (n: number) => {
    var h = 20
    var t = 16
    if (n > 9) { h = 20, t = 16 }
    if (n > 11) { h = 18, t = 14 }
    if (n > 14) { h = 16, t = 12 }
    return [h, t]
  }
  var num = await getNum(results.count);

  const checkResit: any = (av: number, resit: number | null) => {
    if (resit) {
      if (av) { return <span className={`${av < 50 ? "text-red font-medium" : ""}`}><b className={` mr-2 text-red`}>*</b>{av.toFixed(1)}</span> }
      return "-"
    } else {
      if (av) { return <span className='ml-4'>{av.toFixed(1)}</span> }
      return <span className='ml-4'>-</span>
    }
  }

  const add = (a: any, b: any, c: any) => {
    var count = (a ? 1 : 0) + (b ? 1 : 0) + (c ? 1 : 0)
    var sum = (a ? a : 0) + (b ? b : 0) + (c ? c : 0)
    return sum / count ? sum / count : 0
  }

  return (
    <div className='border gap-0 w-full'>

      <div className='gap-0 mb-1 text-black w-full'>

        <div className={`bg-blue-800 font-medium grid grid-cols-12 px-2 py-1 items-center text-white text-[16px]`}>
          <div className='col-span-1'>CODE</div>
          <div className='col-span-6'>SUBJECT</div>
          <div className='col-span-5 grid grid-cols-6 items-center justify-center'>
            <div className='col-span-1 flex items-center justify-center'>1st</div>
            <div className='col-span-1 flex items-center justify-center'>2nd</div>
            <div className='col-span-1 flex items-center justify-center'>Av</div>
            <div className='col-span-1 flex items-center justify-center'>Coef</div>
            <div className='col-span-1 flex items-center justify-center'>Total</div>
            <div className='col-span-1 flex items-center justify-center'>Grade</div>
          </div>
        </div>

        {results && results.results.map((item: GetTermResultInter) => <div key={item.id} className='grid grid-cols-12 odd:bg-blue-100 px-2 py-1'>
          <div className='col-span-1 text-sm'>{item.subject_code}</div>
          <div className='col-span-6 font-medium'>{item.subject_name}</div>
          <div className='col-span-5 grid grid-cols-6 items-center justify-center'>
            {term == 1 && <>
              <div className='col-span-1 flex items-center justify-center'>{item.seq_1}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.seq_2}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.average_term_1}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.subject_coefficient}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.total_1}</div>
              <div className='col-span-1 flex items-center justify-center text-sm'>{item.grade_1}</div>
            </>}
            {term == 2 && <>
              <div className='col-span-1 flex items-center justify-center'>{item.seq_3}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.seq_4}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.average_term_2}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.subject_coefficient}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.total_2}</div>
              <div className='col-span-1 flex items-center justify-center text-sm'>{item.grade_2}</div>
            </>}
            {term == 3 && <>
              <div className='col-span-1 flex items-center justify-center'>{item.seq_5}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.seq_6}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.average_term_3}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.subject_coefficient}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.total_3}</div>
              <div className='col-span-1 flex items-center justify-center text-sm'>{item.grade_3}</div>
            </>}

          </div>

        </div>)}

        {term == 1 && <>
          <div className='font-medium grid grid-cols-12 mt-4 px-2 text-[13px]'>
            <div className='col-span-2'>Subjects: {results.count}</div>
            <div className='col-span-4'>Attemted: {results.total_subject_attempted_1}</div>
            <div className='col-span-2'>Passed: {results.total_subject_earned_1}</div>
            <div className='col-span-1'>Failed: {results.total_subject_failed_1}</div>
            <div className='col-span-1 flex items-center justify-end'>{results.total_coef_1}</div>
            <div className='col-span-1 flex items-center justify-end'>{results.average_1}</div>
          </div></>}

        {term == 2 && <>
          <div className='font-medium grid grid-cols-12 mt-4 px-2 text-[13px]'>
            <div className='col-span-2'>Subjects: {results.count}</div>
            <div className='col-span-4'>Attemted: {results.total_subject_attempted_2}</div>
            <div className='col-span-2'>Passed: {results.total_subject_earned_2}</div>
            <div className='col-span-1'>Failed: {results.total_subject_failed_2}</div>
            <div className='col-span-1 flex items-center justify-end'>{results.total_coef_2}</div>
            <div className='col-span-1 flex items-center justify-end'>{results.average_2}</div>
          </div></>}

        {term == 3 && <>
          <div className='font-medium grid grid-cols-12 mt-4 px-2 text-[13px]'>
            <div className='col-span-2'>Subjects: {results.count}</div>
            <div className='col-span-4'>Attemted: {results.total_subject_attempted_3}</div>
            <div className='col-span-2'>Passed: {results.total_subject_earned_3}</div>
            <div className='col-span-1'>Failed: {results.total_subject_failed_3}</div>
            <div className='col-span-1 flex items-center justify-end'>{results.total_coef_3}</div>
            <div className='col-span-1 flex items-center justify-end'>{results.average_3}</div>
          </div></>}


      </div>

    </div>
  )
}

export default TranscriptTerm