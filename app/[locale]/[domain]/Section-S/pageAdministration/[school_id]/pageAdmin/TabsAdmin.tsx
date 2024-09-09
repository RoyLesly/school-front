import Link from 'next/link'
import React from 'react'

const TabsAdmin = ({ school_id }: any) => {
  return (

          <div className='dark:text-white flex flex-row gap-4 items-center justify-between mb-2 md:gap-10 py-2'>
            <div className='bg-white dark:bg-slate-700 flex font-medium items-center justify-center md:text-lg md:w-60 py-1 rounded tracking-wider w-full'>
              <Link href={`/Section-H/pageAdministration/${school_id}/pageAdmin`}>System Status</Link>
            </div>
            <div className='bg-white dark:bg-slate-700 flex font-medium items-center justify-center md:text-lg md:w-60 py-1 rounded tracking-wider w-full'>
              <Link href={`/Section-H/pageAdministration/${school_id}/pageAdmin/pagePlatForm`}>PlatForm Charges</Link>
            </div>
            <div className='bg-white dark:bg-slate-700 flex font-medium items-center justify-center md:text-lg md:w-60 py-1 rounded tracking-wider w-full'>
              <Link href={`/Section-H/pageAdministration/${school_id}/pageAdmin`}>Others</Link>
            </div>
          </div>
        )
}

export default TabsAdmin