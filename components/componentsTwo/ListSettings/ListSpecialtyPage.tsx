import TabsSpecialty from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageSettings/pageSpecialties/TabsSpecialty";
import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class Name",
    accessor: "main_specialty__specialty_name",
    className: "table-cell w-3/12 md:w-5/12",
  },
  {
    header: "Year",
    accessor: "academic_year",
    className: "hidden md:table-cell w-1/12 md:w-3/12",
  },
  {
    header: "Level",
    accessor: "level__level",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12",
  },
];

const ListSpecialtyPage = ({ params, data }: { params: any, data: GetSpecialtyInter[] | any }) => {

  const renderRow = (item: GetSpecialtyInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.academic_year}</td>
      <td className="hidden md:table-cell">{item.level__level}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="specialty" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="specialty" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md text-black">

      <TabsSpecialty params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
        <MyPageTitle title={"Classes"} />
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal table="specialty" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListSpecialtyPage;
