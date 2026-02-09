import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type RecordPayload = {
  date: string;
  weather: string;
  mood: string;
  sections: Record<string, string>;
  uid: string;
};

export async function saveRecord(data: RecordPayload) {
  await addDoc(collection(db, "records"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
