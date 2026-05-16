import PageClient from './PageClient';

type Params = Promise<{ id: string }>;

const PROG_IDS = Array.from({ length: 16 }, (_, i) => `prog-${String(i + 1).padStart(2, "0")}`);

export function generateStaticParams() {
  return PROG_IDS.map(id => ({ id }));
}

export default function Page({ params }: { params: Params }) {
  return <PageClient params={params} />;
}
