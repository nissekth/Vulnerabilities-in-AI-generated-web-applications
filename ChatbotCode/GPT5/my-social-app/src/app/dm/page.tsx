import { Suspense } from "react";
import ClientDmPage from "./ClientDmPage";

export default function DmPage() {
  return (
    <Suspense fallback={<p>Loading messages…</p>}>
      <ClientDmPage />
    </Suspense>
  );
}

