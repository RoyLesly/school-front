import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/NoDomain/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/NoDomain/section-h/common/NotificationError';
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { CustomUserUrl, GetDepartmentUrl, UserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { DeptInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react'
import SelectSpecialty from './SelectSpecialty';
import { ConfigData, protocol } from '@/config';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateCustomUser, UserProfileStudentEditSchema } from '@/schemas-user';
import { DepartmentUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { SchemaCreateEditDepartment } from '@/NoDomain/Utils-S/schemas/schemas';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const deptData: DeptInter[] | any = await getData(protocol + GetDepartmentUrl, { name: "Student" });


  const createStudentDepartment = async() => {
    'use server'

    const response = await ActionCreate({ name: "Student"}, SchemaCreateEditDepartment, protocol + DepartmentUrl, `/Section-H/pageAdministration/${params.school_id}/pageStudent/pageAdmimission`)
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?created=Successfully`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)

  }

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Admission"
          pageName1="Students"
          link1="/Section-H/pageAdministration/pageStudents"
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {deptData && deptData.count ? <Create searchParams={searchParams} params={params} deptData={deptData} />
        :
        <div className='flex flex-col gap-10 items-center justify-center pb-40 pt-32'>
          <div>No Student Department Found</div>
          <form action={createStudentDepartment}>
            <button type='submit' className='bg-bluedark border px-10 py-2 rounded text-white'>Create Student Department</button>
          </form>
        </div>}
      </>
    </LayoutAdmin>
  )
}

export default page


export const metadata: Metadata = {
  title:
    "Student-Create",
  description: "This is User Page",
};

const Create = async ({ params, deptData }: any) => {


  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const fn = formData.get("first_name")
    const secondn = formData.get("second_name")
    const thirdn = formData.get("third_name")
    const town = formData.get("town")
    const address = formData.get("address")
    const pob = formData.get("pob")
    const specialty_id = formData.get("specialty_id")
    const program_id = formData.get("program_id")
    const session = formData.get("session")
    const sex = formData.get("sex")
    if (!secondn) return;
    if (specialty_id && specialty_id == "0") { return };

    const dept_id = deptData.results[0].id

    const data = {
      username: fn ? fn.toString().toLowerCase() : "",
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: secondn ? thirdn ? secondn.toString().toUpperCase() + " " + thirdn.toString().toUpperCase() : secondn.toString().toUpperCase() : "",
      address: address ? address.toString().toUpperCase() : "",
      town: town ? town.toString().toUpperCase() : "",
      pob: pob ? pob.toString().toUpperCase() : "",
      dob: formData.get("dob"),
      telephone: formData.get("telephone")?.toString().length == 9 ? "+237" + formData.get("telephone") : formData.get("telephone")?.toString().length == 13 ? formData.get("telephone") : "",
      parent_telephone: formData.get("parent_telephone")?.toString().length == 9 ? "+237" + formData.get("parent_telephone") : formData.get("parent_telephone")?.toString().length == 13 ? formData.get("parent_telephone") : "",
      parent_name: formData.get("parent_name"),
      email: formData.get("email")?.toString().toLowerCase(),
      role: "student",
      sex: sex,
      dept_id: dept_id,
      prefix: ConfigData["local"].prefix.method + ConfigData["local"].prefix.higher,
      school: [parseInt(params.school_id),],
    }

    const response = await ActionCreate(data, SchemaCreateCustomUser, protocol + CustomUserUrl)

    console.log(response, 93)
    if (response.id) {
      var userProfileData = {
        user_id: response.id,
        specialty_id: specialty_id,
        program_id: program_id,
        session: session
      }

      const response2 = await ActionCreate(userProfileData, UserProfileStudentEditSchema, protocol + UserProfileUrl)
      console.log(response2, 108)
      if (response2.id) {
        redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents?created=Success Student Admission`, RedirectType.replace)
      }
      if (response2.error) {
        redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.error)}`)
      }
      if (response2.errors) {
        redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.errors)}`)
      }
      if (response2?.detail) {
        redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.detail)}`)
      }

    }

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.error)}`)
    }
    if (response?.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.errors)}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.detail)}`)
    }
    if (response?.telephone) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.telephone)}`)
    }
    if (response?.email) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response.email)}`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission?error=${JSON.stringify(response)}`)

  }

  return (
    <div className="bg-white border border-stroke dark:bg-slate-600 dark:border-strokedark rounded-sm shadow-default">
      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded shadow-default">

              <form className="flex flex-col gap-2 md:gap-4 md:text-lg p-4 text-sm" action={onSubmitServerAction}>

                <div className="flex flex-col gap-2 md:flex-row w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-1 text-black">
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
                    <label className="block dark:text-white font-medium mb-1 text-black">
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
                    <label className="block dark:text-white font-medium mb-1 text-black">
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
                    <label className="block dark:text-white font-medium mb-1 text-black">
                      TELEPHONE <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="number"
                      name="telephone"
                      max={999999999}
                      min={610000000}
                      required={true}
                      placeholder="Enter Telephone"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-1 text-black">
                      ADDRESS
                    </label>
                    <input
                      type="text"
                      name="address"
                      required={false}
                      placeholder="Enter Quarter"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-1 text-black">
                      EMAIL <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      required={true}
                      placeholder="Enter Email"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      GENDER <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                      name='sex'
                      required={true}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option key="" value={""} className="dark:text-bodydark my-2 text-body">----------------</option>
                      <option key={0} value={"Male"} className="dark:text-bodydark my-2 text-body">Male</option>
                      <option key={1} value={"Female"} className="dark:text-bodydark my-2 text-body">Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-1 text-black">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      required={true}
                      placeholder="Enter Date Of Birth"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Place Of Birth <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="pob"
                      required={true}
                      placeholder="Enter Place Of Birth"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      Parent Name <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <input
                      type="text"
                      name="parent_name"
                      required={true}
                      placeholder="Enter Parent Name"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      Parent Telephone <span className='font-bold text-lg text-red'></span>
                    </label>
                    <input
                      type="number"
                      name="parent_telephone"
                      required={false}
                      max={999999999}
                      min={610000000}
                      placeholder="Enter Telephone"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>

                </div>

                <SelectSpecialty school_id={params.school_id} />

                <div className='flex items-center justify-center'>
                  <MyButtonSubmitCreate />
                </div>

                {/* <SubmitAdmitStudentButton /> */}

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}