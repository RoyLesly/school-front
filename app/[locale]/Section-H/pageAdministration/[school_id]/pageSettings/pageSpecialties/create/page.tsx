import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { GetLevelUrl, GetMainSpecialtyUrl, SpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetLevelInter, GetMainSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateEditSpecialty } from '@/NoDomain/schemas/schemas';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Create Class"
          pageName1="Settings"
          pageName2="Classes"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <Create params={params} />

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Class-Create",
  description: "This is Field Page",
};

const Create = async ({ params }: any) => {

  const mainSpecialtyData: any = await getData(protocol + GetMainSpecialtyUrl, {});
  const levelData: any = await getData(protocol + GetLevelUrl, {});
  const thisYear = new Date().getFullYear()


  if (mainSpecialtyData == "ECONNREFUSED") return <ServerError />


  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const data = {
      main_specialty_id: formData.get("main_specialty_id"),
      level_id: formData.get("level_id"),
      academic_year: formData.get("academic_year"),
      tuition: formData.get("tuition"),
      payment_one: formData.get("payment_one"),
      payment_two: formData.get("payment_two"),
      payment_three: formData.get("payment_three"),
      school_id: params.school_id,
    }

    const response = await ActionCreate(data, SchemaCreateEditSpecialty, protocol + SpecialtyUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?created=Successfully-Created-${JSON.stringify(response.main_specialty.specialty_name).replaceAll(" ", "-")}`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

              <form className="flex flex-col gap-10 p-6.5" action={onSubmitServerAction}>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Specialty <span className='text-lg text-red'>*</span>
                  </label>
                  <select
                    name='main_specialty_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={0}>------------------</option>
                    {mainSpecialtyData.results && mainSpecialtyData.results.map((item: GetMainSpecialtyInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                      {item.specialty_name}
                    </option>)
                    )}

                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Level <span className='text-lg text-red'>*</span>
                  </label>
                  <select
                    name='level_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={0}>------------------</option>
                    {levelData.results && levelData.results.map((item: GetLevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                      {item.level}
                    </option>)
                    )}

                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Academic Year <span className='text-lg text-red'>*</span>
                  </label>
                  <select
                    name='academic_year'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={""}>------------------</option>
                    {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                      {item}
                    </option>)
                    )}

                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Tuition Fees <span className='text-lg text-red'>*</span>
                  </label>
                  <input
                    type="number"
                    name="tuition"
                    required={true}
                    min={1000}
                    placeholder="Enter Tuition Fee"
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
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
                      placeholder="Enter 3rd Installment Fee"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Save</button>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}
