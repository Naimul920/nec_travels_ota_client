import { Table as AntTable, type TableProps } from "antd";
import TableHeader from "@/components/common/Table/TableHeader";
import clsx from "clsx";

interface CustomTableProps<RecordType> {
  className?: string;
  title?: string;
  columns: TableProps<RecordType>["columns"];
  dataSource: RecordType[];
  onChange?: TableProps<RecordType>["onChange"];
  pagination?: TableProps<RecordType>["pagination"];
  rowKey?: string;
  isSelect?: boolean;
}

const Table = <RecordType extends object>({
  className,
  title,
  columns,
  dataSource,
  onChange,
  pagination,
  rowKey = "key",
  isSelect = false,
}: CustomTableProps<RecordType>) => {
  return (
    <AntTable
      className={clsx("m-3 md:m-0 pt-3 custom-table", className)}
      title={() => <TableHeader title={title} isSelect={isSelect} />}
      columns={columns}
      dataSource={dataSource}
      onChange={onChange}
      pagination={pagination}
      rowKey={rowKey}
      scroll={{ x: "50%" }}
      bordered
    />
  );
};

export default Table;
