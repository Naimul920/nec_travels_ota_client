import HomeTabs from "../../../../../components/common/Home/HomeTabs";
import HomeSlider from "../../../../../components/common/Home/HomeSlider";
import NoticeMarquee from "../../../../../components/common/NoticeMarquee/NoticeMarquee";

export default function HomePage() {
  return (
    <>
      <NoticeMarquee />
      <HomeTabs />
      <div className="mt-10 md:mt-16 py-10">
        <HomeSlider />
      </div>
    </>
  );
}
