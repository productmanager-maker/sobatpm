import PageClient from './PageClient';

type Params = Promise<{ id: string; pesertaId: string }>;

const AKT_IDS = Array.from({ length: 10 }, (_, i) => `a-${String(i + 1).padStart(3, "0")}`);
const PESERTA_IDS = Array.from({ length: 30 }, (_, i) => `p-${String(i + 1).padStart(2, "0")}`);

export function generateStaticParams() {
  return AKT_IDS.flatMap(id => PESERTA_IDS.map(pesertaId => ({ id, pesertaId })));
}

export default function Page({ params }: { params: Params }) {
  return <PageClient params={params} />;
}
