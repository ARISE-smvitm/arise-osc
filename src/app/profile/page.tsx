import { demoProfiles } from "@/lib/demo-profiles";
import ProfileCard from "@/components/ProfileCard";

export default function ProfilePage() {
  const profile = demoProfiles[0];
  return (
    <main className="site-page">
      <div className="site-container profile-page">
        <p className="eyebrow">Member profile</p>
        <ProfileCard initialProfile={profile} />
      </div>
    </main>
  );
}
