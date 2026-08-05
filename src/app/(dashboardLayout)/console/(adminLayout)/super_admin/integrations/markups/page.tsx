"use client";

import Table from "@/components/common/Table/Table";
import { getCrudConfig } from "@/constant/crudPages";
import { useTablePageData } from "@/hooks/useTablePageData";

export default function Page() {
  const config = getCrudConfig("/console/super_admin/integrations/markups");
  const { data, loading } = useTablePageData(config);

  return (
    <Table
      className="p-3 md:p-0 md:pt-2"
      loading={loading}
      title={config.title}
      columns={config.columns as never}
      dataSource={data}
      rowKey={config.rowKey ?? "id"}
      createButtonText={config.createButtonText ?? "Create"}
      createFields={config.fields}
    />
  );
}

