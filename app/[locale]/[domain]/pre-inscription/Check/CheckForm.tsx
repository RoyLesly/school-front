'use client';
import React, { useState } from 'react'
import InputField from '@/componentsTwo/InputField';
import MyButtonModal from '@/section-h/common/MyButtons/MyButtonModal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { protocol } from '@/config';
import { getDataNotProtected } from '@/functions';
import { GetCustomUserInter, GetPreInscriptionInter } from '@/Domain/Utils-H/userControl/userInter';
import { Resolution, Margin, Options } from 'react-to-pdf';
import PreInscriptionForm from './[registration_number]/PreInscriptionForm';
import { OpenGetCustomUserNotProtectedUrl, OpenGetPreInscriptionUrl } from '@/Domain/Utils-H/userControl/userConfig';
import AdmissionForm from './[registration_number]/AdmissionForm';


const SchemaCreate = z.object({
    registration_number: z.string().optional(),
    dob: z.string().optional(),
    telephone: z.coerce.number().optional(),
    full_name: z.string().optional(),
})

type Inputs = z.infer<typeof SchemaCreate>;

const CheckForm = ({ params }: any) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });

    const [clicked, setClicked] = useState<boolean>(false);
    const targetRef = () => document.getElementById("reg_form")
    const [page, setPage] = useState<number>(1);
    const [responseData, setResponseData] = useState<GetPreInscriptionInter>();
    const [customUserData, setCustomUserData] = useState<GetCustomUserInter>();
    const [foundPreInscriptionLength, setFoundPreInscriptionLength] = useState<number>(-1);
    const [foundUserLength, setFoundUserLength] = useState<number>(-1);

    const onSubmit = handleSubmit((formVals) => {
        setClicked(true);
        const ch = (registration_number: any, full_name: any, telephone: any) => {
            if (registration_number && full_name) { return { registration_number, full_name } }
            if (registration_number && telephone) { return { registration_number, telephone } }
            if (full_name && telephone) { return { full_name, telephone } }
            else { return { telephone } }
        }
        const newData = {
            registration_number: formVals.registration_number?.toString(),
            full_name: formVals.full_name?.toString(),
            telephone: formVals.telephone,
        }
        const n = ch(newData.registration_number, newData.full_name, newData.telephone);
        const getPreInscription = async () => {
            if (n) {
                const response = await getDataNotProtected(
                    protocol + "api" + params.domain + OpenGetPreInscriptionUrl, { ...n }
                )
                if (response && response.count == 1) {
                    setFoundPreInscriptionLength(response.count)
                    setResponseData(response.results[0]);
                    const responseTwo = await getDataNotProtected(
                        protocol + "api" + params.domain + OpenGetCustomUserNotProtectedUrl,
                        { nopage: true, telephone: response.results[0].telephone }
                    )
                    console.log(responseTwo, 65)
                    if (responseTwo && responseTwo.length == 1) {
                        setFoundUserLength(responseTwo.length)
                        setPage(3)
                        setCustomUserData(responseTwo[0]);
                    } else {
                        setPage(2)
                        setFoundUserLength(responseTwo.length)
                    }
                    setClicked(false)
                } else {
                    setFoundPreInscriptionLength(response.count)
                }
            }
            setClicked(false)
        }
        getPreInscription()
        
    })

    return (
        <>
            {responseData && page == 2 ?
                <div className='flex flex-col gap-2 h-full w-full'>
                    <h1 className='flex font-bold h-[5%] justify-center text-center text-xl w-full'>Click Below To Download Form</h1>
                    <div className='flex flex-col gap-2 items-center justify-center'>
                        <PreInscriptionForm data={responseData} params={params} />
                    </div>
                </div>
                :
                responseData && page == 3 ?
                <div className='flex flex-col gap-2 h-full w-full'>
                    <h1 className='flex font-bold h-[5%] justify-center text-center text-xl w-full'>Admitted Successfully</h1>
                    <div className='flex flex-col gap-2 items-center justify-center'>
                        <AdmissionForm data={customUserData} params={params} />
                    </div>
                </div>
                :
                <div className='md:border md:p-4 p-2 rounded-lg'>
                    <h1 className='flex font-bold my-2 text-center text-xl'>Fill Any Field below to see admission status</h1>

                    <form onSubmit={onSubmit} className='flex flex-col gap-4 md:m-4'>
                        {/* <InputField
                            label="Name"
                            label_two="Nom"
                            name="full_name"
                            register={register}
                            error={errors.full_name}
                        /> */}
                        <InputField
                            label="Telephone"
                            label_two="Telephone"
                            name="telephone"
                            register={register}
                            error={errors.telephone}
                            type='number'
                        />
                        {/* <InputField
                            label="Pre-Inscription Number"
                            label_two="Numero"
                            name="registration_number"
                            register={register}
                            error={errors.registration_number}
                        /> */}

                        <MyButtonModal type={"update"} title={"Search"} clicked={clicked} />

                        {foundPreInscriptionLength > 1 ? 
                        <div className='bg-white flex flex-col font-bold items-center justify-center p-2 rounded text-center text-red'>
                            <span>Found Many Similar Results</span>
                            <span>Add more Information to retrieve Your Status</span>
                        </div> 
                        : foundPreInscriptionLength == 0 ? 
                        <div className='bg-white flex flex-col font-bold items-center justify-center p-2 rounded text-center text-red'>
                            <span>No Results Found</span>
                        </div> 
                        :
                        null}

                    </form>
                </div>
            }
        </>
    )
}

export default CheckForm


const Form = ({ data }: any) => {

    return <div className='border border-red h-full w-full'>
        <span>{data.registration_number}</span>
        <span>{data.full_name}</span>
        <span>{data.telephone}</span>
        <span>{data.sex}</span>
    </div>

}


const options: Options = {
    filename: "Print ",
    // default is `save`
    method: 'save',
    resolution: Resolution.MEDIUM,
    page: {
        // margin is in MM, default is Margin.NONE = 0
        margin: Margin.NONE,
        format: 'A4',
        // default is 'portrait'
        orientation: 'portrait',
    },
    canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: 'image/jpeg',
        qualityRatio: 1
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break, 
    // so use with caution.
    overrides: {
        // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
        pdf: {
            compress: true
        },
        // see https://html2canvas.hertzen.com/configuration for more options
        canvas: {
            useCORS: true
        }
    },
};