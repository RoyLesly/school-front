import MyButtonView from '@/NoDomain/section-h/common/MyButtons/MyButtonView';
import { getData } from '@/functions';
import React, { FC } from 'react'
import { FieldInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { FieldUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { protocol } from '@/config';

const Fields = async ({ id }: any) => {

  const apiData: FieldInter[] | any = await getData(protocol + FieldUrl + `?domain_id=${id}`, {});


    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
        <div className="flex justify-between px-4 py-4 xl:px-7.5">
          <h4 className="dark:text-white font-semibold text-black text-xl">
            Select Field
          </h4>
          {/* <button className="bg-black dark:bg-blue-800 font-semibold md:px-6 md:py-2 md:text-xl px-3 py-1 rounded-sm text-secondary">
            <Link href={"/pageProcurement/pageInventory/category/create"}>
              Add Domain
            </Link>
          </button> */}
        </div>
  
        <div></div>
  
        <div className="2xl:px-6.5 border-stroke border-t dark:border-strokedark font-semibold grid grid-cols-2 md:px-6 md:text-lg px-4 py-4 sm:grid-cols-4">
          <div className="hidden items-center sm:flex">
            <p className="font-medium">#</p>
          </div>
          <div className="flex items-center">
            <p className="font-medium">Field Name</p>
          </div>
          <div className="hidden md:flex">
            <p className="font-medium">Domain Name</p>
          </div>
          <div className="flex items-center justify-center text-center">
            <p className="font-medium">Action</p>
          </div>
        </div>
        {apiData.results && apiData.results.length > 0 && apiData.results.map((item: FieldInter, key: number) => (
            <Item key={key} data={item} number={key}/>
        ))}
      
      </div>
    )
}

export default Fields

interface Props {
    data: FieldInter
    number: number
}

const Item:FC<Props> = ({ data, number }) => {

  return (
    <div
        className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:px-6 px-4 py-2 sm:grid-cols-4"
    >
      <div className="hidden items-center sm:flex">
        <p className="dark:text-white text-black text-lg">
            {number + 1}
        </p>
        </div>

        <p className="dark:text-white flex items-center text-black text-lg">
            {data.field_name}
        </p>
        <p className="dark:text-white hidden md:flex text-black text-lg">
            {data.domain.domain_name}
        </p>

      <div className="flex gap-2 items-center justify-center md:gap-6 md:text-md px-2 text-lg w-full">
          <MyButtonView link={`pageAdministration/pageResult/pageSpecialty/${data.id}`} />
      </div>
    </div>
  )
}