"use client";
import React, { useState } from "react";
import { DatePicker, Card, Row, Col } from "antd";
import FileSearchOutlined from "@ant-design/icons/es/icons/FileSearchOutlined";
import DownloadOutlined from "@ant-design/icons/es/icons/DownloadOutlined";
import { Dayjs } from "dayjs";
import Table from "@/components/common/Table/Table";
import holdTicketsColumns from "@/utils/tableConstant/holdTickets.constant";
import { Button } from "@/components/ui";
import clsx from "clsx";

const { RangePicker } = DatePicker;

const Statement: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [showTable, setShowTable] = useState(false);

  const handleGenerate = () => {
    if (!startDate || !endDate) return;
    setShowTable(true);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 shadow rounded-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Payment Statement
        </h1>
        <p className="text-gray-500">
          View and generate payment statements by date range
        </p>
      </div>

      {/* Filter Card */}
      <Card
        className="shadow-sm rounded-lg mb-5!"
        styles={{ body: { padding: "24px" } }} // Updated here
      >
        <Row gutter={[16, 16]} align="bottom">
          {/* Desktop Range Picker */}
          <Col xs={0} md={12} lg={10}>
            <label className="block mb-2 font-medium text-gray-700">
              Select Date Range
            </label>
            <RangePicker
              className="w-full"
              size="large"
              onChange={(dates) => {
                setStartDate(dates?.[0] || null);
                setEndDate(dates?.[1] || null);
              }}
              format="DD MMM YYYY"
            />
          </Col>

          {/* Mobile Start Date */}
          <Col xs={12} md={0}>
            <label className="block mb-2 font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              className="w-full"
              size="large"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              format="DD MMM YYYY"
            />
          </Col>

          {/* Mobile End Date */}
          <Col xs={12} md={0}>
            <label className="block mb-2 font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              className="w-full"
              size="large"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              format="DD MMM YYYY"
            />
          </Col>

          {/* Generate Button */}
          <Col xs={24} md={6}>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!startDate || !endDate}
              className={clsx(
                "w-full",
                !startDate || !endDate ? "cursor-not-allowed!" : "",
              )}
            >
              <FileSearchOutlined /> Generate Statement
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table Section */}
      {showTable && (
        <Card className="shadow-sm rounded-lg" bodyStyle={{ padding: "0px" }}>
          <div className="px-6 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Statement Result
              </h2>
              <p className="text-sm text-gray-500">
                Showing records from{" "}
                <span className="font-medium">
                  {startDate?.format("DD MMM YYYY")}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {endDate?.format("DD MMM YYYY")}
                </span>
              </p>
            </div>

            {/* Action Buttons (UI only) */}
            <div className="flex gap-2">
              <Button variant="primary">
                <DownloadOutlined size={20} /> Download
              </Button>
            </div>
          </div>

          <Table
            title="Payments"
            columns={holdTicketsColumns}
            pagination={{ pageSize: 20 }}
            dataSource={[]}
            rowKey="sl"
          />
        </Card>
      )}
    </div>
  );
};

export default Statement;
