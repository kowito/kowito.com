import Link from "next/link"
import { ArrowLeft, Dumbbell, Timer, Repeat2, Zap, Info, Bike, Utensils } from "lucide-react"
import type { ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "อก" | "หลัง" | "ไหล่" | "หลังแขน" | "หน้าแขน" | "ขา" | "ก้น" | "แกนกลาง"
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
    name: "ดันอก",
    machine: "เครื่อง Multi-Press",
    setup: "ปรับเบาะให้มือจับอยู่ระดับกลางอก พิงหลังชิดเบาะเต็มแผ่น วางเท้าราบกับพื้นและเก็บสะบักลงก่อนเริ่มดัน",
    sets: 2, reps: 8,
    tempo: "ดัน 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "75–90s",
    cue: "ใช้น้ำหนักที่ดันได้แบบนิ่งทั้งเซ็ต ดันเป็นเส้นตรง ไม่ต้องล็อกศอกสุดแรง และอย่าให้หัวไหล่ลอยขึ้นจากเบาะ",
    muscle: "อก",
  },
  {
    name: "ดึงหลังบน",
    machine: "เครื่องดึงหลังคอมโบ - รอกบน",
    setup: "ล็อกนวมต้นขาให้แน่น จับบาร์กว้างกว่าไหล่เล็กน้อย นั่งให้ลำตัวตั้งตรงและเชิดอกก่อนเริ่มดึงลง",
    sets: 2, reps: 8,
    tempo: "ดึง 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "75–90s",
    cue: "ดึงบาร์ลงมาหาอกส่วนบนโดยไม่เหวี่ยงลำตัว คุมทางขึ้นช้าๆ และถ้าต้องเอนหลังมากแปลว่าน้ำหนักหนักเกินไป",
    muscle: "หลัง",
  },
  {
    name: "เตะขาหน้า",
    machine: "เครื่อง Leg Extension",
    setup: "ปรับพนักพิงให้หลังแนบเบาะ วางนวมเหนือข้อเท้าเล็กน้อย และจัดหัวเข่าให้ตรงแนวกับแกนเครื่อง",
    sets: 2, reps: 10,
    tempo: "ยกขึ้นลื่นไหล / ลงช้าๆ",
    rest: "90s",
    cue: "เตะขึ้นให้สุดแล้วค้าง 1 วินาทีที่ด้านบน ลดลงช้าๆ โดยไม่ปล่อยน้ำหนักตก และอย่าให้สะโพกยกจากเบาะ",
    muscle: "ขา",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "ดึงหลังบน",
    machine: "เครื่องเคเบิลคอมโบ - รอกบน",
    setup: "นั่งใต้ที่ล็อกต้นขา จับบาร์ยาวกว้างกว่าไหล่เล็กน้อย ตั้งอกขึ้น เก็บคาง และเตรียมดึงลงด้วยหลังไม่ใช่แขน",
    sets: 3, reps: "10–12",
    tempo: "ดึงคุมจังหวะ / กลับช้า",
    rest: "60–90s",
    cue: "ดึงบาร์ลงหาอกส่วนบนให้ศอกกดลงข้างลำตัว รักษาลำตัวนิ่ง ถ้าเริ่มแกว่งแปลว่าน้ำหนักมากเกินไป",
    muscle: "หลัง",
  },
  {
    name: "ดันอก",
    machine: "เครื่อง Multi-Press - เบาะระดับอก",
    setup: "ปรับเบาะให้มือจับอยู่ระดับกลางหน้าอก พิงหลังชิดเบาะเต็มแผ่น แล้ววางเท้าทั้งสองข้างให้มั่นคงก่อนเริ่ม",
    sets: 2, reps: "8–10",
    tempo: "ดันลื่นไหล / กลับอย่างควบคุม",
    rest: "60–90s",
    cue: "ดันออกตรงๆ โดยให้ข้อศอกไม่กางมากเกินไป เก็บไหล่ลงตลอด และเลือกน้ำหนักที่นิ่งตั้งแต่ครั้งแรกจนจบ",
    muscle: "อก",
  },
  {
    name: "ดึงนั่ง",
    machine: "เครื่องเคเบิลคอมโบ - รอกล่าง",
    setup: "นั่งตัวตรง ฝ่าเท้ากดกับที่พัก เข่าผ่อนเล็กน้อย จับด้ามจับแบบกริปกลาง แล้วเอนตัวกลับนิดเดียวเท่านั้น",
    sets: 2, reps: "10–12",
    tempo: "ดึง 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "60–90s",
    cue: "ดึงเข้าหาชายโครงล่างและบีบสะบักสั้นๆ 1 ครั้ง จากนั้นปล่อยกลับอย่างช้าๆ โดยไม่ปล่อยไหล่งุ้ม",
    muscle: "หลัง",
  },
  {
    name: "ดันไหล่",
    machine: "เครื่อง Multi-Press - ปรับพนักพิงตั้งชัน",
    setup: "ยกเบาะและพนักพิงให้มือจับเริ่มที่ระดับไหล่ เก็บซี่โครงลง สะโพกติดเบาะ และให้ข้อศอกอยู่ใต้มือจับก่อนดันขึ้น",
    sets: 2, reps: "8–10",
    tempo: "ดันขึ้น / กลับช้าๆ",
    rest: "60–90s",
    cue: "ดันมือจับขึ้นตรงๆ โดยไม่แอ่นหลัง ถ้าทางดันสั่นหรือคุมลงไม่ได้ ให้ลดน้ำหนักลงทันที",
    muscle: "ไหล่",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "ดันอก",
    machine: "เครื่อง Multi-Press",
    setup: "ใช้เบาะระดับอกเหมือนวันจันทร์ ปรับตำแหน่งมือจับให้สอดคล้องกับกลางหน้าอก พิงหลังเต็มแผ่นและคุมไหล่ให้นิ่ง",
    sets: 2, reps: 8,
    tempo: "ดัน 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "75–90s",
    cue: "ใช้น้ำหนักเท่าวันจันทร์หรือเบากว่าเล็กน้อย เป้าหมายคือดันคมๆ นิ่งๆ แล้วจบสัปดาห์แบบไม่ล้าเกินไป",
    muscle: "อก",
  },
  {
    name: "ดึงนั่ง",
    machine: "เครื่องดึงหลังคอมโบ - รอกล่าง",
    setup: "นั่งตัวตรง พิงอกกับแผ่นรอง วางเท้าบนที่พัก แล้วดึงโดยเริ่มจากสะบักก่อนแขนทุกครั้ง",
    sets: 2, reps: 8,
    tempo: "ดึง 1 วินาที / ปล่อยกลับ 2 วินาที",
    rest: "75–90s",
    cue: "ดึงมือจับกลับอย่างคุมได้ ให้หน้าอกแนบแผ่นรองตลอด และหยุดก่อนร่างกายเริ่มแกว่งหนึ่งครั้ง",
    muscle: "หลัง",
  },
  {
    name: "เตะขาหน้า",
    machine: "เครื่อง Leg Extension",
    setup: "ปรับพนักพิงให้หลังแนบเบาะ วางนวมเหนือข้อเท้าเล็กน้อย และตั้งเท้าให้หัวเข่าเคลื่อนในแนวตรง",
    sets: 2, reps: 10,
    tempo: "ยกขึ้นลื่นไหล / ลงช้าๆ",
    rest: "90s",
    cue: "ทำเหมือนวันจันทร์ แต่ให้เนียนและคุมมากกว่าเดิม ค้างบนสุดสั้นๆ แล้วปล่อยลงช้าๆ โดยไม่ดีดกลับ",
    muscle: "ขา",
  },
]

const tuesdayStretches: Stretch[] = [
  { name: "ยืดอก", how: "ยืนพิงวงกบประตู ยกแขน 90\u00b0 แล้วเอนไปข้างหน้าเบาๆ", duration: "2 นาที" },
  { name: "ยืดหลัง", how: "นั่งแล้วเอื้อมแขนไปข้างหน้า โค้งหลังส่วนบนเบาๆ", duration: "2 นาที" },
  { name: "ยืดหน้าขา", how: "ยืนจับข้อเท้าข้างหนึ่งดึงเข้าหาก้น ใช้มือข้างเดียวกันจับไว้", duration: "1 นาที/ข้าง" },
  { name: "ยืดหลังขา", how: "นั่งเหยียดขาตรง เอื้อมมือไปแตะปลายเท้า", duration: "1–2 นาที" },
  { name: "ปั่นจักรยานเบาๆ", how: "ปั่นช้าๆ ระดับเบาสบาย เหนื่อยนิดเดียวพอ", duration: "10–15 นาที" },
]

const globalRules = [
  { topic: "ความหนัก", rule: "จบแต่ละเซตโดยยังเหลือแรงอีก 3–4 ครั้ง ควรรู้สึกทำได้สบาย ไม่ใช่โหดเกินไป" },
  { topic: "ปริมาณ", rule: "ตอนนี้ใช้แค่ 3 ท่าต่อวันฝึก และท่าละ 2 เซตพอ" },
  { topic: "คาร์ดิโอ", rule: "ใช้จักรยานเบาๆ เท่านั้น และต้องยังพูดเป็นประโยคได้ตลอดเวลา" },
  { topic: "เวลาต่อเซสชัน", rule: "รวมทั้งหมดประมาณ 25–35 นาที ออกจากยิมแล้วควรรู้สึกว่ายังพอไหวอีกนิด" },
  { topic: "การเพิ่มระดับ", rule: "เพิ่มจำนวนครั้งก่อน แล้วค่อยเพิ่มน้ำหนักเมื่อครบสัปดาห์แล้วรู้สึกสบาย" },
  { topic: "ความถี่การฝึก", rule: "3\u00d7 ต่อสัปดาห์ วันพักระหว่างเซสชันห้ามขาด เพราะช่วงนั้นคือเวลาฟื้นตัว" },
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
}

function StatPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-gray-800 bg-gray-900/50 px-3 py-2.5 min-w-0">
      <div className="flex items-center gap-1.5 text-gray-400">
        <span className="shrink-0">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white truncate">{value}</span>
    </div>
  )
}

function ExerciseCard({ ex, index }: { ex: Exercise; index: number }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-400">
            {index}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white leading-tight">{ex.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{ex.machine}</p>
          </div>
        </div>
        <span className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border ${muscleColor[ex.muscle]}`}>
          {ex.muscle}
        </span>
      </div>

      {/* Setup */}
      <div className="mx-5 mb-3 rounded-xl bg-gray-800/40 px-3 py-2 text-xs text-gray-300 leading-relaxed">
        <span className="text-gray-500 font-medium uppercase tracking-wide text-[10px] mr-1.5">วิธีตั้งท่า</span>
        {ex.setup}
      </div>

      {/* Stats row */}
      <div className="px-5 pb-3 grid grid-cols-3 gap-2">
        <StatPill
          icon={<Repeat2 className="h-3 w-3" />}
          label="เซต × ครั้ง"
          value={`${ex.sets}\u00d7${ex.reps}`}
        />
        <StatPill
          icon={<Zap className="h-3 w-3" />}
          label="จังหวะ"
          value={ex.tempo}
        />
        <StatPill
          icon={<Timer className="h-3 w-3" />}
          label="พัก"
          value={ex.rest}
        />
      </div>

      {/* Cue */}
      <div className="mx-5 mb-4 flex gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2.5">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-400" />
        <p className="text-xs text-indigo-200 leading-relaxed">{ex.cue}</p>
      </div>
    </div>
  )
}

function ExerciseGrid({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {exercises.map((ex, i) => (
        <ExerciseCard key={ex.name} ex={ex} index={i + 1} />
      ))}
    </div>
  )
}

function EasyBike({ minutes = 8 }: { minutes?: number }) {
  const easyMinutes = Math.max(minutes - 4, 4)
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800">
        <Bike className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-sm font-semibold text-white">ปั่นจักรยานเบาๆ</span>
        <span className="ml-auto text-xs text-gray-400">{minutes} min total</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">วอร์มอัพ</span>
          </div>
          <div className="h-6 w-16 rounded-md bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
            <span className="text-[10px] text-sky-300 font-medium">0–2 นาที</span>
          </div>
          <span className="text-xs text-gray-300">ปั่นช้ามาก แค่ให้ร่างกายอุ่น และหายใจทางจมูกได้ถ้าไหว</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">ช่วงปั่น</span>
          </div>
          <div className="h-6 flex-1 rounded-md bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-[10px] text-emerald-300 font-medium">{easyMinutes} นาทีแบบสบายๆ</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">คูลดาวน์</span>
          </div>
          <div className="h-6 w-16 rounded-md bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
            <span className="text-[10px] text-cyan-300 font-medium">2 นาทีสุดท้าย</span>
          </div>
          <span className="text-xs text-gray-300">ค่อยๆ เบาลง แล้วจบแบบรู้สึกดีขึ้นกว่าตอนเริ่ม</span>
        </div>
      </div>
    </div>
  )
}

function TreadmillWalk({ minutes = 10 }: { minutes?: number }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800">
        <Timer className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-sm font-semibold text-white">เดินลู่</span>
        <span className="ml-auto text-xs text-gray-400">{minutes} min</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-16 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">เดิน</span>
          </div>
          <div className="h-6 flex-1 rounded-md bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-[10px] text-emerald-300 font-medium">ความเร็วสบายๆ ถ้าทำได้ให้หายใจทางจมูก</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-16 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">เป้าหมาย</span>
          </div>
          <div className="h-6 rounded-md bg-sky-500/15 border border-sky-500/20 flex items-center justify-center px-3">
            <span className="text-[10px] text-sky-300 font-medium">ช่วยคลายกล้ามเนื้อ อย่าเปลี่ยนเป็นคาร์ดิโอหนัก</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WednesdayMachineFlow() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800">
        <p className="text-sm font-semibold text-white">ลำดับสถานี</p>
        <p className="text-xs text-gray-500 mt-0.5">ใช้แค่ 2 สถานี จะได้ไม่ต้องเดินวุ่นในยิม</p>
      </div>

      <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-800 bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-medium">สถานี 1</p>
          <p className="mt-1 text-sm text-gray-200">เครื่องเคเบิลคอมโบสำหรับดึงหลังบน แล้วต่อด้วยดึงนั่ง</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-sky-300 font-medium">สถานี 2</p>
          <p className="mt-1 text-sm text-gray-200">เครื่อง Multi-Press สำหรับดันอก แล้วปรับเบาะขึ้นเพื่อดันไหล่</p>
        </div>
      </div>
    </div>
  )
}

function StretchList({ stretches }: { stretches: Stretch[] }) {
  return (
    <div className="space-y-2">
      {stretches.map((s) => (
        <div key={s.name} className="flex gap-3 rounded-2xl border border-gray-800 bg-gray-900/40 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-white">{s.name}</span>
              <span className="text-[10px] font-medium rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 px-2 py-0.5 shrink-0">
                {s.duration}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{s.how}</p>
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
  const topBar: Record<DayType, string> = {
    train: "from-emerald-500 to-teal-400",
    rest: "from-sky-500 to-blue-400",
    optional: "from-amber-500 to-orange-400",
    special: "from-violet-500 to-purple-400",
  }
  const titleColor: Record<DayType, string> = {
    train: "text-emerald-300",
    rest: "text-sky-300",
    optional: "text-amber-300",
    special: "text-violet-300",
  }
  return (
    <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
      <div className={`h-[2px] bg-gradient-to-r ${topBar[type]}`} />
      <div className="p-6 md:p-8 space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">{day}</p>
          <h2 className={`text-xl font-semibold tracking-tight mt-1 ${titleColor[type]}`}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[650px] w-[650px] rounded-full bg-gradient-to-b from-emerald-900/20 to-cyan-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[650px] w-[650px] rounded-full bg-gradient-to-t from-orange-900/20 to-amber-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      <header className="container mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="font-light tracking-wider text-lg text-white hover:text-gray-300 transition-colors">
          Kowit C.
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/diet"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Utensils className="h-3.5 w-3.5" />
            แผนอาหาร
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 pb-20">
        {/* Page heading */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-6 w-6 text-emerald-400 shrink-0" />
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">แผนฝึกส่วนตัว</h1>
          </div>
          <p className="max-w-xl text-gray-400 text-sm leading-relaxed">
            แผนนี้ผูกกับอุปกรณ์ที่มีจริงในยิมของคุณ: Multi-Press, เครื่องเคเบิลคอมโบ, Leg Extension, ดัมเบล,
            ลู่เดิน และจักรยาน ปรับให้ฝึก 3&times; ต่อสัปดาห์แบบคุมแรงและคุมฟอร์มได้ง่าย
          </p>
        </div>

        {/* Week overview strip */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {weekOverview.map(({ label, tag, style }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 rounded-xl border px-4 py-2.5 min-w-[52px] ${style}`}
            >
              <span className="text-xs font-semibold tracking-wide">{label}</span>
              <span className="text-[10px] opacity-60">{tag}</span>
            </div>
          ))}
          <div className="ml-auto rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-2.5 text-xs text-gray-400 shrink-0">
            <span className="font-medium text-white block mb-0.5">ลำดับเริ่มต้น</span>
            วันจันทร์/ศุกร์ ใช้ Multi-Press + เคเบิล + Leg Extension, วันพุธเพิ่มเครื่องเคเบิลรอกล่างและไหล่
            &rarr; คาร์ดิโอเบาๆ &rarr; กลับบ้าน
          </div>
        </div>

        {/* Day cards */}
        <div className="space-y-5">

          {/* ── Monday ── */}
          <DayCard day="จันทร์" title="เวิร์กเอาต์เริ่มต้น A" type="train">
            <ExerciseGrid exercises={mondayExercises} />
            <EasyBike minutes={8} />
          </DayCard>

          {/* ── Tuesday ── */}
          <DayCard day="อังคาร" title="พักแบบแอคทีฟ" type="rest">
            <p className="text-sm text-gray-400 -mt-2 mb-1">
              ขยับเบาๆ เพื่อคลายอาการตึง อย่าข้ามการยืดเหยียด เพราะจะช่วยให้วันพุธรู้สึกดีขึ้น
            </p>
            <StretchList stretches={tuesdayStretches} />
          </DayCard>

          {/* ── Wednesday ── */}
          <DayCard day="พุธ" title="เน้นเครื่องดัน-ดึง" type="train">
            <p className="text-sm text-gray-400 -mt-2 mb-1">
              เลือกน้ำหนักที่ยังเหลือแรงอีกประมาณ 1–3 ครั้ง เป้าหมายคือท่าที่นิ่ง ลื่นไหล ตึงต่อเนื่อง และสลับ
              ระหว่างเครื่องเคเบิลกับ Multi-Press ให้เป็นระบบเพื่อลดการเดินและประหยัดแรง
            </p>
            <WednesdayMachineFlow />
            <ExerciseGrid exercises={wednesdayExercises} />
            <TreadmillWalk minutes={10} />
          </DayCard>

          {/* ── Thursday ── */}
          <DayCard day="พฤหัสบดี" title="พักเต็มที่" type="rest">
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                พักเต็มที่ กล้ามเนื้อซ่อมแซมและโตตอนฟื้นตัว ไม่ใช่ตอนฝึก ให้วันนี้เป็นวันพักจริงๆ
              </p>
              <div className="flex flex-wrap gap-2">
                {["นอน 7–9 ชั่วโมง", "กินโปรตีนให้ถึง", "ถ้าอยากทำ: ยืดเบาๆ 5 นาที"].map((tip) => (
                  <span key={tip} className="rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200">
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          </DayCard>

          {/* ── Friday ── */}
          <DayCard day="ศุกร์" title="เวิร์กเอาต์เริ่มต้น C" type="train">
            <ExerciseGrid exercises={fridayExercises} />
            <EasyBike minutes={8} />
          </DayCard>

          {/* ── Saturday ── */}
          <DayCard day="เสาร์" title="เลือกได้" type="optional">
            <p className="text-sm text-gray-400 -mt-2 mb-3">
              ทำกิจกรรมเบาๆ เท่านั้น วันนี้ไม่ใช่วันฝึก คุมชีพจรให้อยู่ต่ำไว้ และใช้จักรยานหรือลู่เฉพาะถ้ารู้สึกฟื้นตัวดี
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm">
                <p className="font-medium text-amber-200">ปั่นจักรยานคงที่</p>
                <p className="text-amber-300/70 text-xs mt-0.5">15–20 นาที แบบสบายๆ ระดับปานกลาง</p>
              </div>
              <div className="rounded-2xl border border-gray-700 bg-gray-900/30 px-4 py-3 text-sm">
                <p className="font-medium text-gray-300">หรือพักเต็มที่</p>
                <p className="text-gray-500 text-xs mt-0.5">เลือกแบบไหนก็ได้ ฟังร่างกายตัวเองเป็นหลัก</p>
              </div>
            </div>
          </DayCard>

          {/* ── Sunday ── */}
          <DayCard day="อาทิตย์" title="พักเต็มที่" type="rest">
            <p className="text-sm text-gray-400 -mt-2 mb-3">
              ฟื้นตัวเต็มที่ เตรียมตัวสำหรับสัปดาห์หน้า
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "การนอน", note: "สำคัญที่สุดสำหรับการฟื้นตัว" },
                { label: "โปรตีน", note: "กินให้ถึงเป้าหมายทุกวัน" },
                { label: "น้ำ", note: "สำคัญมากหลังฝึกมาตลอดทั้งสัปดาห์" },
              ].map(({ label, note }) => (
                <div key={label} className="rounded-2xl border border-rose-500/20 bg-rose-500/8 px-4 py-2.5">
                  <p className="text-sm font-medium text-rose-200">{label}</p>
                  <p className="text-[10px] text-rose-300/60 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </DayCard>

          {/* ── Global Rules ── */}
          <DayCard day="ตลอดเวลา" title="กฎหลัก" type="special">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {globalRules.map(({ topic, rule }) => (
                <div key={topic} className="rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3.5">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">{topic}</p>
                  <p className="text-sm text-gray-200 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </DayCard>

        </div>
      </main>
    </div>
  )
}
