import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { CustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const userData: any = await getData(CustomUserUrl, { ...searchParams, id: params.lecturer_id })

  console.log(24, userData)
  console.log(25, userData)
  
  return (
    <LayoutLecturer>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {userData == "ECONNREFUSED" && <ServerError />}
        {userData && userData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {userData != "ECONNREFUSED" && userData.results && <List apiData={userData.results} params={params} />}


        {/* <Create params={params} /> */}

      </>
    </LayoutLecturer>
  )
}

export default page


export const metadata: Metadata = {
  title:
    "My Courses",
  description: "This is MyCourses Page",
};


const List = ({ apiData, params }: any) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col gap-4 h-full md:px-20 px-2 py-20 rounded-sm shadow-default">

      <div className='flex font-bold items-center justify-center py-6 text-2xl tracking-widest'>MY PROFILE</div>

      <div className='flex flex-col gap-2 items-center justify-center text-lg'>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Username: </span><span className='font-bold italic text-2xl w-full'>{apiData[0].username}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Full Name: </span><span className='italic text-lg w-full'>{apiData[0].full_name}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Gender: </span><span className='italic text-lg w-full'>{apiData[0].sex}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Date Of Birth: </span><span className='italic text-lgl w-full'>{apiData[0].dob}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Place of Birth: </span><span className='italic text-lg w-full'>{apiData[0].pob}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Address: </span><span className='italic text-lg w-full'>{apiData[0].address}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Telephone: </span><span className='font-bold italic text-lg w-full'>{apiData[0].telephone}</span></div>
          <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Email: </span><span className='italic text-lg w-full'>{apiData[0].email}</span></div>
      </div>
      </div>
  )
}




// 'use client';
// import { getData } from '@/functions';
// import { CustomUserUrl } from '@/NoDomain/UserControl/userConfig';
// import { CustomUserInter } from '@/NoDomain/UserControl/userInter';
// import { jwtDecode } from 'jwt-decode';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { FaPowerOff } from 'react-icons/fa6';

// const MyProfile = ({ id }: any) => {

//   const router = useRouter();
//   const [count, setCount] = useState<number>(0);
//   const [userInfo, setUserInfo] = useState<CustomUserInter>();

//   useEffect(() => {
//     if (count == 0) {
//       const session = localStorage.getItem("session")
//       if (session) {
//         var user = jwtDecode(session)
//         if (user && user.user_id) {
//           const GetUserInfo = async () => {
//             var apiData = await getData(`${CustomUserUrl}/${user.user_id}`, {})
//             if (apiData && apiData.id) { setUserInfo(apiData) }
//           };
//           GetUserInfo();
//           setCount(1);
//         }
//       }


//     }
//   }, [count])


//   return (
//     <div className='bg-slate-200 flex flex-col gap-4 h-screen items-center justify-center p-2 rounded'>

//       <div className='font-semibold items-center justify-center mb-10 text-4xl text-center'>
//         <Link href={"/pageAuthentication/Logout"}><FaPowerOff color="red" /></Link>
//       </div>

//       <div className='font-semibold my-4 text-4xl text-slate-600'><h1>MY PROFILE</h1></div>

//       {userInfo ?

//         <div className='bg-blue-950 flex flex-row font-medium gap-2 mx-4 p-4 rounded text-lg text-white tracking-wide w-full'>
//           <div className='flex flex-col w-full'>
//             {userInfo.role == "student" ? <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Matricle: </span><span className='font-bold italic text-2xl w-full'>{userInfo.matricle}</span></div>
//               :
//               <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Username: </span><span className='font-bold italic text-2xl w-full'>{userInfo.username}</span></div>}
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Full: </span><span className='italic text-lg w-full'>{userInfo.full_name}</span></div>
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Gender: </span><span className='italic text-lg w-full'>{userInfo.sex}</span></div>
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Date Of Birth: </span><span className='italic text-lgl w-full'>{userInfo.dob}</span></div>
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Place of Birth: </span><span className='italic text-lg w-full'>{userInfo.pob}</span></div>
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Address: </span><span className='italic text-lg w-full'>{userInfo.address}</span></div>
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Telephone: </span><span className='font-bold italic text-lg w-full'>{userInfo.telephone}</span></div>
//             <div className='flex items-center justify-between w-full'><span className='pr-2 w-60'>Email: </span><span className='italic text-lg w-full'>{userInfo.email}</span></div>
//           </div>
//           <div className='flex flex-col'></div>
//         </div>

//         :

//         <></>}

//       <div className='font-semibold mt-10 text-xl'>
//         <button onClick={() => { router.back() }} className='bg-greendark px-4 py-1 rounded text-white'>Back</button>
//       </div>

//     </div>
//   )
// }

// export default MyProfile










// // import { getData } from '@/functions';
// // import { CustomUserUrl } from '@/NoDomain/UserControl/userConfig';
// // import { CustomUserInter } from '@/NoDomain/UserControl/userInter';
// // import React from 'react'

// // const page = async ({
// //     params,
// //     searchParams,
// //   }: {
// //     params: { id: string };
// //     searchParams?: { [key: string]: string | string[] | undefined };
// //   }) => {

// //     const userInfo: CustomUserInter = await getData(`${CustomUserUrl}/${params.id}`, {})

// //     console.log(userInfo)


// //   return (
// //     <div>
// //       <div>
// //         <button onClick={() => {}}>Back</button>
// //       </div>

// //         <h1>My Profile</h1>
// //         <h3>{userInfo.username}</h3>
// //         <h3>{userInfo.full_name}</h3>
// //         <h3>{userInfo.sex}</h3>
// //         <h3>{userInfo.dob}</h3>
// //         <h3>{userInfo.address}</h3>
// //         <h3>{userInfo.telephone}</h3>
// //     </div>
// //   )
// // }

// // export default page