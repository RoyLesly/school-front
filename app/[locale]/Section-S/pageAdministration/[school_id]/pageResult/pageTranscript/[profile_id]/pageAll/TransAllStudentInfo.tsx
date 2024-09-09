import { GetSecondaryProfileInter } from '@/NoDomain/Utils-S/userControl/userInter'
import React, { FC } from 'react'


interface Props {
  studentInfo: GetSecondaryProfileInter
}
const TransAllStudentInfo: FC<Props> = ({ studentInfo }) => {

  console.log(studentInfo, 10)

  return (
    <>
      {studentInfo ? <div className="flex flex-col gap-1 h-[105px] px-4">
        <div className='flex flex-row gap-6'>

          <div className='flex flex-col gap-2 w-3/5'>
            <div className="gap-0 grid grid-cols-10 h-[18px] w-full">
              <div className='col-span-1'>Name:</div>
              <div className='col-span-9 flex font-semibold italic justify-end text-black'>{studentInfo.user__full_name}</div>
            </div>
            <div className="gap-4 grid grid-cols-12 h-[18px] w-full">
              <div className='col-span-4'>DoB / PoB:</div>
              <div className='col-span-8 flex font-medium italic justify-end text-black'>{studentInfo.user__dob} - {studentInfo.user__pob}</div>
            </div>
            <div className="gap-4 grid grid-cols-3 h-[18px] w-full">
              <div className='col-span-1'>Gender:</div>
              <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.user__sex}</div>
            </div>
          </div>

          <div className='flex flex-col gap-2 w-2/5'>
            <div className="gap-4 grid grid-cols-9 h-[18px] w-full">
              <div className='col-span-4'>Matricle:</div>
              <div className='col-span-5 flex font-medium italic justify-end text-black'>{studentInfo.user__matricle}</div>
            </div>
            <div className="gap-4 grid grid-cols-12 h-[18px] w-full">
              <div className='col-span-5'>Class/Domain:</div>
              <div className='col-span-7 flex font-medium italic justify-end text-[13px] text-black'>{studentInfo.secondary_classroom__level__level} {studentInfo.secondary_classroom__level__option} - {studentInfo.secondary_classroom__domain}</div>
            </div>
            <div className="gap-4 grid grid-cols-4 h-[18px] w-full">
              <div className='col-span-2'>School Year:</div>
              <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.secondary_classroom__academic_year}</div>
            </div>
          </div>

        </div>

        <div className='flex font-semibold items-center justify-center text-black tracking-widest'>
          <span>FINAL RESULTS</span>
        </div>

      </div> : <></>
      }
    </>
  )
}

export default TransAllStudentInfo