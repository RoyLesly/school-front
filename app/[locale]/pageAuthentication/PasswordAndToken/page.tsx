'use client';
import React, {useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { ActionConfirmResetPassword } from '@/serverActions/AuthActions';
import Swal from 'sweetalert2';
import { ResetPasswordConfirmUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
    params: { id: string | number, domain: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <CheckUserForm params={params} />
  )
}

export default page;


const CheckUserForm = ({ params }: any) => {
  const [attempts, setAttempts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    var password = formData.get("password");
    var confirm_password = formData.get("confirm_password");
    if (password != confirm_password){
      Swal.fire("Password Not Matching or Invalid !!!");
      return;
    }
    setLoading(true);
    const data = {
      token: formData.get("token"),
      password: password,
      confirm_password: confirm_password,
    }

    console.log(data)

    const response = await ActionConfirmResetPassword(data, protocol + ResetPasswordConfirmUrl)
    console.log(response)
    if (response?.password) { 
      Swal.fire(`${JSON.stringify("Password Does Not Meet Requirements")}`)
      setLoading(false); }
    if (response?.errors) { 
      Swal.fire(`${JSON.stringify(response.errors)}`)
      setLoading(false); }
    if (response?.error) { 
      Swal.fire(`${JSON.stringify(response.error)}`)
      setLoading(false); }
    if (response?.status == "OK") { 
      Swal.fire("Password Reset Successfully"); 
      router.push("/pageAuthentication/Login") 
    }
    if (response?.detail?.includes("Not found")) { 
      Swal.fire("Token Invalid or Expired Already !!!"); 
    }
    setLoading(false)
  }

  const [errorState, submitAction] = useFormState(onSubmitServerAction, undefined)

  return (
    <section className="bg-boxdark dark:bg-gray-100">
      <div className="flex flex-col h-screen items-center justify-center lg:py-0 md:h-screen mx-auto px-6 py-8">
        <a href="#" className="flex font-semibold items-center mb-6 md:text-4xl text-3xl text-white tracking-widest">
          RESET PASSWORD
        </a>

        {errorState ? <div className='flex flex-col font-semibold italic items-center mb-2 sm:tracking-widest text-center text-md tracking-wide'><span className="text-red">{errorState}</span><span>(Attempts {attempts})</span></div> : <span></span>}

        <div className='flex flex-col gap-2 items-center justify-center mb-4 text-center text-slate-300'>
          <span>To Reset Password Enter Token and New Password</span>
          <span>Minimum 8 Characters</span>
          <span>Must Contain atleast 1 Upper Case Charater</span>
          <span>Must Contain atleast 1 Lower Case Charater</span>
        </div>
        <div className="bg-gray dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 rounded-lg shadow sm:max-w-md w-full xl:p-0">
          <div className="flex flex-col p-6 sm:p-8">

            <form className="flex flex-col gap-6 md:gap-10" action={submitAction}>

              <div className='mt-2'>
                {/* <label htmlFor="token" className="block font-medium mb-2 md:text-xl text-black">TOKEN</label> */}
                <input type="token" name="token" id="token" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-3 rounded-lg text-gray-900 w-full" placeholder="Token" required={true} />
              </div>

              <div className=''>
                {/* <label htmlFor="password" className="block font-medium mb-2 md:text-xl text-black">New Password</label> */}
                <input type="password" name="password" id="password" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-3 rounded-lg text-gray-900 w-full" placeholder="New password" required={true} />
              </div>

              <div className=''>
                {/* <label htmlFor="confirm_password" className="block font-medium mb-2 md:text-xl text-black">Confirm Password</label> */}
                <input type="password" name="confirm_password" id="confirm_password" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-3 rounded-lg text-gray-900 w-full" placeholder="Confirm New Password" required={true} />
              </div>

              <button
                type="submit"
                className="bg-primary bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mb-10 md:text-lg px-5 py-2.5 rounded text-center text-white tracking-widest w-full"
                disabled={loading}
              >
                Submit
              </button>

            </form>

            <div className="flex items-center justify-between">
              <a href="/pageAuthentication/Login" className="dark:text-primary-500 font-medium hover:underline text-primary-600 text-sm">Help</a>
              <a href="/pageAuthentication/Login" className="dark:text-primary-500 font-medium hover:underline text-primary-600 text-sm">Login</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}