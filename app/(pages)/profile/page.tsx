import ProgramSection from "@/components/main/profile-page/program-section";
import ValueVillage from "@/components/main/profile-page/value-village";
import SectionSambutanUstad from "@/components/main/profile-page/section-section";
import ProfilePondok from "@/components/main/profile-page/profile-pondok";


export default function Profile() {
  return (
    <div className="min-h-screen">
      <ProfilePondok/>
      <SectionSambutanUstad/>
      <ValueVillage/>
      <ProgramSection/>
    </div>
  );
}