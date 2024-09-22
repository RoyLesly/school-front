import NoDataPage from "./lib/NoDataPage";

const Table = ({
  columns,
  renderRow,
  data,
  headerClassName,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any, index: number) => React.ReactNode;
  data: any[];
  rowClassName?: string;
  headerClassName?: string;
}) => {
  return (
    <table className="text-black w-full">
      <thead className={`${headerClassName} ? ${headerClassName} : "bg-blue-600 border border-slate-700 dark:bg-blue-800 h-8 text-white"`}>
        <tr className="font-medium text-left text-lg">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      {
        data && data.length ?
          <tbody className="border-2 border-slate-300 rounded-lg">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
          :
          <tbody className="border-2 border-slate-300 p-2 rounded-lg">
          <NoDataPage />
          </tbody>
      }
    </table>
  );
};

export default Table;
