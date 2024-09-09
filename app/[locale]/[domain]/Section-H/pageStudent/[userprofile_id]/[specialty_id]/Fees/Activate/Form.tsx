'use client';

import MyButtonLoading from '@/section-h/common/MyButtons/MyButtonLoading';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const Form = ({ params, schoolfees, onActivate }: any) => {

    const p = useSearchParams().get("loading");
    const [ loading, setLoading ] = useState<boolean>(p ? p == "true" ? true : false : false);

    return (

        <form action={onActivate} className='flex flex-col gap-4 my-2 px-2'>

            <div className='flex gap-2 w-full'>
                <span className='font-medium italic w-4/12'>AMOUNT</span>
                <span className='w-1/12'>:</span>
                <input name="amount" type="number" defaultValue={schoolfees.platform_charges} className="border px-2 py-1 rounded w-7/12" readOnly />
            </div>

            <div className='flex gap-2 w-full'>
                <span className='font-medium italic w-4/12'>OPERATOR</span>
                <span className='w-1/12'>:</span>
                <select  name="operator" className="border px-2 py-1 rounded w-7/12" required>
                    <option value="">-------------------</option>
                    <option value="MTN">MTN MONEY</option>
                    <option value="ORANGE">ORANGE MONEY</option>
                </select>
            </div>

            <div className='flex gap-2 w-full'>
                <span className='font-medium italic w-4/12'>TELEPHONE</span>
                <span className='w-1/12'>:</span>
                <input name="payer" type="number" className="border px-2 py-1 rounded w-7/12" min={610000000} max={699999999} required />
            </div>

            <div className='flex items-center justify-center'>
                {loading ?
                    <MyButtonLoading />
                    :
                    <button type='submit' className="bg-bluedark font-medium mt-2 px-6 py-1 rounded text-white">Activate</button>
                }
            </div>

        </form>

    )
}

export default Form