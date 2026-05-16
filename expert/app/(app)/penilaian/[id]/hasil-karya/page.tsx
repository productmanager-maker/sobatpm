import PageClient from './PageClient';

type Params = Promise<{ id: string }>;

const AKT_IDS = Array.from({ length: 40 }, (_, i) => `a-${String(i + 1).padStart(3, "0")}`);

export function generateStaticParams() {
  return AKT_IDS.map(id => ({ id }));
}

export default function Page({ params }: { params: Params }) {
  return <PageClient params={params} />;
}
