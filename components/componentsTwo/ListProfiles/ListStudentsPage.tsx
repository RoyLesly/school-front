import TabsCourse from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageSettings/pageCoursesNew/TabsCourse";
import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaEye, FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import TableSearch from "../TableSearch";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import Link from "next/link";
import { GetProgramUrl } from "@/Domain/Utils-H/userControl/userConfig";


const columns = [
  {
    header: "Matricle",
    accessor: "user__matricle",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Full Name",
    accessor: "user__full_name",
    className: "hidden md:table-cell w-2/12 md:w-4/12",
  },
  {
    header: "Class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Year",
    accessor: "specialty__academic_year",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Level",
    accessor: "specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Telephone",
    accessor: "user__telephone",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12 text-center flex",
  },
];

const ListStudentsPage = async ({ params, data }: { params: any, data: GetUserProfileInter[] | any }) => {

  const apiDomains: any[] = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true });
  const apiLevel: any[] = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true });
  const apiPrograms: any[] = await getData(protocol + "api" + params.domain + GetProgramUrl, { nopage: true });

  const renderRow = (item: GetUserProfileInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="table-cell">{item.user__matricle}</td>
      <td className="table-cell">{item.user__full_name.slice(0, 35)}</td>
      <td className="hidden md:table-cell">{item.specialty__main_specialty__specialty_name.slice(0, 23)}</td>
      <td className="hidden md:table-cell">{item.specialty__academic_year}</td>
      <td className="hidden md:table-cell">{item.specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.user__telephone}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          {/* <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.id}/Info`}><FaEye size={20} /></Link> */}
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.id}/Info`} className="bg-bluedash px-2 py-1 rounded text-white">View</Link>
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Students"} />
          <TableSearch placeholder="By Name" searchString="user__full_name" />
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <FormModal table="student" type="create" params={params} icon={<FaPlus />} extra_data={[apiDomains, apiLevel, apiPrograms]} formClassName={"bg-white m-20 md:w-[60%] sm:w-[75%] w-[90%] xl:w-[45%]"} />
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-1">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    </div>
  );
};

export default ListStudentsPage;
