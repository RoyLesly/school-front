import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { redirect } from 'next/navigation'
import { FaRightLong } from 'react-icons/fa6'
import Link from 'next/link'
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig'
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
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

    var field = formData.get("field");
    var value = formData.get("value") ? formData.get("value")?.toString() : "";
    if (value && field == "matricle" && value.length > 4) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageResult/pageTranscript?user__matricle=${value.toUpperCase()}`)
    }
    if (value && value?.length > 4) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageResult/pageTranscript?user__full_name=${value}`)
    } else {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageResult/pageTranscript`)
    }
  }

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Search Student"
          pageName1="Main Dashboard"
          link1="/Section-S/pageAdministration"
        />

        <div className='bg-slate-200 flex flex-col gap-4 rounded'>

          <form className="flex flex-col gap-10 p-6.5 text-black" action={onSubmitServerAction}>
            <div className="flex flex-row gap-4 items-center justify-center w-full">
              <div className='flex flex-col gap-1 items-center justify-center'>
                <label>Search By</label>
                <select name="field" className='font-semibold italic px-6 py-1 rounded text-lg tracking-wider'>
                  <option value="full_name">Student Name</option>
                  <option value="matricle">Matricle</option>
                </select>
              </div>
              <input
                type="text"
                name="value"
                required={true}
                placeholder="Enter Student Name or Matricle ..."
                className="active:border-primary bg-transparent border border-black dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-10 outline-none px-4 py-4 rounded-lg text-black transition w-full"
              />
              <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg md:w-32 px-5 py-3 rounded text-center text-white tracking-widest w-24">Search</button>

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
  console.log(searchParams)
  const apiData = await getData(protocol + GetSecondaryProfileUrl, {
    ...searchParams, user__is_active: true, fieldList: [
      "id",
      "user__matricle",
      "user__full_name",
      "user__telephone",
      "classroom__level__level",
      "classroom__academic_year",
      "classroom__level__option",
    ]
  })

  console.log(apiData)

  return (
    <div className='flex flex-col gap-4'>

      <div className='flex flex-col gap-2'>

        <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-7 md:px-6 md:text-lg px-4 py-4 text-white tracking-wider">
          <div className="hidden items-center sm:flex">
            <span className="font-medium">Matricle</span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="font-medium">Full Name</span>
          </div>
          <div className="flex items-center justify-center">
            <span>Class</span>
          </div>
          <div className='flex gap-4 justify-center md:px-2 w-full'>
            <span className="font-medium">Year</span>
          </div>
          <div className='flex justify-center md:px-2 w-full'>
            <span className="font-medium">Telephone</span>
          </div>
          <div className="flex items-center justify-center text-center">
            <span className="font-medium">Action</span>
          </div>
        </div>

        {apiData && apiData.count ?

          apiData.results.map((item: GetSecondaryProfileInter) => (
            <div key={item.id} className="border-stroke border-t dark:border-strokedark even:bg-slate-200 font-semibold grid grid-cols-4 md:grid-cols-7 md:px-6 md:text-lg px-4 py-2">
              <div className='flex items-center'>{item.user__matricle}</div>
              <div className='col-span-2 flex items-center'>{item.user__full_name}</div>
              <div className='flex items-center justify-center'>{item.secondary_classroom__level__level} {item.secondary_classroom__level__option}</div>
              <div className='flex gap-2 items-center justify-center md:px-2 w-full'>
                <div>{item.secondary_classroom__academic_year}</div>
              </div>
              <div className='flex items-center justify-center md:px-2 w-full'>
                <div>{item.user__telephone}</div>
              </div>
              <Link href={`/Section-S/pageAdministration/${params.school_id}/pageResult/pageTranscript/${item.id}`} className='bg-bluedark flex gap-3 items-center justify-center px-2 py-1 rounded text-white'>Select <FaRightLong /></Link>
            </div>
          ))

          :
          <div className='flex font-bold italic items-center justify-center py-40 text-xl'>No Student With This {searchParams.user__full_name ? "Name" : "Matricle"}</div>
        }
      </div>
    </div>
  )
}