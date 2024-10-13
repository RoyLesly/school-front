'use client';
import { protocol } from '@/config';
import { SchemaCreateEditAccount } from '@/Domain/schemas/schemas';
import { AccountUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import MyButtonLoading from '@/section-h/common/MyButtons/MyButtonLoading';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const UpdateForm = ({ params, years, accounts }: any) => {

    const router = useRouter();
    const [buttonClicked, setClicked] = useState<boolean>(false)

    const updateAction = async () => {
        setClicked(true)

        var data = []
        for (let index = 0; index < years.length; index++) {
            const yr = years[index];
            for (let index = 0; index < accounts.length; index++) {
                const acc = accounts[index];
                data.push({
                    name: acc.name,
                    year: yr,
                    balance: 0,
                })

            }
        }

        if (data && data.length > 0) {
            await Promise.allSettled(data.map((item: any, index: number) => {
                return (
                    ActionCreate(item, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl)
                )
            }))
                .then(res => {
                    console.log(10500, res)
                    if (res && res.length > 0) {
                        const t = res.map(item => item.status)
                        if (t[0] == "fulfilled") { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?updated=SUCCESSFULLY !!!`); }
                        else { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?error=${t[0]}`); }
                    }
                })
                .catch(err => {
                    console.log(98, err)
                })
            setClicked(false)
            return
        } else {
            console.log(103, "Not Logged In")
        }
    }


    return (
        <div className='flex items-center justify-center p-20'>
            {
                buttonClicked ?
                    <MyButtonLoading />
                    :
                    <button onClick={() => { updateAction() }} className="bg-blue-500 font-medium px-10 py-4 rounded text-lg text-white">Update Accounts</button>

            }
        </div>
    )
}

export default UpdateForm