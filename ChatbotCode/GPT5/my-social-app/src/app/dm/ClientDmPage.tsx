"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";

type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  createdAt: any;
};

export default function DMPage() {
  const params = useSearchParams();
  const otherUid = params.get("uid");
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user || !otherUid) return;

    const chatId = [user.uid, otherUid].sort().join("_");

    const q = query(
      collection(db, "dms", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Message, "id">),
      }));
      setMessages(all);
    });
  }, [user, otherUid]);

  async function sendMessage() {
    if (!user || !otherUid || !text.trim()) return;

    const chatId = [user.uid, otherUid].sort().join("_");

    await addDoc(collection(db, "dms", chatId, "messages"), {
      from: user.uid,
      to: otherUid,
      text,
      createdAt: serverTimestamp(),
    });

    setText("");
  }

  if (!otherUid) {
    return <p>Select a conversation.</p>;
  }

  return (
    <div>
      <h1>Direct Messages</h1>

      <div>
        {messages.map(m => (
          <div key={m.id}>
            <b>{m.from === user?.uid ? "You" : "Them"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

