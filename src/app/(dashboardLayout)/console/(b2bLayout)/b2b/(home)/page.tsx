import HomeTabs from "../../../../../../components/common/Home/HomeTabs";
import HomeSlider from "../../../../../../components/common/Home/HomeSlider";
import NoticeMarquee from "../../../../../../components/common/NoticeMarquee/NoticeMarquee";

export default function B2bHomePage() {
  return (
    <div className="min-w-0 space-y-2 pb-6">
      <NoticeMarquee />
      <HomeTabs variant="dashboard" />
      <HomeSlider />
    </div>
  );
}
