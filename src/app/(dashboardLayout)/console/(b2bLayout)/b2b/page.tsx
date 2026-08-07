import HomeTabs from "../../../../../components/common/Home/HomeTabs";
import HomeSlider from "../../../../../components/common/Home/HomeSlider";
import NoticeMarquee from "../../../../../components/common/NoticeMarquee/NoticeMarquee";

export default function HomePage() {
  return (
    <>
      <div className="mb-5 md:mb-8">
        <NoticeMarquee />
      </div>

      <HomeTabs />

      <div className="mt-10 md:mt-16">
        <HomeSlider />
      </div>
    </>
  );
}
