import React from "react";
import { Upload, App } from "antd";
import type { UploadProps } from "antd";
import InboxOutlined from "@ant-design/icons/es/icons/InboxOutlined";
import clsx from "clsx";

const { Dragger } = Upload;

interface UploadFileProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}

const UploadFile: React.FC<UploadFileProps> = ({
  value,
  onChange,
  accept = "*",
  maxSizeMB = 5,
  disabled = false,
}) => {
  const { message } = App.useApp();
  const props: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    accept,
    disabled,

    beforeUpload(file) {
      const isValidSize = file.size / 1024 / 1024 < maxSizeMB;
      if (!isValidSize) {
        message.error(`File must be smaller than ${maxSizeMB}MB`);
        return Upload.LIST_IGNORE;
      }

      onChange?.(file);
      return false;
    },
  };

  return (
    <div className="w-full">
      <Dragger
        {...props}
        className={clsx(
          "rounded-xl bg-gray-50 hover:bg-gray-100 transition",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-primary text-3xl" />
        </p>

        <p className="text-base font-medium text-gray-800">
          Click or drag file to upload
        </p>

        <p className="text-sm text-gray-500">
          Supported format: {accept || "Any"} <br />
          Max size: {maxSizeMB}MB
        </p>

        {value && (
          <div className="mt-3 text-sm font-medium text-primary">
            Selected file: {value.name}
          </div>
        )}
      </Dragger>
    </div>
  );
};

export default UploadFile;
