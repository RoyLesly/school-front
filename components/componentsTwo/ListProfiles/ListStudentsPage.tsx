import FormModal from "@/componentsTwo/FormModal";
import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import { FaDownload, FaPlus } from "react-icons/fa6";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDepartmentInter, GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import Link from "next/link";
import { GetDepartmentUrl, GetProgramUrl } from "@/Domain/Utils-H/userControl/userConfig";
import MessageModal from "../MessageModal";
import SearchStudentProfile from "../SearchComponents/SearchStudentProfile";


const columns = [
  {
    header: "Matricle",
    accessor: "user__matricle",
    className: "hidden md:table-cell w-2/12 md:w-2/12",
  },
  {
    header: "Full Name",
    accessor: "user__full_name",
    className: "table-cell w-9/12 md:w-4/12",
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
    className: "table-cell w-3/12 md:w-1/12 text-center flex",
  },
];

const ListStudentsPage = async ({ params, searchParams, data }: { params: any, searchParams: any, data: GetUserProfileInter[] | any }) => {

  const apiDomains: any[] = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true });
  const apiLevel: any[] = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true });
  const apiYear: any[] = await getData(protocol + "api" + params.domain + AcademicYearUrl, { nopage: true });
  const apiPrograms: any[] = await getData(protocol + "api" + params.domain + GetProgramUrl, { nopage: true });
  const apiDepartments: { count: number, results: GetDepartmentInter[] } | any = await getData(protocol + "api" + params.domain + GetDepartmentUrl, { name: "stud" });

  const renderRow = (item: GetUserProfileInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="hidden md:table-cell">{item.user__matricle}</td>
      <td className="table-cell">{item.user__full_name.slice(0, 35)}</td>
      <td className="hidden md:table-cell">{item.specialty__main_specialty__specialty_name.slice(0, 23)}</td>
      <td className="hidden md:table-cell">{item.specialty__academic_year}</td>
      <td className="hidden md:table-cell">{item.specialty__level__level}</td>
      <td className="hidden md:table-cell">{item.user__telephone}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.id}/Info`} className="bg-bluedash px-2 py-1 rounded text-white">View</Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex flex-col gap-2 items-center md:flex-row w-full">
          <MyPageTitle title={`Students ${data.length}`} />
          <SearchStudentProfile apiLevel={apiLevel} apiYear={apiYear} />
          <div className="flex-row gap-2 hidden md:flex">
            {/* <TableSearch placeholder="By Class" searchString="specialty__main_specialty__specialty_name" /> */}
            {/* <TableSearch placeholder="By Year" searchString="specialty__level__level" /> */}
          </div>
          <div>
            {searchParams && Object.keys(searchParams).length ?
              <div className="flex flex-row gap-2 justify-end md:gap-4 w-full">
                <MessageModal
                  table="excel_profiles"
                  type="custom"
                  params={params} icon={<span className="flex gap-1 items-center justify-center mx-2 p-1"><FaDownload size={16} /></span>}
                  data={data}
                  extra_data={{
                    searchParams: searchParams,
                    type: "profiles_students",
                    export_title: `Students`,
                    worksheet_name: "Student List"
                  }}
                  customClassName={`flex gap-2 bg-bluedash px-3 py-1 text-white font-medium capitalize gap-2 cursor-pointer rounded-full`}
                />
              </div> : null}
          </div>
          <div className="flex flex-row gap-2 justify-end md:gap-4 md:w-30 w-full">
            <FormModal
              table="student"
              type="create"
              params={params}
              icon={<FaPlus
              />}
              extra_data={{ domains: apiDomains, levels: apiLevel, programs: apiPrograms, department: apiDepartments.results[0] }}
              formClassName={"bg-white m-20 md:w-[60%] sm:w-[75%] w-[90%] xl:w-[45%]"} />
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-1">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={data}
        />
      </div>
    </div>
  );
};

export default ListStudentsPage;
