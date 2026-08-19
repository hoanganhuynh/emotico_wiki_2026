import { requireWikiInternalSession } from '@/lib/wiki-internal-auth';
import InternalSettingsForm from './settings-form';

export default async function InternalSettingsPage() {
  await requireWikiInternalSession('/wiki-internal/settings');
  return <InternalSettingsForm />;
}
