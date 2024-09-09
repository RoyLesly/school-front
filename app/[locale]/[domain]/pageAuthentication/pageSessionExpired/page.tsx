import SessionExpired from '@/section-h/common/SessionExpired'
import React from 'react'

const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <SessionExpired  params={params} />
  )
}

export default page
