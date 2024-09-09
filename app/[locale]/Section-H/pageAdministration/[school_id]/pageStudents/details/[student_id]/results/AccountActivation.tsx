import Link from 'next/link'
import React from 'react';
import initTranslations from "@/i18n";


const AccountActivation = async ({ params }: any) => {

  const { t } = await initTranslations(params.locale, ['common'])


  return (
    <div className="flex flex-col flex-grow gap-10 h-full items-center justify-center py-40 text-black text-xl">
        <div>{t("platform_unpaid_message_1")}</div>
        <div className='text-wrap'>{t("platform_unpaid_message", {amount: 1000})}</div>
        <Link href={`/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation`} className='bg-bluedash px-6 py-2 rounded text-white'>{t("pay_now")}</Link>
    </div>
  )
}

export default AccountActivation