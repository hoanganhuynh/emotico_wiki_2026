export function normalizeChangeNote(value) {
  const note = String(value ?? '').trim();
  if (!note) throw new Error('Change note is required');
  if (note.length > 200) throw new Error('Change note must be 200 characters or fewer');
  return note;
}

export function publicDocuments(documents) {
  return documents.filter((document) => document.visibility === 'public' && Number.isInteger(document.publishedVersionId));
}

export function publicationSnapshot(document, version) {
  if (document.visibility !== 'public') throw new Error('Only public documents can be published');
  if (/<private-section\b/i.test(version.content)) throw new Error('Public documents cannot include private sections');
  return {
    slug: document.slug,
    versionId: version.id,
    title: version.title,
    content: version.content,
    changeNote: normalizeChangeNote(version.changeNote),
  };
}
