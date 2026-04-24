"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Lock,
  ShieldCheck,
  Smile,
  Star,
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  Music2,
  Video,
  Camera,
  Linkedin,
} from "lucide-react"

const PW = "ParseCode"
const SESSION_KEY = "anutta_unlocked"
const TOTAL = 8

/* ─── Slide 1 ─────────────────────────────────────────────────── */
function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-7 py-4">
      <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#C49A3A] bg-[#C49A3A]/10 px-4 py-2 rounded-full border border-[#C49A3A]/20">
        <Star className="h-3 w-3" />
        Personal Branding Strategy
      </span>
      <div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-[#2C2825] leading-none">
          Anutta
        </h1>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-[#D4715A] leading-none">
          Parse Code
        </h1>
        <p className="mt-3 text-xl text-[#8B7D72] font-light italic">The Smart &amp; Sexy Logic</p>
      </div>
      <p className="max-w-md text-[#8B7D72] text-base leading-relaxed">
        &ldquo;เพราะเรื่องยากๆ ไม่จำเป็นต้องน่าเบื่อ
        <br />
        และความฉลาดก็เซ็กซี่ได้&rdquo;
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {["32 Years Old", "Former Programmer", "Bank Governance & Compliance", "Software Logic & Regulatory Frameworks"].map(
          (tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white border border-[#EDE8E1] rounded-full text-sm text-[#5C5046] shadow-sm"
            >
              {tag}
            </span>
          )
        )}
      </div>
    </div>
  )
}

/* ─── Slide 2 ─────────────────────────────────────────────────── */
function Slide2() {
  return (
    <div className="space-y-7 py-4">
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#4A9BA8] mb-1">02 · Why You?</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C2825]">ทำไมโลกต้องมีคุณ?</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
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
        ].map(({ icon: Icon, label, color, bg, border, desc }) => (
          <div key={label} className="rounded-2xl p-5 border" style={{ background: bg, borderColor: border }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-xl p-1.5" style={{ background: `${color}25` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <p className="font-semibold text-[#2C2825] text-sm">{label}</p>
            </div>
            <p className="text-sm text-[#8B7D72] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 3 ─────────────────────────────────────────────────── */
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
    <div className="space-y-7 py-4">
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#D4715A] mb-1">03 · Content Strategy</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C2825]">Content Pillars</h2>
        <p className="mt-1 text-sm text-[#8B7D72]">แกนหลัก 3 หมวดที่จะสร้างแบรนด์ของคุณ</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map(({ icon: Icon, name, tagline, color, bg, border, items }) => (
          <div key={name} className="rounded-2xl p-5 border" style={{ background: bg, borderColor: border }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-xl p-2" style={{ background: `${color}20` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="font-bold text-sm text-[#2C2825]">{name}</p>
                <p className="text-xs" style={{ color }}>
                  {tagline}
                </p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#5C5046]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 4 ─────────────────────────────────────────────────── */
function Slide4() {
  const platforms = [
    {
      icon: Music2,
      name: "TikTok",
      color: "#2C2825",
      bg: "#F5F4F2",
      border: "#DDD8D0",
      strategy: 'คลิปสั้น 1 นาที "ย่อยดราม่า Tech"',
      format: "Viral · Short-form · Fashion Look",
    },
    {
      icon: Video,
      name: "Facebook / YouTube",
      color: "#D4715A",
      bg: "#FDF3F0",
      border: "#F0C9C0",
      strategy: '"อนุตตาพาคุย" เจาะลึก Compliance & อาชีพ',
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
    <div className="space-y-7 py-4">
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#4A9BA8] mb-1">04 · Distribution</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C2825]">Platform Strategy</h2>
        <p className="mt-1 text-sm text-[#8B7D72]">แผนการบุกโซเชียลแบบ Platform-Native</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map(({ icon: Icon, name, color, bg, border, strategy, format }) => (
          <div key={name} className="rounded-2xl p-5 border" style={{ background: bg, borderColor: border }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-xl p-1.5" style={{ background: `${color}20` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <p className="font-bold text-[#2C2825]">{name}</p>
            </div>
            <p className="text-sm text-[#5C5046] leading-relaxed mb-1.5">{strategy}</p>
            <p className="text-xs font-medium" style={{ color }}>
              {format}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 5 ─────────────────────────────────────────────────── */
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
    <div className="space-y-7 py-4">
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#C49A3A] mb-1">05 · Revenue</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C2825]">Monetization Blueprint</h2>
        <p className="mt-1 text-sm text-[#8B7D72]">แผนการสร้างเงินล้านแบบ Multi-tier</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiers.map(({ tier, name, color, bg, border, desc }) => (
          <div key={tier} className="rounded-2xl p-5 border" style={{ background: bg, borderColor: border }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color }}>
              {tier}
            </p>
            <p className="font-bold text-[#2C2825] text-base mb-1.5">{name}</p>
            <p className="text-sm text-[#8B7D72] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 6 ─────────────────────────────────────────────────── */
function Slide6() {
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
      points: ["ใช้เครื่องมือช่วยโพสต์อัตโนมัติ", "ระบบหลังบ้านที่ไม่กระทบงานประจำ", "Content Pipeline ที่ Scalable"],
    },
  ]

  return (
    <div className="space-y-7 py-4">
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#6B7FD4] mb-1">06 · Governance</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C2825]">Risk Management</h2>
        <p className="mt-1 text-sm text-[#8B7D72]">ส่วนที่คนทำ Governance ต้องไม่มองข้าม</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, color, bg, border, points }) => (
          <div key={title} className="rounded-2xl p-5 border" style={{ background: bg, borderColor: border }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-xl p-2" style={{ background: `${color}20` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <p className="font-bold text-[#2C2825] text-sm">{title}</p>
            </div>
            <ul className="space-y-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-[#5C5046]">
                  <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 7 ─────────────────────────────────────────────────── */
function Slide7() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-4">
      <div>
        <p className="text-xs font-medium tracking-widest uppercase text-[#C49A3A] mb-2">07 · The Vision</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-[#2C2825]">
          The <span className="text-[#C49A3A]">&ldquo;Million&rdquo;</span> Goal
        </h2>
        <p className="mt-2 text-[#8B7D72]">อาณาจักร Anutta Parse Code</p>
      </div>
      <div className="w-full max-w-lg space-y-3">
        {[
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
        ].map(({ phase, timeline, goal, color, bg, border }, i) => (
          <div
            key={phase}
            className="flex items-center gap-4 rounded-2xl p-4 border text-left"
            style={{ background: bg, borderColor: border }}
          >
            <div
              className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
              style={{ background: color }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-[#2C2825]">{phase}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                  {timeline}
                </span>
              </div>
              <p className="text-sm text-[#5C5046] mt-0.5">{goal}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[#8B7D72] text-sm italic max-w-sm">
        &ldquo;ทุก parse จบที่ result — คุณมี result ที่ชัดเจนแล้ว&rdquo;
      </p>
    </div>
  )
}

/* ─── Slide 8 ─────────────────────────────────────────────────── */
function Slide8() {
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
      desc: '"Hockey Stick" growth. Digital Products launch (Courses, Checklists).',
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
    <div className="space-y-7 py-4">
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#D4715A] mb-1">08 · Money Slide</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C2825]">Revenue &amp; Growth</h2>
        <p className="mt-1 text-sm text-[#8B7D72]">Projection at 1M Subscribers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Revenue Streams ── */}
        <div className="rounded-2xl border border-[#EDE8E1] bg-white p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="rounded-xl p-1.5 bg-[#FDF3F0] border border-[#F0C9C0]">
              <DollarSign className="h-4 w-4 text-[#D4715A]" />
            </div>
            <p className="font-bold text-[#2C2825] text-sm">Income Sources</p>
          </div>
          <div className="space-y-2.5">
            {streams.map(({ label, share, monthly, thb, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#5C5046] font-medium">{label}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color }}>{share}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#F5F4F2] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${share}%`, background: color }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[10px] text-[#BFB8B0]">{monthly}</span>
                  <span className="text-[10px] text-[#BFB8B0]">{thb}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#EDE8E1] rounded-xl bg-[#FDF8EE] px-3 py-2" style={{ border: "1px solid #E8D99A" }}>
            <p className="text-xs text-[#8B7D72]">Total Estimated</p>
            <p className="font-bold text-[#C49A3A] text-base">$61,000+ / month</p>
            <p className="text-xs text-[#8B7D72]">~2,000,000+ THB</p>
          </div>
        </div>

        {/* ── Growth Chart ── */}
        <div className="rounded-2xl border border-[#EDE8E1] bg-white p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="rounded-xl p-1.5 bg-[#F0F8F9] border border-[#B8DDE3]">
              <BarChart3 className="h-4 w-4 text-[#4A9BA8]" />
            </div>
            <p className="font-bold text-[#2C2825] text-sm">Revenue Growth</p>
          </div>
          {/* Bar chart */}
          <div className="flex items-end justify-around h-36 bg-[#FAF9F6] rounded-xl px-4 py-3 gap-4">
            {growth.map(({ year, label, height, color }) => (
              <div key={year} className="flex flex-col items-center gap-1 flex-1">
                <span
                  className="text-[10px] font-bold"
                  style={{ color }}
                >
                  {label}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${height}%`,
                    minHeight: "12px",
                    background: `linear-gradient(to top, ${color}, ${color}99)`,
                  }}
                />
                <span className="text-[10px] text-[#8B7D72] font-medium">{year}</span>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="space-y-2">
            {growth.map(({ year, label, color, desc }) => (
              <div key={year} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                <p className="text-xs text-[#8B7D72] leading-relaxed">
                  <span className="font-semibold text-[#5C5046]">{year} – {label}:</span> {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
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
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        next()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      }
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
            <h1 className="font-display text-xl font-bold text-[#2C2825]">Anutta Parse Code</h1>
            <p className="text-sm text-[#8B7D72] mt-1">Private presentation</p>
          </div>
          <form onSubmit={unlock} className="space-y-3">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setErr(false)
                }}
                placeholder="Password"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-[#2C2825] bg-[#FAF9F6] outline-none transition-all placeholder:text-[#BFB8B0] pr-10 ${
                  err
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-[#EDE8E1] focus:ring-2 focus:ring-[#D4715A]/20 focus:border-[#D4715A]"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BFB8B0] hover:text-[#8B7D72] transition-colors"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {err && <p className="text-xs text-red-400">Incorrect password. Try again.</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#D4715A] hover:bg-[#C4614A] active:bg-[#B45040] text-white py-3 text-sm font-medium transition-colors"
            >
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
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX
        if (diff > 50) next()
        else if (diff < -50) prev()
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E1] bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <span className="font-display text-sm font-semibold text-[#2C2825] tracking-wide">Anutta Parse Code</span>
        <span className="text-xs text-[#BFB8B0] tabular-nums font-mono">
          {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </header>

      {/* Slide content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl px-4 py-8 min-h-[calc(100vh-140px)] flex flex-col justify-center">
          <div key={current} style={{ animation: "fadeUp .3s ease-out both" }}>
            <SlideComponent />
          </div>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="py-5 px-6 border-t border-[#EDE8E1] bg-white/70 backdrop-blur-sm sticky bottom-0">
        {/* Progress dots */}
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
        {/* Arrow buttons */}
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
