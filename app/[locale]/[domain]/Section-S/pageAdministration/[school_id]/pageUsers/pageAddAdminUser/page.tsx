import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaCreateCustomUser } from '@/Domain/Utils-S/schemas/schemas-user';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { CustomUserUrl, GetDepartmentUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { DeptInter } from '@/Domain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
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
          pageName="New Admin"
          pageName1="Back"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageLecturers`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <Create searchParams={searchParams} params={params} />

      </>
    </LayoutAdmin>
  )
}

export default page


export const metadata: Metadata = {
  title:
    "Admin-Create",
  description: "This is Admin Page",
};

const Create = async ({ searchParams, params }: any) => {

  const deptData: DeptInter[] | any = await getData(protocol + GetDepartmentUrl, { ...searchParams, name: "Lecturer" });

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';
    if (deptData && deptData.count != 1) return;
  
    const un = formData.get("username")
    const fn = formData.get("first_name")
    const secondn = formData.get("second_name")
    const thirdn = formData.get("third_name")
    const town = formData.get("town")
    const address = formData.get("address")
    const pob = formData.get("pob")
    if (!secondn) return;

    const dept_id = deptData.results[0].id

    const data = {
      username: un ? un.toString().toLowerCase() : "",
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: secondn ? thirdn ? secondn.toString().toUpperCase() + " " + thirdn.toString().toUpperCase() : secondn.toString().toUpperCase() : "",
      address: address ? address.toString().toUpperCase() : "",
      town: town ? town.toString().toUpperCase() : "",
      pob: pob ? pob.toString().toUpperCase() : "",
      dob: formData.get("dob"),
      telephone: formData.get("telephone"),
      email: formData.get("email"),
      title: formData.get("title"),
      sex: formData.get("sex"),
      role: "admin",
      dept: [dept_id],
      school: [parseInt(params.school_id)],
    }

    // console.log(data)

    const response = await ActionCreate(data, SchemaCreateCustomUser, CustomUserUrl, `/pageAdministration/${params.school_id}`)

    console.log(response, 90)
    if (response?.error) {
      redirect(`/pageAdministration/${params.school_id}/pageLecturers/pageAdmission?error=${JSON.stringify(response.error)}`)
    }
    if (response?.id) {
      redirect(`/pageAdministration/${params.school_id}/pageLecturers`)
    }
    if (response?.detail) {
      console.log(80, response.detail)
    }
    if (response) {
      redirect(`/pageAdministration/${params.school_id}/pageLecturers/pageAdmission?error=${JSON.stringify(response)}`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-slate-600 dark:border-strokedark rounded-sm shadow-default">
      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

              <form className="flex flex-col gap-4 md:gap-10 p-6.5" action={onSubmitServerAction}>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    USERNAME <span className='font-bold text-lg text-red'>*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    required={true}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      FIRST NAME <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required={true}
                      placeholder="Enter First Name"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      MIDDLE NAME <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="second_name"
                      required={true}
                      placeholder="Enter Middle Name"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      name="third_name"
                      required={false}
                      placeholder="Enter Last Name"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      SEX <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                      name='sex'
                      required={true}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option key={0} value={"Male"} className="dark:text-bodydark my-2 text-body">Male</option>
                      <option key={1} value={"Female"} className="dark:text-bodydark my-2 text-body">Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      TELEPHONE <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="number"
                      name="telephone"
                      max={999999999}
                      required={true}
                      placeholder="Enter Telephone"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      ADDRESS <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required={true}
                      placeholder="Enter Quarter"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      required={false}
                      placeholder="Enter Date Of Birth"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      Place Of Birth
                    </label>
                    <input
                      type="text"
                      name="pob"
                      required={false}
                      placeholder="Enter Place Of Birth"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-10 md:flex-row">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      EMAIL <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      required={true}
                      placeholder="Enter Email"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      Title <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                      name='title'
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      {["Prof", "Dr", "Mr", "Mrs", "Miss", "Engr"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                      </option>)
                      )}

                    </select>
                  </div>
                </div>

                <button type="submit" className="bg-green-500 bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-semibold hover:bg-primary-700 md:text-lg mt-10 px-5 py-2.5 rounded text-black text-center text-lg tracking-widest w-full">Save</button>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}