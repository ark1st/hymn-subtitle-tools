// GitHub Actions 러너에서 실행: Notion 공개 페이지 전체 + 프로그램 서브페이지 + 지도 이미지 수집
import fs from 'node:fs';
import { NotionAPI } from 'notion-client';

const api = new NotionAPI({
  apiBaseUrl: 'https://violet-giant-b6c.notion.site/api/v3',
});

const MAIN = '64d8f9de-bf96-824b-88c7-81ec098ade2c';
const SUBPAGES = {
  'top-remnant-night': '39d8f9de-bf96-809c-842d-fdaebf04bef1',
  '237-5000-expo': '39d8f9de-bf96-80de-ae31-cbc044411648',
  'bartizan-lecture': '39d8f9de-bf96-8045-b2c2-c40843751e98',
  'remnant-program': '39d8f9de-bf96-80ba-bea5-f9ea0db0c926',
};

fs.mkdirSync('wrc-2026-guide/sources/maps', { recursive: true });

const main = await api.getPage(MAIN);
fs.writeFileSync('wrc-2026-guide/sources/notion-full.json', JSON.stringify(main));
console.log('main blocks:', Object.keys(main.block || {}).length);

// 지도/약도 이미지 다운로드 (signed URL은 발급 직후에만 유효)
for (const [blockId, url] of Object.entries(main.signed_urls || {})) {
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log('img', blockId, res.status); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    const nameMatch = decodeURIComponent(url).match(/\/([^/?]+\.(?:jpg|jpeg|png|gif|webp))/i);
    const name = nameMatch ? nameMatch[1] : blockId + '.bin';
    fs.writeFileSync('wrc-2026-guide/sources/maps/' + name, buf);
    console.log('img saved:', name, buf.length);
  } catch (e) {
    console.log('img', blockId, 'failed:', e.message);
  }
}

for (const [slug, id] of Object.entries(SUBPAGES)) {
  try {
    const page = await api.getPage(id);
    fs.writeFileSync('wrc-2026-guide/sources/notion-' + slug + '.json', JSON.stringify(page));
    console.log(slug, 'blocks:', Object.keys(page.block || {}).length);
    for (const [blockId, url] of Object.entries(page.signed_urls || {})) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        const nameMatch = decodeURIComponent(url).match(/\/([^/?]+\.(?:jpg|jpeg|png|gif|webp))/i);
        const name = nameMatch ? slug + '-' + nameMatch[1] : slug + '-' + blockId + '.bin';
        fs.writeFileSync('wrc-2026-guide/sources/maps/' + name, buf);
        console.log('img saved:', name, buf.length);
      } catch { /* ignore */ }
    }
  } catch (e) {
    console.log(slug, 'failed:', e.message.slice(0, 150));
  }
}
