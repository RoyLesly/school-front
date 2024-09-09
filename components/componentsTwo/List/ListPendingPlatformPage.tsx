import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { TableRowClassName } from "@/constants";
import { GetDomainInter } from "@/Domain/Utils-H/appControl/appInter";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import Image from "next/image";


const columns = [
  {
    header: "Matricle",
    accessor: "userprofile__user__matricle",
    className: "table-cell w-1/6",
  },
  {
    header: "Full Name",
    accessor: "userprofile__user__full_name",
    className: "table-cell w-5/12",
  },
  {
    header: "Class",
    accessor: "userprofile__specialty__main_specialty__specialty_name",
    className: "table-cell w-3/12",
  },
  {
    header: "Level",
    accessor: "userprofile__specialty__level__level",
    className: "table-cell w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/6",
  },
];

const ListPendingPlatformPage = ({ params, data }: { params: any, data: GetDomainInter[] | any }) => {

  const renderRow = (item: GetSchoolFeesInter, index: number) => (
    <tr
      key={index + 1}
      className={`${TableRowClassName.all + " " + TableRowClassName.md}`}
    >
      <td className="">{item.userprofile__user__matricle}</td>
      <td className="">{item.userprofile__user__full_name}</td>
      <td className="">{item.userprofile__specialty__main_specialty__specialty_name}</td>
      <td className="">{item.userprofile__specialty__level__level}</td>
      <td>
        <div className="flex gap-2 items-center">
            <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
              {/* <FormModal table="pending_activation" type="update" params={params} id={item.id} data={item} iccon /> */}
            </button>
        </div>
      </td>
    </tr>
  );
  

  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex items-center justify-between">
        <MyPageTitle title={"Pending Platform Activation"} />
        <div className="flex flex-col gap-4 items-center md:flex-row md:w-auto w-full">
          {/* <TableSearch /> */}
          <div className="flex gap-2 items-center md:gap-4 self-end">
            <button className="bg-yellow-300 flex h-8 items-center justify-center rounded-full w-8">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="bg-yellow-700 flex h-8 items-center justify-center rounded-full w-8">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (<></>
              // <button className="bg-lamaYellow flex h-8 items-center justify-center rounded-full w-8">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              // <FormModal table="pending_activation" type="create" params={params} />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      {/* <Table columns={columns} renderRow={renderRow} data={data} /> */}
      {/* PAGINATION */}
      {/* <Pagination /> */}
    </div>
  );
};

export default ListPendingPlatformPage;
