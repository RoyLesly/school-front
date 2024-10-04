import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { GetSchoolFeesInter, GetTransactionsInter } from "@/Domain/Utils-H/feesControl/feesInter";
import FormModal from "../FormModal";
import TabsStudents from "../TabsProfiles/TabsStudents";


const columns = [
  {
    header: "No",
    accessor: "",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Reason",
    accessor: "reason",
    className: "md:table-cell w-6/12 md:w-3/12",
  },
  {
    header: "Account",
    accessor: "account",
    className: "hidden md:table-cell w-1/12 md:w-3/12",
  },
  {
    header: "Amount",
    accessor: "amount",
    className: "md:table-cell w-4/12 md:w-2/12",
  },
  {
    header: "Date",
    accessor: "created_at",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell w-2/12 md:w-1/12 text-center flex",
  },
];

const ListStudsTransactionsPage = async ({ params, data, school }: { params: any, data: GetTransactionsInter[] | any, school: GetSchoolFeesInter | any }) => {

  const renderRow = (item: GetTransactionsInter, index: number) => (
    <tr
      key={item.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md} text-lg`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.reason}</td>
      <td className="hidden md:table-cell">{item.account}</td>
      <td className="md:table-cell">{item.amount.toLocaleString()}F</td>
      <td className="hidden md:table-cell">{item.created_at}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.id}/Info`} className="border px-2 py-1 rounded">
          View
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white flex-1 m-2 md:gap-2 mt-1 p-2 rounded-md">

      <TabsStudents page={3} params={params} />

      <div className="flex gap-2 justify-between">
        <div className="flex gap-2 items-center justify-center">
          <span>Full Name:</span>
          <span className="font-medium italic md:text-2xl tracking">{school.userprofile__user__full_name}</span>
        </div>
        <div>
          <FormModal table="pay_fees" type="create" 
          params={params} icon={<FaPlus />} data={school} 
          extra_data={[`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Fees`]} 
          />
        </div>
      </div>


      <div className="flex flex-col gap-0 items-center justify-start md:flex-row md:gap-4 md:justify-between md:px-4 md:text-lg py-2 text-black">
        <div className="flex-row gap-2 hidden items-center justify-center md:flex">
          <span>Class:</span>
          <span className="font-medium italic md:text-2xl tracking">{school.userprofile__specialty__main_specialty__specialty_name}</span>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex gap-2 items-center justify-center">
            <span>Year:</span>
            <span className="font-medium italic md:text-2xl tracking">{school.userprofile__specialty__academic_year}</span>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <span>Level:</span>
            <span className="font-medium italic md:text-2xl tracking">{school.userprofile__specialty__level__level}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-between md:gap-4 md:px-4 md:text-xl text-black">
        <div className="flex gap-2 items-center justify-center">
          <span>Tuition:</span>
          <span className="font-medium italic md:text-2xl tracking">{school.userprofile__specialty__tuition.toLocaleString()} F</span>
        </div>
        <div className="gap-2 hidden items-center justify-center md:flex">
          <span>Paid:</span>
          <span className="font-medium italic md:text-2xl tracking">{(school.userprofile__specialty__tuition - school.balance).toLocaleString()} F</span>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <span>Balance:</span>
          <span className="font-medium italic md:text-2xl tracking">{school.balance.toLocaleString()} F</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Table columns={columns} renderRow={renderRow} data={data.filter((item: GetTransactionsInter) => !item.reason.includes("harge"))} rowClassName="h-12" />
      </div>
    </div>
  );
};

export default ListStudsTransactionsPage;
