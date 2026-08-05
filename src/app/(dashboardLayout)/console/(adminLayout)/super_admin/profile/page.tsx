import React from "react";
import { EditProfile, Password } from "../_components/Profile";

const Profile: React.FC = () => {
  return (
    <>
      <div className="grid md:grid-cols-3 justify-between my-5 max-w-7xl mx-auto py-20 px-5 sm:px-10">
        <div className="md:col-span-2 md:mx-0 mx-4">
          <EditProfile />
        </div>
        <div className="md:mx-0 mx-4">
          <Password />
        </div>
      </div>
    </>
  );
};

export default Profile;