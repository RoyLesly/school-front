'use client'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { ResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { SchemaCreateEditResult } from '@/NoDomain//schemas/schemas'
import { GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { protocol } from '@/config'

const CreateMissingResults = ({ params, filB, session, lecturer_id }: any) => {

  const router = useRouter();
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);


  const createResults = async () => {
    setSubmitClicked(true)
    if (filB && filB.length > 0) {

      await Promise.allSettled(filB.map((item: GetUserProfileInter, index: number) => {
        const data = {
          student_id: item.id,
          course_id: params.course_id,
          created_by_id: session ? session.user_id : 0,
        }
        return (
          ActionCreate(data, SchemaCreateEditResult, protocol + ResultUrl)
        )
      }))
        .then(res => {
          console.log(10500, res)
          if (res && res.length > 0) {
            const t = res.map(item => item.status)
            if (t[0] == "fulfilled") { 
              router.back(); 
            }
            else { router.push(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry?error=Error !!!`); }
          }
        })
        .catch(err => {
          console.log(98, err)
        })
      setSubmitClicked(false)

      return
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center my-2 py-2 text-lg">
      <div className="flex font-medium text-red">Missing Result Detected !!!</div>
      <div className="">
        {!submitClicked && <button onClick={() => { setSubmitClicked(true); createResults() }} type="submit" className='bg-teal-800 border flex font-semibold gap-2 items-center justify-center px-10 py-2 rounded text-white'>Generate Results <FiRefreshCw /></button>}
      </div>

      {submitClicked && <div className='flex items-center justify-center mb-2 mt-10'>
        <div className="animate-spin border-4 border-primary border-solid border-t-transparent flex h-[30px] items-center justify-center rounded-full w-[30px]"></div>
      </div>}

    </div>
  )
}

export default CreateMissingResults