import MyButtonView from '@/NoDomain/section-h/common/MyButtons/MyButtonView';
import { getData } from '@/functions';
import React, { FC } from 'react'
import { GetDomainInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { DomainUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, publish_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiData: any = await getData(protocol + DomainUrl, { ...searchParams, fieldList: [ "id" ] });

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
        <div className="flex justify-between px-4 py-4 xl:px-7.5">
          <h4 className="dark:text-white font-semibold text-black text-xl">
            Select Domain
          </h4>
        </div>
  
        <div></div>
  
        <div className="border-stroke border-t dark:border-strokedark font-semibold grid grid-cols-2 md:px-6 md:text-lg px-4 py-4 sm:grid-cols-3">
          <div className="hidden items-center sm:flex">
            <span className="font-medium">#</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Domain Name</span>
          </div>
          <div className="flex items-center justify-center text-center">
            <span className="font-medium">Action</span>
          </div>
        </div>
        {apiData && apiData.length > 0 && apiData.map((item: GetDomainInter, key: number) => (
            <Item key={key} data={item} number={key}/>
        ))}
      
      </div>
    )
}

export default page;



interface Props {
    data: GetDomainInter
    number: number
}
const Item:FC<Props> = ({ data, number }) => {

    return (
        <div
            className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:px-6 px-4 py-2 sm:grid-cols-3"
        >
            <div className="hidden items-center sm:flex">
                <p className="dark:text-white text-black text-lg">
                    {number + 1}
                </p>
                </div>
                <div className="flex items-center">
                <p className="dark:text-white text-black text-lg">
                    {data.domain_name}
                </p>
            </div>

            <div className="flex gap-2 items-center justify-center md:gap-6 md:text-md px-2 text-lg w-full">
                <MyButtonView link={`pageAdministration/pageResult/pageSpecialty/${data.id}`} />
            </div>
        </div>
    )
}