import AppSkeleton from "@/components/common/Skeleton/AppSkeleton";

export default function CommonLayoutLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      <AppSkeleton />
    </div>
  );
}