import Link from 'next/link'
import React from 'react'

const TabsStudent = ({ params }: any) => {

  const Tabs: { id: number, link: string, name: string}[] = [
    { id: 1, link: `/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.id}`, name: "Personal Info"},
    { id: 2, link: `/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.id}/specialties`, name: "Specialties"},
    { id: 3, link: `/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.id}/fees`, name: "Fees"},
  ]

  return (

          <div className='flex flex-col gap-4 items-center justify-between md:flex-row my-2 py-2'>
          {Tabs.map((item: {id: number, link: string, name: string}) => (<button key={item.id} className='flex items-center justify-center text-center w-full'>
            <Link href={item.link}>
              {item.name}
            </Link>
          </button>))}
        </div>
        )
}

export default TabsStudent