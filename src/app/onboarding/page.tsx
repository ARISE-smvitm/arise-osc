import { requireUser } from "@/lib/session";
import OnboardingForm from "@/components/OnboardingForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Complete your profile — ARISE",
};

export default async function OnboardingPage() {
  const session = await requireUser("/onboarding");
  const editing = Boolean(session.onboardedAt);
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-6 py-16 text-[var(--text-primary)]">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">{editing ? "Edit profile" : "Welcome"}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{editing ? "Keep your profile sharp." : "Tell the community who you are."}</h1>
        <p className="mt-4 max-w-xl text-[var(--text-secondary)]">{editing ? "Update your details below." : "A few details so members can find you. Only your name is required — everything else can be filled in later, and you can skip this entirely."}</p>
        <div className="mt-8">
          <OnboardingForm initial={session} />
        </div>
      </div>
    </main>
  );
}
