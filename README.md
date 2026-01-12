# Kanban Board Project

React와 Vite를 활용하여 구축한 칸반 보드 애플리케이션입니다.
Drag & Drop을 통한 직관적인 태스크 관리와 실시간 검증, 전역 에러 핸들링을 통해 견고한 사용자 경험을 제공합니다.

## 실행 방법

### 1. Node.js 요구사항

- **버전**: Node.js `22.x` 이상 권장
- **패키지 매니저**: npm `10.x` 이상

### 2. 설치 및 실행

프로젝트 루트에서 다음 명령어를 순서대로 실행해 주세요.

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Frontend + Mock Server 동시 실행)
npm run dev

# 별도 터미널에서 Mock Server만 실행 필요 시
npm run server
```

## 기술 스택

### Core

- **React 19**: 최신 리액트 기능을 활용한 UI 구축 (Compiler, Actions 등 최신 패턴 적용 준비)
- **TypeScript**: 정적 타입 지원을 통한 안정성 확보
- **Vite**: 빠른 빌드 및 HMR(Hot Module Replacement) 환경 제공

### State Management & Data Fetching

- **TanStack Query (React Query) v5**:
  - 서버 상태(Server State) 관리
  - 캐싱, 자동 재시도, 낙관적 업데이트(Optimistic Updates) 구현
  - 전역 에러 핸들링 연동 (`QueryCache` 구독)

### Styling

- **Emotion (CSS-in-JS)**:
  - 컴포넌트 단위 스타일 캡슐화
  - `Theme` 변수를 활용한 일관된 디자인 시스템 적용

### Etc

- **json-server**: RESTful API Mocking (서버 검증 로직 커스텀 구현)
- **React Icons**: 표준화된 아이콘 사용

## 📂 프로젝트 구조 (Project Structure)

**FSD (Feature-Sliced Design)** 패턴을 일부 차용하여 유지보수성을 극대화했습니다.

```bash
src
├── 📂 features           # 도메인별 기능 단위 (응집도 ▲)
│   ├── 📂 board          # 보드 전체 레이아웃 및 컨테이너
│   ├── 📂 column         # 컬럼 관련 UI 및 로직
│   └── 📂 card           # 카드 관련 UI 및 로직
│
├── 📂 shared             # 재사용 가능한 공통 모듈 (의존성 ▼)
│   ├── 📂 components     # (Button, Input, Modal, Toast 등)
│   ├── 📂 constants      # (메시지, UI 텍스트 상수)
│   ├── 📂 contexts       # (ToastProvider 등)
│   ├── 📂 hooks          # (useInput, useToast 등 Custom Hooks)
│   ├── 📂 utils          # (날짜, 네트워크 등 유틸리티)
│   └── 📂 types          # (공통 타입 정의)
│
├── App.tsx               # 애플리케이션 진입점 (Shell)
└── main.tsx             # React Root 렌더링
```

## 구현 기능

### ✅ 완료된 기능

1. **칸반 보드 구조**
   - 컬럼(Column) 생성, 수정, 삭제
   - 카드(Card) 생성, 수정, 삭제
2. **Drag & Drop**
   - 컬럼 간 순서 이동
   - 컬럼 내/외부로 카드 이동
   - 부드러운 애니메이션 및 드롭 인디케이터(Indicator) UI
3. **입력 검증 (Real-time Validation)**
   - `useInput` 훅을 통한 실시간 유효성 검사
   - 글자 수 제한 및 필수 입력 피드백 (시각적 에러 처리)
4. **전역 에러 핸들링**
   - 네트워크 상태 감지 (Offline, Connection Fail)
   - `GlobalErrorListener`를 통한 중앙 집중식 에러 토스트 처리
   - **Smart Retry**: 네트워크 장애 시에만 '다시 요청' 버튼 활성화
5. **토스트 시스템**
   - `BaseToast` 기반의 확장 가능한 알림 컴포넌트
   - 에러, 경고, 성공 등 상태별 디자인 적용

## 설계 결정 (Design Decisions)

### 1. 상태 관리 전략: Server State vs Client State

데이터의 대부분이 서버(DB)와 동기화되어야 하므로 불필요한 전역 상태 관리 라이브러리(Redux 등) 대신 **TanStack Query**를 메인으로 채택했습니다.

- **Client State**: 모달의 `open` 여부, 현재 드래그 중인 아이템 ID 등은 `useState`와 로컬 드롭다운 컨텍스트로 가볍게 관리했습니다.

### 2. 컴포넌트 설계: Feature-Sliced Design (Partial)

프로젝트 규모를 고려하여 유지보수하기 쉽도록 기능을 기준으로 폴더를 격리했습니다.

- `src/features/column`, `src/features/card` 등 도메인별로 응집도를 높였습니다.
- 공통 로직은 `src/shared`로 분리하여 의존성 방향을 한 곳으로 흐르게 했습니다.

### 3. 낙관적 업데이트 (Optimistic Updates)

사용자 경험(UX)을 극대화하기 위해, 서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 전략을 사용했습니다. 특히 카드 이동(Drag & Drop) 시 딜레이 없는 즉각적인 반응을 제공합니다.

## 개선하고 싶은 점

1. **성능 최적화**
   - 카드가 수백 개 이상 늘어날 경우를 대비해 `react-window` 등을 활용한 가상화(Virtualization) 도입을 고려해볼 수 있습니다.
2. **네트워크 지연 시뮬레이션**
   - 실제 사용자 환경과 유사한 200~500ms의 네트워크 지연을 강제로 주입하여, 로딩 상태나 낙관적 업데이트 등을 더 정밀하게 테스트하지 못한 점이 개선 사항입니다.

🧪 문서를 꼼꼼히 읽었습니다
