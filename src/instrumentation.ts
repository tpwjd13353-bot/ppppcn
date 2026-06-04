// Next.js 부팅 hook
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { seedAdmin } = await import("./lib/seed-admin");
    await seedAdmin();
  } catch (err) {
    console.error("[instrumentation] seedAdmin failed:", err);
  }
  try {
    const { seedRegionPlatform } = await import("./lib/seed-region-platform");
    await seedRegionPlatform();
  } catch (err) {
    console.error("[instrumentation] seedRegionPlatform failed:", err);
  }
}
