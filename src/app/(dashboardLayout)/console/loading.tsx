import AppSkeleton from "@/components/common/Skeleton/AppSkeleton";

export default function ConsoleLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AppSkeleton />
    </div>
  );
}