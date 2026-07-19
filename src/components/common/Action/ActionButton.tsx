"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { Tooltip, Modal, Space } from "antd";
import Swal from "sweetalert2";
// 2. Swapped React Router navigation hook with Next.js App Router navigation hook
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  editContent?: React.ReactNode;
  viewContent?: React.ReactNode;
  isEnd?: boolean;
  handleDelete?: () => void;
  viewLink?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  editContent,
  viewContent,
  isEnd,
  handleDelete,
  viewLink,
}) => {
  // 3. Initialized Next.js native navigation router interface
  const router = useRouter();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleView = () => setIsViewModalOpen(true);
  const handleEdit = () => setIsEditModalOpen(true);

  // 👉 redirect handler
  const handleRedirect = () => {
    if (!viewLink) return;
    // 4. Using Next.js router engine syntax for view routing
    router.push(`${viewLink}`);
  };

  const handleDeleteClick = () => {
    if (!handleDelete) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };

  return (
    <div className={`flex ${isEnd ? "justify-end" : "justify-center"}`}>
      <Space size="small">
        {/* 🔗 Redirect View Button */}
        {viewLink && (
          <Tooltip title="View" color="#000">
            <IoEyeOutline
              size={20}
              className="cursor-pointer text-green-600"
              onClick={handleRedirect}
            />
          </Tooltip>
        )}

        {/* 👁 Modal View Button */}
        {!viewLink && viewContent && (
          <>
            <Tooltip title="View" color="#000">
              <IoEyeOutline
                size={20}
                className="cursor-pointer text-green-600"
                onClick={handleView}
              />
            </Tooltip>

            <Modal
              title="View Details"
              open={isViewModalOpen}
              onCancel={() => setIsViewModalOpen(false)}
              footer={null}
            >
              {viewContent}
            </Modal>
          </>
        )}

        {/* Edit Button */}
        {editContent && (
          <>
            <Tooltip title="Edit" color="#000">
              <AiOutlineEdit
                size={20}
                className="cursor-pointer text-blue-600"
                onClick={handleEdit}
              />
            </Tooltip>

            <Modal
              title="Edit Details"
              open={isEditModalOpen}
              onCancel={() => setIsEditModalOpen(false)}
              footer={null}
            >
              {editContent}
            </Modal>
          </>
        )}

        {/* Delete Button */}
        {handleDelete && (
          <Tooltip title="Delete" color="#000">
            <AiFillDelete
              size={20}
              className="cursor-pointer text-red-600"
              onClick={handleDeleteClick}
            />
          </Tooltip>
        )}
      </Space>
    </div>
  );
};

export default ActionButton;
