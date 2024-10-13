'use client';
import InputField from '@/componentsTwo/InputField'
import SelectField from '@/componentsTwo/SelectField';
import { ConfigData, protocol } from '@/config';
import { ConstProgramList, ConstSpecialtyList } from '@/constants';
import { GetSchoolIdentificationInter } from '@/Domain/Utils-H/appControl/appInter';
import { OpenGetCustomUserNotProtectedUrl, PreInscriptionUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { getDataNotProtected, handleResponseError } from '@/functions';
import { SchemaCreateEditPreIncription } from '@/schemas-user';
import MyButtonModal from '@/section-h/common/MyButtons/MyButtonModal';
import { ActionCreateNotProtected } from '@/serverActions/actionGeneral';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { z } from 'zod';


const PreForm = ({ data, params }: { params: any, data?: GetSchoolIdentificationInter | any }) => {

  const SchemaCreate = z.object({
    first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
    sex: z.enum(["Male", "Female"]),
    telephone: z.coerce.number().int().gte(610000000).lte(699999999).refine(async (e) => {
      const telephones = await getDataNotProtected(protocol + "api" + params.domain + OpenGetCustomUserNotProtectedUrl, { telephone: e });
      if (telephones && telephones.count) return false;
      else return true
    }, "This telephone exist already"),
    email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email.").refine(async (e) => {
      const emails = await getDataNotProtected(protocol + "api" + params.domain + OpenGetCustomUserNotProtectedUrl, { email: e });
      if (emails && emails.count) return false;
      else return true
    }, "This email exist already"),
    address: z.string().optional(),
    pob: z.string().optional(),
    dob: z.string().optional(),
    parent_name: z.string().optional(),
    parent_telephone: z.coerce.number().int().gte(610000000).lte(699999999).optional(),
    emergency_name: z.string().optional(),
    emergency_town: z.string().optional(),
    emergency_telephone: z.coerce.number().int().gte(610000000).lte(699999999),
    academic_year: z.string(),
    specialty_one: z.string(),
    specialty_two: z.string().optional(),
    specialty_three: z.string().optional(),
    campus: z.string(),
    program: z.string(),
    session: z.enum(["Morning", "Evening"]),
    level: z.enum(["100", "200", "300", "400", "500"]),
  })

  type Inputs = z.infer<typeof SchemaCreate>;

  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const thisYear = new Date().getFullYear()

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      registration_number: formVals.first_name?.toString().toUpperCase(),
      first_name: formVals.first_name?.toString().toUpperCase(),
      last_name: formVals.last_name?.toString().toUpperCase(),
      full_name: formVals.first_name?.toString().toUpperCase() + " " + formVals.last_name?.toString().toUpperCase(),
      sex: formVals.sex,
      email: formVals.email?.toString().toLowerCase(),
      telephone: formVals.telephone,
      address: formVals.address?.toString().toUpperCase(),
      pob: formVals.pob,
      dob: formVals.dob,
      emergency_name: formVals.emergency_name?.toString().toUpperCase(),
      emergency_town: formVals.emergency_town,
      emergency_telephone: formVals.emergency_telephone,
      academic_year: formVals.academic_year,
      program: formVals.program,
      level: formVals.level,
      session: formVals.session,
      campus: formVals.campus,
      specialty_one: formVals.specialty_one,
      specialty_two: formVals.specialty_two,
      status: "PENDING",
      admission_status: false,
      action: "CREATING",
    }

    const call = async () => {
      const response = await ActionCreateNotProtected(newData, SchemaCreateEditPreIncription, protocol + "api" + params.domain + PreInscriptionUrl)
      const t = await handleResponseError(response, ["full_name", "telephone", "email", "pob", "dob"]);
      if (t == "" && response && response.id) {
        router.push(`/${params.domain}/pre-inscription/Check/${response.registration_number}?dob=${response.dob}&created=SUCCESSFUL (${response.id}) !!!`);
      }
      setClicked(false)
    }
    call()
  });


  return (
    <div className='bg-slate-200 border flex flex-col p-2 rounded'>
      <form className="Name Parent flex flex-col gap-4" onSubmit={onSubmit}>

        <div className={page == 0 ? "flex flex-col gap-2 md:gap-4 md:p-4" : "hidden"}>
          <h1 className='flex font-bold italic item-center justify-center text-center text-lg tracking-widest'>PERSONAL INFORMATION (INFORMATION PERSONEL)</h1>
          <div className='flex flex-row gap-2 md:gap-4'>
            <InputField
              label="First Name"
              label_two="Nom"
              name="first_name"
              defaultValue={data?.last_name}
              register={register}
              error={errors?.first_name}
            />
            <InputField
              label="Last Name"
              label_two="Prenom"
              name="last_name"
              defaultValue={data?.last_name}
              register={register}
              error={errors?.last_name}
            />
          </div>

          <div className='flex flex-col gap-2 md:flex-row'>
            <SelectField
              label="Gender"
              label_two="Sexe"
              name="sex"
              defaultValue={data?.sex}
              register={register}
              error={errors?.sex}
              data={["Male", "Female"]}
            />
            <InputField
              label="Place Of Birth"
              label_two="Lieu De Naissance"
              name="pob"
              defaultValue={data?.pob}
              register={register}
              error={errors?.pob}
            />
            <InputField
              label="Date Of Birth"
              label_two="Date de Naissance"
              name="dob"
              defaultValue={data?.dob}
              register={register}
              error={errors?.dob}
              type="date"
            />
          </div>

          <div className='flex flex-col gap-2 md:flex-row'>
            <InputField
              label="Address"
              label_two="Addresse"
              name="address"
              defaultValue={data?.address}
              register={register}
              error={errors?.address}
            />
            <InputField
              label="Email"
              name="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
            />
            <InputField
              label="Student Telephone"
              name="telephone"
              defaultValue={data?.telephone}
              register={register}
              error={errors?.telephone}
              type="number"
            />
          </div>
          <div className='flex flex-col gap-2 md:flex-row'>
            <InputField
              label="Emmergency Contact"
              label_two="Personne En Cas d'Urgence"
              name="emergency_name"
              defaultValue={data?.emergency_name}
              register={register}
              error={errors?.emergency_name}
            />
            <InputField
              label="Emmergency Contact Telephone"
              name="emergency_telephone"
              defaultValue={data?.emergency_telephone}
              register={register}
              error={errors?.emergency_telephone}
              type="number"
            />
            <InputField
              label="Emmergency Contact City"
              label_two="Ville"
              name="emergency_town"
              defaultValue={data?.emergency_town}
              register={register}
              error={errors?.emergency_town}
            />
          </div>

          <div className="flex font-medium italic items-center justify-center mt-4 text-lg tracking-widest">
            <button onClick={() => setPage(1)} className="bg-blue-600 flex gap-2 items-center px-4 py-1 rounded-md text-white">
              Next <FaArrowRight />
            </button>
          </div>
        </div>




        <div className={page == 1 ? "flex flex-col gap-2 md:gap-4 md:p-4" : "hidden"}>
          <h1 className='flex font-bold italic item-center justify-center text-center text-lg tracking-widest'>SELECT COURSE (FILIERE)</h1>

          <div className='flex flex-col gap-2 md:flex-row'>
            <SelectField
              label="Academic Year"
              name="academic_year"
              defaultValue={data?.academic_year}
              register={register}
              error={errors?.academic_year}
              data={[`${thisYear}/${(thisYear + 1)}`, `${thisYear - 1}/${(thisYear)}`]}
            />
            <SelectField
              label="Level"
              label_two="Niveau"
              name="level"
              defaultValue={data?.level}
              register={register}
              error={errors?.level}
              data={["100", "200", "300", "400", "500"]}
            />
            <SelectField
              label="Session"
              name="session"
              defaultValue={data?.session}
              register={register}
              error={errors?.session}
              data={["Morning", "Evening"]}
            />

          </div>

          <div className='flex flex-col gap-2 md:flex-row'>
            <SelectField
              label="Specialty One"
              label_two="1ere Filiere"
              name="specialty_one"
              defaultValue={data?.specialty_one}
              register={register}
              error={errors?.specialty_one}
              data={ConstSpecialtyList}
            />
            <SelectField
              label="Specialty Two"
              label_two="2nd Filiere"
              name="specialty_two"
              defaultValue={data?.specialty_one}
              register={register}
              error={errors?.specialty_one}
              data={ConstSpecialtyList}
            />
                        <InputField
              label="Other"
              label_two="Autre"
              name="specialty_three"
              defaultValue={data?.specialty_three}
              register={register}
              error={errors?.specialty_three}
            />
          </div>

          <div className='flex flex-col gap-2 md:flex-row'>
          <SelectField
              label="Program"
              label_two="Programme"
              name="program"
              defaultValue={data?.program}
              register={register}
              error={errors?.program}
              data={ConstProgramList}
            />
            <SelectField
              label="Campus"
              name="campus"
              defaultValue={data?.campus}
              register={register}
              error={errors?.campus}
              display={{ name: "location", value: "name" }}
              data={ConfigData[params.domain]["higher"].campus}
            />
          </div>

          <div className="flex font-medium items-center justify-between mt-4 tracking-widest">
            <button onClick={() => setPage(0)} className="bg-red flex gap-2 items-center px-4 py-1 rounded-md text-white">
              <FaArrowLeft /> Back
            </button>

            <MyButtonModal type={"SAVE"} clicked={clicked} className='bg-teal-700' icon={<FaSave />} />
          </div>

        </div>


        <div className={page == 2 ? "flex flex-col gap-2 md:gap-4 md:p-4" : "hidden"}>

          <h1>MEDICAL HISTORY</h1>
          <div className="flex font-medium items-center justify-between mt-4 tracking-widest">
            <button onClick={() => setPage(0)} className="bg-red flex gap-2 items-center px-4 py-1 rounded-md text-white">
              <FaArrowLeft /> Back
            </button>
            <MyButtonModal type={"SAVE"} clicked={clicked} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default PreForm