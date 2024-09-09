import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/section-s/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { CustomUserUrl, GetDepartmentUrl, SecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { DeptInter } from '@/Domain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react'
import SelectSpecialty from './SelectSpecialty';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateCustomUser, SecondaryProfileCreateSchema } from '@/Domain/Utils-S/schemas/schemas-user';
import Link from 'next/link';
import { ConfigData, protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const deptData: DeptInter[] | any = await getData(protocol + GetDepartmentUrl, { ...searchParams, name: "Student" });
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Admission"
          pageName1="Students"
          link1="/Section-S/pageAdministration/pageStudents"
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {deptData.count && deptData.results.length > 0 ? <Create searchParams={searchParams} params={params} deptData={deptData.results[0]} /> 
        : 
        <div className="flex flex-col font-semibold gap-10 items-center justify-center pb-32 pt-40 tracking-widest">
          <div className='italic text-2xl'>No Student Department</div>
          <Link href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create`} className='bg-bluedark px-6 py-1 rounded text-lg text-white'>Create Student Department</Link>
        </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default page


export const metadata: Metadata = {
  title: "Student-Create",
  description: "This is User Page",
};

const Create = async ({ searchParams, params, deptData }: any) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const fn = formData.get("first_name")
    const secondn = formData.get("second_name")
    const thirdn = formData.get("third_name")
    const town = formData.get("town")
    const address = formData.get("address")
    const sex = formData.get("sex")
    const pob = formData.get("pob")
    const classroom_id = formData.get("classroom_id")
    const session = formData.get("session")
    if (!secondn) return;

    const dept_id = deptData.id

    const data = {
      username: fn ? fn.toString().toLowerCase() : "",
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: secondn ? thirdn ? secondn.toString().toUpperCase() + " " + thirdn.toString().toUpperCase() : secondn.toString().toUpperCase() : "",
      address: address ? address.toString().toUpperCase() : "",
      sex: sex,
      town: town ? town.toString().toUpperCase() : "",
      pob: pob ? pob.toString().toUpperCase() : "",
      dob: formData.get("dob"),
      // telephone: formData.get("telephone")?.toString().length == 9 ? "+237" + formData.get("telephone") : formData.get("telephone")?.toString().length == 13 ? formData.get("telephone") : "",
      parent_telephone: formData.get("parent_telephone")?.toString().length == 9 ? "+237" + formData.get("parent_telephone") : formData.get("parent_telephone")?.toString().length == 13 ? formData.get("parent_telephone") : "",
      parent_name: formData.get("parent_name"),
      // email: formData.get("email")?.toString().toLowerCase(),
      password: "pbkdf2_sha256$720000$zpOrh6IaPjoYmmXayj8DXq$HQMcQivv+8gpYeZyontlqXZeX0pLHxpi4p7YvqSY7i0=",
      role: "student",
      dept_id: dept_id,
      school: [parseInt(params.school_id),],
      prefix: ConfigData["local"].prefix.method + ConfigData["local"].prefix.secondary,
    }

    const response = await ActionCreate(data, SchemaCreateCustomUser, CustomUserUrl)

    console.log(response, 97)
    if (response?.id) { 
      var secondaryProfileData = {
        user_id: response.id ,
        secondary_classroom_id: classroom_id,
        session: session 
      }

      const response2 = await ActionCreate(secondaryProfileData, SecondaryProfileCreateSchema, SecondaryProfileUrl)
      console.log(response2, 119)
      if (response2?.id) { 
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents?created=Success Student Admission`, RedirectType.replace)
      }
      if (response2.error) { 
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response.error)}`, RedirectType.replace)
      }
      if (response2.errors) { 
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response.errors)}`, RedirectType.replace)
      }
      if (response2?.detail) { 
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response.detail)}`, RedirectType.replace)
      }
    } 
    if (response.error) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response.error)}` )
    }
    if (response.errors) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response.errors)}` )
    }
    if (response?.detail) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response.detail)}` )
    } else {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/create?error=${JSON.stringify(response)}`, RedirectType.replace)
    }
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
{/*                 
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-1 text-black">
                      EMAIL
                    </label>
                    <input
                      type="text"
                      name="email"
                      required={false}
                      placeholder="Enter Email"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div> */}
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-1 text-black">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      required={false}
                      placeholder="Enter Date Of Birth"
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-3 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Gender <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select name='sex' className='border-[1.5px] px-4 py-3 rounded' required={false}>
                      <option>----------</option>
                      <option value={"Male"}>Male</option>
                      <option value={"Female"}>Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      Place Of Birth 
                    </label>
                    <input
                      type="text"
                      name="pob"
                      required={false}
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
                      name="parent_number"
                      required={false}
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