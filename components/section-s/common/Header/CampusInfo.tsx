import { protocol } from '@/config'
import { getData } from '@/functions'
import { GetSchoolInfoUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetSchoolInfoInter } from '@/NoDomain/Utils-H/appControl/appInter'
import React, { useEffect, useState } from 'react'

const CampusInfo = () => {

    const [ count, setCount ] = useState(0)
    const [ schoolInfo, setSchoolInfo ] = useState<GetSchoolInfoInter>()

    useEffect(() => {
        const school = localStorage.getItem("school");
        if (count == 0 && school){
            const getCampusInfo = async () => {
                var d = await getData(`${protocol + GetSchoolInfoUrl}/${school}`, { fieldList: [ "id", "school_name", "campus__region", "campus__name" ]})
                if (d){
                    setSchoolInfo(d)
                }
                setCount(1)
            }
            getCampusInfo()
        }
    }, [ count ])
  return (
    <div>
        {schoolInfo && <div className='tracking-widest'>
            <span className='dark:text-white flex font-semibold text-slate-800 text-xl'>{schoolInfo.school_name}</span>
            <span className='flex font-medium'>{schoolInfo.campus__region} - {schoolInfo.campus__name}</span>
        </div>}
    </div>
  )
}

export default CampusInfo