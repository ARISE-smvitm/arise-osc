import { sanitizeImageUrl } from "./validation";

describe("profile URL validation", () => {
  it("rejects javascript URLs", () => {
    expect(sanitizeImageUrl("javascript:alert(1)")).toBeNull();
  });

  it("accepts HTTPS image URLs", () => {
    expect(sanitizeImageUrl("https://cdn.example.com/avatar.png")).toBe("https://cdn.example.com/avatar.png");
  });
});
