/* 2026 WRC 가이드 웹앱 렌더링 로직 (데이터: js/data.js) */
(function () {
  const D = WRC_DATA;
  const $ = (sel) => document.querySelector(sel);

  /* ---------- D-day 배지 ---------- */
  function renderDday() {
    const badge = $('#dday-badge');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(D.event.startDate + 'T00:00:00');
    const end = new Date(D.event.endDate + 'T00:00:00');
    const dayMs = 86400000;

    if (today < start) {
      const diff = Math.round((start - today) / dayMs);
      badge.textContent = 'D-' + diff;
    } else if (today <= end) {
      const nth = Math.round((today - start) / dayMs) + 1;
      badge.textContent = '대회 진행 중 · ' + nth + '일차';
    } else {
      badge.textContent = '대회 종료';
    }
  }

  /* ---------- 탭 ---------- */
  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        $('#' + tab.dataset.panel).classList.add('active');
        window.scrollTo({ top: 0 });
      });
    });
  }

  /* ---------- 개요 ---------- */
  function renderOverview() {
    const e = D.event;
    $('#fact-period').textContent = e.periodLabel.replace(' · 3박 4일', '');
    $('#fact-venue').textContent = e.venue;

    $('#overview-cards').innerHTML = [
      card('대회명', e.title, e.titleEn, true),
      card('주제', '“' + e.theme + '”', '', true),
      card('기간', e.periodLabel),
      card('장소', e.venue),
      card('주최', e.host),
      card('협력', e.coHost),
      card('규모', e.scaleNote, '', true),
    ].join('');

    $('#pre-events').innerHTML = D.preEvents
      .map(
        (p) =>
          '<div class="card wide"><div class="card-label">' + esc(p.period) + '</div>' +
          '<div class="card-value">' + esc(p.name) + '</div>' +
          '<div class="card-desc">' + esc(p.note) + '</div></div>'
      )
      .join('');

    $('#disclaimer').textContent = D.disclaimer;
    $('#footer-note').textContent = e.title + ' · ' + e.venue;
  }

  function card(label, value, desc, wide) {
    return (
      '<div class="card' + (wide ? ' wide' : '') + '">' +
      '<div class="card-label">' + esc(label) + '</div>' +
      '<div class="card-value">' + esc(value) + '</div>' +
      (desc ? '<div class="card-desc">' + esc(desc) + '</div>' : '') +
      '</div>'
    );
  }

  /* ---------- 일정 ---------- */
  function renderSchedule() {
    $('#schedule-badge').textContent = D.scheduleConfirmed ? '공식 시간표 기준' : '참고용 개요';

    const todayStr = localDateStr(new Date());

    const nav = $('#day-nav');
    const list = $('#schedule-list');

    nav.innerHTML =
      '<button class="day-btn active" data-day="all">전체</button>' +
      D.schedule
        .map(
          (d) =>
            '<button class="day-btn" data-day="' + d.date + '">' +
            esc(d.label) + ' (' + d.date.slice(8) + '일)' +
            '</button>'
        )
        .join('');

    function renderDays(filter) {
      list.innerHTML = D.schedule
        .filter((d) => filter === 'all' || d.date === filter)
        .map((d) => {
          const isToday = d.date === todayStr;
          const items = d.items
            .map(
              (it) =>
                '<div class="sch-item"><div class="sch-time">' + esc(it.time) + '</div>' +
                '<div><div class="sch-name">' + esc(it.name) + '</div>' +
                '<div class="sch-meta">' + esc(it.place) + (it.note ? ' · ' + esc(it.note) : '') + '</div>' +
                '</div></div>'
            )
            .join('');
          return (
            '<div class="day-block"><div class="day-head">' +
            '<span class="day-label">' + esc(d.label) + '</span>' +
            '<span class="day-date">' + formatDate(d.date) + '(' + esc(d.day) + ')</span>' +
            (isToday ? '<span class="day-today">TODAY</span>' : '') +
            '<span class="day-headline">' + esc(d.headline) + '</span>' +
            '</div>' + items + '</div>'
          );
        })
        .join('');
    }

    nav.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.day-btn');
      if (!btn) return;
      nav.querySelectorAll('.day-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderDays(btn.dataset.day);
    });

    renderDays('all');
  }

  /* ---------- 등록 ---------- */
  function renderGroups() {
    $('#group-cards').innerHTML = D.registrationGroups
      .map(
        (g) =>
          '<div class="card group-card" style="border-top-color:' + g.color + '">' +
          '<div class="card-label">' + birthRangeLabel(g) + '</div>' +
          '<div class="card-value">' + esc(g.name) + '</div>' +
          '<div class="card-desc">' + esc(g.desc) + '</div></div>'
      )
      .join('');

    $('#find-group').addEventListener('click', findGroup);
    $('#birth-year').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') findGroup();
    });
  }

  function birthRangeLabel(g) {
    const [from, to] = g.birthYears;
    if (from === null) return to + '년생 및 그 이전';
    return from + '년생 ~ ' + to + '년생';
  }

  function findGroup() {
    const out = $('#finder-result');
    const year = parseInt($('#birth-year').value, 10);
    out.hidden = false;

    if (!year || year < 1900 || year > 2026) {
      out.innerHTML = '올바른 출생연도를 입력해 주세요. (예: 2008)';
      return;
    }

    const g = D.registrationGroups.find((g) => {
      const [from, to] = g.birthYears;
      return (from === null || year >= from) && year <= to;
    });

    if (g) {
      out.innerHTML =
        year + '년생은 <strong>' + esc(g.name) + ' 그룹</strong>으로 등록합니다.<br />' +
        '<span style="font-size:0.85rem;opacity:0.85">' + esc(g.desc) + '</span>';
    } else {
      out.innerHTML =
        year + '년생은 기본 그룹 구분(렘넌트/일반/동반자녀)에 해당하지 않습니다. 소속 인도자 또는 공식 안내처에 문의해 주세요.';
    }
  }

  /* ---------- 오시는 길 ---------- */
  function renderVenue() {
    const v = D.venue;
    $('#venue-card').innerHTML =
      '<h3>' + esc(v.name) + '</h3>' +
      '<p>🏠 ' + esc(v.address) + '</p>' +
      '<p>🚇 ' + esc(v.subway) + '</p>' +
      '<div class="map-links">' +
      v.mapLinks
        .map((m) => '<a href="' + m.url + '" target="_blank" rel="noopener">' + esc(m.name) + ' ↗</a>')
        .join('') +
      '</div>';

    $('#venue-tips').innerHTML = v.tips.map((t) => '<li>' + esc(t) + '</li>').join('');
  }

  /* ---------- 체크리스트 (localStorage 저장) ---------- */
  function renderChecklist() {
    const KEY = 'wrc2026-checklist';
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { /* ignore */ }

    const ul = $('#checklist');
    ul.innerHTML = D.checklist
      .map(
        (item, i) =>
          '<li data-i="' + i + '" class="' + (saved.includes(i) ? 'done' : '') + '">' +
          '<span class="box">' + (saved.includes(i) ? '✓' : '') + '</span>' +
          '<span class="label">' + esc(item) + '</span></li>'
      )
      .join('');

    ul.addEventListener('click', (ev) => {
      const li = ev.target.closest('li');
      if (!li) return;
      const i = parseInt(li.dataset.i, 10);
      const idx = saved.indexOf(i);
      if (idx >= 0) saved.splice(idx, 1);
      else saved.push(i);
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* ignore */ }
      li.classList.toggle('done');
      li.querySelector('.box').textContent = li.classList.contains('done') ? '✓' : '';
    });
  }

  /* ---------- FAQ ---------- */
  function renderFaq() {
    $('#faq-list').innerHTML = D.faq
      .map(
        (f) =>
          '<div class="faq-item"><button class="faq-q">' + esc(f.q) + '</button>' +
          '<div class="faq-a">' + esc(f.a) + '</div></div>'
      )
      .join('');

    $('#faq-list').addEventListener('click', (ev) => {
      const q = ev.target.closest('.faq-q');
      if (q) q.parentElement.classList.toggle('open');
    });
  }

  /* ---------- 공식 링크 ---------- */
  function renderLinks() {
    $('#official-links').innerHTML = D.officialLinks
      .map(
        (l) =>
          '<a href="' + l.url + '" target="_blank" rel="noopener">' +
          '<div class="link-name">' + esc(l.name) + ' ↗</div>' +
          '<div class="link-desc">' + esc(l.desc) + '</div>' +
          '<div class="link-url">' + esc(l.url) + '</div></a>'
      )
      .join('');
  }

  /* ---------- 유틸 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function localDateStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function formatDate(iso) {
    const [y, m, d] = iso.split('-');
    return y + '. ' + Number(m) + '. ' + Number(d) + '.';
  }

  renderDday();
  initTabs();
  renderOverview();
  renderSchedule();
  renderGroups();
  renderVenue();
  renderChecklist();
  renderFaq();
  renderLinks();
})();
