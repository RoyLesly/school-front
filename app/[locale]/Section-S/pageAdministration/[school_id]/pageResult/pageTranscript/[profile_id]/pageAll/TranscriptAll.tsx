import { GetResultInter, GetTermResultInter } from '@/NoDomain/Utils-S/appControl/appInter'
import { ConfigData } from '@/config'
import React from 'react'
import { GrStatusGood } from 'react-icons/gr'

const TranscriptAll = async ({ results }: any) => {
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

        <div className={`bg-blue-800 font-medium grid grid-cols-12 px-2 py-0 items-center text-white text-sm`}>
          {/* <div className='col-span-1'>CODE</div> */}
          <div className='col-span-5'>SUBJECT</div>
          <div className='col-span-7 grid grid-cols-7 items-center justify-center'>
            <div className='col-span-2 flex grid-cols-3 items-center justify-between mr-2'>
              <div className='col-span-1 flex items-center justify-center'>1st</div>
              <div className='col-span-1 flex items-center justify-center'>2nd</div>
              <div className='col-span-1 flex items-center justify-center'>3rd</div>
            </div>
            <div className='col-span-2 flex grid-cols-4 items-center justify-between'>
              <div className='col-span-1 flex items-center justify-center'>Av</div>
              <div className='col-span-1 flex items-center justify-center'>Coef</div>
              <div className='col-span-1 flex items-center justify-center'>Marks</div>
              <div className='col-span-1 flex items-center justify-center'>Rank</div>
            </div>
            <div className='col-span-1 flex items-center justify-center'>Grade</div>
            <div className='col-span-1 flex items-center justify-center text-[12px]'>Teacher</div>
            <div className='col-span-1 flex items-center justify-center'>Sign</div>
          </div>
        </div>

        {results && results.results.map((item: GetTermResultInter) => <div key={item.id} className='grid grid-cols-12 odd:bg-blue-100 px-2 py-0'>
          <div className='col-span-5 font-medium'>{item.subject_name}</div>
          <div className='col-span-7 grid grid-cols-7 items-center justify-center'>
            <div className='col-span-2 flex grid-cols-3 items-center justify-between'>
              <div className='col-span-1 flex items-center justify-center'>{item.average_term_1}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.average_term_2}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.average_term_3}</div>
            </div>
            <div className='col-span-2 flex grid-cols-4 items-center justify-between'>
              <div className='col-span-1 flex items-center justify-center'>{item.anual_average}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.subject_coefficient}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.total}</div>
              <div className='col-span-1 flex items-center justify-center'>{item.total}</div>
            </div>
            <div className='col-span-1 flex items-center justify-center text-sm'>{item.grade_1}</div>
            <div className='col-span-1 flex items-center justify-center'>{item.total}</div>
            <div className='col-span-1 flex items-center justify-center'>{item.total}</div>
            <div className='col-span-1 flex items-center justify-center'></div>
          </div>

        </div>)}



        <div className='font-medium grid grid-cols-12 mt-2 px-2 text-[13px]'>
          <div className='col-span-2'>Subjects: {results.count}</div>
          <div className='col-span-4'>Attemted: {results.total_subject_attempted}</div>
          <div className='col-span-2'>Passed: {results.total_subject_earned}</div>
          <div className='col-span-1'>Failed: {results.total_subject_failed}</div>
          <div className='col-span-1 flex items-center justify-end'>{results.total_coef}</div>
          <div className='col-span-1 flex items-center justify-end'>{results.anual_total}</div>
          {/* <div className='col-span-2 flex items-center justify-center'>Average: {results.average}</div> */}
        </div>


      </div>

    </div>
  )
}

export default TranscriptAll