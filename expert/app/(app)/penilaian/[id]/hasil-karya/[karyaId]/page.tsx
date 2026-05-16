import PageClient from './PageClient';

type Params = Promise<{ id: string; karyaId: string }>;

const AKT_IDS = Array.from({ length: 10 }, (_, i) => `a-${String(i + 1).padStart(3, "0")}`);
const KARYA_IDS = Array.from({ length: 30 }, (_, i) => `k-${String(i + 1).padStart(2, "0")}`);

export function generateStaticParams() {
  return AKT_IDS.flatMap(id => KARYA_IDS.map(karyaId => ({ id, karyaId })));
}

export default function Page({ params }: { params: Params }) {
  return <PageClient params={params} />;
}
