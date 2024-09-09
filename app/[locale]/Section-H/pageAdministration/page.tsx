'use client';
import { protocol } from '@/config';
import { getData } from '@/functions';
import { GetSchoolInfoUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetSchoolInfoInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SelectDept = () => {

  const [count, setCount] = useState<number>(0)
  const [schools, setSchools] = useState<GetSchoolInfoInter[]>()
  const [link, setLink] = useState<string>()
  const router = useRouter();

  useEffect(() => {
    if (count == 0) {
      var access = localStorage.getItem("session");
      if (access) {
        var token = jwtDecode(access)

        if (token && token.school) {
          const callSchool = async () => {
            var res = await getData(protocol + GetSchoolInfoUrl, { fieldList: [ "id", "school_name", "campus__region", "campus__name"]})
            if (res && res.unauthorized) { 
              router.push(`/pageAuthentication/Login`);
            }
            if (res && res.results) {
              var s = token.school?.map((item: string) => item.toString())
              var fil = res.results.filter((item: GetSchoolInfoInter) => s?.includes(item.id.toString()))
              if (fil) {
                setSchools(fil)
              }
            }
          }
          callSchool();
          setCount(1);
          if (token.role == "admin") {
            if (token.dept?.includes("Administration")) { setLink(`/Section-H/pageAdministration`); return }
          } 
          if (token.role == "teacher") {
            if (token.dept?.includes("Administration")) { setLink(`/Section-H/pageAdministration`); return }
            if (token.dept?.includes("Lecturer")) { setLink("/pageLecturer"); return }
          } else {
            if (!token.page || token.page.length < 1) {
              if (token.dept?.includes("Student")) { setLink("/pageStudent"); return }
              if (token.dept?.includes("Acounting")) { setLink("/pageAcounting"); return }
              if (token.dept?.includes("Administration")) { setLink("/Section-H/pageAdministration"); return }
            } else {
              if (token.page?.includes("MarkUpload")) { setLink("/pageMarkUpload"); return }
              if (token.page?.includes("CourseAssignment")) { setLink("/pageCourseAssignment"); return }
              if (token.page?.includes("CourseTimeTable")) { setLink("/pageCourseTimeTable"); return }
            }
          }
        }
      } else {
        router.push(`/pageAuthentication/Login`)
      }
    }
    if (count == 1 && schools && schools.length > 0){

    }
  }, [ count, schools, router ])

  return (
    <>
      <div className='flex flex-col gap-10 h-screen items-center justify-center'>

        <div className='font-semibold items-center justify-center md:mb-10 text-4xl text-center'>Select Campus</div>

        <div className='gap-6 grid grid-col-1 lg:grid-cols-3 md:grid-cols-2'>
        {schools && link &&
          schools.map((item: GetSchoolInfoInter) => (
            <Link href={`${link}/${item.id}`} key={item.id} className='bg-blue-950 border-2 cursor-pointer dark:hover:bg-teal-300 dark:hover:text-black dark:text-teal-100 flex font-bold h-40 hover:animate-ping-once items-center justify-center lg:h-48 lg:w-[300px] md:h-40 md:text-2xl md:w-56 rounded text-lg text-white tracking-widest w-60'>
              <div onClick={() => { localStorage.setItem("school", item.id.toString()) }} className='flex flex-col gap-2 items-center justify-center'>
                <span className='md:px-6 px-4 text-center text-wrap text-xl'>{item.school_name}</span>
                <span className='md:text-xl'>{item.campus__region}</span>
                <span className='md:text-xl'>{item.campus__name}</span>
              </div>
            </Link>
          ))
        }
      </div>
      </div>

    </>
  )
}

export default SelectDept