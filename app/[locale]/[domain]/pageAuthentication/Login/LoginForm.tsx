'use client';
import { ConfigData, protocol } from '@/config';
import React, { useEffect, useState } from 'react';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useParams, useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import Swal from 'sweetalert2';
import { getData } from '@/functions';
import { GetSchoolInfoUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetSchoolInfoInter } from '@/Domain/Utils-H/appControl/appInter';
import { ActionLogin } from '@/serverActions/AuthActions';
import { LoginUrl } from '@/Domain/configDom';


const LoginForm = () => {

  const domain = useParams().domain
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [access, setAccess] = useState<string>("");
  const [refresh, setRefresh] = useState<string>("");
  const [schools, setSchools] = useState<GetSchoolInfoInter[]>();
  const router = useRouter();

  useEffect(() => {
    if (count == 0) {
      var session = localStorage.getItem("session")
      var school = localStorage.getItem("school")

      if (session) {
        var token = jwtDecode(session)
        if (token) {
          if (new Date().toISOString().slice(0, 16) > new Date(token.exp ? token?.exp : 1 * 1000).toISOString().slice(0, 16)) {     // Now > exp
            localStorage.removeItem("session")
            localStorage.removeItem("school")
            localStorage.removeItem("session")
            localStorage.removeItem("ref")
          } else {
            if (school) {
              // router.push(`/pageAuthentication/pageSelectSchool`)
            }
          }
        } else {
          localStorage.removeItem("session")
          localStorage.removeItem("ref")
        }
      }
    }
    if (count == 3) {
      const getSchools = async () => {
        var response = await getData(protocol  + "api" + domain + GetSchoolInfoUrl, { nopage: true, fieldList: [
          "id", "school_type", "school_name", "campus__id", "campus__name", "campus__region"
        ] })

        if (response && response.length > 0) { setSchools(response); setCount(4) }
        if (response && response.length < 1) {
          const alert = () => {
            Swal.fire({
              title: `No Campus Registered`,
              timer: 5000,
              timerProgressBar: true,
              showConfirmButton: false,
              icon: "warning",
            })
          }
          alert()
        }
      }
      getSchools()
    }
    if (count == 4) {
      if (refresh.length > 10 && access.length > 10) {
        const alert = () => {
          Swal.fire({
            title: "Login Successfully",
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "success",
          })
        }
        alert()
        setCount(5)
      }
    }
    if (count == 5) {
      const token: JwtPayload | any = jwtDecode(access)

      if (token && token.school && token.school.length == 1) {
        localStorage.setItem("school", token.school[0])
        var fil: GetSchoolInfoInter | undefined = schools?.filter((item: GetSchoolInfoInter) => item.id.toString() == token.school[0])[0]
        if (token.role == "admin" && fil) { 
          router.push(`/${fil.school_type}/pageAdministration/${fil.id}`); 
          return 
        }
        if (token.role == "teacher" && fil) {
          router.push(`/${fil.school_type}/pageLecturer/${fil.id}/${token.user_id}`); 
          return 
        }
        if (token.role == "student") {
          router.push(`/${domain}/Section-H/pageStudent`); 
          console.log("LOGIN LINE 99")
          return
        }
      }

      if (token.school && token.school.length > 1) {
        if (token.role == "admin" || token.role == "teacher") {
          if (token.role == "admin") {
            if (token.dept || token.dept.length > 0) { 
              router.push(`/${domain}/pageAuthentication/pageSelectSchool?role=${token.role}`); 
              return ;
            }
          }
          if (token.role == "teacher") {
            if (token.dept || token.dept.length > 0) { 
              router.push(`/${domain}/pageAuthentication/pageSelectSchool?role=${token.role}`); 
              return ;
            }
          }
        }
        if (token.role == "student") {
          router.push(`/Section-H/pageStudent/`); 
        }
      }
      
      if (!token.dept || token.dept.length < 1) {
        const alert = () => {
          Swal.fire({
            title: `User Has No Department`,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "warning",
          })
        }
        alert(); 
        return
      }
      if (token.school && token.school.length < 1) { 
        const alert = () => {
          Swal.fire({
            title: `User Has No Campus / School`,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "warning",
          })
        }
        alert(); 
        return
      }
      if (token.page) {
        if (token.page?.includes("MarkUpload")) { router.push("/pageMarkUpload"); return }
        if (token.page?.includes("CourseAssignment")) { router.push("/pageCourseAssignment"); return }
        if (token.page?.includes("CourseTimeTable")) { router.push("/pageCourseTimeTable"); return }
      }
      if (!token.page) { 
        const alert = () => {
          Swal.fire({
            title: `User Has No Page`,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "warning",
          })
        }
        alert(); 
        return
      }
    }
  }, [count, access, refresh, router, schools, domain])

  const onSubmitServerAction = async (prevState: any, formData: FormData) => {
    setLoading(true);
    const data = {
      matricle: formData.get("username"),
      password: formData.get("password")
    }

    const response = await ActionLogin(data, protocol + "api" + domain + LoginUrl)
    if (!response) {
      const alert = () => {
        Swal.fire({
          title: `No Campus Registered`,
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          icon: "warning",
        })
      }
      alert()
    }

    if (response?.detail) {
      const alert = () => {
        Swal.fire({
          title: `${response?.detail}`,
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          icon: "warning",
        })
      }
      alert()
      setLoading(false);
      return (response.detail)
    }
    if (response?.error) {
      const alert = () => {
        Swal.fire({
          title: `${response?.error}`,
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          icon: "error",
        })
      }
      alert()
      setLoading(false);
      return (response.error)
    }

    if (response?.access) {
      localStorage.setItem("session", response.access)
      localStorage.setItem("ref", response.refresh)
      setAccess(response.access);
      setRefresh(response.refresh);
      setCount(3);
    }
    setLoading(false)
  }

  const [errorState, submitAction] = useFormState(onSubmitServerAction, undefined)

  return (
    <section className="bg-boxdark dark:bg-gray-100">
      <div className="flex flex-col h-screen items-center justify-center lg:py-0 md:h-screen mx-auto px-6 py-8">
        <a href="#" className="flex font-semibold items-center mb-6 md:text-4xl text-3xl text-white tracking-widest">
          LOGIN
        </a>

        <div className="bg-gray dark:bg-gray-800 dark:border dark:border-gray-700 md:mt-0 rounded-lg shadow sm:max-w-md w-full xl:p-0">
          <div className="flex flex-col p-6 sm:p-8">

            <form className="flex flex-col gap-10" action={submitAction}>

              <div className='mt-4'>
                <label htmlFor="matricle" className="block font-medium mb-2 md:text-xl text-black">Matricle or Username</label>
                <input type="username" name="username" id="username" className="bg-black block border border-gray-300 dark:bg-gray-700 dark:bg-white dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 font-medium px-4 py-2 rounded-lg text-gray-900 text-white text-xl tracking-widest w-full" placeholder="Matricle or Username" required={true} />
              </div>
              <div>
                <label htmlFor="password" className="block font-medium mb-2 md:text-xl text-black">PASSWORD</label>
                {/* <input type="password" name="password" id="password" placeholder="•••••" className="bg-black block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 px-4 py-2 rounded-lg text-white tracking-widest w-full" required={true} /> */}
                <input type="password" name="password" id="password" placeholder="password" className="bg-black block border border-gray-300 dark:bg-gray-700 dark:bg-white dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-black focus:border-primary-600 focus:ring-primary-600 px-4 py-2 rounded-lg text-white text-xl tracking-widest w-full" required={true} />
              </div>

              <div className='flex justify-between'>
                <a href="/pageAuthentication/ResetPassword" className="font-medium hover:underline text-primary text-primary-600 text-sm">Forgot Password ?</a>
                <a href={`/${domain}/pageAuthentication/PasswordAndToken`} className="font-medium hover:underline text-primary text-primary-600 text-sm">Enter Token</a>
              </div>

              <button
                type="submit"
                className="bg-primary bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mb-10 md:text-lg px-5 py-2.5 rounded text-center text-white tracking-widest w-full"
                disabled={loading}
              >
                Login
              </button>

            </form>

            <div className="flex items-center justify-between">
              <a href={`https://wa.me/+237${ConfigData[`${domain}`].contact_number}/?text=Enter%20Matricle:%20OR%20Username:%20Complain: `} className="bg-slate-200 dark:text-primary-500 font-medium hover:underline px-4 py-1 rounded text-slate-700 text-sm">Help</a>
              <a href={`/${domain}/pageAuthentication/CheckUser`} className="bg-slate-200 dark:text-primary-500 font-medium hover:underline px-4 py-1 rounded text-slate-700 text-sm">Check User</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default LoginForm
