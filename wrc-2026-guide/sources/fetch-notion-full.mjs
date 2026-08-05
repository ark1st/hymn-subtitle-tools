// GitHub Actions 러너에서 실행: Notion 공개 페이지의 전체 블록을 수집해 JSON으로 저장
import fs from 'node:fs';

const BASE = 'https://violet-giant-b6c.notion.site/api/v3';
const PAGE_ID = '64d8f9de-bf96-824b-88c7-81ec098ade2c';

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(path + ' -> ' + res.status + ' ' + (await res.text()).slice(0, 300));
  return res.json();
}

const blocks = {};
const collections = {};

function mergeRecordMap(rm) {
  if (!rm) return;
  for (const [id, rec] of Object.entries(rm.block || {})) {
    const v = rec.value && (rec.value.value || rec.value);
    if (v) blocks[id] = v;
  }
  for (const [id, rec] of Object.entries(rm.collection || {})) {
    const v = rec.value && (rec.value.value || rec.value);
    if (v) collections[id] = v;
  }
}

// 1) loadPageChunk 페이지네이션
let cursor = { stack: [] };
for (let chunk = 0; chunk < 50; chunk++) {
  const data = await post('/loadPageChunk', {
    pageId: PAGE_ID,
    limit: 100,
    cursor,
    chunkNumber: chunk,
    verticalColumns: false,
  });
  mergeRecordMap(data.recordMap);
  cursor = data.cursor;
  console.log('chunk', chunk, 'blocks so far', Object.keys(blocks).length);
  if (!cursor || !cursor.stack || cursor.stack.length === 0) break;
}

// 2) content에 참조됐지만 아직 없는 블록을 syncRecordValues로 보충 (몇 라운드 반복)
for (let round = 0; round < 8; round++) {
  const missing = new Set();
  for (const v of Object.values(blocks)) {
    for (const cid of v.content || []) if (!blocks[cid]) missing.add(cid);
  }
  if (missing.size === 0) break;
  const ids = [...missing].slice(0, 400);
  console.log('round', round, 'missing', missing.size);
  const data = await post('/syncRecordValues', {
    requests: ids.map((id) => ({ pointer: { table: 'block', id }, version: -1 })),
  });
  mergeRecordMap(data.recordMap);
  // 응답에 없던 ID는 무한루프 방지를 위해 표식
  for (const id of ids) if (!blocks[id]) blocks[id] = { id, type: 'unavailable' };
}

// 3) 컬렉션(데이터베이스) 행 수집
for (const [id, v] of Object.entries(blocks)) {
  if (v.type !== 'collection_view' || !v.view_ids) continue;
  const collectionId = v.collection_id || (v.format && v.format.collection_pointer && v.format.collection_pointer.id);
  if (!collectionId) continue;
  try {
    const data = await post('/queryCollection', {
      collection: { id: collectionId, spaceId: v.space_id },
      collectionView: { id: v.view_ids[0], spaceId: v.space_id },
      loader: { type: 'reducer', reducers: { collection_group_results: { type: 'results', limit: 200 } }, searchQuery: '', userTimeZone: 'Asia/Seoul' },
    });
    mergeRecordMap(data.recordMap);
    console.log('collection', collectionId, 'ok');
  } catch (e) {
    console.log('collection', collectionId, 'failed:', e.message.slice(0, 120));
  }
}

fs.writeFileSync('wrc-2026-guide/sources/notion-full.json', JSON.stringify({ blocks, collections }));
console.log('TOTAL blocks:', Object.keys(blocks).length, 'collections:', Object.keys(collections).length);
