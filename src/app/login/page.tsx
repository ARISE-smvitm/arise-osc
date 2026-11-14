import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in — ARISE",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  // Only same-site paths are allowed — blocks open-redirect abuse like ?callbackUrl=https://evil.com
  const target =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/dashboard";
  return <LoginForm callbackUrl={target} />;
}
