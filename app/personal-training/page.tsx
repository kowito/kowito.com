import Link from "next/link"
import { ArrowLeft, Dumbbell, Timer, Repeat2, Zap, Info, Bike, Utensils } from "lucide-react"
import type { ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "Chest" | "Back" | "Triceps" | "Biceps" | "Legs" | "Glutes" | "Core"
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
    machine: "Chest Press Machine",
    setup: "Set the seat so the handles line up with mid-chest. Keep both feet flat and your back fully against the pad.",
    sets: 2, reps: 8,
    tempo: "1s push / 2s return",
    rest: "75–90s",
    cue: "Start lighter than you think you need. Press smoothly, keep your shoulders down, and stop the set if the weight suddenly feels jerky or your shoulders roll forward.",
    muscle: "Chest",
  },
  {
    name: "Lat Pulldown",
    machine: "Lat Pulldown Machine",
    setup: "Lock the thigh pad snug over your legs. Grab the bar just outside shoulder-width and sit tall with your chest lifted.",
    sets: 2, reps: 8,
    tempo: "1s pull / 2s return",
    rest: "75–90s",
    cue: "Pull the bar to the top of your chest without swinging your body. If you need to lean far back or yank the bar, the weight is too heavy.",
    muscle: "Back",
  },
  {
    name: "Leg Press",
    machine: "Leg Press Machine",
    setup: "Place your feet shoulder-width in the middle of the platform. Keep your lower back flat against the pad the whole time.",
    sets: 2, reps: 10,
    tempo: "Controlled down / push up",
    rest: "90s",
    cue: "Lower only as far as feels smooth and pain-free, then press through your whole foot to come back up. Stop before your knees lock out.",
    muscle: "Legs",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "Seated Row",
    machine: "Row Machine",
    setup: "Sit tall with your chest against the pad, feet planted on the footrests, and hands on the neutral-grip handles.",
    sets: 2, reps: 8,
    tempo: "1s pull / 2s return",
    rest: "75–90s",
    cue: "Keep your chest on the pad the whole set. Pull to your lower ribs, pause briefly, then return slowly without shrugging your shoulders.",
    muscle: "Back",
  },
  {
    name: "Pec Deck",
    machine: "Pec Deck Machine",
    setup: "Adjust the seat so your elbows line up with chest height. Start with a small range of motion and increase it only if it feels smooth.",
    sets: 2, reps: 10,
    tempo: "Slow",
    rest: "60–75s",
    cue: "Open only until you feel a comfortable stretch, then bring the pads together smoothly. This should feel controlled, not like a max-effort chest workout.",
    muscle: "Chest",
  },
  {
    name: "Hip Thrust",
    machine: "Hip Thrust Machine",
    setup: "Place the pad across your hips, feet flat about shoulder-width apart, and rest your shoulder blades on the bench edge.",
    sets: 2, reps: 8,
    tempo: "1s up / 2s lower",
    rest: "90s",
    cue: "Use a light weight and lift only until your body forms a straight line. If you feel this more in your lower back than your glutes, shorten the range and slow down.",
    muscle: "Glutes",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "Chest Press",
    machine: "Chest Press Machine",
    setup: "Set the seat so the handles line up with mid-chest. Keep both feet flat and your back fully against the pad.",
    sets: 2, reps: 8,
    tempo: "1s push / 2s return",
    rest: "75–90s",
    cue: "Use the same weight as Monday unless Monday felt genuinely easy. The goal is to finish the week feeling consistent, not wrecked.",
    muscle: "Chest",
  },
  {
    name: "Seated Row",
    machine: "Row Machine",
    setup: "Sit tall with your chest against the pad, feet planted on the footrests, and hands on the neutral-grip handles.",
    sets: 2, reps: 8,
    tempo: "1s pull / 2s return",
    rest: "75–90s",
    cue: "Pull the handles back with control and keep your chest planted on the pad. Stop one rep before your posture starts to slip.",
    muscle: "Back",
  },
  {
    name: "Leg Press",
    machine: "Leg Press Machine",
    setup: "Place your feet shoulder-width in the middle of the platform. Keep your lower back flat against the pad the whole time.",
    sets: 2, reps: 10,
    tempo: "Controlled",
    rest: "90s",
    cue: "Repeat the same calm, controlled reps from Monday. If your knees or hips feel irritated, shorten the range and finish there.",
    muscle: "Legs",
  },
]

const tuesdayStretches: Stretch[] = [
  { name: "Chest Stretch", how: "Doorway stretch — arm at 90\u00b0, lean forward gently", duration: "2 min" },
  { name: "Back Stretch", how: "Reach both arms forward while seated, round your upper back", duration: "2 min" },
  { name: "Quad Stretch", how: "Stand, pull one foot to glutes, hold with same-side hand", duration: "1 min each side" },
  { name: "Hamstring Stretch", how: "Sit on floor, legs straight, reach toward feet", duration: "1–2 min" },
  { name: "Optional Bike", how: "Easy pace — barely above a stroll, heart rate stays low", duration: "10–15 min" },
]

const globalRules = [
  { topic: "Effort", rule: "Finish each set with 3–4 reps still in the tank. This should feel manageable, not brutal." },
  { topic: "Volume", rule: "Only 3 exercises per training day and 2 work sets each for now." },
  { topic: "Cardio", rule: "Easy bike only. You should be able to talk in full sentences the entire time." },
  { topic: "Session length", rule: "25–35 min total. Leave the gym feeling like you could still do a bit more." },
  { topic: "Progression", rule: "Add reps first. Only add weight after a full week feels comfortable." },
  { topic: "Training frequency", rule: "3\u00d7 per week. Rest days between sessions are not optional — they\u2019re when you grow." },
]

const weekOverview = [
  { label: "Mon", tag: "Train", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Tue", tag: "Rest", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "Wed", tag: "Train", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Thu", tag: "Rest", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { label: "Fri", tag: "Train", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Sat", tag: "Opt.", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sun", tag: "Rest", style: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
]

// ─── Components ──────────────────────────────────────────────────────────────

const muscleColor: Record<Muscle, string> = {
  Chest: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  Back: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  Triceps: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  Biceps: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  Legs: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  Glutes: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
  Core: "bg-lime-500/15 text-lime-300 border-lime-500/25",
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
        <span className="text-gray-500 font-medium uppercase tracking-wide text-[10px] mr-1.5">Setup</span>
        {ex.setup}
      </div>

      {/* Stats row */}
      <div className="px-5 pb-3 grid grid-cols-3 gap-2">
        <StatPill
          icon={<Repeat2 className="h-3 w-3" />}
          label="Sets × Reps"
          value={`${ex.sets}\u00d7${ex.reps}`}
        />
        <StatPill
          icon={<Zap className="h-3 w-3" />}
          label="Tempo"
          value={ex.tempo}
        />
        <StatPill
          icon={<Timer className="h-3 w-3" />}
          label="Rest"
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
        <span className="text-sm font-semibold text-white">Easy Bike</span>
        <span className="ml-auto text-xs text-gray-400">{minutes} min total</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Warm-up</span>
          </div>
          <div className="h-6 w-16 rounded-md bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
            <span className="text-[10px] text-sky-300 font-medium">0–2 min</span>
          </div>
          <span className="text-xs text-gray-300">Very easy pace. Just get warm and breathe through your nose if you can.</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Ride</span>
          </div>
          <div className="h-6 flex-1 rounded-md bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-[10px] text-emerald-300 font-medium">{easyMinutes} min easy pace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Cool-down</span>
          </div>
          <div className="h-6 w-16 rounded-md bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
            <span className="text-[10px] text-cyan-300 font-medium">last 2 min</span>
          </div>
          <span className="text-xs text-gray-300">Slow down and finish feeling better than when you started.</span>
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
            Diet Plan
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 pb-20">
        {/* Page heading */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-6 w-6 text-emerald-400 shrink-0" />
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Personal Training Plan</h1>
          </div>
          <p className="max-w-xl text-gray-400 text-sm leading-relaxed">
            Starter plan for a complete beginner, 3&times;/week. Three machine exercises plus easy bike on each
            training day. Built to feel manageable so you can keep showing up.
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
            <span className="font-medium text-white block mb-0.5">Starter Flow</span>
            3 exercises &rarr; easy bike &rarr; go home
          </div>
        </div>

        {/* Day cards */}
        <div className="space-y-5">

          {/* ── Monday ── */}
          <DayCard day="Monday" title="Starter Workout A" type="train">
            <ExerciseGrid exercises={mondayExercises} />
            <EasyBike minutes={8} />
          </DayCard>

          {/* ── Tuesday ── */}
          <DayCard day="Tuesday" title="Active Rest" type="rest">
            <p className="text-sm text-gray-400 -mt-2 mb-1">
              Light movement to flush soreness. Don&rsquo;t skip stretching — it helps Wednesday feel better.
            </p>
            <StretchList stretches={tuesdayStretches} />
          </DayCard>

          {/* ── Wednesday ── */}
          <DayCard day="Wednesday" title="Starter Workout B" type="train">
            <ExerciseGrid exercises={wednesdayExercises} />
            <EasyBike minutes={8} />
          </DayCard>

          {/* ── Thursday ── */}
          <DayCard day="Thursday" title="Full Rest" type="rest">
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Complete rest. Muscles repair and grow during recovery, not during training. Protect this day.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Sleep 7–9 hours", "Hit your protein target", "Optional: 5 min light stretch"].map((tip) => (
                  <span key={tip} className="rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200">
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          </DayCard>

          {/* ── Friday ── */}
          <DayCard day="Friday" title="Starter Workout C" type="train">
            <ExerciseGrid exercises={fridayExercises} />
            <EasyBike minutes={8} />
          </DayCard>

          {/* ── Saturday ── */}
          <DayCard day="Saturday" title="Optional" type="optional">
            <p className="text-sm text-gray-400 -mt-2 mb-3">
              Light activity only — this is not a training day. Keep heart rate low.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm">
                <p className="font-medium text-amber-200">Steady bike ride</p>
                <p className="text-amber-300/70 text-xs mt-0.5">15–20 min at a comfortable, moderate pace</p>
              </div>
              <div className="rounded-2xl border border-gray-700 bg-gray-900/30 px-4 py-3 text-sm">
                <p className="font-medium text-gray-300">Or full rest</p>
                <p className="text-gray-500 text-xs mt-0.5">Either is fine — listen to your body</p>
              </div>
            </div>
          </DayCard>

          {/* ── Sunday ── */}
          <DayCard day="Sunday" title="Full Rest" type="rest">
            <p className="text-sm text-gray-400 -mt-2 mb-3">
              Complete recovery. Prepare for next week.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Sleep", note: "Priority #1 for recovery" },
                { label: "Protein intake", note: "Keep hitting your daily target" },
                { label: "Hydration", note: "Especially after a full week of training" },
              ].map(({ label, note }) => (
                <div key={label} className="rounded-2xl border border-rose-500/20 bg-rose-500/8 px-4 py-2.5">
                  <p className="text-sm font-medium text-rose-200">{label}</p>
                  <p className="text-[10px] text-rose-300/60 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </DayCard>

          {/* ── Global Rules ── */}
          <DayCard day="Always" title="Global Rules" type="special">
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
