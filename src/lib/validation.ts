import { z } from "zod";

export const profileSchema = z.object({
  githubHandle: z.string().trim().max(39).regex(/^[a-zA-Z0-9-]*$/, "Invalid GitHub handle").optional().default(""),
  image: z.string().trim().url().refine((value) => {
    try {
      return ["https:", "http:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Image URL must use HTTP or HTTPS").optional().or(z.literal("")),
});

export const newsSchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(100_000),
});

export function sanitizeImageUrl(value: unknown): string | null {
  const parsed = profileSchema.shape.image.safeParse(value);
  return parsed.success && parsed.data ? parsed.data : null;
}
