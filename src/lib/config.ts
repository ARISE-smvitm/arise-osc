export function hasDatabaseConfig(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
