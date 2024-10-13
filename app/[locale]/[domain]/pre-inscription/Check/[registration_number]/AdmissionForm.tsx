'use client';
import MessageModal from "@/componentsTwo/MessageModal";
import { ConfigData } from "@/config";
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";
import Link from "next/link";
import { FaDownload } from "react-icons/fa6";

const AdmissionForm = ({ data, params }: { params: any, data: GetCustomUserInter | any }) => {
  // return <>T</>
  const backgroundImageStyle = {
    backgroundImage: `url(${ConfigData[params.domain].bg.transcript})`,
    height: "100vh",
    margin: 0,
    padding: 2,
    alignItems: "center",
  };

  // return <div style={backgroundImageStyle} className="bg-slate-100 border-4 h-full rounded w-[793px]">
  <div className='border-teal-700 h-full rounded w-full'>
    <span>{data.registration_number}</span>
    <span>{data.full_name}</span>
    <span>{data.telephone}</span>
    <span>{data.sex}</span>
  </div>
  return (
    <Form data={data} params={params} />
  )
}


export default AdmissionForm

const Form = ({ data, params }: any) => {

  const backgroundImageStyle = {
    backgroundImage: `url(${ConfigData[params.domain].bg.transcript})`,
    height: "100vh",
    margin: 0,
    padding: 2,
    alignItems: "center",
  };

  // return <div style={backgroundImageStyle} className="bg-slate-100 border-4 h-full rounded w-[793px]">
  return <div className="bg-white flex flex-col gap-4 h-full items-center justify-center lg:p-20 md:border-2 md:p-10 rounded text-lg w-full">
    {/* <div className='border-4 border-teal-700 h-full rounded w-full' > */}
    <div className="flex flex-col gap-[1px] w-full">
      <div className="bg-slate-900 border flex flex-col font-semibold italic items-center justify-center md:flex-row p-2 rounded text-white w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 text-2xl w-full">Matricle</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-300 tracking-widest">{data.matricle}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row p-2 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Full Name / Nom et Prenom</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.full_name}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Telephone</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.telephone}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Gender / Sexe</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.sex}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
      <span className="flex justify-center md:py-2 md:w-1/3 w-full">Date of Birth / Date de Naissance</span>
      <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.dob}</span>
      </div>
      <div className="items-center justify-center my-2 p-2 text-center text-sm">
        <span>Please Use Your matricle to Login or Setup your password </span>
      </div>
      <div className='flex flex-row gap-4 items-center justify-between md:mt-4 mx-4 my-2'>
        <Link href={`/${params.domain}/pageAuthentication/Login`} className="border px-2 py-1 rounded text-center w-24">Login</Link>
        <Link href={`/${params.domain}/pageAuthentication/CreatePassword?id=${data.id}&username=${data.full_name}`} className="border px-2 py-1 rounded text-center w-24">Password</Link>
      </div>
    </div>

  </div>

}