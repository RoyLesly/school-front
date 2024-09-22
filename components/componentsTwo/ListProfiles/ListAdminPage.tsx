import TabsCourse from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageSettings/pageCoursesNew/TabsCourse";
import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetCourseInter } from "@/Domain/Utils-H/appControl/appInter";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TableSearch from "../TableSearch";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { AcademicYearUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";
import TabsLecturer from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageLecturers/TabsLecturer";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Full Name",
    accessor: "full_name",
    className: "hidden md:table-cell w-2/12 md:w-5/12",
  },
  {
    header: "Telephone",
    accessor: "telephone",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Gender",
    accessor: "sex",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Username",
    accessor: "username",
    className: "table-cell w-3/12 md:w-1/12",
  },
  {
    header: "Title",
    accessor: "title",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12",
  },
];

const ListAdminsPage = async ({ params, data }: { params: any, data: GetCustomUserInter[] | any }) => {

  const apiYear = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id })

  const renderRow = (item: GetCustomUserInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="table-cell">{item.full_name}</td>
      <td className="hidden md:table-cell">{item.telephone}</td>
      <td className="hidden md:table-cell">{item.sex}</td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.title}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="admins" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="admins" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsLecturer params={params} page={1} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Admins"} />
          <TableSearch placeholder="By Name" searchString="full_name" />
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal table="admins" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-1">
      <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    </div>
  );
};

export default ListAdminsPage;
