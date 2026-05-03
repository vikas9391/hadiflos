import React, { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";




// ─── TYPE DEFINITIONS ─────────────────────────────────────────────────────────
type Lang = "EN" | "FR" | "AR";
type PageId = "home" | "services" | "process" | "why" | "about" | "contact";

interface NavItem {
  home: string;
  services: string;
  process: string;
  why: string;
  about: string;
  contact: string;
  cta: string;
}

interface ServiceItem {
  title: string;
  desc: string;
  icon: string;
}

interface StepItem {
  label: string;
  title: string;
  desc: string;
}

interface ValueItem {
  title: string;
  desc: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  desc: string;
}

interface TestimonialItem {
  name: string;
  company: string;
  text: string;
  stars: number;
}

interface FaqItem {
  q: string;
  a: string;
}

interface Translation {
  dir: string;
  nav: NavItem;
  hero: {
    badge: string;
    h1a: string;
    h1b: string;
    desc: string;
    btn1: string;
    btn2: string;
    note: string;
  };
  stats: [string, string][];
  services: {
    label: string;
    title: string;
    sub: string;
    learn: string;
    items: ServiceItem[];
  };
  process: {
    label: string;
    title: string;
    sub: string;
    steps: StepItem[];
  };
  why: {
    label: string;
    title: string;
    desc: string;
    points: string[];
    btn: string;
    badge: string;
  };
  about: {
    label: string;
    title: string;
    p1: string;
    p2: string;
    values: ValueItem[];
    team: TeamMember[];
  };
  contact: {
    label: string;
    title: string;
    sub: string;
    infoTitle: string;
    infoDesc: string;
    address: string;
    phone: string;
    email: string;
    languages: string;
    langVal: string;
    hours: string;
    hoursVal: string;
    wa: string;
    formTitle: string;
    name: string;
    company: string;
    companyHint: string;
    emailF: string;
    phoneF: string;
    debtorName: string;
    debtorNameHint: string;
    debtorLoc: string;
    debtorLocHint: string;
    amount: string;
    debtType: string;
    debtTypes: string[];
    desc: string;
    descHint: string;
    prefLang: string;
    agree: string;
    submit: string;
    success: string;
    req: string;
    agreeReq: string;
  };
  footer: { links: string; contact: string; rights: string };
  banner: { h2: string; p: string; btn: string };
  faq: { label: string; title: string; items: FaqItem[] };
  testimonials: { label: string; title: string; items: TestimonialItem[] };
}

interface NavProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  page: PageId;
  setPage: (p: PageId) => void;
  t: Translation;
}

interface FooterProps {
  t: Translation;
  setPage: (p: PageId) => void;
}

interface BreadcrumbProps {
  t: Translation;
  current: string;
  setPage: (p: PageId) => void;
}

interface PageProps {
  t: Translation;
  setPage: (p: PageId) => void;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icons = {
  Handshake: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/><path d="M8 12l2 2 4-4"/></svg>),
  Scale: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 9l9-6 9 6M5 21h14M3 9h18M7 21l-4-12M17 21l4-12"/></svg>),
  Search: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>),
  BarChart: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>),
  Shield: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  Building: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>),
  FileText: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  MagnifyingGlass: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>),
  Bolt: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  CheckCircle: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  Check: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  ArrowRight: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  MapPin: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  Phone: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.36a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  Mail: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  Globe: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  Clock: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Integrity: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>),
  Efficiency: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M16 8l-4 4"/></svg>),
  Lock: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  Whatsapp: () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>),
  ChevronDown: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  Claim: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>),
  Menu: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>),
  X: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Star: () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>),
  Award: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>),
  Users: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  TrendingUp: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T: Record<Lang, Translation> = {
  EN: {
    dir: "ltr",
    nav: { home: "Home", services: "Services", process: "How It Works", why: "Why Morocco", about: "About", contact: "Contact", cta: "Start a Claim" },
    hero: {
      badge: "Debt Recovery Specialists",
      h1a: "Recover What Is",
      h1b: "Rightfully Yours",
      desc: "Local expertise, global reach. We combine amicable negotiation with legal action to recover your unpaid debts across Morocco.",
      btn1: "Start Your Claim",
      btn2: "Our Services",
      note: "No Recovery, No Fee options available for commercial debts",
    },
    stats: [["500+","Cases Handled"],["87%","Recovery Rate"],["10+","Years Experience"],["12","Cities Covered"]],
    services: {
      label: "Services",
      title: "Our Debt Recovery Services",
      sub: "Tailored solutions for every situation — from amicable negotiation to full court representation.",
      learn: "Learn more",
      items: [
        { title: "Amicable Collection", desc: "Preserve business relationships while recovering funds through direct negotiation, demand letters, and culturally adapted communication.", icon: "Handshake" },
        { title: "Legal Action & Litigation", desc: "Full representation in Moroccan courts, from formal payment demands to enforcement of judgments. Partnered with top local law firms.", icon: "Scale" },
        { title: "Asset Investigation", desc: "Professional location of debtors and asset reports to assess recovery feasibility before investing in legal proceedings.", icon: "Search" },
        { title: "Portfolio Management", desc: "Complete management of your debt portfolios with real-time reporting and customized dashboards.", icon: "BarChart" },
        { title: "Legal Advisory", desc: "Preventive legal guidance to secure your contracts and minimize the risk of future unpaid debts.", icon: "Shield" },
        { title: "Mediation & Arbitration", desc: "Alternative dispute resolution for commercial disputes — fast and cost-effective without going to court.", icon: "Building" },
      ],
    },
    process: {
      label: "Process", title: "How It Works", sub: "A transparent four-step process from submission to settlement.",
      steps: [
        { label: "Step 01", title: "Submit Your Claim", desc: "Provide details about the debtor and the unpaid amount via our secure form." },
        { label: "Step 02", title: "Investigation & Strategy", desc: "We assess the case, locate assets, and recommend the best recovery approach." },
        { label: "Step 03", title: "Recovery Action", desc: "Amicable negotiation begins; if needed, we escalate to legal proceedings." },
        { label: "Step 04", title: "Settlement & Report", desc: "You receive recovered funds and a detailed report of all actions taken." },
      ],
    },
    why: {
      label: "Local Expertise", title: "Why Morocco?",
      desc: "Morocco's legal and business environment requires specialised local knowledge. Our team is based in Casablanca and works seamlessly with local courts and authorities.",
      points: [
        "On-the-ground agents with deep cultural and legal understanding",
        "Multilingual communication: Arabic, French, English",
        "Partnered with leading Moroccan law firms",
        "No Cure, No Pay — contingency pricing for eligible commercial debts",
        "Real-time monitoring and transparent reporting",
      ],
      btn: "Start a Claim",
      badge: "Success Rate",
    },
    about: {
      label: "Your Trusted Partner",
      title: "About HadiFlosCom",
      p1: "With years of experience in Moroccan debt recovery, we combine international standards with local expertise. Our team of multilingual agents and legal partners ensures that your claims are handled efficiently, ethically, and with the highest chance of success.",
      p2: "Our mission: to recover what is rightfully yours while preserving business relationships whenever possible. We offer transparent pricing and regular updates throughout the process.",
      values: [
        { title: "Integrity", desc: "We operate with impeccable ethics and complete transparency in all our actions.", icon: "Integrity" },
        { title: "Efficiency", desc: "Measurable results through proven methods and unmatched local expertise.", icon: "Efficiency" },
        { title: "Confidentiality", desc: "Your information and that of your debtors is handled with the strictest confidentiality.", icon: "Lock" },
      ],
      team: [
        { name: "Hadi Flos", role: "Founder & CEO", desc: "15+ years in Moroccan commercial law and debt recovery." },
        { name: "Leila Amrani", role: "Head of Legal", desc: "Former judge with deep expertise in enforcement proceedings." },
        { name: "Karim Benali", role: "Senior Investigator", desc: "Specialist in asset tracing and debtor location across North Africa." },
      ],
    },
    contact: {
      label: "Contact", title: "Start Your Claim",
      sub: "Fill out the form below and our team will contact you within 24 hours.",
      infoTitle: "Contact Information",
      infoDesc: "Reach us through any of these channels. Our multilingual team is ready to assist you.",
      address: "Address", phone: "Phone", email: "Email", languages: "Languages",
      langVal: "Arabic, French, English",
      hours: "Business Hours", hoursVal: "Monday – Friday: 9:00 AM – 6:00 PM (GMT+1)",
      wa: "WhatsApp available",
      formTitle: "Claim Form",
      name: "Full Name", company: "Company Name", companyHint: "Optional",
      emailF: "Email", phoneF: "Phone",
      debtorName: "Debtor's Name", debtorNameHint: "Name or company",
      debtorLoc: "Debtor's Location", debtorLocHint: "City, Country",
      amount: "Amount Owed", debtType: "Type of Debt",
      debtTypes: ["Commercial Debt","Invoice Unpaid","Loan Default","Lease / Rent","Other"],
      desc: "Brief Description", descHint: "Describe the situation briefly...",
      prefLang: "Preferred Language",
      agree: "I agree to the processing of my data for claim assessment.",
      submit: "Submit Claim",
      success: "Claim submitted successfully! We'll contact you within 24 hours.",
      req: "Please fill in all required fields.",
      agreeReq: "Please agree to data processing.",
    },
    footer: { links: "Quick Links", contact: "Contact", rights: "All rights reserved." },
    banner: { h2: "No Cure, No Pay", p: "No Recovery, No Fee — available for eligible commercial debts.", btn: "Start a Claim" },
    faq: {
      label: "FAQ", title: "Frequently Asked Questions",
      items: [
        { q: "How long does the recovery process take?", a: "Amicable collection typically takes 30–90 days. Legal proceedings may extend to 6–18 months depending on case complexity." },
        { q: "What fees do you charge?", a: "For eligible commercial debts, we work on a contingency basis — no recovery, no fee. For other cases, we offer fixed-fee or hourly rate options." },
        { q: "Do you handle international debts?", a: "Yes. We specialize in recovering debts owed by Moroccan entities to international creditors, with expertise in cross-border enforcement." },
        { q: "What information do I need to start?", a: "A basic claim submission requires the debtor's name/company, their location, the amount owed, and supporting documents such as invoices or contracts." },
        { q: "Is my information kept confidential?", a: "Absolutely. All client and debtor information is handled under strict confidentiality protocols and in compliance with applicable data protection laws." },
      ],
    },
    testimonials: {
      label: "Testimonials", title: "What Our Clients Say",
      items: [
        { name: "Antoine Moreau", company: "Moreau & Fils, Lyon", text: "HadiFlosCom recovered a €45,000 debt we had written off. Professional, discreet, and faster than we expected.", stars: 5 },
        { name: "Sophie Bernhard", company: "Alpine Trade GmbH", text: "Their understanding of Moroccan law was invaluable. The whole process was transparent and they kept us informed at every step.", stars: 5 },
        { name: "Carlos Vega", company: "Vega Imports S.L.", text: "Excellent service. Their negotiation skills resolved the dispute without litigation, saving us significant time and cost.", stars: 5 },
      ],
    },
  },
  FR: {
    dir: "ltr",
    nav: { home: "Accueil", services: "Services", process: "Notre Processus", why: "Pourquoi le Maroc", about: "À Propos", contact: "Contact", cta: "Déposer un Dossier" },
    hero: {
      badge: "Spécialistes du Recouvrement",
      h1a: "Récupérez Ce Qui Vous",
      h1b: "Appartient",
      desc: "Expertise locale, portée internationale. Nous combinons la négociation amiable et l'action en justice pour récupérer vos créances impayées au Maroc.",
      btn1: "Déposer un Dossier",
      btn2: "Nos Services",
      note: "Options sans honoraires en cas d'échec disponibles pour les créances commerciales",
    },
    stats: [["500+","Dossiers Traités"],["87%","Taux de Recouvrement"],["10+","Années d'Expérience"],["12","Villes Couvertes"]],
    services: {
      label: "Services",
      title: "Nos Services de Recouvrement",
      sub: "Des solutions sur mesure pour chaque situation — de la négociation amiable à la représentation judiciaire.",
      learn: "En savoir plus",
      items: [
        { title: "Recouvrement Amiable", desc: "Préservez vos relations commerciales tout en récupérant vos fonds grâce à la négociation directe et aux lettres de mise en demeure.", icon: "Handshake" },
        { title: "Action en Justice", desc: "Représentation complète devant les tribunaux marocains, des injonctions de payer à l'exécution des jugements.", icon: "Scale" },
        { title: "Investigation d'Actifs", desc: "Localisation professionnelle des débiteurs et rapports d'actifs pour évaluer la faisabilité du recouvrement.", icon: "Search" },
        { title: "Gestion de Portefeuille", desc: "Gestion complète de vos portefeuilles de créances avec reporting en temps réel et tableaux de bord personnalisés.", icon: "BarChart" },
        { title: "Conseil Juridique", desc: "Accompagnement juridique préventif pour sécuriser vos contrats et minimiser les risques d'impayés.", icon: "Shield" },
        { title: "Médiation & Arbitrage", desc: "Résolution alternative des litiges commerciaux — rapide et rentable, sans recours aux tribunaux.", icon: "Building" },
      ],
    },
    process: {
      label: "Processus", title: "Notre Processus", sub: "Un processus transparent en quatre étapes, de la soumission au règlement.",
      steps: [
        { label: "Étape 01", title: "Soumettez votre Dossier", desc: "Fournissez les détails sur le débiteur et le montant dû via notre formulaire sécurisé." },
        { label: "Étape 02", title: "Investigation & Stratégie", desc: "Nous évaluons le dossier, localisons les actifs et recommandons la meilleure approche." },
        { label: "Étape 03", title: "Action de Recouvrement", desc: "La négociation amiable débute; si nécessaire, nous escaladons vers des procédures judiciaires." },
        { label: "Étape 04", title: "Règlement & Rapport", desc: "Vous recevez les fonds recouvrés et un rapport détaillé de toutes les actions entreprises." },
      ],
    },
    why: {
      label: "Expertise Locale", title: "Pourquoi le Maroc ?",
      desc: "L'environnement juridique et commercial marocain nécessite une connaissance locale spécialisée. Notre équipe, basée à Casablanca, travaille en étroite collaboration avec les tribunaux et autorités locaux.",
      points: [
        "Agents sur le terrain avec une compréhension culturelle et juridique approfondie",
        "Communication multilingue : arabe, français, anglais",
        "Partenariat avec les meilleurs cabinets d'avocats marocains",
        "Sans résultat, sans honoraires — tarification au succès",
        "Suivi en temps réel et reporting transparent",
      ],
      btn: "Déposer un Dossier",
      badge: "Taux de Succès",
    },
    about: {
      label: "Votre Partenaire de Confiance",
      title: "À Propos de HadiFlosCom",
      p1: "Forts d'années d'expérience dans le recouvrement de créances au Maroc, nous associons standards internationaux et expertise locale.",
      p2: "Notre mission : récupérer ce qui vous appartient tout en préservant vos relations commerciales. Nous offrons une tarification transparente et des mises à jour régulières.",
      values: [
        { title: "Intégrité", desc: "Nous agissons avec une éthique irréprochable et une transparence totale dans toutes nos actions.", icon: "Integrity" },
        { title: "Efficacité", desc: "Des résultats mesurables grâce à des méthodes éprouvées et une expertise locale inégalée.", icon: "Efficiency" },
        { title: "Confidentialité", desc: "Vos informations et celles de vos débiteurs sont traitées avec la plus stricte confidentialité.", icon: "Lock" },
      ],
      team: [
        { name: "Hadi Flos", role: "Fondateur & PDG", desc: "15+ ans en droit commercial marocain et recouvrement de créances." },
        { name: "Leila Amrani", role: "Directrice Juridique", desc: "Ancienne juge avec une expertise approfondie en procédures d'exécution." },
        { name: "Karim Benali", role: "Investigateur Senior", desc: "Spécialiste en localisation d'actifs et de débiteurs en Afrique du Nord." },
      ],
    },
    contact: {
      label: "Contact", title: "Déposer un Dossier",
      sub: "Remplissez le formulaire ci-dessous et notre équipe vous contactera dans les 24 heures.",
      infoTitle: "Coordonnées", infoDesc: "Contactez-nous via l'un de ces canaux. Notre équipe multilingue est prête à vous aider.",
      address: "Adresse", phone: "Téléphone", email: "Email", languages: "Langues",
      langVal: "Arabe, Français, Anglais",
      hours: "Horaires", hoursVal: "Lundi – Vendredi : 9h00 – 18h00 (GMT+1)",
      wa: "WhatsApp disponible",
      formTitle: "Formulaire de Dossier",
      name: "Nom Complet", company: "Nom de la Société", companyHint: "Optionnel",
      emailF: "Email", phoneF: "Téléphone",
      debtorName: "Nom du Débiteur", debtorNameHint: "Nom ou société",
      debtorLoc: "Localisation du Débiteur", debtorLocHint: "Ville, Pays",
      amount: "Montant Dû", debtType: "Type de Créance",
      debtTypes: ["Créance Commerciale","Facture Impayée","Défaut de Remboursement","Loyer / Bail","Autre"],
      desc: "Description Brève", descHint: "Décrivez brièvement la situation...",
      prefLang: "Langue Préférée",
      agree: "J'accepte le traitement de mes données pour l'évaluation du dossier.",
      submit: "Soumettre le Dossier",
      success: "Dossier soumis avec succès ! Nous vous contacterons dans les 24 heures.",
      req: "Veuillez remplir tous les champs obligatoires.",
      agreeReq: "Veuillez accepter le traitement des données.",
    },
    footer: { links: "Liens Rapides", contact: "Contact", rights: "Tous droits réservés." },
    banner: { h2: "Pas de Résultat, Pas d'Honoraires", p: "Sans recouvrement, sans frais — pour les créances commerciales éligibles.", btn: "Déposer un Dossier" },
    faq: {
      label: "FAQ", title: "Questions Fréquentes",
      items: [
        { q: "Combien de temps dure le processus de recouvrement ?", a: "Le recouvrement amiable prend généralement 30 à 90 jours. Les procédures judiciaires peuvent s'étendre de 6 à 18 mois selon la complexité du dossier." },
        { q: "Quels sont vos honoraires ?", a: "Pour les créances commerciales éligibles, nous travaillons à la commission — sans résultat, sans honoraires. Pour d'autres cas, nous proposons des forfaits ou des tarifs horaires." },
        { q: "Traitez-vous les dettes internationales ?", a: "Oui. Nous sommes spécialisés dans le recouvrement de dettes dues par des entités marocaines à des créanciers internationaux." },
        { q: "Quelles informations sont nécessaires pour commencer ?", a: "Le nom du débiteur, sa localisation, le montant dû et les documents justificatifs tels que factures ou contrats." },
        { q: "Mes informations sont-elles confidentielles ?", a: "Absolument. Toutes les informations sont traitées sous protocoles de confidentialité stricts et conformément aux lois applicables." },
      ],
    },
    testimonials: {
      label: "Témoignages", title: "Ce Que Disent Nos Clients",
      items: [
        { name: "Antoine Moreau", company: "Moreau & Fils, Lyon", text: "HadiFlosCom a récupéré une dette de 45 000 € que nous avions abandonnée. Professionnel, discret et plus rapide que prévu.", stars: 5 },
        { name: "Sophie Bernhard", company: "Alpine Trade GmbH", text: "Leur connaissance du droit marocain était inestimable. Tout le processus était transparent.", stars: 5 },
        { name: "Carlos Vega", company: "Vega Imports S.L.", text: "Excellent service. Leurs compétences en négociation ont résolu le litige sans procès.", stars: 5 },
      ],
    },
  },
  AR: {
    dir: "rtl",
    nav: { home: "الرئيسية", services: "الخدمات", process: "كيف نعمل", why: "لماذا المغرب", about: "من نحن", contact: "اتصل بنا", cta: "ابدأ طلبك" },
    hero: {
      badge: "متخصصون في استرداد الديون",
      h1a: "استرد ما يخصك",
      h1b: "بحق وعدالة",
      desc: "خبرة محلية وانتشار دولي. نجمع بين التفاوض الودي والإجراءات القانونية لاسترداد ديونك في المغرب.",
      btn1: "ابدأ طلبك",
      btn2: "خدماتنا",
      note: "خيارات بدون رسوم عند عدم الاسترداد متاحة للديون التجارية",
    },
    stats: [["500+","قضية معالجة"],["87%","معدل الاسترداد"],["10+","سنوات خبرة"],["12","مدينة مغطاة"]],
    services: {
      label: "الخدمات",
      title: "خدمات استرداد الديون",
      sub: "حلول مصممة لكل حالة — من التفاوض الودي إلى التمثيل القانوني الكامل.",
      learn: "اعرف أكثر",
      items: [
        { title: "التحصيل الودي", desc: "الحفاظ على العلاقات التجارية مع استرداد الأموال عبر التفاوض المباشر وخطابات المطالبة.", icon: "Handshake" },
        { title: "الإجراءات القانونية", desc: "تمثيل كامل أمام المحاكم المغربية، من أوامر الدفع إلى تنفيذ الأحكام.", icon: "Scale" },
        { title: "التحقيق في الأصول", desc: "تحديد موقع المدينين وإعداد تقارير الأصول لتقييم جدوى الاسترداد.", icon: "Search" },
        { title: "إدارة المحافظ", desc: "إدارة شاملة لمحافظ الديون مع تقارير فورية ولوحات بيانات مخصصة.", icon: "BarChart" },
        { title: "الاستشارة القانونية", desc: "إرشادات قانونية وقائية لتأمين عقودك وتقليل مخاطر الديون المستقبلية.", icon: "Shield" },
        { title: "الوساطة والتحكيم", desc: "حل بديل للنزاعات التجارية — سريع وفعّال دون اللجوء إلى المحاكم.", icon: "Building" },
      ],
    },
    process: {
      label: "العملية", title: "كيف نعمل", sub: "عملية شفافة من أربع خطوات من التقديم إلى التسوية.",
      steps: [
        { label: "الخطوة ١", title: "قدّم طلبك", desc: "أدخل تفاصيل المدين والمبلغ المستحق عبر نموذجنا الآمن." },
        { label: "الخطوة ٢", title: "التحقيق والاستراتيجية", desc: "نقيّم القضية ونحدد الأصول ونوصي بأفضل نهج للاسترداد." },
        { label: "الخطوة ٣", title: "إجراء الاسترداد", desc: "تبدأ المفاوضات الودية؛ وعند الضرورة نتصاعد إلى الإجراءات القانونية." },
        { label: "الخطوة ٤", title: "التسوية والتقرير", desc: "تستلم الأموال المستردة وتقريراً تفصيلياً بجميع الإجراءات المتخذة." },
      ],
    },
    why: {
      label: "الخبرة المحلية", title: "لماذا المغرب؟",
      desc: "يتطلب البيئة القانونية والتجارية في المغرب معرفة محلية متخصصة. فريقنا مقرّه الدار البيضاء ويعمل مع المحاكم والسلطات المحلية.",
      points: [
        "وكلاء ميدانيون بفهم ثقافي وقانوني عميق",
        "تواصل متعدد اللغات: العربية والفرنسية والإنجليزية",
        "شراكة مع أبرز مكاتب المحاماة المغربية",
        "لا شفاء؟ لا رسوم — تسعير على أساس النتائج",
        "مراقبة فورية وتقارير شفافة",
      ],
      btn: "ابدأ طلبك",
      badge: "معدل النجاح",
    },
    about: {
      label: "شريكك الموثوق",
      title: "عن HadiFlosCom",
      p1: "بخبرة سنوات في استرداد الديون بالمغرب، نجمع المعايير الدولية مع الخبرة المحلية.",
      p2: "مهمتنا: استرداد ما يخصك مع الحفاظ على علاقاتك التجارية كلما أمكن ذلك.",
      values: [
        { title: "النزاهة", desc: "نعمل بأخلاقيات لا تشوبها شائبة وشفافية كاملة في جميع أعمالنا.", icon: "Integrity" },
        { title: "الكفاءة", desc: "نتائج قابلة للقياس من خلال أساليب مجربة وخبرة محلية لا مثيل لها.", icon: "Efficiency" },
        { title: "السرية", desc: "تُعامَل معلوماتك ومعلومات مدينيك بأقصى درجات السرية والحماية.", icon: "Lock" },
      ],
      team: [
        { name: "هادي فلوس", role: "المؤسس والرئيس التنفيذي", desc: "أكثر من 15 عامًا في القانون التجاري المغربي واسترداد الديون." },
        { name: "ليلى عمراني", role: "رئيسة الشؤون القانونية", desc: "قاضية سابقة ذات خبرة عميقة في إجراءات التنفيذ." },
        { name: "كريم بن علي", role: "محقق أول", desc: "متخصص في تتبع الأصول وتحديد المدينين عبر شمال أفريقيا." },
      ],
    },
    contact: {
      label: "تواصل معنا", title: "ابدأ طلبك",
      sub: "أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة.",
      infoTitle: "معلومات التواصل", infoDesc: "تواصل معنا عبر أي من هذه القنوات. فريقنا المتعدد اللغات جاهز لمساعدتك.",
      address: "العنوان", phone: "الهاتف", email: "البريد الإلكتروني", languages: "اللغات",
      langVal: "العربية، الفرنسية، الإنجليزية",
      hours: "ساعات العمل", hoursVal: "الاثنين – الجمعة: ٩:٠٠ – ١٨:٠٠ (GMT+1)",
      wa: "واتساب متاح",
      formTitle: "نموذج الطلب",
      name: "الاسم الكامل", company: "اسم الشركة", companyHint: "اختياري",
      emailF: "البريد الإلكتروني", phoneF: "الهاتف",
      debtorName: "اسم المدين", debtorNameHint: "الاسم أو الشركة",
      debtorLoc: "موقع المدين", debtorLocHint: "المدينة، البلد",
      amount: "المبلغ المستحق", debtType: "نوع الدين",
      debtTypes: ["دين تجاري","فاتورة غير مسددة","تخلف عن السداد","إيجار / عقد","أخرى"],
      desc: "وصف موجز", descHint: "صف الحالة بإيجاز...",
      prefLang: "اللغة المفضلة",
      agree: "أوافق على معالجة بياناتي لتقييم الطلب.",
      submit: "تقديم الطلب",
      success: "تم تقديم الطلب بنجاح! سنتواصل معك خلال 24 ساعة.",
      req: "يرجى ملء جميع الحقول المطلوبة.",
      agreeReq: "يرجى الموافقة على معالجة البيانات.",
    },
    footer: { links: "روابط سريعة", contact: "تواصل معنا", rights: "جميع الحقوق محفوظة." },
    banner: { h2: "لا شفاء؟ لا رسوم", p: "بدون استرداد، بدون أتعاب — للديون التجارية المؤهلة.", btn: "ابدأ طلبك" },
    faq: {
      label: "الأسئلة الشائعة", title: "الأسئلة الشائعة",
      items: [
        { q: "كم يستغرق عملية الاسترداد؟", a: "يستغرق التحصيل الودي عادةً 30 إلى 90 يومًا. قد تمتد الإجراءات القانونية من 6 إلى 18 شهرًا." },
        { q: "ما هي الرسوم التي تتقاضونها؟", a: "للديون التجارية المؤهلة، نعمل على أساس العمولة — لا استرداد، لا رسوم." },
        { q: "هل تتعاملون مع الديون الدولية؟", a: "نعم، نتخصص في استرداد الديون المستحقة من كيانات مغربية لدائنين دوليين." },
        { q: "ما المعلومات المطلوبة للبدء؟", a: "اسم المدين وموقعه والمبلغ المستحق والوثائق الداعمة كالفواتير أو العقود." },
        { q: "هل معلوماتي محفوظة بسرية؟", a: "بالتأكيد. يتم التعامل مع جميع المعلومات وفق بروتوكولات سرية صارمة." },
      ],
    },
    testimonials: {
      label: "شهادات العملاء", title: "ما يقوله عملاؤنا",
      items: [
        { name: "أنطوان مورو", company: "مورو وشركاه، ليون", text: "استرجعت HadiFlosCom ديناً بقيمة 45,000 يورو كنا قد استسلمنا منه. محترفون وسريعون.", stars: 5 },
        { name: "صوفي برنهارد", company: "Alpine Trade GmbH", text: "معرفتهم بالقانون المغربي كانت لا تقدر بثمن. العملية كلها كانت شفافة.", stars: 5 },
        { name: "كارلوس فيغا", company: "Vega Imports S.L.", text: "خدمة ممتازة. مهاراتهم في التفاوض حلّت النزاع دون محاكم.", stars: 5 },
      ],
    },
  },
};

const WHATSAPP_NUMBER = "212600000000";

const serviceIcons: Record<string, () => React.ReactNode> = {
  Handshake: Icons.Handshake,
  Scale: Icons.Scale,
  Search: Icons.Search,
  BarChart: Icons.BarChart,
  Shield: Icons.Shield,
  Building: Icons.Building,
};

const valueIcons: Record<string, () => React.ReactNode> = {
  Integrity: Icons.Integrity,
  Efficiency: Icons.Efficiency,
  Lock: Icons.Lock,
};

const stepIcons = [Icons.FileText, Icons.MagnifyingGlass, Icons.Bolt, Icons.CheckCircle];

const debtTypeMap: Record<string, string> = {
  "Commercial Debt": "commercial",
  "Invoice Unpaid": "invoice",
  "Loan Default": "loan",
  "Lease / Rent": "lease",
  "Other": "other",
  "Créance Commerciale": "commercial",
  "Facture Impayée": "invoice",
  "Défaut de Remboursement": "loan",
  "Loyer / Bail": "lease",
  "Autre": "other",
  "دين تجاري": "commercial",
  "فاتورة غير مسددة": "invoice",
  "تخلف عن السداد": "loan",
  "إيجار / عقد": "lease",
  "أخرى": "other",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #B8860B; --gold-mid: #C9962A; --gold-light: #E8B84B; --gold-pale: #FDF5E0; --gold-faint: #FFFBF0;
    --dark: #0D0D0D; --dark-2: #161410; --dark-3: #1E1A14;
    --text: #1C1C1C; --text-mid: #4A4540; --text-light: #7A736A;
    --white: #FFFFFF; --off-white: #FAFAF7; --border: #E6DDD0; --border-gold: rgba(184,134,11,0.25);
    --radius: 12px; --radius-lg: 20px; --nav-h: 68px;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--off-white); overflow-x: hidden; }
  [dir="rtl"] * { font-family: 'Noto Kufi Arabic', sans-serif; }

  .page { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(250,250,247,0.97); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border); height: var(--nav-h);
    padding: 0 2.5rem; display: flex; align-items: center; justify-content: space-between;
    transition: box-shadow 0.3s;
  }
  .nav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.07); }
  .nav-logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; cursor: pointer; }
  .nav-logo-img { height: 40px; width: 40px; object-fit: cover; border-radius: 50%; }
  .nav-logo-text strong { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 700; color: var(--dark); display: block; line-height: 1.1; }
  .nav-logo-text span { font-size: 0.6rem; letter-spacing: 0.18em; color: var(--gold); font-weight: 600; text-transform: uppercase; }
  .nav-links { display: flex; gap: 1.75rem; align-items: center; }
  .nav-links button {
    border: none; background: none; cursor: pointer; font-family: inherit;
    color: var(--text-mid); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.01em;
    transition: color 0.2s; position: relative; padding-bottom: 3px;
  }
  .nav-links button::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px; background: var(--gold); transform: scaleX(0); transition: transform 0.2s; transform-origin: left; }
  [dir="rtl"] .nav-links button::after { transform-origin: right; }
  .nav-links button:hover, .nav-links button.active { color: var(--gold); }
  .nav-links button:hover::after, .nav-links button.active::after { transform: scaleX(1); }
  .nav-right { display: flex; align-items: center; gap: 0.875rem; }
  .lang-switcher { display: flex; gap: 2px; background: var(--border); border-radius: 8px; padding: 3px; }
  .lang-btn { border: none; background: transparent; cursor: pointer; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; color: var(--text-light); letter-spacing: 0.04em; transition: all 0.15s; font-family: inherit; }
  .lang-btn.active { background: white; color: var(--gold); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .btn-cta { background: var(--gold); color: white; border: none; cursor: pointer; padding: 0.55rem 1.25rem; border-radius: 8px; font-size: 0.82rem; font-weight: 600; font-family: inherit; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s; white-space: nowrap; }
  .btn-cta:hover { background: var(--gold-mid); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(184,134,11,0.35); }
  .btn-cta svg { width: 14px; height: 14px; stroke: white; }

  .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; color: var(--dark); border-radius: 8px; transition: background 0.2s; }
  .hamburger:hover { background: var(--gold-pale); }
  .hamburger svg { width: 24px; height: 24px; }

  .mobile-menu-overlay {
    display: none; position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
    opacity: 0; transition: opacity 0.25s;
  }
  .mobile-menu-overlay.open { opacity: 1; }
  .mobile-menu {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 1001;
    width: min(320px, 88vw);
    background: var(--off-white); border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -8px 0 32px rgba(0,0,0,0.12);
  }
  [dir="rtl"] .mobile-menu { right: auto; left: 0; border-left: none; border-right: 1px solid var(--border); transform: translateX(-100%); }
  .mobile-menu.open { transform: translateX(0); }
  .mobile-menu-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); height: var(--nav-h); }
  .mobile-menu-close { background: none; border: none; cursor: pointer; padding: 6px; color: var(--text); border-radius: 8px; }
  .mobile-menu-close svg { width: 22px; height: 22px; }
  .mobile-menu-body { flex: 1; padding: 1.5rem 1.25rem; display: flex; flex-direction: column; gap: 0.25rem; overflow-y: auto; }
  .mobile-nav-btn { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; font-weight: 500; color: var(--text-mid); padding: 0.875rem 1rem; border-radius: 10px; text-align: left; width: 100%; transition: all 0.15s; display: flex; align-items: center; gap: 0.5rem; }
  [dir="rtl"] .mobile-nav-btn { text-align: right; }
  .mobile-nav-btn:hover, .mobile-nav-btn.active { background: var(--gold-pale); color: var(--gold); }
  .mobile-nav-btn.active { font-weight: 600; }
  .mobile-menu-footer { padding: 1.25rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.75rem; }
  .mobile-lang-row { display: flex; gap: 0.5rem; justify-content: center; }
  .mobile-cta { background: var(--gold); color: white; border: none; cursor: pointer; padding: 0.875rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; font-family: inherit; width: 100%; transition: all 0.2s; }
  .mobile-cta:hover { background: var(--gold-mid); }

  main { padding-top: var(--nav-h); min-height: 100vh; }

  .hero { min-height: calc(100vh - var(--nav-h)); position: relative; overflow: hidden; display: flex; flex-direction: column; background: #1a1206; }
  .hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80') center/cover no-repeat; opacity: 1; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(10,8,4,0.6) 0%, rgba(10,8,4,0.25) 55%, rgba(10,8,4,0.1) 100%); }
  .hero-content { position: relative; z-index: 2; flex: 1; max-width: 1280px; margin: 0 auto; padding: 5rem 2.5rem 4rem; width: 100%; display: flex; flex-direction: column; justify-content: center; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; border: 1px solid rgba(184,134,11,0.35); padding: 0.35rem 1rem; border-radius: 4px; color: var(--gold-light); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 2rem; background: rgba(184,134,11,0.07);width: fit-content;align-self: flex-start; }
  .hero-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-light); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  .hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 6.5vw, 6rem); font-weight: 600; line-height: 1.06; color: white; margin-bottom: 1.75rem; max-width: 700px; }
  [dir="rtl"] .hero h1 { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(2.2rem, 5vw, 4.5rem); }
  .hero h1 em { color: var(--gold-light); font-style: italic; }
  [dir="rtl"] .hero h1 em { font-style: normal; }
  .hero-desc { color: rgba(255,255,255,0.65); font-size: 1rem; font-weight: 300; max-width: 520px; line-height: 1.8; margin-bottom: 2.5rem; }
  .hero-actions { display: flex; gap: 0.875rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .hero-note { color: rgba(255,255,255,0.3); font-size: 0.75rem; font-style: italic; }

  .stats-strip { position: relative; z-index: 2; background: rgba(255,255,255,0.04); border-top: 1px solid rgba(184,134,11,0.18); }
  .stats-inner { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem; display: grid; grid-template-columns: repeat(4, 1fr); }
  .stat-item { padding: 1.75rem 1rem; text-align: center; border-right: 1px solid rgba(184,134,11,0.12); }
  .stat-item:last-child { border-right: none; }
  [dir="rtl"] .stat-item { border-right: none; border-left: 1px solid rgba(184,134,11,0.12); }
  [dir="rtl"] .stat-item:last-child { border-left: none; }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: var(--gold-light); line-height: 1; }
  .stat-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 0.35rem; letter-spacing: 0.05em; }

  .section { padding: 6.5rem 2.5rem; }
  .container { max-width: 1280px; margin: 0 auto; }
  .eyebrow { display: flex; align-items: center; gap: 0.875rem; justify-content: center; margin-bottom: 0.875rem; color: var(--gold); font-size: 0.7rem; letter-spacing: 0.2em; font-weight: 600; text-transform: uppercase; }
  .eyebrow::before, .eyebrow::after { content: ''; flex: 0 0 32px; height: 1px; background: var(--gold); }
  .eyebrow.left { justify-content: flex-start; }
  .eyebrow.left::before { display: none; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 600; text-align: center; color: var(--dark); line-height: 1.15; margin-bottom: 0.875rem; }
  [dir="rtl"] .section-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(1.7rem, 3vw, 2.4rem); }
  .section-title.light { color: white; }
  .section-title.left { text-align: left; }
  [dir="rtl"] .section-title.left { text-align: right; }
  .section-sub { text-align: center; color: var(--text-light); max-width: 580px; margin: 0 auto 4rem; line-height: 1.75; font-size: 0.925rem; }

  .btn-primary { background: var(--gold); color: white; border: none; cursor: pointer; padding: 0.85rem 1.75rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; font-family: inherit; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 20px rgba(184,134,11,0.35); transition: all 0.25s; }
  .btn-primary svg { width: 16px; height: 16px; stroke: white; }
  .btn-primary:hover { background: var(--gold-mid); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,134,11,0.45); }
  .btn-ghost { background: transparent; color: rgba(255,255,255,0.8); cursor: pointer; padding: 0.85rem 1.75rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; font-family: inherit; display: inline-flex; align-items: center; gap: 0.5rem; border: 1px solid rgba(255,255,255,0.25); transition: all 0.25s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.6); color: white; background: rgba(255,255,255,0.06); }
  .btn-ghost svg { width: 16px; height: 16px; stroke: rgba(255,255,255,0.8); }

  .services-bg { background: var(--white); }
  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .service-card { background: var(--off-white); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2.25rem 1.875rem; transition: all 0.3s; position: relative; overflow: hidden; }
  .service-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, var(--gold), var(--gold-light)); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
  [dir="rtl"] .service-card::after { transform-origin: right; }
  .service-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.07); border-color: var(--border-gold); }
  .service-card:hover::after { transform: scaleX(1); }
  .service-card.featured { background: linear-gradient(150deg, #16110a, #1f1608); border-color: rgba(184,134,11,0.3); }
  .service-card.featured .service-title { color: white; }
  .service-card.featured .service-desc { color: rgba(255,255,255,0.55); }
  .service-card.featured .service-link { color: var(--gold-light); }
  .service-icon-wrap { width: 50px; height: 50px; border-radius: 12px; background: var(--gold-pale); display: flex; align-items: center; justify-content: center; margin-bottom: 1.375rem; color: var(--gold); }
  .service-icon-wrap svg { width: 22px; height: 22px; }
  .service-card.featured .service-icon-wrap { background: rgba(184,134,11,0.15); }
  .service-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--dark); margin-bottom: 0.6rem; line-height: 1.25; }
  [dir="rtl"] .service-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 1.1rem; }
  .service-desc { color: var(--text-light); font-size: 0.875rem; line-height: 1.7; margin-bottom: 1.375rem; }
  .service-link { color: var(--gold); font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem; cursor: pointer; }
  .service-link svg { width: 14px; height: 14px; stroke: currentColor; }

  .banner { background: linear-gradient(135deg, #13100A, #1C1508); position: relative; overflow: hidden; padding: 5.5rem 2.5rem; text-align: center; }
  .banner::before { content: ''; position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80') center/cover; opacity: 0.1; }
  .banner-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 1; }
  .banner h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 600; color: white; margin-bottom: 0.75rem; }
  [dir="rtl"] .banner h2 { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); }
  .banner p { color: rgba(255,255,255,0.6); margin-bottom: 2.25rem; font-size: 0.95rem; line-height: 1.7; }

  .process-bg { background: var(--gold-faint); position: relative; overflow: hidden; }
  .process-bg::before { content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(90deg, rgba(184,134,11,0.04) 0, rgba(184,134,11,0.04) 1px, transparent 0, transparent 60px), repeating-linear-gradient(0deg, rgba(184,134,11,0.04) 0, rgba(184,134,11,0.04) 1px, transparent 0, transparent 60px); }
  .process-track { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; position: relative; margin-top: 1rem; }
  .process-track::before { content: ''; position: absolute; top: 32px; left: calc(12.5% + 32px); right: calc(12.5% + 32px); height: 1px; background: linear-gradient(to right, var(--gold), var(--gold-light)); opacity: 0.5; }
  .process-node { display: flex; flex-direction: column; align-items: center; }
  .process-circle { width: 64px; height: 64px; border-radius: 50%; border: 1.5px solid var(--gold); background: white; display: flex; align-items: center; justify-content: center; color: var(--gold); position: relative; margin-bottom: 2rem; box-shadow: 0 4px 16px rgba(184,134,11,0.1); }
  .process-circle svg { width: 24px; height: 24px; }
  .process-num { position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; border-radius: 50%; background: var(--gold); color: white; font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid var(--gold-faint); }
  .step-card { background: white; border-radius: var(--radius); padding: 1.875rem 1.5rem; text-align: center; border: 1px solid rgba(184,134,11,0.12); box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  .step-eyebrow { color: var(--gold); font-size: 0.65rem; letter-spacing: 0.18em; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; }
  .step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 700; color: var(--dark); margin-bottom: 0.625rem; }
  [dir="rtl"] .step-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 1rem; }
  .step-desc { color: var(--text-light); font-size: 0.84rem; line-height: 1.7; }

  .why-bg { background: var(--white); }
  .why-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
  .why-visual { position: relative; }
  .why-img { border-radius: var(--radius-lg); overflow: hidden; height: 480px; }
  .why-img img { width: 100%; height: 100%; object-fit: cover; }
  .why-accent { position: absolute; bottom: -18px; right: -18px; background: linear-gradient(135deg, var(--gold), var(--gold-light)); border-radius: var(--radius); padding: 1.25rem 1.625rem; text-align: center; box-shadow: 0 6px 24px rgba(184,134,11,0.35); }
  [dir="rtl"] .why-accent { right: auto; left: -18px; }
  .why-accent-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: white; line-height: 1; }
  .why-accent-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.8); margin-top: 0.2rem; }
  .why-text { padding: 1.5rem 0; }
  .why-desc { color: var(--text-light); line-height: 1.8; margin-bottom: 2rem; font-size: 0.925rem; }
  .why-list { list-style: none; display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 2.5rem; }
  .why-list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.9rem; color: var(--text); line-height: 1.55; }
  .check-circle { width: 20px; height: 20px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .check-circle svg { width: 10px; height: 10px; stroke: white; }

  .about-hero { background: linear-gradient(160deg, #0D0A06, #191208); padding: 5rem 2.5rem; text-align: center; }
  .about-text { color: rgba(255,255,255,0.6); max-width: 680px; margin: 0 auto 1.25rem; line-height: 1.85; font-size: 0.95rem; }
  .about-text em { color: rgba(255,255,255,0.82); font-family: 'Cormorant Garamond', serif; font-size: 1.05em; font-style: italic; }
  [dir="rtl"] .about-text em { font-style: normal; font-family: 'Noto Kufi Arabic', sans-serif; }
  .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 2rem; }
  .value-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(184,134,11,0.15); border-radius: var(--radius-lg); padding: 2.25rem 1.875rem; text-align: center; }
  .value-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(184,134,11,0.15); margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center; color: var(--gold-light); }
  .value-icon svg { width: 22px; height: 22px; }
  .value-card h3 { font-family: 'Cormorant Garamond', serif; color: white; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
  [dir="rtl"] .value-card h3 { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 1rem; }
  .value-card p { color: rgba(255,255,255,0.45); font-size: 0.84rem; line-height: 1.7; }
  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .team-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem 1.75rem; text-align: center; transition: all 0.25s; }
  .team-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: var(--border-gold); }
  .team-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-light)); margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: white; font-weight: 600; }
  .team-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--dark); margin-bottom: 0.25rem; }
  [dir="rtl"] .team-name { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 1.05rem; }
  .team-role { font-size: 0.75rem; color: var(--gold); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.875rem; }
  .team-desc { color: var(--text-light); font-size: 0.84rem; line-height: 1.65; }

  .faq-item { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 0.75rem; background: white; transition: border-color 0.2s; }
  .faq-item.open { border-color: var(--border-gold); }
  .faq-q { width: 100%; background: none; border: none; cursor: pointer; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; font-family: inherit; font-size: 0.95rem; font-weight: 600; color: var(--dark); text-align: left; gap: 1rem; }
  [dir="rtl"] .faq-q { text-align: right; }
  .faq-q svg { width: 18px; height: 18px; stroke: var(--gold); flex-shrink: 0; transition: transform 0.25s; }
  .faq-item.open .faq-q svg { transform: rotate(180deg); }
  .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.2s; }
  .faq-item.open .faq-a { max-height: 200px; }
  .faq-a-inner { padding: 0 1.5rem 1.25rem; color: var(--text-light); font-size: 0.875rem; line-height: 1.75; }

  .testimonials-bg { background: var(--gold-faint); }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .testimonial-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem 1.75rem; transition: all 0.25s; }
  .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: var(--border-gold); }
  .t-stars { display: flex; gap: 3px; margin-bottom: 1rem; }
  .t-stars svg { width: 14px; height: 14px; color: var(--gold-light); }
  .t-text { color: var(--text); font-size: 0.9rem; line-height: 1.75; margin-bottom: 1.25rem; font-style: italic; }
  .t-author { display: flex; flex-direction: column; gap: 0.15rem; }
  .t-name { font-weight: 600; font-size: 0.875rem; color: var(--dark); }
  .t-company { font-size: 0.78rem; color: var(--gold); }

  .contact-bg { background: var(--off-white); }
  .contact-layout { display: grid; grid-template-columns: 1fr 1.6fr; gap: 4.5rem; align-items: start; }
  .contact-info-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }
  [dir="rtl"] .contact-info-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 1.4rem; }
  .contact-info-desc { color: var(--text-light); font-size: 0.875rem; line-height: 1.75; margin-bottom: 1.75rem; }
  .contact-detail { display: flex; gap: 0.875rem; margin-bottom: 1.125rem; align-items: flex-start; }
  .detail-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--gold-pale); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); }
  .detail-icon svg { width: 17px; height: 17px; }
  .detail-lbl { font-size: 0.7rem; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.15rem; }
  .detail-val { color: var(--text); font-size: 0.875rem; }
  .hours-box { background: var(--dark); border-radius: var(--radius); padding: 1.125rem 1.375rem; margin-top: 1.5rem; }
  .hours-lbl { font-size: 0.7rem; font-weight: 600; color: var(--gold-light); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; }
  .hours-val { color: rgba(255,255,255,0.55); font-size: 0.84rem; line-height: 1.6; }
  .wa-pill { display: inline-flex; align-items: center; gap: 0.5rem; background: #22C55E; color: white; padding: 0.375rem 0.875rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; margin-top: 0.875rem; }
  .wa-pill svg { width: 14px; height: 14px; fill: white; }
  .contact-form-wrap { background: white; border-radius: var(--radius-lg); padding: 2.5rem; border: 1px solid var(--border); box-shadow: 0 2px 20px rgba(0,0,0,0.04); }
  .form-head { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--dark); margin-bottom: 1.5rem; }
  [dir="rtl"] .form-head { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 1.25rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .fgroup { margin-bottom: 1rem; }
  .flabel { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text); margin-bottom: 0.35rem; letter-spacing: 0.02em; }
  .flabel-req { color: var(--gold); }
  .fcontrol { width: 100%; padding: 0.65rem 0.875rem; border: 1.5px solid var(--border); border-radius: 8px; font-family: inherit; font-size: 0.85rem; color: var(--text); background: var(--off-white); transition: all 0.2s; outline: none; }
  .fcontrol:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(184,134,11,0.1); background: white; }
  .amount-wrap { display: flex; }
  .amount-wrap .fcontrol { border-radius: 8px 0 0 8px; }
  [dir="rtl"] .amount-wrap .fcontrol { border-radius: 0 8px 8px 0; }
  .amount-tag { background: var(--gold-pale); border: 1.5px solid var(--border); border-left: none; border-radius: 0 8px 8px 0; padding: 0 0.875rem; display: flex; align-items: center; color: var(--gold); font-weight: 700; font-size: 0.8rem; }
  [dir="rtl"] .amount-tag { border-left: 1.5px solid var(--border); border-right: none; border-radius: 8px 0 0 8px; }
  .fcheck { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 1.25rem; }
  .fcheck input { margin-top: 3px; accent-color: var(--gold); width: 14px; height: 14px; flex-shrink: 0; cursor: pointer; }
  .fcheck label { font-size: 0.78rem; color: var(--text-light); cursor: pointer; line-height: 1.5; }
  .btn-submit { width: 100%; background: var(--gold); color: white; border: none; cursor: pointer; padding: 0.85rem 2rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; font-family: inherit; box-shadow: 0 4px 16px rgba(184,134,11,0.3); transition: all 0.2s; }
  .btn-submit:hover { background: var(--gold-mid); transform: translateY(-1px); }
  .form-success { text-align: center; padding: 3.5rem 2rem; }
  .form-success-icon svg { width: 52px; height: 52px; stroke: #22C55E; stroke-width: 1.5; }
  .form-success p { color: var(--text-mid); font-size: 1rem; line-height: 1.7; margin-top: 1rem; }

  .page-hero { background: linear-gradient(135deg, #0D0A06, #1C1508); padding: 5rem 2.5rem 4rem; text-align: center; position: relative; overflow: hidden; }
  .page-hero::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 60px; background: linear-gradient(to bottom, transparent, var(--off-white)); }
  .page-hero-dark { background: linear-gradient(160deg, #0D0A06, #191208); }
  .page-hero-dark::after { background: linear-gradient(to bottom, transparent, #0D0A06); }
  .page-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 4.5vw, 3.5rem); font-weight: 600; color: white; margin-bottom: 1rem; }
  [dir="rtl"] .page-hero h1 { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(2rem, 4vw, 3rem); }
  .page-hero p { color: rgba(255,255,255,0.55); max-width: 560px; margin: 0 auto; line-height: 1.75; font-size: 0.95rem; }
  .breadcrumb { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.35); }
  .breadcrumb button { background: none; border: none; cursor: pointer; color: var(--gold-light); font-family: inherit; font-size: inherit; transition: color 0.2s; }
  .breadcrumb button:hover { color: var(--gold-light); text-decoration: underline; }
  .breadcrumb span { color: rgba(255,255,255,0.25); }

  footer { background: var(--dark); color: rgba(255,255,255,0.55); padding: 4.5rem 2.5rem 2rem; }
  .footer-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 4rem; margin-bottom: 3rem; }
  .footer-brand-desc { font-size: 0.84rem; line-height: 1.8; margin-top: 1rem; color: rgba(255,255,255,0.38); }
  .footer-col h4 { color: rgba(255,255,255,0.8); font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.625rem; }
  .footer-col button { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.42); font-family: inherit; font-size: 0.84rem; transition: color 0.2s; padding: 0; text-align: left; }
  [dir="rtl"] .footer-col button { text-align: right; }
  .footer-col button:hover { color: var(--gold-light); }
  .footer-col p { font-size: 0.84rem; line-height: 2; color: rgba(255,255,255,0.42); }
  .footer-bottom { max-width: 1280px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 1.5rem; text-align: center; font-size: 0.76rem; color: rgba(255,255,255,0.25); }
  .footer-admin-btn { color: rgba(255,255,255,0.2); background: none; border: none; cursor: pointer; font-size: 0.72rem; font-family: inherit; padding: 0; transition: color 0.2s; }
  .footer-admin-btn:hover { color: var(--gold); }

  .wa-float { position: fixed; bottom: 1.75rem; right: 1.75rem; width: 52px; height: 52px; border-radius: 50%; background: #22C55E; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(34,197,94,0.45); z-index: 998; transition: transform 0.2s, box-shadow 0.2s; border: none; text-decoration: none; }
  [dir="rtl"] .wa-float { right: auto; left: 1.75rem; }
  .wa-float svg { width: 26px; height: 26px; fill: white; }
  .wa-float:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(34,197,94,0.55); }

  .toast { position: fixed; top: 5rem; right: 2rem; z-index: 9999; background: var(--dark-3); color: white; padding: 0.875rem 1.375rem; border-radius: var(--radius); border-left: 3px solid var(--gold); box-shadow: 0 8px 32px rgba(0,0,0,0.25); animation: toastIn 0.25s ease; font-size: 0.875rem; max-width: 320px; }
  [dir="rtl"] .toast { right: auto; left: 2rem; border-left: none; border-right: 3px solid var(--gold); }
  @keyframes toastIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  @media (max-width: 960px) {
    .nav-links, .btn-cta { display: none; }
    .hamburger { display: flex; }
    .mobile-menu-overlay { display: block; pointer-events: none; }
    .mobile-menu-overlay.open { pointer-events: all; }
    .services-grid { grid-template-columns: 1fr 1fr; }
    .process-track { grid-template-columns: 1fr 1fr; }
    .process-track::before { display: none; }
    .why-layout, .contact-layout, .footer-grid { grid-template-columns: 1fr; }
    .values-grid, .testimonials-grid { grid-template-columns: 1fr; }
    .team-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  }
  @media (max-width: 640px) {
    .section { padding: 4rem 1.25rem; }
    .nav { padding: 0 1.25rem; }
    .hero-content { padding: 3rem 1.25rem 2rem; }
    .stats-inner { grid-template-columns: repeat(2, 1fr); }
    .services-grid, .process-track, .team-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .why-accent { right: 0; }
    .contact-form-wrap { padding: 1.5rem; }
    .page-hero { padding: 3.5rem 1.25rem 3rem; }
    .banner { padding: 3.5rem 1.25rem; }
  }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const LogoMark = () => (
  <img
    src={logo}
    alt="HadiFlosCom"
    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
  />
);

function Nav({ lang, setLang, page, setPage, t }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const pages: [PageId, string][] = [
    ["home", t.nav.home],
    ["services", t.nav.services],
    ["process", t.nav.process],
    ["why", t.nav.why],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];

  const go = (p: PageId) => { setPage(p); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => go("home")}>
          <LogoMark />
          <div className="nav-logo-text">
            <strong>HadiFlosCom</strong>
            <span>Debt Recovery</span>
          </div>
        </div>

        <div className="nav-links">
          {pages.map(([id, label]) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => go(id)}>{label}</button>
          ))}
        </div>

        <div className="nav-right">
          <div className="lang-switcher">
            {(["FR", "EN", "AR"] as Lang[]).map(l => (
              <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <button className="btn-cta" onClick={() => go("contact")}>
            <Icons.Claim /> {t.nav.cta}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icons.Menu />
          </button>
        </div>
      </nav>

      <div
        ref={overlayRef}
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} dir={t.dir}>
        <div className="mobile-menu-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <LogoMark />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--dark)" }}>HadiFlosCom</span>
          </div>
          <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}><Icons.X /></button>
        </div>
        <div className="mobile-menu-body">
          {pages.map(([id, label]) => (
            <button key={id} className={`mobile-nav-btn ${page === id ? "active" : ""}`} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="mobile-menu-footer">
          <div className="mobile-lang-row">
            {(["FR", "EN", "AR"] as Lang[]).map(l => (
              <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} style={{ flex: 1, textAlign: "center" }} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <button className="mobile-cta" onClick={() => go("contact")}>{t.nav.cta}</button>
        </div>
      </div>
    </>
  );
}

function Footer({ t, setPage }: FooterProps) {
  const go = (p: PageId) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const pages: [PageId, string][] = [
    ["home", t.nav.home],
    ["services", t.nav.services],
    ["process", t.nav.process],
    ["why", t.nav.why],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <LogoMark />
            <div className="nav-logo-text">
              <strong style={{ color: "white", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}>HadiFlosCom</strong>
            </div>
          </div>
          <p className="footer-brand-desc">Your trusted partner for debt recovery in Morocco — combining local expertise with international standards.</p>
        </div>
        <div className="footer-col">
          <h4>{t.footer.links}</h4>
          <ul>{pages.map(([id, lbl]) => <li key={id}><button onClick={() => go(id)}>{lbl}</button></li>)}</ul>
        </div>
        <div className="footer-col">
          <h4>{t.footer.contact}</h4>
          <p>Casablanca, Morocco<br />+212 5XX-XXXXXX<br />contact@hadiflouscom.ma<br />Mon – Fri: 9:00 – 18:00 (GMT+1)</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 HadiFlosCom. {t.footer.rights}
        {" · "}
        <button className="footer-admin-btn" onClick={() => window.location.href = "/admin"}>Admin</button>
      </div>
    </footer>
  );
}

function Breadcrumb({ t, current, setPage }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      <button onClick={() => { setPage("home"); window.scrollTo({ top: 0 }); }}>{t.nav.home}</button>
      <span>›</span>
      <span style={{ color: "rgba(255,255,255,0.6)" }}>{current}</span>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ t, setPage }: PageProps) {
  const go = (p: PageId) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow"><div className="hero-eyebrow-dot" />{t.hero.badge}</div>
          <h1>{t.hero.h1a}<br /><em>{t.hero.h1b}</em></h1>
          <p className="hero-desc">{t.hero.desc}</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => go("contact")}><Icons.Claim /> {t.hero.btn1}</button>
            <button className="btn-ghost" onClick={() => go("services")}>{t.hero.btn2} <Icons.ChevronDown /></button>
          </div>
          <div className="hero-note"><em>* {t.hero.note}</em></div>
        </div>
        <div className="stats-strip">
          <div className="stats-inner">
            {t.stats.map(([n, l]: [string, string]) => (
              <div key={l} className="stat-item">
                <div className="stat-num">{n}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section services-bg">
        <div className="container">
          <div className="eyebrow">{t.services.label}</div>
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-sub">{t.services.sub}</p>
          <div className="services-grid">
            {t.services.items.map((s: ServiceItem, i: number) => {
              const Ico = serviceIcons[s.icon] ?? Icons.Shield;
              return (
                <div key={i} className={`service-card ${i === 1 ? "featured" : ""}`}>
                  <div className="service-icon-wrap"><Ico /></div>
                  <div className="service-title">{s.title}</div>
                  <div className="service-desc">{s.desc}</div>
                  <div className="service-link" onClick={() => go("services")}>{t.services.learn} <Icons.ArrowRight /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="banner">
        <div className="banner-inner">
          <h2>{t.banner.h2}</h2>
          <p>{t.banner.p}</p>
          <button className="btn-primary" style={{ margin: "0 auto" }} onClick={() => go("contact")}>{t.banner.btn}</button>
        </div>
      </div>

      <section className="section testimonials-bg">
        <div className="container">
          <div className="eyebrow">{t.testimonials.label}</div>
          <h2 className="section-title">{t.testimonials.title}</h2>
          <p className="section-sub" style={{ marginBottom: "3rem" }}></p>
          <div className="testimonials-grid">
            {t.testimonials.items.map((item: TestimonialItem, i: number) => (
              <div key={i} className="testimonial-card">
                <div className="t-stars">{Array(item.stars).fill(0).map((_: number, j: number) => <Icons.Star key={j} />)}</div>
                <p className="t-text">"{item.text}"</p>
                <div className="t-author">
                  <span className="t-name">{item.name}</span>
                  <span className="t-company">{item.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-bg">
        <div className="container">
          <div className="why-layout">
            <div className="why-visual">
              <div className="why-img">
                <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900&q=80" alt="Moroccan business" />
              </div>
              <div className="why-accent">
                <div className="why-accent-num">87%</div>
                <div className="why-accent-lbl">{t.why.badge}</div>
              </div>
            </div>
            <div className="why-text">
              <div className="eyebrow left">{t.why.label}</div>
              <h2 className="section-title left">{t.why.title}</h2>
              <p className="why-desc">{t.why.desc}</p>
              <ul className="why-list">
                {t.why.points.map((p: string, i: number) => (
                  <li key={i}><span className="check-circle"><Icons.Check /></span>{p}</li>
                ))}
              </ul>
              <button className="btn-primary" onClick={() => go("contact")}>{t.why.btn} <Icons.ArrowRight /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicesPage({ t, setPage }: PageProps) {
  const go = (p: PageId) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="page">
      <div className="page-hero">
        <Breadcrumb t={t} current={t.nav.services} setPage={setPage} />
        <h1>{t.services.title}</h1>
        <p>{t.services.sub}</p>
      </div>
      <section className="section services-bg">
        <div className="container">
          <div className="services-grid">
            {t.services.items.map((s: ServiceItem, i: number) => {
              const Ico = serviceIcons[s.icon] ?? Icons.Shield;
              return (
                <div key={i} className={`service-card ${i === 1 ? "featured" : ""}`}>
                  <div className="service-icon-wrap"><Ico /></div>
                  <div className="service-title">{s.title}</div>
                  <div className="service-desc">{s.desc}</div>
                  <div className="service-link" onClick={() => go("contact")}>{t.services.learn} <Icons.ArrowRight /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className="banner">
        <div className="banner-inner">
          <h2>{t.banner.h2}</h2>
          <p>{t.banner.p}</p>
          <button className="btn-primary" style={{ margin: "0 auto" }} onClick={() => go("contact")}>{t.banner.btn}</button>
        </div>
      </div>
    </div>
  );
}

function ProcessPage({ t, setPage }: PageProps) {
  const go = (p: PageId) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="page">
      <div className="page-hero">
        <Breadcrumb t={t} current={t.nav.process} setPage={setPage} />
        <h1>{t.process.title}</h1>
        <p>{t.process.sub}</p>
      </div>
      <section className="section process-bg">
        <div className="container">
          <div className="process-track">
            {t.process.steps.map((s: StepItem, i: number) => {
              const Ico = stepIcons[i];
              return (
                <div key={i} className="process-node">
                  <div className="process-circle">
                    <Ico />
                    <span className="process-num">{i + 1}</span>
                  </div>
                  <div className="step-card" style={{ width: "100%" }}>
                    <div className="step-eyebrow">{s.label}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section services-bg">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="eyebrow">{t.faq.label}</div>
          <h2 className="section-title">{t.faq.title}</h2>
          <div style={{ marginTop: "3rem" }}>
            <FaqAccordion items={t.faq.items} />
          </div>
        </div>
      </section>

      <div className="banner">
        <div className="banner-inner">
          <h2>{t.banner.h2}</h2>
          <p>{t.banner.p}</p>
          <button className="btn-primary" style={{ margin: "0 auto" }} onClick={() => go("contact")}>{t.banner.btn}</button>
        </div>
      </div>
    </div>
  );
}

function WhyPage({ t, setPage }: PageProps) {
  const go = (p: PageId) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="page">
      <div className="page-hero">
        <Breadcrumb t={t} current={t.nav.why} setPage={setPage} />
        <h1>{t.why.title}</h1>
        <p>{t.why.desc}</p>
      </div>
      <section className="section why-bg">
        <div className="container">
          <div className="why-layout">
            <div className="why-visual">
              <div className="why-img">
                <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900&q=80" alt="Morocco" />
              </div>
              <div className="why-accent">
                <div className="why-accent-num">87%</div>
                <div className="why-accent-lbl">{t.why.badge}</div>
              </div>
            </div>
            <div className="why-text">
              <div className="eyebrow left">{t.why.label}</div>
              <h2 className="section-title left">{t.why.title}</h2>
              <p className="why-desc">{t.why.desc}</p>
              <ul className="why-list">
                {t.why.points.map((p: string, i: number) => (
                  <li key={i}><span className="check-circle"><Icons.Check /></span>{p}</li>
                ))}
              </ul>
              <button className="btn-primary" onClick={() => go("contact")}>{t.why.btn} <Icons.ArrowRight /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials-bg">
        <div className="container">
          <div className="eyebrow">{t.testimonials.label}</div>
          <h2 className="section-title">{t.testimonials.title}</h2>
          <div style={{ height: "3rem" }} />
          <div className="testimonials-grid">
            {t.testimonials.items.map((item: TestimonialItem, i: number) => (
              <div key={i} className="testimonial-card">
                <div className="t-stars">{Array(item.stars).fill(0).map((_: number, j: number) => <Icons.Star key={j} />)}</div>
                <p className="t-text">"{item.text}"</p>
                <div className="t-author">
                  <span className="t-name">{item.name}</span>
                  <span className="t-company">{item.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutPage({ t, setPage }: PageProps) {
  const go = (p: PageId) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="page">
      <div className="page-hero page-hero-dark" style={{ paddingBottom: "5rem" }}>
        <Breadcrumb t={t} current={t.nav.about} setPage={setPage} />
        <h1>{t.about.title}</h1>
        <p>{t.about.p1}</p>
      </div>

      <div style={{ background: "#0D0A06", padding: "0 2.5rem 5rem" }}>
        <div className="container">
          <div className="values-grid">
            {t.about.values.map((v: ValueItem, i: number) => {
              const Ico = valueIcons[v.icon] ?? Icons.Shield;
              return (
                <div key={i} className="value-card">
                  <div className="value-icon"><Ico /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="section services-bg">
        <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
          <div className="eyebrow">{t.about.label}</div>
          <h2 className="section-title">{t.about.title}</h2>
          <p style={{ color: "var(--text-light)", lineHeight: 1.85, fontSize: "0.95rem", margin: "1.5rem 0" }}>{t.about.p1}</p>
          <p style={{ color: "var(--text-light)", lineHeight: 1.85, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}>{t.about.p2}</p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--gold-faint)" }}>
        <div className="container">
          <div className="eyebrow">Team</div>
          <h2 className="section-title">Our Experts</h2>
          <p className="section-sub"></p>
          <div className="team-grid">
            {t.about.team.map((m: TeamMember, i: number) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{m.name[0]}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <div className="team-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="banner">
        <div className="banner-inner">
          <h2>{t.banner.h2}</h2>
          <p>{t.banner.p}</p>
          <button className="btn-primary" style={{ margin: "0 auto" }} onClick={() => go("contact")}>{t.banner.btn}</button>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {items.map((item: FaqItem, i: number) => (
        <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <Icons.ChevronDown />
          </button>
          <div className="faq-a">
            <div className="faq-a-inner">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  debtorName: string;
  debtorLocation: string;
  amount: string;
  debtType: string;
  description: string;
  language: string;
  agreed: boolean;
}

function ContactPage({ t }: { t: Translation }) {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "", company: "", email: "", phone: "",
    debtorName: "", debtorLocation: "", amount: "",
    debtType: "", description: "", language: "", agreed: false,
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const handleSubmit = async () => {
    if (!form.agreed) { showToast(t.contact.agreeReq); return; }
    if (!form.name || !form.email || !form.phone || !form.debtorName || !form.debtorLocation || !form.amount || !form.debtType || !form.description) {
      showToast(t.contact.req); return;
    }
    try {
      const res = await fetch("https://hadiflos.onrender.com/api/claims/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          company_name: form.company || "",
          email: form.email,
          phone: form.phone,
          debtor_name: form.debtorName,
          debtor_location: form.debtorLocation,
          amount_owed: parseFloat(form.amount),
          debt_type: debtTypeMap[form.debtType] ?? "other",
          description: form.description,
          preferred_language: "fr",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        showToast("✓ " + (data.reference_number || ""));
      } else {
        const firstErr = Object.values(data)[0];
        showToast(Array.isArray(firstErr) ? (firstErr as string[])[0] : String(firstErr));
      }
    } catch {
      showToast("Cannot reach server.");
    }
  };

  const contactDetails: [React.ReactNode, string, string][] = [    [<Icons.MapPin />, t.contact.address, "Casablanca, Morocco"],
    [<Icons.Phone />, t.contact.phone, "+212 5XX-XXXXXX"],
    [<Icons.Mail />, t.contact.email, "contact@hadiflouscom.ma"],
    [<Icons.Globe />, t.contact.languages, t.contact.langVal],
  ];

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}
      <div className="page-hero">
        <h1>{t.contact.title}</h1>
        <p>{t.contact.sub}</p>
      </div>
      <section className="section contact-bg">
        <div className="container">
          <div className="contact-layout">
            <div>
              <h3 className="contact-info-title">{t.contact.infoTitle}</h3>
              <p className="contact-info-desc">{t.contact.infoDesc}</p>
              {contactDetails.map(([icon, lbl, val], i) => (
                <div key={i} className="contact-detail">
                  <div className="detail-icon">{icon}</div>
                  <div><div className="detail-lbl">{lbl}</div><div className="detail-val">{val}</div></div>
                </div>
              ))}
              <div className="hours-box">
                <div className="hours-lbl">{t.contact.hours}</div>
                <div className="hours-val">{t.contact.hoursVal}</div>
                <div className="wa-pill"><Icons.Whatsapp />{t.contact.wa}</div>
              </div>
            </div>
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="form-success">
                  <div className="form-success-icon"><Icons.CheckCircle /></div>
                  <p>{t.contact.success}</p>
                </div>
              ) : (
                <>
                  <div className="form-head">{t.contact.formTitle}</div>
                  <div className="form-row">
                    <div className="fgroup"><label className="flabel">{t.contact.name} <span className="flabel-req">*</span></label><input className="fcontrol" placeholder={t.contact.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="fgroup"><label className="flabel">{t.contact.company}</label><input className="fcontrol" placeholder={t.contact.companyHint} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="fgroup"><label className="flabel">{t.contact.emailF} <span className="flabel-req">*</span></label><input className="fcontrol" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                    <div className="fgroup"><label className="flabel">{t.contact.phoneF} <span className="flabel-req">*</span></label><input className="fcontrol" placeholder="+212..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="fgroup"><label className="flabel">{t.contact.debtorName} <span className="flabel-req">*</span></label><input className="fcontrol" placeholder={t.contact.debtorNameHint} value={form.debtorName} onChange={e => setForm({ ...form, debtorName: e.target.value })} /></div>
                    <div className="fgroup"><label className="flabel">{t.contact.debtorLoc} <span className="flabel-req">*</span></label><input className="fcontrol" placeholder={t.contact.debtorLocHint} value={form.debtorLocation} onChange={e => setForm({ ...form, debtorLocation: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="fgroup">
                      <label className="flabel">{t.contact.amount} <span className="flabel-req">*</span></label>
                      <div className="amount-wrap">
                        <input className="fcontrol" type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                        <span className="amount-tag">MAD</span>
                      </div>
                    </div>
                    <div className="fgroup">
                      <label className="flabel">{t.contact.debtType} <span className="flabel-req">*</span></label>
                      <select className="fcontrol" value={form.debtType} onChange={e => setForm({ ...form, debtType: e.target.value })}>
                        <option value="">—</option>
                        {t.contact.debtTypes.map((d: string) => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fgroup">
                    <label className="flabel">{t.contact.desc} <span className="flabel-req">*</span></label>
                    <textarea className="fcontrol" rows={3} placeholder={t.contact.descHint} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <div className="fgroup">
                    <label className="flabel">{t.contact.prefLang}</label>
                    <select className="fcontrol" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                      <option>Français</option>
                      <option>English</option>
                      <option>العربية</option>
                    </select>
                  </div>
                  <div className="fcheck">
                    <input type="checkbox" id="agree" checked={form.agreed} onChange={e => setForm({ ...form, agreed: e.target.checked })} />
                    <label htmlFor="agree">{t.contact.agree} <span className="flabel-req">*</span></label>
                  </div>
                  <button className="btn-submit" onClick={handleSubmit}>{t.contact.submit}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("FR");
  const [page, setPage] = useState<PageId>("home");
  const t: Translation = T[lang];

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const pageMap: Record<PageId, React.ReactNode> = {
    home: <HomePage t={t} setPage={setPage} />,
    services: <ServicesPage t={t} setPage={setPage} />,
    process: <ProcessPage t={t} setPage={setPage} />,
    why: <WhyPage t={t} setPage={setPage} />,
    about: <AboutPage t={t} setPage={setPage} />,
    contact: <ContactPage t={t} />,
  };

  return (
    <div dir={t.dir}>
      <style>{styles}</style>
      <Nav lang={lang} setLang={setLang} page={page} setPage={setPage} t={t} />
      <main>{pageMap[page]}</main>
      <Footer t={t} setPage={setPage} />
      <a className="wa-float" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
        <Icons.Whatsapp />
      </a>
    </div>
  );
}