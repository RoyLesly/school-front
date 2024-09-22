import FormModal from "@/componentsTwo/FormModal";
import { role } from "@/componentsTwo/lib/data";
import Table from "@/componentsTwo/Table";
import TableSearch from "@/componentsTwo/TableSearch";
import { TableRowClassName } from "@/constants";
import { GetDomainInter } from "@/Domain/Utils-H/appControl/appInter";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import initTranslations from "@/i18n";
import MyPageTitle from "@/section-h/common/MyPageTitle";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";


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

const ListPendingPlatformPage = async ({ params, data }: { params: any, data: GetDomainInter[] | any }) => {

  const { t } = await initTranslations(params.locale, ['common'])
  const renderRow = (item: GetSchoolFeesInter, index: number) => (
    <tr
      key={index + 1}
      className={`${TableRowClassName.all + " " + TableRowClassName.sm}`}
    >
      <td className="">{item.userprofile__user__matricle}</td>
      <td className="">{item.userprofile__user__full_name}</td>
      <td className="">{item.userprofile__specialty__main_specialty__specialty_name}</td>
      <td className="">{item.userprofile__specialty__level__level}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          <FormModal
            table="platform_charge"
            type="custom"
            params={params}
            icon={<FaPlus />}
            data={item.id}
            extra_data={[
              `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/`,
              "single",
            ]}
            buttonTitle={`${t("pay")}`}
            customClassName={` flex gap-2 border bg-bluedash px-4 py-1 rounded text-white font-medium capitalize gap-2 cursor-pointer`}
          />
        </div>
      </td>
    </tr>
  );


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      {/* TOP */}
      <div className="flex flex-col gap-4 items-center justify-between mb-2 md:flex-row md:gap-2 md:mb-4">
        <div className="flex gap-2 items-center w-full">
          <MyPageTitle title={"Pending Platform Activation"} />
          <div className="flex flex-col gap-4 items-center md:flex-row md:w-auto w-full">
            <TableSearch placeholder="By Name" searchString="userprofile__user__full_name" />
          </div>
          <div>
            <FormModal
              table="platform_charge"
              type="custom"
              params={params}
              icon={""}
              data={data}
              extra_data={[
                `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/`,
                "all",
              ]}
              buttonTitle={`${t("pay All")}`}
              customClassName={` flex gap-2 rounded-[8px] w-30 flex-row bg-bluedash px-4 py-[5px] text-white font-medium capitalize w-full cursor-pointer`}
            />
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />

    </div>
  );
};

export default ListPendingPlatformPage;
