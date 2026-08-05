/**
 * 2026 세계렘넌트대회(WRC) 가이드 데이터
 *
 * 공식 안내 페이지가 갱신되면 이 파일만 수정하면 됩니다.
 * - 공식 가이드(Notion): https://violet-giant-b6c.notion.site/2026-WRC-64d8f9debf96824b88c781ec098ade2c
 * - 공식 일정표 공지(WEEA): https://www.weea.kr/notice?mod=document&pageid=1&uid=31775
 */
const WRC_DATA = {
  event: {
    number: 29,
    title: '제29차 2026 세계렘넌트대회',
    titleEn: 'The 29th 2026 World Remnant Conference',
    theme: '황제를 살린 영적황제',
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    periodLabel: '2026년 8월 4일(화) ~ 8월 7일(금) · 3박 4일',
    venue: '대구 엑스코(EXCO)',
    host: '세계복음화전도협회(WEEA)',
    coHost: '세계청소년교류연맹',
    scaleNote: '매년 70여 개국, 약 12,000명의 렘넌트가 참여하는 세계 대회',
  },

  // 사전 행사
  preEvents: [
    {
      name: '세계 RT리더수련회',
      period: '2026년 7월 29일 ~ 8월 1일',
      note: '본대회에 앞서 진행되는 리더 수련 과정',
    },
  ],

  // 날짜별 일정 개요.
  // 세부 시간표는 공식 PDF(2026-WRC_시간표.pdf) 기준으로 items를 채워 넣으세요.
  schedule: [
    {
      date: '2026-08-04',
      day: '화',
      label: 'DAY 1',
      headline: '개막식',
      items: [
        { time: '오후', name: '등록 및 입장', place: '엑스코', note: '단체별 안내에 따라 입장' },
        { time: '저녁', name: '개막식 · 개회 메시지', place: '주집회장', note: '' },
      ],
    },
    {
      date: '2026-08-05',
      day: '수',
      label: 'DAY 2',
      headline: '본대회 메시지 1일차',
      items: [
        { time: '오전', name: '오전집회 (메시지 1강)', place: '주집회장', note: '' },
        { time: '오후', name: '특강 · 캠프 프로그램', place: '각 지정 장소', note: '그룹별 진행' },
        { time: '저녁', name: '저녁집회', place: '주집회장', note: '' },
      ],
    },
    {
      date: '2026-08-06',
      day: '목',
      label: 'DAY 3',
      headline: '본대회 메시지 2일차',
      items: [
        { time: '오전', name: '오전집회 (메시지 2강)', place: '주집회장', note: '' },
        { time: '오후', name: '특강 · 캠프 프로그램', place: '각 지정 장소', note: '그룹별 진행' },
        { time: '저녁', name: '저녁집회', place: '주집회장', note: '' },
      ],
    },
    {
      date: '2026-08-07',
      day: '금',
      label: 'DAY 4',
      headline: '본대회 메시지 3일차 · 폐회',
      items: [
        { time: '오전', name: '오전집회 (메시지 3강)', place: '주집회장', note: '' },
        { time: '오후', name: '파송 및 폐회', place: '주집회장', note: '' },
      ],
    },
  ],

  // 세부 시간표가 확정 공지(PDF) 기준인지 여부. false면 화면에 "참고용 개요" 배지가 표시됩니다.
  scheduleConfirmed: false,

  // 등록 그룹 (출생연도 기준)
  registrationGroups: [
    {
      key: 'remnant',
      name: '렘넌트',
      birthYears: [2001, 2013],
      desc: '2001년생 ~ 2013년생 · 대회의 주 참가 대상',
      color: 'var(--accent)',
    },
    {
      key: 'general',
      name: '일반',
      birthYears: [null, 2000],
      desc: '2000년생 이상(2000년 및 그 이전 출생) · 일반 참가자',
      color: 'var(--blue)',
    },
    {
      key: 'children',
      name: '동반자녀',
      birthYears: [2014, 2022],
      desc: '2014년생 ~ 2022년생 · 보호자 동반 등록',
      color: 'var(--green)',
    },
  ],

  venue: {
    name: '엑스코 (EXCO)',
    address: '대구광역시 북구 엑스코로 10',
    subway: '대구 도시철도 엑스코역 하차',
    mapLinks: [
      { name: '카카오맵', url: 'https://map.kakao.com/?q=대구 엑스코' },
      { name: '네이버지도', url: 'https://map.naver.com/p/search/대구 엑스코' },
      { name: '구글지도', url: 'https://www.google.com/maps/search/EXCO+Daegu' },
    ],
    tips: [
      '대회 기간 주차장이 매우 혼잡할 수 있으니 대중교통 이용을 권장합니다.',
      '동대구역(KTX/SRT)에서 지하철·버스·택시로 이동할 수 있습니다.',
      '단체 버스는 안내되는 지정 하차 구역을 이용하세요.',
    ],
  },

  checklist: [
    '참가 등록 확인 (본인 그룹 확인)',
    '성경, 필기구, 메시지 노트',
    '명찰/등록증 (배부 시 항상 패용)',
    '개인 물병 · 더위 대비 용품 (8월 한여름 진행)',
    '편한 신발과 복장',
    '개인 상비약',
    '보조 배터리',
  ],

  faq: [
    {
      q: '누가 참가할 수 있나요?',
      a: '출생연도에 따라 렘넌트(2001~2013년생), 일반(2000년생 이상), 동반자녀(2014~2022년생) 그룹으로 나누어 등록합니다. 위 "등록" 탭에서 내 그룹을 확인해 보세요.',
    },
    {
      q: '리더수련회는 언제인가요?',
      a: '본대회에 앞서 2026년 7월 29일부터 8월 1일까지 세계 RT리더수련회가 진행됩니다.',
    },
    {
      q: '세부 시간표는 어디서 확인하나요?',
      a: 'WEEA 공식 공지사항의 「2026 WRC Schedule 세계렘넌트대회 일정표」 게시글에서 시간표 PDF를 확인할 수 있습니다. 아래 공식 링크를 이용하세요.',
    },
    {
      q: '대회 주제는 무엇인가요?',
      a: "제29차 대회의 주제는 '황제를 살린 영적황제'입니다.",
    },
    {
      q: '숙소와 식사는 어떻게 하나요?',
      a: '숙소·식사는 소속 교회/지역 단체별 안내에 따릅니다. 자세한 내용은 공식 가이드와 소속 인도자에게 확인하세요.',
    },
  ],

  officialLinks: [
    {
      name: '공식 가이드 (Notion)',
      url: 'https://violet-giant-b6c.notion.site/2026-WRC-64d8f9debf96824b88c781ec098ade2c',
      desc: '2026 WRC 안내 페이지',
    },
    {
      name: '일정표 공지 (WEEA)',
      url: 'https://www.weea.kr/notice?mod=document&pageid=1&uid=31775',
      desc: '2026 WRC Schedule 세계렘넌트대회 일정표 (PDF)',
    },
    {
      name: 'WRC 공식 안내',
      url: 'https://wrc.weea.kr/guide/kr.asp',
      desc: '세계렘넌트대회 공식 가이드',
    },
    {
      name: 'WEEA 홈페이지',
      url: 'https://www.weea.kr/',
      desc: '세계복음화전도협회',
    },
  ],

  disclaimer:
    '이 웹앱은 비공식 참가자 가이드입니다. 일부 세부 일정은 공개 보도자료 기준의 참고용 개요이며, 정확한 최신 정보는 반드시 공식 가이드와 WEEA 공지사항을 확인하세요.',
};
