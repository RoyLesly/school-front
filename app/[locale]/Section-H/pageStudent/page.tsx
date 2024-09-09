'use client';
import { getData } from '@/functions';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaPowerOff } from 'react-icons/fa6';

const SelectDept = () => {

  const [count, setCount] = useState<number>(0)
  const [myProfiles, setMyProfiles] = useState<GetUserProfileInter[]>();

  const router = useRouter();

  useEffect(() => {
    if (count == 0) {
      var session = localStorage.getItem("session");
      if (session) {
        var token = jwtDecode(session)

        if (token && token.school) {
          const callUserProfiles = async () => {
            var res = await getData(GetUserProfileUrl, { user__id: token.user_id, user__role: "student", active: true, nospecialty: false, fieldList: [
              "id", "specialty__id", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level"
            ] })
            if (res && res.unauthorized) {
              router.push(`/pageAuthentication/Login`);
            }
            if (res && res.results) {
              setMyProfiles(res.results)
            }
          }
          callUserProfiles();
          setCount(1);
        }
      } else {
        router.push(`/pageAuthentication/Login`)
      }
    }
    if (count == 1) {

    }
  }, [count, router])

  return (
    <>
      <div className='flex flex-col gap-10 h-screen items-center justify-center'>

        <div className='font-semibold items-center justify-center mb-4 md:mb-10 text-4xl text-center'>
          <Link href={"/pageAuthentication/Logout"}><FaPowerOff color="red"/></Link>
        </div>

        <div className='font-semibold items-center justify-center md:mb-4 md:text-4xl text-center text-xl'>Select Class</div>

        <div className='bg-white px-6 rounded'>
          {myProfiles && myProfiles.length > 0 ?
            <div  className='gap-6 grid grid-col-1 lg:grid-cols-3 md:grid-cols-2'>
              {myProfiles.map((item: GetUserProfileInter) => (
              <Link href={`/pageStudent/${item.id}/${item.specialty__id}`} key={item.id} className='bg-blue-950 border-2 cursor-pointer dark:hover:bg-teal-300 dark:hover:text-black dark:text-teal-100 flex font-bold h-40 hover:animate-ping-once items-center justify-center lg:h-48 lg:w-[300px] md:h-40 md:text-2xl md:w-56 rounded text-lg text-white tracking-widest w-60'>
                <div onClick={() => { localStorage.setItem("profile", item.id.toString()) }} className='flex flex-col gap-2 items-center justify-center'>
                  <span className='md:px-6 px-4 text-center text-wrap text-xl'>{item.specialty__main_specialty__specialty_name}</span>
                  <span className='md:text-xl'>{item.specialty__academic_year}</span>
                  <span className='md:text-xl'>{item.specialty__level__level}</span>
                </div>
              </Link>
            ))}
            </div>

            :

            <div className='flex flex-col font-medium gap-4 justify-center text-center text-lg tracking-wide w-full'>
              <div className='flex items-center justify-center text-center text-red'>No Class Assigned !!!</div>
              <div className='flex items-center justify-center text-center'><code>Contact Administration</code></div>
            </div>

          }
        </div>

          <div className="mb-20">
            <button onClick={() => { router.back() }} className='bg-greendark font-medium px-6 py-1 rounded text-lg text-white'>Back</button>
          </div>

      </div>

    </>
  )
}

export default SelectDept