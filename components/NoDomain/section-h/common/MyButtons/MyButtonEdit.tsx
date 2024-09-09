import Link from 'next/link'
import React, { FC } from 'react'


interface Props {
    href: string
}
const MyButtonEdit:FC<Props> = ({ href }) => {
  return (
    <button className='text-blue-500 bg-stroke'>
        <Link href={href} className='flex px-2 py-1 md:px-4 2xl:px-6 md:py-2'>
            Edit
        </Link>
    </button>
  )
}

export default MyButtonEdit