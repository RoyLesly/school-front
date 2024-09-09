import initTranslations from '@/i18n'
import Link from 'next/link'
import React from 'react'


const SessionExpired = async ({ params }: any) => {

  console.log(params, 8)

  const { t } = await initTranslations(params.locale, ['common'])

  return (
    <div className='bg-slate-300 flex flex-col gap-10 h-screen items-center justify-center text-center tracking-widest w-full'>
        <div className='flex font-bold text-4xl'>{t("session_expired")}</div>
        <div className='flex text-xl'>
            <Link 
                href={"/pageAuthentication/Login"}
                className='bg-slate-500 cursor-pointer hover:bg-slate-700 hover:text-blue-300 px-10 py-2 rounded text-black'
            >
                {t("login_again")}
            </Link>
        </div>
    </div>
  )
}

export default SessionExpired