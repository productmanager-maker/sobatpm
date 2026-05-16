import PageClient from './PageClient';

type Params = Promise<{ id: string }>;

const NOTIF_IDS = Array.from({ length: 10 }, (_, i) => `notif-${String(i + 1).padStart(2, "0")}`);

export function generateStaticParams() {
  return NOTIF_IDS.map(id => ({ id }));
}

export default function Page({ params }: { params: Params }) {
  return <PageClient params={params} />;
}
