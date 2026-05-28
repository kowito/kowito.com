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
    name: "Smith Machine Squat",
    machine: "Smith Machine",
    setup: "วางบาร์บนบ่าด้านหลัง ก้าวเท้าไปข้างหน้าเล็กน้อย เกร็งท้องและตั้งลำตัวให้มั่นคงก่อนเริ่มย่อ",
    sets: 3,
    reps: "8–10",
    tempo: "ย่อลงช้า / ดันขึ้นตรง",
    rest: "90 วินาที",
    cue: "เกร็งท้องให้แกนกลางนิ่ง ตั้งลำตัวตรง ตอนดันขึ้นให้คิดว่ากำลังใช้ส้นเท้าถีบพื้นทลุโลก",
    muscle: "ขา",
  },
  {
    name: "Leg Extension",
    machine: "Leg Extension",
    setup: "ปรับพนักพิงให้หลังแนบเบาะ วางนวมเหนือข้อเท้าเล็กน้อย และตั้งเท้าให้หัวเข่าเคลื่อนในแนวตรง",
    sets: 3,
    reps: "12–15",
    tempo: "ยกขึ้นลื่นไหล / ลงช้า ๆ",
    rest: "90 วินาที",
    cue: "เตะขึ้นสุดแล้วล็อกค้างไว้บนสุด 1 วินาทีเต็ม บีบเนื้อหน้าขาให้แข็งเป็นก้อนก่อนผ่อนลงช้า ๆ",
    muscle: "ขา",
  },
  {
    name: "Smith Machine Hip Thrust",
    machine: "Smith Machine + Long Bench",
    setup: "ลากม้านั่งมาให้รองสะบัก จัดโฟมที่สะโพกและพาดบาร์ตรงข้อพับสะโพกให้มั่นคงก่อนเริ่ม",
    sets: 2,
    reps: 15,
    tempo: "ดันขึ้น / ค้าง 2 วินาที / ลงช้า",
    rest: "60 วินาที",
    cue: "ดันสะโพกขึ้นจนลำตัวขนานพื้น ขลิบบีบเนื้อก้นค้างไว้บนสุด 2 วินาทีเต็ม",
    muscle: "ก้น",
  },
  {
    name: "Cable Triceps Pushdown",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัวและกดไหล่ลงก่อนเริ่ม เลือกน้ำหนักให้ครั้งที่ 8–10 เริ่มตึงมือจัดๆ",
    sets: 3,
    reps: "8–10",
    tempo: "กดลง / กลับช้า 2 วินาที",
    rest: "2–3 นาที",
    cue: "ใส่น้ำหนักหน่วงตึงมือ ล็อกข้อศอกข้างลำตัวนิ่งสนิทเป็นหิน กดเชือกลงมาสุดแล้วกางออก บีบเค้นหลังแขนให้แสบร้อน",
    muscle: "หลังแขน",
  },
  {
    name: "Cable Biceps Curl",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 3,
    reps: "8–10",
    tempo: "ม้วนขึ้น / กลับช้า 2 วินาที",
    rest: "2–3 นาที",
    cue: "ตรึงศอกข้างลำตัว ห้ามใช้ไหล่หรือแรงเหวี่ยงตัวช่วย ม้วนดึงบาร์ขึ้นมาบีบเนื้อหน้าแขนด้านบนให้แน่นที่สุด",
    muscle: "หน้าแขน",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "Lat Pulldown",
    machine: "Cable Combo",
    setup: "นั่งตัวตรง ล็อกนวมต้นขาให้แน่น จับบาร์กว้างกว่าไหล่เล็กน้อย และเชิดอกก่อนเริ่มดึงลง",
    sets: 3,
    reps: "10–12",
    tempo: "ดึงคุมจังหวะ / กลับช้า",
    rest: "90 วินาที",
    cue: "คิดว่ากำลังกดข้อศอกลงหาเอวเพื่อใช้หลังดึง ไม่ใช้แรงแขนโกง",
    muscle: "หลัง",
  },
  {
    name: "Incline Chest Press",
    machine: "Multi-Press",
    setup: "ปรับเบาะเครื่อง Multi-Press ให้เฉียงขึ้น (30–45 องศา) ให้มือจับอยู่ระดับเหนือนมเล็กน้อย เชิดอก ล็อกสะบักหลังจมเบาะแน่น ห้ามไหล่ลอย",
    sets: 2,
    reps: "8–10",
    tempo: "ดันเฉียงขึ้น / กลับคุมจังหวะ 2 วิ",
    rest: "90 วินาที",
    cue: "จังหวะดันออกไป ให้จินตนาการว่ากำลังใช้ต้นแขนด้านในบีบเข้าหากัน เค้นเนื้ออกส่วนบนให้แน่นตึงเปรี๊ยะดันไปถึงไหปลาร้า เพื่อดึงแผงอกให้เชิดหนา",
    muscle: "อก",
  },
  {
    name: "Seated Row",
    machine: "Cable Combo",
    setup: "นั่งตัวตรง ยืดอก ดึงบาร์เข้าหาชายโครงล่าง และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 3,
    reps: "10–12",
    tempo: "ดึง 1 วิ / ค้างสะบัก 1 วิ / ปล่อยกลับ 2 วิ",
    rest: "90 วินาที",
    cue: "เกร็งบีบสะบักหลังสองข้างเข้าหากันแน่น ๆ ค้างไว้ 1 วินาทีเต็มทุกครั้ง เพื่อดึงแนวไหล่ที่งุ้มตกลงให้เปิดผึ่งผายออก",
    muscle: "หลัง",
  },
  {
    name: "Shoulder Press",
    machine: "Multi-Press",
    setup: "สะโพกติดเบาะ ดันขึ้นตรง ๆ และไม่แอ่นหลัง ถ้าน้ำหนักหน่วงจนสั่นสะท้านให้คุมฟอร์มก่อนเสมอ",
    sets: 2,
    reps: "8–10",
    tempo: "ดันขึ้น / กลับช้า ๆ",
    rest: "90 วินาที",
    cue: "ถ้าน้ำหนักหน่วงจนสั่นสะท้านคุมลงไม่ได้ ให้ลดเหล็กลงทันที",
    muscle: "ไหล่",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "Chest Press",
    machine: "Multi-Press",
    setup: "ปรับเบาะลงต่ำให้มือจับอยู่ระดับหัวนมพอดีเป๊ะ เชิดอกและบีบสะบักหลังกดจมติดเบาะแน่น",
    sets: 2,
    reps: 8,
    tempo: "ดัน 1 วิ / ปล่อยกลับ 2 วิ",
    rest: "90 วินาที",
    cue: "นำทริคล็อกสะบักจมเบาะมาใช้ ดันคม ๆ เน้น ๆ เอาเนื้ออกโดยรวมทำงานเพื่อสร้างฐานอกหนาตัดขอบชัด",
    muscle: "อก",
  },
  {
    name: "Seated Row",
    machine: "Cable Combo",
    setup: "นั่งตัวตรง ยืดอก ดึงบาร์เข้าหาชายโครงล่าง และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 2,
    reps: 8,
    tempo: "ดึง 1 วิ / ปล่อยกลับ 2 วิ",
    rest: "90 วินาที",
    cue: "ดึงคุมฟอร์มแน่น ๆ บีบสะบักที่ปลายจังหวะ ไม่ใช้แรงเหวี่ยงลำตัว",
    muscle: "หลัง",
  },
  {
    name: "Cable Triceps Pushdown",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัว กดไหล่ลง เลือกน้ำหนักหนักจนครั้งที่ 8–10 ตึงมือ",
    sets: 3,
    reps: "8–10",
    tempo: "กดลง / กลับช้า 2 วินาที",
    rest: "2–3 นาที",
    cue: "บดขยี้หลังแขนรอบสอง ล็อกศอกให้แน่น ถ้าเริ่มสั่นให้ลดเหล็กลง 1–2 แผ่นแล้วพักให้ยาวขึ้น",
    muscle: "หลังแขน",
  },
  {
    name: "Cable Biceps Curl",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 3,
    reps: "8–10",
    tempo: "ม้วนขึ้น / กลับช้า 2 วินาที",
    rest: "2–3 นาที",
    cue: "ปิดสัปดาห์ด้วยหน้าแขน 3 เซ็ตตรงคุณภาพสูง บีบเนื้อหน้าแขนด้านบนเน้น ๆ",
    muscle: "หน้าแขน",
  },
]

const tuesdayStretches: Stretch[] = [
  { name: "Chest Stretch", how: "ยืนพิงวงกบประตู ยกแขน 90° แล้วเอนไปข้างหน้าเบาๆ", duration: "2 นาที" },
  { name: "Upper Back Stretch", how: "นั่งแล้วเอื้อมแขนไปข้างหน้า โค้งหลังส่วนบนเบาๆ", duration: "2 นาที" },
  { name: "Quad Stretch", how: "ยืนจับข้อเท้าข้างหนึ่งดึงเข้าหาก้น ใช้มือข้างเดียวกันจับไว้", duration: "1 นาที/ข้าง" },
  { name: "Hamstring Stretch", how: "นั่งเหยียดขาตรง เอื้อมมือไปแตะปลายเท้า", duration: "1–2 นาที" },
  { name: "Incline Walk (easy)", how: "เดินลู่ชันเบาๆ คุมชีพจรให้ต่ำ ไม่ต้องเร่งความเร็ว", duration: "15–20 นาที" },
]

const globalRules = [
  { topic: "ความหนัก", rule: "เซ็ตตรงคุณภาพ 100% ครั้งที่ 8–10 ต้องยังคุมฟอร์มได้และเหลือแรงสำรองแค่ RIR 1–2" },
  { topic: "เวลาพัก", rule: "ห้ามเร่ง พักเต็ม 2–3 นาทีในท่าแขน และพักตามที่กำหนดในท่าหลักทุกเซ็ต" },
  { topic: "ก่อนเข้ายิม", rule: "ก่อนซ้อม 1.5–2 ชั่วโมง ซัดข้าวสวย 1 ทัพพีเล็ก หรือขนมปังขาว 1 แผ่นเพื่อเติมไกลโคเจน" },
  { topic: "ระหว่างซ้อม", rule: "พกเครื่องดื่มที่มีน้ำตาลไว้จิบเล็ก ๆ ระหว่างพักยาวเพื่อเลี้ยงพลังงานให้ระบบประสาทไม่ตก" },
  { topic: "หลังซ้อม", rule: "นั่งพัก 15–20 นาทีให้ร่างกายเย็นลงก่อนอาบน้ำ แล้วค่อยดื่มเวย์ 1.5 ช้อนเพื่อปิดงาน" },
  { topic: "ความถี่การฝึก", rule: "ฝึก 3 วันต่อสัปดาห์ วันพักระหว่างเซสชันคือเวลาฟื้นตัวจริงของกล้าม" },
  { topic: "คาร์ดิโอ", rule: "เดินลู่ปรับชัน 5–8% หลังเวท ความเร็ว 3.5–3.8 กม./ชม. และไม่จับบาร์" },
  { topic: "การฟื้นตัว", rule: "หลัง Workout A และ C ให้เว้นช่วงยาวพอให้กล้ามเนื้อขา อก หลัง และแขนได้คืนตัวเต็มที่" },
]

const weekOverview = [
  { label: "จันทร์", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "อังคาร", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "พุธ", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "พฤหัส", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "ศุกร์", tag: "ฝึก", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "เสาร์", tag: "พัก", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
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
        <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400">Max Intent</p>
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
  focus,
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
        <span className="rounded-full border border-gray-700 bg-gray-900/70 px-2 py-0.5 text-[10px] font-medium text-gray-300">
          โฟกัส {focus}
        </span>
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
          <p className="text-sm text-gray-300">Multi-Press — Incline Chest Press → Shoulder Press</p>
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
            <h1 className="text-2xl font-semibold text-white">แผนฝึกส่วนตัว — โมดิฟายยกเครื่อง</h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            ฝึก 3&times;/สัปดาห์ · เน้น quality sets, พักฟื้น 48–96 ชั่วโมง และเดินลู่ไม่จับบาร์
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
          <DayCard day="จันทร์" title="Workout A — ถล่มช่วงล่าง + รุมระเบิดแขน" type="train">
            <ExerciseList exercises={mondayExercises} />
            <TreadmillWalk
              title="เดินลู่ปรับชัน"
              minutes="10 นาที"
              incline="5%–6%"
              speed="3.5 กม./ชม."
              focus="ปลายสัปดาห์กล้ามได้พักยาว"
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
          <DayCard day="พุธ" title="Workout B — วันแห่งช่วงบน (เวอร์ชันล็อกเป้าอกบน)" type="train">
            <WednesdayMachineFlow />
            <ExerciseList exercises={wednesdayExercises} />
            <TreadmillWalk
              title="เดินลู่ปรับชัน"
              minutes="15–20 นาที"
              incline="6%–8%"
              speed="3.8 กม./ชม."
              focus="อก หลัง ไหล่"
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
              {["นอน 7–9 ชั่วโมง", "กินโปรตีนให้ถึง (เวย์ BAAM!! + นมโอ๊ต Alpro)", "ยืดเบาๆ 5 นาที (ถ้าอยาก)"].map((tip) => (
                <span key={tip} className="text-xs text-sky-300 border border-sky-800/60 bg-sky-900/20 rounded-full px-3 py-1">
                  {tip}
                </span>
              ))}
            </div>
          </DayCard>

          {/* ── Friday ── */}
          <DayCard day="ศุกร์" title="Workout C — วันเก็บยอดมหาศึก (หวดซ้ำแบบกระชับ)" type="train">
            <ExerciseList exercises={fridayExercises} />
            <TreadmillWalk
              title="เดินลู่ปรับชัน"
              minutes="10 นาที"
              incline="5%"
              speed="3.5 กม./ชม."
              focus="ปิดสัปดาห์แบบฟื้นตัว"
              note="ไม่จับบาร์"
              technique="คงลำตัวตรง ปล่อยแขนแกว่งสบายๆ ไม่เร่งความเร็ว"
            />
          </DayCard>

          {/* ── Saturday ── */}
          <DayCard day="เสาร์" title="พักเต็มที่" type="rest">
            <div className="flex flex-wrap gap-2">
              {[
                "นอนให้ครบ",
                "คาร์ดิโอเบาได้ถ้าอยาก",
                "ปล่อยให้ขาและแขนคืนตัว",
              ].map((tip) => (
                <span key={tip} className="text-xs text-amber-300 border border-amber-800/60 bg-amber-900/20 rounded-full px-3 py-1">
                  {tip}
                </span>
              ))}
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
          <DayCard day="ตลอดเวลา" title="กฎเหล็กโภชนาการ + ฟื้นตัว" type="special">
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
