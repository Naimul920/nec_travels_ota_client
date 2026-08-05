import { Table as AntTable, ConfigProvider, type TableProps } from "antd";
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
    <div className={clsx("p-3 md:p-0 md:pt-2", className)}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00a550",
            borderRadius: 8,
            fontFamily: "var(--font-sans), sans-serif",
          },
          components: {
            Pagination: {
              itemBg: "#ffffff",
            },
          },
        }}
      >
        <AntTable
          className="custom-table"
          title={() => <TableHeader title={title} isSelect={isSelect} />}
          columns={columns}
          dataSource={dataSource}
          onChange={onChange}
          pagination={pagination}
          rowKey={rowKey}
          scroll={{ x: "50%" }}
        />
      </ConfigProvider>
    </div>
  );
};

export default Table;
