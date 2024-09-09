import { GetLevelUrl, ClassroomUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { GetLevelInter } from '@/NoDomain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaCreateEditClassroom } from '@/NoDomain/Utils-S/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { DOMAIN_CHOICES } from '@/NoDomain/Utils-S/data';
import { ConfigData, protocol } from '@/config';

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
          pageName="Create Classroom"
          pageName1="Settings"
          pageName2="Back"
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {<Create params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title: "Class-Create",
  description: "This is Class Page",
};

const Create = async ({ params }: any) => {

  const levelData: any = await getData(protocol + GetLevelUrl, {});
  const thisYear = new Date().getFullYear()

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    var level_id = formData.get("level_id");
    var registration = formData.get("registration");
    var tuition = formData.get("tuition");
    var payment_one = formData.get("payment_one");
    var payment_two = formData.get("payment_two");
    var payment_three = formData.get("payment_three");

    const data = {
      school_id: params.school_id ? parseInt(params.school_id) : params.school_id,
      domain: formData.get("domain"),
      level_id: level_id ? parseInt(level_id.toString()): level_id,
      academic_year: formData.get("academic_year"),
      registration: registration ? parseInt(registration.toString()) : registration,
      tuition: tuition ? parseInt(tuition.toString()) : tuition,
      payment_one: payment_one ? parseInt(payment_one.toString()) : payment_one,
      payment_two: payment_two ? parseInt(payment_two.toString()) : payment_two,
      payment_three: payment_three ? parseInt(payment_three.toString()) : payment_three,
    }

    var sum = (payment_one ? parseInt(payment_one.toString()) : 0) + (payment_two ? parseInt(payment_two.toString()) : 0 ) + (payment_three ? parseInt(payment_three.toString()) : 0)
    if (sum != (tuition ? parseInt(tuition.toString()) : 0)) return

    const response = await ActionCreate(data, SchemaCreateEditClassroom, protocol + ClassroomUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms`)

    console.log(response, 81)
    if (response.error) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms?created=Successfully-Created-${JSON.stringify(response.id).replaceAll(" ", "-")}`)
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
                    Select Domain
                  </label>
                  <select
                    name='domain'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={0}>------------------</option>
                    {DOMAIN_CHOICES.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                      {item}
                    </option>)
                    )}

                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Level
                  </label>
                  <select
                    name='level_id'
                    required={true}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                      }`}
                  >
                    <option value={0}>------------------</option>
                    {levelData.results && levelData.results.map((item: GetLevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                      {item.level} {item.option}
                    </option>)
                    )}

                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Academic Year
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
                    Tuition Fees
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

                <div className="flex gap-2 justify-between">

                  {ConfigData.registration_seperate_tuition.s && <div>
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      Registration
                    </label>
                    <input
                      type="number"
                      name="registration"
                      required={true}
                      min={1000}
                      placeholder="Enter Registration Fee"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>}
                  <div>
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      {ConfigData.registration_seperate_tuition.s ? "1st Installment" : "Registration" }
                    </label>
                    <input
                      type="number"
                      name="payment_one"
                      required={true}
                      min={1000}
                      placeholder="Enter 1st Installment"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      2nd Installment
                    </label>
                    <input
                      type="number"
                      name="payment_two"
                      required={true}
                      min={1000}
                      placeholder="Enter 2nd Installment"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      3rd Installment
                    </label>
                    <input
                      type="number"
                      name="payment_three"
                      required={true}
                      min={1000}
                      placeholder="Enter 3rd Installment"
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
