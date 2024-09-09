import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { GetLevelUrl, GetMainSpecialtyUrl, GetSpecialtyUrl, SpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetLevelInter, GetMainSpecialtyInter, GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { SchemaCreateEditSpecialty } from '@/NoDomain/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const apiData: any = await getData(`${protocol + GetSpecialtyUrl}/${params.specialty_id}`, { ...searchParams, fieldList: ["id", "tuition", "payment_one", "payment_two", "payment_three", "main_specialty__specialty_name", "main_specialty__id", "academic_year", "main_specialty__specialty_name", "level__id", "level__level"] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Class Details"
          pageName1="Settings"
          pageName2="Class"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData != "ECONNREFUSED" && <EditDelete apiData={apiData} params={params} />}

        {apiData == "ECONNREFUSED" && <ServerError />}

      </>
    </LayoutAdmin>
  )
}

export default page



interface EditDeleteProps {
  apiData: GetSpecialtyInter
  params: any
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params }) => {

  const mainSpecialtyData: any = await getData(protocol + GetMainSpecialtyUrl, {})
  const levelData: any = await getData(protocol + GetLevelUrl, {})
  const thisYear = new Date().getFullYear()
  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const data = {
      academic_year: formData.get("academic_year"),
      level_id: formData.get("level_id"),
      main_specialty_id: formData.get("main_specialty_id"),
      tuition: formData.get("tuition"),
      payment_one: formData.get("payment_one"),
      payment_two: formData.get("payment_two"),
      payment_three: formData.get("payment_three"),
      school_id: params.school_id
    }

    const response = await ActionEdit(data, params.specialty_id, SchemaCreateEditSpecialty, protocol + SpecialtyUrl)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?updated=Successfully-Updated-${JSON.stringify(response.main_specialty.specialty_name).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(protocol + SpecialtyUrl, params.specialty_id)

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?deleted=Successfuly-Deleted-!!!`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded shadow-default">
              <div className="border-b border-stroke dark:border-strokedark flex gap-2 items-center justify-between md:gap-10 px-4 py-2">
                <div className="dark:text-white flex flex-col font-medium gap-2 items-start justify-start md:flex-row md:gap-10 md:items-center md:justify-between text-black w-full">
                  <span className='hidden md:flex'>Editing ...</span>
                  <span className='flex'>{apiData.main_specialty__specialty_name}</span>
                  <span className='flex'>Year:{apiData.academic_year}</span>
                  <span className='flex'>Level: {apiData.level__level}</span>
                </div>
                <form action={onSubmitDeleteAction} className='flex md:mx-10 mx-2'>
                  <button className='bg-reddark font-medium md:px-6 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Select Academic Year
                  </label>
                  <select
                    name="academic_year"
                    defaultValue={apiData.academic_year}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
                  >
                    {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Level
                  </label>
                  <select
                    name="level_id"
                    defaultValue={apiData.level__id}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
                  >
                    {levelData && levelData.results.map((item: GetLevelInter) => (
                      <option key={item.id} value={item.id}>{item.level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Specialty Title
                  </label>
                  <select
                    name="main_specialty_id"
                    defaultValue={apiData.main_specialty__id}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
                  >
                    {mainSpecialtyData && mainSpecialtyData.results.map((item: GetMainSpecialtyInter) => (
                      <option key={item.id} value={item.id}>{item.specialty_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    Specialty Fees (Tuition)
                  </label>
                  <input
                    name="tuition"
                    defaultValue={apiData.tuition}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div className='flex flex-col gap-4 md:flex-row'>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      1st Installment <span className='text-lg text-red'>*</span>
                    </label>
                    <input
                      type="number"
                      name="payment_one"
                      required={true}
                      min={1000}
                      defaultValue={apiData.payment_one}
                      placeholder="Enter 1st Installment Fee"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      2nd Installment
                    </label>
                    <input
                      type="number"
                      name="payment_two"
                      required={false}
                      min={1000}
                      defaultValue={apiData.payment_two}
                      placeholder="Enter 2nd Installment Fee"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      3rd Installment
                    </label>
                    <input
                      type="number"
                      name="payment_three"
                      required={false}
                      min={1000}
                      defaultValue={apiData.payment_three}
                      placeholder="Enter 3rd Installment Fee"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className='flex items-end justify-end'>
                  <MyButtonSubmitEdit />
                </div>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}