import { protocol } from '@/config'
import { GetSchoolInfoInter } from '@/Domain/Utils-H/appControl/appInter'
import { getData } from '@/functions'
import { GetSchoolInfoUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const CampusInfo = () => {

    const domain = useParams().domain;
    const [ count, setCount ] = useState(0)
    const [ schoolInfo, setSchoolInfo ] = useState<GetSchoolInfoInter>()

    useEffect(() => {
        const school = localStorage.getItem("school");
        if (count == 0 && school){
            const getCampusInfo = async () => {
                if (domain){
                    var d = await getData(protocol + "api" + domain + "." + GetSchoolInfoUrl, {id: school, nopage: true, fieldList: [ "id", "school_name", "campus__region", "campus__name" ]})
                } else {
                    var d = await getData(protocol + GetSchoolInfoUrl, {id: school, nopage: true, fieldList: [ "id", "school_name", "campus__region", "campus__name" ]})
                }
                if (d && d.length == 1){
                    setSchoolInfo(d[0])
                }
                setCount(1)
            }
            getCampusInfo()
        }
    }, [ count, domain ])
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