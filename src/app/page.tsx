import Banner from "@/components/banner";
import StudioCategories from "@/components/StudioCategories";
import TopDestinations from "@/components/TopDestinations";
import HowBookingWorks from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Banner />
      <TopDestinations />
      <StudioCategories />
      
      <HowBookingWorks />
      <HostGuarantee />
    </div>
  );
}
