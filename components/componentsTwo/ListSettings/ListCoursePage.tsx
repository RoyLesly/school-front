import TabsCourse from "@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageSettings/pageCourses/TabsCourse";
import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { GetCourseInter } from "@/Domain/Utils-H/appControl/appInter";
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
    header: "Course Name",
    accessor: "main_course__course_name",
    className: "table-cell w-3/12 md:w-3/12",
  },
  {
    header: "class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
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
    header: "Sem",
    accessor: "semester",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Lecturer",
    accessor: "assigned_to__full_name",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-1/12 md:w-1/12",
  },
];

const ListCoursePage = ({ params, data }: { params: any, data: GetCourseInter[] | any }) => {

  const renderRow = (item: GetCourseInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.main_course__course_name}</td>
      <td className="hidden md:table-cell">{item.specialty__main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.specialty__academic_year}</td>
      <td className="hidden md:table-cell">{item.semester}</td>
      <td className="hidden md:table-cell">{item.assigned_to__full_name}</td>
      <td>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="course" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} />
          </button>
          {role === "admin" && (
            <FormModal table="course" type="delete" id={item.id} params={params} data={item} icon={<RiDeleteBin2Line />} />
          )}
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsCourse params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-2">
        <div className="flex gap-2 items-center w-full">
        <MyPageTitle title={"Courses"} />
        <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            {role === "admin" && (
              <FormModal table="course" type="create" params={params} icon={<FaPlus />} />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default ListCoursePage;
