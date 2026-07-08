// ============================================================================
// MARIGOLD ENGINE TEST SERVER v3.2
// Landing / Questionnaire / Advisor / brand.css / API
// ============================================================================
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { generatePlan } = require('./engine/index');

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Brand CSS (single source of truth — edit here to update all pages) ──
const BRAND_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
:root{--cream:#FDFAF0;--warm:#F5F0E8;--deep:#3C3010;--tx:#2A2010;--muted:#9A8A6A;--bdr:#E0D4B0;--g:#F7D44C;--gd:#C8A820;--gk:#9A7E10;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--cream);color:var(--tx);font-family:'Playfair Display',Georgia,serif;font-size:15px;line-height:1.7;}
/* BRAND NAME: edit .bname to change style (italic/bold/uppercase/letter-spacing) */
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;cursor:pointer;}
.bname{font-size:13px;letter-spacing:3px;color:var(--deep);font-style:italic;font-weight:400;font-family:'Playfair Display',Georgia,serif;}
.site-header{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid var(--bdr);background:var(--cream);position:sticky;top:0;z-index:100;}
.nav-pill{font-size:11px;letter-spacing:1px;color:var(--muted);text-decoration:none;padding:5px 14px;border:1px solid var(--bdr);border-radius:100px;font-family:'Playfair Display',serif;font-style:italic;transition:all 0.2s;background:transparent;cursor:pointer;display:inline-block;}
.nav-pill:hover{border-color:var(--gd);background:var(--warm);color:var(--deep);}
.cta{display:inline-flex;align-items:center;gap:10px;padding:12px 28px;background:var(--deep);color:var(--cream);border:none;border-radius:100px;font-size:12px;letter-spacing:2px;cursor:pointer;font-family:'Playfair Display',Georgia,serif;font-style:italic;transition:background 0.2s;}
.cta:hover{background:var(--gk);}
.cta:disabled{opacity:0.4;cursor:not-allowed;}
.progress-bar{position:fixed;top:0;left:0;right:0;height:2px;background:var(--bdr);z-index:200;}
.progress-fill{height:100%;background:var(--gd);transition:width 0.5s ease;}
.ql{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;font-family:'Playfair Display',serif;}
@keyframes marigold-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.marigold-spin{animation:marigold-spin 2.5s linear infinite;}
.out-tabs{display:flex;border-bottom:1px solid var(--bdr);margin-bottom:32px;overflow-x:auto;}
.out-tab{padding:10px 0;margin-right:24px;font-size:11px;letter-spacing:1.5px;color:var(--muted);cursor:pointer;border:none;border-bottom:2px solid transparent;background:transparent;font-family:'Playfair Display',serif;font-style:italic;transition:all 0.2s;white-space:nowrap;flex-shrink:0;}
.out-tab:hover{color:var(--deep);}
.out-tab.on{color:var(--deep);border-bottom-color:var(--deep);}
.out-ey{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.out-ey::after{content:'';flex:1;height:1px;background:var(--bdr);}
.back-link{background:none;border:none;color:var(--muted);font-size:11px;letter-spacing:1px;cursor:pointer;font-family:'Playfair Display',Georgia,serif;font-style:italic;text-decoration:underline;}`;

// ── Landing page ──
const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marigold Weddings</title>
<link rel="stylesheet" href="/brand.css">
<style>
html,body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;}
.tagline{font-size:15px;color:var(--muted);font-style:italic;margin-bottom:56px;text-align:center;line-height:1.6;max-width:360px;}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:540px;width:100%;margin-bottom:48px;}
@media(max-width:480px){.cards{grid-template-columns:1fr;}}
.card{background:white;border:1px solid var(--bdr);border-radius:14px;padding:26px 22px;text-decoration:none;color:var(--tx);transition:border-color 0.2s,transform 0.15s;display:flex;flex-direction:column;gap:6px;}
.card:hover{border-color:var(--gd);transform:translateY(-2px);}
.card.primary{border-color:var(--gd);background:#FFFAEA;}
.card-ey{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-style:italic;}
.card-title{font-size:17px;font-style:italic;color:var(--deep);margin-top:2px;}
.card-desc{font-size:12px;color:var(--muted);font-style:italic;line-height:1.6;margin-top:4px;}
.card-cta{font-size:11px;color:var(--gk);font-style:italic;margin-top:10px;}
.footer{font-size:11px;color:var(--bdr);font-style:italic;text-align:center;line-height:1.8;}
.status-dot{display:inline-block;width:6px;height:6px;background:#27AE60;border-radius:50%;margin-right:4px;vertical-align:middle;}
h1{font-size:28px;font-weight:400;font-style:italic;color:var(--deep);letter-spacing:0.5px;margin-bottom:10px;}
</style>
</head>
<body>
<svg width="52" height="52" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:28px">
<g fill="#E0B030" stroke="#C8941A" stroke-width="0.4"><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(0 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(25.7 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(51.4 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(77.1 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(102.8 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(128.5 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(154.2 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(180 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(205.7 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(231.4 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(257.1 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(282.8 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(308.5 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(334.2 17 17)"/></g>
<g fill="#F2C53D" stroke="#D9A828" stroke-width="0.35"><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(12.9 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(38.6 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(64.3 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(90 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(115.7 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(141.4 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(167.1 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(192.8 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(218.5 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(244.2 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(270 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(295.7 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(321.4 17 17)"/><ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(347.1 17 17)"/></g>
<g fill="#F7D44C" stroke="#E0B030" stroke-width="0.3"><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(0 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(20 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(40 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(60 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(80 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(100 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(120 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(140 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(160 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(180 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(200 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(220 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(240 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(260 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(280 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(300 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(320 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(340 17 17)"/></g>
<circle cx="17" cy="17" r="4.1" fill="#6B5318" stroke="#5A4512" stroke-width="0.3"/>
<circle cx="15.5" cy="15.8" r="0.45" fill="#3C3010"/>
<circle cx="18.5" cy="15.8" r="0.45" fill="#3C3010"/>
<circle cx="17" cy="18.4" r="0.45" fill="#3C3010"/>
</svg>
<h1>marigold</h1>
<p class="tagline">Your wedding, your traditions. Planning that actually gets it.</p>
<div class="cards">
  <a href="/questionnaire" class="card primary">
    <div class="card-ey">For couples</div>
    <div class="card-title">Build your wedding plan</div>
    <div class="card-desc">Answer 6 questions. Get a personalised plan built from our cultural taxonomy.</div>
    <div class="card-cta">Start now &rarr;</div>
  </a>
  <a href="/advisor" class="card">
    <div class="card-ey">For advisors</div>
    <div class="card-title">Review cultural content</div>
    <div class="card-desc">Review, edit, and approve taxonomy entries. Changes go live in the engine immediately.</div>
    <div class="card-cta">Open advisor review &rarr;</div>
  </a>
</div>
<div class="footer">
  <span class="status-dot"></span>Engine live &middot; 35 traditions &middot; Supabase connected<br>
  Confidential &mdash; internal build &middot; June 2026
</div>
</body>
</html>`;

// ── Questionnaire UI — served as static file at /advisor-review/questionnaire.html ──


// ── Advisor review interface ──
const ADVISOR_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marigold — Cultural Advisor Review</title>
<style>
  :root {
    --bg: #FDFAF0; --surface: #FFFFFF; --border: #E0D4B0; --text: #2A2010;
    --muted: #9A8A6A; --gold: #C8A820; --gold-dark: #9A7E10; --gold-light: #FDF8E8;
    --deep: #3C3010; --warm: #F5F0E8; --red: #C0392B; --red-light: #FDECEA;
    --green: #1E7C4E; --green-light: #E8F5EE; --orange: #D4550A; --orange-light: #FDF0E8;
    --radius: 6px; --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font); background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }
  .layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
  .sidebar { background: var(--surface); border-right: 1px solid var(--border); position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .main { padding: 32px; max-width: 860px; }
  .sidebar-header { padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
  .sidebar-header h1 { font-size: 14px; font-weight: 700; color: var(--deep); }
  .sidebar-header p { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .tradition-item { display: flex; align-items: center; justify-content: space-between; padding: 9px 20px; cursor: pointer; border-left: 3px solid transparent; }
  .tradition-item:hover { background: var(--warm); }
  .tradition-item.active { background: var(--gold-light); border-left-color: var(--gold); }
  .t-name { font-size: 13px; font-weight: 500; }
  .t-status { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 10px; }
  .s-approved { background: var(--green-light); color: var(--green); }
  .s-draft { background: var(--gold-light); color: var(--gold-dark); }
  .s-in_review { background: var(--orange-light); color: var(--orange); }
  .action-bar { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; align-items: flex-start; }
  .action-group { display: flex; flex-direction: column; gap: 3px; }
  .action-hint { font-size: 11px; color: var(--muted); }
  .btn { display: inline-flex; align-items: center; gap: 5px; padding: 8px 14px; border-radius: var(--radius); font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid transparent; white-space: nowrap; }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-primary { background: var(--deep); color: white; }
  .btn-gold { background: var(--gold); color: var(--deep); border-color: var(--gold); font-weight: 600; }
  .btn-gold:hover:not(:disabled) { background: var(--gold-dark); color: white; }
  .btn-success { background: var(--green); color: white; }
  .btn-warning { background: var(--orange); color: white; }
  .btn-outline { background: white; color: var(--text); border-color: var(--border); }
  .btn-outline:hover:not(:disabled) { background: var(--warm); }
  .btn-danger { background: var(--red); color: white; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px; color: var(--deep); }
  .page-meta { font-size: 13px; color: var(--muted); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .badge { display: inline-flex; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
  .badge-approved { background: var(--green-light); color: var(--green); }
  .badge-draft { background: var(--gold-light); color: var(--gold-dark); }
  .badge-in_review { background: var(--orange-light); color: var(--orange); }
  .badge-retired { background: var(--border); color: var(--muted); }
  .banner { padding: 12px 16px; border-radius: var(--radius); margin-bottom: 20px; display: flex; align-items: flex-start; gap: 10px; border-left: 4px solid; }
  .banner-editing { background: var(--gold-light); border-color: var(--gold); }
  .banner-locked { background: var(--warm); border-color: var(--border); }
  .banner-title { font-size: 13px; font-weight: 600; }
  .banner-editing .banner-title { color: var(--gold-dark); }
  .banner-locked .banner-title { color: var(--muted); }
  .banner-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
  .tab { padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; color: var(--muted); }
  .tab.active { color: var(--deep); border-bottom-color: var(--gold); }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 12px; font-weight: 700; color: var(--deep); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .section-sub { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
  /* Diff / tracked changes */
  .diff-wrap { font-size: 13px; line-height: 1.8; }
  .diff-wrap p { margin-bottom: 10px; }
  .diff-wrap strong { font-weight: 700; }
  .diff-wrap ol { margin: 6px 0 12px 20px; }
  .diff-wrap li { margin-bottom: 6px; }
  ins.diff-add { background: #D4EDDA; color: #155724; text-decoration: none; border-radius: 2px; padding: 0 2px; }
  del.diff-del { background: #F8D7DA; color: #721C24; text-decoration: line-through; border-radius: 2px; padding: 0 2px; }
  .diff-legend { display: flex; gap: 16px; margin-bottom: 12px; font-size: 11px; font-family: -apple-system, sans-serif; }
  .diff-legend span { display: flex; align-items: center; gap: 4px; }
  .diff-dot-add { width: 10px; height: 10px; border-radius: 2px; background: #D4EDDA; border: 1px solid #28a745; }
  .diff-dot-del { width: 10px; height: 10px; border-radius: 2px; background: #F8D7DA; border: 1px solid #dc3545; }
  .diff-no-change { color: var(--muted); font-size: 12px; font-style: italic; padding: 12px 0; }
  /* Rich text editor */
  .rich-editor-wrap { border: 1.5px solid var(--border); border-radius: 6px; overflow: hidden; }
  .rich-editor-toolbar { display: flex; gap: 4px; padding: 6px 8px; background: #FDFAF0; border-bottom: 1px solid var(--border); }
  .rich-editor-toolbar button { padding: 3px 8px; border: 1px solid var(--border); border-radius: 4px; background: white; font-size: 12px; cursor: pointer; color: var(--deep); font-family: Georgia, serif; }
  .rich-editor-toolbar button:hover { background: #F7D44C; border-color: #C8A820; }
  .rich-editor-toolbar button.active { background: #F7D44C; border-color: #C8A820; font-weight: 700; }
  .rich-editor-content { min-height: 160px; padding: 12px; font-size: 13px; line-height: 1.7; color: var(--deep); outline: none; background: white; }
  .rich-editor-content:focus { background: #FFFDF8; }
  .rich-editor-content strong { font-weight: 700; }
  .rich-editor-content ol { margin: 6px 0 12px 20px; }
  .rich-editor-content li { margin-bottom: 6px; }
  /* Rendered view */
  .cultural-notes-rendered {
    font-size: 13px; line-height: 1.8; color: #3C3010;
    background: var(--gold-pale, #FDFAF0);
    border: 1px solid var(--border, #E0D4B0);
    border-left: 3px solid var(--gold, #C8A820);
    border-radius: 0 6px 6px 0;
    padding: 14px 16px;
  }
  .cultural-notes-rendered p { margin-bottom: 10px; }
  .cultural-notes-rendered p.notes-heading { font-weight: 700; color: #2C2408; margin-top: 16px; margin-bottom: 6px; }
  .cultural-notes-rendered .notes-list { margin: 6px 0 14px 20px; }
  .cultural-notes-rendered .notes-list li { margin-bottom: 8px; line-height: 1.6; }
  .cultural-notes-rendered p { margin-bottom: 12px; }
  .cultural-notes-rendered strong { font-weight: 700; color: #2C2408; }
  .cultural-notes-rendered ol { margin: 8px 0 16px 20px; }
  .cultural-notes-rendered li { margin-bottom: 10px; line-height: 1.6; }
  .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .field { margin-bottom: 12px; }
  .field label { display: block; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 5px; }
  .field input, .field textarea, .field select { width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font); font-size: 13px; background: white; color: var(--text); }
  .field input:focus, .field textarea:focus { outline: none; border-color: var(--gold); }
  .field textarea { resize: vertical; }
  .item-list { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 8px; }
  .item-row { border-bottom: 1px solid var(--border); }
  .item-row:last-child { border-bottom: none; }
  .item-row-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; background: var(--surface); }
  .item-row-header:hover { background: var(--warm); }
  .item-row-label { font-size: 13px; font-weight: 500; flex: 1; padding-right: 8px; }
  .item-row-meta { font-size: 11px; color: var(--muted); margin-right: 8px; white-space: nowrap; }
  .item-row-body { padding: 14px; background: var(--bg); border-top: 1px solid var(--border); display: none; }
  .item-row-body.open { display: block; }
  .item-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .item-fields.three { grid-template-columns: 1fr 1fr 1fr; }
  .item-fields .full { grid-column: 1 / -1; }
  .item-field label { display: block; font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px; }
  .item-field input, .item-field textarea, .item-field select { width: 100%; padding: 6px 8px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 12px; font-family: var(--font); background: white; color: var(--text); }
  .item-field input:focus, .item-field textarea:focus { outline: none; border-color: var(--gold); }
  .item-field textarea { min-height: 60px; resize: vertical; }
  .item-actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 10px; }
  .add-item-btn { width: 100%; padding: 10px; text-align: center; font-size: 13px; color: var(--gold-dark); font-weight: 500; cursor: pointer; background: var(--gold-light); border: 1px dashed var(--gold); border-radius: var(--radius); margin-top: 4px; }
  .add-item-btn:hover { background: var(--warm); }
  .save-bar { position: sticky; bottom: 0; background: var(--surface); border-top: 1px solid var(--border); padding: 14px 0; margin-top: 32px; display: flex; gap: 8px; align-items: center; }
  .save-bar-hint { font-size: 12px; color: var(--muted); margin-left: auto; }
  .version-item { padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
  .version-item.current { border-color: var(--gold); background: var(--gold-light); }
  .audit-item { padding: 12px 0; border-bottom: 1px solid var(--border); display: flex; gap: 12px; }
  .audit-item:last-child { border-bottom: none; }
  .audit-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); margin-top: 5px; flex-shrink: 0; }
  .audit-dot.approved { background: var(--green); }
  .audit-dot.created { background: var(--gold); }
  .audit-dot.submitted_for_review { background: var(--orange); }
  .audit-dot.rejected { background: var(--red); }
  .audit-action { font-size: 12px; font-weight: 600; }
  .audit-meta { font-size: 11px; color: var(--muted); }
  .audit-notes { font-size: 12px; margin-top: 2px; font-style: italic; }
  .toast {
    position:fixed;bottom:20px;right:20px;
    display:flex;align-items:center;gap:8px;
    padding:10px 16px;border-radius:8px;
    background:var(--deep,#3C3010);color:#fff;
    font-size:13px;font-style:italic;
    font-family:'Playfair Display',Georgia,serif;
    opacity:0;pointer-events:none;
    transition:opacity 0.3s;z-index:999;
  }
  .toast.visible{opacity:1;}
  .toast.error{background:#c0392b;}
  .toast.success{background:#1e7c4e;}
  .toast-flower{font-size:14px;}
  .modal-backdrop { position: fixed; inset: 0; background: rgba(60,48,16,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal-box { background: #FDFAF5; border-radius: 16px; padding: 32px; width: 380px; max-width:90vw; box-shadow: 0 8px 32px rgba(60,48,16,0.2); text-align:center; }
  .modal-flower { margin-bottom:16px; }
  .modal-title { font-size: 18px; font-weight: 400; font-style:italic; font-family:'Playfair Display',Georgia,serif; color: var(--deep); margin-bottom: 8px; }
  .modal-body { font-size:13px; color:var(--muted); font-style:italic; line-height:1.6; margin-bottom:20px; }
  .modal-input { width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; font-family: var(--font); margin-bottom: 16px; }
  .modal-input:focus { outline: none; border-color: var(--gold); }
  .modal-actions { display:flex; gap:12px; justify-content:center; margin-top:4px; }
  .toast.visible { opacity: 1; }
  .toast.error { background: var(--red); }
  .toast.success { background: var(--green); }
  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-header">
      <a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-bottom:16px;">
        <svg width="26" height="26" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
      <g fill="#E0B030" stroke="#C8941A" stroke-width="0.4">
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(0 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(25.7 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(51.4 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(77.1 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(102.8 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(128.5 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(154.2 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(180 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(205.7 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(231.4 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(257.1 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(282.8 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(308.5 17 17)"/>
        <ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(334.2 17 17)"/>
      </g>
      <g fill="#F2C53D" stroke="#D9A828" stroke-width="0.35">
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(12.9 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(38.6 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(64.3 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(90 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(115.7 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(141.4 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(167.1 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(192.8 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(218.5 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(244.2 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(270 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(295.7 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(321.4 17 17)"/>
        <ellipse cx="17" cy="7.8" rx="1.55" ry="3.4" transform="rotate(347.1 17 17)"/>
      </g>
      <g fill="#F7D44C" stroke="#E0B030" stroke-width="0.3">
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(0 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(20 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(40 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(60 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(80 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(100 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(120 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(140 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(160 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(180 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(200 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(220 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(240 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(260 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(280 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(300 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(320 17 17)"/>
        <ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(340 17 17)"/>
      </g>
      <circle cx="17" cy="17" r="4.1" fill="#6B5318" stroke="#5A4512" stroke-width="0.3"/>
      <circle cx="15.5" cy="15.8" r="0.45" fill="#3C3010"/>
      <circle cx="18.5" cy="15.8" r="0.45" fill="#3C3010"/>
      <circle cx="17" cy="18.4" r="0.45" fill="#3C3010"/>
    </svg>
        <span style="font-size:13px;letter-spacing:3px;color:var(--deep);font-style:italic;font-family:'Playfair Display',Georgia,serif">marigold</span>
      </a>
      <h1>Marigold · Advisor Review</h1>
      <p id="sidebar-count">Loading…</p>
    </div>
    <div id="tradition-list"></div>
  </aside>
  <main class="main" id="main-content">
    <div class="empty">
      <div style="font-size:32px;margin-bottom:12px">📋</div>
      <p>Select a tradition from the sidebar to begin reviewing.</p>
    </div>
  </main>
</div>
<div class="toast" id="toast"></div>
<div id="custom-modal" class="modal-backdrop" style="display:none">
  <div class="modal-box">
    <div class="modal-flower" id="modal-flower-adv"></div>
    <div class="modal-title" id="modal-title"></div>
    <div class="modal-body" id="modal-body"></div>
    <input type="text" class="modal-input" id="modal-input" style="display:none" placeholder="">
    <div class="modal-actions" id="modal-actions"></div>
  </div>
</div>
<script>
var TRAD_LABELS = {'sri-lankan-buddhist':'Buddhist · Sri Lankan','thai-buddhist':'Buddhist · Thai','chinese-taiwanese':'Chinese / Taiwanese','catholic':'Christian · Catholic','filipino-catholic':'Christian · Filipino Catholic','greek-orthodox':'Christian · Greek Orthodox','latin-american-catholic':'Christian · Latin American Catholic','mexican-catholic':'Christian · Mexican Catholic','christian-western':'Christian · Western','cuban':'Cuban','andhra-telugu':'Hindu · Andhra / Telugu','arya-samaj':'Hindu · Arya Samaj','assamese-hindu':'Hindu · Assamese','bengali-hindu':'Hindu · Bengali','bihari-hindu':'Hindu · Bihari','gujarati':'Hindu · Gujarati','kashmiri-pandit':'Hindu · Kashmiri Pandit','kerala-nair':'Hindu · Kerala / Nair','manipuri-vaishnavite':'Hindu · Manipuri (Vaishnavite)','marathi':'Hindu · Marathi','hindu-north-indian-punjabi':'Hindu · North Indian / Punjabi','odia-hindu':'Hindu · Odia','rajasthani-marwari':'Hindu · Rajasthani (Marwari)','rajasthani-rajput':'Hindu · Rajasthani (Rajput)','tamil-hindu':'Hindu · Tamil','vedic-general':'Hindu · Vedic (General)','jain-shwetambar':'Jain · Shwetambar','jewish-reform-conservative':'Jewish · Reform / Conservative','khasi':'Khasi','korean':'Korean','dawoodi-bohra':'Muslim · Dawoodi Bohra','muslim-nikah':'Muslim · Nikah','hausa-muslim':'Muslim · West African (Hausa)','yoruba-nigerian':'Nigerian · Yoruba','sikh':'Sikh'};
const API='/api/advisor';
let traditions=[],currentTradition=null,currentVersion=null,allVersions=[],activeTab='content',workingData={};
window.onload=()=>loadTraditions();
async function api(path,method='GET',body=null){
  const opts={method,headers:{'Content-Type':'application/json'}};
  if(body)opts.body=JSON.stringify(body);
  const res=await fetch(API+path,opts);
  if(!res.ok){const err=await res.json().catch(()=>({error:res.statusText}));throw new Error(err.error||res.statusText);}
  return res.json();
}
async function loadTraditions(){
  try{traditions=await api('/traditions');renderSidebar();}
  catch(e){toast('Failed to load: '+e.message,'error');}
}
function renderSidebar(){
  document.getElementById('sidebar-count').textContent=traditions.length+' traditions';
  const sorted=[...traditions].sort((a,b)=>(TRAD_LABELS[a.slug]||a.name||"").localeCompare(TRAD_LABELS[b.slug]||b.name||""));
  document.getElementById('tradition-list').innerHTML=sorted.map(t=>{
    const versions=t.tradition_versions||[];
    const current=versions.find(v=>v.is_current);
    const latest=[...versions].sort((a,b)=>b.version_number-a.version_number)[0];
    const sv=current||latest;
    const status=sv?.status||'no versions';
    return \`<div class="tradition-item \${currentTradition?.id===t.id?'active':''}" onclick="selectTradition('\${t.id}')">
      <span class="t-name">\${TRAD_LABELS[t.slug]||t.name}</span>
      <span class="t-status s-\${status.replace('_','-')}">\${status.replace('_',' ')}</span>
    </div>\`;
  }).join('');
}
async function selectTradition(id){
  currentTradition=traditions.find(t=>t.id===id);
  renderSidebar();
  document.getElementById('main-content').innerHTML='<div class="empty"><div class="spinner"></div></div>';
  try{
    allVersions=await api('/traditions/'+id+'/versions');
    // Default to the approved current version — not just the most recent,
    // which could be a draft from a previous session
    const approvedCurrent = allVersions.find(v => v.is_current && v.status === 'approved');
    currentVersion = approvedCurrent || allVersions[0] || null;
    initWorkingData();activeTab='content';renderMain();
  }catch(e){toast('Failed to load: '+e.message,'error');}
}
function initWorkingData(){
  if(!currentVersion){workingData={};return;}
  workingData={
    avg_budget_low:currentVersion.avg_budget_low||'',
    avg_budget_high:currentVersion.avg_budget_high||'',
    budget_currency:currentVersion.budget_currency||'USD',
    typical_event_count:currentVersion.typical_event_count||'',
    cultural_notes:currentVersion.cultural_notes||'',
    lgbtq_notes:currentVersion.lgbtq_notes||'',
    sources:currentVersion.sources||'',
    review_notes:currentVersion.review_notes||'',
    checklist_template:JSON.parse(JSON.stringify(currentVersion.checklist_template||[])),
    ceremony_sequence:JSON.parse(JSON.stringify(currentVersion.ceremony_sequence||[])),
    vendor_categories:JSON.parse(JSON.stringify(currentVersion.vendor_categories||[])),
    budget_allocation:JSON.parse(JSON.stringify(currentVersion.budget_allocation||[])),
  };
}
function renderMain(){
  const v=currentVersion;
  const canSubmit=v?.status==='draft';
  const canApprove=v?.status==='in_review';
  const canEdit=v?.status==='draft'||v?.status==='in_review';
  document.getElementById('main-content').innerHTML=\`
    <div class="page-title">\${TRAD_LABELS[currentTradition.slug]||currentTradition.name}</div>
    <div class="page-meta">
      <span>\${currentTradition.slug}</span><span>·</span><span>\${currentTradition.region||'—'}</span><span>·</span>
      \${v?\`<span class="badge badge-\${v.status}">\${v.status.replace('_',' ')}</span><span style="color:var(--muted)">v\${v.version_number}</span>\`:'<span class="badge badge-draft">no content yet</span>'}
    </div>
    <div class="action-bar">
      <div class="action-group">
        <button class="btn btn-gold" onclick="createEditingCopy()">✏️ Create editing copy</button>
        <span class="action-hint">Makes a copy to edit — live content stays unchanged</span>
      </div>
      \${canEdit?\`<button class="btn btn-outline" onclick="cancelEditing()">✕ Cancel editing</button>\`:''}
      <button class="btn btn-warning" onclick="submitForReview()" \${canSubmit?'':'disabled'}>📤 Submit for review</button>
      <button class="btn btn-success" onclick="approveVersion()" \${canApprove?'':'disabled'}>✅ Approve</button>
      <button class="btn btn-outline" onclick="rejectVersion()" \${canApprove?'':'disabled'}>❌ Reject</button>
    </div>
    <div class="tabs">
      <div class="tab \${activeTab==='content'?'active':''}" onclick="switchTab('content')">Content</div>
      <div class="tab \${activeTab==='versions'?'active':''}" onclick="switchTab('versions')">Version history</div>
      <div class="tab \${activeTab==='audit'?'active':''}" onclick="switchTab('audit')">Audit trail</div>
    </div>
    <div id="tab-content">
      \${activeTab==='content'?renderContentTab(v,canEdit):''}
      \${activeTab==='versions'?renderVersionsTab():''}
      \${activeTab==='audit'?'<div class="empty"><div class="spinner"></div></div>':''}
    </div>\`;
  if(activeTab==='audit')loadAuditTrail();
}
function switchTab(tab){activeTab=tab;renderMain();}
function renderContentTab(v,canEdit){
  if(!v)return\`<div class="empty"><div style="font-size:32px;margin-bottom:12px">📭</div><p>No content yet. Content is seeded by developers, then you review and approve it here.</p></div>\`;
  const dis=canEdit?'':'disabled';
  const banner=canEdit
    ?\`<div class="banner banner-editing"><span style="font-size:18px">✏️</span><div><div class="banner-title">Editing copy — version \${v.version_number}</div><div class="banner-sub">The live approved version is untouched. Your changes only go live once you approve this copy.</div></div></div>\`
    :\`<div class="banner banner-locked"><span style="font-size:18px">🔒</span><div><div class="banner-title">Live approved version (v\${v.version_number}) — read only</div><div class="banner-sub">Click "Create editing copy" to make an editable copy.</div></div></div>\`;
  return banner+\`
    <div class="section">
      <div class="section-title">Overview</div>
      <div class="field-group">
        <div class="field"><label>Average budget — low ($)</label><input type="number" value="\${workingData.avg_budget_low}" \${dis} oninput="workingData.avg_budget_low=this.value"></div>
        <div class="field"><label>Average budget — high ($)</label><input type="number" value="\${workingData.avg_budget_high}" \${dis} oninput="workingData.avg_budget_high=this.value"></div>
        <div class="field"><label>Currency</label><input type="text" value="\${workingData.budget_currency}" \${dis} oninput="workingData.budget_currency=this.value"></div>
        <div class="field"><label>Typical number of events</label><input type="number" value="\${workingData.typical_event_count}" \${dis} oninput="workingData.typical_event_count=this.value"></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Cultural notes</div>
      <div class="field">
        \${canEdit
          ? \`<div class="rich-editor-wrap">
              <div class="rich-editor-toolbar">
                <button onclick="execCmd('bold')" title="Bold"><b>B</b></button>
                <button onclick="execCmd('insertOrderedList')" title="Numbered list">1. List</button>
                <button onclick="execCmd('insertUnorderedList')" title="Bullet list">&#8226; List</button>
                <button onclick="execCmd('removeFormat')" title="Clear">Clear</button>
              </div>
              <div class="rich-editor-content" id="cultural-notes-editor" contenteditable="true"
                oninput="syncCulturalNotes()"
                onpaste="handlePaste(event)">\${htmlToEditor(workingData.cultural_notes)}</div>
            </div>\`
          : \`<div class="cultural-notes-rendered">\${renderCulturalNotes(workingData.cultural_notes)}</div>\`
        }
      </div>
    </div>
    <div class="section">
      <div class="section-title">Checklist (\${workingData.checklist_template.length} items)</div>
      <div class="section-sub">Tasks the couple or their family need to complete, with suggested timelines. Click any item to expand and edit it.</div>
      <div class="item-list" id="checklist-list">\${renderChecklistItems(canEdit)}</div>
      \${canEdit?\`<div class="add-item-btn" onclick="addChecklistItem()">+ Add checklist item</div>\`:''}
    </div>
    <div class="section">
      <div class="section-title">Ceremony sequence (\${workingData.ceremony_sequence.length} events)</div>
      <div class="section-sub">The events in this tradition, in order. Click any event to expand and edit it.</div>
      <div class="item-list" id="ceremony-list">\${renderCeremonyItems(canEdit)}</div>
      \${canEdit?\`<div class="add-item-btn" onclick="addCeremonyItem()">+ Add ceremony event</div>\`:''}
    </div>
    <div class="section">
      <div class="section-title">Vendor priorities (\${workingData.vendor_categories.length} categories)</div>
      <div class="section-sub">Vendors the couple will need to book, with budget guidance. Click any vendor to expand and edit.</div>
      <div class="item-list" id="vendor-list">\${renderVendorItems(canEdit)}</div>
      \${canEdit?\`<div class="add-item-btn" onclick="addVendorItem()">+ Add vendor category</div>\`:''}
    </div>
    <div class="section">
      <div class="section-title">Budget allocation (\${workingData.budget_allocation.length} categories)</div>
      <div class="section-sub">How the total wedding budget is typically split, shown as percentage ranges.</div>
      <div class="item-list" id="budget-list">\${renderBudgetItems(canEdit)}</div>
      \${canEdit?\`<div class="add-item-btn" onclick="addBudgetItem()">+ Add budget category</div>\`:''}
    </div>
    <div class="section">
      <div class="section-title">Same-sex &amp; LGBTQ+ adaptation notes</div>
      <div class="section-sub">How does this tradition adapt for same-sex couples? Which ceremonies change, which are gender-neutral, what terminology differs?</div>
      <div class="field">
        \${canEdit
          ? \`<div class="rich-editor-wrap">
              <div class="rich-editor-toolbar">
                <button onclick="execCmd('bold')"><b>B</b></button>
                <button onclick="execCmd('insertOrderedList')">1. List</button>
                <button onclick="execCmd('removeFormat')">Clear</button>
              </div>
              <div class="rich-editor-content" contenteditable="true"
                oninput="workingData.lgbtq_notes=editorToText(this)"
                onpaste="handlePaste(event)">\${htmlToEditor(workingData.lgbtq_notes||'')}</div>
            </div>\`
          : renderCulturalNotes(workingData.lgbtq_notes || '')
        }
      </div>
    </div>
    <div class="section">
      <div class="section-title">Sources &amp; verification notes</div>
      <div class="section-sub">Where this information came from, and what still needs to be verified by someone from this community.</div>
      <div class="field"><textarea rows="4" \${dis} oninput="workingData.sources=this.value">\${workingData.sources}</textarea></div>
    </div>
    \${canEdit?\`
    <div class="section">
      <div class="section-title">Review notes</div>
      <div class="section-sub">Notes for other reviewers — what you changed, questions, things to verify. These appear in the audit trail.</div>
      <div class="field"><textarea rows="3" oninput="workingData.review_notes=this.value">\${workingData.review_notes}</textarea></div>
    </div>
    <div class="save-bar">
      <button class="btn btn-primary" onclick="saveEdits()">Save changes</button>
      <button class="btn btn-outline" onclick="cancelEditing()">Cancel</button>
      <span class="save-bar-hint">Changes are not saved automatically</span>
    </div>\`:''}\`;
}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
// ── Rich text editor helpers ──
function execCmd(cmd) {
  document.getElementById('cultural-notes-editor')?.focus();
  document.execCommand(cmd, false, null);
}

function handlePaste(e) {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
}

function syncCulturalNotes() {
  const el = document.getElementById('cultural-notes-editor');
  if (!el) return;
  workingData.cultural_notes = editorToText(el);
}

// Convert stored plain text (with **bold** markers) to contenteditable HTML
function htmlToEditor(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/((?:^|\\n)\\d+\\. .+)+/gm, match => {
      const items = match.trim().split('\\n').map(l => '<li>' + l.replace(/^\\d+\\. /, '') + '</li>').join('');
      return '<ol>' + items + '</ol>';
    })
    .split('\\n\\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<ol>')) return p;
      return '<p>' + p.replace(/\\n/g, '<br>') + '</p>';
    }).join('');
}

// Convert contenteditable HTML back to plain text with **bold** markers
function editorToText(el) {
  function nodeToText(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    const tag = node.tagName?.toLowerCase();
    const inner = Array.from(node.childNodes).map(nodeToText).join('');
    if (tag === 'strong' || tag === 'b') return '**' + inner + '**';
    if (tag === 'p' || tag === 'div') return inner + '\\n\\n';
    if (tag === 'br') return '\\n';
    if (tag === 'ol' || tag === 'ul') {
      let i = 0;
      return Array.from(node.childNodes).filter(n=>n.tagName?.toLowerCase()==='li').map(li => {
        i++;
        return i + '. ' + Array.from(li.childNodes).map(nodeToText).join('').trim();
      }).join('\\n') + '\\n\\n';
    }
    if (tag === 'li') return inner;
    return inner;
  }
  return Array.from(el.childNodes).map(nodeToText).join('').replace(/\\n{3,}/g, '\\n\\n').trim();
}

// ── Diff engine — word-level diff between two plain text strings ──
function diffText(oldText, newText) {
  if (!oldText && !newText) return '<div class="diff-no-change">No content in either version.</div>';
  if (!oldText) return '<div class="diff-wrap">' + renderCulturalNotes(newText).replace(/<p>/g, '<p><ins class="diff-add">').replace(/<\\/p>/g, '</ins></p>') + '</div>';
  if (!newText) return '<div class="diff-wrap">' + renderCulturalNotes(oldText).replace(/<p>/g, '<p><del class="diff-del">').replace(/<\\/p>/g, '</del></p>') + '</div>';
  if (oldText === newText) return '<div class="diff-no-change">No changes to cultural notes in this draft.</div>';

  // Word-level diff using LCS
  const oldWords = tokenize(oldText);
  const newWords = tokenize(newText);
  const ops = lcs(oldWords, newWords);

  let html = '';
  let paraBuffer = '';

  ops.forEach(op => {
    const word = escHtml(op.text);
    if (op.type === 'equal') paraBuffer += word;
    else if (op.type === 'insert') paraBuffer += '<ins class="diff-add">' + word + '</ins>';
    else if (op.type === 'delete') paraBuffer += '<del class="diff-del">' + word + '</del>';
    if (op.text === '\\n\\n') { html += '<p>' + paraBuffer + '</p>'; paraBuffer = ''; }
  });
  if (paraBuffer.trim()) html += '<p>' + paraBuffer + '</p>';

  // Apply bold formatting
  html = html.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');

  return '<div class="diff-wrap">' + (html || '<div class="diff-no-change">No visible changes.</div>') + '</div>';
}

function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function tokenize(text) {
  // Split into words + punctuation + newlines, keeping delimiters
  return text.split(/(\\s+|\\*\\*|[.,!?;:—–])/).filter(t => t !== undefined);
}

function lcs(a, b) {
  // Simple LCS-based diff — produces array of {type, text} ops
  const m = a.length, n = b.length;
  // For performance cap at 300 tokens each
  if (m > 300 || n > 300) {
    // Fall back to paragraph-level diff
    return paragraphDiff(a.join(''), b.join(''));
  }
  const dp = Array.from({length:m+1}, ()=>new Array(n+1).fill(0));
  for(let i=m-1;i>=0;i--) for(let j=n-1;j>=0;j--)
    dp[i][j] = a[i]===b[j] ? dp[i+1][j+1]+1 : Math.max(dp[i+1][j],dp[i][j+1]);

  const ops = []; let i=0,j=0;
  while(i<m||j<n){
    if(i<m&&j<n&&a[i]===b[j]){ops.push({type:'equal',text:a[i]});i++;j++;}
    else if(j<n&&(i>=m||dp[i][j+1]>=dp[i+1][j])){ops.push({type:'insert',text:b[j]});j++;}
    else{ops.push({type:'delete',text:a[i]});i++;}
  }
  return ops;
}

function paragraphDiff(oldText, newText) {
  const oldParts = oldText.split('\\n\\n');
  const newParts = newText.split('\\n\\n');
  const ops = [];
  const maxLen = Math.max(oldParts.length, newParts.length);
  for(let i=0;i<maxLen;i++){
    const o = oldParts[i], n = newParts[i];
    if(o===n) ops.push({type:'equal',text:(o||'')+'\\n\\n'});
    else {
      if(o) ops.push({type:'delete',text:o+'\\n\\n'});
      if(n) ops.push({type:'insert',text:n+'\\n\\n'});
    }
  }
  return ops;
}

function renderCulturalNotes(text) {
  if (!text) return '<p style="color:#9A8A6A;font-style:italic;padding:8px 0">No cultural notes added yet.</p>';

  const t = text.trim();
  let html = '';
  
  // Split text into chunks by double newlines first, then single newlines
  // Handle the case where text is one long string with \\n separators
  const rawLines = t.split(/\\n/).map(l => l.trim());
  
  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    if (!line) { i++; continue; }
    
    // Numbered list item
    if (/^\\d+\\.\\s/.test(line)) {
      html += '<ol class="notes-list">';
      while (i < rawLines.length && /^\\d+\\.\\s/.test(rawLines[i].trim()) && rawLines[i].trim()) {
        const item = rawLines[i].trim().replace(/^\\d+\\.\\s/, '');
        html += '<li>' + applyBold(escHtml(item)) + '</li>';
        i++;
      }
      html += '</ol>';
      continue;
    }
    
    // Bold heading — line that is mostly or entirely bold
    const escaped = escHtml(line);
    if (/^\\*\\*[^*]+\\*\\*[:\\s]*$/.test(line)) {
      html += '<p class="notes-heading">' + applyBold(escaped) + '</p>';
      i++;
      continue;
    }
    
    // Regular paragraph — accumulate until blank line or new section
    let para = escaped;
    i++;
    while (i < rawLines.length && rawLines[i].trim() && 
           !/^\\d+\\.\\s/.test(rawLines[i]) && 
           !/^\\*\\*[^*]+\\*\\*[:\\s]*$/.test(rawLines[i])) {
      para += ' ' + escHtml(rawLines[i].trim());
      i++;
    }
    html += '<p>' + applyBold(para) + '</p>';
  }
  
  return html || '<p style="color:#9A8A6A;font-style:italic">No cultural notes added yet.</p>';
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function applyBold(s) {
  return s.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
}


function renderChecklistItems(canEdit){
  if(!workingData.checklist_template.length)return'<div style="padding:12px;color:var(--muted);font-size:13px">No items yet.</div>';
  return workingData.checklist_template.map((item,i)=>\`
    <div class="item-row">
      <div class="item-row-header" onclick="toggleItem('c\${i}')">
        <span class="item-row-label">\${esc(item.label)||'(no label)'}</span>
        <span class="item-row-meta">\${esc(item.milestone||'')} · \${item.type||''}</span>
        <span style="color:var(--muted);font-size:11px">▾</span>
      </div>
      <div class="item-row-body" id="c\${i}">
        <div class="item-fields">
          <div class="item-field"><label>When</label><input value="\${esc(item.milestone||'')}" \${canEdit?\`oninput="workingData.checklist_template[\${i}].milestone=this.value"\`:' disabled'} placeholder="e.g. 12 months before"></div>
          <div class="item-field"><label>Type</label><select \${canEdit?\`onchange="workingData.checklist_template[\${i}].type=this.value"\`:' disabled'}>\${['Required','Traditional','Optional','Universal'].map(t=>\`<option \${item.type===t?'selected':''}>\${t}</option>\`).join('')}</select></div>
          <div class="item-field full"><label>Task</label><input value="\${esc(item.label||'')}" \${canEdit?\`oninput="workingData.checklist_template[\${i}].label=this.value"\`:' disabled'}></div>
          <div class="item-field"><label>Who does this</label><input value="\${esc(item.assignee||'')}" \${canEdit?\`oninput="workingData.checklist_template[\${i}].assignee=this.value"\`:' disabled'}></div>
          <div class="item-field full"><label>Notes &amp; constraints</label><textarea \${canEdit?\`oninput="workingData.checklist_template[\${i}].notes=this.value"\`:' disabled'}>\${esc(item.notes||'')}</textarea></div>
        </div>
        \${canEdit?\`<div class="item-actions"><button class="btn btn-sm btn-danger" onclick="removeItem('checklist_template',\${i})">Remove item</button></div>\`:''}
      </div>
    </div>\`).join('');
}
function renderCeremonyItems(canEdit){
  if(!workingData.ceremony_sequence.length)return'<div style="padding:12px;color:var(--muted);font-size:13px">No events yet.</div>';
  return workingData.ceremony_sequence.map((item,i)=>\`
    <div class="item-row">
      <div class="item-row-header" onclick="toggleItem('e\${i}')">
        <span class="item-row-label">\${esc(item.name)||'(unnamed event)'}</span>
        <span class="item-row-meta">\${esc(item.timing||'')}</span>
        <span style="color:var(--muted);font-size:11px">▾</span>
      </div>
      <div class="item-row-body" id="e\${i}">
        <div class="item-fields three">
          <div class="item-field"><label>Event name</label><input value="\${esc(item.name||'')}" \${canEdit?\`oninput="workingData.ceremony_sequence[\${i}].name=this.value"\`:' disabled'}></div>
          <div class="item-field full"><label>Who is this for?</label>
          <div style="display:flex;gap:16px;padding:8px 0;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;font-weight:normal;text-transform:none;letter-spacing:0">
              <input type="checkbox" \${!canEdit?'disabled':''} 
                \${item.side==='bride'||item.side==='bride+groom'?'checked':''}
                onchange="setSide(workingData.ceremony_sequence[\${i}], 'bride', this.checked)">
              Bride
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;font-weight:normal;text-transform:none;letter-spacing:0">
              <input type="checkbox" \${!canEdit?'disabled':''} 
                \${item.side==='groom'||item.side==='bride+groom'?'checked':''}
                onchange="setSide(workingData.ceremony_sequence[\${i}], 'groom', this.checked)">
              Groom
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;font-weight:normal;text-transform:none;letter-spacing:0">
              <input type="checkbox" \${!canEdit?'disabled':''} 
                \${item.side==='both'?'checked':''}
                onchange="setSide(workingData.ceremony_sequence[\${i}], 'both', this.checked)">
              Both together
            </label>
          </div></div>
          <div class="item-field"><label>Timing</label><input value="\${esc(item.timing||'')}" \${canEdit?\`oninput="workingData.ceremony_sequence[\${i}].timing=this.value"\`:' disabled'} placeholder="e.g. day before"></div>
          <div class="item-field"><label>Duration</label><input value="\${esc(item.duration||'')}" \${canEdit?\`oninput="workingData.ceremony_sequence[\${i}].duration=this.value"\`:' disabled'}></div>
          <div class="item-field"><label>Typical guest count</label><input value="\${esc(item.typical_size||'')}" \${canEdit?\`oninput="workingData.ceremony_sequence[\${i}].typical_size=this.value"\`:' disabled'}></div>
          <div class="item-field"><label>Location type</label><input value="\${esc(item.location_type||'')}" \${canEdit?\`oninput="workingData.ceremony_sequence[\${i}].location_type=this.value"\`:' disabled'}></div>
          <div class="item-field full"><label>Notes</label><textarea \${canEdit?\`oninput="workingData.ceremony_sequence[\${i}].notes=this.value"\`:' disabled'}>\${esc(item.notes||'')}</textarea></div>
          <div class="item-field full">
            <label>Vendor categories <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--muted)">— tick all that apply to this ceremony</span></label>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
              \${'["Venue hire","Catering & bar","Photography & video","Music & entertainment","Florals & décor","Hair & makeup (bride)","Officiant / pandit / priest","Mehndi artist","Horse & procession","Dhol & band","Bridal wear & styling","Menswear & styling","Invitations & stationery","Lighting & AV","Cake & desserts","Transport (couple)","Guest accommodation","Henna for guests"]'.split(',').map(c=>c.replace(/[\\[\\]"]/g,'')).filter(c=>c).map(cat => {
                const checked = (item.vendor_categories||[]).some(v=>v.category===cat);
                return '<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border:1px solid '+(checked?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(checked?'var(--gold-light)':'white')+';font-size:11px;cursor:'+(canEdit?'pointer':'default')+';white-space:nowrap;margin:2px">'
                  + '<input type="checkbox" '+(checked?'checked ':' ')+(canEdit?'onchange="toggleVc('+i+',\\''+cat+'\\',this.checked)"':'disabled')+' style="accent-color:var(--gold)">'
                  + cat + '</label>';
              }).join('')}
            </div>
                      </div>
        </div>
        \${canEdit?\`<div class="item-actions"><button class="btn btn-sm btn-danger" onclick="removeItem('ceremony_sequence',\${i})">Remove event</button></div>\`:''}
      </div>
    </div>\`).join('');
}
function renderVendorItems(canEdit){
  if(!workingData.vendor_categories.length)return'<div style="padding:12px;color:var(--muted);font-size:13px">No vendor categories yet.</div>';
  return workingData.vendor_categories.map((item,i)=>\`
    <div class="item-row">
      <div class="item-row-header" onclick="toggleItem('v\${i}')">
        <span class="item-row-label">\${esc(item.category)||'(unnamed)'}</span>
        <span class="item-row-meta">\${item.priority||''} · \${item.typical_spend_pct_low||0}–\${item.typical_spend_pct_high||0}% of budget</span>
        <span style="color:var(--muted);font-size:11px">▾</span>
      </div>
      <div class="item-row-body" id="v\${i}">
        <div class="item-fields">
          <div class="item-field"><label>Vendor type</label><input value="\${esc(item.category||'')}" \${canEdit?\`oninput="workingData.vendor_categories[\${i}].category=this.value"\`:' disabled'}></div>
          <div class="item-field"><label>Priority</label><select \${canEdit?\`onchange="workingData.vendor_categories[\${i}].priority=this.value"\`:' disabled'}>\${['Required','Traditional','Optional'].map(t=>\`<option \${item.priority===t?'selected':''}>\${t}</option>\`).join('')}</select></div>
          <div class="item-field"><label>Typical spend % — low</label><input type="number" value="\${item.typical_spend_pct_low||''}" \${canEdit?\`oninput="workingData.vendor_categories[\${i}].typical_spend_pct_low=parseFloat(this.value)"\`:' disabled'}></div>
          <div class="item-field"><label>Typical spend % — high</label><input type="number" value="\${item.typical_spend_pct_high||''}" \${canEdit?\`oninput="workingData.vendor_categories[\${i}].typical_spend_pct_high=parseFloat(this.value)"\`:' disabled'}></div>
          <div class="item-field full"><label>Notes for the couple</label><textarea \${canEdit?\`oninput="workingData.vendor_categories[\${i}].notes=this.value"\`:' disabled'}>\${esc(item.notes||'')}</textarea></div>
        </div>
        \${canEdit?\`<div class="item-actions"><button class="btn btn-sm btn-danger" onclick="removeItem('vendor_categories',\${i})">Remove vendor</button></div>\`:''}
      </div>
    </div>\`).join('');
}
function renderBudgetItems(canEdit){
  if(!workingData.budget_allocation.length)return'<div style="padding:12px;color:var(--muted);font-size:13px">No budget categories yet.</div>';
  return workingData.budget_allocation.map((item,i)=>\`
    <div class="item-row">
      <div class="item-row-header" onclick="toggleItem('b\${i}')">
        <span class="item-row-label">\${esc(item.category)||'(unnamed)'}</span>
        <span class="item-row-meta">\${item.pct_low||0}–\${item.pct_high||0}% of total budget</span>
        <span style="color:var(--muted);font-size:11px">▾</span>
      </div>
      <div class="item-row-body" id="b\${i}">
        <div class="item-fields three">
          <div class="item-field"><label>Category name</label><input value="\${esc(item.category||'')}" \${canEdit?\`oninput="workingData.budget_allocation[\${i}].category=this.value"\`:' disabled'}></div>
          <div class="item-field"><label>% of budget — low</label><input type="number" value="\${item.pct_low||''}" \${canEdit?\`oninput="workingData.budget_allocation[\${i}].pct_low=parseFloat(this.value)"\`:' disabled'}></div>
          <div class="item-field"><label>% of budget — high</label><input type="number" value="\${item.pct_high||''}" \${canEdit?\`oninput="workingData.budget_allocation[\${i}].pct_high=parseFloat(this.value)"\`:' disabled'}></div>
          <div class="item-field full"><label>Notes</label><textarea rows="2" \${canEdit?\`oninput="workingData.budget_allocation[\${i}].notes=this.value"\`:' disabled'}>\${esc(item.notes||'')}</textarea></div>
        </div>
        \${canEdit?\`<div class="item-actions"><button class="btn btn-sm btn-danger" onclick="removeItem('budget_allocation',\${i})">Remove category</button></div>\`:''}
      </div>
    </div>\`).join('');
}
function toggleVc(i, cat, checked) {
  if (!workingData.ceremony_sequence[i].vendor_categories) workingData.ceremony_sequence[i].vendor_categories = [];
  if (checked) {
    // Add if not already present
    if (!workingData.ceremony_sequence[i].vendor_categories.some(function(v){ return v.category === cat; })) {
      workingData.ceremony_sequence[i].vendor_categories.push({category: cat, typical_pct_of_ceremony_budget: 0});
    }
  } else {
    // Remove
    workingData.ceremony_sequence[i].vendor_categories = workingData.ceremony_sequence[i].vendor_categories.filter(function(v){ return v.category !== cat; });
  }
  refreshLists();
}
function toggleItem(id){const el=document.getElementById(id);if(el)el.classList.toggle('open');}
// ============================================================================
// CUSTOM MODAL — replaces browser confirm() and prompt()
// ============================================================================
let _modalResolve = null;

function showModal({ title, body, input = false, inputPlaceholder = '', confirmLabel = 'OK', confirmClass = 'btn-primary', cancelLabel = 'Cancel' }) {
  return new Promise(resolve => {
    _modalResolve = resolve;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent = body;
    const inp = document.getElementById('modal-input');
    if (input) { inp.style.display = 'block'; inp.placeholder = inputPlaceholder; inp.value = ''; setTimeout(() => inp.focus(), 50); }
    else { inp.style.display = 'none'; }
    document.getElementById('modal-actions').innerHTML = \`
      <button class="btn btn-outline" onclick="closeModal(null)">\${cancelLabel}</button>
      <button class="btn \${confirmClass}" onclick="closeModal(\${input ? "'input'" : 'true'})">\${confirmLabel}</button>\`;
    var flAdv = document.getElementById('modal-flower-adv');
    if (flAdv && !flAdv.innerHTML) flAdv.innerHTML = '<svg width="32" height="32" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><g fill="#E0B030" stroke="#C8941A" stroke-width="0.4"><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(0 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(25.7 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(51.4 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(77.1 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(102.8 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(128.5 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(154.2 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(180 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(205.7 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(231.4 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(257.1 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(282.8 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(308.5 17 17)"/><ellipse cx="17" cy="5.8" rx="1.9" ry="4.4" transform="rotate(334.2 17 17)"/></g><g fill="#F7D44C" stroke="#E0B030" stroke-width="0.3"><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(0 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(20 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(60 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(120 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(180 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(240 17 17)"/><ellipse cx="17" cy="10.2" rx="1.3" ry="2.4" transform="rotate(300 17 17)"/></g><circle cx="17" cy="17" r="4.1" fill="#6B5318" stroke="#5A4512" stroke-width="0.3"/></svg>';
    document.getElementById('custom-modal').style.display = 'flex';
  });
}

function closeModal(result) {
  const val = result === "'input'" ? document.getElementById('modal-input').value.trim() : result;
  document.getElementById('custom-modal').style.display = 'none';
  if (_modalResolve) { _modalResolve(val); _modalResolve = null; }
}

// Allow Enter key to confirm in input modals
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('custom-modal').style.display !== 'none') {
    const inp = document.getElementById('modal-input');
    if (inp.style.display !== 'none') closeModal("'input'");
    else closeModal(true);
  }
  if (e.key === 'Escape' && document.getElementById('custom-modal').style.display !== 'none') closeModal(null);
});

function removeItem(field,index){
  showModal({ title:'Remove item', body:'Are you sure you want to remove this item?', confirmLabel:'Remove', confirmClass:'btn-danger' })
  .then(ok => { if(ok){ workingData[field].splice(index,1); refreshLists(); } });
}
function addChecklistItem(){workingData.checklist_template.push({milestone:'',label:'',assignee:'',notes:'',type:'Required'});refreshLists();openLast('c',workingData.checklist_template.length-1);}
function addCeremonyItem(){workingData.ceremony_sequence.push({order:workingData.ceremony_sequence.length+1,name:'',timing:'',duration:'',typical_size:'',location_type:'',notes:''});refreshLists();openLast('e',workingData.ceremony_sequence.length-1);}
function addVendorItem(){workingData.vendor_categories.push({category:'',tag:'',priority:'Required',typical_spend_pct_low:0,typical_spend_pct_high:0,notes:''});refreshLists();openLast('v',workingData.vendor_categories.length-1);}
function addBudgetItem(){workingData.budget_allocation.push({category:'',pct_low:0,pct_high:0,notes:''});refreshLists();openLast('b',workingData.budget_allocation.length-1);}
function openLast(prefix,idx){setTimeout(()=>{const el=document.getElementById(prefix+idx);if(el){el.classList.add('open');el.scrollIntoView({behavior:'smooth',block:'center'});}},50);}
function refreshLists(){
  const canEdit=currentVersion?.status==='draft'||currentVersion?.status==='in_review';
  const maps=[['checklist-list',renderChecklistItems],['ceremony-list',renderCeremonyItems],['vendor-list',renderVendorItems],['budget-list',renderBudgetItems]];
  maps.forEach(([id,fn])=>{const el=document.getElementById(id);if(el)el.innerHTML=fn(canEdit);});
}
function renderVersionsTab(){
  if(!allVersions.length)return'<div class="empty">No versions yet.</div>';
  const approved = allVersions.find(v=>v.is_current && v.status==='approved');
  const draft = allVersions.find(v=>v.status==='draft'||v.status==='in_review');
  const list = allVersions.map(v=>\`
    <div class="version-item \${v.is_current?'current':''}">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-weight:600">Version \${v.version_number}</span>
        <span class="badge badge-\${v.status}">\${v.status.replace('_',' ')}</span>
        \${v.is_current?'<span class="badge badge-approved" style="font-size:10px">LIVE</span>':''}
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;color:var(--muted)">\${new Date(v.proposed_at).toLocaleDateString()}</span>
        \${v.id!==currentVersion?.id?\`<button class="btn btn-outline btn-sm" onclick="loadVersion('\${v.id}')">View</button>\`:'<span style="font-size:12px;color:var(--muted)">viewing</span>'}
      </div>
    </div>\`).join('');

  const diffSection = (draft && approved && draft.id !== approved.id) ? \`
    <div style="margin-top:28px">
      <div class="section-title" style="margin-bottom:12px">Changes in draft (v\${draft.version_number}) vs approved (v\${approved.version_number})</div>
      <div class="diff-legend">
        <span><div class="diff-dot-add"></div> Added</span>
        <span><div class="diff-dot-del"></div> Removed</span>
      </div>
      <div style="margin-bottom:20px">
        <div class="section-sub" style="margin-bottom:8px">Cultural notes</div>
        <div class="diff-wrap">\${diffText(approved.cultural_notes||'', draft.cultural_notes||'')}</div>
      </div>
    </div>\` : (draft && !approved ? \`
    <div style="margin-top:28px;padding:12px;background:#FFF8E0;border-radius:6px;font-size:13px;color:var(--muted)">
      This is the first version — no approved version to compare against.
    </div>\` : '');

  return list + diffSection;
}
async function loadVersion(versionId){
  try{currentVersion=await api('/versions/'+versionId);initWorkingData();activeTab='content';renderMain();}
  catch(e){toast('Failed: '+e.message,'error');}
}
async function loadAuditTrail(){
  try{
    const audit=await api('/traditions/'+currentTradition.id+'/audit');
    document.getElementById('tab-content').innerHTML=audit.length
      ?audit.map(a=>\`<div class="audit-item"><div class="audit-dot \${a.action}"></div><div><div class="audit-action">\${a.action.replace(/_/g,' ')}</div><div class="audit-meta">\${new Date(a.created_at).toLocaleString()}</div>\${a.notes?\`<div class="audit-notes">\${esc(a.notes)}</div>\`:''}</div></div>\`).join('')
      :'<div class="empty">No audit entries yet.</div>';
  }catch(e){document.getElementById('tab-content').innerHTML=\`<div class="empty">Failed: \${e.message}</div>\`;}
}
async function createEditingCopy(){
  try{
    const newV=await api('/traditions/'+currentTradition.id+'/draft','POST',{base:currentVersion});
    toast('Editing copy created (version '+newV.version_number+')','success');
    allVersions=await api('/traditions/'+currentTradition.id+'/versions');
    currentVersion=newV;initWorkingData();activeTab='content';renderMain();
  }catch(e){toast('Failed: '+e.message,'error');}
}
async function cancelEditing(){
  const ok = await showModal({ title:'Discard editing copy?', body:'All unsaved changes will be lost. The editing copy will be deleted and the live approved version will be restored.', confirmLabel:'Discard', confirmClass:'btn-danger' });
  if(!ok)return;
  try{
    await api('/versions/'+currentVersion.id+'/cancel','POST');
  }catch(e){}
  allVersions=await api('/traditions/'+currentTradition.id+'/versions');
  const approved=allVersions.find(v=>v.is_current&&v.status==='approved');
  currentVersion=approved||allVersions.find(v=>v.status!=='draft')||allVersions[allVersions.length-1]||null;
  initWorkingData();await loadTraditions();renderMain();
  toast('Editing copy discarded');
}
async function saveEdits(){
  const updates={
    avg_budget_low:parseFloat(workingData.avg_budget_low)||null,
    avg_budget_high:parseFloat(workingData.avg_budget_high)||null,
    budget_currency:workingData.budget_currency||'USD',
    typical_event_count:parseInt(workingData.typical_event_count)||null,
    cultural_notes:workingData.cultural_notes,
        lgbtq_notes:workingData.lgbtq_notes,
    sources:workingData.sources,
    review_notes:workingData.review_notes,
    checklist_template:workingData.checklist_template,
    ceremony_sequence:workingData.ceremony_sequence,
    vendor_categories:workingData.vendor_categories,
    budget_allocation:workingData.budget_allocation,
  };
  try{
    currentVersion=await api('/versions/'+currentVersion.id,'PATCH',updates);
    initWorkingData();toast('Changes saved','success');
    allVersions=await api('/traditions/'+currentTradition.id+'/versions');renderMain();
  }catch(e){toast('Save failed: '+e.message,'error');}
}
async function submitForReview(){
  try{currentVersion=await api('/versions/'+currentVersion.id+'/submit','POST');toast('Submitted for review');allVersions=await api('/traditions/'+currentTradition.id+'/versions');await loadTraditions();renderMain();}
  catch(e){toast('Failed: '+e.message,'error');}
}
async function approveVersion(){
  const notes = await showModal({ title:'Approve this version?', body:'This version will become live immediately. Add any notes for the audit trail (optional).', input:true, inputPlaceholder:'Approval notes (optional)', confirmLabel:'Approve', confirmClass:'btn-success' });
  if(notes === null)return;
  const finalNotes = notes || 'Approved via advisor review interface.';
  try{currentVersion=await api('/versions/'+currentVersion.id+'/approve','POST',{notes:finalNotes});toast('Version approved — now live','success');allVersions=await api('/traditions/'+currentTradition.id+'/versions');await loadTraditions();renderMain();}
  catch(e){toast('Failed: '+e.message,'error');}
}
async function rejectVersion(){
  const notes = await showModal({ title:'Return to draft?', body:'Please explain what needs to be changed. This note will appear in the audit trail.', input:true, inputPlaceholder:'Reason for rejection (required)', confirmLabel:'Return to draft', confirmClass:'btn-warning' });
  if(!notes)return;
  try{currentVersion=await api('/versions/'+currentVersion.id+'/reject','POST',{notes});toast('Returned to draft');allVersions=await api('/traditions/'+currentTradition.id+'/versions');renderMain();}
  catch(e){toast('Failed: '+e.message,'error');}
}
function setSide(item, role, checked) {
  var cur = item.side || 'both';
  if (role === 'both') {
    item.side = checked ? 'both' : 'bride';
  } else if (role === 'bride') {
    if (checked) {
      item.side = (cur === 'groom' || cur === 'bride+groom') ? 'bride+groom' : 'bride';
    } else {
      item.side = (cur === 'bride+groom') ? 'groom' : 'both';
    }
  } else if (role === 'groom') {
    if (checked) {
      item.side = (cur === 'bride' || cur === 'bride+groom') ? 'bride+groom' : 'groom';
    } else {
      item.side = (cur === 'bride+groom') ? 'bride' : 'both';
    }
  }
}
function toast(msg,type='default'){
  const el=document.getElementById('toast');
  const msgEl=document.getElementById('toast-msg');
  if(msgEl) msgEl.textContent=msg; else el.textContent=msg;
  el.className='toast visible'+(type==='error'?' error':type==='success'?' success':'');
  setTimeout(()=>el.className='toast',3000);
}
</script>
</body>
</html>
`;


// ── Routes: brand CSS (single source of truth) ──
app.get('/brand.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(BRAND_CSS);
});

// ── Routes: pages ──
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(LANDING_HTML);
});

// /questionnaire is served as a static file by Vercel (see vercel.json)
// This route is a fallback for local development only
const QUESTIONNAIRE_HTML = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>Marigold \u2014 Your wedding plan</title>\n<link rel=\"stylesheet\" href=\"/brand.css\">\n<style>\n  html, body { height: 100%; overflow: hidden; }\n\n  /* \u2500\u2500 Progress bar \u2500\u2500 */\n  #progress-bar {\n    position: fixed;\n    top: 0; left: 0; right: 0;\n    height: 2px;\n    background: var(--bdr);\n    z-index: 200;\n  }\n  #progress-fill {\n    height: 100%;\n    background: var(--gd);\n    transition: width 0.5s ease;\n    width: 0%;\n  }\n\n  /* \u2500\u2500 Screens \u2500\u2500 */\n  #screens {\n    position: fixed;\n    inset: 0;\n    top: 62px;\n    overflow: hidden;\n  }\n  #results-screen.active {\n    position: absolute;\n    inset: 0;\n    overflow-y: auto;\n    z-index: 10;\n    display: block;\n    padding: 32px 24px 80px;\n  }\n\n  .screen {\n    position: absolute;\n    inset: 0;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 48px 24px 80px;\n    opacity: 0;\n    pointer-events: none;\n    transform: translateX(50px);\n    transition: opacity 0.35s ease, transform 0.35s ease;\n  }\n  .screen.active {\n    opacity: 1;\n    pointer-events: all;\n    transform: translateX(0);\n  }\n  #q7.active, #q8.active { display: block !important; padding: 0 !important; }\n  #q7-scroll::-webkit-scrollbar { width: 5px; }\n  #q7-scroll::-webkit-scrollbar-track { background: var(--warm); border-radius: 3px; }\n  #q7-scroll::-webkit-scrollbar-thumb { background: var(--bdr); border-radius: 3px; }\n  #q7-scroll::-webkit-scrollbar-thumb:hover { background: var(--gd); }\n  #q7-scroll { scrollbar-width: thin; scrollbar-color: var(--bdr) var(--warm); }\n  /* Q7 and Q8 need block layout for internal scrolling */\n  #q7.active, #q8.active {\n    display: flex !important;\n    flex-direction: column !important;\n    padding: 0 !important;\n  }\n  .screen.exit-left {\n    opacity: 0;\n    transform: translateX(-50px);\n    transition: opacity 0.25s ease, transform 0.25s ease;\n  }\n\n  /* \u2500\u2500 Question layout \u2500\u2500 */\n  .q-wrap {\n    width: 100%;\n    max-width: 580px;\n  }\n  .q0-choice { display:flex; flex-direction:column; gap:16px; margin-top:32px; width:100%; }\n  .q0-option { padding:20px 24px; border:1.5px solid var(--bdr); border-radius:12px; background:white; cursor:pointer; text-align:left; transition:all 0.2s; font-family:'Playfair Display',Georgia,serif; }\n  .q0-option:hover { border-color:var(--gd); background:var(--warm); }\n  .q0-option-title { font-size:16px; font-style:italic; color:var(--deep); margin-bottom:4px; }\n  .q0-option-sub { font-size:12px; color:var(--muted); font-style:italic; }\n  .q0-textarea { width:100%; min-height:120px; border:1px solid var(--bdr); border-radius:8px; padding:14px; font-size:14px; font-family:'Playfair Display',Georgia,serif; font-style:italic; color:var(--tx); background:var(--warm); outline:none; resize:vertical; transition:border-color 0.2s; margin-top:8px; box-sizing:border-box; }\n  .q0-textarea:focus { border-color:var(--gd); }\n  .q0-textarea::placeholder { color:var(--bdr); }\n  .ql {\n    font-size: 10px;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    color: var(--muted);\n    margin-bottom: 8px;\n  }\n  .qt {\n    font-size: clamp(20px, 3.5vw, 30px);\n    line-height: 1.3;\n    color: var(--deep);\n    font-style: italic;\n    font-weight: 400;\n    margin-bottom: 6px;\n  }\n  .qt em { color: var(--gk); font-style: italic; }\n  .qs {\n    font-size: 13px;\n    color: var(--muted);\n    margin-bottom: 24px;\n    font-style: normal;\n    line-height: 1.6;\n  }\n\n  /* \u2500\u2500 Inputs \u2500\u2500 */\n  .name-row {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 20px;\n    margin-bottom: 4px;\n  }\n  @media (max-width: 480px) { .name-row { grid-template-columns: 1fr; } }\n\n  .field-group { display: flex; flex-direction: column; gap: 4px; }\n  .field-label {\n    font-size: 10px;\n    letter-spacing: 1.5px;\n    text-transform: uppercase;\n    color: var(--muted);\n    font-style: normal;\n    font-family: 'Playfair Display', serif;\n  }\n\n  .fi {\n    width: 100%;\n    border: none;\n    border-bottom: 1px solid var(--bdr);\n    padding: 10px 0;\n    font-size: 18px;\n    font-family: 'Playfair Display', Georgia, serif;\n    font-style: italic;\n    color: var(--tx);\n    background: transparent;\n    outline: none;\n    transition: border-color 0.2s;\n  }\n  .fi:focus { border-bottom-color: var(--deep); }\n  .fi::placeholder { color: var(--bdr); }\n  input[type=\"date\"].fi, input[type=\"date\"] {\n    font-style: normal;\n    font-size: 15px;\n    font-family: 'Playfair Display', Georgia, serif;\n    color: var(--deep);\n    -webkit-appearance: none;\n    appearance: none;\n  }\n  input[type=\"date\"]::-webkit-date-and-time-value { font-family: 'Playfair Display', Georgia, serif; }\n\n  /* \u2500\u2500 Option pills \u2500\u2500 */\n  .options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }\n  .p {\n    padding: 10px 20px;\n    border-radius: 100px;\n    border: 1px solid var(--bdr);\n    font-size: 14px;\n    color: var(--tx);\n    cursor: pointer;\n    background: #fff;\n    font-family: 'Playfair Display', Georgia, serif;\n    font-style: italic;\n    transition: all 0.15s;\n    text-align: left;\n  }\n  .p:hover { border-color: var(--gd); background: var(--warm); }\n  .p.on { border-color: var(--gk); background: var(--g); color: var(--deep); font-weight: 500; }\n\n  /* \u2500\u2500 Tradition search \u2500\u2500 */\n  .trad-search {\n    width: 100%;\n    border: none;\n    border-bottom: 1px solid var(--bdr);\n    padding: 10px 0;\n    font-size: 15px;\n    font-family: 'Playfair Display', serif;\n    font-style: italic;\n    color: var(--tx);\n    background: transparent;\n    outline: none;\n    margin-bottom: 16px;\n    transition: border-color 0.2s;\n  }\n  .trad-search:focus { border-bottom-color: var(--deep); }\n  .trad-search::placeholder { color: var(--bdr); }\n\n  .trad-grid {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n    max-height: 240px;\n    overflow-y: auto;\n    padding-right: 4px;\n  }\n  .trad-grid::-webkit-scrollbar { width: 3px; }\n  .trad-grid::-webkit-scrollbar-thumb { background: var(--bdr); border-radius: 2px; }\n\n  .trad-chip {\n    padding: 7px 16px;\n    border-radius: 100px;\n    border: 1px solid var(--bdr);\n    font-size: 13px;\n    font-family: 'Playfair Display', serif;\n    font-style: italic;\n    color: var(--tx);\n    cursor: pointer;\n    background: #fff;\n    transition: all 0.15s;\n  }\n  .trad-chip:hover { border-color: var(--gd); background: var(--warm); }\n  .trad-chip.on { border-color: var(--gk); background: var(--g); color: var(--deep); }\n  .trad-note {\n    font-size: 11px;\n    color: var(--muted);\n    font-style: italic;\n    margin-top: 10px;\n  }\n\n  /* \u2500\u2500 Budget \u2500\u2500 */\n  .budget-display {\n    font-size: 44px;\n    color: var(--deep);\n    font-style: italic;\n    letter-spacing: -1px;\n    margin-bottom: 4px;\n  }\n  .budget-display sup { font-size: 22px; vertical-align: super; }\n  input[type=\"range\"] {\n    width: 100%;\n    margin: 14px 0 6px;\n    accent-color: var(--gd);\n    cursor: pointer;\n  }\n  .budget-labels {\n    display: flex;\n    justify-content: space-between;\n    font-size: 11px;\n    color: var(--muted);\n    font-style: italic;\n  }\n\n  /* \u2500\u2500 Guest stepper \u2500\u2500 */\n  .stepper {\n    display: flex;\n    align-items: center;\n    gap: 20px;\n    margin-bottom: 8px;\n  }\n  .stepper-btn {\n    width: 44px; height: 44px;\n    border-radius: 50%;\n    border: 1px solid var(--bdr);\n    background: #fff;\n    font-size: 22px;\n    cursor: pointer;\n    color: var(--tx);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: all 0.15s;\n    font-family: 'Playfair Display', serif;\n  }\n  .stepper-btn:hover { border-color: var(--gd); background: var(--warm); }\n  .stepper-count {\n    font-size: 48px;\n    color: var(--deep);\n    font-style: italic;\n    min-width: 80px;\n    text-align: center;\n    letter-spacing: -2px;\n  }\n\n  /* \u2500\u2500 CTA \u2500\u2500 */\n  .cta-row { display: flex; align-items: center; gap: 20px; margin-top: 28px; }\n  .cta {\n    display: inline-flex;\n    align-items: center;\n    gap: 10px;\n    padding: 12px 28px;\n    background: var(--deep);\n    color: var(--cream);\n    border: none;\n    border-radius: 100px;\n    font-size: 12px;\n    letter-spacing: 2px;\n    cursor: pointer;\n    font-family: 'Playfair Display', Georgia, serif;\n    font-style: italic;\n    transition: background 0.2s;\n  }\n  .cta:hover { background: var(--gk); }\n  .cta:disabled { opacity: 0.4; cursor: not-allowed; }\n  .btn-back {\n    background: none;\n    border: none;\n    color: var(--muted);\n    font-size: 12px;\n    font-family: 'Playfair Display', Georgia, serif;\n    font-style: italic;\n    cursor: pointer;\n    padding: 4px 0;\n    letter-spacing: 0.3px;\n    transition: color 0.15s;\n  }\n  .btn-back:hover { color: var(--deep); }\n  /* \u2500\u2500 Role assignment \u2500\u2500 */\n  .role-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:4px; }\n  @media(max-width:480px){.role-row{grid-template-columns:1fr;}}\n  .role-pair { display:flex; flex-direction:column; gap:8px; }\n  .role-name { font-size:12px; color:var(--muted); font-style:italic; }\n  .role-options { display:flex; gap:8px; }\n  .role-btn {\n    flex:1; padding:10px 0; border:1px solid var(--bdr); border-radius:100px;\n    font-size:13px; font-family:'Playfair Display',serif; font-style:italic;\n    color:var(--muted); background:white; cursor:pointer; transition:all 0.15s;\n  }\n  .role-btn:hover { border-color:var(--gd); color:var(--deep); }\n  .role-btn.on { border-color:var(--gk); background:var(--g); color:var(--deep); font-weight:500; }\n\n  /* \u2500\u2500 Q4b tradition assignment \u2500\u2500 */\n  .trad-assign-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--warm); }\n  .trad-assign-row:last-child { border-bottom:none; }\n  .trad-assign-name { font-size:14px; font-style:italic; color:var(--deep); }\n  .trad-assign-btns { display:flex; gap:8px; }\n  .assign-btn {\n    padding:7px 16px; border:1px solid var(--bdr); border-radius:100px;\n    font-size:12px; font-family:'Playfair Display',serif; font-style:italic;\n    color:var(--muted); background:white; cursor:pointer; transition:all 0.15s;\n  }\n  .assign-btn:hover { border-color:var(--gd); color:var(--deep); }\n  .assign-btn.on { border-color:var(--gk); background:var(--g); color:var(--deep); }\n\n  /* \u2500\u2500 Role custom dropdown \u2500\u2500 */\n  .role-sentences { display:flex; flex-direction:column; gap:16px; }\n  .role-sentence { display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }\n  .role-sentence-name { font-size:15px; font-style:italic; color:var(--deep); font-family:'Playfair Display',Georgia,serif; }\n  .role-sentence-is { font-size:14px; color:var(--muted); font-style:italic; font-family:'Playfair Display',Georgia,serif; }\n  .role-dropdown { position:relative; display:inline-block; }\n  .role-dd-value { font-size:15px; font-style:italic; font-family:'Playfair Display',Georgia,serif; color:var(--deep); border-bottom:1.5px solid var(--gd); padding:2px 4px; cursor:pointer; user-select:none; }\n  .role-dd-value:hover { color:var(--gk); }\n  .role-dd-menu { display:none; position:absolute; top:calc(100% + 4px); left:0; background:white; border:1px solid var(--bdr); border-radius:8px; box-shadow:0 4px 16px rgba(60,48,16,0.08); z-index:50; min-width:100px; overflow:hidden; }\n  .role-dd-menu.open { display:block; }\n  .role-dd-menu div { padding:8px 14px; font-size:14px; font-style:italic; font-family:'Playfair Display',Georgia,serif; color:var(--deep); cursor:pointer; }\n  .role-dd-menu div:hover { background:var(--warm); }\n  .back-link {\n    background: none;\n    border: none;\n    color: var(--muted);\n    font-size: 11px;\n    letter-spacing: 1px;\n    cursor: pointer;\n    font-family: 'Playfair Display', Georgia, serif;\n    font-style: italic;\n    text-decoration: underline;\n  }\n\n  /* \u2500\u2500 Error \u2500\u2500 */\n  .err {\n    font-size: 12px;\n    color: #a04a1a;\n    font-style: italic;\n    margin-top: 8px;\n    display: none;\n  }\n  .err.show { display: block; }\n\n  /* \u2500\u2500 Loading \u2500\u2500 */\n  #loading-screen {\n    gap: 20px;\n  }\n  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n  .marigold-spin { animation: spin 2.5s linear infinite; }\n  .loading-text { font-size: 18px; font-style: italic; color: var(--muted); }\n  .loading-sub { font-size: 12px; color: var(--muted); font-style: italic; letter-spacing: 0.3px; }\n\n  /* \u2500\u2500 Results \u2500\u2500 */\n  #results-screen {\n    overflow-y: auto;\n    padding: 32px 24px 80px;\n    align-items: flex-start;\n    justify-content: flex-start;\n    top: 57px;\n  }\n  #results-screen.active {\n    position: absolute;\n    inset: 0;\n    overflow-y: auto;\n    opacity: 1;\n    transform: none;\n    z-index: 10;\n  }\n  .results-wrap { width: 100%; max-width: 720px; margin: 0 auto; background: #FDFAF0; }\n  .results-hero { margin-bottom: 40px; }\n  .results-hero h1 {\n    font-size: clamp(22px, 4vw, 36px);\n    font-weight: 400;\n    font-style: italic;\n    color: var(--deep);\n    line-height: 1.2;\n    margin-bottom: 8px;\n  }\n  .results-hero h1 em { color: var(--gk); }\n  .results-hero p { font-size: 13px; color: var(--muted); font-style: italic; }\n\n  .out-tabs {\n    display: flex;\n    border-bottom: 1px solid var(--bdr);\n    margin-bottom: 32px;\n    overflow-x: auto;\n  }\n  .out-tab {\n    padding: 10px 0;\n    margin-right: 24px;\n    font-size: 11px;\n    letter-spacing: 1.5px;\n    color: var(--muted);\n    cursor: pointer;\n    border: none;\n    border-bottom: 2px solid transparent;\n    background: transparent;\n    font-family: 'Playfair Display', serif;\n    font-style: italic;\n    transition: all 0.2s;\n    white-space: nowrap;\n    flex-shrink: 0;\n  }\n  .out-tab:hover { color: var(--deep); }\n  .out-tab.on { color: var(--deep); border-bottom-color: var(--deep); }\n\n  .tab-panel { display: none; background: #FDFAF0; }\n  .tab-panel.on { display: block; background: #FDFAF0; }\n\n  /* \u2500\u2500 Checklist \u2500\u2500 */\n  .out-ey {\n    font-size: 10px;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    color: var(--muted);\n    margin-bottom: 14px;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n  }\n  .out-ey::after { content: ''; flex: 1; height: 1px; background: var(--bdr); }\n\n  .checklist-item {\n    display: flex;\n    align-items: flex-start;\n    gap: 12px;\n    padding: 11px 0;\n    border-bottom: 1px solid var(--warm);\n  }\n  .checklist-item:last-child { border-bottom: none; }\n  .check-box {\n    width: 18px; height: 18px;\n    border: 1px solid var(--bdr);\n    border-radius: 3px;\n    flex-shrink: 0;\n    margin-top: 3px;\n    cursor: pointer;\n    transition: all 0.15s;\n    background: #fff;\n  }\n  .check-box:hover { border-color: var(--gd); }\n  .check-box.checked { background: var(--deep); border-color: var(--deep); }\n  .check-label {\n    font-size: 14px;\n    color: var(--tx);\n    font-style: normal;\n    line-height: 1.5;\n    font-family: 'Playfair Display', serif;\n  }\n  .trad-tag {\n    display: inline-block;\n    font-size: 10px;\n    padding: 1px 8px;\n    border-radius: 100px;\n    margin-left: 6px;\n    font-style: italic;\n    vertical-align: middle;\n    border: 1px solid var(--bdr);\n    color: var(--muted);\n    background: var(--warm);\n  }\n\n  /* \u2500\u2500 Vertical ceremony timeline \u2500\u2500 */\n  .ceremony-timeline { position: relative; padding-left: 28px; }\n  .ceremony-timeline::before {\n    content: '';\n    position: absolute;\n    left: 9px; top: 8px; bottom: 8px;\n    width: 1px;\n    background: var(--bdr);\n  }\n  .ceremony-card {\n    position: relative;\n    margin-bottom: 0;\n    cursor: pointer;\n  }\n  .ceremony-dot {\n    position: absolute;\n    left: -24px;\n    top: 20px;\n    width: 10px;\n    height: 10px;\n    border-radius: 50%;\n    border: 2px solid var(--cream);\n    flex-shrink: 0;\n    z-index: 1;\n    transition: transform 0.2s;\n  }\n  .ceremony-card:hover .ceremony-dot { transform: scale(1.3); }\n  .ceremony-header {\n    display: flex;\n    align-items: flex-start;\n    gap: 12px;\n    padding: 14px 0 14px 0;\n    border-bottom: 1px solid var(--warm);\n  }\n  .ceremony-card.open .ceremony-header { border-bottom-color: transparent; }\n  .ceremony-meta-wrap { flex: 1; }\n  .ceremony-trad-tag {\n    display: inline-block;\n    font-size: 10px;\n    letter-spacing: 0.5px;\n    padding: 2px 10px;\n    border-radius: 100px;\n    font-style: italic;\n    margin-bottom: 4px;\n  }\n  .ceremony-name {\n    font-size: 15px;\n    color: var(--deep);\n    font-style: italic;\n    line-height: 1.3;\n    margin-bottom: 3px;\n  }\n  .ceremony-timing {\n    font-size: 12px;\n    color: var(--muted);\n    font-style: italic;\n  }\n  .ceremony-toggle {\n    font-size: 18px;\n    color: var(--muted);\n    transition: transform 0.25s;\n    flex-shrink: 0;\n    margin-top: 2px;\n    user-select: none;\n  }\n  .ceremony-card.open .ceremony-toggle { transform: rotate(90deg); }\n  .ceremony-body {\n    display: none;\n    padding: 0 0 16px 0;\n    border-bottom: 1px solid var(--warm);\n  }\n  .ceremony-card.open .ceremony-body { display: block; }\n  .ceremony-detail { font-size: 13px; color: var(--tx); line-height: 1.7; font-style: normal; }\n  .ceremony-detail-row {\n    display: grid;\n    grid-template-columns: 100px 1fr;\n    gap: 4px 12px;\n    margin-bottom: 6px;\n    font-size: 12px;\n  }\n  .ceremony-detail-label { color: var(--muted); font-style: italic; }\n  .ceremony-detail-val { color: var(--tx); }\n  .ceremony-notes {\n    font-size: 12px;\n    color: var(--muted);\n    font-style: italic;\n    line-height: 1.6;\n    margin-top: 10px;\n    padding-top: 10px;\n    border-top: 1px solid var(--warm);\n  }\n  .ceremony-include {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    margin-top: 10px;\n    font-size: 12px;\n    color: var(--muted);\n    font-style: italic;\n  }\n  .ceremony-include input { accent-color: var(--gd); }\n\n  /* \u2500\u2500 Ceremony selection page \u2500\u2500 */\n  .ceremony-selection-wrap { width:100%; max-width:860px; margin:0 auto; }\n  .cs-tradition-block { margin-bottom:40px; }\n  .cs-tradition-label { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .cs-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }\n  @media(max-width:580px){ .cs-cols { grid-template-columns:1fr; } }\n  .cs-col-header { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--deep); margin-bottom:10px; font-style:italic; font-weight:500; }\n  .cs-item { display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border:1px solid var(--bdr); border-radius:8px; margin-bottom:8px; cursor:pointer; transition:all 0.15s; background:white; }\n  .cs-item:hover { border-color:var(--gd); }\n  .cs-item.selected { border-color:var(--gk); background:#FFFAEA; }\n  .cs-item.deselected { opacity:0.4; }\n  .cs-check { width:18px; height:18px; border:1.5px solid var(--bdr); border-radius:4px; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }\n  .cs-item.selected .cs-check { background:var(--deep); border-color:var(--deep); }\n  .cs-check-tick { color:white; font-size:11px; display:none; }\n  .cs-item.selected .cs-check-tick { display:block; }\n  .cs-item-name { font-size:13px; color:var(--tx); font-style:italic; line-height:1.4; }\n  .cs-item-timing { font-size:11px; color:var(--muted); font-style:italic; margin-top:2px; }\n  .cs-shared-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:20px 0 10px; font-style:italic; display:flex; align-items:center; gap:8px; }\n  .cs-shared-label::after { content:''; flex:1; height:1px; background:var(--bdr); }\n  .cs-shared-cols { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }\n  @media(max-width:580px){ .cs-shared-cols { grid-template-columns:1fr; } }\n\n  /* \u2500\u2500 Confirmation page \u2500\u2500 */\n  .conf-wrap { width:100%; max-width:720px; margin:0 auto; }\n  .conf-block { margin-bottom:32px; }\n  .conf-trad-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .conf-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px; }\n  @media(max-width:580px){ .conf-cols { grid-template-columns:1fr; } }\n  .conf-col-header { font-size:11px; color:var(--deep); font-style:italic; font-weight:500; margin-bottom:8px; }\n  .conf-item { font-size:13px; color:var(--tx); font-style:italic; padding:6px 0; border-bottom:1px solid var(--warm); line-height:1.4; }\n  .conf-item:last-child { border-bottom:none; }\n  .conf-item-timing { font-size:11px; color:var(--muted); }\n  .conf-shared-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:16px 0 10px; font-style:italic; }\n  .conf-budget { background:var(--warm); border-radius:10px; padding:20px 24px; margin-top:28px; }\n  .conf-budget-total { font-size:28px; font-style:italic; color:var(--deep); margin-bottom:4px; }\n  .conf-budget-sub { font-size:12px; color:var(--muted); font-style:italic; margin-bottom:16px; }\n  .conf-budget-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }\n  .conf-budget-cat { font-size:12px; color:var(--tx); width:150px; flex-shrink:0; font-style:italic; }\n  .conf-budget-track { flex:1; background:var(--bdr); border-radius:2px; height:5px; }\n  .conf-budget-fill { height:100%; background:var(--gd); border-radius:2px; }\n  .conf-budget-amt { font-size:12px; color:var(--muted); min-width:65px; text-align:right; font-style:italic; }\n\n  /* \u2500\u2500 Ceremony selection page \u2500\u2500 */\n  .cs-tradition-block { margin-bottom:40px; }\n  .cs-tradition-label { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .cs-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }\n  @media(max-width:580px){ .cs-cols { grid-template-columns:1fr; } }\n  .cs-col-header { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--deep); margin-bottom:10px; font-style:italic; font-weight:500; }\n  .cs-item { display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border:1px solid var(--bdr); border-radius:8px; margin-bottom:8px; cursor:pointer; transition:all 0.15s; background:white; }\n  .cs-item:hover { border-color:var(--gd); }\n  .cs-item.selected { border-color:var(--gk); background:#FFFAEA; }\n  .cs-item.deselected { opacity:0.4; }\n  .cs-check { width:18px; height:18px; border:1.5px solid var(--bdr); border-radius:4px; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }\n  .cs-item.selected .cs-check { background:var(--deep); border-color:var(--deep); }\n  .cs-check-tick { color:white; font-size:11px; display:none; }\n  .cs-item.selected .cs-check-tick { display:block; }\n  .cs-item-name { font-size:13px; color:var(--tx); font-style:italic; line-height:1.4; }\n  .cs-item-timing { font-size:11px; color:var(--muted); font-style:italic; margin-top:2px; }\n  .cs-shared-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:20px 0 10px; font-style:italic; display:flex; align-items:center; gap:8px; }\n  .cs-shared-label::after { content:''; flex:1; height:1px; background:var(--bdr); }\n  .cs-shared-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }\n  @media(max-width:580px){ .cs-shared-grid { grid-template-columns:1fr; } }\n  /* \u2500\u2500 Confirmation page \u2500\u2500 */\n  .conf-block { margin-bottom:32px; }\n  .conf-trad-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .conf-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px; }\n  @media(max-width:580px){ .conf-cols { grid-template-columns:1fr; } }\n  .conf-col-header { font-size:11px; color:var(--deep); font-style:italic; font-weight:500; margin-bottom:8px; }\n  .conf-item { font-size:13px; color:var(--tx); font-style:italic; padding:6px 0; border-bottom:1px solid var(--warm); line-height:1.4; }\n  .conf-item:last-child { border-bottom:none; }\n  .conf-item-timing { font-size:11px; color:var(--muted); }\n  .conf-shared-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:16px 0 10px; font-style:italic; }\n  .conf-budget { background:var(--warm); border-radius:10px; padding:20px 24px; margin-top:28px; }\n  .conf-budget-total { font-size:28px; font-style:italic; color:var(--deep); margin-bottom:4px; letter-spacing:-1px; }\n  .conf-budget-sub { font-size:12px; color:var(--muted); font-style:italic; margin-bottom:16px; }\n  .conf-budget-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }\n  .conf-budget-cat { font-size:12px; color:var(--tx); width:150px; flex-shrink:0; font-style:italic; }\n  .conf-budget-track { flex:1; background:var(--bdr); border-radius:2px; height:5px; }\n  .conf-budget-fill { height:100%; background:var(--gd); border-radius:2px; }\n  .conf-budget-amt { font-size:12px; color:var(--muted); min-width:65px; text-align:right; font-style:italic; }\n\n  /* \u2500\u2500 Ceremony card move/copy menu \u2500\u2500 */\n  .cs-item { position: relative; }\n  .cs-item-menu-btn {\n    position: absolute; top: 8px; right: 8px;\n    background: none; border: none; cursor: pointer;\n    font-size: 16px; color: var(--muted); padding: 2px 6px;\n    border-radius: 4px; line-height: 1; opacity: 0;\n    transition: opacity 0.15s;\n  }\n  .cs-item:hover .cs-item-menu-btn { opacity: 1; }\n  .cs-item-menu-btn:focus { opacity: 1; outline: none; }\n  .cs-item-popover {\n    display: none; position: absolute; top: 28px; right: 4px;\n    background: white; border: 1px solid var(--bdr);\n    border-radius: 8px; box-shadow: 0 4px 16px rgba(60,48,16,0.12);\n    z-index: 50; min-width: 160px; overflow: hidden;\n  }\n  .cs-item-popover.open { display: block; }\n  .cs-popover-item {\n    padding: 9px 14px; font-size: 12px; font-style: italic;\n    font-family: 'Playfair Display', Georgia, serif;\n    color: var(--tx); cursor: pointer; display: block;\n    border: none; background: none; width: 100%; text-align: left;\n    transition: background 0.1s;\n  }\n  .cs-popover-item:hover { background: var(--warm); }\n  .cs-popover-divider { height: 1px; background: var(--bdr); margin: 2px 0; }\n\n  /* \u2500\u2500 Budget three sections \u2500\u2500 */\n  .budget-section { margin-bottom: 24px; }\n  .budget-section-header {\n    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;\n    color: var(--muted); font-style: italic; margin-bottom: 12px;\n    padding-bottom: 8px; border-bottom: 1px solid var(--bdr);\n  }\n  .budget-section-total {\n    font-size: 20px; font-style: italic; color: var(--deep);\n    margin-bottom: 10px; letter-spacing: -0.5px;\n  }\n\n    /* \u2500\u2500 Ceremony card move/copy menu \u2500\u2500 */\n  .cs-item { position: relative; }\n  .cs-item-menu-btn { position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--muted);padding:2px 6px;border-radius:4px;line-height:1;opacity:0;transition:opacity 0.15s; }\n  .cs-item:hover .cs-item-menu-btn, .cs-item-menu-btn:focus { opacity:1;outline:none; }\n  .cs-item-popover { display:none;position:absolute;top:28px;right:4px;background:white;border:1px solid var(--bdr);border-radius:8px;box-shadow:0 4px 16px rgba(60,48,16,0.12);z-index:50;min-width:160px;overflow:hidden; }\n  .cs-item-popover.open { display:block; }\n  .cs-popover-item { padding:9px 14px;font-size:12px;font-style:italic;font-family:'Playfair Display',Georgia,serif;color:var(--tx);cursor:pointer;display:block;border:none;background:none;width:100%;text-align:left; }\n  .cs-popover-item:hover { background:var(--warm); }\n  .cs-popover-divider { height:1px;background:var(--bdr);margin:2px 0; }\n  /* \u2500\u2500 Budget three sections \u2500\u2500 */\n  .budget-section { margin-bottom:24px; }\n  .budget-section-header { font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-style:italic;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--bdr); }\n  .budget-section-total { font-size:20px;font-style:italic;color:var(--deep);margin-bottom:10px;letter-spacing:-0.5px; }\n\n  /* \u2500\u2500 Ceremony card menu \u2500\u2500 */\n  .cs-item { position:relative; }\n  .cs-item-menu-btn { position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--muted);padding:2px 6px;border-radius:4px;line-height:1;opacity:0;transition:opacity 0.15s; }\n  .cs-item:hover .cs-item-menu-btn, .cs-item-menu-btn:focus { opacity:1;outline:none; }\n  .cs-item-popover { display:none;position:absolute;top:28px;right:4px;background:white;border:1px solid var(--bdr);border-radius:8px;box-shadow:0 4px 16px rgba(60,48,16,0.12);z-index:50;min-width:160px;overflow:hidden; }\n  .cs-item-popover.open { display:block; }\n  .cs-popover-item { padding:9px 14px;font-size:12px;font-style:italic;font-family:'Playfair Display',Georgia,serif;color:var(--tx);cursor:pointer;display:block;border:none;background:none;width:100%;text-align:left; }\n  .cs-popover-item:hover { background:var(--warm); }\n  .cs-popover-divider { height:1px;background:var(--bdr);margin:2px 0; }\n  /* \u2500\u2500 Budget three sections \u2500\u2500 */\n  .budget-section { margin-bottom:24px; }\n  .budget-section-header { font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-style:italic;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--bdr); }\n  .budget-section-total { font-size:20px;font-style:italic;color:var(--deep);margin-bottom:10px; }\n\n  /* \u2500\u2500 Two-column layout (ceremonies + checklist) \u2500\u2500 */\n  .ceremony-cols, .checklist-cols { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }\n  @media(max-width:600px){ .ceremony-cols, .checklist-cols { grid-template-columns:1fr; } }\n  .ceremony-col-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .ceremony-shared-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:20px 0 12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n\n  /* \u2500\u2500 Ceremony selection page \u2500\u2500 */\n  .ceremony-selection-wrap { width:100%; max-width:860px; margin:0 auto; }\n  .cs-tradition-block { margin-bottom:40px; }\n  .cs-tradition-label { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .cs-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }\n  @media(max-width:580px){ .cs-cols { grid-template-columns:1fr; } }\n  .cs-col-header { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--deep); margin-bottom:10px; font-style:italic; font-weight:500; }\n  .cs-item { display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border:1px solid var(--bdr); border-radius:8px; margin-bottom:8px; cursor:pointer; transition:all 0.15s; background:white; }\n  .cs-item:hover { border-color:var(--gd); }\n  .cs-item.selected { border-color:var(--gk); background:#FFFAEA; }\n  .cs-item.deselected { opacity:0.4; }\n  .cs-check { width:18px; height:18px; border:1.5px solid var(--bdr); border-radius:4px; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }\n  .cs-item.selected .cs-check { background:var(--deep); border-color:var(--deep); }\n  .cs-check-tick { color:white; font-size:11px; display:none; }\n  .cs-item.selected .cs-check-tick { display:block; }\n  .cs-item-name { font-size:13px; color:var(--tx); font-style:italic; line-height:1.4; }\n  .cs-item-timing { font-size:11px; color:var(--muted); font-style:italic; margin-top:2px; }\n  .cs-shared-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:20px 0 10px; font-style:italic; display:flex; align-items:center; gap:8px; }\n  .cs-shared-label::after { content:''; flex:1; height:1px; background:var(--bdr); }\n  .cs-shared-cols { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }\n  @media(max-width:580px){ .cs-shared-cols { grid-template-columns:1fr; } }\n\n  /* \u2500\u2500 Confirmation page \u2500\u2500 */\n  .conf-wrap { width:100%; max-width:720px; margin:0 auto; }\n  .conf-block { margin-bottom:32px; }\n  .conf-trad-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .conf-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px; }\n  @media(max-width:580px){ .conf-cols { grid-template-columns:1fr; } }\n  .conf-col-header { font-size:11px; color:var(--deep); font-style:italic; font-weight:500; margin-bottom:8px; }\n  .conf-item { font-size:13px; color:var(--tx); font-style:italic; padding:6px 0; border-bottom:1px solid var(--warm); line-height:1.4; }\n  .conf-item:last-child { border-bottom:none; }\n  .conf-item-timing { font-size:11px; color:var(--muted); }\n  .conf-shared-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:16px 0 10px; font-style:italic; }\n  .conf-budget { background:var(--warm); border-radius:10px; padding:20px 24px; margin-top:28px; }\n  .conf-budget-total { font-size:28px; font-style:italic; color:var(--deep); margin-bottom:4px; }\n  .conf-budget-sub { font-size:12px; color:var(--muted); font-style:italic; margin-bottom:16px; }\n  .conf-budget-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }\n  .conf-budget-cat { font-size:12px; color:var(--tx); width:150px; flex-shrink:0; font-style:italic; }\n  .conf-budget-track { flex:1; background:var(--bdr); border-radius:2px; height:5px; }\n  .conf-budget-fill { height:100%; background:var(--gd); border-radius:2px; }\n  .conf-budget-amt { font-size:12px; color:var(--muted); min-width:65px; text-align:right; font-style:italic; }\n\n  /* \u2500\u2500 Ceremony card move/copy menu \u2500\u2500 */\n  .cs-item { position: relative; }\n  .cs-item-menu-btn {\n    position: absolute; top: 8px; right: 8px;\n    background: none; border: none; cursor: pointer;\n    font-size: 16px; color: var(--muted); padding: 2px 6px;\n    border-radius: 4px; line-height: 1; opacity: 0;\n    transition: opacity 0.15s;\n  }\n  .cs-item:hover .cs-item-menu-btn { opacity: 1; }\n  .cs-item-menu-btn:focus { opacity: 1; outline: none; }\n  .cs-item-popover {\n    display: none; position: absolute; top: 28px; right: 4px;\n    background: white; border: 1px solid var(--bdr);\n    border-radius: 8px; box-shadow: 0 4px 16px rgba(60,48,16,0.12);\n    z-index: 50; min-width: 160px; overflow: hidden;\n  }\n  .cs-item-popover.open { display: block; }\n  .cs-popover-item {\n    padding: 9px 14px; font-size: 12px; font-style: italic;\n    font-family: 'Playfair Display', Georgia, serif;\n    color: var(--tx); cursor: pointer; display: block;\n    border: none; background: none; width: 100%; text-align: left;\n    transition: background 0.1s;\n  }\n  .cs-popover-item:hover { background: var(--warm); }\n  .cs-popover-divider { height: 1px; background: var(--bdr); margin: 2px 0; }\n\n  /* \u2500\u2500 Budget three sections \u2500\u2500 */\n  .budget-section { margin-bottom: 24px; }\n  .budget-section-header {\n    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;\n    color: var(--muted); font-style: italic; margin-bottom: 12px;\n    padding-bottom: 8px; border-bottom: 1px solid var(--bdr);\n  }\n  .budget-section-total {\n    font-size: 20px; font-style: italic; color: var(--deep);\n    margin-bottom: 10px; letter-spacing: -0.5px;\n  }\n\n  /* \u2500\u2500 Ceremony card menu \u2500\u2500 */\n  .cs-item { position:relative; }\n  .cs-item-menu-btn { position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--muted);padding:2px 6px;border-radius:4px;line-height:1;opacity:0;transition:opacity 0.15s; }\n  .cs-item:hover .cs-item-menu-btn, .cs-item-menu-btn:focus { opacity:1;outline:none; }\n  .cs-item-popover { display:none;position:absolute;top:28px;right:4px;background:white;border:1px solid var(--bdr);border-radius:8px;box-shadow:0 4px 16px rgba(60,48,16,0.12);z-index:50;min-width:160px;overflow:hidden; }\n  .cs-item-popover.open { display:block; }\n  .cs-popover-item { padding:9px 14px;font-size:12px;font-style:italic;font-family:'Playfair Display',Georgia,serif;color:var(--tx);cursor:pointer;display:block;border:none;background:none;width:100%;text-align:left; }\n  .cs-popover-item:hover { background:var(--warm); }\n  .cs-popover-divider { height:1px;background:var(--bdr);margin:2px 0; }\n  /* \u2500\u2500 Budget three sections \u2500\u2500 */\n  .budget-section { margin-bottom:24px; }\n  .budget-section-header { font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-style:italic;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--bdr); }\n  .budget-section-total { font-size:20px;font-style:italic;color:var(--deep);margin-bottom:10px; }\n\n  /* \u2500\u2500 Two-column layout (ceremonies + checklist) \u2500\u2500 */\n  .ceremony-cols, .checklist-cols { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }\n  @media(max-width:600px){ .ceremony-cols, .checklist-cols { grid-template-columns:1fr; } }\n  .ceremony-col-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n  .ceremony-shared-header { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin:20px 0 12px; padding-bottom:8px; border-bottom:1px solid var(--bdr); font-style:italic; }\n\n  \n  /* \u2500\u2500 Budget \u2500\u2500 */\n  .budget-total-display {\n    font-size: 32px;\n    font-style: italic;\n    color: var(--deep);\n    margin-bottom: 4px;\n    letter-spacing: -1px;\n  }\n  .budget-sub { font-size: 13px; color: var(--muted); font-style: italic; margin-bottom: 28px; }\n  .budget-row {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    margin-bottom: 10px;\n  }\n  .budget-cat { font-size: 13px; color: var(--tx); width: 160px; flex-shrink: 0; font-style: italic; }\n  .budget-track { flex: 1; background: var(--warm); border-radius: 2px; height: 6px; overflow: hidden; }\n  .budget-fill { height: 100%; background: var(--gd); border-radius: 2px; }\n  .budget-amt { font-size: 13px; color: var(--muted); min-width: 70px; text-align: right; font-style: italic; }\n\n  /* \u2500\u2500 Conflict banner \u2500\u2500 */\n  .conflict-banner {\n    background: var(--warm);\n    border-left: 3px solid var(--gd);\n    padding: 10px 14px;\n    margin-bottom: 12px;\n    font-size: 12px;\n    font-style: italic;\n    color: var(--deep);\n    line-height: 1.6;\n    border-radius: 0 6px 6px 0;\n  }\n  .flower-dialog-overlay{position:fixed;inset:0;background:rgba(60,48,16,0.3);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;}\n  .flower-dialog{background:white;border-radius:16px;padding:32px 28px;max-width:360px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(60,48,16,0.15);}\n  .flower-dialog-title{font-size:18px;font-style:italic;color:var(--deep);margin:12px 0 8px;}\n  .flower-dialog-body{font-size:13px;color:var(--muted);font-style:italic;line-height:1.6;margin-bottom:20px;}\n  .flower-dialog-btns{display:flex;gap:12px;justify-content:center;}\n  .gantt-tip{position:absolute;top:-28px;left:0;background:rgba(60,48,16,0.85);color:white;font-size:10px;font-style:italic;padding:3px 7px;border-radius:4px;white-space:nowrap;pointer-events:none;display:none;z-index:200;}\n  .gantt-bar:hover .gantt-tip{display:block;}\n</style>\n</head>\n<body>\n\n<div id=\"progress-bar\"><div id=\"progress-fill\"></div></div>\n\n<div id=\"header\">\n  <a class=\"brand\" href=\"/\" title=\"Back to Marigold\">\n    <svg class=\"flower-mark\" width=\"22\" height=\"22\" viewBox=\"0 0 34 34\" xmlns=\"http://www.w3.org/2000/svg\">\n      <g fill=\"#E0B030\" stroke=\"#C8941A\" stroke-width=\"0.4\">\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(0 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(25.7 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(51.4 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(77.1 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(102.8 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(128.5 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(154.2 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(180 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(205.7 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(231.4 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(257.1 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(282.8 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(308.5 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(334.2 17 17)\"/>\n      </g>\n      <g fill=\"#F2C53D\" stroke=\"#D9A828\" stroke-width=\"0.35\">\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(12.9 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(38.6 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(64.3 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(90 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(115.7 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(141.4 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(167.1 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(192.8 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(218.5 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(244.2 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(270 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(295.7 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(321.4 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"7.8\" rx=\"1.55\" ry=\"3.4\" transform=\"rotate(347.1 17 17)\"/>\n      </g>\n      <g fill=\"#F7D44C\" stroke=\"#E0B030\" stroke-width=\"0.3\">\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(0 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(20 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(40 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(60 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(80 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(100 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(120 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(140 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(160 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(180 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(200 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(220 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(240 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(260 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(280 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(300 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(320 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(340 17 17)\"/>\n      </g>\n      <circle cx=\"17\" cy=\"17\" r=\"4.1\" fill=\"#6B5318\" stroke=\"#5A4512\" stroke-width=\"0.3\"/>\n      <circle cx=\"15.5\" cy=\"15.8\" r=\"0.45\" fill=\"#3C3010\"/>\n      <circle cx=\"18.5\" cy=\"15.8\" r=\"0.45\" fill=\"#3C3010\"/>\n      <circle cx=\"17\" cy=\"18.4\" r=\"0.45\" fill=\"#3C3010\"/>\n    </svg>\n    <span class=\"bname\">marigold</span>\n  </a>\n  <div id=\"header-right\">\n    <span id=\"step-indicator\"></span>\n  </div>\n</div>\n\n<div id=\"screens\">\n\n  <!-- Q0: Entry choice -->\n  <div class=\"screen active\" id=\"q0\">\n    <div class=\"q-wrap\">\n      <div id=\"q0-flower\" style=\"margin-bottom:20px\"></div>\n      <div class=\"ql\">Welcome</div>\n      <div class=\"qt\">Let's plan your wedding</div>\n      <div class=\"qs\" style=\"margin-bottom:32px\">Tell us about your wedding in your own words, or step through a few quick questions.</div>\n      <div class=\"q0-choice\">\n        <button class=\"q0-option\" onclick=\"showParagraphEntry()\">\n          <div class=\"q0-option-title\">&#9998;&nbsp;&nbsp;Write a few sentences</div>\n          <div class=\"q0-option-sub\">Tell us about your wedding &mdash; we'll pick up the details and only ask what's missing</div>\n        </button>\n        <button class=\"q0-option\" onclick=\"startQuestionnaire()\">\n          <div class=\"q0-option-title\">&#128172;&nbsp;&nbsp;Answer a few questions</div>\n          <div class=\"q0-option-sub\">Step by step &mdash; takes about 2 minutes</div>\n        </button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q0b: Paragraph entry -->\n  <div class=\"screen\" id=\"q0b\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Your wedding</div>\n      <div class=\"qt\">Tell us about your wedding</div>\n      <div class=\"qs\" style=\"margin-bottom:20px\">Write a sentence or two &mdash; names, traditions, where and when, budget, guests.</div>\n      <textarea class=\"q0-textarea\" id=\"wedding-paragraph\"\n        placeholder=\"e.g. Priya and James are having a Hindu-Jewish wedding in New Jersey in October 2026, around $80,000 and 150 guests...\"\n        oninput=\"var btn=document.getElementById('q0b-btn');if(btn)btn.disabled=this.value.trim().length<5;\"\n        style=\"width:100%\"\n      ></textarea>\n      <div class=\"err\" id=\"err-q0b\">Please write a few words about your wedding.</div>\n      <div class=\"cta-row\" style=\"margin-top:24px\">\n        <button class=\"btn-back\" onclick=\"transitionTo('q0b','q0');currentQ=0;updateProgress();\">&larr; back</button>\n        <button class=\"cta\" id=\"q0b-btn\" onclick=\"parseParagraph()\" disabled>Build my plan &rarr;</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q1: Names + roles -->\n  <div class=\"screen\" id=\"q1\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Let's begin</div>\n      <div class=\"qt\">What are your names?</div>\n      <div class=\"qs\">We'll use these throughout your plan \u2014 and to personalise your ceremony plan.</div>\n      <div class=\"name-row\">\n        <div class=\"field-group\">\n          <label class=\"field-label\">Partner one</label>\n          <input type=\"text\" class=\"fi\" id=\"name1\" placeholder=\"e.g. Priya\" autocomplete=\"given-name\" autofocus oninput=\"updateRoleLabels();updateQ1Continue();\">\n        </div>\n        <div class=\"field-group\">\n          <label class=\"field-label\">Partner two</label>\n          <input type=\"text\" class=\"fi\" id=\"name2\" placeholder=\"e.g. James\" autocomplete=\"given-name\" oninput=\"updateRoleLabels();updateQ1Continue();\">\n        </div>\n      </div>\n      <div style=\"margin-top:28px\">\n        <div class=\"ql\" style=\"margin-bottom:16px\">How do you refer to each other?</div>\n        <div class=\"role-sentences\">\n          <div class=\"role-sentence\">\n            <span class=\"role-sentence-name\" id=\"role-name1\">Partner one</span>\n            <span class=\"role-sentence-is\">&nbsp;is the&nbsp;</span>\n            <span class=\"role-dropdown\" id=\"role-dd1\">\n              <span class=\"role-dd-value\" id=\"role-val1\" onclick=\"toggleRoleDD(1,event)\">Select &#9662;</span>\n              <div class=\"role-dd-menu\" id=\"role-menu1\">\n                <div onclick=\"pickRole(1,'partner',event)\">Partner</div>\n                <div onclick=\"pickRole(1,'bride',event)\">Bride</div>\n                <div onclick=\"pickRole(1,'groom',event)\">Groom</div>\n              </div>\n            </span>\n          </div>\n          <div class=\"role-sentence\">\n            <span class=\"role-sentence-name\" id=\"role-name2\">Partner two</span>\n            <span class=\"role-sentence-is\">&nbsp;is the&nbsp;</span>\n            <span class=\"role-dropdown\" id=\"role-dd2\">\n              <span class=\"role-dd-value\" id=\"role-val2\" onclick=\"toggleRoleDD(2,event)\">Select &#9662;</span>\n              <div class=\"role-dd-menu\" id=\"role-menu2\">\n                <div onclick=\"pickRole(2,'partner',event)\">Partner</div>\n                <div onclick=\"pickRole(2,'bride',event)\">Bride</div>\n                <div onclick=\"pickRole(2,'groom',event)\">Groom</div>\n              </div>\n            </span>\n          </div>\n        </div>\n      </div>\n      <div class=\"err\" id=\"err-q1\">Please enter both names to continue.</div>\n      <div class=\"cta-row\">\n        <button class=\"cta\" id=\"q1-continue\" onclick=\"goNext(1)\" disabled>Continue</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q2: Date -->\n  <div class=\"screen\" id=\"q2\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Your wedding</div>\n      <div class=\"qt\" id=\"q2-text\">When is the wedding?</div>\n      <div class=\"qs\">Pick a date or tick \"not decided yet\" \u2014 either works.</div>\n      <input type=\"date\" class=\"fi\" id=\"wedding-date\" \n        style=\"max-width:280px;font-family:'Playfair Display',Georgia,serif;font-style:italic;color:var(--deep);\" \n        onchange=\"onDateChange()\">\n      <div style=\"margin-top:14px;display:flex;align-items:center;gap:8px\">\n        <input type=\"checkbox\" id=\"date-undecided\" style=\"accent-color:var(--gd);width:16px;height:16px;cursor:pointer\" onchange=\"onDateUndecided()\">\n        <label for=\"date-undecided\" style=\"font-size:13px;color:var(--muted);font-style:italic;cursor:pointer\">Not decided yet</label>\n      </div>\n      <div class=\"cta-row\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" id=\"q2-continue\" onclick=\"goNext(2)\" disabled>Continue</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q3: Location -->\n  <div class=\"screen\" id=\"q3\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Where</div>\n      <div class=\"qt\" id=\"q3-text\">Where are you getting married?</div>\n      <div class=\"qs\">City and state or country \u2014 or tick \"not decided yet\".</div>\n      <input type=\"text\" class=\"fi\" id=\"location\" placeholder=\"e.g. New Jersey, US\" style=\"max-width:380px\" oninput=\"onLocationChange()\">\n      <div style=\"margin-top:14px;display:flex;align-items:center;gap:8px\">\n        <input type=\"checkbox\" id=\"location-undecided\" style=\"accent-color:var(--gd);width:16px;height:16px;cursor:pointer\" onchange=\"onLocationUndecided()\">\n        <label for=\"location-undecided\" style=\"font-size:13px;color:var(--muted);font-style:italic;cursor:pointer\">Not decided yet</label>\n      </div>\n      <div class=\"cta-row\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" id=\"q3-continue\" onclick=\"goNext(3)\" disabled>Continue</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q4: Traditions -->\n  <div class=\"screen\" id=\"q4\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Traditions</div>\n      <div class=\"qt\" id=\"q4-text\">Which traditions will your wedding honour?</div>\n      <div class=\"qs\">Select up to two. If yours isn't listed, choose the closest.</div>\n      <input type=\"text\" class=\"trad-search\" id=\"trad-search\" placeholder=\"Search traditions\u2026\" oninput=\"filterTrads()\">\n      <div class=\"trad-grid\" id=\"trad-grid\"></div>\n      <div class=\"trad-note\" id=\"trad-note\">0 selected \u2014 select 1 or 2</div>\n      <div class=\"err\" id=\"err-q4\">Please select at least one tradition.</div>\n      <div class=\"cta-row\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" onclick=\"goNext(4)\">Continue</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q4b: Tradition assignment (interfaith only \u2014 shown dynamically) -->\n  <div class=\"screen\" id=\"q4b\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Your traditions</div>\n      <div class=\"qt\" id=\"q4b-text\">Which tradition belongs to whom?</div>\n      <div class=\"qs\" id=\"q4b-sub\">This helps us assign ceremonies to the right column in your plan.</div>\n      <div id=\"q4b-assignment\" style=\"margin-top:8px\"></div>\n      <div class=\"cta-row\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" onclick=\"goNext('4b')\">Continue</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q5: Budget -->\n  <div class=\"screen\" id=\"q5\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Budget</div>\n      <div class=\"qt\" id=\"q5-text\">What's your estimated total budget?</div>\n      <div class=\"qs\">We'll allocate this across your full wedding based on your traditions.</div>\n      <div class=\"budget-display\"><sup>$</sup><span id=\"budget-val\">50,000</span></div>\n      <input type=\"range\" id=\"budget-slider\" min=\"10000\" max=\"500000\" step=\"5000\" value=\"50000\" oninput=\"updateBudget()\">\n      <div class=\"budget-labels\"><span>$10k</span><span>$500k+</span></div>\n      <div class=\"cta-row\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" onclick=\"goNext(5)\">Continue</button>\n        <button class=\"back-link\" onclick=\"goNext(5, true)\">Not sure yet</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q6: Guests -->\n  <div class=\"screen\" id=\"q6\">\n    <div class=\"q-wrap\">\n      <div class=\"ql\">Guests</div>\n      <div class=\"qt\" id=\"q6-text\">How many guests are you expecting?</div>\n      <div class=\"qs\">A rough number is fine \u2014 helps us size your venue and catering guidance.</div>\n      <div class=\"stepper\">\n        <button class=\"stepper-btn\" onclick=\"adjGuests(-25)\">\u2212</button>\n        <div class=\"stepper-count\" id=\"guest-count\">100</div>\n        <button class=\"stepper-btn\" onclick=\"adjGuests(25)\">+</button>\n      </div>\n      <div style=\"font-size:13px;color:var(--muted);font-style:italic\">guests across all events</div>\n      <div class=\"cta-row\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" onclick=\"goNext(6)\">Build my plan</button>\n        <button class=\"back-link\" onclick=\"goNext(6, true)\">Not sure yet</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q6b: Review your details -->\n  <div class=\"screen\" id=\"q6b\">\n    <div class=\"q-wrap\" style=\"max-width:520px\">\n      <div class=\"ql\">Before we build your plan</div>\n      <div class=\"qt\">Here's what we have</div>\n      <div class=\"qs\" style=\"margin-bottom:24px\">Tap any line to go back and adjust it.</div>\n      <div id=\"review-summary\" style=\"display:flex;flex-direction:column;gap:0\"></div>\n      <div class=\"cta-row\" style=\"margin-top:28px\">\n        <button class=\"btn-back\" onclick=\"goBack()\">&larr; back</button>\n        <button class=\"cta\" onclick=\"submitPlan()\">Build my plan &rarr;</button>\n      </div>\n    </div>\n  </div>\n\n    <!-- Q7: Ceremony selection -->\n  <!-- Q7: Ceremony selection -->\n  <div class=\"screen\" id=\"q7\" style=\"display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;padding:0!important;overflow:hidden!important;\">\n    <!-- Scrollable content area -->\n    <div id=\"q7-scroll\" style=\"flex:1;overflow-y:auto;overflow-x:hidden;padding:24px 24px 16px;box-sizing:border-box;min-height:0;\">\n    <div style=\"width:100%;max-width:900px;margin:0 auto\">\n      <div class=\"ql\" style=\"margin-bottom:2px\">Your ceremony plan</div>\n      <div class=\"qt\" id=\"q7-title\">Choose your ceremonies</div>\n      <div class=\"qs\" id=\"q7-sub\" style=\"margin-bottom:4px\">Select the ceremonies you want \u2014 adjust anything that isn't right for you.</div>\n      <div id=\"cs-container\" style=\"margin-top:16px;padding-bottom:20px\"></div>\n    </div>\n    </div>\n    <div style=\"flex-shrink:0;padding:16px 24px 24px;\">\n      <div style=\"width:100%;max-width:900px;margin:0 auto;padding-top:16px;border-top:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;\">\n        <button class=\"btn-back\" onclick=\"goBack()\">\u2190 back</button>\n        <button class=\"cta\" onclick=\"goToConfirmation()\">Review my plan \u2192</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Q8: Confirmation -->\n  <div class=\"screen\" id=\"q8\" style=\"overflow:hidden;display:block!important;padding:0!important;\">\n    <div style=\"height:calc(100vh - 62px);overflow-y:auto;overflow-x:hidden;padding:32px 24px 80px;box-sizing:border-box;\">\n    <div style=\"width:100%;max-width:720px;margin:0 auto\">\n      <div class=\"ql\">Your wedding plan</div>\n      <div class=\"qt\" id=\"q8-title\">Here's what you've chosen</div>\n      <div class=\"qs\" id=\"q8-sub\"></div>\n      <div id=\"conf-container\" style=\"margin-top:28px\"></div>\n      <div class=\"cta-row\" style=\"margin-top:32px\">\n        <button class=\"btn-back\" onclick=\"goBackFromConf()\">\u2190 adjust selections</button>\n        <button class=\"cta\" onclick=\"buildFinalPlan()\">Build my full plan \u2192</button>\n      </div>\n    </div>\n  </div>\n  </div>\n\n  <!-- Loading -->\n  <div class=\"screen\" id=\"loading-screen\">\n    <svg class=\"marigold-spin\" width=\"44\" height=\"44\" viewBox=\"0 0 34 34\" xmlns=\"http://www.w3.org/2000/svg\">\n      <g fill=\"#E0B030\" stroke=\"#C8941A\" stroke-width=\"0.4\">\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(0 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(51.4 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(102.8 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(154.2 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(205.7 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(257.1 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(308.5 17 17)\"/>\n      </g>\n      <g fill=\"#F7D44C\" stroke=\"#E0B030\" stroke-width=\"0.3\">\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(0 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(60 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(120 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(180 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(240 17 17)\"/>\n        <ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(300 17 17)\"/>\n      </g>\n      <circle cx=\"17\" cy=\"17\" r=\"4.1\" fill=\"#6B5318\" stroke=\"#5A4512\" stroke-width=\"0.3\"/>\n    </svg>\n    <div class=\"loading-text\" id=\"loading-text\">Building your plan\u2026</div>\n    <div class=\"loading-sub\" id=\"loading-sub\">Reading your traditions</div>\n  </div>\n\n  <!-- Results -->\n  <div class=\"screen\" id=\"results-screen\">\n    <div class=\"results-wrap\">\n      <div class=\"results-hero\">\n        <h1 id=\"results-title\">Your wedding plan</h1>\n        <p id=\"results-subtitle\"></p>\n      </div>\n      <div id=\"conflicts-wrap\"></div>\n      <div class=\"out-tabs\">\n        <button class=\"out-tab on\" onclick=\"switchTab('checklist', this)\">Checklist</button>\n        <button class=\"out-tab\" onclick=\"switchTab('ceremonies', this)\">Ceremony journey</button>\n        <button class=\"out-tab\" onclick=\"switchTab('budget', this)\">Budget</button>\n      </div>\n      <div class=\"tab-panel on\" id=\"tab-checklist\"></div>\n      <div id=\"tab-ceremonies-nav\" style=\"display:none;position:sticky;top:0;background:#FDFAF0;z-index:100;will-change:transform\"></div>\n      <div class=\"tab-panel\" id=\"tab-ceremonies\"></div>\n      <div class=\"tab-panel\" id=\"tab-budget\"></div>\n      <div style=\"margin-top:48px;padding-top:32px;border-top:1px solid var(--bdr);text-align:center\">\n        <div style=\"font-size:13px;color:var(--muted);font-style:italic;margin-bottom:16px\">Your plan is ready.</div>\n        <button class=\"cta\" style=\"margin-bottom:20px\" onclick=\"showFlowerDialog('Save and share','We are working on this feature - coming soon.')\">Save my plan &rarr;</button>\n        <div style=\"display:flex;justify-content:center;gap:20px;margin-top:12px\">\n          <button class=\"btn-back\" onclick=\"transitionTo('results-screen','q8');currentQ=8;updateProgress();\">&larr; back to selections</button>\n          <button style=\"background:none;border:none;color:var(--muted);font-size:12px;font-family:'Playfair Display',serif;font-style:italic;cursor:pointer;\" onclick=\"showFlowerDialog('Start again?','This will clear your current plan.',function(){location.reload();})\">Start again</button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n<script>\n// \u2500\u2500 State \u2500\u2500\nfunction pos(n) { return n + \"\u2019s\"; }\n\nvar FLOWER_SVG_20 = '<svg width=\"20\" height=\"20\" viewBox=\"0 0 34 34\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"#E0B030\" stroke=\"#C8941A\" stroke-width=\"0.4\"><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(0 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(25.7 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(51.4 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(77.1 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(102.8 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(128.5 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(154.2 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(180 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(205.7 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(231.4 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(257.1 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(282.8 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(308.5 17 17)\"/><ellipse cx=\"17\" cy=\"5.8\" rx=\"1.9\" ry=\"4.4\" transform=\"rotate(334.2 17 17)\"/></g><g fill=\"#F7D44C\" stroke=\"#E0B030\" stroke-width=\"0.3\"><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(0 17 17)\"/><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(20 17 17)\"/><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(60 17 17)\"/><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(120 17 17)\"/><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(180 17 17)\"/><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(240 17 17)\"/><ellipse cx=\"17\" cy=\"10.2\" rx=\"1.3\" ry=\"2.4\" transform=\"rotate(300 17 17)\"/></g><circle cx=\"17\" cy=\"17\" r=\"4.1\" fill=\"#6B5318\" stroke=\"#5A4512\" stroke-width=\"0.3\"/></svg>'; // possessive helper avoids quote escaping issues\n\nconst S = { name1:'', name2:'', role1:'', role2:'', userRole:'couple', dateSure:false, locationSure:false, date:'', location:'', traditions:[], traditionAssignment:{}, budget:50000, guests:100, plan:null };\nlet guests = 100;\nlet currentQ = 0;\nconst TOTAL_Q = 6;\n\n// \u2500\u2500 Role assignment \u2500\u2500\nfunction pickRole(partner, role) {\n  S['role' + partner] = role;\n  var val = document.getElementById('role-val' + partner);\n  if (val) val.innerHTML = (role === 'bride' ? 'Bride' : role === 'groom' ? 'Groom' : 'Partner') + ' &#9662;';\n  var menu = document.getElementById('role-menu' + partner);\n  updateQ1Continue();\n  updateRoleLabels();\n  if (menu) menu.classList.remove('open');\n}\n\nfunction updateQ1Continue() {\n  var n1 = (document.getElementById('name1')||{}).value||'';\n  var n2 = (document.getElementById('name2')||{}).value||'';\n  var btn = document.getElementById('q1-continue');\n  if (btn) btn.disabled = !(n1.trim() && n2.trim() && S.role1 && S.role2);\n}\nfunction toggleRoleDD(partner) {\n  var menu = document.getElementById('role-menu' + partner);\n  if (!menu) return;\n  var other = document.getElementById('role-menu' + (partner === 1 ? 2 : 1));\n  if (other) other.classList.remove('open');\n  menu.classList.toggle('open');\n}\n\nfunction setRole(partner, role) { pickRole(partner, role); }\n\ndocument.addEventListener('click', function(e) {\n  if (!e.target.closest('.role-dropdown')) {\n    document.querySelectorAll('.role-dd-menu').forEach(function(m){ m.classList.remove('open'); });\n  }\n});\n\nfunction updateRoleLabels() {\n  var n1 = document.getElementById('name1').value.trim() || 'Partner one';\n  var n2 = document.getElementById('name2').value.trim() || 'Partner two';\n  var el1 = document.getElementById('role-name1');\n  var el2 = document.getElementById('role-name2');\n  if (el1) el1.textContent = n1;\n  if (el2) el2.textContent = n2;\n}\n\n// \u2500\u2500 Date / location gating \u2500\u2500\nfunction onDateChange() {\n  var val = document.getElementById('wedding-date').value;\n  if (val) {\n    document.getElementById('date-undecided').checked = false;\n    S.dateSure = true;\n  }\n  updateQ2Continue();\n}\n\nfunction onDateTextInput(val) {\n  // Accept DD/MM/YYYY or DD MM YYYY\n  val = val.trim();\n  if (val.length >= 8) {\n    // Try to parse\n    var clean = val.replace(/[^0-9]/g,'/').replace(/\\/+/g,'/');\n    var parts = clean.split('/');\n    if (parts.length >= 3 && parts[0].length >= 2 && parts[1].length >= 2 && parts[2].length >= 4) {\n      var d = parts[0], m = parts[1], y = parts[2];\n      var dateVal = y + '-' + m + '-' + d;\n      S.date = dateVal;\n      S.dateSure = true;\n      document.getElementById('date-undecided').checked = false;\n      updateQ2Continue();\n    }\n  }\n  if (!val) { S.date = ''; S.dateSure = false; updateQ2Continue(); }\n}\n\nfunction onDateUndecided() {\n  const checked = document.getElementById('date-undecided').checked;\n  if (checked) {\n    document.getElementById('wedding-date').value = '';\n    S.dateSure = false;\n  }\n  updateQ2Continue();\n}\n\nfunction updateQ2Continue() {\n  const hasDate = document.getElementById('wedding-date').value !== '';\n  const undecided = document.getElementById('date-undecided').checked;\n  const btn = document.getElementById('q2-continue');\n  if (btn) btn.disabled = !(hasDate || undecided);\n}\n\nfunction onLocationChange() {\n  const val = document.getElementById('location').value.trim();\n  if (val) document.getElementById('location-undecided').checked = false;\n  updateQ3Continue();\n}\n\nfunction onLocationUndecided() {\n  const checked = document.getElementById('location-undecided').checked;\n  if (checked) document.getElementById('location').value = '';\n  updateQ3Continue();\n}\n\nfunction updateQ3Continue() {\n  const hasLoc = document.getElementById('location').value.trim() !== '';\n  const undecided = document.getElementById('location-undecided').checked;\n  const btn = document.getElementById('q3-continue');\n  if (btn) btn.disabled = !(hasLoc || undecided);\n}\n\n// \u2500\u2500 Q4b: Tradition assignment \u2500\u2500\nfunction buildQ4b() {\n  if (S.traditions.length < 2) return; // single tradition \u2014 skip Q4b\n  const n1 = S.name1 || 'Partner one';\n  const n2 = S.name2 || 'Partner two';\n  document.getElementById('q4b-text').innerHTML = 'Which tradition belongs to whom, <em>' + n1 + '</em> and <em>' + n2 + '</em>?';\n  \n  // Default: first tradition to name1, second to name2\n  if (!S.traditionAssignment[S.traditions[0]]) {\n    S.traditionAssignment[S.traditions[0]] = 'name1';\n    S.traditionAssignment[S.traditions[1]] = 'name2';\n  }\n\n  const container = document.getElementById('q4b-assignment');\n  container.innerHTML = S.traditions.map(function(slug) {\n    const trad = TRADS.find(function(t){return t.slug===slug;});\n    const label = trad ? trad.label : slug;\n    const assigned = S.traditionAssignment[slug] || 'name1';\n    return '<div class=\"trad-assign-row\">' +\n      '<div class=\"trad-assign-name\">' + label + '</div>' +\n      '<div class=\"trad-assign-btns\">' +\n        '<button class=\"assign-btn ' + (assigned==='name1'?'on':'') + '\" data-slug=\"' + slug + '\" data-partner=\"name1\" onclick=\"assignTrad(this)\">' + n1 + '</button>' +\n        '<button class=\"assign-btn ' + (assigned==='name2'?'on':'') + '\" data-slug=\"' + slug + '\" data-partner=\"name2\" onclick=\"assignTrad(this)\">' + n2 + '</button>' +\n      '</div>' +\n    '</div>';\n  }).join('');\n}\n\nfunction assignTrad(btn) {\n  var slug = btn.dataset.slug;\n  var partner = btn.dataset.partner;\n  S.traditionAssignment[slug] = partner;\n  var row = btn.closest('.trad-assign-row');\n  row.querySelectorAll('.assign-btn').forEach(function(b) { b.classList.remove('on'); });\n  btn.classList.add('on');\n}\n\n// \u2500\u2500 Traditions \u2500\u2500\nconst TRADS = [\n  {slug:'sri-lankan-buddhist',label:'Buddhist \u00b7 Sri Lankan',region:'Buddhist'},\n  {slug:'thai-buddhist',label:'Buddhist \u00b7 Thai',region:'Buddhist'},\n  {slug:'chinese-taiwanese',label:'Chinese / Taiwanese',region:'East Asian'},\n  {slug:'catholic',label:'Christian \u00b7 Catholic',region:'Christian'},\n  {slug:'filipino-catholic',label:'Christian \u00b7 Filipino Catholic',region:'Southeast Asian'},\n  {slug:'greek-orthodox',label:'Christian \u00b7 Greek Orthodox',region:'Christian'},\n  {slug:'latin-american-catholic',label:'Christian \u00b7 Latin American Catholic',region:'Latin American'},\n  {slug:'mexican-catholic',label:'Christian \u00b7 Mexican Catholic',region:'Latin American'},\n  {slug:'christian-western',label:'Christian \u00b7 Western',region:'Christian'},\n  {slug:'cuban',label:'Cuban',region:'Caribbean'},\n  {slug:'andhra-telugu',label:'Hindu \u00b7 Andhra / Telugu',region:'South Asian'},\n  {slug:'arya-samaj',label:'Hindu \u00b7 Arya Samaj',region:'South Asian'},\n  {slug:'assamese-hindu',label:'Hindu \u00b7 Assamese',region:'South Asian'},\n  {slug:'bengali-hindu',label:'Hindu \u00b7 Bengali',region:'South Asian'},\n  {slug:'bihari-hindu',label:'Hindu \u00b7 Bihari',region:'South Asian'},\n  {slug:'gujarati',label:'Hindu \u00b7 Gujarati',region:'South Asian'},\n  {slug:'kashmiri-pandit',label:'Hindu \u00b7 Kashmiri Pandit',region:'South Asian'},\n  {slug:'kerala-nair',label:'Hindu \u00b7 Kerala / Nair',region:'South Asian'},\n  {slug:'manipuri-vaishnavite',label:'Hindu \u00b7 Manipuri (Vaishnavite)',region:'South Asian'},\n  {slug:'marathi',label:'Hindu \u00b7 Marathi',region:'South Asian'},\n  {slug:'north-indian-punjabi',label:'Hindu \u00b7 North Indian / Punjabi',region:'South Asian'},\n  {slug:'odia-hindu',label:'Hindu \u00b7 Odia',region:'South Asian'},\n  {slug:'rajasthani-marwari',label:'Hindu \u00b7 Rajasthani (Marwari)',region:'South Asian'},\n  {slug:'rajasthani-rajput',label:'Hindu \u00b7 Rajasthani (Rajput)',region:'South Asian'},\n  {slug:'tamil-hindu',label:'Hindu \u00b7 Tamil',region:'South Asian'},\n  {slug:'vedic-general',label:'Hindu \u00b7 Vedic (General)',region:'South Asian'},\n  {slug:'jain-shwetambar',label:'Jain \u00b7 Shwetambar',region:'South Asian'},\n  {slug:'jewish-reform-conservative',label:'Jewish \u00b7 Reform / Conservative',region:'Jewish'},\n  {slug:'khasi',label:'Khasi',region:'South Asian'},\n  {slug:'korean',label:'Korean',region:'East Asian'},\n  {slug:'dawoodi-bohra',label:'Muslim \u00b7 Dawoodi Bohra',region:'Muslim'},\n  {slug:'muslim-nikah',label:'Muslim \u00b7 Nikah',region:'Muslim'},\n  {slug:'hausa-muslim',label:'Muslim \u00b7 West African (Hausa)',region:'Muslim'},\n  {slug:'yoruba-nigerian',label:'Nigerian \u00b7 Yoruba',region:'West African'},\n  {slug:'sikh',label:'Sikh',region:'South Asian'},\n];\n\nconst REGION_COLORS = {\n  'South Asian':{bg:'#EEF0FF',color:'#3C3489'},\n  'Muslim':{bg:'#E6F4EF',color:'#1A5C43'},\n  'Jewish':{bg:'#E8F1FB',color:'#0D4A87'},\n  'Christian':{bg:'#FBF0EC',color:'#7A2E18'},\n  'West African':{bg:'#FBE8F0',color:'#5C1A35'},\n  'East Asian':{bg:'#FBF8E0',color:'#6B5A00'},\n  'Buddhist':{bg:'#EAF4DC',color:'#2D5C0A'},\n  'Latin American':{bg:'#FBE8E8',color:'#6B1515'},\n  'Caribbean':{bg:'#FBF3E0',color:'#5C3800'},\n  'Southeast Asian':{bg:'#E6F4EF',color:'#1A5C43'},\n};\n\nfunction tradColor(slug) {\n  const t = TRADS.find(x=>x.slug===slug);\n  return REGION_COLORS[t?.region] || {bg:'#F5F0E8',color:'#6B5A20'};\n}\n\n// \u2500\u2500 Build tradition grid \u2500\u2500\nfunction buildGrid() {\n  document.getElementById('trad-grid').innerHTML = TRADS.map(t =>\n    `<button class=\"trad-chip\" data-slug=\"${t.slug}\" onclick=\"toggleTrad('${t.slug}')\">${t.label}</button>`\n  ).join('');\n}\n\nfunction filterTrads() {\n  const q = document.getElementById('trad-search').value.toLowerCase();\n  document.querySelectorAll('.trad-chip').forEach(c => {\n    c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';\n  });\n}\n\nfunction toggleTrad(slug) {\n  const idx = S.traditions.indexOf(slug);\n  if (idx > -1) { S.traditions.splice(idx,1); }\n  else {\n    if (S.traditions.length >= 2) {\n      const old = S.traditions.shift();\n      document.querySelector(`.trad-chip[data-slug=\"${old}\"]`)?.classList.remove('on');\n    }\n    S.traditions.push(slug);\n  }\n  document.querySelectorAll('.trad-chip').forEach(c =>\n    c.classList.toggle('on', S.traditions.includes(c.dataset.slug))\n  );\n  const n = S.traditions.length;\n  document.getElementById('trad-note').textContent = n===0\n    ? '0 selected \u2014 select 1 or 2'\n    : n===1 ? '1 selected \u2014 add a second for an interfaith plan'\n    : '2 traditions selected';\n}\n\n// \u2500\u2500 Budget \u2500\u2500\nfunction updateBudget() {\n  S.budget = parseInt(document.getElementById('budget-slider').value);\n  document.getElementById('budget-val').textContent = S.budget.toLocaleString();\n}\nfunction onBudgetChange() {\n  updateBudget();\n}\n\n// \u2500\u2500 Guests \u2500\u2500\nfunction adjGuests(d) {\n  guests = Math.max(10, Math.min(1000, guests + d));\n  document.getElementById('guest-count').textContent = guests;\n  S.guests = guests;\n}\n\n// \u2500\u2500 Personalise questions \u2500\u2500\nfunction personalise() {\n  var n1 = S.name1 || 'you';\n  var names = S.name2 ? (S.name1 + ' and ' + S.name2) : n1;\n  var el;\n  el = document.getElementById('q2-text'); if(el) el.innerHTML = 'When is <em>'+n1+'</em>\u2019s wedding?';\n  el = document.getElementById('q3-text'); if(el) el.innerHTML = 'Where are <em>'+names+'</em> getting married?';\n  el = document.getElementById('q4-text'); if(el) el.innerHTML = 'Which traditions will <em>'+names+'</em> honour?';\n  el = document.getElementById('q5-text'); if(el) el.innerHTML = 'What\u2019s your estimated budget, <em>'+n1+'</em>?';\n  el = document.getElementById('q6-text'); if(el) el.innerHTML = 'How many guests are you expecting?';\n}\n\n// \u2500\u2500 Navigation \u2500\u2500\nfunction goNext(from, skip=false) {\n  if (from===1) {\n    const n1 = document.getElementById('name1').value.trim();\n    const n2 = document.getElementById('name2').value.trim();\n    if (!n1||!n2) { document.getElementById('err-q1').classList.add('show'); return; }\n    if (!S.role1||!S.role2) { document.getElementById('err-q1').classList.add('show'); return; }\n    document.getElementById('err-q1').classList.remove('show');\n    S.name1=n1; S.name2=n2;\n    personalise();\n  }\n  if (from===2) {\n    S.date = document.getElementById('wedding-date').value || '';\n    S.dateSure = S.date !== '';\n  }\n  if (from===3) {\n    S.location = document.getElementById('location').value.trim() || '';\n  }\n  if (from===4) {\n    if (!S.traditions.length) { document.getElementById('err-q4').classList.add('show'); return; }\n    document.getElementById('err-q4').classList.remove('show');\n    // If interfaith, show Q4b; otherwise skip to Q5\n    if (S.traditions.length >= 2) {\n      buildQ4b();\n      // Transition to q4b\n      const cur = document.getElementById('q' + currentQ);\n      const next = document.getElementById('q4b');\n      cur.classList.add('exit-left'); cur.classList.remove('active');\n      setTimeout(function() {\n        cur.classList.remove('exit-left');\n        next.classList.add('active');\n      }, 260);\n      currentQ = '4b';\n      updateProgress();\n      return;\n    }\n  }\n  if (from==='4b') {\n    // Go to Q5\n    const cur = document.getElementById('q4b');\n    const next = document.getElementById('q5');\n    cur.classList.add('exit-left'); cur.classList.remove('active');\n    setTimeout(function() { cur.classList.remove('exit-left'); next.classList.add('active'); }, 260);\n    currentQ = 5;\n    updateProgress();\n    return;\n  }\n  if (from===5 && !skip) S.budget = parseInt(document.getElementById('budget-slider').value);\n  if (from===6) { S.guests=guests; showReviewScreen(); return; }\n\n  if(window._editingFromReview){window._editingFromReview=false;transitionTo('q'+from,'q6b');currentQ='6b';updateProgress();setTimeout(buildReviewSummary,270);return;}\n  var ex=_extracted;var next=from+1;\n  if(ex&&Object.keys(ex).length){while((next===2&&ex.date)||(next===3&&ex.location)||(next===4&&ex.traditions)||(next===5&&ex.budget)||(next===6&&ex.guests)){next++;}if(next>=7){S.guests=S.guests||guests;showReviewScreen();return;}}\n  doTransition(currentQ,next);currentQ=next;updateProgress();\n}\n\nfunction doTransition(from, to) {\n  const a = document.getElementById('q' + from);\n  const b = document.getElementById('q' + to);\n  a.classList.add('exit-left'); a.classList.remove('active');\n  setTimeout(()=>{ a.classList.remove('exit-left'); b.classList.add('active'); }, 260);\n}\n\nconst TOTAL_STEPS = 9;\nfunction updateProgress() {\n  if (currentQ === 0 || currentQ === '0b') {\n    document.getElementById('progress-fill').style.width = '0%';\n    document.getElementById('step-indicator').textContent = '';\n    return;\n  }\n  const step=currentQ==='4b'?4.5:currentQ==='6b'?6.5:(currentQ===7?7:currentQ===8?8:currentQ);\n  document.getElementById('progress-fill').style.width=(step/TOTAL_STEPS*100)+'%';\n  const label=currentQ==='4b'?'4 of '+TOTAL_STEPS:currentQ==='6b'?'Review':currentQ+' of '+TOTAL_STEPS;\n  document.getElementById('step-indicator').textContent = label;\n}\n\nfunction goBack() {\n  if(currentQ===1||currentQ==='1')return;\n  if(currentQ===7||currentQ===8||currentQ===9)window._editingFromReview=false;\n  if(window._editingFromReview){window._editingFromReview=false;transitionTo('q'+currentQ,'q6b');currentQ='6b';updateProgress();setTimeout(buildReviewSummary,270);return;}\n  if (currentQ === 7) {\n    transitionTo('q7', 'q6');\n    currentQ = 6; updateProgress(); return;\n  }\n  // Determine previous screen\n  let prevId, prevQ;\n  if (currentQ === '4b') { prevId = 'q4'; prevQ = 4; }\n  else if (currentQ === 5) {\n    if (S.traditions.length >= 2) { prevId = 'q4b'; prevQ = '4b'; }\n    else { prevId = 'q4'; prevQ = 4; }\n  }\n  else if(currentQ==='6b'){prevId='q6';prevQ=6;}\n  else { prevQ = currentQ - 1; prevId = 'q' + prevQ; }\n\n  const cur = document.getElementById('q' + currentQ);\n  const prev = document.getElementById(prevId);\n  if (!cur || !prev) return;\n  cur.style.transition = 'opacity 0.25s ease, transform 0.25s ease';\n  cur.style.opacity = '0';\n  cur.style.transform = 'translateX(50px)';\n  setTimeout(function() {\n    cur.classList.remove('active');\n    cur.style.transition = '';\n    cur.style.opacity = '';\n    cur.style.transform = '';\n    prev.classList.add('active');\n  }, 250);\n  currentQ = prevQ;\n  updateProgress();\n}\n\n// \u2500\u2500 Submit \u2500\u2500\nconst LOADING_MSGS = [\n  ['Building your plan\u2026','Reading your traditions from the cultural taxonomy'],\n  ['Merging traditions\u2026','Combining checklists and resolving any conflicts'],\n  ['Allocating your budget\u2026','Distributing across ceremony and vendor categories'],\n  ['Almost ready\u2026','Finalising your personalised wedding plan'],\n];\n\nasync function submitPlan() {\n  window._editingFromReview=false;\n  var activeScreen = document.querySelector('.screen.active');\n  if (activeScreen) { activeScreen.classList.add('exit-left'); activeScreen.classList.remove('active'); }\n  var _loadingTimer = setTimeout(function(){ if(activeScreen) activeScreen.classList.remove('exit-left'); document.getElementById('loading-screen').classList.add('active'); }, 260);\n  document.getElementById('progress-fill').style.width='90%';\n  document.getElementById('step-indicator').textContent='';\n\n  var mi=0;\n  var iv = setInterval(function(){\n    mi=(mi+1)%LOADING_MSGS.length;\n    document.getElementById('loading-text').textContent=LOADING_MSGS[mi][0];\n    document.getElementById('loading-sub').textContent=LOADING_MSGS[mi][1];\n  },1800);\n\n  try {\n    const controller = new AbortController();\n    const timeout = setTimeout(() => controller.abort(), 15000);\n    const res = await fetch('/api/generate-plan',{\n      method:'POST',\n      headers:{'Content-Type':'application/json'},\n      body:JSON.stringify({slugs:S.traditions, budget:S.budget, jurisdiction:S.location||'US'}),\n      signal: controller.signal,\n    });\n    clearTimeout(timeout);\n    clearTimeout(_loadingTimer);\n    const data = await res.json();\n    clearInterval(iv);\n    if (!data.success) { showErr(data.error||'Something went wrong generating your plan.'); return; }\n    S.plan=data.plan;\n    // Go to ceremony selection (Q7) instead of results directly\n    planCeremonies = S.plan.ceremonySequence || S.plan.ceremonies || [];\n    ceremonySelections = {}; // reset selections\n    const ls = document.getElementById('loading-screen');\n    ls.classList.add('exit-left'); ls.classList.remove('active');\n    setTimeout(function() {\n      ls.classList.remove('exit-left');\n      try {\n        showCeremonySelection(planCeremonies);\n      } catch(e) {\n        console.error('Q7 error:', e);\n        var cont = document.getElementById('cs-container');\n        if (cont) cont.innerHTML = '<p style=\"color:var(--muted);font-style:italic;padding:20px 0\">Could not load ceremonies \u2014 ' + e.message + '</p>';\n      }\n      const q7 = document.getElementById('q7');\n      if (q7) q7.classList.add('active');\n      currentQ = 7;\n      updateProgress();\n    }, 260);\n  } catch(e) {\n    clearInterval(iv);\n    if (e.name === 'AbortError') {\n      showErr('The plan is taking longer than expected. Please try again.');\n    } else {\n      showErr('Could not generate your plan. Please check your connection and try again.');\n    }\n  }\n}\n\nfunction showErr(msg) {\n  var loadingEl = document.getElementById('loading-screen');\n  loadingEl.innerHTML = '<div style=\"display:flex;flex-direction:column;align-items:center;gap:16px;max-width:380px;text-align:center;padding:0 24px\">' +\n    FLOWER_SVG_20 +\n    '<div style=\"font-size:16px;font-style:italic;color:var(--deep)\">Something went wrong</div>' +\n    '<div style=\"font-size:13px;color:var(--muted);font-style:italic;line-height:1.6\">' + msg + '</div>' +\n    '<button class=\"cta\" onclick=\"location.reload()\" style=\"margin-top:8px\">Start again</button>' +\n  '</div>';\n}\n\n// \u2500\u2500 Results \u2500\u2500\nfunction transitionTo(fromId, toId) {\n  var _nav=document.getElementById('tab-ceremonies-nav');if(_nav)_nav.style.display='none';\n  // Deactivate ALL screens\n  document.querySelectorAll('.screen').forEach(function(s) {\n    if (s.id === fromId) {\n      s.classList.add('exit-left');\n    }\n    s.classList.remove('active');\n  });\n  setTimeout(function() {\n    document.querySelectorAll('.screen').forEach(function(s) {\n      s.classList.remove('exit-left');\n    });\n    var target = document.getElementById(toId);\n    if (target) {\n      target.classList.add('active');\n    }\n  }, 260);\n}\n\nfunction showResults() {\n  transitionTo('loading-screen', 'results-screen');\n  document.getElementById('progress-fill').style.width='100%';\n  setTimeout(function() { populateResults(); }, 300);\n}\n\nfunction populateResults() {\n  if (!S.plan) { console.error('populateResults: S.plan is null'); return; }\n  var p = S.plan;\n  var names = S.name2 ? (S.name1 + ' & ' + S.name2) : S.name1;\n  var tradNames = S.traditions.map(function(s){\n    var t = TRADS.find(function(t){ return t.slug===s; });\n    return t ? t.label : s;\n  }).join(' + ');\n\n  document.getElementById('results-title').innerHTML = '<em>' + names + '</em> \u2014 your wedding plan';\n  var dateStr = S.date\n    ? new Date(S.date).toLocaleDateString('en-US',{month:'long',year:'numeric'})\n    : 'Date to be confirmed';\n  var budgetStr = (S.budget||0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});\n  document.getElementById('results-subtitle').textContent = tradNames + ' \u00b7 ' + budgetStr + ' \u00b7 ' + S.guests + ' guests \u00b7 ' + dateStr;\n\n  document.getElementById('conflicts-wrap').innerHTML = '';\n  if (!S.dateSure) {\n    var dateNote = document.createElement('div');\n    dateNote.className = 'conflict-banner';\n    dateNote.innerHTML = '<em>Wedding date not yet confirmed</em> \u2014 checklist milestones are shown relative to your wedding date. Add your date any time to get calendar-specific guidance.';\n    document.getElementById('conflicts-wrap').appendChild(dateNote);\n  }\n\n  if (p.conflicts && p.conflicts.length) {\n    p.conflicts.forEach(function(c) {\n      var div = document.createElement('div');\n      div.className = 'conflict-banner';\n      div.textContent = 'Note \u2014 ' + (c.description||c.message||'');\n      document.getElementById('conflicts-wrap').appendChild(div);\n    });\n  }\n\n  try { renderChecklist(p.checklist||[]); } catch(e) { console.error('renderChecklist:', e); }\n  try { renderCeremonies(p.ceremonySequence||p.ceremonies||[]); } catch(e) { console.error('renderCeremonies:', e); }\n  try { renderBudget(p.budget||p.budgetBreakdown||{}); } catch(e) { console.error('renderBudget:', e); }\n}\n\nfunction switchTab(name, btn) {\n  var _nav=document.getElementById('tab-ceremonies-nav');if(_nav)_nav.style.display=(name==='ceremonies')?'block':'none';\n  document.querySelectorAll('.out-tab').forEach(function(t){t.classList.remove('on');});\n  document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('on');});\n  btn.classList.add('on');\n  document.getElementById('tab-'+name).classList.add('on');\n}\n\n// \u2500\u2500 Render checklist \u2500\u2500\nfunction milestoneToDate(milestone, weddingDate) {\n  if (!weddingDate) return milestone;\n  const d = new Date(weddingDate);\n  if (isNaN(d)) return milestone;\n  const ml = milestone.toLowerCase();\n  const monthMap = {\n    '18 months': 18, '12 months': 12, '10 months': 10,\n    '8 months': 8, '6 months': 6, '4 months': 4,\n    '3 months': 3, '2 months': 2, '1 month': 1,\n  };\n  for (const [key, months] of Object.entries(monthMap)) {\n    if (ml.includes(key.toLowerCase())) {\n      const target = new Date(d);\n      target.setMonth(target.getMonth() - months);\n      const label = target.toLocaleDateString('en-US', {month:'short', year:'numeric'});\n      return `${label} <span style=\"font-style:italic;opacity:0.6;font-size:10px\">(${milestone})</span>`;\n    }\n  }\n  if (ml.includes('day of') || ml.includes('day-of')) {\n    return d.toLocaleDateString('en-US', {weekday:'long', day:'numeric', month:'long', year:'numeric'});\n  }\n  return milestone;\n}\n\nfunction renderChecklist(items) {\n  const el = document.getElementById('tab-checklist');\n  if (!items.length) {\n    el.innerHTML='<p style=\"color:var(--muted);font-style:italic;font-size:13px;padding:20px 0\">No checklist items found.</p>';\n    return;\n  }\n\n  const trad1 = S.traditions[0];\n  const trad2 = S.traditions[1];\n\n  function checkItem(item, i) {\n    const label = item.label||item.task||item.description||'';\n    const trad = item.tradition||item.source||item._sourceTradition||'';\n    const col = trad ? tradColor(trad) : null;\n    const tradName = col ? (TRADS.find(t=>t.slug===trad)||{label:trad}).label.split('\u00b7')[0].trim() : '';\n    return '<div class=\"checklist-item\">' +\n      '<div class=\"check-box\" onclick=\"this.classList.toggle(\\'checked\\')\"></div>' +\n      '<div class=\"check-label\">' + label +\n        (col ? '<span class=\"trad-tag\" style=\"background:' + col.bg + ';color:' + col.color + ';border-color:' + col.bg + '\">' + tradName + '</span>' : '') +\n      '</div>' +\n    '</div>';\n  }\n\n  // Split items by tradition\n  const side1 = items.filter(function(i) {\n    const src = i.tradition||i.source||i._sourceTradition||'';\n    return src && src !== 'Universal' && src === trad1;\n  });\n  const side2 = items.filter(function(i) {\n    const src = i.tradition||i.source||i._sourceTradition||'';\n    return trad2 && src && src !== 'Universal' && src === trad2;\n  });\n  const shared = items.filter(function(i) {\n    const src = i.tradition||i.source||i._sourceTradition||'';\n    return !src || src === 'Universal' || src === 'both' || src === 'Interfaith' ||\n           (!side1.includes(i) && !side2.includes(i));\n  });\n\n  function groupByMilestone(list) {\n    const groups = {};\n    list.forEach(function(item) {\n      const m = item.milestone||item.timeframe||'General';\n      if (!groups[m]) groups[m] = [];\n      groups[m].push(item);\n    });\n    return groups;\n  }\n\n  function renderGroup(list) {\n    const groups = groupByMilestone(list);\n    return Object.entries(groups).map(function(entry) {\n      const m = entry[0], its = entry[1];\n      return '<div class=\"out-ey\">' + milestoneToDate(m, S.date) + '</div>' +\n        its.map(checkItem).join('');\n    }).join('');\n  }\n\n  // If no meaningful split, show as grouped list\n  if (side1.length === 0 && side2.length === 0) {\n    el.innerHTML = renderGroup(items);\n    return;\n  }\n\n  const name1 = S.name1 || (TRADS.find(function(t){return t.slug===trad1;})||{label:'Partner 1'}).label.split('\u00b7')[0].trim();\n  const name2 = S.name2 || (trad2 ? (TRADS.find(function(t){return t.slug===trad2;})||{label:'Partner 2'}).label.split('\u00b7')[0].trim() : 'Partner 2');\n\n  el.innerHTML =\n    '<div class=\"checklist-cols\">' +\n      '<div>' +\n        '<div class=\"ceremony-col-header\">' + name1 + '\\'s checklist</div>' +\n        (side1.length ? renderGroup(side1) : '<p style=\"font-size:12px;color:var(--muted);font-style:italic;padding:8px 0\">No specific items</p>') +\n      '</div>' +\n      (trad2 ? '<div>' +\n        '<div class=\"ceremony-col-header\">' + name2 + '\\'s checklist</div>' +\n        (side2.length ? renderGroup(side2) : '<p style=\"font-size:12px;color:var(--muted);font-style:italic;padding:8px 0\">No specific items</p>') +\n      '</div>' : '<div></div>') +\n    '</div>' +\n    (shared.length ?\n      '<div class=\"ceremony-shared-header\">Shared tasks</div>' +\n      renderGroup(shared)\n    : '');\n}\n\n// \u2500\u2500 Render ceremony vertical timeline \u2500\u2500\nfunction renderCeremonies(items) {\n  var el = document.getElementById('tab-ceremonies');\n  if (!el) return;\n  if (!items || !items.length) {\n    el.innerHTML = '<p style=\"color:var(--muted);font-style:italic;padding:20px 0\">No ceremony sequence found.</p>';\n    return;\n  }\n  var n1 = S.name1 || 'Partner one';\n  var n2 = S.name2 || 'Partner two';\n  var n1Role = S.role1 || 'bride';\n  var n2Role = S.role2 || 'groom';\n  var BUCKETS = ['12+ mo','6-12 mo','3-6 mo','1-3 mo','Weeks','Day before','Wedding day','After'];\n  function getBucket(timing) {\n    if (!timing) return 4;\n    var t = timing.toLowerCase();\n    if (t.includes('12') || t.includes('year')) return 0;\n    if (t.includes('6') || t.includes('8') || t.includes('9') || t.includes('10')) return 1;\n    if (t.includes('3') || t.includes('4') || t.includes('5')) return 2;\n    if (t.includes('1') || t.includes('2') || t.includes('month')) return 3;\n    if (t.includes('week')) return 4;\n    if (t.includes('day before') || t.includes('eve')) return 5;\n    if (t.includes('day of') || t.includes('morning') || t.includes('ceremony day')) return 6;\n    if (t.includes('after') || t.includes('post') || t.includes('homecoming')) return 7;\n    return 4;\n  }\n  var COLORS = {side1:'#C8941A', side2:'#3949AB', both:'#4A7C59'};\n  var side1 = [], side2 = [], both = [];\n  items.forEach(function(item) {\n    var side = item.side || 'both';\n    if (side === 'bride+groom') { side1.push(item); side2.push(item); }\n    else if (side === n1Role) side1.push(item);\n    else if (side === n2Role) side2.push(item);\n    else both.push(item);\n  });\n  var colW = 100 / BUCKETS.length;\n  function ganttRow(item, color) {\n    var b = getBucket(item.timing);\n    var name = item.name || item.event || '';\n    var tip = (item.timing || '') + (item.duration ? ' \u00b7 ' + item.duration : '');\n    return '<div class=\"gantt-bar\" style=\"display:flex;align-items:center;margin-bottom:5px;gap:6px\">' +\n      '<div style=\"width:160px;flex-shrink:0;font-size:11px;font-style:italic;color:var(--tx);text-align:right;padding-right:8px;line-height:1.3;background:#FDFAF0\">' + name + '</div>' +\n      '<div style=\"flex:1;height:24px;position:relative;background:#FDFAF0\">' +\n        '<div class=\"gantt-tip\" style=\"position:absolute;left:' + (b*colW) + '%;width:' + colW + '%;height:100%;background:' + color + ';border-radius:4px;display:flex;align-items:center;padding:0 6px;box-sizing:border-box;cursor:default\" title=\"' + tip + '\">' +\n          '<span style=\"font-size:9px;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">' + (item.timing||'') + '</span>' +\n        '</div>' +\n      '</div>' +\n    '</div>';\n  }\n  function section(title, items2, color) {\n    if (!items2.length) return '';\n    return '<div style=\"font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:16px 0 8px;font-style:italic;background:#FDFAF0\">' + title + '</div>' +\n      items2.map(function(i){ return ganttRow(i, color); }).join('');\n  }\n  var header = '<div style=\"display:flex;align-items:center;margin-bottom:8px;position:sticky;top:0;background:#FDFAF0;padding:4px 0;z-index:5\">' +\n    '<div style=\"width:160px;flex-shrink:0\"></div>' +\n    '<div style=\"flex:1;display:flex\">' +\n    BUCKETS.map(function(b){ return '<div style=\"flex:1;font-size:9px;color:var(--muted);font-style:italic;text-align:center;border-left:1px solid var(--bdr);padding:2px 0;background:#FDFAF0\">' + b + '</div>'; }).join('') +\n    '</div></div>';\n  el.innerHTML = '<div style=\"overflow-x:clip;min-height:200px\"><div style=\"min-width:600px\">' + header +\n    section(pos(n1)+' ceremonies', side1, COLORS.side1) +\n    section(pos(n2)+' ceremonies', side2, COLORS.side2) +\n    section('Common ceremonies', both, COLORS.both) +\n    '</div></div>';\n}\n\n\n  function officiantLabelForSlug(slug) {\n    var s = slug || '';\n    var has = function(k){ return s.includes(k); };\n    if (has('hindu')||has('vedic')||has('jain')||has('rajasthani')||has('gujarati')||has('marathi')||has('tamil')||has('bengali')||has('assamese')||has('bihari')||has('odia')||has('kerala')||has('kashmiri')||has('manipuri')||has('andhra')||has('arya')||has('punjabi')||has('north-indian')) return 'Pandit';\n    if (has('sikh')) return 'Granthi';\n    if (has('muslim')||has('nikah')||has('bohra')||has('hausa')) return 'Imam';\n    if (has('jewish')) return 'Rabbi';\n    if (has('catholic')||has('christian')||has('greek')||has('filipino')||has('latin')||has('mexican')) return 'Priest';\n    if (has('buddhist')||has('sri-lankan')||has('thai')) return 'Monk';\n    return 'Officiant';\n  }\n  function officiantLabel(slug) {\n    if (slug) return officiantLabelForSlug(slug);\n    var slugs = S.traditions || [];\n    var seen = {};\n    var labels = slugs.map(function(s){ return officiantLabelForSlug(s); }).filter(function(l){ if(seen[l])return false; seen[l]=true; return true; });\n    return labels.length ? labels.join(' / ') : 'Officiant';\n  }\n\n  var VENDOR_PCT = {\n    'Venue hire':0.28, 'Catering & bar':0.25, 'Photography & video':0.10,\n    'Music & entertainment':0.05, 'Florals & d\xc3\xa9cor':0.08,\n    'Hair & makeup (bride)':0.03,\n    'Officiant / pandit / priest':0.02, 'Pandit':0.02, 'Priest':0.02,\n    'Rabbi':0.02, 'Imam':0.02, 'Granthi':0.02, 'Monk':0.02, 'Officiant':0.02,\n    'Mehndi artist':0.01, 'Henna for guests':0.005,\n    'Horse & procession':0.02, 'Dhol':0.01, 'Dhol & band':0.015,\n    'Bridal wear & styling':0.04, 'Menswear & styling':0.02,\n    'Invitations & stationery':0.015, 'Lighting & AV':0.02,\n    'Cake & desserts':0.01, 'Transport (couple)':0.01,\n    'Guest accommodation & transport':0.02,\n  };\nfunction renderBudget(budgetData) {\n  var el = document.getElementById('tab-budget');\n  if (!el) return;\n  if (S.userRole === 'advisor') {\n    el.innerHTML = '<div style=\"padding:40px;text-align:center;color:var(--muted);font-style:italic\">Budget not available in advisor view.</div>';\n    return;\n  }\n  var totalBudget = S.budget || 50000;\n  var n1 = S.name1||'Partner one', n2 = S.name2||'Partner two';\n  if (!window.budgetExclusions) window.budgetExclusions = {};\n\n  function getCersForSection(sectionType) {\n    var cers=[]; var seen={};\n    Object.entries(ceremonySelections).forEach(function(e) {\n      var slug=e[0]; var sel=e[1]||{};\n      Object.entries(sel[sectionType]||{}).forEach(function(f) {\n        if (f[1]===false) return;\n        var cidx=parseInt(f[0]);\n        var item=planCeremonies[cidx]||(cidx>=10000?planCeremonies[cidx-10000]:null);\n        if (!item) return;\n        var nm=item.name||item.event||'';\n        if (!seen[nm]) { seen[nm]=true; cers.push({item:item,slug:slug,order:item.order||cidx}); }\n      });\n    });\n    cers.sort(function(a,b){return (a.order||0)-(b.order||0);});\n    return cers;\n  }\n\n  var s1=getCersForSection('side1'), s2=getCersForSection('side2'), sb=getCersForSection('both');\n  var total=s1.length+s2.length+sb.length||1;\n  var s1B=Math.round(totalBudget*s1.length/total);\n  var s2B=Math.round(totalBudget*s2.length/total);\n  var sbB=Math.round(totalBudget*sb.length/total);\n\n  function vendorAmt(cat,cats,cerBudget) {\n    var w=VENDOR_PCT[cat]||0.01;\n    var tw=cats.reduce(function(s,c){return s+(VENDOR_PCT[c]||0.01);},0);\n    return Math.round(cerBudget*w/tw);\n  }\n  function cerSubtotal(item,cerBudget) {\n    var cats=item.vendor_categories&&item.vendor_categories.length?item.vendor_categories.map(function(v){return v.category;}):null;\n    if (!cats) return cerBudget;\n    return cats.reduce(function(s,cat){\n      var excKey='cer::'+(item.name||'')+'::'+cat;\n      return s+(window.budgetExclusions[excKey]?0:vendorAmt(cat,cats,cerBudget));\n    },0);\n  }\n\n  function donutChart(segments) {\n    var tot=segments.reduce(function(s,x){return s+x.value;},0)||1;\n    var r=40,cx=50,cy=50,sw=18,offset=0,paths='',legend='';\n    var cols=['#C8941A','#3949AB','#4A7C59','#B7410E','#6A4C9C','#1565C0','#2E7D32'];\n    segments.forEach(function(seg,i){\n      var pct=seg.value/tot;\n      var dash=pct*2*Math.PI*r, gap=(1-pct)*2*Math.PI*r;\n      var col=cols[i%cols.length];\n      paths+='<circle r=\"'+r+'\" cx=\"'+cx+'\" cy=\"'+cy+'\" fill=\"none\" stroke=\"'+col+'\" stroke-width=\"'+sw+'\" stroke-dasharray=\"'+dash.toFixed(2)+' '+gap.toFixed(2)+'\" stroke-dashoffset=\"'+(-offset*2*Math.PI*r).toFixed(2)+'\" transform=\"rotate(-90 '+cx+' '+cy+')\"/>';\n      legend+='<div style=\"display:flex;align-items:center;gap:6px;margin-bottom:4px\"><div style=\"width:10px;height:10px;border-radius:50%;background:'+col+';flex-shrink:0\"></div><span style=\"font-size:11px;color:var(--muted);font-style:italic;flex:1\">'+seg.label+'</span><span style=\"font-size:11px;color:var(--deep);min-width:60px;text-align:right\">'+seg.value.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})+'</span></div>';\n      offset+=pct;\n    });\n    return '<div style=\"display:flex;align-items:center;gap:20px;margin-bottom:20px\"><svg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" style=\"flex-shrink:0\">'+paths+'<text x=\"50\" y=\"53\" text-anchor=\"middle\" font-size=\"8\" fill=\"var(--muted)\" font-style=\"italic\" font-family=\"serif\">budget</text></svg><div style=\"flex:1\">'+legend+'</div></div>';\n  }\n\n  function cerAccordion(entry,perCer,sectionType,idx,prevSlug) {\n    var item=entry.item, slug=entry.slug;\n    var name=item.name||item.event||'';\n    var cats=item.vendor_categories&&item.vendor_categories.length?item.vendor_categories.map(function(v){return v.category;}):null;\n    var offLabel=officiantLabelForSlug(slug);\n    var subtotal=cerSubtotal(item,perCer);\n    var accId='bacc-'+sectionType+'-'+idx;\n    var divider=(prevSlug&&prevSlug!==slug&&S.traditions&&S.traditions.length>1)\n      ?'<div style=\"font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);padding:8px 4px 4px;font-style:italic;border-top:1px solid var(--warm)\">'+slug+'</div>':'';\n    var rows=cats?cats.map(function(cat){\n      var dc=(cat==='Officiant / pandit / priest')?offLabel:cat;\n      var amt=vendorAmt(cat,cats,perCer);\n      var excKey='cer::'+name+'::'+cat;\n      var excl=!!window.budgetExclusions[excKey];\n      var barPct=perCer>0?Math.min(Math.round(amt/perCer*100),100):0;\n      return '<div style=\"display:flex;align-items:center;gap:8px;padding:5px 12px;border-bottom:1px solid var(--warm);'+(excl?'opacity:0.4':'')+'\">'\n        +'<input type=\"checkbox\" '+(excl?'':'checked')+' data-exckey=\"'+excKey+'\" onchange=\"toggleBudgetCat(this)\" style=\"accent-color:var(--gd);cursor:pointer;flex-shrink:0\">'\n        +'<span style=\"flex:1;font-size:12px;font-style:italic;color:var(--muted);'+(excl?'text-decoration:line-through':'')+'\">'+(dc||cat)+'</span>'\n        +'<div style=\"width:60px;background:var(--warm);border-radius:2px;height:4px;overflow:hidden;flex-shrink:0\"><div style=\"width:'+barPct+'%;height:100%;background:'+(excl?'var(--bdr)':'var(--gd)')+';border-radius:2px\"></div></div>'\n        +'<span style=\"font-size:12px;color:var(--muted);min-width:65px;text-align:right;font-style:italic\">'+amt.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})+'</span>'\n        +'</div>';\n    }).join(''):'<div style=\"font-size:11px;color:var(--bdr);font-style:italic;padding:6px 12px\">Vendor categories not yet set</div>';\n    return divider+'<div style=\"border:1px solid var(--bdr);border-radius:8px;margin-bottom:8px;overflow:hidden\">'\n      +'<div data-accid=\"'+accId+'\" onclick=\"toggleBudgetAcc(this.dataset.accid)\" style=\"display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:#FDFAF0\">'\n        +'<span id=\"'+accId+'-arrow\" style=\"font-size:10px;color:var(--muted)\">&#9658;</span>'\n        +'<div style=\"flex:1\"><div style=\"font-size:13px;font-style:italic;color:var(--deep)\">'+name+'</div>'\n        +(item.timing?'<div style=\"font-size:11px;color:var(--muted)\">'+item.timing+'</div>':'')+'</div>'\n        +'<div style=\"font-size:13px;font-style:italic;color:var(--deep);min-width:70px;text-align:right\">'+subtotal.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})+'</div>'\n      +'</div>'\n      +'<div id=\"'+accId+'\" style=\"display:none;border-top:1px solid var(--bdr)\">'+rows+'</div>'\n      +'</div>';\n  }\n\n  function sectionTab(cers,sectionBudget,sectionType) {\n    if (!cers.length) return '<div style=\"padding:24px;text-align:center;color:var(--muted);font-style:italic\">No ceremonies</div>';\n    var perCer=cers.length?Math.round(sectionBudget/cers.length):0;\n    var catTotals={};\n    cers.forEach(function(entry){\n      var item=entry.item;\n      var cats=item.vendor_categories&&item.vendor_categories.length?item.vendor_categories.map(function(v){return v.category;}):null;\n      if (!cats) return;\n      cats.forEach(function(cat){\n        var excKey='cer::'+(item.name||'')+'::'+cat;\n        if (!window.budgetExclusions[excKey]) {\n          var dc=(cat==='Officiant / pandit / priest')?officiantLabelForSlug(cers[0].slug):cat;\n          catTotals[dc]=(catTotals[dc]||0)+vendorAmt(cat,cats,perCer);\n        }\n      });\n    });\n    var segs=Object.entries(catTotals).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(e){return {label:e[0],value:e[1]};});\n    var sectionTotal=cers.reduce(function(s,e){return s+cerSubtotal(e.item,perCer);},0);\n    var html=segs.length?donutChart(segs):'';\n    cers.forEach(function(entry,i){ html+=cerAccordion(entry,perCer,sectionType,i,i>0?cers[i-1].slug:null); });\n    html+='<div style=\"display:flex;justify-content:space-between;padding:10px 14px;background:var(--warm);border-radius:8px;margin-top:4px\"><span style=\"font-size:13px;font-style:italic;color:var(--deep)\">Section total</span><span style=\"font-size:14px;font-style:italic;color:var(--deep)\">'+sectionTotal.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})+'</span></div>';\n    return html;\n  }\n\n  var sections=[\n    {id:'s1',label:pos(n1)+\"'s ceremonies\",cers:s1,budget:s1B,type:'side1'},\n    {id:'s2',label:pos(n2)+\"'s ceremonies\",cers:s2,budget:s2B,type:'side2'},\n    {id:'sb',label:'Common ceremonies',cers:sb,budget:sbB,type:'both'},\n  ].filter(function(s){return s.cers.length>0;});\n  if (!sections.length){el.innerHTML='<div style=\"padding:40px;text-align:center;color:var(--muted);font-style:italic\">No ceremonies selected.</div>';return;}\n  var activeTab=window._budgetTab||sections[0].id;\n  if (!sections.find(function(s){return s.id===activeTab;})) activeTab=sections[0].id;\n  var tabBar='<div style=\"display:flex;border-bottom:1px solid var(--bdr);margin-bottom:20px;overflow-x:auto\">'+\n    sections.map(function(s){\n      var active=s.id===activeTab;\n      var st='padding:8px 16px;border:none;background:none;font-size:11px;letter-spacing:1px;font-style:italic;cursor:pointer;border-bottom:2px solid '+(active?'var(--deep)':'transparent')+';color:'+(active?'var(--deep)':'var(--muted)')+';white-space:nowrap;flex-shrink:0';\n      return '<button data-tabid=\"'+s.id+'\" onclick=\"switchBudgetTab(this.dataset.tabid)\" style=\"'+st+'\">'+s.label+'</button>';\n    }).join('')+'</div>';\n  var activeSection=sections.find(function(s){return s.id===activeTab;});\n  el.innerHTML='<div style=\"text-align:center;margin-bottom:20px\"><div class=\"budget-total-display\">'+totalBudget.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})+'</div><div class=\"budget-sub\">total budget &middot; '+total+' ceremonies</div></div>'+tabBar+'<div id=\"budget-tab-content\">'+sectionTab(activeSection.cers,activeSection.budget,activeSection.type)+'</div>';\n}\nfunction switchBudgetTab(id){window._budgetTab=id;renderBudget({});}\nfunction toggleBudgetAcc(id){var el=document.getElementById(id);var arrow=document.getElementById(id+'-arrow');if(!el)return;var open=el.style.display!=='none';el.style.display=open?'none':'block';if(arrow)arrow.style.transform=open?'':'rotate(90deg)';}\nfunction toggleBudgetCat(cb){var excKey=cb.dataset.exckey;if(!window.budgetExclusions)window.budgetExclusions={};window.budgetExclusions[excKey]=!cb.checked;renderBudget({});}\n\n\n\n\n\n// \u2500\u2500 Ceremony selection state \u2500\u2500\nvar ceremonySelections = {};\nvar planCeremonies = [];\n\nfunction showCeremonySelection(ceremonies) {\n  planCeremonies = ceremonies;\n  var container = document.getElementById('cs-container');\n  if (!ceremonies || !ceremonies.length) {\n    if (container) container.innerHTML = '<p style=\"color:var(--muted);font-style:italic;padding:20px 0\">No ceremonies found.</p>';\n    return;\n  }\n  var n1 = S.name1 || 'Partner one';\n  var n2 = S.name2 || 'Partner two';\n  var trad1 = S.traditions[0];\n  var trad2 = S.traditions[1] || null;\n  var n1Role = S.role1;\n  var n2Role = S.role2;\n  var allTradSlugs = trad2 ? [trad1, trad2] : [trad1];\n  ceremonySelections = {};\n\n  var tradBlocks = allTradSlugs.map(function(tradSlug) {\n    var tradInfo = TRADS.find(function(t){ return t.slug===tradSlug; }) || {label:tradSlug};\n    var tradCeremonies = ceremonies.filter(function(item) {\n      var src = item._sourceTraditionSlug || item.tradition || item.source || '';\n      if (!trad2) return true;\n      return src === tradSlug;\n    });\n    var side1 = [], side2 = [], both = [];\n    var seenS1={}, seenS2={}, seenBoth={};\n    tradCeremonies.forEach(function(item) {\n      var globalIdx = ceremonies.indexOf(item);\n      var side = item.side || 'both';\n      var nm = item.name || item.event || '';\n      if (side === 'bride+groom') {\n        if (!seenS1[nm]) { seenS1[nm]=true; side1.push({item:item,idx:globalIdx}); }\n        if (!seenS2[nm]) { seenS2[nm]=true; side2.push({item:item,idx:globalIdx+10000}); }\n      } else if (side === n1Role) {\n        if (!seenS1[nm]) { seenS1[nm]=true; side1.push({item:item,idx:globalIdx}); }\n      } else if (side === n2Role) {\n        if (!seenS2[nm]) { seenS2[nm]=true; side2.push({item:item,idx:globalIdx}); }\n      } else {\n        if (!seenBoth[nm]) { seenBoth[nm]=true; both.push({item:item,idx:globalIdx}); }\n      }\n    });\n    ceremonySelections[tradSlug] = {side1:{},side2:{},both:{}};\n    side1.forEach(function(ci){ ceremonySelections[tradSlug].side1[ci.idx]=true; });\n    side2.forEach(function(ci){ ceremonySelections[tradSlug].side2[ci.idx]=true; });\n    both.forEach(function(ci){ ceremonySelections[tradSlug].both[ci.idx]=true; });\n    return {tradSlug:tradSlug,tradLabel:tradInfo.label,side1:side1,side2:side2,both:both};\n  });\n\n  function csItemHtml(ci, tradSlug, group) {\n    var sel = ceremonySelections[tradSlug] && ceremonySelections[tradSlug][group][ci.idx] !== false;\n    var name = ci.item.name || ci.item.event || '';\n    var timing = ci.item.timing || '';\n    var ds = 'data-slug=\"' + tradSlug + '\" data-from=\"' + group + '\" data-idx=\"' + ci.idx + '\"';\n    var menuItems = '';\n    if (group !== 'side1') menuItems += '<button class=\"cs-popover-item cs-move\" ' + ds + ' data-to=\"side1\">Move to ' + n1 + '</button>';\n    if (group !== 'side2') menuItems += '<button class=\"cs-popover-item cs-move\" ' + ds + ' data-to=\"side2\">Move to ' + n2 + '</button>';\n    if (group !== 'both')  menuItems += '<button class=\"cs-popover-item cs-move\" ' + ds + ' data-to=\"both\">Move to Both</button>';\n    menuItems += '<div class=\"cs-popover-divider\"></div>';\n    if (group !== 'side1') menuItems += '<button class=\"cs-popover-item cs-copy\" ' + ds + ' data-to=\"side1\">Copy to ' + n1 + '</button>';\n    if (group !== 'side2') menuItems += '<button class=\"cs-popover-item cs-copy\" ' + ds + ' data-to=\"side2\">Copy to ' + n2 + '</button>';\n    if (group !== 'both')  menuItems += '<button class=\"cs-popover-item cs-copy\" ' + ds + ' data-to=\"both\">Copy to Both</button>';\n    return '<div class=\"cs-item ' + (sel ? 'selected' : 'deselected') +\n      '\" data-slug=\"' + tradSlug + '\" data-group=\"' + group + '\" data-idx=\"' + ci.idx + '\" onclick=\"toggleCs(this)\">' +\n      '<div class=\"cs-check\"><span class=\"cs-check-tick\">&#10003;</span></div>' +\n      '<div style=\"flex:1\"><div class=\"cs-item-name\">' + name + '</div>' +\n      (timing ? '<div class=\"cs-item-timing\">' + timing + '</div>' : '') + '</div>' +\n      '<button class=\"cs-item-menu-btn\" onclick=\"toggleCsMenu(event,this)\">&#8943;</button>' +\n      '<div class=\"cs-item-popover\">' + menuItems + '</div>' +\n    '</div>';\n  }\n\n  var noItems = '<p style=\"font-size:12px;color:var(--muted);font-style:italic;padding:8px 0\">None</p>';\n\n  container.innerHTML = tradBlocks.map(function(block) {\n    var s1h = block.side1.map(function(ci){ return csItemHtml(ci,block.tradSlug,'side1'); }).join('');\n    var s2h = block.side2.map(function(ci){ return csItemHtml(ci,block.tradSlug,'side2'); }).join('');\n    var bh  = block.both.map(function(ci){ return csItemHtml(ci,block.tradSlug,'both'); }).join('');\n    return '<div class=\"cs-tradition-block\">' +\n      (trad2 ? '<div class=\"cs-tradition-label\">' + block.tradLabel + '</div>' : '') +\n      '<div class=\"cs-cols\">' +\n        '<div><div class=\"cs-col-header\">' + pos(n1) + ' ceremonies</div>' + (s1h||noItems) + '</div>' +\n        '<div><div class=\"cs-col-header\">' + pos(n2) + ' ceremonies</div>' + (s2h||noItems) + '</div>' +\n      '</div>' +\n      (bh ? '<div class=\"cs-shared-label\">For both of you</div><div class=\"cs-shared-grid\">' + bh + '</div>' : '') +\n    '</div>';\n  }).join('');\n}\n\nfunction toggleCs(el) {\n  var tradSlug = el.dataset.slug;\n  var group = el.dataset.group;\n  var idx = parseInt(el.dataset.idx);\n  if (!ceremonySelections[tradSlug] || !ceremonySelections[tradSlug][group]) return;\n  var cur = ceremonySelections[tradSlug][group][idx] !== false;\n  ceremonySelections[tradSlug][group][idx] = !cur;\n  el.classList.toggle('selected', !cur);\n  el.classList.toggle('deselected', cur);\n}\n\nfunction toggleCsMenu(e, btn) {\n  e.stopPropagation();\n  document.querySelectorAll('.cs-item-popover.open').forEach(function(p){\n    if (p !== btn.nextElementSibling) p.classList.remove('open');\n  });\n  btn.nextElementSibling.classList.toggle('open');\n}\n\nfunction moveCs(e) {\n  e.stopPropagation();\n  var btn = e.currentTarget;\n  var tradSlug = btn.dataset.slug;\n  var fromGroup = btn.dataset.from;\n  var idx = parseInt(btn.dataset.idx);\n  var toGroup = btn.dataset.to;\n  document.querySelectorAll('.cs-item-popover.open').forEach(function(p){ p.classList.remove('open'); });\n  if (!ceremonySelections[tradSlug]) return;\n  delete ceremonySelections[tradSlug][fromGroup][idx];\n  if (!ceremonySelections[tradSlug][toGroup]) ceremonySelections[tradSlug][toGroup] = {};\n  ceremonySelections[tradSlug][toGroup][idx] = true;\n  showCeremonySelection(planCeremonies);\n}\n\nfunction copyCs(e) {\n  e.stopPropagation();\n  var btn = e.currentTarget;\n  var tradSlug = btn.dataset.slug;\n  var idx = parseInt(btn.dataset.idx);\n  var toGroup = btn.dataset.to;\n  document.querySelectorAll('.cs-item-popover.open').forEach(function(p){ p.classList.remove('open'); });\n  if (!ceremonySelections[tradSlug]) return;\n  var copy = Object.assign({}, planCeremonies[idx]);\n  var newIdx = planCeremonies.length;\n  planCeremonies.push(copy);\n  if (!ceremonySelections[tradSlug][toGroup]) ceremonySelections[tradSlug][toGroup] = {};\n  ceremonySelections[tradSlug][toGroup][newIdx] = true;\n  showCeremonySelection(planCeremonies);\n}\n\nfunction getSelectedCeremonies() {\n  var selected = [];\n  var seen = new Set();\n  Object.values(ceremonySelections).forEach(function(groups) {\n    ['side1','side2','both'].forEach(function(g) {\n      Object.entries(groups[g] || {}).forEach(function(e) {\n        var idx = parseInt(e[0]);\n        if (e[1] !== false && !seen.has(idx)) {\n          seen.add(idx);\n          if (planCeremonies[idx]) selected.push({item:planCeremonies[idx],idx:idx});\n        }\n      });\n    });\n  });\n  selected.sort(function(a,b){ return a.idx-b.idx; });\n  return selected.map(function(s){ return s.item; });\n}\n\nfunction goToConfirmation() {\n  window._editingFromReview=false;\n  buildConfirmation();\n  transitionTo('q7','q8');\n  currentQ = 8;\n  updateProgress();\n}\n\nfunction goBackFromConf() {\n  window._editingFromReview=false;\n  transitionTo('q8','q7');\n  currentQ = 7;\n  updateProgress();\n}\n\nfunction buildConfirmation() {\n  var n1 = S.name1 || 'Partner one';\n  var n2 = S.name2 || 'Partner two';\n  var trad1 = S.traditions[0];\n  var trad2 = S.traditions[1] || null;\n  var allTradSlugs = trad2 ? [trad1, trad2] : [trad1];\n  var totalSelected = 0;\n  Object.values(ceremonySelections).forEach(function(groups) {\n    ['side1','side2','both'].forEach(function(g) {\n      Object.values(groups[g]||{}).forEach(function(v){ if(v!==false) totalSelected++; });\n    });\n  });\n  var dateStr = S.date ? new Date(S.date).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'Date TBC';\n  document.getElementById('q8-title').innerHTML = '<em>' + n1 + ' & ' + n2 + '</em>';\n  document.getElementById('q8-sub').textContent = totalSelected + ' ceremonies \u00b7 ' +\n    S.budget.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}) +\n    ' \u00b7 ' + S.guests + ' guests \u00b7 ' + dateStr;\n\n  var html = '';\n  allTradSlugs.forEach(function(tradSlug) {\n    var tradInfo = TRADS.find(function(t){ return t.slug===tradSlug; }) || {label:tradSlug};\n    var sel = ceremonySelections[tradSlug] || {side1:{},side2:{},both:{}};\n    function getSel(g) {\n      return Object.entries(sel[g]||{}).filter(function(e){ return e[1]!==false; })\n        .map(function(e){ var i=parseInt(e[0]); return planCeremonies[i]||(i>=10000?planCeremonies[i-10000]:null); }).filter(Boolean);\n    }\n    var s1=getSel('side1'), s2=getSel('side2'), sb=getSel('both');\n    if (!s1.length && !s2.length && !sb.length) return;\n    function ci(item){ return '<div class=\"conf-item\">'+(item.name||item.event||'')+'</div>'; }\n    var ni = '<div class=\"conf-item\" style=\"opacity:0.4\">None selected</div>';\n    html += '<div class=\"conf-block\">' +\n      (trad2 ? '<div class=\"conf-trad-header\">'+tradInfo.label+'</div>' : '') +\n      '<div class=\"conf-cols\">' +\n        '<div><div class=\"conf-col-header\">'+pos(n1)+' ceremonies</div>'+(s1.length?s1.map(ci).join(''):ni)+'</div>' +\n        '<div><div class=\"conf-col-header\">'+pos(n2)+' ceremonies</div>'+(s2.length?s2.map(ci).join(''):ni)+'</div>' +\n      '</div>' +\n      (sb.length ? '<div class=\"conf-shared-header\">For both of you</div>'+sb.map(ci).join('') : '') +\n    '</div>';\n  });\n\n  var adj = S.budget;\n  html += '<div class=\"conf-budget\"><div class=\"conf-budget-total\">' +\n    adj.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}) +\n    '</div><div class=\"conf-budget-sub\">estimated for '+totalSelected+' ceremonies</div></div>';\n  document.getElementById('conf-container').innerHTML = html;\n  if (S.plan) S.plan.adjustedBudget = adj;\n}\n\nfunction buildFinalPlan() {\n  window.budgetExclusions={};\n  window._budgetTab=null;\n  window._ceremonyView=null;\n  var selected = getSelectedCeremonies();\n  if (S.plan) {\n    S.plan.selectedCeremonies = selected;\n    S.plan.ceremonySequence = selected;\n    S.plan.adjustedBudget = Math.round(S.budget * Math.max(0.5, selected.length/(planCeremonies.length||1)));\n  }\n  transitionTo('q8','results-screen');\n  currentQ = 9;\n  updateProgress();\n  setTimeout(function(){ populateResults(); }, 300);\n}\n\ndocument.addEventListener('click', function(e) {\n  // Handle move/copy buttons via delegation\n  if (e.target.classList.contains('cs-move')) { moveCs(e); return; }\n  if (e.target.classList.contains('cs-copy')) { copyCs(e); return; }\n  // Close menus\n  document.querySelectorAll('.cs-item-popover.open').forEach(function(p){ p.classList.remove('open'); });\n  if (!e.target.closest('.role-dropdown')) {\n    document.querySelectorAll('.role-dd-menu.open').forEach(function(m){ m.classList.remove('open'); });\n  }\n});\n\ndocument.addEventListener('keydown', function(e) {\n  if (e.key === 'Enter' && typeof currentQ !== 'undefined' && currentQ <= 6) {\n    var btn = document.querySelector('.screen.active .cta');\n    if (btn) btn.click();\n  }\n});\n\nfunction showParagraphEntry() {\n  transitionTo('q0','q0b'); currentQ='0b'; updateProgress();\n}\nfunction startQuestionnaire() {\n  transitionTo('q0','q1'); currentQ=1; updateProgress();\n}\nasync function parseParagraph() {\n  var text = document.getElementById('wedding-paragraph').value.trim();\n  if (text.length < 5) { document.getElementById('err-q0b').classList.add('show'); return; }\n  document.getElementById('err-q0b').classList.remove('show');\n  var btn = document.getElementById('q0b-btn');\n  if (btn) { btn.disabled=true; btn.textContent='Reading your wedding...'; }\n  try {\n    var res = await fetch('/api/parse-wedding', {\n      method:'POST', headers:{'Content-Type':'application/json'},\n      body: JSON.stringify({text:text})\n    });\n    var data = await res.json();\n    var parsed = data.parsed || data;\n    var p = parsed;\n    var pname1 = p.name1||p.partner1_name||'';\n    var pname2 = p.name2||p.partner2_name||'';\n    var prole1 = p.role1||p.partner1_role||'';\n    var prole2 = p.role2||p.partner2_role||'';\n    if (pname1) { S.name1=pname1; var el=document.getElementById('name1'); if(el) el.value=pname1; }\n    if (pname2) { S.name2=pname2; var el=document.getElementById('name2'); if(el) el.value=pname2; }\n    if (pname1 || pname2) updateRoleLabels();\n    if (prole1) { S.role1=prole1; pickRole(1,prole1); }\n    if (prole2) { S.role2=prole2; pickRole(2,prole2); }\n    if (parsed.traditions && parsed.traditions.length) {\n      S.traditions=parsed.traditions.slice(0,2);\n      document.querySelectorAll('.trad-chip').forEach(function(c){ c.classList.toggle('on', S.traditions.includes(c.dataset.slug)); });\n    }\n    if (parsed.date) { S.date=parsed.date; S.dateSure=true; var el=document.getElementById('wedding-date'); if(el){el.value=parsed.date; updateQ2Continue();} }\n    if (parsed.location) { S.location=parsed.location; var el=document.getElementById('location'); if(el){el.value=parsed.location; onLocationChange();} }\n    if (parsed.budget) { S.budget=parsed.budget; var sl=document.getElementById('budget-slider'); if(sl){sl.value=parsed.budget; onBudgetChange();} }\n    if (parsed.guests) { guests=parsed.guests; S.guests=parsed.guests; var el=document.getElementById('guest-count'); if(el) el.textContent=parsed.guests; }\n    personalise();\n    if (!pname1||!pname2||!prole1||!prole2) { transitionTo('q0b','q1'); currentQ=1; setTimeout(function(){ updateRoleLabels(); updateQ1Continue(); }, 270); }\n    else if (!p.date) { transitionTo('q0b','q2'); currentQ=2; }\n    else if (!p.location) { transitionTo('q0b','q3'); currentQ=3; }\n    else if (!p.traditions||!p.traditions.length) { transitionTo('q0b','q4'); currentQ=4; }\n    else if (!p.budget) { transitionTo('q0b','q5'); currentQ=5; }\n    else if (!p.guests) { transitionTo('q0b','q6'); currentQ=6; }\n    else { submitPlan(); currentQ=6; }\n    updateProgress();\n  } catch(err) {\n    console.error('Parse error:',err);\n    transitionTo('q0b','q1'); currentQ=1; updateProgress();\n  } finally {\n    if (btn) { btn.disabled=false; btn.textContent='Build my plan \u2192'; }\n  }\n}\n\n// \u2500\u2500 Flower dialog \u2500\u2500\nfunction showFlowerDialog(title, body, onConfirm) {\n  var ov = document.createElement('div');\n  ov.className = 'flower-dialog-overlay';\n  var d = document.createElement('div');\n  d.className = 'flower-dialog';\n  d.innerHTML = FLOWER_SVG_20 + '<div class=\"flower-dialog-title\">'+title+'</div><div class=\"flower-dialog-body\">'+body+'</div>';\n  var btns = document.createElement('div');\n  btns.className = 'flower-dialog-btns';\n  if (onConfirm) {\n    var cancel = document.createElement('button');\n    cancel.className = 'btn-back'; cancel.textContent = 'Cancel';\n    cancel.onclick = function(){ document.body.removeChild(ov); };\n    btns.appendChild(cancel);\n  }\n  var ok = document.createElement('button');\n  ok.className = 'cta'; ok.textContent = onConfirm ? 'Yes, continue' : 'OK';\n  ok.onclick = function(){ document.body.removeChild(ov); if(onConfirm) onConfirm(); };\n  btns.appendChild(ok);\n  d.appendChild(btns); ov.appendChild(d); document.body.appendChild(ov);\n}\n// \u2500\u2500 Review screen \u2500\u2500\nfunction showReviewScreen() {\n  transitionTo('q'+currentQ, 'q6b');\n  currentQ='6b'; updateProgress();\n  setTimeout(buildReviewSummary, 270);\n}\nfunction buildReviewSummary() {\n  var n1=S.name1||'Partner one', n2=S.name2||'Partner two';\n  var rL=function(r){return r==='bride'?'Bride':r==='groom'?'Groom':'Partner';};\n  var dateStr=S.dateSure&&S.date?new Date(S.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):'Not decided yet';\n  var locStr=S.location||'Not decided yet';\n  var tradStr=(S.traditions||[]).map(function(slug){var t=TRADS.find(function(x){return x.slug===slug;});return t?t.label:slug;}).join(' + ')||'None selected';\n  var budgetStr=S.budget?S.budget.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}):'Not decided yet';\n  var guestStr=(S.guests||guests)+' guests';\n  function mkRow(label, value, qnum) {\n    var d=document.createElement('div');\n    d.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--warm);cursor:pointer';\n    d.onclick=function(){jumpToReview(qnum);};\n    d.innerHTML='<div><div style=\"font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-style:italic;margin-bottom:3px\">'+label+'</div><div style=\"font-size:14px;font-style:italic;color:var(--deep)\">'+value+'</div></div><span style=\"color:var(--muted);font-size:14px\">edit &rsaquo;</span>';\n    return d;\n  }\n  var el=document.getElementById('review-summary');\n  if(!el) return; el.innerHTML='';\n  el.appendChild(mkRow('Names',n1+' ('+rL(S.role1)+') & '+n2+' ('+rL(S.role2)+')',1));\n  el.appendChild(mkRow('Date',dateStr,2));\n  el.appendChild(mkRow('Location',locStr,3));\n  el.appendChild(mkRow('Traditions',tradStr,4));\n  el.appendChild(mkRow('Budget',budgetStr,5));\n  el.appendChild(mkRow('Guests',guestStr,6));\n}\nfunction jumpToReview(qnum) {\n  window._editingFromReview=true;\n  transitionTo('q6b','q'+qnum); currentQ=qnum; updateProgress();\n}\n// \u2500\u2500 Ceremony gantt + list \u2500\u2500\nfunction renderCeremonies(items) {\n  var el=document.getElementById('tab-ceremonies'); if(!el) return;\n  if(!items||!items.length){el.innerHTML='<p style=\"color:var(--muted);font-style:italic;padding:20px 0\">No ceremony sequence found.</p>';return;}\n  var n1=S.name1||'Partner one',n2=S.name2||'Partner two',n1Role=S.role1||'bride',n2Role=S.role2||'groom';\n  var sameRole=(n1Role===n2Role);\n  var BUCKETS=['12+ mo','6-12 mo','3-6 mo','1-3 mo','Weeks before','Day before','Wedding day','After'];\n  function getBucket(timing){if(!timing)return 4;var t=timing.toLowerCase();if(t.includes('12')||t.includes('year'))return 0;if(t.includes('6')||t.includes('8')||t.includes('9')||t.includes('10'))return 1;if(t.includes('3')||t.includes('4')||t.includes('5'))return 2;if(t.includes('1')||t.includes('2')||t.includes('month'))return 3;if(t.includes('week'))return 4;if(t.includes('day before')||t.includes('eve'))return 5;if(t.includes('day of')||t.includes('morning'))return 6;if(t.includes('after')||t.includes('post'))return 7;return 4;}\n  var COLORS={side1:'#C8941A',side2:'#3949AB',both:'#4A7C59'};\n  var side1=[],side2=[],both=[],seenS1={},seenS2={},seenBoth={};\n  items.forEach(function(item){var side=item.side||'both',nm=item.name||item.event||'';if(side==='bride+groom'||(sameRole&&side===n1Role)){if(!seenS1[nm]){seenS1[nm]=true;side1.push(item);}if(!seenS2[nm]){seenS2[nm]=true;side2.push(item);}}else if(side===n1Role){if(!seenS1[nm]){seenS1[nm]=true;side1.push(item);}}else if(side===n2Role){if(!seenS2[nm]){seenS2[nm]=true;side2.push(item);}}else{if(!seenBoth[nm]){seenBoth[nm]=true;both.push(item);}}});\n  var colW=(100/BUCKETS.length).toFixed(2);\n  function ganttRow(item,color){var b=getBucket(item.timing),name=item.name||item.event||'',timing=item.timing||'';return '<div style=\"display:flex;align-items:center;margin-bottom:5px;gap:6px;background:#FDFAF0\"><div style=\"width:160px;flex-shrink:0;font-size:11px;font-style:italic;color:var(--tx);text-align:right;padding-right:8px;line-height:1.3;position:sticky;left:0;background:#FDFAF0;z-index:2\">'+name+'</div><div style=\"flex:1;height:28px;position:relative;background:#FDFAF0\"><div class=\"gantt-bar\" style=\"position:absolute;left:'+(b*(100/BUCKETS.length)).toFixed(1)+'%;width:'+colW+'%;height:100%;background:'+color+';border-radius:4px;box-sizing:border-box;cursor:default\"><div class=\"gantt-tip\">'+name+(timing?' -- '+timing:'')+'</div></div></div></div>';}\n  function ganttSec(title,arr,color){if(!arr.length)return '';return '<div style=\"font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:16px 0 8px;font-style:italic;background:#FDFAF0\">'+title+'</div>'+arr.map(function(i){return ganttRow(i,color);}).join('');}\n  var header='<div id=\"gantt-sticky-header\" style=\"display:flex;align-items:center;margin-bottom:8px;position:sticky;top:0px;background:#FDFAF0;padding:4px 0 6px;z-index:5\"><div style=\"width:160px;flex-shrink:0;position:sticky;left:0;background:#FDFAF0;z-index:6\"></div><div style=\"flex:1;display:flex\">'+BUCKETS.map(function(b){return '<div style=\"flex:1;font-size:9px;color:var(--muted);font-style:italic;text-align:center;border-left:1px solid var(--bdr);padding:2px 0\">'+b+'</div>';}).join('')+'</div></div>';\n  var ganttHtml='<div style=\"overflow-x:clip;min-height:200px\"><div style=\"min-width:640px\">'+header+ganttSec(n1+\"'s ceremonies\",side1,COLORS.side1)+ganttSec(n2+\"'s ceremonies\",side2,COLORS.side2)+ganttSec('Common ceremonies',both,COLORS.both)+'</div></div>';\n  window.toggleListCard=function(id){var b=document.getElementById(id);if(!b)return;var open=b.style.display==='block';b.style.display=open?'none':'block';var tog=document.querySelector('[data-ltog=\"'+id+'\"]');if(tog)tog.style.transform=open?'':'rotate(90deg)';};\n  function listSec(title,arr){if(!arr.length)return '';var sid='ls'+Math.random().toString(36).slice(2,7);return '<div style=\"border-bottom:1px solid var(--bdr);margin-bottom:4px\"><div onclick=\"var b=document.getElementById(\\''+sid+'\\');var open=b.style.display===\\'block\\';b.style.display=open?\\'none\\':\\'block\\';\" style=\"font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:8px 0;font-style:italic;display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 0\">'+title+'<div style=\"flex:1;height:1px;background:var(--bdr)\"></div><span style=\"font-size:12px\">&#8250;</span></div><div id=\"'+sid+'\" style=\"display:none\">'+arr.map(function(item){var name=item.name||item.event||'',timing=item.timing||'',notes=item.notes||'',duration=item.duration||'',lid='lc'+Math.random().toString(36).slice(2,7);return '<div style=\"border-bottom:1px solid var(--warm)\"><div data-lid=\"'+lid+'\" onclick=\"window.toggleListCard(this.dataset.lid)\" style=\"display:flex;justify-content:space-between;align-items:center;padding:12px 0;cursor:pointer\"><div style=\"display:flex;align-items:center;gap:8px\"><span data-ltog=\"'+lid+'\" style=\"color:var(--muted);font-size:12px;display:inline-block;transition:transform 0.2s\">&#8250;</span><span style=\"font-size:14px;font-style:italic;color:var(--deep)\">'+name+'</span></div><span style=\"font-size:11px;color:var(--muted);font-style:italic;flex-shrink:0;margin-left:12px\">'+timing+'</span></div><div id=\"'+lid+'\" style=\"display:none;padding:0 0 12px 22px\">'+(duration?'<div style=\"font-size:11px;color:var(--muted);font-style:italic;margin-bottom:6px\">'+duration+'</div>':'')+(notes?'<div style=\"font-size:12px;color:var(--tx);line-height:1.6\">'+notes+'</div>':'<div style=\"font-size:12px;color:var(--muted);font-style:italic\">No additional details</div>')+'</div></div>';}).join('')+'</div></div>';}\n  var listHtml=listSec(n1+\"'s ceremonies\",side1)+listSec(n2+\"'s ceremonies\",side2)+listSec('Common ceremonies',both);\n  var av=window._ceremonyView||'gantt';\n  var subTabs='<div style=\"display:flex;border-bottom:1px solid var(--bdr);margin-bottom:16px;position:sticky;top:0;background:#FDFAF0;z-index:100\"><button data-view=\"gantt\" onclick=\"window._ceremonyView=this.dataset.view;renderCeremonies(S.plan.selectedCeremonies||S.plan.ceremonySequence||[])\" style=\"padding:6px 16px;border:none;background:none;font-size:11px;letter-spacing:1px;font-style:italic;cursor:pointer;border-bottom:2px solid '+(av==='gantt'?'var(--deep)':'transparent')+';color:'+(av==='gantt'?'var(--deep)':'var(--muted)')+'\">Timeline</button><button data-view=\"list\" onclick=\"window._ceremonyView=this.dataset.view;renderCeremonies(S.plan.selectedCeremonies||S.plan.ceremonySequence||[])\" style=\"padding:6px 16px;border:none;background:none;font-size:11px;letter-spacing:1px;font-style:italic;cursor:pointer;border-bottom:2px solid '+(av==='list'?'var(--deep)':'transparent')+';color:'+(av==='list'?'var(--deep)':'var(--muted)')+'\">List</button></div>';\n  var _nav=document.getElementById('tab-ceremonies-nav');if(_nav){_nav.innerHTML=subTabs;_nav.style.display='block';}el.innerHTML=(av==='gantt'?ganttHtml:listHtml);if(av==='gantt'){requestAnimationFrame(function(){var navEl=document.getElementById('tab-ceremonies-nav');var hdr=document.getElementById('gantt-sticky-header');if(navEl&&hdr){hdr.style.top=navEl.offsetHeight+'px';}});}\n}\n// \u2500\u2500 Extracted fields tracker \u2500\u2500\nvar _extracted={};\nbuildGrid();\n(function(){ var fl=document.getElementById('q0-flower'); if(fl&&window.FLOWER_SVG_20) fl.innerHTML=FLOWER_SVG_20; })();\nupdateProgress();\n</script>\n</body>\n</html>"
app.get('/questionnaire', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(QUESTIONNAIRE_HTML);
});

app.get('/advisor', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(ADVISOR_HTML);
});

// ── Routes: health ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabase_url: process.env.SUPABASE_URL ? 'set' : 'missing',
    supabase_key: process.env.SUPABASE_SERVICE_KEY ? 'set' : 'missing',
  });
});

// Debug: check side field values for a tradition
app.get('/api/debug/side/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('live_taxonomy')
      .select('slug, ceremony_sequence')
      .eq('slug', req.params.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.json({ error: 'not found' });
    const sides = (data.ceremony_sequence || []).map(c => ({
      name: c.name,
      side: c.side || 'MISSING'
    }));
    res.json({ slug: data.slug, ceremonies: sides });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Routes: traditions list ──
app.get('/api/traditions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('live_taxonomy')
      .select('slug, name, region, priority')
      .order('name');
    if (error) throw error;
    res.json({ success: true, traditions: data });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Routes: generate plan ──
app.post('/api/parse-wedding', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: 'Extract wedding details from this text and return ONLY valid JSON (no markdown, no backticks) with these fields (null if not mentioned): {"name1":"string","name2":"string","role1":"bride|groom|partner|null","role2":"bride|groom|partner|null","traditions":["slug1"],"date":"YYYY-MM-DD|null","location":"string|null","budget":number|null,"guests":number|null}. Valid tradition slugs: sri-lankan-buddhist,thai-buddhist,chinese-taiwanese,catholic,filipino-catholic,greek-orthodox,latin-american-catholic,mexican-catholic,christian-western,cuban,andhra-telugu,arya-samaj,assamese-hindu,bengali-hindu,bihari-hindu,gujarati,kashmiri-pandit,kerala-nair,manipuri-vaishnavite,marathi,hindu-north-indian-punjabi,odia-hindu,rajasthani-marwari,rajasthani-rajput,tamil-hindu,vedic-general,jain-shwetambar,jewish-reform-conservative,khasi,korean,dawoodi-bohra,muslim-nikah,hausa-muslim,yoruba-nigerian,sikh. Text: ' + text
        }]
      })
    });
    const data = await response.json();
    console.log('Anthropic parse response:', JSON.stringify(data).slice(0,300));
    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: 'Anthropic error: ' + JSON.stringify(data) });
    }
    const raw = data.content[0].text;
    const clean = raw.replace(/```json|```/g,'').trim();
    res.json({ success: true, parsed: JSON.parse(clean) });
  } catch(e) {
    console.error('parse-wedding error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/generate-plan', async (req, res) => {
  const slugs = req.body.slugs || req.body.traditionSlugs;
  const budget = req.body.budget || req.body.totalBudget;
  const jurisdiction = req.body.jurisdiction;

  if (!slugs || !Array.isArray(slugs) || slugs.length === 0)
    return res.status(400).json({ error: 'slugs array required' });
  if (slugs.length > 2)
    return res.status(400).json({ error: 'maximum 2 traditions supported' });

  try {
    const result = await generatePlan({
      traditionSlugs: slugs,
      totalBudget: parseInt(budget) || 50000,
      jurisdiction: jurisdiction || 'US',
    });

    if (!result.success) {
      return res.status(404).json({ error: 'Some traditions not yet available', details: result });
    }

    // Normalise field names for the questionnaire UI
    res.json({
      success: true,
      plan: {
        traditions: result.traditions,
        checklist: result.checklist || [],
        ceremonySequence: result.ceremony_sequence || [],
        vendorCategories: result.vendors || [],
        budget: result.budget || [],
        conflicts: result.conflicts || [],
        culturalNotes: result.cultural_notes || '',
        jurisdiction: jurisdiction || 'US',
        generatedAt: new Date().toISOString(),
      }
    });
  } catch(e) {
    console.error('generate-plan error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ── Advisor API ──
app.get('/api/advisor/traditions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cultural_traditions')
      .select('id,slug,name,region,priority,tradition_versions(id,version_number,status,is_current,proposed_at,reviewed_at)')
      .order('name');
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/advisor/traditions/:id/versions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tradition_versions').select('*')
      .eq('tradition_id', req.params.id)
      .order('version_number', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/advisor/versions/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tradition_versions').select('*')
      .eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
})

// Update (save edits to) a specific version
app.patch('/api/advisor/versions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Only allow updating these fields
    const allowed = [
      'avg_budget_low','avg_budget_high','budget_currency',
      'typical_event_count','cultural_notes','lgbtq_notes',
      'sources','review_notes','checklist_template',
      'ceremony_sequence','vendor_categories','budget_allocation'
    ];
    const filtered = {};
    allowed.forEach(function(k) { if (updates[k] !== undefined) filtered[k] = updates[k]; });
    const { data, error } = await supabase
      .from('tradition_versions')
      .update(filtered)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});;

app.post('/api/advisor/traditions/:id/draft', async (req, res) => {
  try {
    const base = req.body.base || {};
    const { data: versions, error: vErr } = await supabase
      .from('tradition_versions').select('version_number')
      .eq('tradition_id', req.params.id)
      .order('version_number', { ascending: false }).limit(1);
    if (vErr) throw vErr;
    const nextVersion = ((versions[0]?.version_number) || 0) + 1;
    const { data, error } = await supabase.from('tradition_versions').insert({
      tradition_id: req.params.id, version_number: nextVersion, status: 'draft', is_current: false,
      avg_budget_low: base.avg_budget_low, avg_budget_high: base.avg_budget_high,
      budget_currency: base.budget_currency || 'USD', typical_event_count: base.typical_event_count,
      ceremony_sequence: base.ceremony_sequence || [], vendor_categories: base.vendor_categories || [],
      budget_allocation: base.budget_allocation || [], checklist_template: base.checklist_template || [],
      cultural_notes: base.cultural_notes || '', sources: base.sources || '',
    }).select().single();
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/advisor/versions/:id/submit', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tradition_versions')
      .update({ ...req.body, status: 'in_review', proposed_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/advisor/versions/:id/approve', async (req, res) => {
  try {
    const { data: version, error: vErr } = await supabase
      .from('tradition_versions').select('tradition_id').eq('id', req.params.id).single();
    if (vErr) throw vErr;
    await supabase.from('tradition_versions').update({ is_current: false }).eq('tradition_id', version.tradition_id);
    const { data, error } = await supabase.from('tradition_versions')
      .update({ status: 'approved', is_current: true, reviewed_at: new Date().toISOString(), review_notes: req.body.review_notes || '' })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/advisor/versions/:id/reject', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tradition_versions')
      .update({ status: 'draft', review_notes: req.body.review_notes || '' })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/advisor/versions/:id/cancel', async (req, res) => {
  try {
    const { error } = await supabase.from('tradition_versions')
      .delete().eq('id', req.params.id).eq('status', 'draft');
    if (error) throw error;
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/advisor/traditions/:id/audit', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tradition_version_audit')
      .select('*').eq('tradition_id', req.params.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Marigold engine test running on port ${PORT}`));
module.exports = app;
