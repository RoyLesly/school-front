'use client';
import React, {useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { ActionCheckUser } from '@/serverActions/AuthActions';
import { protocol } from '@/config';
import { CheckPasswordUrl } from '@/NoDomain/Utils-H/userControl/userConfig';


const CheckUser = () => {

  return (
    <CheckUserForm />
  )
}

export default CheckUser;


const CheckUserForm = () => {
  const [count, setCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    setLoading(true);
    const data = {
      matricle: formData.get("username"),
    }
    const response = await ActionCheckUser(data, protocol + CheckPasswordUrl)
    if (response?.errors) { toast.error(response.errors); setAttempts(attempts + 1); setLoading(false); }
    if (response?.fail) { toast.success("Set Password"); router.push(`/pageAuthentication/CreatePassword?id=${response.fail.id}&username=${response.fail.username}`) }
    if (response?.id) { toast.success("Has Password"); router.push("/pageAuthentication/Login") }
    setLoading(false)
  }

  const [errorState, submitAction] = useFormState(onSubmitServerAction, undefined)

  return (
    <section className="bg-boxdark dark:bg-gray-100">
      <div className="flex flex-col h-screen items-center justify-center lg:py-0 md:h-screen mx-auto px-6 py-8">
        <a href="#" className="flex font-semibold items-center mb-6 md:text-4xl text-3xl text-white tracking-widest">
          CHECK USER
        </a>

        {errorState ? <div className='flex flex-col font-semibold italic items-center mb-2 sm:tracking-widest text-center text-md tracking-wide'><span className="text-red">{errorState}</span><span>(Attempts {attempts})</span></div> : <span></span>}

        <div className="bg-gray dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 rounded-lg shadow sm:max-w-md w-full xl:p-0">
          <div className="flex flex-col p-6 sm:p-8">

            <form className="flex flex-col gap-10" action={submitAction}>

              <div className='mt-4'>
                <label htmlFor="matricle" className="block font-medium mb-2 md:text-xl text-black">MATRICLE or USERNAME</label>
                <input type="username" name="username" id="username" className="bg-gray-50 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 p-2.5 rounded-lg sm:text-sm text-gray-900 w-full" placeholder="matricle or username" required={true} />
              </div>

              <button
                type="submit"
                className="bg-primary bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mb-10 md:text-lg px-5 py-2.5 rounded text-center text-white tracking-widest w-full"
                disabled={loading}
              >
                Check
              </button>

            </form>

            <div className="flex items-center justify-between">
              {/* <a href="/pageAuthentication/ResetPassword" className="dark:text-primary-500 font-medium hover:underline text-primary-600 text-sm">Reset Password</a> */}
              <a href="/pageAuthentication/Login" className="dark:text-primary-500 font-medium hover:underline text-primary-600 text-sm">Back To Login</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}