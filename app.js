(() => {
  "use strict";

  const TYPE_ORDER = ["運輸竊盜", "劫車", "倉儲竊盜", "追回查獲", "理賠與訴訟"];
  const INCIDENT_TYPES = ["運輸竊盜", "劫車", "倉儲竊盜", "追回查獲"];
  const REPORT_KINDS = ["產業報告", "媒體調查", "保險市場"];
  const TICK_MS = 4500;

  const TYPE_COLORS = {
    運輸竊盜: "#000F47",
    劫車: "#D92D20",
    倉儲竊盜: "#FFBF00",
    追回查獲: "#10B981",
    理賠與訴訟: "#7C3AED",
  };

  const REPORT_COLORS = {
    產業報告: "#002C77",
    媒體調查: "#BE185D",
    保險市場: "#95CAFF",
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (keys[0] === keys[keys.length - 1]) return keys[0];
    return `${keys[0]} 至 ${keys[keys.length - 1]}`;
  }

  function applyFormat(template, n) {
    return String(template == null ? "{n}" : template).replaceAll("{n}", String(n));
  }

  function chartNote(items, year) {
    const plotted = items.filter((item) => INCIDENT_TYPES.includes(item.type) && monthKey(item.month).startsWith(`${year}-`)).length;
    const undated = items.filter((item) => !monthKey(item.month) && yearKey(item.sort) === year).length;
    return `${year} 年圖表計入 ${plotted} 則（該年另有 ${undated} 則月份未明未列入）；將游標移到或點選長條可查看當月事故。尚未找到有公開來源的 AI 設備運輸損壞（非竊盜）案例。`;
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
    const p = Math.min(1, (now - t0) / ms);
    apply(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${path}（${response.status}）`);
    return response.json();
  }

  function showError(error) {
    const loading = document.getElementById("loading");
    loading.hidden = false;
    const panel = loading.querySelector(".panel");
    panel.textContent = `無法載入資料：${error && error.message ? error.message : "請稍後再試"}。請確認 data/items.json、data/reports.json 與 data/meta.json 可被讀取。`;
  }

  function renderMetrics(items, headlines) {
    const host = document.getElementById("metrics");
    const tiles = [
      {
        target: items.length,
        format: (n) => String(n),
        label: "已收錄事故",
        detail: monthSpan(items) || "月份未明",
        color: "#000F47",
        ms: 1600,
      },
      ...(Array.isArray(headlines) ? headlines : []).map((tile) => ({
        target: Number(tile.target) || 0,
        format: (n) => applyFormat(tile.format, n),
        label: tile.label || "",
        detail: tile.detail || "",
        color: tile.color || "#002C77",
        ms: 1800,
      })),
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
    root.setAttribute("aria-roledescription", "輪播");
    root.setAttribute("aria-label", "最新事故輪播");
    root.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.textContent = "目前沒有事故。";
      root.append(empty);
      return;
    }

    let index = 0;
    let paused = false;
    let timer = 0;
    let startedAt = 0;
    let remaining = TICK_MS;

    const head = document.createElement("div");
    head.className = "ticker-head";
    const counter = document.createElement("span");
    counter.className = "ticker-count";
    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.className = "ticker-pause";
    pauseBtn.textContent = "暫停";
    head.append(pulseDot("#95CAFF"), document.createTextNode("最新事故輪播"), counter, pauseBtn);

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
      place.textContent = `${item.date}　${item.place}`;
      meta.append(tag(item.type, TYPE_COLORS[item.type] || "#0B4BFF"), place);
      const summary = document.createElement("div");
      summary.className = "ticker-summary";
      summary.textContent = item.summary;
      const foot = document.createElement("div");
      foot.className = "ticker-foot";
      const cargo = document.createElement("span");
      cargo.textContent = item.cargo;
      const value = document.createElement("span");
      value.textContent = `估計價值：${item.value}`;
      const source = extLink(item.url, `來源：${item.site}`);
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
      button.setAttribute("aria-label", `第 ${i + 1} 則`);
      button.title = `${item.date}　${item.place}`;
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
      pauseBtn.textContent = paused ? "播放" : "暫停";
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
    switcher.setAttribute("aria-label", "選擇年份");
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
        span.append(dot, document.createTextNode(type));
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
      svg.setAttribute("aria-label", `${year} 年每月事故件數`);
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
        tip.textContent = `${Number(bucket.key.slice(5))}月`;
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
        tick.textContent = String(Number(bucket.key.slice(5)));
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
        title.textContent = bucket.future
          ? `${bucket.key}：尚未到來`
          : `${bucket.key}：${bucket.items.length} 則事故`;
        detail.append(title);
        for (const item of bucket.items) {
          const row = document.createElement("div");
          row.className = "month-item";
          const dot = document.createElement("i");
          dot.className = "dot";
          dot.style.background = TYPE_COLORS[item.type] || "#0B4BFF";
          const text = document.createElement("span");
          text.textContent = `${item.date}　${item.place}｜${item.cargo}｜${item.value}`;
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
        li.textContent = bucket.future ? `${bucket.key}：尚未到來` : `${bucket.key}：${bucket.items.length} 則`;
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

  function renderTrends(trends) {
    const list = document.getElementById("trends");
    list.replaceChildren();
    for (const text of trends || []) {
      const li = document.createElement("li");
      li.textContent = text;
      list.append(li);
    }
  }

  function renderTypeBars(items) {
    const bars = TYPE_ORDER.map((type) => {
      const n = items.filter((item) => item.type === type).length;
      return { label: type, value: n, display: `${n} 則` };
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
      fill.style.background = TYPE_COLORS[bar.label] || "#0B4BFF";
      fill.style.animationDelay = `${i * 80}ms`;
      track.append(fill);
      const count = document.createElement("span");
      count.className = "type-count";
      count.textContent = bar.display;
      row.append(name, track, count);
      host.append(row);
    });
  }

  function renderIncidents(sorted, latest) {
    const hostChips = document.getElementById("type-chips");
    const cards = document.getElementById("incident-cards");
    const tableWrap = document.getElementById("incident-table-wrap");
    let filter = "全部";
    const options = [
      { value: "全部", label: "全部", count: sorted.length },
      ...TYPE_ORDER.map((type) => ({
        value: type,
        label: type,
        count: sorted.filter((item) => item.type === type).length,
      })),
    ];

    function drawChips() {
      hostChips.replaceChildren();
      for (const option of options) {
        const color = option.value === "全部" ? "#0B4BFF" : (TYPE_COLORS[option.value] || "#0B4BFF");
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
      return sorted.filter((item) => filter === "全部" || item.type === filter);
    }

    function drawRows() {
      const list = rows();
      cards.replaceChildren();
      tableWrap.replaceChildren();
      if (!list.length) {
        for (const host of [cards, tableWrap]) {
          const empty = document.createElement("p");
          empty.className = "empty";
          empty.textContent = "目前沒有符合的事故。";
          host.append(empty);
        }
        return;
      }

      for (const item of list) {
        const card = document.createElement("article");
        card.className = "incident-card";
        card.style.setProperty("--accent", TYPE_COLORS[item.type] || "#0B4BFF");
        const top = document.createElement("div");
        top.className = "card-top";
        const date = document.createElement("span");
        date.className = "date-cell";
        if (item === latest) date.append(pulseDot("#0B4BFF"));
        date.append(document.createTextNode(item.date));
        top.append(date, tag(item.type, TYPE_COLORS[item.type] || "#0B4BFF"));
        const title = document.createElement("h3");
        title.textContent = item.cargo;
        const place = document.createElement("p");
        place.className = "card-summary";
        place.textContent = item.place;
        const value = document.createElement("p");
        value.className = "card-value";
        value.textContent = item.value;
        const summary = document.createElement("p");
        summary.className = "card-summary";
        summary.textContent = item.summary;
        const link = extLink(item.url, `來源：${item.site}`);
        link.classList.add("card-link");
        card.append(top, title, place, value, summary, link);
        cards.append(card);
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
      caption.textContent = "事故明細";
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      for (const name of ["日期", "地點", "貨物", "類型", "估計價值", "摘要", "來源"]) {
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
        date.append(document.createTextNode(item.date));
        const place = document.createElement("td");
        place.textContent = item.place;
        const cargo = document.createElement("td");
        cargo.textContent = item.cargo;
        const type = document.createElement("td");
        const typeSpan = document.createElement("span");
        typeSpan.className = "type-cell";
        const dot = document.createElement("i");
        dot.className = "dot";
        dot.style.background = TYPE_COLORS[item.type] || "#0B4BFF";
        typeSpan.append(dot, document.createTextNode(item.type));
        type.append(typeSpan);
        const value = document.createElement("td");
        value.textContent = item.value;
        const summary = document.createElement("td");
        summary.textContent = item.summary;
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
    let kind = "全部";
    const options = [
      { value: "全部", label: "全部", count: reports.length },
      ...REPORT_KINDS.map((name) => ({
        value: name,
        label: name,
        count: reports.filter((report) => report.kind === name).length,
      })),
    ];

    function draw() {
      host.replaceChildren();
      for (const option of options) {
        const color = option.value === "全部" ? "#0B4BFF" : (REPORT_COLORS[option.value] || "#0B4BFF");
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

      const shown = sorted.filter((report) => kind === "全部" || report.kind === kind);
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
        when.textContent = `${report.date}　${report.scope}`;
        top.append(tag(report.kind, color), when);
        const title = document.createElement("h3");
        title.textContent = report.title;
        const value = document.createElement("p");
        value.className = "report-value";
        value.textContent = report.value;
        const summary = document.createElement("p");
        summary.className = "report-summary";
        summary.textContent = report.summary;
        const link = extLink(report.url, `來源：${report.site}`);
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
      title.textContent = source.title;
      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = source.date ? `${source.site}　${source.date}` : source.site;
      card.append(title, meta);
      host.append(card);
    }
  }

  async function boot() {
    const [items, reports, meta] = await Promise.all([
      loadJson("data/items.json"),
      loadJson("data/reports.json"),
      loadJson("data/meta.json"),
    ]);
    if (!Array.isArray(items) || !Array.isArray(reports)) {
      throw new Error("資料格式不正確");
    }

    const sorted = bySortDesc(items);
    const latestList = sorted.filter((item) => INCIDENT_TYPES.includes(item.type)).slice(0, 6);
    const claims = items.filter((item) => item.type === "理賠與訴訟").length;
    const span = monthSpan(items);
    const summaryText = `彙整與 AI 伺服器、GPU 與晶片、資料中心設備相關的運輸事故。${span ? `時間涵蓋 ${span}。` : ""}收錄 ${items.length} 則事故（含 ${claims} 則理賠與訴訟），另整理 ${reports.length} 則產業報告與保險市場動態，每則均附原始來源連結。`;
    document.getElementById("summary").textContent = summaryText;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", summaryText);
    const updated = document.getElementById("updated");
    updated.dateTime = meta.last_updated || "";
    updated.textContent = meta.last_updated || "";

    renderMetrics(items, meta.headlines);
    renderTrends(meta.trends);
    renderTicker(latestList);
    renderMonthChart(items);
    renderTypeBars(items);
    renderIncidents(sorted, latestList[0] || null);
    renderReports(reports);
    renderExtra(meta.extra_sources);

    document.getElementById("loading").hidden = true;
    const main = document.getElementById("main");
    main.hidden = false;
    main.dataset.ready = "true";
  }

  boot().catch(showError);
})();
