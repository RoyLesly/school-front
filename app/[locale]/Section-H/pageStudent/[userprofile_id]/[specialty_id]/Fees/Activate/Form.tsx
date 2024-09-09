import { collectMoney } from '@/payment';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { TransactionUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';
import { SchemaTransactionCreate } from '@/NoDomain/schemas/schemas';
import { redirect } from 'next/navigation';
import React from 'react';

const Form = ({ params, schoolfees }: any) => {

    const submit = async ( formData: FormData) => {
        "use server"
        var payer = formData.get("payer");
        var operator = formData.get("operator");

        const data = {
            schoolfees_id: schoolfees.id,
            telephone: payer,
            operator: operator,
            payment_method: operator,
            amount: schoolfees.platform_charges,
            reason: "PLATFORM CHARGES",
            status: "completed",
        }
        var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer });

        if (!pay.operation && pay.transaction == "could-not-perform-transaction") {
            redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Cancelled by User`)
        }
        if (!pay.operation && pay.transaction == "low-balance-payer") {
            redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Not Enough Funds`)
        }
        if (!pay.operation && pay.transaction == "ENOTFOUND") {
            redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Error`)
        }
        if (!pay.operation && !pay.transaction) {
            redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Error`)
        }
        if (pay.operation) {
            const response = await ActionCreate(data, SchemaTransactionCreate, TransactionUrl, `/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees`)
            if (response.error) {
                redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
            }
            if (response?.errors) {
                redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
            }
            if (response?.detail) {
                redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
            }
            if (response?.id) {
                redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees?success=Successfully Activated-${JSON.stringify(response.schoolfees.userprofile.user.full_name).replaceAll(" ", "-")}`)
            }
        } else {
            console.log(" 61")
            redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Failed`)
        }
    }

    return (

        <form action={submit} className='flex flex-col gap-4 my-2 px-2'>

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
                <button type='submit' className="bg-bluedark font-medium mt-2 px-6 py-1 rounded text-white">Activate</button>
            </div>

        </form>

    )
}

export default Form