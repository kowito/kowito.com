import Link from "next/link"
import { ArrowLeft, Dumbbell, Footprints, Utensils } from "lucide-react"
import type { ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "อก" | "หลัง" | "ไหล่" | "หลังแขน" | "หน้าแขน" | "ขา" | "ก้น" | "แกนกลาง" | "แขน"
type DayType = "train" | "rest" | "optional" | "special"

type Exercise = {
  name: string
  machine: string
  setup: string
  sets: number
  reps: number | string
  tempo: string
  rest: string
  cue: string
  muscle: Muscle
}

type Stretch = {
  name: string
  how: string
  duration: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const mondayExercises: Exercise[] = [
  {
    name: "Chest Press",
    machine: "Multi-Press",
    setup: "ปรับเบาะให้มือจับอยู่ระดับกลางอก พิงหลังชิดเบาะเต็มแผ่น วางเท้าราบกับพื้นและเก็บสะบักลงก่อนเริ่มดัน",
    sets: 3, reps: 8,
    tempo: "ดัน 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "2 นาที",
    cue: "เพิ่มเป็น 3 เซ็ตเพื่อสะสมเนื้ออก ดันเป็นเส้นตรง คุมไหล่ให้นิ่ง พักครบ 2 นาทีก่อนเซ็ตถัดไปทุกครั้ง",
    muscle: "อก",
  },
  {
    name: "Lat Pulldown",
    machine: "Cable Combo - High Pulley",
    setup: "ล็อกนวมต้นขาให้แน่น จับบาร์กว้างกว่าไหล่เล็กน้อย นั่งให้ลำตัวตั้งตรงและเชิดอกก่อนเริ่มดึงลง",
    sets: 3, reps: 8,
    tempo: "ดึง 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "2 นาที",
    cue: "ดึงบาร์ลงหาอกส่วนบนโดยไม่เหวี่ยงลำตัว คุมทางขึ้นช้าๆ ให้หลังเป็นคนทำงานหลัก พักเต็ม 2 นาที",
    muscle: "หลัง",
  },
  {
    name: "Smith Machine Squat",
    machine: "Smith Machine",
    setup: "วางบาร์บนบ่าด้านหลัง ก้าวเท้าไปข้างหน้าเล็กน้อย เกร็งท้องและตั้งลำตัวให้มั่นคงก่อนเริ่มย่อ",
    sets: 3, reps: "8–10",
    tempo: "ย่อลงช้า / ดันขึ้นตรง",
    rest: "90 วินาที",
    cue: "ใช้ท่านี้คุมแรงช่วงล่าง ให้ส้นเท้ากดพื้นและลำตัวนิ่งตลอดเซ็ต",
    muscle: "ขา",
  },
  {
    name: "Cable Triceps Pushdown",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัวและกดไหล่ลงก่อนเริ่ม เลือกน้ำหนักที่ครั้งที่ 8–10 เริ่มตึงมือจัดๆ",
    sets: 5, reps: "8–10",
    tempo: "บีบลง / คุมกลับ",
    rest: "2 นาที",
    cue: "เล่นเซ็ตตรง 5 เซ็ตเต็ม เลือกน้ำหนักหนักจนครั้งที่ 8–10 ตึงมือ แล้วพักครบ 2 นาทีก่อนเซ็ตถัดไปทุกครั้ง ไม่มี mini-set ไม่มี Myo-Reps",
    muscle: "หลังแขน",
  },
  {
    name: "Cable Biceps Curl",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 4, reps: "8–10",
    tempo: "คุมขึ้น / คุมลง",
    rest: "2 นาที",
    cue: "ม้วนดึงบาร์ขึ้นบีบหน้าแขนเน้นๆ ที่ด้านบน ตรึงศอกไม่ให้ขยับ เล่นเซ็ตตรง 4 เซ็ต พักเต็ม 2 นาทีทุกเซ็ต",
    muscle: "หน้าแขน",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "Lat Pulldown",
    machine: "Cable Combo - High Pulley",
    setup: "นั่งใต้ที่ล็อกต้นขา จับบาร์ยาวกว้างกว่าไหล่เล็กน้อย ตั้งอกขึ้น เก็บคาง และเตรียมดึงลงด้วยหลังไม่ใช่แขน",
    sets: 4, reps: "10–12",
    tempo: "ดึงคุมจังหวะ / กลับช้า",
    rest: "90 วินาที",
    cue: "คุมจังหวะให้เนียน ดึงด้วยหลังให้ศอกกดลงข้างลำตัว เน้นจังหวะปล่อยกลับช้าๆ อย่าโยนตัวช่วย",
    muscle: "หลัง",
  },
  {
    name: "Chest Press",
    machine: "Multi-Press - Chest Height",
    setup: "ปรับเบาะให้มือจับอยู่ระดับกลางหน้าอก พิงหลังชิดเบาะเต็มแผ่น แล้ววางเท้าทั้งสองข้างให้มั่นคงก่อนเริ่ม",
    sets: 3, reps: "8–10",
    tempo: "ดันลื่นไหล / กลับอย่างควบคุม",
    rest: "90 วินาที",
    cue: "ดันออกตรงๆ ข้อศอกไม่กางมากเกินไป เก็บไหล่ลงตลอด เลือกน้ำหนักที่นิ่งตั้งแต่ครั้งแรกจนจบเซ็ต",
    muscle: "อก",
  },
  {
    name: "Seated Row",
    machine: "Cable Combo - Low Pulley",
    setup: "นั่งตัวตรง ยืดอก ฝ่าเท้ากดกับที่พัก เข่าผ่อนเล็กน้อย และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 4, reps: "10–12",
    tempo: "ดึง 1 วินาที / ค้างบีบสะบัก 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "90 วินาที",
    cue: "ดึงเข้าหาชายโครงแล้วเกร็งบีบสะบักเข้าหากันแน่นๆ ค้างไว้ 1 วินาทีเต็มทุกครั้ง ท่านี้ดึงโครงไหล่ที่ตกให้ตั้งตรงผึ่งผาย",
    muscle: "หลัง",
  },
  {
    name: "Shoulder Press",
    machine: "Multi-Press - Incline Press",
    setup: "ยกเบาะและพนักพิงให้มือจับเริ่มที่ระดับไหล่ เก็บซี่โครงลง สะโพกติดเบาะ และให้ข้อศอกอยู่ใต้มือจับก่อนดันขึ้น",
    sets: 3, reps: "8–10",
    tempo: "ดันขึ้น / กลับช้าๆ",
    rest: "90 วินาที",
    cue: "ดันมือจับขึ้นตรงๆ โดยไม่แอ่นหลัง ถ้าทางดันสั่นหรือคุมลงไม่ได้ ให้ลดน้ำหนักลงทันที",
    muscle: "ไหล่",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "Chest Press",
    machine: "Multi-Press",
    setup: "ใช้เบาะระดับอกเหมือนวันจันทร์ ปรับตำแหน่งมือจับให้สอดคล้องกับกลางหน้าอก พิงหลังเต็มแผ่นและคุมไหล่ให้นิ่ง",
    sets: 3, reps: 8,
    tempo: "ดัน 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "90 วินาที",
    cue: "อุ่นเครื่องช่วงบนก่อนลงช่วงล่าง ดันให้คมและนิ่ง ใช้น้ำหนักที่คุมฟอร์มได้ตลอด 3 เซ็ต",
    muscle: "อก",
  },
  {
    name: "Seated Row",
    machine: "Cable Combo - Low Pulley",
    setup: "นั่งตัวตรง พิงอกกับแผ่นรอง วางเท้าบนที่พัก แล้วดึงโดยเริ่มจากสะบักก่อนแขนทุกครั้ง",
    sets: 3, reps: 8,
    tempo: "ดึง 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "90 วินาที",
    cue: "ดึงแน่นและคุมฟอร์ม อย่าเหวี่ยงตัว บีบสะบักที่ปลายการเคลื่อนไหวทุกครั้ง",
    muscle: "หลัง",
  },
  {
    name: "Leg Extension",
    machine: "Leg Extension",
    setup: "ปรับพนักพิงให้หลังแนบเบาะ วางนวมเหนือข้อเท้าเล็กน้อย และตั้งเท้าให้หัวเข่าเคลื่อนในแนวตรง",
    sets: 4, reps: "12–15",
    tempo: "ยกขึ้นลื่นไหล / ลงช้าๆ",
    rest: "90 วินาที",
    cue: "เตะขึ้นให้สุดแล้วค้าง 1 วินาทีที่ด้านบน ลดลงช้าๆ โดยไม่ปล่อยน้ำหนักตก ปั๊มเนื้อขาได้ดีสุดขีด",
    muscle: "ขา",
  },
  {
    name: "Smith Machine Squat",
    machine: "Smith Machine",
    setup: "วางบาร์บนบ่าด้านหลัง ก้าวเท้าไปข้างหน้าเล็กน้อย เกร็งท้องและล็อกลำตัวก่อนเริ่มย่อ",
    sets: 3, reps: "8–10",
    tempo: "ย่อลงช้า / ดันขึ้นตรง",
    rest: "90 วินาที",
    cue: "ท่าหลักของช่วงล่างวันศุกร์ ส้นเท้ากดพื้น ลำตัวตั้งตรง คุมฟอร์มแน่นทุกเซ็ต",
    muscle: "ขา",
  },
  {
    name: "Smith Machine Hip Thrust",
    machine: "Smith Machine + Long Bench",
    setup: "ลากม้านั่งยาวมาขวาง รองสะบักบนขอบเบาะ สอดตัวใต้บาร์ให้พาดตรงข้อพับสะโพกและหาโฟมรองไว้",
    sets: 3, reps: 15,
    tempo: "ดันขึ้น / ค้าง 2 วินาที / ลงช้า",
    rest: "60 วินาที",
    cue: "เกร็งก้นดันสะโพกขึ้นจนลำตัวขนานพื้น ค้างบนสุด 2 วินาที เพื่อสร้างแรงขับจากสะโพกให้ต่อเนื่อง",
    muscle: "ก้น",
  },
  {
    name: "Cable Triceps Pushdown",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัว กดไหล่ลง เลือกน้ำหนักหนักเท่าวันจันทร์",
    sets: 5, reps: "8–10",
    tempo: "บีบลง / คุมกลับ",
    rest: "2 นาที",
    cue: "ถล่มหลังแขนรอบสอง 5 เซ็ตตรง น้ำหนักหนักเท่าวันจันทร์ พักครบ 2 นาทีเต็มก่อนเซ็ตถัดไปทุกครั้ง",
    muscle: "หลังแขน",
  },
  {
    name: "Cable Biceps Curl",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 4, reps: "8–10",
    tempo: "คุมขึ้น / คุมลง",
    rest: "2 นาที",
    cue: "ปิดสัปดาห์ด้วยหน้าแขนรอบสอง 4 เซ็ตตรง บีบบนสุดเน้นๆ และพักเต็ม 2 นาทีทุกเซ็ต",
    muscle: "หน้าแขน",
  },
]

const tuesdayStretches: Stretch[] = [
  { name: "Chest Stretch", how: "ยืนพิงวงกบประตู ยกแขน 90\u00b0 แล้วเอนไปข้างหน้าเบาๆ", duration: "2 นาที" },
  { name: "Upper Back Stretch", how: "นั่งแล้วเอื้อมแขนไปข้างหน้า โค้งหลังส่วนบนเบาๆ", duration: "2 นาที" },
  { name: "Quad Stretch", how: "ยืนจับข้อเท้าข้างหนึ่งดึงเข้าหาก้น ใช้มือข้างเดียวกันจับไว้", duration: "1 นาที/ข้าง" },
  { name: "Hamstring Stretch", how: "นั่งเหยียดขาตรง เอื้อมมือไปแตะปลายเท้า", duration: "1–2 นาที" },
  { name: "Incline Walk (easy)", how: "เดินลู่ชันเบาๆ คุมชีพจรให้ต่ำ ไม่ต้องเร่งความเร็ว", duration: "15–20 นาที" },
]

const globalRules = [
  { topic: "ความหนัก", rule: "เซ็ตตรงดั้งเดิม เพิ่มน้ำหนักได้เต็มที่ ขอให้ครั้งที่ 8–10 ยังคุมฟอร์มได้และเหลือแรงสำรองแค่ RIR 1–2" },
  { topic: "เวลาพัก", rule: "ห้ามเร่ง! พักเต็ม 2 นาทีทุกเซ็ตแขน ยิ่งพักครบ กล้ามเนื้อคืน ATP ได้สมบูรณ์ เซ็ตถัดไปยกได้หนักเท่าเดิม" },
  { topic: "ปริมาณแขน", rule: "18 เซ็ตแขน/สัปดาห์ (จันทร์ + ศุกร์) เล่นเซ็ตตรงล้วน ไม่มี Myo-Reps" },
  { topic: "คาร์ดิโอ", rule: "เดินลู่ปรับชัน 5–8% หลังเวท ความเร็ว 3.5–3.8 กม./ชม. ไม่จับบาร์" },
  { topic: "โภชนาการ", rule: "เวย์โปรตีน 3 ช้อน/วัน (75 กรัม) ทุกวันไม่ขาด เพื่อซ่อมแขนและโกยกล้ามให้ระเบิด" },
  { topic: "เวลาต่อเซสชัน", rule: "ประมาณ 50–65 นาที แล้วแต่วัน เพิ่มขึ้นเล็กน้อยเพราะยัดเซ็ตแขนโหดขึ้น" },
  { topic: "ความถี่การฝึก", rule: "3× ต่อสัปดาห์ วันพักระหว่างเซสชันห้ามขาด เพราะช่วงนั้นคือเวลาฟื้นตัวและโตของกล้าม" },
]

const weekOverview = [
  { label: "จันทร์", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "อังคาร", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "พุธ", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "พฤหัส", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "ศุกร์", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "เสาร์", tag: "เลือกได้", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "อาทิตย์", tag: "พัก", style: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
]

// ─── Components ──────────────────────────────────────────────────────────────

const muscleColor: Record<Muscle, string> = {
  อก: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  หลัง: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  ไหล่: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  หลังแขน: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  หน้าแขน: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  ขา: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  ก้น: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
  แกนกลาง: "bg-lime-500/15 text-lime-300 border-lime-500/25",
  แขน: "bg-pink-500/15 text-pink-300 border-pink-500/25",
}

function ExerciseRow({ ex, index }: { ex: Exercise; index: number }) {
  return (
    <div className="py-4 border-b border-gray-800/60 last:border-0">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-xs text-gray-600 font-mono shrink-0">{index}.</span>
          <span className="text-sm font-semibold text-white">{ex.name}</span>
          <span className="text-xs text-gray-500 truncate">{ex.machine}</span>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${muscleColor[ex.muscle]}`}>
          {ex.muscle}
        </span>
      </div>
      <div className="pl-4 space-y-1">
        <p className="text-xs text-gray-400">
          {ex.sets}×{ex.reps}
          <span className="mx-1.5 text-gray-700">·</span>
          พัก {ex.rest}
          <span className="mx-1.5 text-gray-700">·</span>
          <span className="text-gray-500">{ex.tempo}</span>
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">{ex.setup}</p>
        <p className="text-xs text-indigo-300/70 leading-relaxed">{ex.cue}</p>
      </div>
    </div>
  )
}

function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 px-5">
      {exercises.map((ex, i) => (
        <ExerciseRow key={ex.name} ex={ex} index={i + 1} />
      ))}
    </div>
  )
}

function TreadmillWalk({
  title,
  minutes,
  incline,
  speed,
  note,
  technique,
}: {
  title: string
  minutes: string
  incline: string
  speed: string
  focus: string
  note: string
  technique?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 px-5 py-3.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Footprints className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-xs text-gray-500">{minutes}</span>
        <span className="text-xs text-gray-600">·</span>
        <span className="text-xs text-gray-500">ชัน {incline}</span>
        <span className="text-xs text-gray-600">·</span>
        <span className="text-xs text-gray-500">{speed}</span>
        <span className="text-xs text-gray-600">·</span>
        <span className="text-xs text-gray-500">{note}</span>
      </div>
      {technique && (
        <p className="mt-1.5 pl-5 text-xs text-gray-500 leading-relaxed">{technique}</p>
      )}
    </div>
  )
}

function WednesdayMachineFlow() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 px-5 py-4">
      <p className="text-xs font-medium text-gray-400 mb-3">ลำดับสถานี — ใช้แค่ 2 สถานี</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-800 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium mb-1">สถานี 1</p>
          <p className="text-sm text-gray-300">Cable Combo — Lat Pulldown → Seated Row</p>
        </div>
        <div className="rounded-xl border border-gray-800 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-sky-400 font-medium mb-1">สถานี 2</p>
          <p className="text-sm text-gray-300">Multi-Press — Chest Press → Shoulder Press</p>
        </div>
      </div>
    </div>
  )
}

function StretchList({ stretches }: { stretches: Stretch[] }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 px-5">
      {stretches.map((s, i) => (
        <div key={s.name} className={`py-3.5 flex items-start gap-3 ${i < stretches.length - 1 ? "border-b border-gray-800/60" : ""}`}>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm font-medium text-white">{s.name}</span>
              <span className="text-xs text-gray-500 shrink-0">{s.duration}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{s.how}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

type DayCardProps = {
  day: string
  title: string
  type: DayType
  children: ReactNode
}

function DayCard({ day, title, type, children }: DayCardProps) {
  const accent: Record<DayType, string> = {
    train: "text-emerald-400",
    rest: "text-sky-400",
    optional: "text-amber-400",
    special: "text-violet-400",
  }
  const border: Record<DayType, string> = {
    train: "border-emerald-900/50",
    rest: "border-sky-900/50",
    optional: "border-amber-900/50",
    special: "border-violet-900/50",
  }
  return (
    <section className={`rounded-2xl border ${border[type]} bg-gray-950/60`}>
      <div className="px-6 py-5 border-b border-gray-800/60 flex items-baseline gap-3">
        <h2 className={`text-base font-semibold ${accent[type]}`}>{title}</h2>
        <span className="text-xs text-gray-600">{day}</span>
      </div>
      <div className="px-6 py-5 space-y-4">
        {children}
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="container mx-auto max-w-3xl px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          Kowit C.
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/diet"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <Utensils className="h-3.5 w-3.5" />
            แผนอาหาร
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 pb-20">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <Dumbbell className="h-5 w-5 text-emerald-400 shrink-0" />
            <h1 className="text-2xl font-semibold text-white">แผนฝึกส่วนตัว</h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            ฝึก 3&times;/สัปดาห์ · Multi-Press, Cable Combo, Leg Extension, Smith Machine, Treadmill
          </p>
        </div>

        {/* Week overview strip */}
        <div className="mb-8 flex flex-wrap gap-1.5">
          {weekOverview.map(({ label, tag, style }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2 ${style}`}
            >
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-[10px] opacity-60">{tag}</span>
            </div>
          ))}
        </div>

        {/* Day cards */}
        <div className="space-y-3">

          {/* ── Monday ── */}
          <DayCard day="จันทร์" title="Workout A — อก / หลัง / ขา / ระเบิดแขน" type="train">
            <ExerciseList exercises={mondayExercises} />
            <TreadmillWalk
              title="เดินลู่ปรับชัน"
              minutes="10 นาที"
              incline="5%–6%"
              speed="3.5 กม./ชม."
              focus="หลังเวท A"
              note="ไม่จับบาร์"
              technique="ปล่อยแขนแกว่งตามธรรมชาติ ลำตัวตั้งตรง ก้าวสั้นสม่ำเสมอ"
            />
          </DayCard>

          {/* ── Tuesday ── */}
          <DayCard day="อังคาร" title="พักแบบแอคทีฟ" type="rest">
            <p className="text-sm text-gray-500">
              ขยับเบาๆ เพื่อคลายอาการตึง อย่าข้ามการยืดเหยียด
            </p>
            <StretchList stretches={tuesdayStretches} />
          </DayCard>

          {/* ── Wednesday ── */}
          <DayCard day="พุธ" title="Workout B — ช่วงบน / ไหล่" type="train">
            <WednesdayMachineFlow />
            <ExerciseList exercises={wednesdayExercises} />
            <TreadmillWalk
              title="เดินลู่ปรับชัน"
              minutes="15–20 นาที"
              incline="6%–8%"
              speed="3.8 กม./ชม."
              focus="หลังเวท B"
              note="คุมลมหายใจ"
              technique="ไม่จับบาร์ คุมลำตัวนิ่ง รักษาจังหวะก้าวให้สม่ำเสมอ"
            />
          </DayCard>

          {/* ── Thursday ── */}
          <DayCard day="พฤหัสบดี" title="พักเต็มที่" type="rest">
            <p className="text-sm text-gray-500">
              กล้ามเนื้อซ่อมแซมและโตตอนฟื้นตัว ไม่ใช่ตอนฝึก
            </p>
            <div className="flex flex-wrap gap-2">
              {["นอน 7–9 ชั่วโมง", "กินโปรตีนให้ถึง", "ยืดเบาๆ 5 นาที (ถ้าอยาก)"].map((tip) => (
                <span key={tip} className="text-xs text-sky-300 border border-sky-800/60 bg-sky-900/20 rounded-full px-3 py-1">
                  {tip}
                </span>
              ))}
            </div>
          </DayCard>

          {/* ── Friday ── */}
          <DayCard day="ศุกร์" title="Workout C — ช่วงล่าง / ถล่มแขนย้ำแค้น" type="train">
            <ExerciseList exercises={fridayExercises} />
            <TreadmillWalk
              title="เดินลู่ปรับชัน"
              minutes="10 นาที"
              incline="5%"
              speed="3.5 กม./ชม."
              focus="ปิดสัปดาห์"
              note="ไม่จับบาร์"
              technique="คงลำตัวตรง ปล่อยแขนแกว่งสบายๆ ไม่เร่งความเร็ว"
            />
          </DayCard>

          {/* ── Saturday ── */}
          <DayCard day="เสาร์" title="เลือกได้" type="optional">
            <div className="flex flex-wrap gap-2">
              <div className="rounded-xl border border-amber-800/40 bg-amber-900/20 px-4 py-3">
                <p className="text-sm font-medium text-amber-200">Incline Walk</p>
                <p className="text-xs text-amber-300/60 mt-0.5">15–20 นาที แบบชิลๆ</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/30 px-4 py-3">
                <p className="text-sm font-medium text-gray-300">หรือพักเต็มที่</p>
                <p className="text-xs text-gray-600 mt-0.5">ฟังร่างกายตัวเองเป็นหลัก</p>
              </div>
            </div>
          </DayCard>

          {/* ── Sunday ── */}
          <DayCard day="อาทิตย์" title="พักเต็มที่" type="rest">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "การนอน", note: "สำคัญที่สุดสำหรับการฟื้นตัว" },
                { label: "โปรตีน", note: "กินให้ถึงเป้าหมายทุกวัน" },
                { label: "น้ำ", note: "สำคัญมากหลังฝึกมาตลอดทั้งสัปดาห์" },
              ].map(({ label, note }) => (
                <div key={label} className="rounded-xl border border-rose-900/40 bg-rose-900/20 px-4 py-3">
                  <p className="text-sm font-medium text-rose-200">{label}</p>
                  <p className="text-xs text-rose-300/50 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </DayCard>

          {/* ── Global Rules ── */}
          <DayCard day="ตลอดเวลา" title="กฎหลัก" type="special">
            <div className="space-y-2">
              {globalRules.map(({ topic, rule }) => (
                <div key={topic} className="flex gap-3">
                  <span className="text-xs text-violet-400 font-medium shrink-0 w-32 pt-0.5">{topic}</span>
                  <span className="text-sm text-gray-400 leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </DayCard>

        </div>
      </main>
    </div>
  )
}
