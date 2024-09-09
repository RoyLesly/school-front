'use client';
import { getData } from '@/functions';
import { CustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { CustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const MyProfile = ({ id }: any) => {

  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<CustomUserInter>();

  useEffect(() => {
    if (count == 0) {
      const session = localStorage.getItem("session")
      if (session) {
        var user = jwtDecode(session)
        if (user && user.user_id) {
          const GetUserInfo = async () => {
            var apiData = await getData(`${CustomUserUrl}/${user.user_id}`, {})
            if (apiData && apiData.id) { 
                setUserInfo(apiData);
            }
          };
          GetUserInfo();
          setCount(1);
        }
      }


    }
  }, [count])


  return (
    <div className='bg-slate-200 flex flex-col gap-4 h-screen items-center justify-center p-3 rounded'>

      {/* <div className='font-semibold items-center justify-center mb-10 text-4xl text-center'>
        <Link href={"/pageAuthentication/Logout"}><FaPowerOff color="red" /></Link>
      </div> */}

      <div className='font-semibold my-4 text-4xl text-slate-600'><h1>MY PROFILE</h1></div>

      {userInfo ?

        <div className='bg-blue-950 flex flex-row font-medium gap-2 mb-40 mx-4 px-3 py-6 rounded text-lg text-white tracking-wide w-full'>
          <div className='flex flex-col w-full'>
            
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Matricle: </span><span className='italic text-lg text-wrap uppercase w-full'>{userInfo.matricle}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Full: </span><span className='italic text-lg text-wrap w-full'>{userInfo.full_name}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Gender: </span><span className='italic text-lg w-full'>{userInfo.sex}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Date Of Birth: </span><span className='italic text-lgl w-full'>{userInfo.dob}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Place of Birth: </span><span className='italic text-lg w-full'>{userInfo.pob}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Address: </span><span className='italic text-lg w-full'>{userInfo.address}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Telephone: </span><span className='font-bold italic text-lg w-full'>{userInfo.telephone}</span></div>
            <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Email: </span><span className='italic text-lg w-full'>{userInfo.email}</span></div>
          </div>
          <div className='flex flex-col'></div>
        </div>

        :

        <></>}

    </div>
  )
}

export default MyProfile

