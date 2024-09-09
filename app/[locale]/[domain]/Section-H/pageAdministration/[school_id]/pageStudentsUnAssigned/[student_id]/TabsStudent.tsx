import Link from 'next/link'
import React from 'react'

const TabsStudent = ({ params, page }: any) => {

  const Tabs: { id: number, link: string, name: string}[] = [
    { id: 1, link: `/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}`, name: "Assign Class"},
    // { id: 2, link: `/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}/info`, name: "Personal Info"},
    // { id: 3, link: `/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}/fees`, name: "Fees"},
  ]

  return (

          <div className='flex flex-col gap-4 items-center justify-between md:flex-row my-2 py-2'>
          {Tabs.map((item: {id: number, link: string, name: string}) => (<button key={item.id} className={`${page == item.id ? "bg-bluelight text-black font-semibold text-lg" : "bg-slate-200 "} py-1 tracking-wide flex items-center justify-center rounded text-center w-full`}>
            <Link href={item.link}>
              {item.name}
            </Link>
          </button>))}
        </div>
        )
}

export default TabsStudent