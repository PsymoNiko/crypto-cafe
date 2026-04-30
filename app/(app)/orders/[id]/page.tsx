import { Suspense } from "react";

// No static pre‑rendering – but the dynamic route is valid
export async function generateStaticParams() {
  return [];
}

// Client component that will load order data
async function OrderContent({ id }: { id: string }) {
  // Example: load from localStorage (only on client)
  const getOrder = () => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(`order_${id}`);
    return stored ? JSON.parse(stored) : null;
  };

  const order = getOrder();

  if (!order) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="text-muted-foreground mt-2">
          Order ID: <code>{id}</code>
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Menu
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-card rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-muted-foreground mb-4">Order ID: {id}</p>
        {/* Render your order details here */}
        <pre className="bg-muted p-4 rounded text-sm overflow-auto">
          {JSON.stringify(order, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default async function OrderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading order...</div>}>
      <OrderContent id={id} />
    </Suspense>
  );
}