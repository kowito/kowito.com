"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Dumbbell, Footprints, Utensils, ChevronDown, Play, Check, Circle, ArrowRight } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "อก" | "หลัง" | "ไหล่" | "หลังแขน" | "หน้าแขน" | "ขา" | "ก้น" | "แกนกลาง" | "แขน"

type Exercise = {
  name: string
  machine: string
  altMachine?: string
  setup: string
  altSetup?: string
  sets: number
  reps: number | string
  tempo: string
  rest: string
  cues: string[]  // Changed to array for bullets
  muscle: Muscle
  weight?: string
  video?: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const mondayExercises: Exercise[] = [
  {
    name: "Lat Pulldown",
    machine: "Lat Pulldown Machine",
    altMachine: "Iso-Lateral High Row",
    setup: "นั่งตัวตรง ล็อกนวมต้นขาให้แน่น จับบาร์กว้างกว่าไหล่เล็กน้อย และเชิดอกก่อนเริ่มดึงลง",
    sets: 3,
    reps: "10–12",
    tempo: "ผ่อนกลับช้า 3 วิ ยืดหลังให้สุด",
    rest: "90 วินาที",
    cues: [
      "เชิดอกขึ้น",
      "กดข้อศอกลงหาเอว",
      "ไม่ใช้แรงแขนโกง",
      "ผ่อนกลับช้า 3 วินาที",
      "ยืดแผงหลังให้สุด"
    ],
    muscle: "หลัง",
    weight: "36 KG",
    video: "https://www.youtube.com/watch?v=bNmvKpJSWKM",
  },
  {
    name: "Incline Chest Press",
    machine: "Incline Chest Press Machine",
    altMachine: "Pec Fly Machine (ปรับเบาะต่ำ)",
    setup: "ปรับเบาะให้เฉียงขึ้น (30–45 องศา) หุบศอกลงมาเป็นรูปหัวลูกศร 45–60 องศา จับแคบลงให้ท่อนแขนตั้งฉาก ล็อกสะบักหลังจมเบาะแน่น ห้ามไหล่ลอย",
    sets: 2,
    reps: "8–10",
    tempo: "หุบศอก 45 องศา ตอนลงผ่อนช้า 3 วิ",
    rest: "90 วินาที",
    cues: [
      "เซ็ตที่ 1: ดร็อปเหลือ 30–35 KG จูนฟอร์ม",
      "เซ็ตที่ 2: ซัด 40 KG เต็มที่",
      "หุบศอก 45–60 องศา (ไม่กางเป็นตัว T)",
      "ล็อกสะบักจมเบาะ",
      "ผ่อนลงช้า 1...2...3..."
    ],
    muscle: "อก",
    weight: "35–45 KG",
    video: "https://www.youtube.com/shorts/98HWfiRonkE",
  },
  {
    name: "Seated Cable Row",
    machine: "Seated Cable Row",
    altMachine: "Chest-Supported Row Machine",
    setup: "นั่งตัวตรง ยืดอก ดึงบาร์เข้าหาชายโครงล่าง และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 3,
    reps: "10–12",
    tempo: "ดึง 1 วิ / ค้างบีบสะบัก 1 วิ / ผ่อน 3 วิ",
    rest: "90 วินาที",
    cues: [
      "นั่งตัวตรง ยืดอก",
      "ดึง 1 วิ",
      "ค้างบีบสะบัก 1 วิ",
      "ผ่อนกลับช้า 3 วิ",
      "ดึงไหล่ห่อให้เปิดผึ่งผาย"
    ],
    muscle: "หลัง",
    weight: "45–55 KG",
    video: "https://www.youtube.com/watch?v=LyZH4UGdDTc",
  },
  {
    name: "Shoulder Press",
    machine: "Shoulder Press Machine",
    altMachine: "Dumbbell Shoulder Press",
    setup: "สะโพกติดเบาะ ดันขึ้นตรง ๆ และไม่แอ่นหลัง ถ้าน้ำหนักหน่วงจนสั่นสะท้านให้คุมฟอร์มก่อนเสมอ",
    sets: 2,
    reps: "8–10",
    tempo: "นั่งพิงเบาะให้แน่น ผ่อนลงช้า 3 วิ เซฟข้อต่อ",
    rest: "90 วินาที",
    cues: [
      "นั่งพิงเบาะให้แน่น",
      "ดันขึ้นตรง ไม่แอ่นหลัง",
      "ผ่อนลงช้า 1...2...3...",
      "เซฟข้อต่อไหล่",
      "ถ้าสั่นให้ลดเหล็กทันที"
    ],
    muscle: "ไหล่",
    weight: "20–25 KG",
    video: "https://www.youtube.com/watch?v=6v4nrRVySj0",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "Leg Press",
    machine: "Leg Press & Calf Raise",
    altMachine: "Lying/Seated Leg Curl",
    setup: "วางเท้าสูงและกว้างบนแผ่นเท้า เกร็งท้องและตั้งลำตัวให้มั่นคงก่อนเริ่มดัน อย่าให้หัวเข่าโค้งเข้าหากัน",
    sets: 3,
    reps: "10–12",
    tempo: "ดันออก 1 วิ / ผ่อนกลับช้า ๆ นับ 1...2...3...",
    rest: "90 วินาที",
    cues: [
      "วางเท้าสูงและกว้าง",
      "เกร็งท้อง ตั้งลำตัวมั่น",
      "ดันออกคุมจังหวะ",
      "ผ่อนกลับช้า 1...2...3...",
      "No-Squat Edition เซฟหัวเข่า"
    ],
    muscle: "ขา",
    weight: "50 KG",
    video: "https://www.youtube.com/watch?v=L3B4nwqHufs",
  },
  {
    name: "Leg Extension",
    machine: "Leg Extension Machine",
    altMachine: "Horizontal Leg Press",
    setup: "ปรับพนักพิงให้หลังแนบเบาะ วางนวมเหนือข้อเท้าเล็กน้อย และตั้งเท้าให้หัวเข่าเคลื่อนในแนวตรง",
    sets: 3,
    reps: "12–15",
    tempo: "เตะสุดล็อกขาค้าง 1 วิ / ผ่อนลงช้า ๆ 3 วิ",
    rest: "90 วินาที",
    cues: [
      "เตะขึ้นสุดล็อกขา",
      "ค้างไว้ 1 วินาที",
      "ผ่อนลงช้า 3 วินาที",
      "สร้าง Time Under Tension",
      "แยกชิ้นหน้าขาให้ชัด"
    ],
    muscle: "ขา",
    weight: "32–40 KG",
    video: "https://www.youtube.com/shorts/iQ92TuvBqRo",
  },
  {
    name: "Hip Thrust",
    machine: "Smith Machine Hip Thrust",
    altMachine: "Cable Pull-Through",
    setup: "ลากม้านั่งมาให้รองสะบัก จัดโฟมที่สะโพกและพาดบาร์ตรงข้อพับสะโพกให้มั่นคงก่อนเริ่ม",
    sets: 2,
    reps: 15,
    tempo: "ดันสะโพกขึ้นสุด บีบก้นค้างไว้บนสุด 2 วินาทีเต็ม",
    rest: "60 วินาที",
    cues: [
      "ดันสะโพกขึ้นสุด",
      "บีบก้นค้างไว้ 2 วินาที",
      "สร้างก้นกระชับ"
    ],
    muscle: "ก้น",
    weight: "40 KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  {
    name: "Triceps Pushdown",
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัวและกดไหล่ลงก่อนเริ่ม เลือกน้ำหนักให้ครั้งที่ 8–10 เริ่มตึงมือจัดๆ",
    sets: 3,
    reps: "8–10",
    tempo: "ล็อกศอกนิ่ง ผ่อนกลับช้า 3 วิ (เซ็ตสุดท้ายทำ Partials ครึ่งล่าง 4-5 ครั้ง)",
    rest: "2–3 นาที",
    cues: [
      "ล็อกศอกข้างลำตัวนิ่งสนิท",
      "กดบีบหลังแขนให้แสบ",
      "ผ่อนกลับช้า 1...2...3...",
      "เซ็ตที่ 3: Partials ครึ่งล่าง 4–5 ครั้ง"
    ],
    muscle: "หลังแขน",
    weight: "36 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  {
    name: "Biceps Curl",
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 3,
    reps: "8–10",
    tempo: "ตรึงศอกห้ามเหวี่ยง ผ่อนกลับช้า 3 วิ (เซ็ตสุดท้ายทำ Partials ครึ่งล่าง 4-5 ครั้ง)",
    rest: "2–3 นาที",
    cues: [
      "ตรึงศอกข้างลำตัว",
      "ห้ามใช้แรงเหวี่ยง",
      "บีบเนื้อหน้าแขนแน่น",
      "ผ่อนกลับช้า 1...2...3...",
      "เซ็ตที่ 3: Partials ครึ่งล่าง 4–5 ครั้ง"
    ],
    muscle: "หน้าแขน",
    weight: "20 KG",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "Chest Press",
    machine: "Chest Press Machine",
    altMachine: "Pec Fly Machine",
    setup: "ปรับเบาะลงต่ำให้มือจับอยู่ระดับหัวนมพอดีเป๊ะ เชิดอกและบีบสะบักหลังกดจมติดเบาะแน่น",
    sets: 2,
    reps: 8,
    tempo: "ล็อกสะบักจมเบาะ ดันคม ๆ ผ่อนกลับช้า 3 วิ",
    rest: "90 วินาที",
    cues: [
      "ล็อกสะบักจมเบาะแน่น",
      "ดันคม ๆ เน้น ๆ",
      "ผ่อนกลับช้า 1...2...3...",
      "สร้างฐานอกหนาตัดขอบชัด"
    ],
    muscle: "อก",
    weight: "56 KG",
    video: "https://www.youtube.com/shorts/Qu7-ceCvq7w",
  },
  {
    name: "Seated Row",
    machine: "Seated Row Machine",
    altMachine: "Reverse Delt Fly",
    setup: "นั่งตัวตรง ยืดอก ดึงบาร์เข้าหาชายโครงล่าง และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 2,
    reps: 8,
    tempo: "คุมฟอร์มแน่น ๆ ไม่ใช้แรงเหวี่ยง ผ่อนกลับช้า 3 วิ",
    rest: "90 วินาที",
    cues: [
      "นั่งตัวตรง ยืดอก",
      "ดึงคุมฟอร์มแน่น ๆ",
      "บีบสะบักที่ปลายจังหวะ",
      "ไม่ใช้แรงเหวี่ยงลำตัว",
      "ผ่อนกลับช้า 1...2...3..."
    ],
    muscle: "หลัง",
    weight: "45–50 KG",
    video: "https://www.youtube.com/watch?v=LyZH4UGdDTc",
  },
  {
    name: "Triceps Pushdown",
    machine: "Cable Triceps Pushdown",
    altMachine: "Dumbbell Overhead Extension",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัว กดไหล่ลง เลือกน้ำหนักหนักจนครั้งที่ 8–10 ตึงมือ",
    sets: 3,
    reps: "8–10",
    tempo: "บีบเค้นหลังแขนให้แสบร้อน ตอนผ่อนกลับนับ 1...2...3...",
    rest: "2–3 นาที",
    cues: [
      "ล็อคศอกข้างลำตัว",
      "กดบีบหลังแขน",
      "ผ่อนกลับช้า 1...2...3...",
      "เซ็ตที่ 3: Partials ครึ่งล่าง 4–5 ครั้ง"
    ],
    muscle: "หลังแขน",
    weight: "32 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  {
    name: "Biceps Curl",
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Hammer Curl",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 3,
    reps: "8–10",
    tempo: "ม้วนบีบเนื้อหน้าแขนแน่น ผ่อนกลับนับ 1...2...3...",
    rest: "2–3 นาที",
    cues: [
      "ตรึงศอก ม้วนบีบแน่น",
      "ผ่อนกลับช้า 1...2...3...",
      "เซ็ตที่ 3: Partials ครึ่งล่าง 4–5 ครั้ง"
    ],
    muscle: "หน้าแขน",
    weight: "20–25 KG",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
]



const globalRules = [
  { topic: "ความหนัก", rule: "เซ็ตตรงคุณภาพ 100% ครั้งที่ 8–10 ต้องยังคุมฟอร์มได้และเหลือแรงสำรองแค่ RIR 1–2" },
  { topic: "เวลาพัก", rule: "ห้ามเร่ง พักเต็ม 2–3 นาทีในท่าแขน และพักตามที่กำหนดในท่าหลักทุกเซ็ต" },
  { topic: "ก่อนเข้ายิม", rule: "ก่อนซ้อม 1.5–2 ชั่วโมง ซัดข้าวสวย 1 ทัพพีเล็ก หรือขนมปังขาว 1 แผ่นเพื่อเติมไกลโคเจน ห้ามคาร์บระหว่างยา" },
  { topic: "ระหว่างซ้อม", rule: "พกเครื่องดื่มที่มีน้ำตาลไว้จิบเล็ก ๆ ระหว่างพักยาวเพื่อเลี้ยงพลังงานให้ระบบประสาทไม่ตก" },
  { topic: "หลังซ้อม (จุดเปลี่ยน)", rule: "นั่งพัก 15–20 นาทีให้ร่างกายเย็นลง ค่อยดื่มเวย์ BAAM 1.5 ช้อน + น้ำเปล่าเย็นจัด (ตัดนมโอ๊ตทิ้ง 100%) หรือนมอัลมอนด์/นมพิสตาชิโอ Unsweetened เพื่อป้องกันอินซูลินพุ่ง" },
  { topic: "ครีเอทีน", rule: "กิน 3–5g ทุกวันสม่ำเสมอ ตอนไหนก็ได้ (ไม่ต้องซิ้งกับมื้อออกกำลังกาย) ผสมรวมในเวย์ BAAM หรือน้ำเปล่าได้เลย ความสม่ำเสมอคือกุญแจ" },
  { topic: "โปรตีน", rule: "เป้าหมายโปรตีนทั้งวัน: 1.6–2.0g ต่อ kg น้ำหนักตัว กินให้ครบทุกวัน เพื่อซ่อมแซมและสร้างกล้ามเนื้อ" },
  { topic: "น้ำดื่ม", rule: "ดันขึ้นไปให้ได้ 3.5–4.5 ลิตรต่อวัน ทุกวัน เพื่อใช้เป็นพาหนะหลักในการขนส่งไขมันพุง" },
  { topic: "ความถี่การฝึก", rule: "ฝึก 3 วันต่อสัปดาห์ วันพักระหว่างเซสชันคือเวลาฟื้นตัวจริงของกล้าม" },
  { topic: "คาร์ดิโอ", rule: "เดินลู่ปรับชัน 5–8% หลังเวท ความเร็ว 3.5–3.8 กม./ชม. ไม่จับบาร์ เพื่อบังคับแกนกลาง" },
]

const weekOverview = [
  { label: "จันทร์", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "อังคาร", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "พุธ", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "พฤหัส", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "ศุกร์", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "เสาร์", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "อาทิตย์", tag: "⚡เครื่อง", style: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
]

// ─── Components ──────────────────────────────────────────────────────────────

function ExerciseRow({
  ex,
  status,
  isActive,
  onTap,
  completedSets,
  onToggleSet,
}: {
  ex: Exercise
  status: "completed" | "active" | "remaining"
  isActive: boolean
  onTap: () => void
  completedSets: boolean[]
  onToggleSet: (setIndex: number) => void
}) {
  const [showMore, setShowMore] = React.useState(false)

  const StatusIcon = status === "completed" ? Check : status === "active" ? ArrowRight : Circle
  const statusColor =
    status === "completed"
      ? "text-emerald-500"
      : status === "active"
        ? "text-blue-400"
        : "text-gray-700"

  return (
    <div className="border-b border-gray-800/50 last:border-0">
      {/* Compact list item - always visible */}
      <button
        onClick={onTap}
        className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
          isActive ? "bg-blue-950/30" : "hover:bg-gray-800/30"
        }`}
      >
        <StatusIcon className={`h-4 w-4 shrink-0 ${statusColor}`} />
        <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-white">{ex.name}</span>
          {!isActive && ex.weight && (
            <span className="text-xs text-gray-600 tabular-nums">{ex.weight}</span>
          )}
        </div>
      </button>

      {/* Expanded card - only for active exercise */}
      {isActive && (
        <div className="px-4 pb-4 space-y-3">
          {/* Big numbers - what you need NOW */}
          <div className="space-y-0.5">
            {ex.weight && (
              <div className="text-3xl font-bold text-blue-400 tabular-nums">{ex.weight}</div>
            )}
            <div className="text-base text-white">
              {ex.sets}×{ex.reps} <span className="text-gray-500">• Rest {ex.rest}</span>
            </div>
          </div>

          {/* Set tracking checkboxes */}
          <div className="flex gap-2">
            {Array.from({ length: ex.sets }).map((_, i) => (
              <button
                key={i}
                onClick={() => onToggleSet(i)}
                className={`flex-1 py-2 text-xs font-medium border rounded transition-all ${
                  completedSets[i]
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-gray-700 text-gray-500 hover:border-emerald-500/50"
                }`}
              >
                {completedSets[i] ? "✓" : ""} Set {i + 1}
              </button>
            ))}
          </div>

          {/* Technique - compact bullets */}
          <div className="space-y-1">
            <div className="text-xs text-gray-600">Tips</div>
            {ex.cues.slice(0, 3).map((cue, i) => (
              <div key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                <span>{cue}</span>
              </div>
            ))}
          </div>

          {/* More section - collapsed by default */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 pt-1"
          >
            More
            <ChevronDown className={`h-3 w-3 transition-transform ${showMore ? "rotate-180" : ""}`} />
          </button>

          {showMore && (
            <div className="space-y-2 text-xs text-gray-500 pt-1">
              <div>
                <span className="text-gray-600">Machine:</span> {ex.machine}
              </div>
              {ex.altMachine && (
                <div>
                  <span className="text-gray-600">Alternative:</span> {ex.altMachine}
                </div>
              )}
              {ex.video && (
                <a
                  href={ex.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  Video
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
  // Track active exercise for each day
  const [activeMonday, setActiveMonday] = React.useState(0)
  const [activeWednesday, setActiveWednesday] = React.useState(0)
  const [activeFriday, setActiveFriday] = React.useState(0)

  // Track completed sets [exerciseIndex][setIndex]
  const [mondaySets, setMondaySets] = React.useState<boolean[][]>(
    mondayExercises.map((ex) => Array(ex.sets).fill(false))
  )
  const [wednesdaySets, setWednesdaySets] = React.useState<boolean[][]>(
    wednesdayExercises.map((ex) => Array(ex.sets).fill(false))
  )
  const [fridaySets, setFridaySets] = React.useState<boolean[][]>(
    fridayExercises.map((ex) => Array(ex.sets).fill(false))
  )

  const toggleSet = (
    day: "monday" | "wednesday" | "friday",
    exerciseIndex: number,
    setIndex: number
  ) => {
    if (day === "monday") {
      setMondaySets((prev) => {
        const newSets = [...prev]
        newSets[exerciseIndex] = [...newSets[exerciseIndex]]
        newSets[exerciseIndex][setIndex] = !newSets[exerciseIndex][setIndex]
        return newSets
      })
    } else if (day === "wednesday") {
      setWednesdaySets((prev) => {
        const newSets = [...prev]
        newSets[exerciseIndex] = [...newSets[exerciseIndex]]
        newSets[exerciseIndex][setIndex] = !newSets[exerciseIndex][setIndex]
        return newSets
      })
    } else {
      setFridaySets((prev) => {
        const newSets = [...prev]
        newSets[exerciseIndex] = [...newSets[exerciseIndex]]
        newSets[exerciseIndex][setIndex] = !newSets[exerciseIndex][setIndex]
        return newSets
      })
    }
  }

  const getStatus = (
    exerciseIndex: number,
    activeIndex: number,
    completedSets: boolean[]
  ): "completed" | "active" | "remaining" => {
    if (exerciseIndex < activeIndex) return "completed"
    if (exerciseIndex === activeIndex) {
      if (completedSets.every((s) => s)) return "completed"
      return "active"
    }
    return "remaining"
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="container mx-auto max-w-2xl px-4 pt-6 pb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          Kowit C.
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/diet" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <Utensils className="h-3.5 w-3.5" />
            แผนอาหาร
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 pb-24 space-y-10">

        {/* Heading */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="h-4 w-4 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-semibold text-white">แผนฝึก — Recomp Edition (Flexible Machine Version)</h1>
          </div>
          <p className="text-sm text-gray-500 pl-6">ฝึก 3×/สัปดาห์ · No-Squat Edition · Plan B ทุกท่า · เดินลู่ไม่จับบาร์</p>
        </div>

        {/* Week strip */}
        <div className="flex gap-1.5">
          {weekOverview.map(({ label, tag, style }) => (
            <div key={label} className={`flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 flex-1 ${style}`}>
              <span className="text-[11px] font-semibold">{label}</span>
              <span className="text-[9px] opacity-50">{tag}</span>
            </div>
          ))}
        </div>

        {/* ── Monday ── */}
        <section>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">จันทร์</span>
            <h2 className="text-base font-semibold text-white">Workout A · อก + หลัง + ไหล่</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20">
            {mondayExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name}
                ex={ex}
                status={getStatus(i, activeMonday, mondaySets[i])}
                isActive={i === activeMonday}
                onTap={() => setActiveMonday(i)}
                completedSets={mondaySets[i]}
                onToggleSet={(setIndex) => toggleSet("monday", i, setIndex)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>เดินลู่ชัน 6–8% · 15–20 นาที · 3.8 กม./ชม. · ไม่จับบาร์</span>
          </div>
        </section>

        {/* ── Tue divider ── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest shrink-0">อังคาร</span>
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 shrink-0">พักแอคทีฟ · ยืดเหยียด 20 นาที</span>
        </div>

        {/* ── Wednesday ── */}
        <section>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">พุธ</span>
            <h2 className="text-base font-semibold text-white">Workout B · ขา + แขน</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20">
            {wednesdayExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name}
                ex={ex}
                status={getStatus(i, activeWednesday, wednesdaySets[i])}
                isActive={i === activeWednesday}
                onTap={() => setActiveWednesday(i)}
                completedSets={wednesdaySets[i]}
                onToggleSet={(setIndex) => toggleSet("wednesday", i, setIndex)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>เดินลู่ชัน 6–8% · 15–20 นาที · 3.8 กม./ชม. · ไม่จับบาร์ (ปรับเวลาเพิ่มขึ้นตามสูตรเร่งรีดไขมันช่องท้อง)</span>
          </div>
        </section>

        {/* ── Thu divider ── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest shrink-0">พฤหัส</span>
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 shrink-0">พักเต็มที่ · เวย์ BAAM + นมอัลมอนด์</span>
        </div>

        {/* ── Friday ── */}
        <section>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">ศุกร์</span>
            <h2 className="text-base font-semibold text-white">Workout C · บนกระชับ + แขน</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20">
            {fridayExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name}
                ex={ex}
                status={getStatus(i, activeFriday, fridaySets[i])}
                isActive={i === activeFriday}
                onTap={() => setActiveFriday(i)}
                completedSets={fridaySets[i]}
                onToggleSet={(setIndex) => toggleSet("friday", i, setIndex)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>เดินลู่ชัน 6–8% · 15–20 นาที · 3.8 กม./ชม. · ไม่จับบาร์</span>
          </div>
        </section>

        {/* ── Sat/Sun divider ── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest shrink-0">เสาร์–อาทิตย์</span>
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 shrink-0">เสาร์: พักเต็มที่ · อาทิตย์: ⚡ EMSculpt Neo + พักเวทเต็มระบบ</span>
        </div>

        {/* ── Ab & Back Machine Bonus ── */}
        <section className="border-2 border-dashed border-violet-500/30 rounded-xl p-4 bg-violet-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">🛠️ อาวุธเสริมพิเศษ</span>
            <h2 className="text-base font-semibold text-white">Ab & Back Machine</h2>
          </div>
          <div className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
            <p>
              <span className="font-semibold text-violet-300">💡 วิธีใช้โบนัส:</span>{" "}
              วันไหนที่พี่กูรู้สึกว่ายังมีแรงเหลือเฟือหลังเวทเสร็จ หรือใน{" "}
              <span className="font-semibold text-sky-300">&ldquo;วันอังคารที่เป็นวันพักแอคทีฟ&rdquo;</span>{" "}
              พี่สามารถเดินไปเล่นเครื่องนี้เพิ่มได้ครับ
            </p>
            <div className="flex items-start gap-2 bg-gray-900/40 rounded-lg p-3 border border-gray-800">
              <span className="text-[10px] text-amber-400 font-semibold shrink-0 mt-0.5">ท่า:</span>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-gray-300">
                  <span className="font-semibold">Ab Crunch</span> (พับตัวไปข้างหน้า)
                </p>
                <p className="text-xs text-gray-500">
                  2 เซ็ต × 15 ครั้ง · โฟกัสเกร็งหน้าท้องลึก · เพิ่มแรงดันกล้ามเนื้อแกนกลางลำตัวหน้าท้อง
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Nutrition ── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">โภชนาการ + ฟื้นตัว</h2>
          <div className="space-y-3">
            {globalRules.map(({ topic, rule }) => (
              <div key={topic} className="flex gap-3">
                <span className="text-xs text-violet-400 font-medium shrink-0 w-28 pt-0.5">{topic}</span>
                <p className="text-sm text-gray-400 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Techniques ── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">3 เทคนิคหลัก</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 w-28 pt-0.5">Eccentric 3s</span>
              <p className="text-sm text-gray-400 leading-relaxed">ผ่อนน้ำหนักลงช้า 1...2...3... ทุกครั้ง เพิ่ม Time Under Tension และ Metabolic Stress</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-bold text-amber-400 shrink-0 w-28 pt-0.5">Double Prog.</span>
              <p className="text-sm text-gray-400 leading-relaxed">ตรึง 32 KG จนทำได้ 10 ครั้งเต็มทุกเซ็ต แล้วค่อยขึ้น 1–2 แผ่น</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-bold text-pink-400 shrink-0 w-28 pt-0.5">Leng. Partials</span>
              <p className="text-sm text-gray-400 leading-relaxed">เซ็ตสุดท้ายท่าแขน: ยกเต็มไม่ไหวแล้วปั๊มต่ออีก 4–5 ครั้งในช่วงครึ่งล่าง</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
