"use client";

import { AuthGate } from "@/app/_components/AuthGate";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Post = any;

export default function FeedPage() {
  return (
    <AuthGate>
      {(user)=> <Feed userUid={user.uid} />}
    </AuthGate>
  );
}

function Feed({ userUid }: { userUid: string }) {
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<"public"|"friends">("friends");
  const [file, setFile] = useState<File|null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [me, setMe] = useState<any>(null);

  useEffect(()=>{
    (async ()=>{
      const snap = await getDoc(doc(db, "users", userUid));
      setMe(snap.data());
    })();
  }, [userUid]);

  useEffect(()=>{
    // For simplicity, we read:
    // - public posts
    // - friends posts where viewer is a friend (enforced by rules)
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(100));
    return onSnapshot(q, (snap)=>{
      setPosts(snap.docs.map(d=>({ id: d.id, ...d.data() })));
    });
  }, []);

  async function createPost() {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 280) {
      alert("Max 280 characters.");
      return;
    }
    if (!me) return;

    let imagePath = "";
    if (file) {
      const path = `users/${userUid}/photos/${crypto.randomUUID()}_${file.name}`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      imagePath = path;
    }

    await addDoc(collection(db, "posts"), {
      authorUid: userUid,
      authorName: me?.name || me?.displayName || "Unknown",
      text: trimmed,
      visibility,
      createdAt: serverTimestamp(),
      imagePath: imagePath || null,
    });

    setText("");
    setFile(null);
  }

  async function addFriend(friendUid: string) {
    if (friendUid === userUid) return;
    await setDoc(doc(db, "users", userUid, "friends", friendUid), {
      friendUid,
      createdAt: serverTimestamp(),
    });
    // For mutual friends, user must add back; we keep it simple.
  }

  return (
    <div>
      <h1>Feed</h1>

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Write something… (280 chars max, emojis allowed)"
          rows={4}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label>
            Visibility{" "}
            <select value={visibility} onChange={(e)=>setVisibility(e.target.value as any)}>
              <option value="friends">Friends only</option>
              <option value="public">Public</option>
            </select>
          </label>

          <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
          <button onClick={createPost}>Post</button>
        </div>
      </div>

      <hr />

      {posts.map((p)=>(
        <PostCard key={p.id} post={p} viewerUid={userUid} onAddFriend={addFriend} />
      ))}
    </div>
  );
}

function PostCard({ post, viewerUid, onAddFriend }: { post: any; viewerUid: string; onAddFriend: (uid:string)=>Promise<void> }) {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<number>(0);
  const [likedByMe, setLikedByMe] = useState<boolean>(false);

  useEffect(()=>{
    (async ()=>{
      if (post.imagePath) {
        const url = await getDownloadURL(ref(storage, post.imagePath));
        setImgUrl(url);
      }
    })();
  }, [post.imagePath]);

  useEffect(()=>{
    const cq = query(collection(db, "posts", post.id, "comments"), orderBy("createdAt", "asc"), limit(50));
    return onSnapshot(cq, (snap)=> setComments(snap.docs.map(d=>({ id: d.id, ...d.data() }))));
  }, [post.id]);

  useEffect(()=>{
    const lq = query(collection(db, "posts", post.id, "likes"));
    return onSnapshot(lq, (snap)=>{
      setLikes(snap.size);
      setLikedByMe(snap.docs.some(d=> d.id === viewerUid));
    });
  }, [post.id, viewerUid]);

  async function toggleLike() {
    const likeRef = doc(db, "posts", post.id, "likes", viewerUid);
    const snap = await getDoc(likeRef);
    if (snap.exists()) {
      // unlike
      // deleteDoc imported inline to keep file short
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, { createdAt: serverTimestamp() });
    }
  }

  async function addComment() {
    const t = comment.trim();
    if (!t) return;
    await addDoc(collection(db, "posts", post.id, "comments"), {
      authorUid: viewerUid,
      text: t,
      createdAt: serverTimestamp(),
    });
    setComment("");
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <b>{post.authorName}</b>{" "}
          <span style={{ color: "#666" }}>({post.visibility})</span>
          <div>
            <Link href={`/profile/${post.authorUid}`}>View profile</Link>
          </div>
        </div>
        <button onClick={()=>onAddFriend(post.authorUid)}>Add friend</button>
      </div>

      <p style={{ whiteSpace: "pre-wrap" }}>{post.text}</p>

      {imgUrl && (
        <div>
          <img src={imgUrl} alt="post image" style={{ maxWidth: "100%", borderRadius: 8 }} />
          <div>
            <a href={imgUrl} download>Download image</a>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={toggleLike}>{likedByMe ? "Unlike" : "Like"}</button>
        <span>{likes} likes</span>
      </div>

      <div style={{ marginTop: 10 }}>
        <input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Comment…" />
        <button onClick={addComment}>Send</button>
      </div>

      <div style={{ marginTop: 10 }}>
        {comments.map((c)=>(
          <div key={c.id} style={{ borderTop: "1px solid #eee", paddingTop: 6 }}>
            <small><b>{c.authorUid}</b>: {c.text}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

