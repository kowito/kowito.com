"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Linkedin,
  Lock,
  Music2,
  ShieldCheck,
  Smile,
  Star,
  Target,
  TrendingUp,
  Video,
} from "lucide-react"

const PW = "passcode"
const SESSION_KEY = "anutta_unlocked"
const TOTAL = 8

/* ── Shared helpers ───────────────────────────────────────────── */
function SlideHeader({ step, accent, title, sub }: { step: string; accent: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-8">
      <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: accent }}>{step}</p>
      <h2 className="font-display text-3xl md:text-5xl font-bold text-[#1E1A17] leading-tight">{title}</h2>
      {sub && <p className="mt-2 text-base text-[#9B8E84]">{sub}</p>}
    </div>
  )
}

function Card({ bg, border, children, className = "" }: { bg: string; border: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border p-5 md:p-6 ${className}`} style={{ background: bg, borderColor: border }}>
      {children}
    </div>
  )
}

/* ─── Slide 1 · Identity ──────────────────────────────────────── */
function Slide1() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-4">
      {/* Left — copy */}
      <div className="flex flex-col space-y-6 order-2 md:order-1">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C49A3A] bg-[#C49A3A]/10 px-4 py-2 rounded-full border border-[#C49A3A]/25 w-fit">
          <Star className="h-3 w-3" />
          Personal Branding Strategy
        </span>
        <div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1E1A17] leading-none">
            Anutta
          </h1>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#D4715A] leading-none">
            Parse Code
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#9B8E84] font-light italic">The Smart &amp; Sexy Logic</p>
        </div>
        <p className="text-[#6B5F55] text-base leading-relaxed">
          &ldquo;เพราะเรื่องยากๆ ไม่จำเป็นต้องน่าเบื่อ
          <br />
          และความฉลาดก็เซ็กซี่ได้&rdquo;
        </p>
        <div className="flex flex-wrap gap-2">
          {["Experienced Programmer", "Bank Governance & Compliance", "Software Logic & Regulatory Frameworks"].map(
            (tag) => (
              <span key={tag} className="px-3 py-1.5 bg-white border border-[#E8E2DA] rounded-full text-sm text-[#5C5046] shadow-sm">
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      {/* Right — photo */}
      <div className="flex justify-center md:justify-end order-1 md:order-2">
        <div className="relative">
          {/* Offset decorative frame */}
          <div className="absolute inset-0 rounded-3xl border-2 border-[#D4715A]/25 translate-x-3 translate-y-3" />
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 rounded-3xl overflow-hidden shadow-xl border border-[#EDE8E1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/anutta.jpg"
              alt="Anutta Parse Code"
              className="w-full h-full object-cover object-[center_15%]"
            />
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2C1F18]/40 to-transparent" />
            {/* Name badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm font-display leading-tight drop-shadow">Anutta</p>
                <p className="text-[#F5C4A8] text-xs font-medium drop-shadow">Parse Code</p>
              </div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-white/80 bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Slide 2 · Why You? ──────────────────────────────────────── */
function Slide2() {
  const cards = [
    {
      icon: Globe,
      label: "The Gap",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
      desc: 'ตลาด Influencer มี "สายสวย" และ "สายความรู้" แต่ขาดคนที่เป็น "ทั้งสองอย่าง"',
    },
    {
      icon: TrendingUp,
      label: "The Opportunity",
      color: "#4A9BA8",
      bg: "#F0F8F9",
      border: "#B8DDE3",
      desc: "ผู้คนโหยหาการย่อยข้อมูล (Data Parsing) จากผู้เชี่ยวชาญตัวจริง",
    },
    {
      icon: Target,
      label: "The Hook",
      color: "#C49A3A",
      bg: "#FDF8EE",
      border: "#E8D99A",
      desc: "ความสวยดึงสายตา · ความรู้ดึงใจ → High Retention Rate ที่คู่แข่งสร้างไม่ได้",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="02 · Why You?" accent="#4A9BA8" title="ทำไมโลกต้องมีคุณ?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, label, color, bg, border, desc }) => (
          <Card key={label} bg={bg} border={border}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl p-2 shrink-0" style={{ background: `${color}25` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <p className="font-bold text-[#1E1A17]">{label}</p>
            </div>
            <p className="text-base text-[#6B5F55] leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 3 · Content Pillars ──────────────────────────────── */
function Slide3() {
  const pillars = [
    {
      icon: Code2,
      name: "Parse the Logic",
      tagline: "สาย Programmer",
      color: "#4A9BA8",
      bg: "#F0F8F9",
      border: "#B8DDE3",
      items: ["สอนเขียน Code", "รีวิว Gadget", "อัปเดตเทรนด์ AI / Tech"],
    },
    {
      icon: ShieldCheck,
      name: "Parse the Rule",
      tagline: "สาย Compliance",
      color: "#6B7FD4",
      bg: "#F2F3FC",
      border: "#C5CAF0",
      items: ["ย่อยกฎหมายธนาคาร", "PDPA & Data Privacy", "การจัดการความเสี่ยงมิจฉาชีพ"],
    },
    {
      icon: Smile,
      name: "Parse the Life",
      tagline: "สาย ENFP",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
      items: ["ไลฟ์สไตล์ผู้หญิงสร้างตัว", "ดูแลหุ่น & ความมั่นใจ", "Mindset การทำงาน"],
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="03 · Content Strategy" accent="#D4715A" title="Content Pillars" sub="แกนหลัก 3 หมวดที่จะสร้างแบรนด์ของคุณ" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map(({ icon: Icon, name, tagline, color, bg, border, items }) => (
          <Card key={name} bg={bg} border={border}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl p-2 shrink-0" style={{ background: `${color}20` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <p className="font-bold text-[#1E1A17]">{name}</p>
                <p className="text-sm font-medium" style={{ color }}>{tagline}</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-base text-[#6B5F55]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 4 · Platform Strategy ────────────────────────────── */
function Slide4() {
  const platforms = [
    {
      icon: Music2,
      name: "TikTok",
      color: "#2C2825",
      bg: "#F5F4F2",
      border: "#DDD8D0",
      strategy: 'คลิปสั้น 1 นาที "ย่อยดราม่า Tech" ในลุคแฟชั่น',
      format: "Viral · Short-form · Fashion Look",
    },
    {
      icon: Video,
      name: "Facebook / YouTube",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
      strategy: '"อนุตตาพาคุย" เจาะลึก Compliance & เส้นทางอาชีพ',
      format: "Long-form · In-depth · Trust-building",
    },
    {
      icon: Camera,
      name: "Instagram",
      color: "#B85D8E",
      bg: "#FBF1F7",
      border: "#ECC8DF",
      strategy: 'Visual Brand Image — "Smart Woman"',
      format: "Aesthetic · Photo · Brand Identity",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      color: "#4A9BA8",
      bg: "#F0F8F9",
      border: "#B8DDE3",
      strategy: "สร้างความน่าเชื่อถือวงการธุรกิจ / ธนาคาร",
      format: "B2B · Professional · Thought Leader",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="04 · Distribution" accent="#4A9BA8" title="Platform Strategy" sub="แผนการบุกโซเชียลแบบ Platform-Native" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map(({ icon: Icon, name, color, bg, border, strategy, format }) => (
          <Card key={name} bg={bg} border={border}>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-xl p-2 shrink-0" style={{ background: `${color}20` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <p className="font-bold text-[#1E1A17] text-base">{name}</p>
            </div>
            <p className="text-base text-[#6B5F55] leading-relaxed mb-2">{strategy}</p>
            <p className="text-sm font-semibold" style={{ color }}>{format}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 5 · Monetization Blueprint ───────────────────────── */
function Slide5() {
  const tiers = [
    {
      tier: "Tier 1",
      name: "Brand Deals",
      color: "#C49A3A",
      bg: "#FDF8EE",
      border: "#E8D99A",
      desc: "รับรีวิวสินค้า Tech, App การเงิน, และชุดว่ายน้ำ",
    },
    {
      tier: "Tier 2",
      name: "Knowledge Products",
      color: "#4A9BA8",
      bg: "#F0F8F9",
      border: "#B8DDE3",
      desc: 'คอร์สออนไลน์ "Compliance สำหรับคนไอที" และ Template บริหารจัดการข้อมูล',
    },
    {
      tier: "Tier 3",
      name: "Exclusive Community",
      color: "#B85D8E",
      bg: "#FBF1F7",
      border: "#ECC8DF",
      desc: "YouTube Membership / Patreon สำหรับ Content เบื้องหลังและคำปรึกษาพิเศษ",
    },
    {
      tier: "Tier 4",
      name: "Anutta Signature",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
      desc: "แบรนด์สินค้าของตัวเอง — Ownership เต็มรูปแบบ",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="05 · Revenue" accent="#C49A3A" title="Monetization Blueprint" sub="แผนการสร้างเงินล้านแบบ Multi-tier" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiers.map(({ tier, name, color, bg, border, desc }) => (
          <Card key={tier} bg={bg} border={border}>
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color }}>{tier}</p>
            <p className="font-bold text-[#1E1A17] text-lg mb-2">{name}</p>
            <p className="text-base text-[#6B5F55] leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 6 · Revenue & Growth ─────────────────────────────── */
function Slide6() {
  const streams = [
    { label: "Premium Sponsorships", share: 40, monthly: "$25,000+", thb: "800k+ THB", color: "#D4715A" },
    { label: "Own Brand / Digital Products", share: 30, monthly: "$18,000+", thb: "600k+ THB", color: "#C49A3A" },
    { label: "Exclusive Memberships", share: 15, monthly: "$9,000+", thb: "300k+ THB", color: "#B85D8E" },
    { label: "Affiliate Marketing", share: 10, monthly: "$6,000+", thb: "200k+ THB", color: "#4A9BA8" },
    { label: "YouTube AdSense", share: 5, monthly: "$3,000+", thb: "100k+ THB", color: "#6B7FD4" },
  ]

  const growth = [
    {
      year: "Year 1",
      label: "Foundation",
      height: 18,
      color: "#4A9BA8",
      desc: "Authority & Trust building. Small sponsors + AdSense.",
    },
    {
      year: "Year 2",
      label: "The Surge",
      height: 52,
      color: "#C49A3A",
      desc: '"Hockey Stick" growth. Digital Products launch — Courses & Checklists.',
    },
    {
      year: "Year 3",
      label: "Empire",
      height: 100,
      color: "#D4715A",
      desc: "High-ticket consulting + Own Brand (Swimwear / Tech Accessories).",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="06 · Money Slide" accent="#D4715A" title="Revenue &amp; Growth" sub="Projection at 1M Subscribers" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Income streams */}
        <div className="rounded-2xl border border-[#EDE8E1] bg-white p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-[#FDF3F0] border border-[#F0C9C0]">
              <DollarSign className="h-4 w-4 text-[#D4715A]" />
            </div>
            <p className="font-bold text-[#1E1A17]">Income Sources</p>
          </div>
          <div className="space-y-3.5">
            {streams.map(({ label, share, monthly, thb, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#5C5046] font-medium">{label}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color }}>{share}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#F0EDE8] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${share}%`, background: color }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#BFB8B0]">{monthly}</span>
                  <span className="text-xs text-[#BFB8B0]">{thb}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-4 py-3 mt-1" style={{ background: "#FDF8EE", border: "1px solid #E8D99A" }}>
            <p className="text-sm text-[#8B7D72]">Total Estimated Monthly</p>
            <p className="font-bold text-[#C49A3A] text-xl mt-0.5">$61,000+ / month</p>
            <p className="text-sm text-[#8B7D72]">~2,000,000+ THB</p>
          </div>
        </div>

        {/* Growth chart */}
        <div className="rounded-2xl border border-[#EDE8E1] bg-white p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-[#F0F8F9] border border-[#B8DDE3]">
              <BarChart3 className="h-4 w-4 text-[#4A9BA8]" />
            </div>
            <p className="font-bold text-[#1E1A17]">Revenue Growth</p>
          </div>
          <div className="flex items-end justify-around h-40 bg-[#FAF9F6] rounded-xl px-6 py-4 gap-4">
            {growth.map(({ year, label, height, color }) => (
              <div key={year} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-xs font-bold text-center leading-tight" style={{ color }}>{label}</span>
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${height}%`,
                    minHeight: "14px",
                    background: `linear-gradient(to top, ${color}, ${color}88)`,
                  }}
                />
                <span className="text-xs text-[#8B7D72] font-medium">{year}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            {growth.map(({ year, label, color, desc }) => (
              <div key={year} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                <p className="text-sm text-[#6B5F55] leading-relaxed">
                  <span className="font-bold text-[#3A3330]">{year} – {label}:</span> {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Slide 7 · Risk Management ──────────────────────────────── */
function Slide7() {
  const items = [
    {
      icon: AlertTriangle,
      title: "Privacy & Policy",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
      points: [
        "จัดการ Digital Footprint อย่างมีสติ",
        "ภาพลักษณ์สอดคล้องกับจรรยาบรรณวิชาชีพ",
        "ยังคงเป็นตัวเองได้ 100%",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Compliance Check",
      color: "#6B7FD4",
      bg: "#F2F3FC",
      border: "#C5CAF0",
      points: [
        "ระบบจัดการภาษีรายได้เสริมที่ถูกต้อง",
        "แยกบัญชีรายได้ Influencer ออกจากเงินเดือน",
        "เตรียมพร้อมก่อนลาออก",
      ],
    },
    {
      icon: Layers,
      title: "Automation",
      color: "#4A9BA8",
      bg: "#F0F8F9",
      border: "#B8DDE3",
      points: [
        "ใช้เครื่องมือช่วยโพสต์อัตโนมัติ",
        "ระบบหลังบ้านที่ไม่กระทบงานประจำ",
        "Content Pipeline ที่ Scalable",
      ],
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="07 · Governance" accent="#6B7FD4" title="Risk Management" sub="ส่วนที่คนทำ Governance ต้องไม่มองข้าม" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, color, bg, border, points }) => (
          <Card key={title} bg={bg} border={border}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl p-2 shrink-0" style={{ background: `${color}20` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <p className="font-bold text-[#1E1A17]">{title}</p>
            </div>
            <ul className="space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-base text-[#6B5F55]">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color }} />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 8 · The Million Goal ─────────────────────────────── */
function Slide8() {
  const phases = [
    {
      phase: "Phase 1",
      timeline: "6 เดือนแรก",
      goal: "สร้างฐานแฟนคลับ 100k",
      color: "#4A9BA8",
      bg: "#F0F8F9",
      border: "#B8DDE3",
    },
    {
      phase: "Phase 2",
      timeline: "ระยะกลาง",
      goal: "รายได้เสริม = เงินเดือนแบงก์",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
    },
    {
      phase: "Phase 3",
      timeline: "เป้าหมายสูงสุด",
      goal: "1M Subscribers + อาณาจักร Anutta Parse Code เต็มตัว",
      color: "#C49A3A",
      bg: "#FDF8EE",
      border: "#E8D99A",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C49A3A] mb-2">08 · The Vision</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-[#1E1A17]">
          The <span className="text-[#C49A3A]">&ldquo;Million&rdquo;</span> Goal
        </h2>
        <p className="mt-2 text-base text-[#9B8E84]">อาณาจักร Anutta Parse Code</p>
      </div>
      <div className="w-full max-w-lg space-y-3">
        {phases.map(({ phase, timeline, goal, color, bg, border }, i) => (
          <div
            key={phase}
            className="flex items-center gap-4 rounded-2xl p-5 border text-left"
            style={{ background: bg, borderColor: border }}
          >
            <div
              className="h-11 w-11 rounded-full shrink-0 flex items-center justify-center text-white font-bold"
              style={{ background: color }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-bold text-[#1E1A17]">{phase}</p>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: `${color}20`, color }}>
                  {timeline}
                </span>
              </div>
              <p className="text-base text-[#5C5046] leading-snug">{goal}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[#9B8E84] text-base italic max-w-sm">
        &ldquo;ทุก parse จบที่ result — คุณมี result ที่ชัดเจนแล้ว&rdquo;
      </p>
    </div>
  )
}

/* ─── Slide registry ───────────────────────────────────────────── */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8]

/* ─── Main page ────────────────────────────────────────────────── */
export default function AnuttaPage() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState(false)
  const [current, setCurrent] = useState(0)
  const touchX = useRef<number>(0)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true)
  }, [])

  function unlock(e: React.FormEvent) {
    e.preventDefault()
    if (input === PW) {
      sessionStorage.setItem(SESSION_KEY, "1")
      setAuthed(true)
    } else {
      setErr(true)
      setInput("")
    }
  }

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, TOTAL - 1)), [])
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), [])

  useEffect(() => {
    if (!authed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next() }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [authed, next, prev])

  const SlideComponent = SLIDES[current]

  /* ── Password gate ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-[#EDE8E1] shadow-sm p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#FDF3F0] border border-[#F0C9C0] flex items-center justify-center mx-auto">
            <Lock className="h-5 w-5 text-[#D4715A]" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-[#1E1A17]">Anutta Parse Code</h1>
            <p className="text-sm text-[#9B8E84] mt-1">Private presentation</p>
          </div>
          <form onSubmit={unlock} className="space-y-3">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={input}
                onChange={(e) => { setInput(e.target.value); setErr(false) }}
                placeholder="Password"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1E1A17] bg-[#FAF9F6] outline-none transition-all placeholder:text-[#BFB8B0] pr-10 ${
                  err ? "border-red-300 ring-2 ring-red-100" : "border-[#EDE8E1] focus:ring-2 focus:ring-[#D4715A]/20 focus:border-[#D4715A]"
                }`}
                autoFocus
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BFB8B0] hover:text-[#8B7D72] transition-colors">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {err && <p className="text-xs text-red-400">Incorrect password. Try again.</p>}
            <button type="submit" className="w-full rounded-xl bg-[#D4715A] hover:bg-[#C4614A] active:bg-[#B45040] text-white py-3 text-sm font-medium transition-colors">
              Unlock
            </button>
          </form>
        </div>
      </div>
    )
  }

  /* ── Slide deck ── */
  return (
    <div
      className="min-h-screen bg-[#FAF9F6] flex flex-col select-none"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX
        if (diff > 50) next()
        else if (diff < -50) prev()
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E1] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <span className="font-display text-sm font-semibold text-[#1E1A17] tracking-wide">Anutta Parse Code</span>
        <span className="text-xs text-[#BFB8B0] tabular-nums font-mono tracking-widest">
          {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </header>

      {/* Slide content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl px-4 py-10 min-h-[calc(100vh-140px)] flex flex-col justify-center">
          <div key={current} style={{ animation: "fadeUp .3s ease-out both" }}>
            <SlideComponent />
          </div>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="py-5 px-6 border-t border-[#EDE8E1] bg-white/80 backdrop-blur-sm sticky bottom-0">
        <div className="flex justify-center gap-1.5 mb-4">
          {Array.from({ length: TOTAL }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "20px" : "8px",
                height: "8px",
                background: i === current ? "#D4715A" : "#DDD8D0",
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="h-10 w-10 rounded-full border border-[#EDE8E1] bg-white flex items-center justify-center text-[#8B7D72] hover:border-[#D4715A] hover:text-[#D4715A] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-[#BFB8B0] hidden sm:block select-none">← → or Space to navigate</span>
          <button
            onClick={next}
            disabled={current === TOTAL - 1}
            className="h-10 w-10 rounded-full border border-[#EDE8E1] bg-white flex items-center justify-center text-[#8B7D72] hover:border-[#D4715A] hover:text-[#D4715A] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
