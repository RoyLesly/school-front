import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter'
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const onSubmitServerAction = async (formData: FormData) => {
    'use server'
    var matricle = formData.get("matricle");
    if (matricle && matricle.toString().length > 6) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript?user__matricle=${matricle}`)
    } else {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`)
    }
  }

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Search Student"
          pageName1="Back"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageResult`}
        />

        <div className='bg-white flex flex-col gap-4 rounded'>

          <form className="flex flex-col gap-10 p-6.5" action={onSubmitServerAction}>
            <div className="flex flex-row gap-4 items-center justify-center w-full">
              <label className="block dark:text-white font-medium mb-2 text-black">
                Student Matricle
              </label>
              <input
                type="text"
                name="matricle"
                required={true}
                placeholder="Enter Matricle"
                className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-3 rounded-lg text-black transition w-full"
              />
              <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg md:w-32 px-5 py-2 rounded text-center text-white tracking-widest w-24">Search</button>

            </div>

          </form>

          {searchParams && Object.keys(searchParams).length > 0 && <GenerateTranscript searchParams={searchParams} params={params} />}

        </div>

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "This is Transcript Page",
};


const GenerateTranscript = async ({ searchParams, params }: any) => {
  const apiData = await getData(protocol + GetUserProfileUrl, {
    ...searchParams, user__is_active: true, fieldList: [
      "id",
      "user__matricle",
      "user__full_name",
      "specialty__main_specialty__specialty_name",
      "specialty__academic_year",
      "specialty__level__level",
    ]
  })

  console.log(apiData)

  return (
    <div className='flex flex-col gap-4 px-2'>

      {apiData && apiData.count && <div className='flex flex-col gap-2 px-4'>
        <div>
          <span className="flex items-center justify-start text-xl w-full">Full Name: {apiData.results[0].user__full_name}</span>
          <h1 className="flex items-center justify-start text-xl w-full">Matricle: {apiData.results[0].user__matricle}</h1>
          <h1 className="flex items-center justify-start text-xl w-full">Telephone: {apiData.results[0].user__telephone}</h1>
          <h1 className="flex items-center justify-start text-xl w-full">Email: {apiData.results[0].user__email}</h1>
        </div>
      </div>}

      <div className='flex flex-col'>

        <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-11 md:px-6 md:text-lg px-4 py-2 text-white tracking-wider">
          <div className="col-span-2 flex items-center">
            <span>Matricle</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span>Full Name</span>
          </div>
          <div className="col-span-3 flex items-center">
            <span>Class</span>
          </div>
          <div className='col-span-2 flex justify-between md:px-2 w-full'>
            <span className="font-medium">Year</span>
            <span className="font-medium">Level</span>
          </div>
          <div className="flex items-center justify-center text-center">
            <span className="font-medium">Action</span>
          </div>
        </div>

        {apiData && apiData.count ?

          apiData.results.map((item: GetUserProfileInter) => (
            <div key={item.id} className="border-stroke border-t dark:border-strokedark even:bg-slate-200 font-semibold grid grid-cols-4 md:grid-cols-11 md:px-6 md:text-lg px-4 py-2">
              <div className='col-span-2 flex items-center justify-start'>{item.user__matricle}</div>
              <div className='col-span-3 flex items-center justify-start'>{item.user__full_name}</div>
              <div className='col-span-3 flex items-center justify-start'>{item.specialty__main_specialty__specialty_name}</div>
              <div className='col-span-2 flex items-center justify-between md:px-2 w-full'>
                <div>{item.specialty__academic_year}</div>
                <div>{item.specialty__level__level}</div>
              </div>
              <div className='flex items-center justify-center tracking-widest'>
                <Link href={`/Setion-H/pageAdministration/${params.school_id}/pageResult/pageTranscript/${item.id}`} className="bg-bluedark px-4 py-1 rounded text-white">Select</Link>
              </div>
            </div>
          ))

          :
          <div>No Student With This Matricle</div>
        }
      </div>
    </div>
  )
}