import { SAMPLE_MENU } from "../../menu-data";
import ItemDetailClient from "./item-client";

// Pre‑generate static pages for every menu item
export async function generateStaticParams() {
  return SAMPLE_MENU.map((item) => ({
    id: item.id,
  }));
}

export default async function ItemDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const item = SAMPLE_MENU.find((m) => m.id === id);

  if (!item) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Item not found</h1>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to menu
        </a>
      </div>
    );
  }

  return <ItemDetailClient item={item} />;
}