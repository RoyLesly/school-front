'use client';
import { protocol } from '@/config';
import { getData } from '@/functions';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter';
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'next/navigation';


interface SpecialtyProps {
    studentProfile: GetUserProfileInter
}
const Specialties: FC<SpecialtyProps> = ({ studentProfile }) => {

    const domain = useParams().domain;
    const [count, setCount] = useState<number>(0)
    const [userprofiles, setUserProfiles] = useState<GetUserProfileInter[]>()

    useEffect(() => {
        if (count == 0) {
            const GetUser = async () => {
                var userprofiles = await getData(protocol + "api" + domain + GetUserProfileUrl, { 
                    user__id: studentProfile.user__id,     
                    fieldList: [ "id", "user__full_name", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level" ] 
                })
                if (userprofiles && userprofiles.count) {
                    var fil = userprofiles.results.filter((item: GetUserProfileInter) => item.id != studentProfile.id)
                    setUserProfiles(fil)
                }
            }
            GetUser();
            setCount(1);
        }
    }, [count, studentProfile, domain])


    return (
        <div className='flex flex-col gap-6 h-full p-4 rounded-lg w-full'>

            <div className='bg-white dark:bg-slate-700 flex flex-col gap-4 md:my-4 p-2 rounded-lg w-full'>
                <h2 className='flex font-medium items-center justify-center md:text-2xl text-center text-xl tracking-wider w-h-full'>My Class</h2>
                <div className='flex flex-col gap-2 items-center justify-between md:flex-row text-center text-lg'>
                    <div></div>
                    <div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end text-end'>Full Name:</span>
                            <span className='flex italic'>{studentProfile.user__full_name}</span>
                        </div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end text-end'>Specialty:</span>
                            <span className='flex italic'>{studentProfile.specialty__main_specialty__specialty_name}</span>
                        </div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end text-end'>Academic Year:</span>
                            <span className='flex italic'>{studentProfile.specialty__academic_year}</span>
                        </div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end text-end'>Level:</span>
                            <span className='flex italic'>{studentProfile.specialty__level__level}</span>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>

            {userprofiles && userprofiles.length > 0 && <div className='bg-white dark:bg-slate-700 flex flex-col gap-4 p-2 rounded-lg w-full'>
                <h2 className='flex font-medium items-center justify-center md:text-2xl text-center text-xl tracking-wider w-h-full'>Other Classes</h2>
                <div className='bg-bluedark font-medium grid grid-cols-3 py-1 text-white text-xl'>
                    <div className='flex items-center justify-center text-center'>Specialty</div>
                    <div className='flex items-center justify-center text-center'>Academic Year</div>
                    <div className='flex items-center justify-center text-center'>Level</div>
                </div>
                { userprofiles.map((item: GetUserProfileInter) => (
                    <div key={item.id} className='dark:text-white grid grid-cols-3 py-1 text-black text-lg'>
                        <div className='flex items-center justify-center text-center'>{item.specialty__main_specialty__specialty_name}</div>
                        <div className='flex items-center justify-center text-center'>{item.specialty__academic_year}</div>
                        <div className='flex items-center justify-center text-center'>{item.specialty__level__level}</div>
                    </div>
                ))}
            </div>}

        </div>
    )
}

export default Specialties