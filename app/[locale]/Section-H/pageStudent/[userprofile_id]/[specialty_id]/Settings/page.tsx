'use client';
import { getData } from '@/functions';import { AppearanceUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { AppearanceInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const MyProfile = ({ id }: any) => {

  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const [appearanceInfo, setAppearanceInfo] = useState<AppearanceInter>();

  useEffect(() => {
    if (count == 0) {
      const session = localStorage.getItem("session")
      if (session) {
        var user = jwtDecode(session)
        if (user && user.user_id) {
          const GetAppearanceInfo = async () => {
            var apiData = await getData(AppearanceUrl, { user__id: user.user_id })
            if (apiData.results && apiData.results.length > 0) { 
              localStorage.setItem("color-theme", apiData.results[0].dark_mode)
              setAppearanceInfo(apiData.results[0]);
            }
          };
          GetAppearanceInfo();
          setCount(1);
        }
      }


    }
  }, [count])


  return (
    <div className='bg-slate-200 flex flex-col gap-4 h-screen items-center justify-center p-3 rounded'>

      <div className='font-semibold my-4 text-4xl text-slate-600'><h1>MY SETTINGS</h1></div>

      {appearanceInfo ?

        <div className='bg-blue-950 flex flex-row font-medium gap-2 mb-40 mx-4 px-3 py-6 rounded text-lg text-white tracking-wide w-full'>
          <div className='flex flex-col w-full'>
            
            {/* <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Matricle: </span><span className='italic text-lg text-wrap uppercase w-full'>{appearanceInfo.id}</span></div> */}
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Full Name: </span><span className='italic text-lg text-wrap w-full'>{appearanceInfo.user.full_name}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Mode: </span><span className='italic text-lg w-full'>{appearanceInfo.dark_mode}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Language: </span><span className='italic text-lg w-full'>{appearanceInfo.lang}</span></div>
            {/* <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Date Of Birth: </span><span className='italic text-lgl w-full'>{userInfo.dob}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Place of Birth: </span><span className='italic text-lg w-full'>{userInfo.pob}</span></div> */}
          </div>
          <div className='flex flex-col'></div>
        </div>

        :

        <></>}

    </div>
  )
}

export default MyProfile

