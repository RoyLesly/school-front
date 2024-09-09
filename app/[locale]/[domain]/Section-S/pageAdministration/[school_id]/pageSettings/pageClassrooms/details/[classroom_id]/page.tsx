import { ClassroomUrl, GetClassroomUrl, GetLevelUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { GetLevelInter, GetClassroomInter } from '@/Domain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-s/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaCreateEditClassroom } from '@/Domain/Utils-S/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { DOMAIN_CHOICES } from '@/Domain/Utils-S/data';
import { ConfigData, protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, classroom_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const apiData: any = await getData(protocol  + "api" + params.domain + GetClassroomUrl, {
    id: params.classroom_id, fieldList: [
      "id", "domain", "level__id", "level__level", "level__option", "academic_year",
      "tuition", "registration", "payment_one", "payment_two", "payment_three",
    ]
  });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Classroom Details"
          pageName1="Back"
          link1={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.count && apiData != "ECONNREFUSED" && <EditDelete apiData={apiData.results[0]} params={params} />}

        {apiData == "ECONNREFUSED" && <ServerError />}

      </>
    </LayoutAdmin>
  )
}

export default page



interface EditDeleteProps {
  apiData: GetClassroomInter
  params: any
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params }) => {

  const levelData: any = await getData(protocol  + "api" + params.domain + GetLevelUrl, {})

  console.log(apiData, 59)

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

    const response = await ActionEdit(data, params.classroom_id, SchemaCreateEditClassroom, protocol  + "api" + params.domain + ClassroomUrl)

    if (response.error) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/details/${params.specialty_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/details/${params.specialty_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms/details/${params.specialty_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageClassrooms?updated=Successfully-Updated-${JSON.stringify(response.level.level).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(protocol  + "api" + params.domain + ClassroomUrl, params.specialty_id)

    if (response?.error) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${params.specialty_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?deleted=Successfuly-Deleted-!!!`)
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
                  <span className='flex'>{apiData.level__level} {apiData.level__option}</span>
                  <span className='flex'>Year: {apiData.academic_year}</span>
                </div>
                <form action={onSubmitDeleteAction} className='flex md:mx-10 mx-2'>
                  <button className='bg-reddark font-medium md:px-6 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Select Domain
                  </label>
                  <select
                    name='domain'
                    required={true}
                    defaultValue={apiData.domain}
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
                      <option key={item.id} value={item.id}>{item.level} {item.option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black">
                    (Tuition)
                  </label>
                  <input
                    name="tuition"
                    defaultValue={apiData.tuition}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-6 py-3 rounded-lg text-black transition w-full"
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
                      defaultValue={apiData.registration}
                      placeholder="Enter Registration Fee"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>}
                  <div>
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      {ConfigData.registration_seperate_tuition ? "1st Installment" : "Registration"}
                    </label>
                    <input
                      type="number"
                      name="payment_one"
                      required={true}
                      min={1000}
                      defaultValue={apiData.payment_one}
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
                      defaultValue={apiData.payment_two}
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
                      defaultValue={apiData.payment_three}
                      placeholder="Enter 3rd Installment"
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