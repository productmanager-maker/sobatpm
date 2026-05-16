import PageClient from './PageClient';

type Params = Promise<{ id: string; pesertaId: string }>;

const PROG_IDS = Array.from({ length: 16 }, (_, i) => `prog-${String(i + 1).padStart(2, "0")}`);
const PESERTA_IDS = Array.from({ length: 30 }, (_, i) => `p-${String(i + 1).padStart(2, "0")}`);

export function generateStaticParams() {
  return PROG_IDS.flatMap(id => PESERTA_IDS.map(pesertaId => ({ id, pesertaId })));
}

export default function Page({ params }: { params: Params }) {
  return <PageClient params={params} />;
}
