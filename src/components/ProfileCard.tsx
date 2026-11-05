"use client";

import { QRCodeSVG } from "qrcode.react";
import { Check, Edit3, ExternalLink, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { DemoProfile } from "@/lib/demo-profiles";

const avatarOptions = ["🛠️", "🚀", "🧪", "🎨", "🧩", "⚡"];

type EditableProfile = DemoProfile & {
  college: string;
  age: string;
};

export default function ProfileCard({ initialProfile }: { initialProfile: DemoProfile }) {
  const [profile, setProfile] = useState<EditableProfile>({
    ...initialProfile,
    college: "Shri Madhwa Vadiraja Institute of Technology & Management",
    age: "20",
  });
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("arise-demo-profile");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<EditableProfile>;
      setProfile((current) => ({ ...current, ...parsed }));
      setDraft((current) => ({ ...current, ...parsed }));
    } catch {
      window.localStorage.removeItem("arise-demo-profile");
    }
  }, []);

  const save = () => {
    setProfile(draft);
    window.localStorage.setItem("arise-demo-profile", JSON.stringify(draft));
    setEditing(false);
  };

  return (
    <section className="profile-card profile-card-centered">
      <div className="profile-card-topline">
        <p className="eyebrow">ARISE member card</p>
        <button className="profile-edit-button" type="button" onClick={() => setEditing((value) => !value)} aria-expanded={editing}>
          {editing ? <X size={14} /> : <Edit3 size={14} />} {editing ? "Close" : "Edit profile"}
        </button>
      </div>

      <div className="profile-card-identity">
        <span className="profile-page-avatar" role="img" aria-label={`${profile.name} developer avatar`}>{profile.avatar}</span>
        <div className="profile-card-name"><p className="profile-id">{profile.id}</p><h1>{profile.name}</h1><p>{profile.handle}</p></div>
      </div>

      <div className="profile-details">
        <span><strong>College</strong>{profile.college}</span>
        <span><strong>Age</strong>{profile.age || "—"}</span>
        <span><strong>Role</strong>{profile.role}</span>
      </div>

      {editing && (
        <div className="profile-editor" aria-label="Edit profile">
          <label>Profile picture
            <span className="avatar-picker">{avatarOptions.map((avatar) => <button className={draft.avatar === avatar ? "selected" : ""} key={avatar} type="button" onClick={() => setDraft({ ...draft, avatar })} aria-label={`Use ${avatar} avatar`}>{avatar}</button>)}</span>
          </label>
          <label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label>College<input value={draft.college} onChange={(event) => setDraft({ ...draft, college: event.target.value })} /></label>
          <label>Age<input inputMode="numeric" min="1" max="120" type="number" value={draft.age} onChange={(event) => setDraft({ ...draft, age: event.target.value })} /></label>
          <button className="profile-save-button" type="button" onClick={save}><Check size={15} /> Save changes</button>
        </div>
      )}

      <div className="profile-card-code">
        <div className="qr-shell qr-shell-custom" aria-label="ARISE member QR code">
          <div className="qr-shell-label"><span>ARISE ID</span><strong>17</strong></div>
          <span className="qr-orbit qr-orbit-one" aria-hidden="true" />
          <span className="qr-orbit qr-orbit-two" aria-hidden="true" />
          <span className="qr-corner qr-corner-tl" /><span className="qr-corner qr-corner-tr" /><span className="qr-corner qr-corner-bl" /><span className="qr-corner qr-corner-br" />
          <div className="qr-code-surface"><QRCodeSVG value={`https://arise-osc.dev/member/${profile.id}`} size={146} includeMargin bgColor="#fffdf5" fgColor="#101010" /></div>
        </div>
        <div className="qr-copy"><p className="profile-id">ARISE MEMBER / 17</p><p className="profile-card-copy">Scan to open this profile.</p><p className="qr-hint">Identity link · {profile.id}</p></div>
      </div>

      <div className="profile-card-footer"><span><UserRound size={14} /> Community member</span><a href={`https://github.com/${profile.handle.replace("@", "")}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> GitHub profile</a></div>
    </section>
  );
}
