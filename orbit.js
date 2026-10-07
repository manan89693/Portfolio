(() => {
  const stations = [
    {
      kicker: "Payments",
      title: "Banking & Payment Management System",
      summary: "A secured backend for accounts, beneficiaries, payments, and transaction history.",
      points: [
        "Created REST services for account management, beneficiary registration, payment processing, and transaction tracking with Spring Boot and Spring Data JPA.",
        "Secured endpoints with JWT authentication and role-based authorization in Spring Security, enforcing USER and ADMIN access on protected APIs.",
        "Structured PostgreSQL transaction workflows with JPA relationships, request validation, exception handling, and a Dockerized deployment.",
      ],
      tags: ["Java", "Spring Boot", "Spring Security", "Spring Data JPA", "PostgreSQL", "JWT", "REST APIs", "Docker"],
    },
    {
      kicker: "Reservations",
      title: "Real-Time Event Ticketing & Reservation Platform",
      summary: "A microservices platform that holds a seat under concurrent demand, then coordinates payment and notification.",
      points: [
        "Architected Event, Booking, Payment, and Notification services, with client traffic routed through Spring Cloud Gateway.",
        "Built concurrency-safe seat reservation with transactional database operations and Redis locking so simultaneous requests cannot double-book a seat.",
        "Orchestrated event-driven booking with Apache Kafka, asynchronously coordinating payment and notification events across containerized services.",
      ],
      tags: ["Java", "Spring Boot", "Spring Cloud", "PostgreSQL", "Apache Kafka", "Redis", "Docker", "REST APIs"],
    },
    {
      kicker: "Retail",
      title: "Real-Time Retail Sales & Inventory Intelligence Platform",
      summary: "A streaming and batch pipeline for retail transactions, inventory, and sales KPIs.",
      points: [
        "Constructed a real-time data pipeline to ingest retail transaction and inventory events through Apache Kafka and transform streaming data using PySpark for downstream analytics.",
        "Automated batch ETL workflows with Apache Airflow to process historical sales data from AWS S3 and load analytics-ready datasets into PostgreSQL.",
        "Produced Power BI dashboards and SQL-based KPIs to track revenue trends, product performance, regional sales, inventory levels, and low-stock conditions.",
      ],
      tags: ["Python", "SQL", "Apache Kafka", "PySpark", "Apache Airflow", "PostgreSQL", "AWS S3", "Power BI", "Docker"],
    },
    {
      kicker: "Analytics",
      title: "Customer 360 Analytics & Business Intelligence Warehouse",
      summary: "A dimensional warehouse for customer, order, product, and sales analytics.",
      points: [
        "Modeled a dimensional data warehouse using fact and dimension tables to consolidate customer, order, product, and sales data for business analytics.",
        "Transformed raw transactional data using SQL, Python, and dbt to create analytics-ready datasets and reusable metrics for customer segmentation, revenue, retention, and product performance.",
        "Visualized business KPIs through interactive Power BI dashboards using DAX, covering sales trends, customer behavior, regional performance, and repeat-purchase patterns.",
      ],
      tags: ["SQL", "PostgreSQL", "Python", "Pandas", "Power BI", "DAX", "dbt"],
    },
    {
      kicker: "Fraud",
      title: "Real-Time Fraud Detection & Transaction Monitoring System",
      summary: "A streaming fraud pipeline that scores transactions and stores the results.",
      points: [
        "Devised a real-time fraud detection pipeline using transaction features and XGBoost classification across 100K+ transactions, achieving a 92%+ F1-score on test data.",
        "Connected Kafka event streaming with FastAPI and PostgreSQL for real-time transaction processing and fraud-risk prediction through REST APIs, with Dockerized deployment.",
        "Established a transaction monitoring workflow to preprocess streaming data, generate fraud-risk scores, and persist prediction results for downstream analysis.",
      ],
      tags: ["FastAPI", "PostgreSQL", "Scikit-learn", "XGBoost", "Kafka", "Docker"],
    },
    {
      kicker: "Markets",
      title: "FinSight: Multi-Agent AI Platform for Stock & Market Intelligence",
      summary: "An eight-agent research platform for earnings, news, sentiment, and market risk.",
      points: [
        "Orchestrated an 8-agent LLM workflow for financial research, earnings analysis, news summarization, sentiment detection, risk assessment, and market trend analysis, generating consolidated stock intelligence with sub-4-minute end-to-end latency.",
        "Productionized Dockerized agent, API, and frontend services on GCP using Cloud Run and Cloud SQL with CI/CD, designed to handle 100+ research queries per hour while keeping LLM inference costs below $2 per query.",
        "Automated financial data ingestion and processing pipelines for market data, earnings reports, and news feeds, supplying LLM agents with contextual information for real-time stock analysis.",
      ],
      tags: ["FastAPI", "Next.js", "Docker", "GCP", "LLM Agents", "JWT", "Cloud Run", "Cloud SQL"],
    },
  ];

  const root = document.querySelector("#orbit");
  const canvas = document.querySelector("#orbit-canvas");
  const openButton = document.querySelector("#open-orbit");
  const closeButton = document.querySelector("#orbit-close");
  const hint = document.querySelector("#orbit-hint");
  const count = document.querySelector("#orbit-count");
  const card = document.querySelector("#orbit-card");
  const cardKicker = document.querySelector("#orbit-card-kicker");
  const cardTitle = document.querySelector("#orbit-card-title");
  const cardSummary = document.querySelector("#orbit-card-summary");
  const cardPoints = document.querySelector("#orbit-card-points");
  const cardTags = document.querySelector("#orbit-card-tags");
  const cardClose = document.querySelector("#orbit-card-close");
  if (!root || !canvas || !openButton) return;

  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const keys = new Set();
  const visited = new Set();
  const trail = [];
  const stars = [];

  const player = { x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2 };
  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let rx = 0;
  let ry = 0;
  let running = false;
  let frame = 0;
  let last = 0;
  let autopilot = null;
  let nearest = null;
  let cardOpen = false;
  let started = false;

  function makeStars() {
    stars.length = 0;
    const total = Math.round((width * height) / 9000);
    for (let i = 0; i < total; i += 1) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.55 + 0.15,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }

  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = root.clientWidth;
    height = root.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = width * 0.5;
    cy = height * (width < 760 ? 0.46 : 0.5);
    rx = Math.max(96, Math.min(width * 0.24, width / 2 - 168));
    ry = Math.max(78, Math.min(height * 0.2, height / 2 - 148));
    stations.forEach((station, index) => {
      const angle = -Math.PI / 2 + (index / stations.length) * Math.PI * 2;
      station.x = cx + Math.cos(angle) * rx;
      station.y = cy + Math.sin(angle) * ry * 0.92;
      station.nx = Math.cos(angle);
      station.ny = Math.sin(angle);
    });
    if (!started) {
      player.x = cx;
      player.y = cy + 18;
      started = true;
    }
    makeStars();
  }

  function setHint(text) {
    if (hint) hint.textContent = text;
  }

  function setCount() {
    if (count) count.textContent = `${visited.size} / ${stations.length}`;
    if (visited.size === stations.length) {
      setHint("All six beacons logged. Fly on, or close the orbit.");
    }
  }

  function inertPage(on) {
    document.querySelectorAll("header, main, footer").forEach((node) => {
      node.inert = on;
    });
    document.body.classList.toggle("orbit-open", on);
  }

  function openOrbit() {
    root.hidden = false;
    inertPage(true);
    layout();
    setCount();
    if (!cardOpen) {
      setHint(coarse() ? "Tap a beacon to fly there." : "Arrows to fly. Enter, or click a beacon, to dock.");
    }
    root.focus();
    if (!running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(tick);
    }
  }

  function closeCard() {
    cardOpen = false;
    if (card) card.hidden = true;
    if (visited.size < stations.length) {
      setHint(coarse() ? "Tap another beacon." : "Fly to the next beacon.");
    } else {
      setHint("All six beacons logged. Fly on, or close the orbit.");
    }
  }

  function closeOrbit() {
    closeCard();
    root.hidden = true;
    running = false;
    keys.clear();
    autopilot = null;
    inertPage(false);
    openButton.focus();
  }

  function fillCard(station) {
    cardKicker.textContent = station.kicker;
    cardTitle.textContent = station.title;
    cardSummary.textContent = station.summary;
    cardPoints.replaceChildren(
      ...station.points.map((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
      })
    );
    cardTags.replaceChildren(
      ...station.tags.map((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
      })
    );
  }

  function openCard(station) {
    visited.add(station.kicker);
    cardOpen = true;
    autopilot = null;
    player.vx = 0;
    player.vy = 0;
    fillCard(station);
    if (card) card.hidden = false;
    setCount();
    setHint(station.kicker);
    card.focus({ preventScroll: true });
  }

  function coarse() {
    return window.matchMedia("(pointer: coarse)").matches || width < 760;
  }

  function nearestStation(range) {
    let best = null;
    let bestDist = range;
    stations.forEach((station) => {
      const dist = Math.hypot(station.x - player.x, station.y - player.y);
      if (dist < bestDist) {
        best = station;
        bestDist = dist;
      }
    });
    return best;
  }

  function pressed(name) {
    return keys.has(name);
  }

  function step(dt) {
    const bob = reduce ? 0 : Math.sin(performance.now() / 700);
    stations.forEach((station, index) => {
      station.drawY = station.y + Math.sin(performance.now() / 900 + index) * (reduce ? 0 : 3.5);
      station.bob = bob;
    });

    if (cardOpen) return;

    let ax = 0;
    let ay = 0;
    if (pressed("ArrowLeft") || pressed("a") || pressed("A")) ax -= 1;
    if (pressed("ArrowRight") || pressed("d") || pressed("D")) ax += 1;
    if (pressed("ArrowUp") || pressed("w") || pressed("W")) ay -= 1;
    if (pressed("ArrowDown") || pressed("s") || pressed("S")) ay += 1;

    if (ax || ay) autopilot = null;

    if (autopilot) {
      const tx = autopilot.station ? autopilot.station.x : autopilot.x;
      const ty = autopilot.station ? autopilot.station.drawY || autopilot.station.y : autopilot.y;
      const dx = tx - player.x;
      const dy = ty - player.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (autopilot.station && dist < 34) {
        openCard(autopilot.station);
        return;
      }
      if (!autopilot.station && dist < 10) {
        autopilot = null;
      } else {
        ax += dx / dist;
        ay += dy / dist;
      }
    }

    const accel = 0.055 * dt;
    if (ax || ay) {
      const len = Math.hypot(ax, ay) || 1;
      player.vx += (ax / len) * accel;
      player.vy += (ay / len) * accel;
    }

    const drag = Math.pow(0.9, dt / 16.67);
    player.vx *= drag;
    player.vy *= drag;
    const speed = Math.hypot(player.vx, player.vy);
    const max = 6.4;
    if (speed > max) {
      player.vx = (player.vx / speed) * max;
      player.vy = (player.vy / speed) * max;
    }
    player.x += player.vx * (dt / 16.67);
    player.y += player.vy * (dt / 16.67);
    player.x = Math.max(28, Math.min(width - 28, player.x));
    player.y = Math.max(72, Math.min(height - 28, player.y));
    if (speed > 0.35) player.angle = Math.atan2(player.vy, player.vx);

    if (speed > 0.4) {
      trail.push({ x: player.x, y: player.y, life: 1 });
      if (trail.length > 26) trail.shift();
    }
    trail.forEach((bit) => {
      bit.life -= 0.045 * (dt / 16.67);
    });
    while (trail.length && trail[0].life <= 0) trail.shift();

    nearest = nearestStation(78);
    if (visited.size === stations.length) return;
    if (nearest) setHint(coarse() ? `Tap to open ${nearest.kicker}.` : `Enter to open ${nearest.kicker}.`);
    else setHint(coarse() ? "Tap a beacon to fly there." : "Arrows to fly. Enter, or click a beacon, to dock.");
  }

  function drawIcon(station) {
    ctx.save();
    ctx.translate(station.x, station.drawY);
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 1.6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const name = station.kicker;
    if (name === "Payments") {
      roundRect(-7, -5, 14, 10, 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-7, -1);
      ctx.lineTo(7, -1);
      ctx.stroke();
    } else if (name === "Reservations") {
      roundRect(-8, -6, 10, 12, 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, -4);
      ctx.lineTo(8, -4);
      ctx.lineTo(8, 6);
      ctx.lineTo(2, 6);
      ctx.stroke();
    } else if (name === "Retail") {
      ctx.strokeRect(-8, -2, 6, 6);
      ctx.strokeRect(-1, -6, 6, 6);
      ctx.strokeRect(2, 0, 6, 6);
    } else if (name === "Analytics") {
      ctx.fillRect(-7, 1, 3, 5);
      ctx.fillRect(-2, -3, 3, 9);
      ctx.fillRect(3, -6, 3, 12);
    } else if (name === "Fraud") {
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(7, -4);
      ctx.lineTo(5, 6);
      ctx.lineTo(0, 8);
      ctx.lineTo(-5, 6);
      ctx.lineTo(-7, -4);
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-8, 4);
      ctx.lineTo(-3, 4);
      ctx.lineTo(0, -1);
      ctx.lineTo(3, 2);
      ctx.lineTo(8, -6);
      ctx.stroke();
    }
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
  }

  function draw() {
    const sky = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width, height) * 0.72);
    sky.addColorStop(0, "#2a3278");
    sky.addColorStop(0.42, "#161b3d");
    sky.addColorStop(1, "#0b0e20");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const wash = ctx.createRadialGradient(width * 0.82, height * 0.08, 10, width * 0.82, height * 0.08, width * 0.5);
    wash.addColorStop(0, "rgba(255, 92, 58, 0.34)");
    wash.addColorStop(1, "rgba(255, 92, 58, 0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      const flicker = reduce ? 1 : 0.75 + Math.sin(performance.now() / 500 + star.tw) * 0.25;
      ctx.fillStyle = `rgba(255,255,255,${star.a * flicker})`;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry * 0.92, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    const done = visited.size === stations.length;
    const core = ctx.createRadialGradient(cx, cy, 4, cx, cy, done ? 70 : 46);
    core.addColorStop(0, done ? "rgba(255,92,58,0.95)" : "rgba(255,255,255,0.95)");
    core.addColorStop(0.35, done ? "rgba(255,92,58,0.35)" : "rgba(120,140,255,0.35)");
    core.addColorStop(1, "rgba(255,92,58,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, done ? 70 : 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 13px Plus Jakarta Sans, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MP", cx, cy);

    stations.forEach((station) => {
      const seen = visited.has(station.kicker);
      const hot = nearest === station && !cardOpen;
      const glow = ctx.createRadialGradient(station.x, station.drawY, 4, station.x, station.drawY, hot ? 48 : 34);
      glow.addColorStop(0, seen ? "rgba(255,92,58,0.9)" : "rgba(170,184,255,0.85)");
      glow.addColorStop(1, "rgba(255,92,58,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(station.x, station.drawY, hot ? 48 : 34, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = seen ? "#ff5c3a" : "#24306f";
      ctx.arc(station.x, station.drawY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = hot ? 2.4 : 1.4;
      ctx.strokeStyle = hot ? "#fff" : "rgba(255,255,255,0.8)";
      ctx.stroke();
      drawIcon(station);
      drawTitle(station, seen);
    });

    trail.forEach((bit) => {
      ctx.fillStyle = `rgba(255,92,58,${Math.max(0, bit.life) * 0.7})`;
      ctx.beginPath();
      ctx.arc(bit.x, bit.y, 3.2 * bit.life, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.shadowColor = "rgba(255,92,58,0.85)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(-9, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-9, -7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function wrapTitle(text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawTitle(station, seen) {
    ctx.font = "600 12px Plus Jakarta Sans, Segoe UI, sans-serif";
    ctx.fillStyle = seen ? "#ffb4a4" : "#ffffff";
    ctx.textBaseline = "middle";
    const pad = 12;
    const gap = 30;
    const side = Math.abs(station.nx) >= Math.abs(station.ny);
    let align = "center";
    let x = station.x;
    let maxWidth = Math.min(210, width * 0.38);
    if (side) {
      align = station.nx > 0 ? "left" : "right";
      x = station.x + station.nx * gap;
      maxWidth = station.nx > 0 ? width - x - pad : x - pad;
    }
    maxWidth = Math.max(120, Math.min(220, maxWidth));
    const lines = wrapTitle(station.title, maxWidth);
    const lineH = 15;
    const blockH = lines.length * lineH;
    let startY;
    if (!side && station.ny < 0) startY = station.drawY - gap - blockH;
    else if (!side) startY = station.drawY + gap;
    else startY = station.drawY - blockH / 2;
    ctx.textAlign = align;
    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + index * lineH + lineH / 2);
    });
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(34, now - last || 16);
    last = now;
    frame += 1;
    step(dt);
    draw();
    requestAnimationFrame(tick);
  }

  function pointerPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (cardOpen) return;
    const point = pointerPoint(event);
    const hit = stations.find((station) => Math.hypot(station.x - point.x, station.drawY - point.y) < 46);
    if (hit && Math.hypot(hit.x - player.x, hit.drawY - player.y) < 78) {
      openCard(hit);
      return;
    }
    autopilot = hit ? { station: hit } : { x: point.x, y: point.y };
  });

  openButton.addEventListener("click", openOrbit);
  closeButton?.addEventListener("click", closeOrbit);
  cardClose?.addEventListener("click", closeCard);

  document.querySelectorAll(".orbit-pad button").forEach((button) => {
    const key = button.dataset.key;
    const down = (event) => {
      event.preventDefault();
      keys.add(key);
    };
    const up = (event) => {
      event.preventDefault();
      keys.delete(key);
    };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("pointercancel", up);
  });

  window.addEventListener("keydown", (event) => {
    if (root.hidden) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === "Escape") {
      if (cardOpen) closeCard();
      else closeOrbit();
      return;
    }
    if (cardOpen) return;
    if (event.key === "Enter" && nearest && event.target?.tagName !== "BUTTON") {
      event.preventDefault();
      openCard(nearest);
      return;
    }
    keys.add(event.key);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.key);
  });

  window.addEventListener("resize", () => {
    if (!root.hidden) layout();
  });
})();
