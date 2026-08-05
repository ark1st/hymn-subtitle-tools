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

  /* ---------- 주요 프로그램 ---------- */
  function renderPrograms() {
    $('#program-list').innerHTML = D.programs
      .map(
        (p) =>
          '<div class="faq-item guide-item"><button class="faq-q"><span>' +
          p.icon + ' ' + esc(p.title) +
          '<span class="prog-when">' + esc(p.when) + '</span></span></button>' +
          '<div class="faq-a"><ul class="guide-items">' +
          p.items.map((i) => '<li>' + esc(i) + '</li>').join('') +
          '</ul></div></div>'
      )
      .join('');

    $('#program-list').addEventListener('click', (ev) => {
      const q = ev.target.closest('.faq-q');
      if (q) q.parentElement.classList.toggle('open');
    });
  }

  /* ---------- 대회 안내 (공식 가이드) ---------- */
  function renderGuide() {
    $('#emergency').innerHTML = D.emergencyContacts
      .map(
        (c) =>
          '<a class="em-card" href="tel:' + c.value.replace(/[^0-9]/g, '') + '">' +
          '<span class="em-label">' + esc(c.label) + '</span>' +
          '<span class="em-value">' + esc(c.value) + '</span></a>'
      )
      .join('');

    $('#guide-list').innerHTML = D.guideSections
      .map((s) => {
        const body = s.groups
          .map((g) => {
            let html = '';
            if (g.heading) html += '<h4 class="guide-h">' + esc(g.heading) + '</h4>';
            html += '<ul class="guide-items">' + g.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>';
            if (g.contacts && g.contacts.length) {
              html +=
                '<div class="guide-contacts">' +
                g.contacts.map((c) => '<div>★ ' + esc(c) + '</div>').join('') +
                '</div>';
            }
            return html;
          })
          .join('');
        return (
          '<div class="faq-item guide-item"><button class="faq-q">' +
          s.icon + ' ' + esc(s.title) +
          '</button><div class="faq-a">' + body + '</div></div>'
        );
      })
      .join('');

    $('#guide-list').addEventListener('click', (ev) => {
      const q = ev.target.closest('.faq-q');
      if (q) q.parentElement.classList.toggle('open');
    });
  }

  /* ---------- 장소 ---------- */
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

    $('#venue-places').innerHTML =
      '<div class="places">' +
      v.places
        .map(
          (p) =>
            '<div class="place-row"><span class="place-name">' + esc(p.name) + '</span>' +
            '<span class="place-where">' + esc(p.where) + '</span></div>'
        )
        .join('') +
      '</div>';

    $('#venue-maps').innerHTML = v.maps
      .map(
        (m) =>
          '<figure class="map-fig"><a href="' + m.file + '" target="_blank" rel="noopener">' +
          '<img src="' + m.file + '" alt="' + esc(m.caption) + '" loading="lazy" /></a>' +
          '<figcaption>' + esc(m.caption) + '</figcaption></figure>'
      )
      .join('');

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
  renderPrograms();
  renderGuide();
  renderVenue();
  renderChecklist();
  renderFaq();
  renderLinks();
})();
