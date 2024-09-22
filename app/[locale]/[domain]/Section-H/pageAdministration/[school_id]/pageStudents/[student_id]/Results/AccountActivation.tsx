import Link from 'next/link'
import React from 'react';
import initTranslations from "@/i18n";
import FormModal from '@/componentsTwo/FormModal';
import { FaPlus } from 'react-icons/fa6';
import { GetSchoolFeesInter } from '@/Domain/Utils-H/feesControl/feesInter';


const AccountActivation = async ({ onActivate, params, schoolfees, url }: {onActivate: any, params: any, schoolfees: GetSchoolFeesInter, url: string}) => {

  const { t } = await initTranslations(params.locale, ['common'])


  return (
    <div className="flex flex-col flex-grow gap-10 h-full items-center justify-center py-40 text-black text-xl">
        <div>{t("platform_unpaid_message_1")}</div>
        <div className='text-wrap'>{t("platform_unpaid_message", {amount: 1000})}</div>
        <FormModal 
          table="platform_charge" 
          type="custom" 
          params={params} 
          icon={<FaPlus />} 
          data={schoolfees} 
          extra_data={[
            `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Results/`, 
            "single",
            onActivate,
            url
          ]} 
          buttonTitle={`${t("pay_now")}`}
          customClassName={` flex gap-2 border bg-bluedash px-6 py-2 rounded text-white font-medium capitalize gap-2 cursor-pointer`}
        />        
        
        {/* <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${params.student_id}`} */}
    </div>
  )
}

export default AccountActivation