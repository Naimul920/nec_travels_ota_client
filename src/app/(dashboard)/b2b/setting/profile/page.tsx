import React from "react";
import { EditProfile, Fare, Otp, Password } from "@/app/(dashboard)/b2b/_components/Profile";

const Profile: React.FC = () => {
  return (
    <>
      <div className="grid md:grid-cols-3 justify-between my-5">
        <div className="md:col-span-2 md:mx-0 mx-4">
          <EditProfile />
        </div>
        <div className="md:mx-0 mx-4 md:my-0 my-5">
          <Fare />
          <Otp />
        </div>
        <div className="md:mx-0 mx-4 md:my-10">
          <Password />
        </div>
      </div>
    </>
  );
};

export default Profile;
