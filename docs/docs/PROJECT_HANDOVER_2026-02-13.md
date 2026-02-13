# HARU / SAYU 프로젝트 인수인계 문서

**작성일:** 2026-02-13
**버전 태그:** v0.4.0-stable-write-library

---

# 1. 현재 프로젝트 상태 (STABLE SNAPSHOT)

## ✅ 안정 버전 정보

* Git Tag: `v0.4.0-stable-write-library`
* tar 백업 완료
* Git 커밋 완료
* Router 오류 해결 완료
* Firestore 저장/조회 정상
* 백지 화면 문제 해결 완료

현재 상태는 **기록 저장 및 조회 완전 안정화 단계**.

---

# 2. 현재 정상 작동 범위

## 2-1. 인증

* Firebase Auth 정상
* 로그인 후 보호 라우팅 정상
* AuthGuard 정상 작동
* 로그인 사용자 uid 정상 수신

---

## 2-2. 기록 (Write)

* 날씨 선택 정상
* 체감 선택 정상
* 기분 선택 정상
* 섹션 팝업 입력 정상
* Firestore 저장 정상
* 콘솔 로그 정상 출력
* 저장 후 `/library` 이동 정상

Firestore 저장 로그 확인됨:

* "저장 버튼 클릭됨"
* "Firestore 저장 시도"
* "Firestore 저장 완료"

---

## 2-3. 서재 (Library)

* 날짜 선택 정상
* 오늘 / 어제 버튼 정상
* 특정 날짜 조회 정상
* Firestore where(uid + date) 정상
* 데이터 렌더링 정상

---

## 2-4. 라우터 구조

* BrowserRouter 단일 존재 (App.tsx)
* AppLayout 내부에는 Routes만 존재
* Router 중복 오류 해결
* StrictMode 정상
* 콘솔 에러 없음
* 백지 화면 문제 해결 완료

---

# 3. 프로젝트 구조

```
src/
 ├── App.tsx
 ├── main.tsx
 ├── layouts/
 │    └── AppLayout.tsx
 ├── pages/
 │    ├── Write.tsx
 │    ├── Library.tsx
 │    ├── Essay.tsx
 │    ├── Stats.tsx
 │    ├── Settings.tsx
 │    └── Login.tsx
 ├── components/
 │    ├── TabBar.tsx
 │    └── AuthGuard.tsx
 └── services/
      └── firebase.ts
```

---

# 4. Firestore 구조

## 4-1. records 컬렉션

```json
{
  uid: string,
  date: "YYYY-MM-DD",
  weather: string,
  temperature: string,
  mood: string,
  sections: {
    보람?: string,
    자랑?: string,
    아쉬움?: string,
    감사?: string,
    여백?: string
  },
  createdAt: serverTimestamp
}
```

현재 정상 저장 및 조회 확인 완료.

---

# 5. 미완성 영역 (향후 작업 대상)

## 5-1. AI 연결 (최우선)

현재 상태:

* Firebase Function 존재

  * refineDailyRecord (callable)
* 프론트엔드 호출 미구현

필요 작업:

* Write 저장 후 AI 호출 여부 결정
* Library 화면에 AI 버튼 위치 설계
* Essay 페이지에 AI 결과 렌더링 구조 설계
* essays 컬렉션 설계

---

## 5-2. SAYU 구조 분리

현재:

* HARU와 SAYU 완전 분리되지 않음
* /sayu 라우트 구조 미완성

필요:

* SAYU 독립 라우트
* HARU 기록 목록 직접 노출 금지
* 1줄 요약만 표시 정책
* SAYU는 “사유 전용 공간”으로 분리

---

## 5-3. 에세이 파이프라인 설계

목표 흐름:

1. 7일 records 수집
2. 1차 요약 (Gemini)
3. 5요소 추출

   * subject
   * description
   * association
   * reflection
   * void
4. 최종 수필 생성
5. 사용자 최종 편집
6. essays 컬렉션 저장

현재: 미구현

---

## 5-4. UI 고급화

현재는 MVP 상태.

개선 필요:

* 섹션 하단 밑줄 스타일 개선
* 카드 디자인 고급화
* 에세이 생성 버튼 위치 확정
* 로딩 애니메이션
* 에러 핸들링 구조 개선

---

# 6. 기술 부채 목록

1. Write.tsx 콘솔 로그 과다
2. React Router v7 future flag 경고
3. favicon 404
4. AI 호출 실패 예외 처리 구조 없음
5. Firestore 인덱스 대비 미설계

---

# 7. 다음 단계 우선순위 (관리 전략)

## 1순위

AI 연결 완성
→ refineDailyRecord 프론트 연결

## 2순위

essays 컬렉션 구조 설계

## 3순위

SAYU 완전 독립 라우트 구성

## 4순위

UI 고급화

---

# 8. Claude 인수인계 핵심 메시지

Claude에게 전달할 내용:

> HARU 기록 저장/조회 안정화 완료.
> Router 구조 안정.
> Firestore 정상.
> 이제 AI 파이프라인을 완성해야 함.
> refineDailyRecord callable 함수와 프론트 연결 구현 필요.
> SAYU를 독립 라우트로 완전 분리 예정.
> Gemini 단일 모델 사용 정책.

---

# 9. 복구 지점

문제 발생 시:

```
git checkout v0.4.0-stable-write-library
```

또는

```
git reset --hard v0.4.0-stable-write-library
```

---

# 10. 현재 평가

HARU 1단계 완성.

* 기록 입력 ✔
* 저장 ✔
* 조회 ✔
* 라우팅 안정 ✔
* 백지 오류 해결 ✔

다음 단계는 AI 레이어 구축.

---

**문서 작성 완료**
