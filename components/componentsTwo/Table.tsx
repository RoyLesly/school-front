import NoDataPage from "./lib/NoDataPage";

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any, index: number) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="md:mt-4 mt-2 text-black w-full">
      <thead className="bg-blue-500 border border-slate-700 dark:bg-blue-700 h-8 text-white">
      {/* <thead className="bg-blue-600 border border-black text-white"> */}
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
