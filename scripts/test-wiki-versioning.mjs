import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeVersionName, keepLatestVersions, rollbackVersion } from '../src/lib/wiki-versioning-core.mjs';

test('requires a non-empty version name', () => {
  assert.equal(normalizeVersionName('  Bản cập nhật Wellness  '), 'Bản cập nhật Wellness');
  assert.throws(() => normalizeVersionName('   '), /version name/i);
});

test('keeps only the 30 newest versions', () => {
  const versions = Array.from({ length: 32 }, (_, index) => ({ id: index + 1 }));
  assert.equal(keepLatestVersions(versions, 30).length, 30);
  assert.deepEqual(keepLatestVersions(versions, 30)[0], { id: 32 });
});

test('rollback creates a new version and preserves the old one', () => {
  const versions = [{ id: 7, name: 'Cũ', content: 'old' }];
  const next = rollbackVersion(versions, versions[0], 'Khôi phục bản cũ');
  assert.equal(next[0].name, 'Khôi phục bản cũ');
  assert.equal(next[0].content, 'old');
  assert.equal(next[1].id, 7);
});
