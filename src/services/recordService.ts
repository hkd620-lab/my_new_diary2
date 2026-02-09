import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";

/**
 * 하루 기록 저장 (날씨 / 기분 / 섹션)
 */
export async function saveDailyRecord(data: {
  date: string;
  weather: string;
  mood: string;
  sections: Record<string, string>;
}) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("NOT_AUTHENTICATED");

  const q = query(
    collection(db, "records"),
    where("uid", "==", user.uid),
    where("date", "==", data.date)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    // 기존 문서 업데이트
    const ref = doc(db, "records", snap.docs[0].id);
    await updateDoc(ref, {
      weather: data.weather,
      mood: data.mood,
      sections: {
        ...snap.docs[0].data().sections,
        ...data.sections,
      },
      updatedAt: Timestamp.now(),
    });
  } else {
    // 최초 생성
    await addDoc(collection(db, "records"), {
      uid: user.uid,
      date: data.date,
      weather: data.weather,
      mood: data.mood,
      sections: data.sections,
      createdAt: Timestamp.now(),
    });
  }
}
