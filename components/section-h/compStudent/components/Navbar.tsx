import { protocol } from '@/config';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { getData } from '@/functions';
import Link from 'next/link';
import React from 'react';
import { FaPowerOff } from 'react-icons/fa6'

const Navbar = async ({ params }: any) => {

  const profile: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, {id: params.userprofile_id, fieldList: [ 
    "id", "specialty__school__school_name", "specialty__school__campus__region", "specialty__school__campus", "specialty__school__campus__name"
  ]});


  return (
    <nav className='bg-blue-900 fixed flex h-[64px] items-center justify-between left-0 px-6 py-2 top-0 w-full'>

      {profile && profile.count && <div className='flex flex-col justify-between text-white'>
        <span className='font-semibold text-center tracking-widest'>{profile.results[0].specialty__school__school_name}</span>
        <div className='flex font-medium gap-4 italic items-center justify-center text-sm'>
          <span className='flex'>{profile.results[0].specialty__school__campus__region}</span>
          <span className='flex'>-</span>
          <span className='flex'>{profile.results[0].specialty__school__campus__name}</span>
        </div>
      </div>}

      <div className='flex items-center justify-center'>
        <span>
          {/* <DarkModeSwitcher /> */}
        </span>
        <span>
          <Link href={"/pageAuthentication/Logout"}><FaPowerOff color='red' size={25}/></Link>
        </span>
      </div>

    </nav>
  )
}

export default Navbar