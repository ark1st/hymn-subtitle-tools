# 2026 세계렘넌트대회(WRC) 가이드 웹앱

제29차 2026 세계렘넌트대회(World Remnant Conference) 참가자를 위한 비공식 가이드 웹앱입니다.

- **기간**: 2026년 8월 4일(화) ~ 8월 7일(금) · 3박 4일
- **장소**: 대구 엑스코(EXCO)
- **주제**: "황제를 살린 영적황제" (창 41:38)
- **주최**: 세계복음화전도협회(WEEA)

## 기능

- 대회 개요 및 D-day/진행일차 표시
- 공식 시간표 기반 날짜별 일정 (오늘 날짜 자동 하이라이트)
- 주요 프로그램 안내 (Top Remnant Night, 237-5000 선교 EXPO, 렘망대 특강, 태영아·유아유치·초등망대)
- 공식 가이드 전문: 등록·숙소·교통·식사·안전·의료·팀장·통역·분실물·주차 + 긴급 연락처
- 장소 안내: EXCO 오시는 길, 주요 장소, 공식 약도 이미지
- 준비물 체크리스트 (브라우저에 체크 상태 저장)
- FAQ 및 공식 링크 모음

## 실행

빌드 과정 없이 정적 파일만으로 동작합니다.

```bash
# 로컬에서 열기
open index.html

# 또는 간단한 서버로
python3 -m http.server 8000
```

GitHub Pages에 그대로 배포할 수 있습니다 (Settings → Pages → 브랜치/폴더 선택).

## 데이터 수정

모든 내용은 [`js/data.js`](js/data.js) 한 파일에 들어 있습니다.

`sources/` 폴더에는 근거 자료 원본(공식 시간표 PDF·이미지, Notion 가이드 전체 recordMap JSON,
장소 약도 이미지)이 보관되어 있습니다. 이 실행 환경에서 외부 사이트 접근이 차단되어 있어,
`.github/workflows/fetch-wrc-sources.yml` 워크플로가 GitHub Actions 러너에서 원본을 수집했습니다.

## 출처 및 주의

이 앱의 내용은 아래 공식 자료를 바탕으로 정리한 것입니다.
현장 사정에 따라 변경될 수 있으니 최신 정보는 공식 채널을 확인하세요.

- [2026 WRC 공식 가이드 (Notion)](https://violet-giant-b6c.notion.site/2026-WRC-64d8f9debf96824b88c781ec098ade2c)
- [2026 WRC Schedule 일정표 공지 (WEEA)](https://www.weea.kr/notice?mod=document&pageid=1&uid=31775)
- [WRC 공식 안내 페이지](https://wrc.weea.kr/guide/kr.asp)
- [WEEA 홈페이지](https://www.weea.kr/)
