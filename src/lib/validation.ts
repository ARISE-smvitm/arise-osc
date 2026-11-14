import { z } from "zod";

const httpOrHttpsUrl = (max: number) =>
  z.union([
    z.literal(""),
    z.string().trim().max(max).url().refine((value) => {
      try {
        return ["https:", "http:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, "Must be an HTTP(S) URL"),
  ]).optional().default("");

export const profileSchema = z.object({
  githubHandle: z.string().trim().max(39).regex(/^[a-zA-Z0-9-]*$/, "Invalid GitHub handle").optional().default(""),
  image: httpOrHttpsUrl(500),
});

export const newsSchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(100_000),
});

const tagList = z.array(z.string().trim().min(1).max(40)).max(20).optional().default([]);

export const EVENT_TYPES = ["Hackathon", "Workshop", "Open Source Sprint", "Tech Talk"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date (YYYY-MM-DD)");

export const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(140),
  type: z.enum(EVENT_TYPES),
  startsAt: isoDate,
  registrationDeadline: z.union([z.literal(""), isoDate]).optional().default(""),
  venue: z.string().trim().min(1, "Venue is required").max(160),
  organisation: z.string().trim().min(1, "Organisation is required").max(80),
  registrationOpen: z.boolean().optional().default(true),
  description: z.string().trim().max(2000).optional().default(""),
});
export const eventUpdateSchema = eventSchema.partial();

export const onboardingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  githubHandle: z.string().trim().max(39).regex(/^[a-zA-Z0-9-]*$/, "Invalid GitHub handle").optional().default(""),
  college: z.string().trim().max(160).optional().default(""),
  branch: z.string().trim().max(80).optional().default(""),
  year: z.number().int().min(1).max(10).nullable().optional().default(null),
  skills: tagList,
  interests: tagList,
  bio: z.string().trim().max(280).optional().default(""),
  linkedin: httpOrHttpsUrl(200),
  website: httpOrHttpsUrl(200),
});

export function sanitizeImageUrl(value: unknown): string | null {
  const parsed = profileSchema.shape.image.safeParse(value);
  return parsed.success && parsed.data ? parsed.data : null;
}
