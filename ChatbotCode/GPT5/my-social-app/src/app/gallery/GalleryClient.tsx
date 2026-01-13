"use client";

import { useSearchParams } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";

type Photo = {
  id: string;
  url: string;
};

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    async function load() {
      const q = query(
        collection(db, "photos"),
        where("ownerUid", "==", uid)
      );
      const snap = await getDocs(q);

      const items: Photo[] = await Promise.all(
        snap.docs.map(async d => {
          const path = d.data().storagePath;
          const url = await getDownloadURL(ref(storage, path));
          return { id: d.id, url };
        })
      );

      setPhotos(items);
      setLoading(false);
    }

    load();
  }, [uid]);

  if (!uid) return <p>No user selected.</p>;
  if (loading) return <p>Loading gallery...</p>;

  return (
    <div>
      <h1>User gallery</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {photos.map(p => (
          <img key={p.id} src={p.url} style={{ width: "100%" }} />
        ))}
      </div>
    </div>
  );
}

