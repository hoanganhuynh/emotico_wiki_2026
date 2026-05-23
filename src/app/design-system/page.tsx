export const metadata = {
  title: 'Design System — Emotico',
};

export default function DesignSystemPage() {
  return (
    <div className="flex-1 flex flex-col">
      <iframe
        src="/ds/"
        title="Emotico Design System"
        className="flex-1 w-full border-0"
        style={{ height: 'calc(100vh - 56px)' }}
      />
    </div>
  );
}
