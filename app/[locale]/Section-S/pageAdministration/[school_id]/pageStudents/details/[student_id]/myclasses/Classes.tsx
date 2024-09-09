'use client';
import { protocol } from '@/config';
import { getData } from '@/functions';
import { GetSecondaryProfileUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { GetSecondaryProfileInter } from '@/NoDomain/Utils-S/userControl/userInter';
import React, { FC, useEffect, useState } from 'react'


interface SpecialtyProps {
    studentProfile: GetSecondaryProfileInter
}
const Classes: FC<SpecialtyProps> = ({ studentProfile }) => {

    const [count, setCount] = useState<number>(0)
    const [userprofiles, setUserProfiles] = useState<GetSecondaryProfileInter[]>()

    useEffect(() => {
        if (count == 0) {
            const GetUser = async () => {
                var userprofiles = await getData(protocol + GetSecondaryProfileUrl, { 
                    user__id: studentProfile.user__id, nopage: true, 
                    fieldList: [ "id", "user__id", "user__full_name", "secondary_classroom__level__level", "secondary_classroom__level__option", "secondary_classroom__academic_year", "secondary_classroom__domain" ] 
                })
                if (userprofiles && userprofiles.length > 0) {
                    var fil = userprofiles.filter((item: GetSecondaryProfileInter) => item.id != studentProfile.id)
                    setUserProfiles(fil)
                }
            }
            GetUser();
            setCount(1);
        }
    }, [count, studentProfile])


    return (
        <div className='flex flex-col gap-6 h-full p-4 rounded-lg w-full'>

            <div className='bg-white dark:bg-slate-700 flex flex-col gap-4 md:my-4 p-2 rounded-lg w-full'>
                <h2 className='flex font-medium items-center justify-center md:text-2xl text-center text-xl tracking-wider w-h-full'>My Class</h2>
                <div className='flex flex-col gap-2 items-center justify-between md:flex-row text-center text-lg'>
                    <div></div>
                    <div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end md:w-40 text-end'>Full Name:</span>
                            <span className='flex italic'>{studentProfile.user__full_name}</span>
                        </div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end md:w-40 text-end'>Class:</span>
                            <span className='flex italic'>{studentProfile.secondary_classroom__level__level}</span>
                        </div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end md:w-40 text-end'>Option:</span>
                            <span className='flex italic'>{studentProfile.secondary_classroom__domain}</span>
                            <span className='flex italic'>{studentProfile.secondary_classroom__level__option}</span>
                        </div>
                        <div className='flex gap-16 justify-between'>
                            <span className='flex font-bold items-end justify-end md:w-40 text-end'>Academic Year:</span>
                            <span className='flex italic'>{studentProfile.secondary_classroom__academic_year}</span>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>

            {userprofiles && userprofiles.length > 0 && <div className='bg-white dark:bg-slate-700 flex flex-col gap-4 p-2 rounded-lg w-full'>
                <h2 className='flex font-medium items-center justify-center md:text-2xl text-center text-xl tracking-wider w-h-full'>Other Classes</h2>
                <div className='bg-bluedark font-medium grid grid-cols-3 py-1 text-white text-xl'>
                    <div className='flex items-center justify-center text-center'>Class</div>
                    <div className='flex items-center justify-center text-center'>Option</div>
                    <div className='flex items-center justify-center text-center'>Academic Year</div>
                </div>
                { userprofiles.map((item: GetSecondaryProfileInter) => (
                    <div key={item.id} className='dark:text-white grid grid-cols-3 py-1 text-black text-lg'>
                        <div className='flex items-center justify-center text-center'>{item.secondary_classroom__level__level}</div>
                        <div className='flex items-center justify-center text-center'>{item.secondary_classroom__level__option}</div>
                        <div className='flex items-center justify-center text-center'>{item.secondary_classroom__academic_year}</div>
                    </div>
                ))}
            </div>}

        </div>
    )
}

export default Classes