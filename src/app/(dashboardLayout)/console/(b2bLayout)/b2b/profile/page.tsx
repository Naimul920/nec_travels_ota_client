import { EditProfile, Password } from "../_components/Profile";

const Profile: React.FC = () => {
  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-6xl content-center grid-cols-1 gap-6 xl:grid-cols-2">
      <EditProfile />
      <Password />
    </div>
  );
};

export default Profile;