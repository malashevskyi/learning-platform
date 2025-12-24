import { getLocalizedPath, getSafeRedirect } from "@/app/api/utils/url";
import { i18n } from "@/i18n/config";

describe("getSafeRedirect with locales", () => {
  it("handles locale-prefixed paths", () => {
    expect(getSafeRedirect("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirect("/en/dashboard")).toBe("/dashboard");
    expect(getSafeRedirect("/uk/profile")).toBe("/profile");
    expect(getLocalizedPath("/profile", i18n.defaultLocale)).toBe("/profile");
    expect(getLocalizedPath("/profile", "uk")).toBe("/uk/profile");
  });

  it("blocks malicious locale attempts", () => {
    expect(getSafeRedirect("//evil.com/en/fake")).toBe("/");
  });
});
