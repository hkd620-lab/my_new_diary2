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
 * 하루 기록 저장 (날씨 / 기온 / 기분 / 섹션)
 * - uid + date 기준으로 하루 1문서 유지
 * - 기존 문서가 있으면 sections 병합
 */
export async function saveDailyRecord(data: {
  date: string;
  weather: string;
  temperature: string;
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
    const prev = snap.docs[0].data();

    await updateDoc(ref, {
      weather: data.weather,
      temperature: data.temperature,
      mood: data.mood,
      sections: {
        ...(prev.sections ?? {}),
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
      temperature: data.temperature,
      mood: data.mood,
      sections: data.sections,
      createdAt: Timestamp.now(),
    });
  }
}
