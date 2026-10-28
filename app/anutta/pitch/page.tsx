"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
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
  type LucideIcon,
} from "lucide-react"
import {
  Burst,
  Caption,
  INK,
  Panel,
  RED_TEXT,
  Sticker,
  buttonClass,
  display,
  halftone,
  hardShadow,
  ink,
  lettering,
  lift,
  smallShadow,
  tilts,
} from "@/components/comic"
import { CountUp, useCountUp } from "@/components/comic-motion"

const PW = "passcode"
const SESSION_KEY = "anutta_unlocked"
const TOTAL = 8

/* ── Comic helpers ────────────────────────────────────────────── */

/** Bangers has no Thai glyphs, so any heading or label with Thai in it is set in the bold body font instead. */
const THAI = /[฀-๿]/
const fontFor = (text: string) => (THAI.test(text) ? "font-sans font-bold tracking-normal" : display)

/** A flat ink. Light-lettered inks (red, purple, black) carry white, outlined text; the rest carry black. */
type Tone = { bg: string; light?: boolean; dot?: string }
const RED: Tone = { bg: INK.red, light: true }
const PURPLE: Tone = { bg: INK.purple, light: true }
const BLACK: Tone = { bg: "#000", light: true, dot: "rgba(255,255,255,0.22)" }
const YELLOW: Tone = { bg: INK.yellow }
const CYAN: Tone = { bg: INK.cyan }

const dots = (dot = "rgba(0,0,0,0.14)") => halftone(dot, 6)

/** Panels pop onto the slide one after another, with a little overshoot. */
const popIn = "animate-in fade-in zoom-in-75 fill-mode-both duration-300 [animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:animate-none"
const popDelay = (i: number): CSSProperties => ({ animationDelay: `${150 + i * 90}ms` })

function SlideHeader({ step, color, title, sub }: { step: string; color: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <Caption className="-rotate-2">{step}</Caption>
      {THAI.test(title) ? (
        <h2 className={`mt-5 -rotate-1 bg-white px-4 py-2 font-sans text-3xl font-bold leading-snug tracking-normal md:text-5xl ${ink} ${hardShadow}`}>
          {title}
        </h2>
      ) : (
        <h2 className={`${display} mt-4 -rotate-1 text-5xl leading-[0.95] md:text-6xl`} style={{ ...lettering(2.5, 4), color }}>
          {title}
        </h2>
      )}
      {sub && <p className="mt-4 max-w-xl text-base font-bold text-black/70 md:text-lg">{sub}</p>}
    </div>
  )
}

/** A tilted comic panel: a dotted ink header with icon and label, white body underneath. */
function Card({
  index,
  tone,
  icon: Icon,
  label,
  badge,
  children,
}: {
  index: number
  tone: Tone
  icon?: LucideIcon
  label: string
  badge?: ReactNode
  children: ReactNode
}) {
  return (
    <div className={`h-full ${popIn}`} style={popDelay(index)}>
      <Panel className={`flex h-full flex-col ${tilts[index % tilts.length]} ${lift}`}>
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-[3px] border-black px-4 py-3"
          style={{ backgroundColor: tone.bg, ...dots(tone.dot) }}
        >
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-black bg-white shadow-[2px_2px_0_0_#000]">
              <Icon className="h-5 w-5" strokeWidth={2.5} />
            </span>
          )}
          {badge}
          <p
            className={`${fontFor(label)} min-w-0 text-2xl leading-none ${tone.light ? "text-white" : "text-black"}`}
            style={tone.light ? lettering(1.5, 2) : undefined}
          >
            {label}
          </p>
        </div>
        <div className="flex-1 p-4 md:p-5">{children}</div>
      </Panel>
    </div>
  )
}

/** A speech balloon. Its tail points up, or right (toward the photo) on wide screens. */
function Bubble({ children, tailRight = false, className = "" }: { children: ReactNode; tailRight?: boolean; className?: string }) {
  return (
    <div className={`relative rounded-[26px] bg-white px-5 py-4 text-black ${ink} ${hardShadow} ${className}`}>
      <span
        aria-hidden
        className={`absolute -top-[15px] left-12 h-7 w-7 rotate-45 border-l-[3px] border-t-[3px] border-black bg-white ${
          tailRight ? "md:-right-[15px] md:left-auto md:top-1/2 md:-mt-3.5 md:border-l-0 md:border-r-[3px]" : ""
        }`}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

/** A small inked square for list bullets, ticks and legend swatches. */
function Swatch({ color, className = "", children }: { color: string; className?: string; children?: ReactNode }) {
  return (
    <span className={`grid shrink-0 place-items-center border-2 border-black ${className}`} style={{ backgroundColor: color }}>
      {children}
    </span>
  )
}

function PanelTitle({ icon: Icon, color, children }: { icon: LucideIcon; color: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Swatch color={color} className="h-10 w-10 shadow-[2px_2px_0_0_#000]">
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </Swatch>
      <p className={`${display} text-2xl leading-none`}>{children}</p>
    </div>
  )
}

/* ─── Slide 1 · Identity ──────────────────────────────────────── */
function Slide1() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 py-4 md:grid-cols-2 md:gap-12">
      {/* Left — copy */}
      <div className="order-2 flex flex-col space-y-6 md:order-1">
        <Caption className="inline-flex w-fit -rotate-2 items-center gap-2">
          <Star className="h-3.5 w-3.5" fill="currentColor" />
          Personal Branding Strategy
        </Caption>
        <div>
          <h1 className={`${display} -rotate-2 text-6xl leading-[0.95] md:text-7xl`} style={{ ...lettering(3, 6), color: INK.yellow }}>
            Anutta
          </h1>
          <h1 className={`${display} -rotate-2 text-6xl leading-[0.95] md:text-7xl`} style={{ ...lettering(3, 6), color: INK.red }}>
            Parse Code
          </h1>
          <p className="mt-5 text-lg font-bold italic text-black/70 md:text-xl">The Smart &amp; Sexy Logic</p>
        </div>
        <Bubble tailRight>
          <p className="text-base font-bold leading-relaxed md:text-lg">
            &ldquo;เพราะเรื่องยากๆ ไม่จำเป็นต้องน่าเบื่อ
            <br />
            และความฉลาดก็เซ็กซี่ได้&rdquo;
          </p>
        </Bubble>
        <div className="flex flex-wrap gap-2.5">
          {["Experienced Programmer", "Bank Governance & Compliance", "Software Logic & Regulatory Frameworks"].map(
            (tag, i) => (
              <Sticker key={tag} color={[INK.cyan, INK.yellow, "#fff"][i]} className={`px-3 py-1 text-sm ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                {tag}
              </Sticker>
            )
          )}
        </div>
      </div>

      {/* Right — photo */}
      <div className="order-1 flex justify-center md:order-2 md:justify-end">
        <div className="relative mx-6 my-2">
          {/* Offset decorative frame */}
          <div aria-hidden className={`absolute inset-0 translate-x-4 translate-y-4 rotate-3 ${ink}`} style={{ backgroundColor: INK.cyan, ...dots("rgba(0,0,0,0.2)") }} />
          <div className={`relative h-72 w-56 -rotate-2 overflow-hidden bg-white sm:h-80 sm:w-64 md:h-96 md:w-72 ${ink} shadow-[8px_8px_0_0_#000]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/anutta.jpg"
              alt="Anutta Parse Code"
              className="w-full h-full object-cover object-[center_15%]"
            />
            {/* Name badge, on opaque stickers so it reads over any part of the photo */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <div className="flex flex-col items-start gap-1">
                <span className={`${display} border-[3px] border-black bg-[#FFD400] px-2 py-0.5 text-2xl leading-none text-black shadow-[2px_2px_0_0_#000]`}>
                  Anutta
                </span>
                <Sticker>Parse Code</Sticker>
              </div>
              <Sticker color="#000" className="tracking-widest text-white">
                2026
              </Sticker>
            </div>
          </div>
          <div aria-hidden className={`absolute -left-9 -top-9 w-24 sm:w-28 ${popIn}`} style={popDelay(3)}>
            <Burst text="WOW!" className="w-full" />
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
      tone: RED,
      desc: 'ตลาด Influencer มี "สายสวย" และ "สายความรู้" แต่ขาดคนที่เป็น "ทั้งสองอย่าง"',
    },
    {
      icon: TrendingUp,
      label: "The Opportunity",
      tone: CYAN,
      desc: "ผู้คนโหยหาการย่อยข้อมูล (Data Parsing) จากผู้เชี่ยวชาญตัวจริง",
    },
    {
      icon: Target,
      label: "The Hook",
      tone: YELLOW,
      desc: "ความสวยดึงสายตา · ความรู้ดึงใจ → High Retention Rate ที่คู่แข่งสร้างไม่ได้",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="02 · Why You?" color={INK.cyan} title="ทำไมโลกต้องมีคุณ?" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
        {cards.map(({ icon, label, tone, desc }, i) => (
          <Card key={label} index={i} tone={tone} icon={icon} label={label}>
            <p className="text-base leading-relaxed">{desc}</p>
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
      tone: CYAN,
      items: ["สอนเขียน Code", "รีวิว Gadget", "อัปเดตเทรนด์ AI / Tech"],
    },
    {
      icon: ShieldCheck,
      name: "Parse the Rule",
      tagline: "สาย Compliance",
      tone: PURPLE,
      items: ["ย่อยกฎหมายธนาคาร", "PDPA & Data Privacy", "การจัดการความเสี่ยงมิจฉาชีพ"],
    },
    {
      icon: Smile,
      name: "Parse the Life",
      tagline: "สาย ENFP",
      tone: RED,
      items: ["ไลฟ์สไตล์ผู้หญิงสร้างตัว", "ดูแลหุ่น & ความมั่นใจ", "Mindset การทำงาน"],
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="03 · Content Strategy" color={INK.red} title="Content Pillars" sub="แกนหลัก 3 หมวดที่จะสร้างแบรนด์ของคุณ" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
        {pillars.map(({ icon, name, tagline, tone, items }, i) => (
          <Card key={name} index={i} tone={tone} icon={icon} label={name}>
            <p className="mb-4">
              <Sticker color={INK.yellow} className="-rotate-1 px-2.5 text-sm">
                {tagline}
              </Sticker>
            </p>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-base">
                  <Swatch color={tone.bg} className="mt-1.5 h-3 w-3" />
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
      tone: BLACK,
      strategy: 'คลิปสั้น 1 นาที "ย่อยดราม่า Tech" ในลุคแฟชั่น',
      format: "Viral · Short-form · Fashion Look",
    },
    {
      icon: Video,
      name: "Facebook / YouTube",
      tone: RED,
      strategy: '"อนุตตาพาคุย" เจาะลึก Compliance & เส้นทางอาชีพ',
      format: "Long-form · In-depth · Trust-building",
    },
    {
      icon: Camera,
      name: "Instagram",
      tone: PURPLE,
      strategy: 'Visual Brand Image — "Smart Woman"',
      format: "Aesthetic · Photo · Brand Identity",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      tone: CYAN,
      strategy: "สร้างความน่าเชื่อถือวงการธุรกิจ / ธนาคาร",
      format: "B2B · Professional · Thought Leader",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="04 · Distribution" color={INK.cyan} title="Platform Strategy" sub="แผนการบุกโซเชียลแบบ Platform-Native" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        {platforms.map(({ icon, name, tone, strategy, format }, i) => (
          <Card key={name} index={i} tone={tone} icon={icon} label={name}>
            <p className="mb-3 text-base leading-relaxed">{strategy}</p>
            <p className="border-t-2 border-dashed border-black pt-2 text-sm font-bold text-black/70">{format}</p>
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
      tone: YELLOW,
      desc: "รับรีวิวสินค้า Tech, App การเงิน, และชุดว่ายน้ำ",
    },
    {
      tier: "Tier 2",
      name: "Knowledge Products",
      tone: CYAN,
      desc: 'คอร์สออนไลน์ "Compliance สำหรับคนไอที" และ Template บริหารจัดการข้อมูล',
    },
    {
      tier: "Tier 3",
      name: "Exclusive Community",
      tone: PURPLE,
      desc: "YouTube Membership / Patreon สำหรับ Content เบื้องหลังและคำปรึกษาพิเศษ",
    },
    {
      tier: "Tier 4",
      name: "Anutta Signature",
      tone: RED,
      desc: "แบรนด์สินค้าของตัวเอง — Ownership เต็มรูปแบบ",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="05 · Revenue" color={INK.yellow} title="Monetization Blueprint" sub="แผนการสร้างเงินล้านแบบ Multi-tier" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        {tiers.map(({ tier, name, tone, desc }, i) => (
          <Card
            key={tier}
            index={i}
            tone={tone}
            label={name}
            badge={<Sticker className="-rotate-2 text-xs uppercase tracking-widest">{tier}</Sticker>}
          >
            <p className="text-base leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 6 · Revenue & Growth ─────────────────────────────── */

/** One income stream: its share fills an inked bar, counting up as the slide lands. */
function StreamBar({ label, share, monthly, thb, color, delay }: { label: string; share: number; monthly: string; thb: string; color: string; delay: number }) {
  const n = useCountUp(share, 1100, delay)
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold">{label}</span>
        <span className={`${display} text-xl leading-none tabular-nums`}>{Math.round(n)}%</span>
      </div>
      <div className={`h-5 overflow-hidden bg-white ${ink}`}>
        <div className="h-full border-r-[3px] border-black" style={{ width: `${n}%`, backgroundColor: color, ...dots("rgba(0,0,0,0.18)") }} />
      </div>
      <div className="mt-1 flex justify-between text-xs font-bold tabular-nums text-black/60">
        <span>{monthly}</span>
        <span>{thb}</span>
      </div>
    </div>
  )
}

/** Height in px of the tallest (100%) growth bar. */
const BAR_MAX = 104

function GrowthBar({ label, height, color, delay }: { label: string; height: number; color: string; delay: number }) {
  const h = useCountUp(height, 1100, delay)
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <span className={`${display} text-center text-base leading-none`}>{label}</span>
      <div
        className="w-full max-w-[5rem] border-[3px] border-b-0 border-black"
        style={{ height: Math.max(14, (h / 100) * BAR_MAX), backgroundColor: color, ...dots("rgba(0,0,0,0.18)") }}
      />
    </div>
  )
}

function Slide6() {
  const streams = [
    { label: "Premium Sponsorships", share: 40, monthly: "$25,000+", thb: "800k+ THB", color: INK.red },
    { label: "Own Brand / Digital Products", share: 30, monthly: "$18,000+", thb: "600k+ THB", color: INK.yellow },
    { label: "Exclusive Memberships", share: 15, monthly: "$9,000+", thb: "300k+ THB", color: INK.purple },
    { label: "Affiliate Marketing", share: 10, monthly: "$6,000+", thb: "200k+ THB", color: INK.cyan },
    { label: "YouTube AdSense", share: 5, monthly: "$3,000+", thb: "100k+ THB", color: INK.green },
  ]

  const growth = [
    {
      year: "Year 1",
      label: "Foundation",
      height: 18,
      color: INK.cyan,
      desc: "Authority & Trust building. Small sponsors + AdSense.",
    },
    {
      year: "Year 2",
      label: "The Surge",
      height: 52,
      color: INK.yellow,
      desc: '"Hockey Stick" growth. Digital Products launch — Courses & Checklists.',
    },
    {
      year: "Year 3",
      label: "Empire",
      height: 100,
      color: INK.red,
      desc: "High-ticket consulting + Own Brand (Swimwear / Tech Accessories).",
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="06 · Money Slide" color={INK.green} title="Revenue &amp; Growth" sub="Projection at 1M Subscribers" />
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-6">
        {/* Income streams */}
        <div className={popIn} style={popDelay(0)}>
          <Panel className="h-full -rotate-[0.5deg] space-y-4 p-5 md:p-6">
            <PanelTitle icon={DollarSign} color={INK.yellow}>
              Income Sources
            </PanelTitle>
            <div className="space-y-3.5">
              {streams.map((s, i) => (
                <StreamBar key={s.label} {...s} delay={300 + i * 120} />
              ))}
            </div>
            <div className={`-rotate-1 px-4 py-3 ${ink} ${smallShadow}`} style={{ backgroundColor: INK.yellow, ...dots() }}>
              <p className="text-sm font-bold">Total Estimated Monthly</p>
              <p className={`${display} mt-1 text-3xl leading-none tabular-nums`}>
                $<CountUp value={61000} delay={300} />+ / month
              </p>
              <p className="mt-1 text-sm font-bold">~2,000,000+ THB</p>
            </div>
          </Panel>
        </div>

        {/* Growth chart */}
        <div className={popIn} style={popDelay(1)}>
          <Panel className="h-full rotate-[0.5deg] space-y-4 p-5 md:p-6">
            <PanelTitle icon={BarChart3} color={INK.cyan}>
              Revenue Growth
            </PanelTitle>
            <div className={`px-4 pt-4 ${ink}`} style={{ backgroundColor: INK.paper, ...halftone("rgba(0,0,0,0.1)", 7) }}>
              <div className="flex h-40 items-end justify-around gap-4 border-b-[3px] border-black">
                {growth.map(({ year, label, height, color }, i) => (
                  <GrowthBar key={year} label={label} height={height} color={color} delay={400 + i * 150} />
                ))}
              </div>
              <div className="flex justify-around gap-4 py-1.5">
                {growth.map(({ year }) => (
                  <span key={year} className="min-w-0 flex-1 text-center text-xs font-bold text-black/70">
                    {year}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              {growth.map(({ year, label, color, desc }) => (
                <div key={year} className="flex items-start gap-2.5">
                  <Swatch color={color} className="mt-1 h-3.5 w-3.5" />
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">{year} – {label}:</span> {desc}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
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
      tone: RED,
      points: [
        "จัดการ Digital Footprint อย่างมีสติ",
        "ภาพลักษณ์สอดคล้องกับจรรยาบรรณวิชาชีพ",
        "ยังคงเป็นตัวเองได้ 100%",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Compliance Check",
      tone: PURPLE,
      points: [
        "ระบบจัดการภาษีรายได้เสริมที่ถูกต้อง",
        "แยกบัญชีรายได้ Influencer ออกจากเงินเดือน",
        "เตรียมพร้อมก่อนลาออก",
      ],
    },
    {
      icon: Layers,
      title: "Automation",
      tone: CYAN,
      points: [
        "ใช้เครื่องมือช่วยโพสต์อัตโนมัติ",
        "ระบบหลังบ้านที่ไม่กระทบงานประจำ",
        "Content Pipeline ที่ Scalable",
      ],
    },
  ]

  return (
    <div className="py-4">
      <SlideHeader step="07 · Governance" color={INK.purple} title="Risk Management" sub="ส่วนที่คนทำ Governance ต้องไม่มองข้าม" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
        {items.map(({ icon, title, tone, points }, i) => (
          <Card key={title} index={i} tone={tone} icon={icon} label={title}>
            <ul className="space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-base">
                  <Swatch color={tone.bg} className="mt-0.5 h-5 w-5">
                    <Check className="h-3.5 w-3.5" strokeWidth={4} />
                  </Swatch>
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
      tone: CYAN,
    },
    {
      phase: "Phase 2",
      timeline: "ระยะกลาง",
      goal: "รายได้เสริม = เงินเดือนแบงก์",
      tone: RED,
    },
    {
      phase: "Phase 3",
      timeline: "เป้าหมายสูงสุด",
      goal: "1M Subscribers + อาณาจักร Anutta Parse Code เต็มตัว",
      tone: YELLOW,
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-4 text-center">
      <div className="flex flex-col items-center">
        <Caption className="-rotate-2">08 · The Vision</Caption>
        <h2 className={`${display} mt-4 -rotate-1 text-5xl leading-[0.95] md:text-7xl`} style={{ ...lettering(2.5, 4), color: INK.cyan }}>
          The <span style={{ color: INK.yellow }}>&ldquo;Million&rdquo;</span> Goal
        </h2>
        <p className="mt-4 text-base font-bold text-black/70 md:text-lg">อาณาจักร Anutta Parse Code</p>
      </div>
      <div className="w-full max-w-lg space-y-4">
        {phases.map(({ phase, timeline, goal, tone }, i) => (
          <div key={phase} className={popIn} style={popDelay(i)}>
            <Panel className={`flex items-center gap-4 p-4 text-left md:p-5 ${tilts[i % tilts.length]} ${lift}`}>
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${ink} ${smallShadow} ${display} text-2xl ${tone.light ? "text-white" : "text-black"}`}
                style={{ backgroundColor: tone.bg, ...(tone.light ? lettering(1.5, 2) : null) }}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <p className={`${display} text-2xl leading-none`}>{phase}</p>
                  <Sticker color={INK.yellow} className="-rotate-2 text-xs">
                    {timeline}
                  </Sticker>
                </div>
                <p className="text-base leading-snug">{goal}</p>
              </div>
            </Panel>
          </div>
        ))}
      </div>
      <div className={`max-w-sm ${popIn}`} style={popDelay(phases.length)}>
        <Bubble>
          <p className="text-base font-bold italic">&ldquo;ทุก parse จบที่ result — คุณมี result ที่ชัดเจนแล้ว&rdquo;</p>
        </Bubble>
      </div>
    </div>
  )
}

/* ─── Slide registry ───────────────────────────────────────────── */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8]

/* ─── Main page ────────────────────────────────────────────────── */
export default function AnuttaPage() {
  const [authed, setAuthed] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1"
  )
  const [input, setInput] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState(false)
  const [current, setCurrent] = useState(0)
  const touchX = useRef<number>(0)

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
      <div className="flex min-h-[100dvh] items-center justify-center overflow-x-clip p-4">
        <div className="w-full max-w-sm animate-in fade-in zoom-in-90 duration-500 [animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:animate-none">
          <Panel className="space-y-6 p-6 text-center sm:p-8">
            <div
              className={`mx-auto grid h-14 w-14 place-items-center bg-[#FFD400] ${ink} ${smallShadow} ${err ? "animate-wiggle motion-reduce:animate-none" : ""}`}
            >
              <Lock className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className={`${display} text-3xl leading-none sm:text-4xl`} style={{ ...lettering(2, 3), color: INK.red }}>
                Anutta Parse Code
              </h1>
              <p className="mt-2 text-sm font-bold text-black/70">Private presentation</p>
            </div>
            <form onSubmit={unlock} className="space-y-4">
              <div className="relative">
                <label htmlFor="anutta-passcode" className="sr-only">
                  Password
                </label>
                <input
                  id="anutta-passcode"
                  type={showPw ? "text" : "password"}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setErr(false) }}
                  placeholder="Password"
                  aria-invalid={err}
                  aria-describedby={err ? "anutta-passcode-error" : undefined}
                  className={`w-full border-[3px] bg-white px-4 py-3 pr-14 text-base font-bold text-black placeholder:font-normal placeholder:text-black/60 transition-[box-shadow] motion-reduce:transition-none focus:shadow-[5px_5px_0_0_#000] ${
                    err ? "border-[#E5221A] shadow-[3px_3px_0_0_#E5221A]" : `border-black ${smallShadow}`
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border-2 border-black bg-white transition-colors hover:bg-[#FFD400] motion-reduce:transition-none"
                >
                  {showPw ? <EyeOff className="h-4 w-4" strokeWidth={2.5} /> : <Eye className="h-4 w-4" strokeWidth={2.5} />}
                </button>
              </div>
              {err && (
                <p id="anutta-passcode-error" role="alert" className="text-sm font-bold" style={{ color: RED_TEXT }}>
                  Incorrect password. Try again.
                </p>
              )}
              <button type="submit" className={buttonClass("lg", "w-full bg-[#FF3B30] text-white")} style={lettering(1.5, 2)}>
                Unlock
              </button>
            </form>
          </Panel>
        </div>
      </div>
    )
  }

  /* ── Slide deck ── */
  return (
    <div
      className="flex min-h-screen select-none flex-col overflow-x-clip"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX
        if (diff > 50) next()
        else if (diff < -50) prev()
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-[3px] border-black bg-white px-4 py-3 md:px-6">
        <span className={`${display} text-xl leading-none md:text-2xl`}>Anutta Parse Code</span>
        <span className={`${display} border-2 border-black bg-[#FFD400] px-2 py-0.5 text-lg leading-none tabular-nums shadow-[2px_2px_0_0_#000]`}>
          {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </header>

      {/* Slide content */}
      <main className="flex-1">
        <div className="container mx-auto flex min-h-[calc(100vh-160px)] max-w-4xl flex-col justify-center px-4 py-10">
          <div key={current} className="animate-in fade-in zoom-in-95 duration-300 [animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:animate-none">
            <SlideComponent />
          </div>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="sticky bottom-0 z-20 border-t-[3px] border-black bg-white px-4 py-3 md:px-6">
        <div className="mb-3 flex justify-center gap-1">
          {Array.from({ length: TOTAL }, (_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === current ? "step" : undefined} className="group p-1">
              <span
                className={`block h-3.5 border-2 border-black transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                  i === current ? "w-8 bg-[#FF3B30]" : "w-3.5 bg-white group-hover:bg-[#FFD400]"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous slide"
            className={buttonClass("sm", "h-11 w-11 bg-[#FFD400] p-0 disabled:pointer-events-none disabled:opacity-40")}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          </button>
          <span className="hidden select-none text-xs font-bold text-black/60 sm:block">← → or Space to navigate</span>
          <button
            onClick={next}
            disabled={current === TOTAL - 1}
            aria-label="Next slide"
            className={buttonClass("sm", "h-11 w-11 bg-[#FFD400] p-0 disabled:pointer-events-none disabled:opacity-40")}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
      </footer>
    </div>
  )
}
