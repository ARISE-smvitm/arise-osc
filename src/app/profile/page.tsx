import Link from "next/link";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?callbackUrl=/profile");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const initial = user.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <main className="site-page">
      <div className="site-container member-profile">
        <header className="member-header">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="member-avatar" src={user.image} alt={`${user.name} avatar`} />
          ) : (
            <span className="member-avatar-fallback" aria-hidden="true">{initial}</span>
          )}
          <div className="member-identity">
            <p className="member-id">Member <b>{user.memberId}</b>{user.role === "ADMIN" ? " · ADMIN" : ""}</p>
            <h1 className="member-name">{user.name}</h1>
            <p className="member-handle">
              {user.githubHandle ? (
                <a href={`https://github.com/${user.githubHandle}`} target="_blank" rel="noreferrer">@{user.githubHandle} ↗</a>
              ) : (
                <Link href="/onboarding">Link your GitHub to join the leaderboard →</Link>
              )}
            </p>
          </div>
          <div className="member-header-actions">
            <Link href="/onboarding" className="outline-action">Edit profile</Link>
            <Link href="/dashboard" className="outline-action">Dashboard</Link>
          </div>
        </header>

        <div className="member-grid">
          <div className="member-cell"><span>Contribution score</span><strong>{user.contributionScore}</strong></div>
          <div className="member-cell"><span>College</span>{user.college || "—"}</div>
          <div className="member-cell"><span>Branch</span>{user.branch || "—"}</div>
          <div className="member-cell"><span>Year</span>{user.year ?? "—"}</div>
        </div>

        {user.bio && (
          <section className="member-panel">
            <h2 className="member-heading">Bio</h2>
            <p className="member-bio">{user.bio}</p>
          </section>
        )}

        {(user.skills.length > 0 || user.interests.length > 0) && (
          <section className="member-panel member-panel-split">
            {user.skills.length > 0 && (
              <div>
                <h2 className="member-heading">Skills</h2>
                <div className="member-chips">{user.skills.map((skill) => <span key={skill} className="member-chip">{skill}</span>)}</div>
              </div>
            )}
            {user.interests.length > 0 && (
              <div>
                <h2 className="member-heading">Interests</h2>
                <div className="member-chips">{user.interests.map((interest) => <span key={interest} className="member-chip">{interest}</span>)}</div>
              </div>
            )}
          </section>
        )}

        {(user.linkedin || user.website) && (
          <section className="member-panel">
            <h2 className="member-heading">Links</h2>
            <div className="member-chips">
              {user.linkedin && <a className="member-chip member-chip-link" href={user.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
              {user.website && <a className="member-chip member-chip-link" href={user.website} target="_blank" rel="noreferrer">{user.website.replace(/^https?:\/\//, "")} ↗</a>}
            </div>
          </section>
        )}

        <div className="member-panel member-qr">
          <QRCodeSVG value={`${origin}/member/${user.memberId}`} size={96} includeMargin bgColor="#fffdf5" fgColor="#101010" />
          <div>
            <h2 className="member-heading">ARISE QR</h2>
            <p className="member-bio">Public card at <code>/member/{user.memberId}</code></p>
          </div>
        </div>
      </div>
    </main>
  );
}
