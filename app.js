(() => {
  "use strict";

  // Type and kind VALUES are Chinese data keys. They are used for matching, colors and
  // filtering. Only the displayed label is translated (see typeName / kindName).
  const TYPE_ORDER = ["運輸竊盜", "劫車", "倉儲竊盜", "追回查獲", "理賠與訴訟"];
  const INCIDENT_TYPES = ["運輸竊盜", "劫車", "倉儲竊盜", "追回查獲"];
  const REPORT_KINDS = ["產業報告", "媒體調查", "保險市場"];
  const CLAIMS_TYPE = "理賠與訴訟";
  const ALL = "全部";
  const TICK_MS = 4500;
  const LANG_KEY = "aicargo.lang";
  const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const TYPE_COLORS = {
    運輸竊盜: "#000F47",
    劫車: "#D92D20",
    倉儲竊盜: "#B54708",
    追回查獲: "#067647",
    理賠與訴訟: "#475569",
  };

  const REPORT_COLORS = {
    產業報告: "#002C77",
    媒體調查: "#BE185D",
    保險市場: "#0E7490",
  };

  const plural = (n, one, many) => (n === 1 ? one : many);

  const I18N = {
    zh: {
      htmlLang: "zh-Hant",
      title: "AI 產品運輸保險事故新聞彙整",
      description: "彙整與 AI 伺服器、GPU 與晶片、資料中心設備相關的運輸事故，以及產業報告與保險市場動態。",
      skip: "跳至內容",
      loading: "資料載入中…",
      teaser: "本頁彙整公開網路資訊，僅供參考，詳見免責聲明",
      updatedLabel: "最後更新：",
      metricsAria: "指標",
      hLatest: "最新事故",
      hTrends: "重點趨勢",
      hMonth: "每月事故件數",
      hTypes: "類型分布",
      hList: "事故明細",
      hReports: "產業報告與保險市場動態",
      hExtra: "延伸閱讀",
      typeFilterAria: "依類型篩選事故",
      kindFilterAria: "依類別篩選報告",
      listNote: "金額以原始報導為準，多為美元；日期標示「約」或月份者，代表來源未公布確切日期。",
      signatureAria: "整理者",
      hMap: "美國事故地圖",
      mapRankAria: "依州別選取事故",
      mapAria: "美國各州事故數地圖",
      mapLoading: "地圖載入中…",
      mapUnavailable: "目前無法載入地圖，其餘內容不受影響，事故仍列於下方明細。",
      mapEmpty: "目前沒有可標示在地圖上的事故。",
      mapStateAria: (name, n) => `${name}，${n} 筆事故`,
      mapSelTitle: (name, n) => `${name}：${n} 筆事故`,
      mapClear: "清除選取",
      mapStateEmpty: "這個州目前沒有收錄的事故。",
      mapLegendScale: "事故數",
      rangeText: (lo, hi) => (lo === hi ? String(lo) : `${lo} 至 ${hi}`),
      mapSolid: "實線：起訖皆為城市座標",
      mapDashed: "虛線：任一端以州中心估計",
      mapOrigin: "空心圓：起點",
      mapDest: "實心圓：終點",
      mapPoint: "圓點：單一地點",
      mapRouteNote: "虛線表示起訖點以州中心估計，非實際路線。所有弧線僅示意起訖兩地，線與點的顏色對應事故類型。",
      mapUnmappedNote: (n) => `${n} 筆未標示（地點不明確、非美國或為法院案件，仍列於下方明細）`,
      mapUnmappedShow: "查看未標示事故",
      mapUnmappedHide: "收合未標示事故",
      mapSrItem: (name, n) => `${name}：${n} 筆事故`,
      types: { 運輸竊盜: "運輸竊盜", 劫車: "劫車", 倉儲竊盜: "倉儲竊盜", 追回查獲: "追回查獲", 理賠與訴訟: "理賠與訴訟" },
      kinds: { 產業報告: "產業報告", 媒體調查: "媒體調查", 保險市場: "保險市場" },
      all: "全部",
      metricIncidents: "已收錄事故",
      monthsUnknown: "月份未明",
      monthRange: (a, b) => `${a} 至 ${b}`,
      summary: (span, n, claims, reports) =>
        `彙整與 AI 伺服器、GPU 與晶片、資料中心設備相關的運輸事故。${span ? `時間涵蓋 ${span}。` : ""}收錄 ${n} 則事故（含 ${claims} 則理賠與訴訟），另整理 ${reports} 則產業報告與保險市場動態，每則均附原始來源連結。`,
      tickerRole: "輪播",
      tickerLabel: "最新事故輪播",
      noIncidents: "目前沒有事故。",
      noMatches: "目前沒有符合的事故。",
      pause: "暫停",
      play: "播放",
      estValue: (v) => `估計價值：${v}`,
      sourceLabel: (site) => `來源：${site}`,
      nth: (i) => `第 ${i} 則`,
      pairSep: "　",
      fieldSep: "｜",
      yearAria: "選擇年份",
      chartAria: (year) => `${year} 年每月事故件數`,
      monthTick: (m) => String(m),
      monthTip: (m) => `${m}月`,
      monthLabel: (key) => key,
      chartNote: (year, plotted, undated) =>
        `${year} 年圖表計入 ${plotted} 則（該年另有 ${undated} 則月份未明未列入）；將游標移到或點選長條可查看當月事故。尚未找到有公開來源的 AI 設備運輸損壞（非竊盜）案例。`,
      monthFuture: (label) => `${label}：尚未到來`,
      monthCount: (label, n) => `${label}：${n} 則事故`,
      monthCountShort: (label, n) => `${label}：${n} 則`,
      countUnit: (n) => `${n} 則`,
      tableCaption: "事故明細",
      cols: ["日期", "地點", "貨物", "類型", "估計價值", "摘要", "來源"],
      loadError: (msg) => `無法載入資料：${msg}。請確認 data/items.json、data/reports.json 與 data/meta.json 可被讀取。`,
      retryLater: "請稍後再試",
      badFormat: "資料格式不正確",
      fmtDate: (s) => s,
    },
    en: {
      htmlLang: "en",
      title: "AI Cargo Transit Insurance Incident News Digest",
      description: "A digest of transit incidents involving AI servers, GPUs and chips, and data center equipment, plus industry reports and insurance market developments.",
      skip: "Skip to content",
      loading: "Loading data...",
      teaser: "This page compiles public information for reference only. See the disclaimer.",
      updatedLabel: "Last updated: ",
      metricsAria: "Key figures",
      hLatest: "Latest incidents",
      hTrends: "Key trends",
      hMonth: "Incidents per month",
      hTypes: "Breakdown by type",
      hList: "Incident details",
      hReports: "Industry reports and insurance market updates",
      hExtra: "Further reading",
      typeFilterAria: "Filter incidents by type",
      kindFilterAria: "Filter reports by category",
      listNote: "Amounts follow the original reports and are mostly in US dollars. Dates marked approximate, or given only as a month, mean the source did not publish an exact date.",
      signatureAria: "Compiler",
      hMap: "US Incident Map",
      mapRankAria: "Select incidents by state",
      mapAria: "Map of incident counts by US state",
      mapLoading: "Loading map...",
      mapUnavailable: "The map is unavailable right now. The rest of the page is unaffected, and the incidents are still listed in the details below.",
      mapEmpty: "There are no incidents that can be shown on the map.",
      mapStateAria: (name, n) => `${name}, ${n} ${plural(n, "incident", "incidents")}`,
      mapSelTitle: (name, n) => `${name}: ${n} ${plural(n, "incident", "incidents")}`,
      mapClear: "Clear selection",
      mapStateEmpty: "No incidents are recorded for this state.",
      mapLegendScale: "Incidents",
      rangeText: (lo, hi) => (lo === hi ? String(lo) : `${lo} to ${hi}`),
      mapSolid: "Solid line: both ends at city coordinates",
      mapDashed: "Dashed line: an end estimated from the state center",
      mapOrigin: "Hollow circle: origin",
      mapDest: "Filled circle: destination",
      mapPoint: "Dot: single location",
      mapRouteNote: "Dashed lines mean the origin or destination is estimated from the state center, not an actual route. All arcs only indicate the two places, and line and dot colors match the incident type.",
      mapUnmappedNote: (n) => `${n} ${plural(n, "incident", "incidents")} not mapped (location unclear, outside the US, or a court case; still listed in the details below)`,
      mapUnmappedShow: "View unmapped incidents",
      mapUnmappedHide: "Hide unmapped incidents",
      mapSrItem: (name, n) => `${name}: ${n} ${plural(n, "incident", "incidents")}`,
      types: {
        運輸竊盜: "Cargo theft in transit",
        劫車: "Hijacking",
        倉儲竊盜: "Warehouse theft",
        追回查獲: "Recovery or seizure",
        理賠與訴訟: "Claims and litigation",
      },
      kinds: { 產業報告: "Industry report", 媒體調查: "Media investigation", 保險市場: "Insurance market" },
      all: "All",
      metricIncidents: "Incidents tracked",
      monthsUnknown: "Months not specified",
      monthRange: (a, b) => `${a} to ${b}`,
      summary: (span, n, claims, reports) =>
        `A digest of transit incidents involving AI servers, GPUs and chips, and data center equipment. ${span ? `Coverage runs ${span}. ` : ""}It lists ${n} ${plural(n, "incident", "incidents")} (including ${claims} claims and litigation ${plural(claims, "matter", "matters")}), plus ${reports} industry ${plural(reports, "report", "reports")} and insurance market ${plural(reports, "update", "updates")}, each linked to its original source.`,
      tickerRole: "carousel",
      tickerLabel: "Latest incidents carousel",
      noIncidents: "There are no incidents at the moment.",
      noMatches: "No matching incidents.",
      pause: "Pause",
      play: "Play",
      estValue: (v) => `Est. value: ${v}`,
      sourceLabel: (site) => `Source: ${site}`,
      nth: (i) => `Incident ${i}`,
      pairSep: " · ",
      fieldSep: " | ",
      yearAria: "Select year",
      chartAria: (year) => `Incidents per month in ${year}`,
      monthTick: (m) => MONTHS_EN[m - 1],
      monthTip: (m) => MONTHS_EN[m - 1],
      monthLabel: (key) => `${MONTHS_EN[Number(key.slice(5)) - 1]} ${key.slice(0, 4)}`,
      chartNote: (year, plotted, undated) =>
        `The ${year} chart counts ${plotted} ${plural(plotted, "incident", "incidents")} (${undated} more from ${year} with an unspecified month ${plural(undated, "is", "are")} not included). Hover over or tap a bar to see that month's incidents. No publicly sourced cases of AI equipment damaged in transit (non-theft) have been found.`,
      monthFuture: (label) => `${label}: upcoming`,
      monthCount: (label, n) => `${label}: ${n} ${plural(n, "incident", "incidents")}`,
      monthCountShort: (label, n) => `${label}: ${n} ${plural(n, "incident", "incidents")}`,
      countUnit: (n) => `${n} ${plural(n, "incident", "incidents")}`,
      tableCaption: "Incident details",
      cols: ["Date", "Location", "Cargo", "Type", "Est. value", "Summary", "Source"],
      loadError: (msg) => `Unable to load data: ${msg}. Please check that data/items.json, data/reports.json and data/meta.json can be read.`,
      retryLater: "please try again later",
      badFormat: "Unexpected data format",
      fmtDate: (s) => {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
        return m ? `${MONTHS_EN[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : s;
      },
    },
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- language state -------------------------------------------------------
  function readStoredLang() {
    try {
      const v = window.localStorage.getItem(LANG_KEY);
      return v === "en" || v === "zh" ? v : "";
    } catch (e) {
      return "";
    }
  }

  function initialLang() {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "zh") return q;
    return readStoredLang() || "zh";
  }

  let lang = initialLang();
  let state = null; // { items, reports, meta } once loaded
  let teardownTicker = null;

  const t = () => I18N[lang];

  // Use the English field when lang is en and it is a non-empty string; otherwise Chinese.
  function pick(obj, field, language) {
    if (!obj) return "";
    if (language === "en" && obj.en && typeof obj.en[field] === "string" && obj.en[field].trim()) {
      return obj.en[field];
    }
    const v = obj[field];
    return v == null ? "" : v;
  }
  const pk = (obj, field) => pick(obj, field, lang);

  function typeName(key) {
    return t().types[key] || key;
  }

  // Per-item type label: item.en.type first, then dictionary, then the raw Chinese value.
  function itemTypeName(item, language = lang) {
    if (language !== "en") return item.type;
    const shown = pick(item, "type", "en");
    return shown !== item.type ? shown : I18N.en.types[item.type] || item.type;
  }

  function kindName(key) {
    return t().kinds[key] || key;
  }

  function applyStaticText() {
    const dict = t();
    document.documentElement.lang = dict.htmlLang;
    document.title = dict.title;
    for (const node of document.querySelectorAll("[data-i18n]")) {
      const value = dict[node.dataset.i18n];
      if (typeof value === "string") node.textContent = value;
    }
    for (const node of document.querySelectorAll("[data-i18n-aria]")) {
      const value = dict[node.dataset.i18nAria];
      if (typeof value === "string") node.setAttribute("aria-label", value);
    }
    const description = document.querySelector('meta[name="description"]');
    if (description && !state) description.setAttribute("content", dict.description);
    for (const button of document.querySelectorAll(".lang-switch button")) {
      button.setAttribute("aria-pressed", button.dataset.lang === lang ? "true" : "false");
    }
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* storage unavailable; ignore */
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (e) {
      /* ignore */
    }
    applyStaticText();
    if (state) renderAll();
  }

  // ---- helpers --------------------------------------------------------------
  function inkFor(color) {
    const h = color.replace("#", "");
    const ch = [0, 2, 4].map((i) => {
      const v = parseInt(h.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    const lum = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
    return 1.05 / (lum + 0.05) >= 4.5 ? "#FFFFFF" : "#0F172A";
  }

  function svgEl(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }

  function pulseDot(color) {
    const span = document.createElement("span");
    span.className = "pulse";
    span.style.setProperty("--c", color);
    span.setAttribute("aria-hidden", "true");
    const ring = document.createElement("span");
    ring.className = "ring";
    const core = document.createElement("span");
    core.className = "core";
    span.append(ring, core);
    return span;
  }

  function tag(text, color) {
    const el = document.createElement("span");
    el.className = "tag";
    el.style.background = color;
    el.style.color = inkFor(color);
    el.textContent = text;
    return el;
  }

  function extLink(href, label) {
    if (typeof href === "string" && /^https?:\/\//i.test(href)) {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = label;
      return a;
    }
    const span = document.createElement("span");
    span.textContent = label;
    return span;
  }

  function bySortDesc(list) {
    return list
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        if (a.row.sort < b.row.sort) return 1;
        if (a.row.sort > b.row.sort) return -1;
        return a.index - b.index;
      })
      .map((entry) => entry.row);
  }

  function monthKey(value) {
    return typeof value === "string" && /^\d{4}-\d{2}$/.test(value) ? value : "";
  }

  function yearKey(value) {
    return typeof value === "string" && /^\d{4}/.test(value) ? value.slice(0, 4) : "";
  }

  function yearsInData(items) {
    const years = new Set();
    for (const item of items) {
      const month = monthKey(item.month);
      if (month) years.add(month.slice(0, 4));
      const sortYear = yearKey(item.sort);
      if (sortYear) years.add(sortYear);
    }
    return [...years].sort();
  }

  function monthsOfYear(year) {
    const keys = [];
    for (let month = 1; month <= 12; month += 1) {
      keys.push(`${year}-${String(month).padStart(2, "0")}`);
    }
    return keys;
  }

  function currentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  function monthSpan(items) {
    const keys = items.map((item) => monthKey(item.month)).filter(Boolean).sort();
    if (!keys.length) return "";
    const a = t().monthLabel(keys[0]);
    if (keys[0] === keys[keys.length - 1]) return a;
    return t().monthRange(a, t().monthLabel(keys[keys.length - 1]));
  }

  function applyFormat(template, n) {
    return String(template == null ? "{n}" : template).replaceAll("{n}", String(n));
  }

  function chartNote(items, year) {
    const plotted = items.filter((item) => INCIDENT_TYPES.includes(item.type) && monthKey(item.month).startsWith(`${year}-`)).length;
    const undated = items.filter((item) => !monthKey(item.month) && yearKey(item.sort) === year).length;
    return t().chartNote(year, plotted, undated);
  }

  function countUp(node, target, ms, format) {
    const apply = (value) => {
      node.textContent = format(Math.round(value));
    };
    if (reducedMotion) {
      apply(target);
      return;
    }
    const t0 = performance.now();
    const tick = (now) => {
      if (!node.isConnected) return;
      const p = Math.min(1, (now - t0) / ms);
      apply(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${path} (${response.status})`);
    return response.json();
  }

  function showError(error) {
    const loading = document.getElementById("loading");
    loading.hidden = false;
    const panel = loading.querySelector(".panel");
    panel.removeAttribute("data-i18n");
    panel.textContent = t().loadError(error && error.message ? error.message : t().retryLater);
  }

  // ---- renderers ------------------------------------------------------------
  function renderMetrics(items, headlines) {
    const host = document.getElementById("metrics");
    const enHeads = lang === "en" && state.meta.en && Array.isArray(state.meta.en.headlines) ? state.meta.en.headlines : [];
    const tiles = [
      {
        target: items.length,
        format: (n) => String(n),
        label: t().metricIncidents,
        detail: monthSpan(items) || t().monthsUnknown,
        color: "#000F47",
        ms: 1600,
      },
      ...(Array.isArray(headlines) ? headlines : []).map((tile, i) => {
        const en = enHeads[i] || {};
        return {
          target: Number(tile.target) || 0,
          format: (n) => applyFormat(tile.format, n),
          label: (lang === "en" && en.label) || tile.label || "",
          detail: (lang === "en" && en.detail) || tile.detail || "",
          color: tile.color || "#002C77",
          ms: 1800,
        };
      }),
    ];
    host.replaceChildren();
    for (const tile of tiles) {
      const card = document.createElement("article");
      card.className = "metric";
      card.style.background = tile.color;
      card.style.color = inkFor(tile.color);
      const value = document.createElement("div");
      value.className = "value";
      value.textContent = "0";
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = tile.label;
      const detail = document.createElement("div");
      detail.className = "detail";
      detail.textContent = tile.detail;
      card.append(value, label, detail);
      host.append(card);
      countUp(value, tile.target, tile.ms, tile.format);
    }
  }

  function renderTicker(items) {
    const root = document.getElementById("ticker");
    root.className = "ticker";
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", t().tickerRole);
    root.setAttribute("aria-label", t().tickerLabel);
    root.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.textContent = t().noIncidents;
      root.append(empty);
      return;
    }

    let index = 0;
    let paused = false;
    let timer = 0;
    let startedAt = 0;
    let remaining = TICK_MS;

    teardownTicker = () => {
      window.clearTimeout(timer);
      paused = true;
    };

    const head = document.createElement("div");
    head.className = "ticker-head";
    const counter = document.createElement("span");
    counter.className = "ticker-count";
    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.className = "ticker-pause";
    pauseBtn.textContent = t().pause;
    head.append(pulseDot("#95CAFF"), document.createTextNode(t().tickerLabel), counter, pauseBtn);

    const body = document.createElement("div");
    body.className = "ticker-body";
    const progress = document.createElement("div");
    progress.className = "ticker-progress";
    const dots = document.createElement("div");
    dots.className = "ticker-dots";
    root.append(head, body, progress, dots);

    function restartFill() {
      const next = document.createElement("div");
      next.className = "ticker-progress-fill";
      if (!reducedMotion) next.classList.add("is-run");
      progress.replaceChildren(next);
    }

    function arm(ms) {
      window.clearTimeout(timer);
      if (paused || reducedMotion || items.length < 2) return;
      startedAt = performance.now();
      remaining = ms;
      timer = window.setTimeout(() => {
        index = (index + 1) % items.length;
        show(true);
      }, ms);
    }

    function show(restartTimer) {
      const item = items[index];
      body.replaceChildren();
      body.classList.remove("gx-anim");
      const meta = document.createElement("div");
      meta.className = "ticker-meta";
      const place = document.createElement("span");
      place.className = "ticker-place";
      place.textContent = `${pk(item, "date")}${t().pairSep}${pk(item, "place")}`;
      meta.append(tag(itemTypeName(item), TYPE_COLORS[item.type] || "#0B4BFF"), place);
      const summary = document.createElement("div");
      summary.className = "ticker-summary";
      summary.textContent = pk(item, "summary");
      const foot = document.createElement("div");
      foot.className = "ticker-foot";
      const cargo = document.createElement("span");
      cargo.textContent = pk(item, "cargo");
      const value = document.createElement("span");
      value.textContent = t().estValue(pk(item, "value"));
      const source = extLink(item.url, t().sourceLabel(item.site));
      foot.append(cargo, value, source);
      body.append(meta, summary, foot);
      if (!reducedMotion) {
        body.style.animation = "none";
        void body.offsetWidth;
        body.classList.add("gx-anim");
        body.style.animation = "gx-in 520ms ease-out both";
      }
      counter.textContent = `${index + 1} / ${items.length}`;
      dots.querySelectorAll("button").forEach((button, i) => {
        if (i === index) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
      if (restartTimer) {
        remaining = TICK_MS;
        restartFill();
        arm(TICK_MS);
      }
    }

    items.forEach((item, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", t().nth(i + 1));
      button.title = `${pk(item, "date")}${t().pairSep}${pk(item, "place")}`;
      const mark = document.createElement("span");
      button.append(mark);
      button.addEventListener("click", () => {
        index = i;
        show(true);
      });
      dots.append(button);
    });

    pauseBtn.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.textContent = paused ? t().play : t().pause;
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      root.classList.toggle("is-paused", paused);
      if (paused) {
        window.clearTimeout(timer);
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
      } else {
        arm(remaining || TICK_MS);
      }
    });

    let touchX = null;
    root.addEventListener("touchstart", (event) => {
      touchX = event.changedTouches[0].clientX;
    }, { passive: true });
    root.addEventListener("touchend", (event) => {
      if (touchX == null) return;
      const dx = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 48) return;
      index = (index + (dx < 0 ? 1 : items.length - 1)) % items.length;
      show(true);
    }, { passive: true });

    show(true);
  }

  function renderMonthChart(items) {
    const years = yearsInData(items);
    let year = years[years.length - 1] || "";
    const host = document.getElementById("month-chart");
    const note = document.getElementById("month-note");
    host.replaceChildren();

    const switcher = document.createElement("div");
    switcher.className = "chips year-switch";
    switcher.setAttribute("role", "toolbar");
    switcher.setAttribute("aria-label", t().yearAria);
    const chartBody = document.createElement("div");
    host.append(switcher, chartBody);

    function paintYearButtons() {
      switcher.replaceChildren();
      for (const value of years) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.style.setProperty("--chip", "#0B4BFF");
        button.style.setProperty("--ink-on", "#FFFFFF");
        button.textContent = value;
        button.setAttribute("aria-pressed", value === year ? "true" : "false");
        if (value === year) button.classList.add("is-on");
        button.addEventListener("click", () => {
          if (value === year) return;
          year = value;
          paintYearButtons();
          paintChart();
        });
        switcher.append(button);
      }
    }

    function paintChart() {
      note.textContent = year ? chartNote(items, year) : "";
      const today = currentMonthKey();
      const data = (year ? monthsOfYear(year) : []).map((key) => ({
        key,
        future: key > today,
        items: items.filter((item) => item.month === key && INCIDENT_TYPES.includes(item.type)),
      }));
      chartBody.replaceChildren();
      if (!data.length) return;

      const legend = document.createElement("div");
      legend.className = "legend";
      for (const type of INCIDENT_TYPES) {
        const span = document.createElement("span");
        const dot = document.createElement("i");
        dot.className = "dot";
        dot.style.background = TYPE_COLORS[type];
        span.append(dot, document.createTextNode(typeName(type)));
        legend.append(span);
      }

      const W = 360;
      const H = 188;
      const padX = 6;
      const top = 20;
      const bottom = 28;
      const n = data.length;
      const slot = (W - 2 * padX) / n;
      const bw = Math.max(slot * 0.62, 8);
      const max = Math.max(1, ...data.map((d) => d.items.length));
      const ph = H - top - bottom;

      const svg = svgEl("svg");
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", "100%");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", t().chartAria(year));
      svg.style.fontFamily = "var(--font-figure)";
      svg.style.fontVariantNumeric = "tabular-nums";
      svg.style.fontFeatureSettings = '"tnum" 1';

      const axis = svgEl("line");
      axis.setAttribute("x1", String(padX));
      axis.setAttribute("x2", String(W - padX));
      axis.setAttribute("y1", String(H - bottom));
      axis.setAttribute("y2", String(H - bottom));
      axis.setAttribute("stroke", "#95CAFF");
      svg.append(axis);

      const detail = document.createElement("div");
      detail.className = "month-detail";
      detail.setAttribute("aria-live", "polite");
      const cols = [];

      data.forEach((bucket, i) => {
        const count = bucket.items.length;
        const h = (count / max) * ph;
        const x = padX + i * slot + (slot - bw) / 2;
        const g = svgEl("g");
        g.style.cursor = "pointer";
        const tip = svgEl("title");
        tip.textContent = t().monthTip(Number(bucket.key.slice(5)));
        g.append(tip);
        const grow = svgEl("g");
        grow.setAttribute("class", "bar-grow");
        grow.style.animationDelay = `${i * 40}ms`;
        let yTop = H - bottom;
        for (const type of INCIDENT_TYPES) {
          const k = bucket.items.filter((item) => item.type === type).length;
          if (!k) continue;
          const sh = (k / max) * ph;
          yTop -= sh;
          const rect = svgEl("rect");
          rect.setAttribute("x", String(x));
          rect.setAttribute("y", String(yTop));
          rect.setAttribute("width", String(bw));
          rect.setAttribute("height", String(Math.max(sh - 1, 0)));
          rect.setAttribute("rx", "2");
          rect.setAttribute("fill", TYPE_COLORS[type]);
          grow.append(rect);
        }
        if (count > 0) g.append(grow);

        let label = null;
        if (!bucket.future) {
          label = svgEl("text");
          label.setAttribute("x", String(x + bw / 2));
          label.setAttribute("y", String(count > 0 ? H - bottom - h - 5 : H - bottom - 8));
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("font-size", "11");
          label.textContent = String(count);
          g.append(label);
        }
        const tick = svgEl("text");
        tick.setAttribute("x", String(x + bw / 2));
        tick.setAttribute("y", String(H - 8));
        tick.setAttribute("text-anchor", "middle");
        tick.setAttribute("font-size", "11");
        tick.setAttribute("fill", bucket.future ? "#7A90B0" : "#334155");
        tick.textContent = t().monthTick(Number(bucket.key.slice(5)));
        g.append(tick);
        const hit = svgEl("rect");
        hit.setAttribute("x", String(padX + i * slot));
        hit.setAttribute("y", "0");
        hit.setAttribute("width", String(slot));
        hit.setAttribute("height", String(H));
        hit.setAttribute("fill", "transparent");
        g.append(hit);
        g.addEventListener("mouseenter", () => setActive(i));
        g.addEventListener("click", () => setActive(i));
        svg.append(g);
        cols.push({ grow: count > 0 ? grow : null, label });
      });

      function renderDetail(bucket) {
        detail.replaceChildren();
        const title = document.createElement("div");
        title.className = "month-detail-title";
        const name = t().monthLabel(bucket.key);
        title.textContent = bucket.future ? t().monthFuture(name) : t().monthCount(name, bucket.items.length);
        detail.append(title);
        for (const item of bucket.items) {
          const row = document.createElement("div");
          row.className = "month-item";
          const dot = document.createElement("i");
          dot.className = "dot";
          dot.style.background = TYPE_COLORS[item.type] || "#0B4BFF";
          const text = document.createElement("span");
          const sep = t().fieldSep;
          text.textContent = `${pk(item, "date")}${t().pairSep}${pk(item, "place")}${sep}${pk(item, "cargo")}${sep}${pk(item, "value")}`;
          row.append(dot, text);
          detail.append(row);
        }
      }

      function setActive(i) {
        cols.forEach((col, idx) => {
          const on = idx === i;
          if (col.grow) col.grow.style.opacity = on ? "1" : "0.6";
          if (col.label) col.label.setAttribute("fill", on ? "#0F172A" : "#5C6E8A");
        });
        renderDetail(data[i]);
      }

      const sr = document.createElement("ul");
      sr.className = "sr-only";
      for (const bucket of data) {
        const li = document.createElement("li");
        const name = t().monthLabel(bucket.key);
        li.textContent = bucket.future ? t().monthFuture(name) : t().monthCountShort(name, bucket.items.length);
        sr.append(li);
      }

      chartBody.append(legend, svg, detail, sr);
      let last = data.findIndex((bucket) => !bucket.future);
      if (last < 0) last = 0;
      data.forEach((bucket, i) => {
        if (bucket.items.length > 0) last = i;
      });
      setActive(last);
    }

    paintYearButtons();
    paintChart();
  }

  function renderTrends(meta) {
    const list = document.getElementById("trends");
    list.replaceChildren();
    const en = meta.en && Array.isArray(meta.en.trends) && meta.en.trends.length ? meta.en.trends : null;
    const trends = lang === "en" && en ? en : meta.trends;
    for (const text of trends || []) {
      const li = document.createElement("li");
      li.textContent = text;
      list.append(li);
    }
  }

  function renderTypeBars(items) {
    const bars = TYPE_ORDER.map((type) => {
      const n = items.filter((item) => item.type === type).length;
      return { key: type, label: typeName(type), value: n, display: t().countUnit(n) };
    }).sort((a, b) => b.value - a.value);
    const max = Math.max(1, ...bars.map((bar) => bar.value));
    const host = document.getElementById("type-bars");
    host.replaceChildren();
    bars.forEach((bar, i) => {
      const row = document.createElement("div");
      row.className = "type-row";
      const name = document.createElement("span");
      name.className = "type-name";
      name.textContent = bar.label;
      const track = document.createElement("div");
      track.className = "bar-track";
      const fill = document.createElement("div");
      fill.className = "bar-fill";
      fill.style.width = `${(bar.value / max) * 100}%`;
      fill.style.background = TYPE_COLORS[bar.key] || "#0B4BFF";
      fill.style.animationDelay = `${i * 80}ms`;
      track.append(fill);
      const count = document.createElement("span");
      count.className = "type-count";
      count.textContent = bar.display;
      row.append(name, track, count);
      host.append(row);
    });
  }

  function createIncidentCard(item, language, latest) {
    const L = I18N[language];
    const color = TYPE_COLORS[item.type] || "#0B4BFF";
    const card = document.createElement("article");
    card.className = "incident-card";
    card.style.setProperty("--accent", color);
    const top = document.createElement("div");
    top.className = "card-top";
    const date = document.createElement("span");
    date.className = "date-cell";
    if (item === latest) date.append(pulseDot("#0B4BFF"));
    date.append(document.createTextNode(pick(item, "date", language)));
    top.append(date, tag(itemTypeName(item, language), color));
    const title = document.createElement("h3");
    title.textContent = pick(item, "cargo", language);
    const place = document.createElement("p");
    place.className = "card-summary";
    place.textContent = pick(item, "place", language);
    const value = document.createElement("p");
    value.className = "card-value";
    value.textContent = pick(item, "value", language);
    const summary = document.createElement("p");
    summary.className = "card-summary";
    summary.textContent = pick(item, "summary", language);
    const link = extLink(item.url, L.sourceLabel(item.site));
    link.classList.add("card-link");
    card.append(top, title, place, value, summary, link);
    return card;
  }

  function renderIncidents(sorted, latest) {
    const hostChips = document.getElementById("type-chips");
    const cards = document.getElementById("incident-cards");
    const tableWrap = document.getElementById("incident-table-wrap");
    let filter = ALL;
    const options = [
      { value: ALL, label: t().all, count: sorted.length },
      ...TYPE_ORDER.map((type) => ({
        value: type,
        label: typeName(type),
        count: sorted.filter((item) => item.type === type).length,
      })),
    ];

    function drawChips() {
      hostChips.replaceChildren();
      for (const option of options) {
        const color = option.value === ALL ? "#0B4BFF" : (TYPE_COLORS[option.value] || "#0B4BFF");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.style.setProperty("--chip", color);
        button.style.setProperty("--ink-on", inkFor(color));
        button.setAttribute("aria-pressed", option.value === filter ? "true" : "false");
        if (option.value === filter) button.classList.add("is-on");
        const dot = document.createElement("i");
        dot.className = "dot";
        button.append(dot, document.createTextNode(`${option.label} ${option.count}`));
        button.addEventListener("click", () => {
          filter = option.value;
          drawChips();
          drawRows();
        });
        hostChips.append(button);
      }
    }

    function rows() {
      return sorted.filter((item) => filter === ALL || item.type === filter);
    }

    function drawRows() {
      const list = rows();
      cards.replaceChildren();
      tableWrap.replaceChildren();
      if (!list.length) {
        for (const host of [cards, tableWrap]) {
          const empty = document.createElement("p");
          empty.className = "empty";
          empty.textContent = t().noMatches;
          host.append(empty);
        }
        return;
      }

      for (const item of list) {
        cards.append(createIncidentCard(item, lang, latest));
      }

      const table = document.createElement("table");
      const colgroup = document.createElement("colgroup");
      for (const width of ["15%", "14%", "16%", "11%", "13%", "20%", "11%"]) {
        const col = document.createElement("col");
        col.style.width = width;
        colgroup.append(col);
      }
      const caption = document.createElement("caption");
      caption.className = "sr-only";
      caption.textContent = t().tableCaption;
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      for (const name of t().cols) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = name;
        headRow.append(th);
      }
      thead.append(headRow);
      const tbody = document.createElement("tbody");
      for (const item of list) {
        const tr = document.createElement("tr");
        const date = document.createElement("td");
        if (item === latest) date.append(pulseDot("#0B4BFF"));
        date.append(document.createTextNode(pk(item, "date")));
        const place = document.createElement("td");
        place.textContent = pk(item, "place");
        const cargo = document.createElement("td");
        cargo.textContent = pk(item, "cargo");
        const type = document.createElement("td");
        const typeSpan = document.createElement("span");
        typeSpan.className = "type-cell";
        const dot = document.createElement("i");
        dot.className = "dot";
        dot.style.background = TYPE_COLORS[item.type] || "#0B4BFF";
        typeSpan.append(dot, document.createTextNode(itemTypeName(item)));
        type.append(typeSpan);
        const value = document.createElement("td");
        value.textContent = pk(item, "value");
        const summary = document.createElement("td");
        summary.textContent = pk(item, "summary");
        const source = document.createElement("td");
        source.append(extLink(item.url, item.site));
        tr.append(date, place, cargo, type, value, summary, source);
        tbody.append(tr);
      }
      table.append(colgroup, caption, thead, tbody);
      tableWrap.append(table);
    }

    drawChips();
    drawRows();
  }

  function renderReports(reports) {
    const host = document.getElementById("report-seg");
    const grid = document.getElementById("report-cards");
    const sorted = bySortDesc(reports);
    let kind = ALL;
    const options = [
      { value: ALL, label: t().all, count: reports.length },
      ...REPORT_KINDS.map((name) => ({
        value: name,
        label: kindName(name),
        count: reports.filter((report) => report.kind === name).length,
      })),
    ];

    function draw() {
      host.replaceChildren();
      for (const option of options) {
        const color = option.value === ALL ? "#0B4BFF" : (REPORT_COLORS[option.value] || "#0B4BFF");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.style.setProperty("--chip", color);
        button.style.setProperty("--ink-on", inkFor(color));
        button.setAttribute("aria-pressed", option.value === kind ? "true" : "false");
        if (option.value === kind) button.classList.add("is-on");
        const dot = document.createElement("i");
        dot.className = "dot";
        button.append(dot, document.createTextNode(`${option.label} ${option.count}`));
        button.addEventListener("click", () => {
          kind = option.value;
          draw();
        });
        host.append(button);
      }

      const shown = sorted.filter((report) => kind === ALL || report.kind === kind);
      grid.replaceChildren();
      shown.forEach((report, i) => {
        const color = REPORT_COLORS[report.kind] || "#002C77";
        const card = document.createElement("article");
        card.className = "report-card";
        card.style.setProperty("--accent", color);
        card.style.animationDelay = `${Math.min(i, 14) * 50}ms`;
        const top = document.createElement("div");
        top.className = "report-top";
        const when = document.createElement("span");
        when.textContent = `${pk(report, "date")}${t().pairSep}${pk(report, "scope")}`;
        top.append(tag(kindName(report.kind), color), when);
        const title = document.createElement("h3");
        title.textContent = pk(report, "title");
        const value = document.createElement("p");
        value.className = "report-value";
        value.textContent = pk(report, "value");
        const summary = document.createElement("p");
        summary.className = "report-summary";
        summary.textContent = pk(report, "summary");
        const link = extLink(report.url, t().sourceLabel(report.site));
        link.classList.add("card-link");
        card.append(top, title, value, summary, link);
        grid.append(card);
      });
    }

    draw();
  }

  function renderExtra(sources) {
    const host = document.getElementById("extra-links");
    host.replaceChildren();
    for (const source of sources || []) {
      const card = extLink(source.href, "");
      card.classList.add("link-card");
      card.textContent = "";
      const title = document.createElement("span");
      title.className = "title";
      title.textContent = pk(source, "title");
      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = source.date ? `${source.site}${t().pairSep}${t().fmtDate(source.date)}` : source.site;
      card.append(title, meta);
      host.append(card);
    }
  }

  // ---- US incident map ------------------------------------------------------
  const FIPS_TO_USPS = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE",
    "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
    "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
    "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
    "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
    "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
    "54": "WV", "55": "WI", "56": "WY",
  };

  const STATE_ZH = {
    AL: "阿拉巴馬州", AK: "阿拉斯加州", AZ: "亞利桑那州", AR: "阿肯色州", CA: "加州", CO: "科羅拉多州",
    CT: "康乃狄克州", DE: "德拉瓦州", DC: "華盛頓特區", FL: "佛羅里達州", GA: "喬治亞州", HI: "夏威夷州",
    ID: "愛達荷州", IL: "伊利諾州", IN: "印第安納州", IA: "愛荷華州", KS: "堪薩斯州", KY: "肯塔基州",
    LA: "路易斯安那州", ME: "緬因州", MD: "馬里蘭州", MA: "麻薩諸塞州", MI: "密西根州", MN: "明尼蘇達州",
    MS: "密西西比州", MO: "密蘇里州", MT: "蒙大拿州", NE: "內布拉斯加州", NV: "內華達州", NH: "新罕布夏州",
    NJ: "紐澤西州", NM: "新墨西哥州", NY: "紐約州", NC: "北卡羅來納州", ND: "北達科他州", OH: "俄亥俄州",
    OK: "奧克拉荷馬州", OR: "奧勒岡州", PA: "賓夕法尼亞州", RI: "羅德島州", SC: "南卡羅來納州",
    SD: "南達科他州", TN: "田納西州", TX: "德州", UT: "猶他州", VT: "佛蒙特州", VA: "維吉尼亞州",
    WA: "華盛頓州", WV: "西維吉尼亞州", WI: "威斯康辛州", WY: "懷俄明州",
  };

  const MAP_COUNT_COLORS = ["#95CAFF", "#5B9DF5", "#0B4BFF", "#002C77", "#000F47"];
  const MAP_ZERO = "#E8EEF6";
  const MAP_URL = "data/geo/us-states-albers-10m.json";
  const CITY_URL = "data/geo/city_coords.json";

  let geoPromise = null;
  let mapToken = 0;
  let mapSelected = "";
  let unmappedOpen = false;

  const byId = (id) => document.getElementById(id);

  function svgNode(name, attrs) {
    const node = svgEl(name);
    for (const key of Object.keys(attrs || {})) node.setAttribute(key, String(attrs[key]));
    return node;
  }

  function withTitle(node, text) {
    const title = svgEl("title");
    title.textContent = text;
    node.append(title);
    return node;
  }

  // Cached: the TopoJSON and city lookup are fetched once; language switches reuse them.
  function loadGeo() {
    if (geoPromise) return geoPromise;
    geoPromise = (async () => {
      try {
        if (
          typeof d3 === "undefined" || typeof topojson === "undefined" ||
          !d3.geoPath || !d3.geoAlbersUsa || !topojson.feature
        ) return null;
        const res = await fetch(MAP_URL);
        if (!res.ok) return null;
        const topo = await res.json();
        const features = topojson.feature(topo, topo.objects.states).features || [];
        let cities = {};
        try {
          const cityRes = await fetch(CITY_URL);
          if (cityRes.ok) {
            const json = await cityRes.json();
            cities = (json && json.cities) || {};
          }
        } catch (e) {
          cities = {};
        }
        const path = d3.geoPath();
        const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
        const states = {};
        for (const feature of features) {
          const code = FIPS_TO_USPS[String(feature.id).padStart(2, "0")];
          if (!code) continue;
          const c = path.centroid(feature);
          states[code] = {
            code,
            name: (feature.properties && feature.properties.name) || code,
            d: path(feature) || "",
            center: c && isFinite(c[0]) && isFinite(c[1]) ? c : null,
          };
        }
        if (!Object.keys(states).length) return null;
        return { states, cities, projection };
      } catch (e) {
        return null;
      }
    })();
    return geoPromise;
  }

  function mappedGeo(item) {
    const g = item && item.geo;
    return g && g.mapped === true && Array.isArray(g.states) && g.states.length > 0 ? g : null;
  }

  // City coordinate when available, otherwise the state center flagged as approximate.
  function resolveEnd(geo, end) {
    if (!end || typeof end.state !== "string") return null;
    const st = geo.states[end.state];
    if (!st) return null;
    if (end.city) {
      const c = geo.cities[`${end.city}, ${end.state}`];
      if (c && isFinite(c.lat) && isFinite(c.lon)) {
        const xy = geo.projection([c.lon, c.lat]);
        if (xy && isFinite(xy[0]) && isFinite(xy[1])) return { xy, approx: false };
      }
    }
    return st.center ? { xy: st.center, approx: true } : null;
  }

  function renderUnmapped(items, language, latest) {
    const L = I18N[language];
    const host = byId("map-unmapped");
    host.replaceChildren();
    const list = bySortDesc(items.filter((item) => !mappedGeo(item)));
    if (!list.length) return;
    const note = document.createElement("p");
    note.className = "note map-unmapped-note";
    note.textContent = L.mapUnmappedNote(list.length);
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "chip map-unmapped-toggle";
    toggle.style.setProperty("--chip", "#0B4BFF");
    toggle.setAttribute("aria-controls", "map-unmapped-list");
    const box = document.createElement("div");
    box.id = "map-unmapped-list";
    box.className = "map-list";
    for (const item of list) box.append(createIncidentCard(item, language, latest));
    function paint() {
      toggle.setAttribute("aria-expanded", unmappedOpen ? "true" : "false");
      toggle.textContent = unmappedOpen ? L.mapUnmappedHide : L.mapUnmappedShow;
      box.hidden = !unmappedOpen;
    }
    toggle.addEventListener("click", () => {
      unmappedOpen = !unmappedOpen;
      paint();
    });
    paint();
    host.append(note, toggle, box);
  }

  function legendIcon(kind) {
    const color = "#002C77";
    const svg = svgNode("svg", { width: 28, height: 12, viewBox: "0 0 28 12", "aria-hidden": "true", focusable: "false" });
    if (kind === "solid" || kind === "dashed") {
      const line = svgNode("line", { x1: 1, y1: 6, x2: 27, y2: 6, stroke: color, "stroke-width": 2 });
      if (kind === "dashed") line.setAttribute("stroke-dasharray", "5 4");
      svg.append(line);
    } else if (kind === "origin") {
      svg.append(svgNode("circle", { cx: 14, cy: 6, r: 4.5, fill: "#fff", stroke: color, "stroke-width": 2 }));
    } else {
      svg.append(svgNode("circle", { cx: 14, cy: 6, r: kind === "point" ? 5 : 4.5, fill: color, stroke: "#fff", "stroke-width": 1 }));
    }
    return svg;
  }

  function drawMap(geo, items, language, latest) {
    const L = I18N[language];
    const canvas = byId("map-canvas");
    const legend = byId("map-legend");
    const rank = byId("map-rank");
    const selBox = byId("map-selected");
    const sr = byId("map-sr");
    const status = byId("map-status");

    // Entries: mapped items with at least one state that exists in the TopoJSON.
    const entries = [];
    for (const item of items) {
      const g = mappedGeo(item);
      if (!g) continue;
      const codes = [...new Set(g.states)].filter((c) => typeof c === "string" && geo.states[c]);
      if (codes.length) entries.push({ item, g, codes });
    }
    const counts = {};
    for (const e of entries) for (const c of e.codes) counts[c] = (counts[c] || 0) + 1;
    const max = Math.max(0, ...Object.values(counts));
    if (!max) {
      status.textContent = L.mapEmpty;
      status.hidden = false;
      return;
    }
    if (mapSelected && !geo.states[mapSelected]) mapSelected = "";

    const levels = Math.max(1, Math.min(5, max));
    const palette = levels === 1
      ? [MAP_COUNT_COLORS[2]]
      : Array.from({ length: levels }, (_, i) => MAP_COUNT_COLORS[Math.round((i * 4) / (levels - 1))]);
    const levelOf = (n) => Math.min(levels, Math.ceil((n * levels) / max));
    const fillOf = (n) => (n > 0 ? palette[levelOf(n) - 1] : MAP_ZERO);
    const nameOf = (code) => (language === "en" ? geo.states[code].name : STATE_ZH[code] || geo.states[code].name);

    // ---- SVG ----
    const svg = svgNode("svg", {
      viewBox: "0 0 975 610",
      width: "100%",
      role: "group",
      "aria-label": L.mapAria,
    });
    const gStates = svgNode("g", { class: "map-states" });
    const gOutline = svgNode("g", { class: "map-outline-layer" });
    const gNumbers = svgNode("g", { class: "map-numbers", "aria-hidden": "true" });
    const gMarks = svgNode("g", { class: "map-marks", "aria-hidden": "true" });
    svg.append(gStates, gOutline, gMarks, gNumbers);

    const focusRing = svgNode("path", { class: "map-focus-ring", d: "" });
    gOutline.append(focusRing);
    const paths = {};
    const codes = Object.keys(geo.states);
    for (const code of codes) {
      const st = geo.states[code];
      const n = counts[code] || 0;
      const fill = fillOf(n);
      const p = svgNode("path", {
        d: st.d,
        class: "map-state",
        fill,
        tabindex: "0",
        role: "button",
        "aria-label": L.mapStateAria(nameOf(code), n),
        "aria-pressed": "false",
        "data-state": code,
      });
      p.addEventListener("click", () => toggleState(code));
      p.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
          event.preventDefault();
          toggleState(code);
        }
      });
      // Keyboard focus ring is an overlay stroke (no browser bounding-box outline).
      p.addEventListener("focus", () => {
        let visible = true;
        try {
          visible = p.matches(":focus-visible");
        } catch (e) {
          visible = true;
        }
        focusRing.setAttribute("d", visible ? st.d : "");
      });
      p.addEventListener("blur", () => focusRing.setAttribute("d", ""));
      gStates.append(p);
      paths[code] = p;
      if (n > 0 && st.center) {
        const label = svgNode("text", {
          x: st.center[0],
          y: st.center[1],
          class: "map-count",
          "text-anchor": "middle",
          "dominant-baseline": "central",
        });
        // Dark fills get white digits, light fills get dark digits; a thin halo of the
        // opposite tone keeps the number readable on any level. Inline style wins over CSS.
        const ink = inkFor(fill);
        label.style.fill = ink;
        label.style.stroke = ink === "#FFFFFF" ? "rgba(0, 15, 71, 0.55)" : "rgba(255, 255, 255, 0.75)";
        label.style.strokeWidth = "2.5px";
        label.style.paintOrder = "stroke";
        label.style.strokeLinejoin = "round";
        label.textContent = String(n);
        gNumbers.append(label);
      }
    }
    const outline = svgNode("path", { class: "map-outline", d: "" });
    gOutline.append(outline);

    // Routes and points, oldest first so newer incidents draw on top.
    const seenPoints = {};
    const ordered = [...entries].sort((a, b) => (a.item.sort < b.item.sort ? -1 : a.item.sort > b.item.sort ? 1 : 0));
    for (const { item, g } of ordered) {
      const color = TYPE_COLORS[item.type] || "#0B4BFF";
      const tip = `${pick(item, "date", language)}${L.pairSep}${pick(item, "place", language)}`;
      const related = [...new Set([
        ...g.states,
        g.origin && g.origin.state,
        g.dest && g.dest.state,
        g.point && g.point.state,
      ])].filter((c) => typeof c === "string" && geo.states[c]);
      const mark = svgNode("g", { class: "map-mark", "data-states": related.join(" ") });
      const origin = resolveEnd(geo, g.origin);
      const dest = resolveEnd(geo, g.dest);
      const circle = (xy, attrs, code) => {
        const c = svgNode("circle", Object.assign({ cx: xy[0], cy: xy[1] }, attrs));
        withTitle(c, tip);
        if (code && geo.states[code]) c.addEventListener("click", () => toggleState(code));
        return c;
      };
      if (origin && dest) {
        const dx = dest.xy[0] - origin.xy[0];
        const dy = dest.xy[1] - origin.xy[1];
        const dist = Math.hypot(dx, dy);
        if (dist >= 2) {
          const cx = (origin.xy[0] + dest.xy[0]) / 2;
          const cy = (origin.xy[1] + dest.xy[1]) / 2 - dist * 0.25;
          const line = svgNode("path", {
            d: `M${origin.xy[0]} ${origin.xy[1]} Q${cx} ${cy} ${dest.xy[0]} ${dest.xy[1]}`,
            class: "map-route",
            fill: "none",
            stroke: color,
            "stroke-width": 2,
            "stroke-linecap": "round",
          });
          if (origin.approx || dest.approx) line.setAttribute("stroke-dasharray", "6 4");
          withTitle(line, tip);
          mark.append(line);
        }
        mark.append(
          circle(origin.xy, { r: 4.5, fill: "#fff", stroke: color, "stroke-width": 2 }, g.origin.state),
          circle(dest.xy, { r: 4.5, fill: color, stroke: "#fff", "stroke-width": 1 }, g.dest.state),
        );
      } else if (g.point) {
        const p = resolveEnd(geo, g.point);
        if (p) {
          // Nudge repeated locations so several incidents in one city stay distinguishable.
          const key = `${Math.round(p.xy[0])},${Math.round(p.xy[1])}`;
          const nth = seenPoints[key] || 0;
          seenPoints[key] = nth + 1;
          mark.append(circle([p.xy[0] + nth * 7, p.xy[1] - nth * 7], {
            r: 5, fill: color, "fill-opacity": 0.85, stroke: "#fff", "stroke-width": 1.5,
          }, g.point.state));
        }
      }
      if (mark.childNodes.length) gMarks.append(mark);
    }

    canvas.replaceChildren(svg);

    // ---- legend ----
    legend.replaceChildren();
    const scale = document.createElement("div");
    scale.className = "map-scale";
    const scaleLabel = document.createElement("span");
    scaleLabel.className = "map-scale-label";
    scaleLabel.textContent = L.mapLegendScale;
    scale.append(scaleLabel);
    const swatch = (color, text) => {
      const s = document.createElement("span");
      s.className = "map-swatch";
      const i = document.createElement("i");
      i.style.background = color;
      s.append(i, document.createTextNode(text));
      return s;
    };
    scale.append(swatch(MAP_ZERO, "0"));
    for (let level = 1; level <= levels; level += 1) {
      let lo = 0;
      let hi = 0;
      for (let c = 1; c <= max; c += 1) {
        if (levelOf(c) === level) {
          if (!lo) lo = c;
          hi = c;
        }
      }
      scale.append(swatch(palette[level - 1], L.rangeText(lo, hi)));
    }
    const keys = document.createElement("div");
    keys.className = "legend";
    for (const [kind, text] of [["solid", L.mapSolid], ["dashed", L.mapDashed], ["origin", L.mapOrigin], ["dest", L.mapDest], ["point", L.mapPoint]]) {
      const s = document.createElement("span");
      s.append(legendIcon(kind), document.createTextNode(text));
      keys.append(s);
    }
    const typeKeys = document.createElement("div");
    typeKeys.className = "legend";
    for (const type of INCIDENT_TYPES) {
      const s = document.createElement("span");
      const dot = document.createElement("i");
      dot.className = "dot";
      dot.style.background = TYPE_COLORS[type];
      s.append(dot, document.createTextNode(I18N[language].types[type] || type));
      typeKeys.append(s);
    }
    const routeNote = document.createElement("p");
    routeNote.className = "note";
    routeNote.textContent = L.mapRouteNote;
    legend.append(scale, keys, typeKeys, routeNote);

    // ---- state ranking chips ----
    rank.replaceChildren();
    const chipFor = {};
    const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
    for (const code of ranked) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.style.setProperty("--chip", "#0B4BFF");
      button.style.setProperty("--ink-on", "#FFFFFF");
      button.setAttribute("aria-pressed", "false");
      const dot = document.createElement("i");
      dot.className = "dot";
      button.append(dot, document.createTextNode(`${nameOf(code)} ${counts[code]}`));
      button.addEventListener("click", () => toggleState(code));
      rank.append(button);
      chipFor[code] = button;
    }

    // ---- screen reader list ----
    sr.replaceChildren();
    for (const code of ranked) {
      const li = document.createElement("li");
      li.textContent = L.mapSrItem(nameOf(code), counts[code]);
      sr.append(li);
    }

    // ---- selection ----
    function applySelection(scroll) {
      for (const code of Object.keys(paths)) {
        paths[code].setAttribute("aria-pressed", code === mapSelected ? "true" : "false");
      }
      outline.setAttribute("d", mapSelected && geo.states[mapSelected] ? geo.states[mapSelected].d : "");
      for (const code of Object.keys(chipFor)) {
        const on = code === mapSelected;
        chipFor[code].classList.toggle("is-on", on);
        chipFor[code].setAttribute("aria-pressed", on ? "true" : "false");
      }
      for (const mark of gMarks.querySelectorAll(".map-mark")) {
        const hit = !mapSelected || (mark.getAttribute("data-states") || "").split(" ").includes(mapSelected);
        mark.classList.toggle("is-dim", !hit);
      }
      selBox.replaceChildren();
      if (!mapSelected) return;
      const list = bySortDesc(entries.filter((e) => e.codes.includes(mapSelected)).map((e) => e.item));
      const head = document.createElement("div");
      head.className = "map-selected-head";
      const title = document.createElement("h3");
      title.className = "map-selected-title";
      title.textContent = L.mapSelTitle(nameOf(mapSelected), list.length);
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "chip";
      clearBtn.style.setProperty("--chip", "#0B4BFF");
      clearBtn.textContent = L.mapClear;
      clearBtn.addEventListener("click", () => toggleState(mapSelected));
      head.append(title, clearBtn);
      selBox.append(head);
      if (!list.length) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = L.mapStateEmpty;
        selBox.append(empty);
      } else {
        const grid = document.createElement("div");
        grid.className = "map-list";
        for (const item of list) grid.append(createIncidentCard(item, language, latest));
        selBox.append(grid);
      }
      if (scroll) {
        selBox.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
      }
    }

    function toggleState(code) {
      mapSelected = code === mapSelected ? "" : code;
      applySelection(true);
    }

    applySelection(false);
  }

  function renderMap(items, language, latest) {
    const token = ++mapToken;
    const L = I18N[language];
    const status = byId("map-status");
    if (!status) return;
    const setStatus = (text) => {
      status.textContent = text;
      status.hidden = !text;
    };
    renderUnmapped(items, language, latest);
    for (const id of ["map-canvas", "map-legend", "map-rank", "map-selected", "map-sr"]) {
      byId(id).replaceChildren();
    }
    if (!items.some(mappedGeo)) {
      setStatus(L.mapEmpty);
      return;
    }
    setStatus(L.mapLoading);
    loadGeo()
      .then((geo) => {
        if (token !== mapToken) return;
        if (!geo) {
          setStatus(L.mapUnavailable);
          return;
        }
        setStatus("");
        drawMap(geo, items, language, latest);
      })
      .catch(() => {
        if (token === mapToken) setStatus(L.mapUnavailable);
      });
  }

  function renderAll() {
    // Stop the previous carousel timer before it is rebuilt.
    if (teardownTicker) {
      teardownTicker();
      teardownTicker = null;
    }
    const { items, reports, meta } = state;
    const sorted = bySortDesc(items);
    const latestList = sorted.filter((item) => INCIDENT_TYPES.includes(item.type)).slice(0, 6);
    const claims = items.filter((item) => item.type === CLAIMS_TYPE).length;
    const summaryNode = document.getElementById("summary");
    const summaryText = t().summary(monthSpan(items), items.length, claims, reports.length);
    summaryNode.removeAttribute("data-i18n");
    summaryNode.textContent = summaryText;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", summaryText);
    const updated = document.getElementById("updated");
    updated.dateTime = meta.last_updated || "";
    updated.textContent = t().fmtDate(meta.last_updated || "");

    renderMetrics(items, meta.headlines);
    renderTrends(meta);
    renderTicker(latestList);
    renderMonthChart(items);
    renderTypeBars(items);
    renderMap(items, lang, latestList[0] || null);
    renderIncidents(sorted, latestList[0] || null);
    renderReports(reports);
    renderExtra(meta.extra_sources);
  }

  async function boot() {
    const [items, reports, meta] = await Promise.all([
      loadJson("data/items.json"),
      loadJson("data/reports.json"),
      loadJson("data/meta.json"),
    ]);
    if (!Array.isArray(items) || !Array.isArray(reports)) {
      throw new Error(t().badFormat);
    }
    state = { items, reports, meta: meta || {} };
    renderAll();

    document.getElementById("loading").hidden = true;
    const main = document.getElementById("main");
    main.hidden = false;
    main.dataset.ready = "true";
  }

  for (const button of document.querySelectorAll(".lang-switch button")) {
    button.addEventListener("click", () => setLang(button.dataset.lang));
  }
  applyStaticText();
  boot().catch(showError);
})();
