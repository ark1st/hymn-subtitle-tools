// GitHub Actions 러너에서 실행: Notion 공개 페이지의 전체 블록을 수집해 JSON으로 저장
// notion-client(비공식 Notion API 클라이언트)로 페이지 전체 recordMap을 가져온다.
import fs from 'node:fs';
import { NotionAPI } from 'notion-client';

const PAGE_ID = '64d8f9de-bf96-824b-88c7-81ec098ade2c';

const api = new NotionAPI({
  apiBaseUrl: 'https://violet-giant-b6c.notion.site/api/v3',
});

const recordMap = await api.getPage(PAGE_ID);
fs.writeFileSync('wrc-2026-guide/sources/notion-full.json', JSON.stringify(recordMap));

const blockCount = Object.keys(recordMap.block || {}).length;
console.log('TOTAL blocks:', blockCount, 'collections:', Object.keys(recordMap.collection || {}).length);
if (blockCount < 60) {
  console.log('WARNING: block count looks low — page may not have loaded fully');
}
