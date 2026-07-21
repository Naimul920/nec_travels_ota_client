"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
// 2. Swapped React Router hook with Next.js App Router navigation hooks
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

const AllSupport: React.FC = () => {
  // 3. Initialized Next.js 16 router engine instance
  const router = useRouter();

  const navigateUrl = (url: string) => {
    // 4. Converted router.push to use Next.js native navigation execution path
    router.push(`/agent/support/${url}`);
  };

  return (
    <div className="md:px-0 px-5 mt-2">
      <h1 className="text-2xl line-clamp-1 font-semibold text-gray-800 ">
        All Request
      </h1>
      <div className="mt-3 grid md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg md:col-span-1 p-5">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateUrl("void")}
                  className="bg-white font-normal! text-black! p-0!"
                >
                  Void
                </Button>
                <p className="text-red-500 font-bold text-lg">0</p>
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateUrl("cancel-open")}
                  className="bg-white font-normal! text-black! p-0!"
                >
                  Cancel & Open
                </Button>
                <p className="text-red-500 font-bold text-lg">0</p>
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateUrl("refund")}
                  className="bg-white font-normal! text-black! p-0!"
                >
                  Refund
                </Button>
                <p className="text-red-500 font-bold text-lg">0</p>
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateUrl("re-issue")}
                  className="bg-white font-normal! text-black! p-0!"
                >
                  Reissue
                </Button>
                <p className="text-red-500 font-bold text-lg">0</p>
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateUrl("add-ssr")}
                  className="bg-white font-normal! text-black! p-0!"
                >
                  Add SSR
                </Button>
                <p className="text-red-500 font-bold text-lg">0</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-white shadow rounded-lg md:col-span-3">
          <ul>
            <li className="border-y-2 border-t-0 border-tertiary/10">
              <div className="grid grid-cols-4">
                <div className="col-span-3 py-3 border-r-2 border-tertiary/10">
                  <p className="text-center text-sm">Void Request</p>
                </div>
                <div className="col-span-1 py-3">
                  <p className="text-center text-sm">0</p>
                </div>
              </div>
            </li>
            <li className="border-y-2 border-t-0 border-tertiary/10">
              <div className="grid grid-cols-4">
                <div className="col-span-3 py-3 border-r-2 border-tertiary/10">
                  <p className="text-center text-sm">Cancel Request</p>
                </div>
                <div className="col-span-1 py-3">
                  <p className="text-center text-sm">0</p>
                </div>
              </div>
            </li>
            <li className="border-y-2 border-t-0 border-tertiary/10">
              <div className="grid grid-cols-4">
                <div className="col-span-3 py-3 border-r-2 border-tertiary/10">
                  <p className="text-center text-sm">Refund Request</p>
                </div>
                <div className="col-span-1 py-3">
                  <p className="text-center text-sm">0</p>
                </div>
              </div>
            </li>
            <li className="border-y-2 border-t-0 border-tertiary/10">
              <div className="grid grid-cols-4">
                <div className="col-span-3 py-3 border-r-2 border-tertiary/10">
                  <p className="text-center text-sm">Reissue Request</p>
                </div>
                <div className="col-span-1 py-3">
                  <p className="text-center text-sm">0</p>
                </div>
              </div>
            </li>
            <li>
              <div className="grid grid-cols-4">
                <div className="col-span-3 py-3 border-r-2 border-tertiary/10">
                  <p className="text-center text-sm">Add SSR Request</p>
                </div>
                <div className="col-span-1 py-3">
                  <p className="text-center text-sm">0</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllSupport;
