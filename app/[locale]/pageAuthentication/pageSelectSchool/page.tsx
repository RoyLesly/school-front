'use client';
import { getData } from '@/functions';
import Loader from '@/section-h/common/Loader';
import { GetSchoolInfoUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetSchoolInfoInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaPowerOff } from 'react-icons/fa6';
import { protocol } from '@/config';

const SelectDept = () => {

  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [schools, setSchools] = useState<GetSchoolInfoInter[]>()
  const [ dept, setDept ] = useState<string>()
  const router = useRouter();
  const paramsRole = useSearchParams();
  console.log(dept, 20)

  useEffect(() => {
    if (count == 0) {
      var access = localStorage.getItem("session");
      console.log(paramsRole.get("role"), 26)
      if (paramsRole.get("role") == "admin"){ setDept("pageAdministration") }
      if (paramsRole.get("role") == "teacher"){ setDept("pageLecturer") }
      if (!paramsRole.get("role")){ router.push(`/pageAuthentication/Login`); }
      if (access) {
        var token = jwtDecode(access)

        if (token && token.school) {
          const callSchool = async () => {
            var res = await getData(protocol + GetSchoolInfoUrl, { nopage: true, fieldList: [ "id", "school_name", "school_type", "campus__name", "campus__region" ]})
            if (res && res.unauthorized) {
              localStorage.removeItem("session");
              router.push(`/pageAuthentication/Login`);
            }
            if (res && res.length > 0) {
              var s = token.school?.map((item: string) => item.toString())
              var fil = res.filter((item: GetSchoolInfoInter) => s?.includes(item.id.toString()))
              if (fil) {
                setSchools(fil)
              }
            }
            setLoading(false)
          }
          callSchool();
          setCount(1);
        }
      } else {
        router.push(`/pageAuthentication/Login`)
      }
    }
    if (count == 1 && schools && schools.length > 0) {

    }
  }, [count, schools, router, paramsRole, dept])


  return (
    <>
      <div className='flex flex-col gap-4 h-screen items-center justify-center'>

        <div className='font-semibold items-center justify-center mb-4 text-4xl text-center'>
          <Link href={"/pageAuthentication/Logout"}><FaPowerOff color="red" /></Link>
        </div>

        <div className='font-semibold items-center justify-center mb-4 text-4xl text-center'>Select Campus</div>

        <div className='gap-6 grid grid-col-1 lg:grid-cols-3 md:grid-cols-2'>
          {!loading && schools && dept ?
            schools.map((item: GetSchoolInfoInter) => (
              <Link href={`/${item.school_type}/${dept}/${item.id}`} key={item.id} className='bg-blue-950 border-2 cursor-pointer dark:hover:bg-teal-300 dark:hover:text-black dark:text-teal-100 flex font-bold h-[140px] hover:animate-ping-once items-center justify-center lg:h-48 lg:w-[300px] md:h-40 md:text-2xl md:w-56 rounded-es-[40px] rounded-tr-lg text-[16px] text-white tracking-widest w-60'>
                <div onClick={() => { localStorage.setItem("school", item.id.toString()) }} className='flex flex-col items-center justify-center'>
                  <span className='md:px-6 pb-2 px-4 text-center text-wrap'>{item.school_name}</span>
                  <span className='italic md:text-xl text-yellow-100'>{item.campus__region}</span>
                  <span className='italic md:text-xl text-yellow-500'>{item.campus__name}</span>
                </div>
              </Link>
            ))
          :
          <Loader />
          }
        </div>

        <div className="mt-4">
          <button onClick={() => { router.back() }} className='bg-greendark font-medium px-6 py-1 rounded text-lg text-white'>Back</button>
        </div>

      </div>

      

    </>
  )
}

export default SelectDept