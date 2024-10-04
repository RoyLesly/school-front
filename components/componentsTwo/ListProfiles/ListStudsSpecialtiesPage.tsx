import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { getData } from "@/functions";
import { protocol } from "@/config";
import { GetUserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import Link from "next/link";
import TabsStudents from "../TabsProfiles/TabsStudents";


const columns = [
  {
    header: "No",
    accessor: "",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "md:table-cell w-9/12 md:w-5/12",
  },
  {
    header: "Year",
    accessor: "specialty__academic_year",
    className: "hidden md:table-cell w-1/12 md:w-3/12",
  },
  {
    header: "Level",
    accessor: "specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Goto",
    accessor: "action",
    className: "table-cell w-3/12 md:w-1/12 text-center flex",
  },
];

const ListStudsSpecialtiesPage = async ({ params, data }: { params: any, data: GetUserProfileInter | any }) => {
  const apiMyProfiles = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { nopage: true,
    user__id: data.user__id, 
    fieldList: [ "id", "user__id", "specialty__id", "user__full_name", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level" ] 
  })
  const renderRow = (item: GetUserProfileInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md} text-lg`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.specialty__main_specialty__specialty_name}</td>
      <td className="hidden md:table-cell">{item.specialty__academic_year}</td>
      <td className="hidden md:table-cell">{item.specialty__level__level}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          {/* <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.id}/Info`}><FaEye size={20} /></Link> */}
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.id}/Info`} className="border border-bluedash px-4 py-1 rounded">Profile</Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white flex-1 gap-2 m-2 mt-1 p-2 rounded-md">

      <TabsStudents page={2} params={params} />

      {data ? <div className="flex flex-col gap-4 md:my-10 my-4">
        <h1 className="capitalize font-semibold mb-1 text-center text-lg tracking-widest underline">SELECTED PROFILE CLASS</h1>
        <Table columns={columns} renderRow={renderRow} data={[data]} rowClassName="h-12" />
      </div> : <></>}

      {apiMyProfiles && apiMyProfiles.length > 1 ? <div className="flex flex-col gap-1">
        <h1 className="capitalize font-semibold mb-1 text-center text-lg tracking-widest underline">OTHER CLASSES</h1>
        <Table columns={columns} renderRow={renderRow} data={apiMyProfiles.filter((item: GetUserProfileInter) => item.specialty__id != data.specialty__id)} rowClassName="h-12" />
      </div> : <></>}
    </div>
  );
};

export default ListStudsSpecialtiesPage;
