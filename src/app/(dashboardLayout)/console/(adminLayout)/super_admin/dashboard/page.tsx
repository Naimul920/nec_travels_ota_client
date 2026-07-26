"use client";
import { useAuthStore } from "@/store/auth.store";

function Dashboard() {
  const { user, isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn || !user) return <div>Not logged in</div>;

  return (
    <div>
      <p>ID: {user.id}</p>
      <p>Role: {user.role}</p>
      <p>Department: {user.departments}</p>
    </div>
  );
}

export default Dashboard;
