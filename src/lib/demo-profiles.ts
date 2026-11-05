export interface DemoProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  color: string;
}

export const demoProfiles: DemoProfile[] = [
  { id: "ARISE-0042", name: "Aiko Tanaka", handle: "@aiko-builds", avatar: "🛠️", role: "Interface alchemist", color: "#FF2A6D" },
  { id: "ARISE-0137", name: "Rohan Shetty", handle: "@rohan-ship", avatar: "🚀", role: "Release pilot", color: "#9CA3AF" },
  { id: "ARISE-0208", name: "Mira Rao", handle: "@mira-oss", avatar: "🧪", role: "Code explorer", color: "#FF2A6D" },
];
