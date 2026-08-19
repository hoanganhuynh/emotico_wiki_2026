export function normalizeVersionName(value) {
  const name = String(value ?? '').trim();
  if (!name) throw new Error('Version name is required');
  if (name.length > 120) throw new Error('Version name is too long');
  return name;
}

export function keepLatestVersions(versions, limit = 30) {
  return versions
    .slice()
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, limit);
}

export function rollbackVersion(versions, version, versionName) {
  return [{
    ...version,
    id: `rollback-${Date.now()}`,
    name: normalizeVersionName(versionName),
  }, ...versions];
}
