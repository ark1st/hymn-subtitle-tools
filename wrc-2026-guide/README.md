# 2026 세계렘넌트대회(WRC) 가이드 웹앱

제29차 2026 세계렘넌트대회(World Remnant Conference) 참가자를 위한 비공식 가이드 웹앱입니다.

- **기간**: 2026년 8월 4일(화) ~ 8월 7일(금) · 3박 4일
- **장소**: 대구 엑스코(EXCO)
- **주제**: "황제를 살린 영적황제"
- **주최**: 세계복음화전도협회(WEEA)

## 기능

- 대회 개요 및 D-day/진행일차 표시
- 날짜별 일정 보기 (오늘 날짜 자동 하이라이트)
- 출생연도로 등록 그룹(렘넌트/일반/동반자녀) 찾기
- 오시는 길 (지도 링크, 이동 팁)
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

모든 내용은 [`js/data.js`](js/data.js) 한 파일에 들어 있습니다. 공식 시간표(PDF)가 확인되면
`schedule` 배열의 세부 항목을 채우고 `scheduleConfirmed`를 `true`로 바꾸면
"참고용 개요" 배지가 "공식 시간표 기준"으로 바뀝니다.

## 출처 및 주의

이 앱의 내용은 아래 공개 자료를 바탕으로 정리한 것입니다. 세부 일정 일부는 참고용 개요이며,
정확한 최신 정보는 반드시 공식 채널을 확인하세요.

- [2026 WRC 공식 가이드 (Notion)](https://violet-giant-b6c.notion.site/2026-WRC-64d8f9debf96824b88c781ec098ade2c)
- [2026 WRC Schedule 일정표 공지 (WEEA)](https://www.weea.kr/notice?mod=document&pageid=1&uid=31775)
- [WRC 공식 안내 페이지](https://wrc.weea.kr/guide/kr.asp)
- [WEEA 홈페이지](https://www.weea.kr/)
