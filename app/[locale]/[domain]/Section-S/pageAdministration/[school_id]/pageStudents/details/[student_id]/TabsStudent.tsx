import initTranslations from '@/i18n';
import Link from 'next/link'
import React from 'react';


const TabsStudent = async ({ params, page }: any) => {
  const { t } = await initTranslations(params.locale, ['common'])


  const Tabs: { id: number, link: string, name: string}[] = [
    { id: 1, link: `/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}`, name: `${t("personal_info")}`},
    { id: 2, link: `/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/myclasses`, name: `${t("classes")}`},
    { id: 3, link: `/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees`, name: `${t("fees")}`},
    { id: 4, link: `/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/results`, name: `${t("result")}s`},
  ]

  return (

          <div className='flex flex-col gap-4 items-center justify-between md:flex-row my-2 py-2'>
          {Tabs.map((item: {id: number, link: string, name: string}) => (
            <Link key={item.id} href={item.link} className={`${page == item.id ? "bg-blue-900  font-medium text-xl text-white" : "bg-slate-200 "} py-1 tracking-wide flex items-center justify-center rounded text-center w-full`}>
              {item.name}
            </Link>
          ))}
        </div>
        )
}

export default TabsStudent