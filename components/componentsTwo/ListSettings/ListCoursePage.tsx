import FormModal from "@/componentsTwo/FormModal";
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
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl, GetMainCourseUrl } from "@/Domain/Utils-H/appControl/appConfig";
import TabsCourse from "../TabsSettings/TabsCourse";


const columns = [
  {
    header: "No",
    accessor: "id",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Course Name",
    accessor: "main_course__course_name",
    className: "table-cell w-10/12 md:w-3/12",
  },
  {
    header: "class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Level",
    accessor: "specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-1/12",
  },
  {
    header: "Year",
    accessor: "specialty__academic_year",
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
    className: "table-cell w-2/12 md:w-1/12",
  },
];

const ListCoursePage = async ({ params, data }: { params: any, data: GetCourseInter[] | any }) => {

  const apiYears: any[] = await getData(protocol + "api" + params.domain + AcademicYearUrl, { nopage: true })
  const apiDomains: any[] = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true })
  const apiMainCourses: any[] = await getData(protocol + "api" + params.domain + GetMainCourseUrl, { nopage: true })
  const apiLevels: any[] = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true })

  const thisYear = new Date().getFullYear();

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
            <FormModal table="course" type="update" params={params} id={item.id} data={item} icon={<MdModeEdit />} extra_data={
            { apiDomains: apiDomains, canEdit: true, apiMainCourses: apiMainCourses, apiLevel: apiLevels }
          } />
          </button>
          <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-7">
            <FormModal table="course" type="delete" params={params} data={item} icon={<RiDeleteBin2Line />} />
          </button>
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsCourse params={params} page={0} />

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Courses"} />
          <TableSearch placeholder="By Course Name" searchString="main_course__course_name" />
          <div className="hidden md:flex"><TableSearch placeholder="By Class" searchString="specialty__main_specialty__specialty_name" /></div>
          <div className="hidden md:flex"><TableSearch placeholder="By Level" searchString="specialty__level__level" /></div>
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <button className="bg-blue-300 flex h-7 items-center justify-center rounded-full w-10">
              <FormModal table="course" type="create" params={params} icon={<FaPlus />} extra_data={ {apiDomains: apiDomains, apiMainCourses: apiMainCourses, apiLevels: apiLevels , canCreate: true} } />
            </button>
          </div>
        </div>
      </div>

      {apiYears.length ? apiYears.map((year: string) =>
        <div key={year} className="flex flex-col gap-2">
          <h1 className="text-center tracking-widest">{year}</h1>
          <Table key={year}
            columns={columns}
            renderRow={renderRow}
            data={data.filter((cou: GetCourseInter) => cou.specialty__academic_year == year).sort((a: GetCourseInter, b: GetCourseInter) => a.specialty__level__level > b.specialty__level__level ? 1 : a.specialty__level__level < b.specialty__level__level ? -1 : 0)}
          />
        </div>
      )
        :
        [`${thisYear}/${thisYear + 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear - 2}/${thisYear - 1}`,].map((year: string) =>
          <div key={year} className="flex flex-col gap-2">
            <h1 className="text-center tracking-widest">{year}</h1>
            <Table key={year}
              columns={columns}
              renderRow={renderRow}
              data={data.filter((cou: GetCourseInter) => cou.specialty__academic_year == year).sort((a: GetCourseInter, b: GetCourseInter) => a.specialty__level__level > b.specialty__level__level ? 1 : a.specialty__level__level < b.specialty__level__level ? -1 : 0)}
            />
          </div>
        )}
    </div>
  );
};

export default ListCoursePage;
