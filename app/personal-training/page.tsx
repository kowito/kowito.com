import Link from "next/link"
import { ArrowLeft, Dumbbell, Footprints, Utensils } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "อก" | "หลัง" | "ไหล่" | "หลังแขน" | "หน้าแขน" | "ขา" | "ก้น" | "แกนกลาง" | "แขน"

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
  weight?: string
  video?: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const mondayExercises: Exercise[] = [
  {
    name: "Lat Pulldown",
    machine: "Cable Combo",
    setup: "นั่งตัวตรง ล็อกนวมต้นขาให้แน่น จับบาร์กว้างกว่าไหล่เล็กน้อย และเชิดอกก่อนเริ่มดึงลง",
    sets: 3,
    reps: "10–12",
    tempo: "ดึงคุมจังหวะ / ปล่อยกลับช้า 3 วิ",
    rest: "90 วินาที",
    cue: "คิดว่ากำลังกดข้อศอกลงหาเอวเพื่อใช้หลังดึง ไม่ใช้แรงแขนโกง จังหวะปล่อยบาร์กลับช้า ๆ 3 วิ ให้แผงหลังโดนยืดสุด",
    muscle: "หลัง",
    weight: "45–55 KG",
    video: "https://www.youtube.com/watch?v=bNmvKpJSWKM",
  },
  {
    name: "Incline Chest Press",
    machine: "Multi-Press",
    setup: "ปรับเบาะเครื่อง Multi-Press ให้เฉียงขึ้น (30–45 องศา) หุบศอกลงมาเป็นรูปหัวลูกศร 45–60 องศา จับแคบลงให้ท่อนแขนตั้งฉาก ล็อกสะบักหลังจมเบาะแน่น ห้ามไหล่ลอย",
    sets: 2,
    reps: "8–10",
    tempo: "ดันเฉียงขึ้น / ลงช้า 3 วิ",
    rest: "90 วินาที",
    cue: "ฟอร์มใหม่! หุบศอกลงมาเป็นรูปหัวลูกศร (45–60 องศา) บีบศอกเข้าหาอกตอนดันสุด เลิกกางศอกเป็นตัว T ไหล่หน้าจะได้ไม่ขโมยซีน ตอนปล่อยลงนับ 1...2...3...",
    muscle: "อก",
    weight: "40–50 KG",
    video: "https://www.youtube.com/shorts/98HWfiRonkE",
  },
  {
    name: "Seated Row",
    machine: "Cable Combo",
    setup: "นั่งตัวตรง ยืดอก ดึงบาร์เข้าหาชายโครงล่าง และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 3,
    reps: "10–12",
    tempo: "ดึง 1 วิ / ค้างสะบัก 1 วิ / ปล่อยกลับ 3 วิ",
    rest: "90 วินาที",
    cue: "ดึง 1 วิ ค้างบีบสะบักแน่น ๆ 1 วิ ปล่อยกลับช้า ๆ 3 วิ ดึงไหล่ที่ห่อให้เปิดผึ่งผาย",
    muscle: "หลัง",
    weight: "45–55 KG",
    video: "https://www.youtube.com/watch?v=LyZH4UGdDTc",
  },
  {
    name: "Shoulder Press",
    machine: "Multi-Press",
    setup: "สะโพกติดเบาะ ดันขึ้นตรง ๆ และไม่แอ่นหลัง ถ้าน้ำหนักหน่วงจนสั่นสะท้านให้คุมฟอร์มก่อนเสมอ",
    sets: 2,
    reps: "8–10",
    tempo: "ดันขึ้น / ลงช้า 3 วิ",
    rest: "90 วินาที",
    cue: "นั่งพิงเบาะให้แน่น ตอนผ่อนลงนับ 1...2...3... เซฟข้อต่อไหล่ ถ้าน้ำหนักหน่วงจนสั่นสะท้านให้ลดเหล็กลงทันที",
    muscle: "ไหล่",
    weight: "20–25 KG",
    video: "https://www.youtube.com/watch?v=6v4nrRVySj0",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "Smith Machine Squat",
    machine: "Smith Machine",
    setup: "วางบาร์บนบ่าด้านหลัง ก้าวเท้าไปข้างหน้าเล็กน้อย เกร็งท้องและตั้งลำตัวให้มั่นคงก่อนเริ่มย่อ",
    sets: 3,
    reps: "8–10",
    tempo: "ย่อลงช้า 3 วิ / ดันขึ้นเร็ว",
    rest: "90 วินาที",
    cue: "หายใจเข้าท้องเบ่ง ล็อกเอวหนา ย่อลงช้า 3 วิ ดึงส้นเท้าถีบพื้นทะลุโลก",
    muscle: "ขา",
    weight: "50–60 KG เริ่มต้น → ไต่ระบบถึง 80+ KG",
    video: "https://www.youtube.com/shorts/jPrzu4kp47o",
  },
  {
    name: "Leg Extension",
    machine: "Leg Extension",
    setup: "ปรับพนักพิงให้หลังแนบเบาะ วางนวมเหนือข้อเท้าเล็กน้อย และตั้งเท้าให้หัวเข่าเคลื่อนในแนวตรง",
    sets: 3,
    reps: "12–15",
    tempo: "เตะขึ้นลื่นไหล / ลงช้า 3 วิ",
    rest: "90 วินาที",
    cue: "เตะขึ้นสุดล็อกขาค้าง 1 วิ ผ่อนลงช้า ๆ 3 วิ เต่า ๆ สร้าง Time Under Tension",
    muscle: "ขา",
    weight: "32–40 KG",
    video: "https://www.youtube.com/shorts/iQ92TuvBqRo",
  },
  {
    name: "Smith Machine Hip Thrust",
    machine: "Smith Machine + Long Bench",
    setup: "ลากม้านั่งมาให้รองสะบัก จัดโฟมที่สะโพกและพาดบาร์ตรงข้อพับสะโพกให้มั่นคงก่อนเริ่ม",
    sets: 2,
    reps: 15,
    tempo: "ดันขึ้น / ค้าง 2 วินาที / ลงช้า",
    rest: "60 วินาที",
    cue: "ดันสะโพกขึ้นจนสุด ขลิบบีบก้นค้างไว้บนสุด 2 วินาทีเต็ม",
    muscle: "ก้น",
    weight: "50–60 KG เริ่มต้น → ไต่ระบบถึง 80+ KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  {
    name: "Cable Triceps Pushdown",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัวและกดไหล่ลงก่อนเริ่ม เลือกน้ำหนักให้ครั้งที่ 8–10 เริ่มตึงมือจัดๆ",
    sets: 3,
    reps: "8–10",
    tempo: "กดลง / กลับช้า 3 วิ",
    rest: "2–3 นาที",
    cue: "ล็อคข้อศอกข้างลำตัวนิ่งสนิท บีบเค้นหลังแขนให้แสบร้อน ตอนผ่อนกลับให้นับ 1...2...3... • เซ็ตที่ 3: Lengthened Partials (ครึ่งทางล่าง) 4–5 ครั้ง",
    muscle: "หลังแขน",
    weight: "32 KG (Fixed)",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  {
    name: "Cable Biceps Curl",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 3,
    reps: "8–10",
    tempo: "ม้วนขึ้น / กลับช้า 3 วิ",
    rest: "2–3 นาที",
    cue: "ตรึงศอกข้างลำตัว ห้ามใช้แรงเหวี่ยง ม้วนดึงบีบเนื้อหน้าแขนแน่น ผ่อนกลับนับ 1...2...3... • เซ็ตที่ 3: Lengthened Partials (ครึ่งทางล่าง) 4–5 ครั้ง",
    muscle: "หน้าแขน",
    weight: "20–25 KG",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "Chest Press",
    machine: "Multi-Press",
    setup: "ปรับเบาะลงต่ำให้มือจับอยู่ระดับหัวนมพอดีเป๊ะ เชิดอกและบีบสะบักหลังกดจมติดเบาะแน่น",
    sets: 2,
    reps: 8,
    tempo: "ดัน 1 วิ / ปล่อยกลับ 3 วิ",
    rest: "90 วินาที",
    cue: "นำทริคล็อกสะบักจมเบาะมาใช้ ดันคม ๆ เน้น ๆ เอาเนื้ออกโดยรวมทำงาน ตอนปล่อยลงให้นับ 1...2...3... เพื่อสร้างฐานอกหนาตัดขอบชัด",
    muscle: "อก",
    weight: "45–55 KG (ดันอกระนาบตรง แรงจะเยอะกว่าอกเฉียงวันพุธ)",
    video: "https://www.youtube.com/shorts/Qu7-ceCvq7w",
  },
  {
    name: "Seated Row",
    machine: "Cable Combo",
    setup: "นั่งตัวตรง ยืดอก ดึงบาร์เข้าหาชายโครงล่าง และล็อกหน้าท้องคุมลำตัวไว้ตลอด",
    sets: 2,
    reps: 8,
    tempo: "ดึง 1 วิ / ปล่อยกลับ 3 วิ",
    rest: "90 วินาที",
    cue: "ดึงคุมฟอร์มแน่น ๆ บีบสะบักที่ปลายจังหวะ ไม่ใช้แรงเหวี่ยงลำตัว ตอนปล่อยลงให้นับ 1...2...3...",
    muscle: "หลัง",
    weight: "45–50 KG",
    video: "https://www.youtube.com/watch?v=LyZH4UGdDTc",
  },
  {
    name: "Cable Triceps Pushdown",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ ใช้เชือกหรือบาร์ ศอกแนบลำตัว กดไหล่ลง เลือกน้ำหนักหนักจนครั้งที่ 8–10 ตึงมือ",
    sets: 3,
    reps: "8–10",
    tempo: "กดลง / กลับช้า 3 วิ",
    rest: "2–3 นาที",
    cue: "ล็อคศอกข้างลำตัว กดบีบหลังแขน ผ่อนกลับนับ 1...2...3... ถ้าสั่นให้ลดเหล็กลง 1–2 แผ่น • เซ็ตที่ 3: Lengthened Partials (ครึ่งทางล่าง) 4–5 ครั้ง",
    muscle: "หลังแขน",
    weight: "32 KG (Fixed Base)",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  {
    name: "Cable Biceps Curl",
    machine: "Cable Combo - Low Pulley",
    setup: "ตั้งรอกต่ำ จับบาร์หรือเชือก ตรึงข้อศอกข้างลำตัวให้แน่นและล็อกข้อมือให้มั่นคง",
    sets: 3,
    reps: "8–10",
    tempo: "ม้วนขึ้น / กลับช้า 3 วิ",
    rest: "2–3 นาที",
    cue: "ตรึงศอก ม้วนบีบแน่น ผ่อนกลับนับ 1...2...3... • เซ็ตที่ 3: Lengthened Partials (ครึ่งทางล่าง) 4–5 ครั้ง",
    muscle: "หน้าแขน",
    weight: "20–25 KG (Fixed Base)",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
]



const globalRules = [
  { topic: "ความหนัก", rule: "เซ็ตตรงคุณภาพ 100% ครั้งที่ 8–10 ต้องยังคุมฟอร์มได้และเหลือแรงสำรองแค่ RIR 1–2" },
  { topic: "เวลาพัก", rule: "ห้ามเร่ง พักเต็ม 2–3 นาทีในท่าแขน และพักตามที่กำหนดในท่าหลักทุกเซ็ต" },
  { topic: "ก่อนเข้ายิม", rule: "ก่อนซ้อม 1.5–2 ชั่วโมง ซัดข้าวสวย 1 ทัพพีเล็ก หรือขนมปังขาว 1 แผ่นเพื่อเติมไกลโคเจน ห้ามคาร์บระหว่างยา" },
  { topic: "ระหว่างซ้อม", rule: "พกเครื่องดื่มที่มีน้ำตาลไว้จิบเล็ก ๆ ระหว่างพักยาวเพื่อเลี้ยงพลังงานให้ระบบประสาทไม่ตก" },
  { topic: "หลังซ้อม (จุดเปลี่ยน)", rule: "นั่งพัก 15–20 นาทีให้ร่างกายเย็นลง ค่อยดื่มเวย์ BAAM 1.5 ช้อน + น้ำเปล่าเย็นจัด (ตัดนมโอ๊ตทิ้ง 100%) หรือนมอัลมอนด์/นมพิสตาชิโอ Unsweetened เพื่อป้องกันอินซูลินพุ่ง" },
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
  { label: "อาทิตย์", tag: "พัก", style: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
]

// ─── Components ──────────────────────────────────────────────────────────────

const muscleColor: Record<Muscle, string> = {
  อก: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  หลัง: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  ไหล่: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  หลังแขน: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  หน้าแขน: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  ขา: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  ก้น: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  แกนกลาง: "text-lime-400 bg-lime-500/10 border-lime-500/20",
  แขน: "text-pink-400 bg-pink-500/10 border-pink-500/20",
}

function ExerciseRow({ ex, index }: { ex: Exercise; index: number }) {
  return (
    <div className="py-3.5 border-b border-gray-800/50 last:border-0 flex gap-3 items-start">
      <span className="text-xs text-gray-700 tabular-nums w-5 shrink-0 pt-0.5">{index}.</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm font-medium text-white">{ex.name}</p>
            {ex.video && (
              <a
                href={ex.video}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[10px] font-medium text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 rounded px-1.5 py-0.5 transition-colors"
              >
                ▶ ดูวิดีโอ
              </a>
            )}
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${muscleColor[ex.muscle]}`}>
            {ex.muscle}
          </span>
        </div>
        {ex.weight && (
          <p className="text-xs font-semibold text-emerald-400 mb-1.5">{ex.weight}</p>
        )}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500 mb-2">
          <span className="text-gray-300">{ex.sets}×{ex.reps}</span>
          <span className="text-gray-700">·</span>
          <span>พัก {ex.rest}</span>
          <span className="text-gray-700">·</span>
          <span>{ex.tempo}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{ex.cue}</p>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
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
            <h1 className="text-xl font-semibold text-white">แผนฝึก — Recomp Edition</h1>
          </div>
          <p className="text-sm text-gray-500 pl-6">ฝึก 3×/สัปดาห์ · Quality sets · พักฟื้น 48–96h · เดินลู่ไม่จับบาร์</p>
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
            <h2 className="text-base font-semibold text-white">Workout B · ช่วงบน (อก + หลัง + ไหล่)</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20 px-4">
            {mondayExercises.map((ex, i) => <ExerciseRow key={ex.name} ex={ex} index={i + 1} />)}
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
            <h2 className="text-base font-semibold text-white">Workout A · ช่วงล่าง + แขน</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20 px-4">
            {wednesdayExercises.map((ex, i) => <ExerciseRow key={ex.name} ex={ex} index={i + 1} />)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>เดินลู่ชัน 5–6% · 10 นาที · 3.5 กม./ชม. · ไม่จับบาร์</span>
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
            <h2 className="text-base font-semibold text-white">Workout C · ช่วงบนกระชับ + แขน</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20 px-4">
            {fridayExercises.map((ex, i) => <ExerciseRow key={ex.name} ex={ex} index={i + 1} />)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>เดินลู่ชัน 5% · 10 นาที · 3.5 กม./ชม. · ไม่จับบาร์</span>
          </div>
        </section>

        {/* ── Sat/Sun divider ── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest shrink-0">เสาร์–อาทิตย์</span>
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 shrink-0">พักเต็มที่ · นอน · โปรตีน · น้ำ</span>
        </div>

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
