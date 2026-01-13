import { Suspense } from "react";
import GalleryClient from "./GalleryClient";

export default function GalleryPage() {
  return (
    <Suspense fallback={<p>Loading gallery…</p>}>
      <GalleryClient />
    </Suspense>
  );
}

