import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeVersionName, keepLatestVersions, rollbackVersion } from '../src/lib/wiki-versioning-core.mjs';
import { normalizeChangeNote, publicDocuments, publicationSnapshot } from '../src/lib/wiki-publication-core.mjs';

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

test('requires a concise public change note', () => {
  assert.equal(normalizeChangeNote('  Bổ sung hướng dẫn Check-in  '), 'Bổ sung hướng dẫn Check-in');
  assert.throws(() => normalizeChangeNote(''), /change note/i);
  assert.throws(() => normalizeChangeNote('a'.repeat(201)), /200/i);
});

test('only exposes published public documents', () => {
  const documents = [
    { slug: 'public-page', visibility: 'public', publishedVersionId: 4 },
    { slug: 'draft-page', visibility: 'public', publishedVersionId: null },
    { slug: 'internal-page', visibility: 'internal', publishedVersionId: 8 },
  ];
  assert.deepEqual(publicDocuments(documents), [documents[0]]);
});

test('creates a public snapshot only for public documents', () => {
  assert.deepEqual(
    publicationSnapshot({ slug: 'public-page', visibility: 'public' }, { id: 4, title: 'Trang public', content: '# Nội dung', changeNote: 'Bổ sung hướng dẫn' }),
    { slug: 'public-page', versionId: 4, title: 'Trang public', content: '# Nội dung', changeNote: 'Bổ sung hướng dẫn' },
  );
  assert.throws(
    () => publicationSnapshot({ slug: 'internal-page', visibility: 'internal' }, { id: 8, title: 'Nội bộ', content: '# Bí mật', changeNote: 'Nội bộ' }),
    /public documents/i,
  );
  assert.throws(
    () => publicationSnapshot({ slug: 'wellness', visibility: 'public' }, { id: 9, title: 'Wellness', content: '<private-section section="wellness-details" />', changeNote: 'Cập nhật Wellness' }),
    /private sections/i,
  );
});
