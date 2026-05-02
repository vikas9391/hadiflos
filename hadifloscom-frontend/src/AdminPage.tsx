import { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";

interface Claim {
  id: number;
  reference_number: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  debtor_name: string;
  debtor_location: string;
  amount_owed: number;
  debt_type: keyof typeof DEBT_TYPE_LABELS;
  description: string;
  status: keyof typeof STATUS_LABELS;
  preferred_language: string;
  created_at: string;
}

const API = "https://hadiflos.onrender.com/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #B8860B;
    --gold-mid: #C9962A;
    --gold-light: #E8B84B;
    --gold-pale: #FDF5E0;
    --gold-faint: #FFFBF0;
    --dark: #0D0D0D;
    --dark-2: #161410;
    --dark-3: #1E1A14;
    --text: #1C1C1C;
    --text-mid: #4A4540;
    --text-light: #7A736A;
    --white: #FFFFFF;
    --off-white: #FAFAF7;
    --border: #E6DDD0;
    --border-gold: rgba(184,134,11,0.25);
    --radius: 12px;
    --radius-lg: 20px;
    --sidebar-w: 256px;
    --red: #DC2626;
    --green: #16A34A;
    --blue: #2563EB;
    --amber: #D97706;
    --purple: #7C3AED;
    --orange: #EA580C;
  }

  html, body { height: 100%; font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--off-white); }

  .login-wrap {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(145deg, #0A0804, #1A1208, #0A0804);
    padding: 2rem; position: relative; overflow: hidden;
  }
  .login-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(184,134,11,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 20%, rgba(184,134,11,0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  .login-card {
    background: rgba(255,255,255,0.97);
    border-radius: var(--radius-lg);
    padding: 3rem 2.75rem;
    width: 100%; max-width: 420px;
    border: 1px solid rgba(184,134,11,0.15);
    box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(184,134,11,0.08);
    position: relative; z-index: 1;
  }
  .login-logo {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.625rem; margin-bottom: 2.5rem;
  }
  .login-logo-mark {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(145deg, var(--gold), var(--gold-light));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 6px rgba(184,134,11,0.12), 0 8px 24px rgba(184,134,11,0.3);
    margin-bottom: 0.25rem;
  }
  .login-logo-mark img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; }
  .login-logo h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 700; color: var(--dark); line-height: 1.1;
  }
  .login-logo span {
    font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold);
    text-transform: uppercase; font-weight: 600;
  }
  .login-divider { height: 1px; background: var(--border); margin-bottom: 2rem; }
  .login-title { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.25rem; }
  .login-sub { font-size: 0.82rem; color: var(--text-light); margin-bottom: 1.75rem; }

  .btn-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: none; border: none; cursor: pointer; font-family: inherit;
    font-size: 0.78rem; font-weight: 500; color: var(--text-light);
    padding: 0; margin-bottom: 1.5rem; transition: color 0.2s;
    text-decoration: none;
  }
  .btn-back:hover { color: var(--gold); }
  .btn-back svg { width: 14px; height: 14px; transition: transform 0.2s; }
  .btn-back:hover svg { transform: translateX(-2px); }

  .fgroup { margin-bottom: 1.125rem; }
  .flabel { display: block; font-size: 0.72rem; font-weight: 600; color: var(--text-mid); margin-bottom: 0.375rem; letter-spacing: 0.03em; text-transform: uppercase; }
  .fcontrol {
    width: 100%; padding: 0.7rem 0.9rem;
    border: 1.5px solid var(--border); border-radius: 8px;
    font-family: inherit; font-size: 0.875rem; color: var(--text);
    background: var(--off-white); outline: none; transition: all 0.2s;
  }
  .fcontrol:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(184,134,11,0.1); background: white; }

  .pw-wrap { position: relative; }
  .pw-wrap .fcontrol { padding-right: 2.75rem; }
  .pw-toggle {
    position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: var(--text-light); display: flex; align-items: center; justify-content: center;
    transition: color 0.2s;
  }
  .pw-toggle:hover { color: var(--gold); }
  .pw-toggle svg { width: 16px; height: 16px; }

  .btn-primary-full {
    width: 100%; background: linear-gradient(135deg, var(--gold), var(--gold-mid));
    color: white; border: none; cursor: pointer;
    padding: 0.85rem; border-radius: 8px;
    font-size: 0.9rem; font-weight: 600; letter-spacing: 0.02em;
    font-family: inherit; margin-top: 0.5rem; transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(184,134,11,0.35);
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn-primary-full:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(184,134,11,0.45); }
  .btn-primary-full:disabled { opacity: 0.5; cursor: not-allowed; }

  .login-error {
    background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px;
    padding: 0.75rem 1rem; color: var(--red); font-size: 0.82rem;
    margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.5;
  }
  .login-error svg { flex-shrink: 0; margin-top: 1px; }

  .admin-wrap { display: flex; min-height: 100vh; }

  .sidebar {
    width: var(--sidebar-w); background: var(--dark-2); flex-shrink: 0;
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
    border-right: 1px solid rgba(184,134,11,0.1);
  }
  .sidebar-brand {
    padding: 1.625rem 1.5rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 0.875rem;
  }
  .sidebar-logo-ring {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1.5px solid rgba(184,134,11,0.4);
    overflow: hidden; flex-shrink: 0;
    box-shadow: 0 0 12px rgba(184,134,11,0.15);
  }
  .sidebar-logo-ring img { width: 100%; height: 100%; object-fit: cover; }
  .sidebar-brand-text strong {
    color: white; font-size: 0.975rem; display: block;
    font-family: 'Cormorant Garamond', serif; font-weight: 700; line-height: 1.1;
  }
  .sidebar-brand-text span { color: var(--gold); font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }

  .sidebar-nav { flex: 1; padding: 1.25rem 0; overflow-y: auto; }
  .nav-section-label {
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.2);
    padding: 0.875rem 1.5rem 0.4rem;
  }
  .sidebar-link {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.7rem 1.5rem; cursor: pointer;
    color: rgba(255,255,255,0.42); font-size: 0.84rem; font-weight: 500;
    transition: all 0.15s; border: none; background: none;
    width: 100%; text-align: left; font-family: inherit;
    border-left: 2px solid transparent; letter-spacing: 0.01em;
  }
  .sidebar-link svg { width: 15px; height: 15px; flex-shrink: 0; }
  .sidebar-link:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.03); }
  .sidebar-link.active { color: var(--gold-light); background: rgba(184,134,11,0.08); border-left-color: var(--gold); }

  .sidebar-footer { padding: 1.25rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
  .sidebar-user {
    display: flex; align-items: center; gap: 0.625rem;
    padding: 0.625rem 0; margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.75rem;
  }
  .sidebar-user-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
  }
  .sidebar-user-name { font-size: 0.8rem; color: rgba(255,255,255,0.6); font-weight: 500; }
  .sidebar-user-role { font-size: 0.62rem; color: var(--gold); text-transform: uppercase; letter-spacing: 0.1em; }
  .btn-logout {
    width: 100%; display: flex; align-items: center; gap: 0.625rem;
    padding: 0.65rem 0.875rem; border-radius: 8px;
    background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.18);
    color: rgba(252,165,165,0.75); font-size: 0.82rem; font-weight: 500;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-logout:hover { background: rgba(220,38,38,0.15); color: #FCA5A5; }
  .btn-logout svg { width: 14px; height: 14px; }

  .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .topbar {
    background: rgba(255,255,255,0.97); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 2.25rem; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 16px rgba(0,0,0,0.04);
  }
  .topbar-eyebrow { font-size: 0.6rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.18em; }
  .topbar-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; color: var(--dark); }
  .topbar-right { display: flex; align-items: center; gap: 1rem; }
  .topbar-admin {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--gold-pale); border: 1px solid var(--border-gold);
    padding: 0.35rem 0.875rem; border-radius: 50px;
    font-size: 0.75rem; font-weight: 600; color: var(--gold-mid);
  }
  .admin-dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
  .page-content { padding: 2.25rem; flex: 1; }

  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
  .stat-card {
    background: white; border-radius: var(--radius-lg);
    padding: 1.625rem; border: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .stat-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.07); }
  .stat-card.gold::after { background: linear-gradient(to right, var(--gold), var(--gold-light)); }
  .stat-card.green::after { background: linear-gradient(to right, #16A34A, #4ADE80); }
  .stat-card.blue::after { background: linear-gradient(to right, #2563EB, #60A5FA); }
  .stat-card.amber::after { background: linear-gradient(to right, #D97706, #FCD34D); }
  .stat-card:hover::after { transform: scaleX(1); }
  .stat-card-label { font-size: 0.67rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.625rem; }
  .stat-card-value { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--dark); line-height: 1; }
  .stat-card-sub { font-size: 0.74rem; color: var(--text-light); margin-top: 0.35rem; }
  .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .stat-icon svg { width: 20px; height: 20px; }
  .si-gold { background: var(--gold-pale); color: var(--gold); }
  .si-green { background: #F0FDF4; color: var(--green); }
  .si-blue { background: #EFF6FF; color: var(--blue); }
  .si-amber { background: #FFFBEB; color: var(--amber); }

  .card { background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 1px 8px rgba(0,0,0,0.03); }
  .card-header {
    padding: 1.375rem 1.75rem; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem; background: var(--off-white);
  }
  .card-eyebrow { font-size: 0.6rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 0.2rem; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 700; color: var(--dark); }
  .card-actions { display: flex; gap: 0.625rem; align-items: center; flex-wrap: wrap; }

  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 0.7rem; top: 50%; transform: translateY(-50%); color: var(--text-light); }
  .search-icon svg { width: 13px; height: 13px; }
  .search-input {
    padding: 0.5rem 0.875rem 0.5rem 2.25rem;
    border: 1.5px solid var(--border); border-radius: 8px;
    font-family: inherit; font-size: 0.82rem; color: var(--text);
    background: white; outline: none; transition: all 0.2s; width: 230px;
  }
  .search-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(184,134,11,0.1); }
  .filter-select {
    padding: 0.5rem 0.875rem; border: 1.5px solid var(--border); border-radius: 8px;
    font-family: inherit; font-size: 0.82rem; color: var(--text);
    background: white; outline: none; cursor: pointer; transition: all 0.2s;
  }
  .filter-select:focus { border-color: var(--gold); }
  .btn-action {
    padding: 0.5rem 1rem; border-radius: 8px;
    border: 1.5px solid var(--border); background: white;
    font-family: inherit; font-size: 0.8rem; font-weight: 500;
    color: var(--text-mid); cursor: pointer;
    display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s;
  }
  .btn-action:hover { border-color: var(--gold); color: var(--gold); }
  .btn-action svg { width: 13px; height: 13px; }
  .btn-cta {
    padding: 0.5rem 1.125rem; border-radius: 8px;
    background: var(--gold); color: white; border: none;
    font-family: inherit; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s;
  }
  .btn-cta:hover { background: var(--gold-mid); transform: translateY(-1px); }
  .btn-cta svg { width: 13px; height: 13px; }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 0.75rem 1.25rem; text-align: left;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-light);
    background: var(--off-white); border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--gold-faint); }
  td { padding: 1rem 1.25rem; font-size: 0.84rem; color: var(--text); vertical-align: middle; }
  .td-ref { font-weight: 700; color: var(--gold); font-size: 0.78rem; letter-spacing: 0.04em; font-family: 'DM Sans', monospace; }
  .td-name { font-weight: 600; color: var(--dark); }
  .td-sub { color: var(--text-light); font-size: 0.78rem; margin-top: 0.15rem; }
  .td-amount { font-weight: 700; color: var(--dark); font-family: 'Cormorant Garamond', serif; font-size: 1rem; }
  .td-muted { color: var(--text-light); font-size: 0.8rem; }

  .badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.3rem 0.75rem; border-radius: 50px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; white-space: nowrap;
    border: 1px solid;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-new         { background: #FEF2F2; color: #991B1B; border-color: rgba(220,38,38,0.2); }
  .badge-new .badge-dot { background: var(--red); }
  .badge-review      { background: #FFFBEB; color: #92400E; border-color: rgba(217,119,6,0.25); }
  .badge-review .badge-dot { background: var(--amber); }
  .badge-in_progress { background: #EFF6FF; color: #1E40AF; border-color: rgba(37,99,235,0.2); }
  .badge-in_progress .badge-dot { background: var(--blue); }
  .badge-negotiation { background: #F5F3FF; color: #5B21B6; border-color: rgba(124,58,237,0.2); }
  .badge-negotiation .badge-dot { background: var(--purple); }
  .badge-legal       { background: #FFF7ED; color: #9A3412; border-color: rgba(234,88,12,0.2); }
  .badge-legal .badge-dot { background: var(--orange); }
  .badge-settled     { background: #F0FDF4; color: #14532D; border-color: rgba(22,163,74,0.2); }
  .badge-settled .badge-dot { background: var(--green); }
  .badge-closed      { background: var(--off-white); color: var(--text-mid); border-color: var(--border); }
  .badge-closed .badge-dot { background: var(--text-light); }

  .tag {
    display: inline-block; background: var(--gold-pale); color: var(--gold-mid);
    border: 1px solid var(--border-gold); padding: 0.2rem 0.625rem;
    border-radius: 4px; font-size: 0.7rem; font-weight: 600;
  }

  .btn-view {
    padding: 0.4rem 0.875rem; border-radius: 8px;
    border: 1.5px solid var(--border-gold); background: var(--gold-pale);
    font-family: inherit; font-size: 0.78rem; font-weight: 600;
    color: var(--gold); cursor: pointer;
    display: inline-flex; align-items: center; gap: 0.35rem;
    transition: all 0.2s; white-space: nowrap;
  }
  .btn-view:hover { background: var(--gold); color: white; border-color: var(--gold); }
  .btn-view svg { width: 13px; height: 13px; }

  .pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.75rem; border-top: 1px solid var(--border);
    font-size: 0.78rem; color: var(--text-light); background: var(--off-white);
  }
  .page-btns { display: flex; gap: 0.3rem; }
  .page-btn {
    width: 30px; height: 30px; border-radius: 6px; border: 1.5px solid var(--border);
    background: white; cursor: pointer; font-size: 0.75rem; font-weight: 600;
    color: var(--text-mid); display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; font-family: inherit;
  }
  .page-btn.active { background: var(--gold); color: white; border-color: var(--gold); }
  .page-btn:hover:not(.active):not(:disabled) { border-color: var(--gold); color: var(--gold); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .overlay {
    position: fixed; inset: 0; background: rgba(10,8,4,0.65);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; backdrop-filter: blur(4px);
  }
  .modal {
    background: white; border-radius: var(--radius-lg); width: 100%; max-width: 640px;
    max-height: 92vh; overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(184,134,11,0.1);
  }
  .modal-header {
    padding: 1.625rem 1.875rem; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between;
    position: sticky; top: 0; background: white; z-index: 1;
  }
  .modal-eyebrow { font-size: 0.6rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 0.2rem; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--dark); line-height: 1.1; }
  .modal-ref { font-size: 0.72rem; color: var(--text-light); font-weight: 500; margin-top: 0.25rem; letter-spacing: 0.04em; }
  .btn-close {
    width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border);
    background: var(--off-white); cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--text-light); transition: all 0.2s; flex-shrink: 0;
  }
  .btn-close:hover { background: var(--gold-pale); border-color: var(--border-gold); color: var(--gold); }
  .btn-close svg { width: 14px; height: 14px; }

  .modal-body { padding: 1.875rem; }
  .modal-section-label {
    font-size: 0.62rem; font-weight: 700; color: var(--gold); letter-spacing: 0.18em;
    text-transform: uppercase; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .modal-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.125rem; margin-bottom: 1.375rem; }
  .detail-lbl { font-size: 0.65rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.3rem; }
  .detail-val { font-size: 0.875rem; color: var(--text); font-weight: 500; }
  .detail-val.gold { color: var(--gold); font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 700; }
  .detail-desc { margin-bottom: 1.375rem; }
  .detail-desc .detail-val { font-weight: 400; line-height: 1.75; color: var(--text-mid); font-size: 0.875rem; }
  .divider { height: 1px; background: var(--border); margin: 1.375rem 0; }
  .status-update-wrap { display: flex; gap: 0.75rem; align-items: center; }
  .status-select {
    flex: 1; padding: 0.65rem 0.875rem; border: 1.5px solid var(--border); border-radius: 8px;
    font-family: inherit; font-size: 0.875rem; color: var(--text);
    background: var(--off-white); outline: none; transition: all 0.2s;
  }
  .status-select:focus { border-color: var(--gold); }
  .btn-save {
    padding: 0.65rem 1.5rem; background: var(--gold); color: white; border: none;
    border-radius: 8px; font-family: inherit; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
    box-shadow: 0 4px 12px rgba(184,134,11,0.3);
  }
  .btn-save:hover:not(:disabled) { background: var(--gold-mid); transform: translateY(-1px); }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  .contact-mini {
    background: var(--dark); border-radius: var(--radius);
    padding: 1.25rem; margin-top: 1rem;
    display: flex; gap: 1rem; flex-wrap: wrap;
  }
  .contact-mini-item { font-size: 0.78rem; color: rgba(255,255,255,0.45); }
  .contact-mini-item strong { display: block; color: var(--gold-light); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
  .contact-mini-item a { color: rgba(255,255,255,0.55); text-decoration: none; }
  .contact-mini-item a:hover { color: var(--gold-light); }

  .empty { text-align: center; padding: 4.5rem 2rem; color: var(--text-light); }
  .empty-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--gold-pale); color: var(--gold);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;
  }
  .empty-icon svg { width: 24px; height: 24px; }
  .empty p { font-size: 0.875rem; }
  .loading { text-align: center; padding: 3.5rem; color: var(--text-light); font-size: 0.875rem; }
  .spin {
    display: inline-block; width: 20px; height: 20px;
    border: 2px solid var(--border); border-top-color: var(--gold);
    border-radius: 50%; animation: spin 0.65s linear infinite;
    vertical-align: middle; margin-right: 0.5rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .toast {
    position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 9999;
    background: var(--dark-3); color: rgba(255,255,255,0.88);
    padding: 0.875rem 1.375rem; border-radius: var(--radius);
    border-left: 3px solid var(--gold);
    font-size: 0.84rem; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    animation: toastUp 0.25s ease; max-width: 320px; line-height: 1.5;
  }
  @keyframes toastUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .page-loader {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--off-white);
  }
  .page-loader-inner { text-align: center; color: var(--text-light); font-size: 0.875rem; }
  .page-loader-inner .spin { width: 28px; height: 28px; margin-bottom: 1rem; display: block; margin-left: auto; margin-right: auto; }

  @media (max-width: 1100px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .main { margin-left: 0; }
    .detail-grid { grid-template-columns: 1fr; }
  }
`;

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Ico = {
  Claims:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Money:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/></svg>,
  Check:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Pending:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Search:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Refresh:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Close:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Logout:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Alert:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Scale:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 9l9-6 9 6M5 21h14M3 9h18M7 21l-4-12M17 21l4-12"/></svg>,
};

const PER_PAGE = 10;

const STATUS_LABELS = {
  new:         "New",
  review:      "Under Review",
  in_progress: "In Progress",
  negotiation: "Negotiation",
  legal:       "Legal",
  settled:     "Settled",
  closed:      "Closed",
} as const;

const DEBT_TYPE_LABELS = {
  commercial: "Commercial",
  invoice:    "Invoice",
  loan:       "Loan Default",
  lease:      "Lease / Rent",
  other:      "Other",
} as const;

function fmt(n: number) {
  return Number(n).toLocaleString("fr-MA", { minimumFractionDigits: 0 }) + " MAD";
}
function fmtDate(d: string | Date) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────────
function getToken(): string {
  return localStorage.getItem("admin_token") || "";
}
function setToken(t: string) {
  localStorage.setItem("admin_token", t);
}
function clearToken() {
  localStorage.removeItem("admin_token");
}

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function apiGet(path: string) {
  return fetch(`${API}${path}`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
}

async function apiPost(path: string, body: unknown) {
  return fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function apiPatch(path: string, body: unknown) {
  return fetch(`${API}${path}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
    </span>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
interface LoginPageProps {
  onLogin: (username: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError("Username/email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.access as string);
        onLogin(data.username as string);
      } else {
        setError((data.error as string) || "Login failed. Please try again.");
      }
    } catch {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  const isEmail = identifier.includes("@");

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">
            <img src={logo} alt="HadiFlosCom"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <h1>HadiFlosCom</h1>
          <span>Admin Portal</span>
        </div>
        <div className="login-divider" />

        <a href="/" className="btn-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Home
        </a>

        <div className="login-title">Welcome back</div>
        <div className="login-sub">Sign in with your username or email address</div>

        {error && (
          <div className="login-error">
            <Ico.Alert />
            {error}
          </div>
        )}

        <div className="fgroup">
          <label className="flabel">{isEmail ? "Email Address" : "Username or Email"}</label>
          <input
            className="fcontrol"
            placeholder="admin or admin@example.com"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        <div className="fgroup">
          <label className="flabel">Password</label>
          <div className="pw-wrap">
            <input
              className="fcontrol"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw(v => !v)}
              tabIndex={-1}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <Ico.EyeOff /> : <Ico.Eye />}
            </button>
          </div>
        </div>

        <button className="btn-primary-full" onClick={handleLogin} disabled={loading}>
          {loading
            ? <><span className="spin" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in…</>
            : "Sign In"
          }
        </button>
      </div>
    </div>
  );
}

// ─── CLAIM DETAIL MODAL ───────────────────────────────────────────────────────
interface ClaimModalProps {
  claim: Claim;
  onClose: () => void;
  onStatusUpdate: (id: number, status: string) => void;
}

function ClaimModal({ claim, onClose, onStatusUpdate }: ClaimModalProps) {
  const [status, setStatus] = useState(claim.status);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await apiPatch(`/admin/claims/${claim.id}/`, { status });
      if (res.ok) {
        onStatusUpdate(claim.id, status);
        onClose();
      }
    } catch (_) {}
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">Claim Detail</div>
            <div className="modal-title">{claim.full_name}</div>
            <div className="modal-ref">{claim.reference_number} · Submitted {fmtDate(claim.created_at)}</div>
          </div>
          <button className="btn-close" onClick={onClose}><Ico.Close /></button>
        </div>

        <div className="modal-body">
          <div className="modal-section-label">Claimant Information</div>
          <div className="detail-grid">
            <div><div className="detail-lbl">Full Name</div><div className="detail-val">{claim.full_name}</div></div>
            <div><div className="detail-lbl">Company</div><div className="detail-val">{claim.company_name || "—"}</div></div>
            <div><div className="detail-lbl">Email</div><div className="detail-val">{claim.email}</div></div>
            <div><div className="detail-lbl">Phone</div><div className="detail-val">{claim.phone}</div></div>
            <div><div className="detail-lbl">Language</div><div className="detail-val">{claim.preferred_language?.toUpperCase() || "—"}</div></div>
            <div><div className="detail-lbl">Status</div><div className="detail-val"><StatusBadge status={claim.status} /></div></div>
          </div>

          <div className="divider" />

          <div className="modal-section-label">Debt Details</div>
          <div className="detail-grid">
            <div><div className="detail-lbl">Debtor Name</div><div className="detail-val">{claim.debtor_name}</div></div>
            <div><div className="detail-lbl">Debtor Location</div><div className="detail-val">{claim.debtor_location}</div></div>
            <div><div className="detail-lbl">Amount Owed</div><div className="detail-val gold">{fmt(claim.amount_owed)}</div></div>
            <div>
              <div className="detail-lbl">Debt Type</div>
              <div className="detail-val">
                <span className="tag">{DEBT_TYPE_LABELS[claim.debt_type as keyof typeof DEBT_TYPE_LABELS] || claim.debt_type}</span>
              </div>
            </div>
          </div>

          <div className="detail-desc">
            <div className="detail-lbl">Description</div>
            <div className="detail-val" style={{ marginTop: "0.4rem" }}>{claim.description}</div>
          </div>

          <div className="contact-mini">
            <div className="contact-mini-item">
              <strong>Email</strong>
              <a href={`mailto:${claim.email}`}>{claim.email}</a>
            </div>
            <div className="contact-mini-item">
              <strong>Phone</strong>
              <a href={`tel:${claim.phone}`}>{claim.phone}</a>
            </div>
          </div>

          <div className="divider" />

          <div className="modal-section-label">Update Status</div>
          <div className="status-update-wrap">
            <select className="status-select" value={status} onChange={e => setStatus(e.target.value as keyof typeof STATUS_LABELS)}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <button className="btn-save" onClick={handleUpdate} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN APP ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authState, setAuthState]         = useState<string | null | false>(null);
  const [tab, setTab]                     = useState<"dashboard" | "claims">("dashboard");
  const [claims, setClaims]               = useState<Claim[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [page, setPage]                   = useState(1);
  const [selected, setSelected]           = useState<Claim | null>(null);
  const [toast, setToast]                 = useState<string | null>(null);

  // Check token on mount
  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) {
        setAuthState(false);
        return;
      }
      try {
        const res = await apiGet("/admin/session/");
        const data = await res.json();
        if (data.authenticated) {
          setAuthState(data.username as string);
        } else {
          clearToken();
          setAuthState(false);
        }
      } catch {
        // Keep token, just show login on network error
        setAuthState(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (authState && typeof authState === "string") fetchClaims();
  }, [authState]);

  const fetchClaims = async () => {
    setLoadingClaims(true);
    try {
      const res = await apiGet("/admin/claims/");
      if (res.status === 401) {
        clearToken();
        showToast("Session expired. Please log in again.");
        setAuthState(false);
        setLoadingClaims(false);
        return;
      }
      if (!res.ok) {
        showToast("Could not load claims — server error.");
        setLoadingClaims(false);
        return;
      }
      const data = await res.json();
      setClaims(Array.isArray(data) ? data : (data.results || []));
    } catch {
      showToast("Could not reach server. Try refreshing.");
    }
    setLoadingClaims(false);
  };

  const handleLogin = (username: string) => {
    setAuthState(username);
  };

  const handleLogout = () => {
    clearToken();
    setAuthState(false);
    setClaims([]);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusUpdate = (id: number, status: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: status as keyof typeof STATUS_LABELS } : c));
    showToast("✓ Status updated successfully.");
  };

  const filtered = claims.filter(c => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || [c.full_name, c.reference_number, c.debtor_name, c.email, c.company_name]
      .some(v => v?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const total       = claims.length;
  const totalAmount = claims.reduce((s, c) => s + Number(c.amount_owed || 0), 0);
  const settled     = claims.filter(c => c.status === "settled").length;
  const newClaims   = claims.filter(c => c.status === "new").length;

  if (authState === null) {
    return (
      <>
        <style>{styles}</style>
        <div className="page-loader">
          <div className="page-loader-inner">
            <span className="spin" />
            Checking session…
          </div>
        </div>
      </>
    );
  }

  if (!authState) {
    return (
      <>
        <style>{styles}</style>
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: <Ico.Dashboard /> },
    { id: "claims"    as const, label: "All Claims", icon: <Ico.Claims />   },
  ];

  const topbarTitles: Record<"dashboard" | "claims", string> = {
    dashboard: "Dashboard Overview",
    claims:    "Claims Management",
  };

  return (
    <div>
      <style>{styles}</style>
      {toast && <div className="toast">{toast}</div>}
      {selected && (
        <ClaimModal
          claim={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <div className="admin-wrap">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-logo-ring">
              <img src={logo} alt="HadiFlosCom"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="sidebar-brand-text">
              <strong>HadiFlosCom</strong>
              <span>Admin Portal</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Navigation</div>
            {navItems.map(n => (
              <button
                key={n.id}
                className={`sidebar-link ${tab === n.id ? "active" : ""}`}
                onClick={() => setTab(n.id)}
              >
                {n.icon} {n.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">{(authState as string).charAt(0).toUpperCase()}</div>
              <div>
                <div className="sidebar-user-name">{authState}</div>
                <div className="sidebar-user-role">Administrator</div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <Ico.Logout /> Sign Out
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <div className="topbar-eyebrow">HadiFlosCom</div>
              <div className="topbar-title">{topbarTitles[tab]}</div>
            </div>
            <div className="topbar-right">
              <div className="topbar-admin">
                <span className="admin-dot" /> {authState}
              </div>
            </div>
          </div>

          <div className="page-content">

            {tab === "dashboard" && (
              <>
                <div className="stat-grid">
                  <div className="stat-card gold">
                    <div>
                      <div className="stat-card-label">Total Claims</div>
                      <div className="stat-card-value">{total}</div>
                      <div className="stat-card-sub">All time submissions</div>
                    </div>
                    <div className="stat-icon si-gold"><Ico.Claims /></div>
                  </div>
                  <div className="stat-card amber">
                    <div>
                      <div className="stat-card-label">Total Owed</div>
                      <div className="stat-card-value" style={{ fontSize: "1.8rem" }}>
                        {(totalAmount / 1000).toFixed(0)}K
                      </div>
                      <div className="stat-card-sub">MAD across all claims</div>
                    </div>
                    <div className="stat-icon si-amber"><Ico.Money /></div>
                  </div>
                  <div className="stat-card green">
                    <div>
                      <div className="stat-card-label">Settled</div>
                      <div className="stat-card-value">{settled}</div>
                      <div className="stat-card-sub">Successfully resolved</div>
                    </div>
                    <div className="stat-icon si-green"><Ico.Check /></div>
                  </div>
                  <div className="stat-card blue">
                    <div>
                      <div className="stat-card-label">New</div>
                      <div className="stat-card-value">{newClaims}</div>
                      <div className="stat-card-sub">Awaiting review</div>
                    </div>
                    <div className="stat-icon si-blue"><Ico.Pending /></div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-eyebrow">Latest Activity</div>
                      <div className="card-title">Recent Claims</div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-action" onClick={fetchClaims}>
                        <Ico.Refresh /> Refresh
                      </button>
                      <button className="btn-cta" onClick={() => setTab("claims")}>
                        <Ico.Claims /> View All
                      </button>
                    </div>
                  </div>

                  {loadingClaims ? (
                    <div className="loading"><span className="spin" />Loading claims…</div>
                  ) : claims.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon"><Ico.Claims /></div>
                      <p>No claims yet. They will appear here once submitted.</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Reference</th><th>Claimant</th><th>Debtor</th>
                          <th>Amount</th><th>Status</th><th>Date</th><th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {claims.slice(0, 8).map(c => (
                          <tr key={c.id}>
                            <td><span className="td-ref">{c.reference_number}</span></td>
                            <td>
                              <div className="td-name">{c.full_name}</div>
                              <div className="td-sub">{c.email}</div>
                            </td>
                            <td>
                              <div>{c.debtor_name}</div>
                              <div className="td-sub">{c.debtor_location}</div>
                            </td>
                            <td><span className="td-amount">{fmt(c.amount_owed)}</span></td>
                            <td><StatusBadge status={c.status} /></td>
                            <td><span className="td-muted">{fmtDate(c.created_at)}</span></td>
                            <td>
                              <button className="btn-view" onClick={() => setSelected(c)}>
                                <Ico.Eye /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {tab === "claims" && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-eyebrow">Management</div>
                    <div className="card-title">All Claims ({filtered.length})</div>
                  </div>
                  <div className="card-actions">
                    <div className="search-wrap">
                      <span className="search-icon"><Ico.Search /></span>
                      <input
                        className="search-input"
                        placeholder="Search name, ref, debtor…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                      />
                    </div>
                    <select
                      className="filter-select"
                      value={statusFilter}
                      onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                      <option value="all">All Statuses</option>
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                    <button className="btn-action" onClick={fetchClaims}>
                      <Ico.Refresh /> Refresh
                    </button>
                  </div>
                </div>

                {loadingClaims ? (
                  <div className="loading"><span className="spin" />Loading claims…</div>
                ) : paginated.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon"><Ico.Scale /></div>
                    <p>No claims match your current filters.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Reference</th><th>Claimant</th><th>Company</th><th>Debtor</th>
                        <th>Amount</th><th>Type</th><th>Status</th><th>Date</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map(c => (
                        <tr key={c.id}>
                          <td><span className="td-ref">{c.reference_number}</span></td>
                          <td>
                            <div className="td-name">{c.full_name}</div>
                            <div className="td-sub">{c.email}</div>
                          </td>
                          <td><span className="td-muted">{c.company_name || "—"}</span></td>
                          <td>
                            <div>{c.debtor_name}</div>
                            <div className="td-sub">{c.debtor_location}</div>
                          </td>
                          <td><span className="td-amount">{fmt(c.amount_owed)}</span></td>
                          <td>
                            <span className="tag">
                              {DEBT_TYPE_LABELS[c.debt_type as keyof typeof DEBT_TYPE_LABELS] || c.debt_type}
                            </span>
                          </td>
                          <td><StatusBadge status={c.status} /></td>
                          <td><span className="td-muted">{fmtDate(c.created_at)}</span></td>
                          <td>
                            <button className="btn-view" onClick={() => setSelected(c)}>
                              <Ico.Eye /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="pagination">
                  <span>
                    Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="page-btns">
                    <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}