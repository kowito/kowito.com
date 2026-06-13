"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Dumbbell, Footprints, Utensils, Play, Heart } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "Chest" | "Back" | "Shoulders" | "Triceps" | "Biceps" | "Legs" | "Glutes" | "Core" | "Arms"

type Exercise = {
  name: string
  machine: string
  altMachine?: string
  setup: string
  sets: number
  reps: number | string
  tempo: string
  rest: string
  cues: readonly string[]
  muscle: Muscle
  weight?: string
  video?: string
}

// ─── Exercise Library (single source of truth) ───────────────────────────────

const exercises = {
  latPulldown: {
    name: "Lat Pulldown",
    machine: "Lat Pulldown Machine",
    altMachine: "Iso-Lateral High Row",
    setup: "Sit upright, lock the thigh pad firmly, grip slightly wider than shoulders, and puff your chest up before pulling down",
    sets: 3,
    reps: "10–12",
    tempo: "Return slowly over 3s, fully stretch the lats",
    rest: "90 sec",
    cues: [
      "Puff chest up",
      "Drive elbows down to your waist",
      "Don&apos;t cheat with arm strength",
      "Return slowly over 3 seconds",
      "Fully stretch the lats"
    ],
    muscle: "Back" as Muscle,
    weight: "36 KG",
    video: "https://www.youtube.com/watch?v=bNmvKpJSWKM",
  },
  inclineChestPress: {
    name: "Incline Chest Press",
    machine: "Incline Chest Press Machine",
    altMachine: "Pec Fly Machine (lower the seat)",
    setup: "Set the seat to an incline (30–45°), tuck elbows in to form an arrow shape at 45–60°, grip narrower so forearms are vertical, pin shoulder blades into the pad, don&apos;t let shoulders lift",
    sets: 4,
    reps: "8–10",
    tempo: "Tuck elbows at 45°, lower slowly over 3s",
    rest: "90 sec",
    cues: [
      "Set 1: Drop to 30–35 KG to dial in form",
      "Sets 2–4: Go hard at 40 KG",
      "Tuck elbows 45–60° (no T-flare)",
      "Pin shoulder blades into the pad",
      "Lower slowly 1...2...3..."
    ],
    muscle: "Chest" as Muscle,
    weight: "36 KG",
    video: "https://www.youtube.com/shorts/98HWfiRonkE",
  },
  seatedCableRow: {
    name: "Seated Cable Row",
    machine: "Seated Cable Row",
    altMachine: "Chest-Supported Row Machine",
    setup: "Sit upright, chest out, pull the bar into your lower rib cage, keep your core braced throughout",
    sets: 3,
    reps: "10–12",
    tempo: "Pull 1s / squeeze shoulder blades 1s / return 3s",
    rest: "90 sec",
    cues: [
      "Sit upright, chest out",
      "Pull 1 second",
      "Squeeze shoulder blades 1 second",
      "Return slowly over 3 seconds",
      "Open up the chest, shoulders back"
    ],
    muscle: "Back" as Muscle,
    weight: "41 KG",
    video: "https://www.youtube.com/watch?v=LyZH4UGdDTc",
  },
  shoulderPress: {
    name: "Shoulder Press",
    machine: "Shoulder Press Machine",
    altMachine: "Dumbbell Shoulder Press",
    setup: "Hips glued to the seat, press straight up without arching your back. If the weight shakes, prioritize form first",
    sets: 2,
    reps: "8–10",
    tempo: "Stay pressed into the backrest, lower slowly over 3s to protect the joints",
    rest: "90 sec",
    cues: [
      "Stay pressed into the backrest",
      "Press straight up, no back arch",
      "Lower slowly 1...2...3...",
      "Protect the shoulder joints",
      "If it shakes, strip weight immediately"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "25 KG",
    video: "https://www.youtube.com/watch?v=6v4nrRVySj0",
  },
  legPress: {
    name: "Leg Press",
    machine: "Leg Press & Calf Raise",
    altMachine: "Lying/Seated Leg Curl",
    setup: "Place feet high and wide on the platform, brace your core and stabilize your torso before pressing. Don&apos;t let knees cave inward",
    sets: 5,
    reps: "10–12",
    tempo: "Press out 1s / return slowly counting 1...2...3...",
    rest: "90 sec",
    cues: [
      "Place feet high and wide",
      "Brace core, torso stable",
      "Press out with controlled rhythm",
      "Return slowly 1...2...3...",
      "No-Squat Edition – knee-friendly"
    ],
    muscle: "Legs" as Muscle,
    weight: "50 KG",
    video: "https://www.youtube.com/watch?v=L3B4nwqHufs",
  },
  hipThrust: {
    name: "Hip Thrust",
    machine: "Smith Machine Hip Thrust",
    altMachine: "Cable Pull-Through",
    setup: "Pull a bench under your shoulder blades, pad the bar at your hip crease and make sure it&apos;s secure before starting",
    sets: 3,
    reps: "12–15",
    tempo: "Drive hips up to full extension, squeeze glutes hard at the top for a full 2 seconds",
    rest: "60 sec",
    cues: [
      "Drive hips to full lockout",
      "Squeeze glutes for 2 seconds",
      "Build firm, shapely glutes"
    ],
    muscle: "Glutes" as Muscle,
    weight: "40 KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  chestPress: {
    name: "Chest Press",
    machine: "Chest Press Machine",
    altMachine: "Pec Fly Machine",
    setup: "Lower the seat so the handles align exactly at nipple level. Puff your chest and pin your shoulder blades firmly into the pad",
    sets: 4,
    reps: "8–10",
    tempo: "Pin shoulder blades into the pad, press sharply, return slowly over 3s",
    rest: "90 sec",
    cues: [
      "Pin shoulder blades firmly into the pad",
      "Press sharp and focused",
      "Return slowly 1...2...3...",
      "Full chest emphasis"
    ],
    muscle: "Chest" as Muscle,
    weight: "56 KG",
    video: "https://www.youtube.com/shorts/Qu7-ceCvq7w",
  },
  tricepsPushdown: {
    name: "Triceps Pushdown",
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Set the pulley low, use a rope or straight bar, elbows glued to your sides, depress your shoulders before starting. Pick a weight where reps 8–10 feel hard",
    sets: 3,
    reps: "8–10",
    tempo: "Lock elbows in place, return slowly over 3s (last set: do Lengthened Partials for 4–5 reps in the bottom half)",
    rest: "2–3 min",
    cues: [
      "Lock elbows firmly at your sides",
      "Press and squeeze triceps till they burn",
      "Return slowly 1...2...3...",
      "Set 3: Lengthened Partials bottom half 4–5 reps"
    ],
    muscle: "Triceps" as Muscle,
    weight: "36 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  bicepsCurl: {
    name: "Biceps Curl",
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "Set the pulley low, grip the bar or rope, pin your elbows firmly at your sides and lock your wrists stable",
    sets: 3,
    reps: "8–10",
    tempo: "Pin elbows, no swinging, return slowly over 3s (last set: do Lengthened Partials for 4–5 reps in the bottom half)",
    rest: "2–3 min",
    cues: [
      "Pin elbows at your sides",
      "No momentum, no swinging",
      "Squeeze the biceps tight",
      "Return slowly 1...2...3...",
      "Set 3: Lengthened Partials bottom half 4–5 reps"
    ],
    muscle: "Biceps" as Muscle,
    weight: "25 KG",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
  gluteBridge: {
    name: "Glute Bridge",
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, knees bent, feet flat on the floor hip-width apart. Arms at your sides, palms down",
    sets: 3,
    reps: 15,
    tempo: "Drive hips up, squeeze glutes at the top for 1s, lower slowly",
    rest: "30 sec",
    cues: [
      "Drive through your heels",
      "Squeeze glutes hard at the top",
      "Don&apos;t hyperextend your back",
      "Keep your core braced"
    ],
    muscle: "Glutes" as Muscle,
  },
  deadBug: {
    name: "Dead Bug",
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, arms extended toward the ceiling, hips and knees bent at 90°. Press your lower back into the floor",
    sets: 3,
    reps: "10–12 per side",
    tempo: "Slow and controlled — extend opposite arm and leg, return, repeat",
    rest: "30 sec",
    cues: [
      "Press lower back flat into the floor",
      "Move slowly, no rushing",
      "Keep your core braced throughout",
      "Don&apos;t let your back arch"
    ],
    muscle: "Core" as Muscle,
  },
  hipFlexorStretch: {
    name: "Hip Flexor Stretch (Couch Stretch)",
    machine: "Wall / Couch / Mat",
    setup: "Kneel in front of a wall or couch. Place one foot flat on the floor in front, the other shin vertical against the wall behind you. Keep your torso upright",
    sets: 1,
    reps: "1–2 min per side",
    tempo: "Hold the stretch, breathe deeply, relax into it",
    rest: "—",
    cues: [
      "Keep your torso upright",
      "Squeeze the glute on the stretched side",
      "Breathe deeply and relax",
      "Don&apos;t arch your lower back"
    ],
    muscle: "Core" as Muscle,
  },
  lowerBackStretch: {
    name: "Lower Back Stretch (Child&apos;s Pose)",
    machine: "Mat",
    setup: "Kneel on the mat, sit back on your heels, fold forward and extend your arms in front. Rest your forehead on the mat",
    sets: 1,
    reps: "1–2 min",
    tempo: "Hold the stretch, breathe deeply, let your lower back release",
    rest: "—",
    cues: [
      "Sit your hips back toward your heels",
      "Extend your arms forward",
      "Breathe deeply into your lower back",
      "Let gravity do the work"
    ],
    muscle: "Core" as Muscle,
  },
} as const

// ─── Workout Programs ────────────────────────────────────────────────────────

const mondayExercises = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
  exercises.gluteBridge,
  exercises.deadBug,
  exercises.latPulldown,
  exercises.inclineChestPress,
  exercises.seatedCableRow,
  exercises.shoulderPress,
] as const

const wednesdayExercises = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
  exercises.gluteBridge,
  exercises.deadBug,
  exercises.legPress,
  exercises.hipThrust,
  exercises.chestPress,
  exercises.tricepsPushdown,
  exercises.bicepsCurl,
] as const

const fridayExercises = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
  exercises.gluteBridge,
  exercises.deadBug,
  exercises.chestPress,
  exercises.seatedCableRow,
  exercises.shoulderPress,
  exercises.tricepsPushdown,
  exercises.bicepsCurl,
] as const



const globalRules = [
  { topic: "Intensity", rule: "Working sets at 100% quality. Reps 8–10 must still be controlled with good form, leaving only RIR 1–2 in reserve" },
  { topic: "Rest Periods", rule: "Don&apos;t rush. Rest a full 2–3 min on arm exercises and follow the prescribed rest on all main lifts every set" },
  { topic: "Pre-Gym", rule: "1.5–2 hours before training, eat 1 small scoop of jasmine rice or 1 slice of white bread to top off glycogen. No carbs during the session" },
  { topic: "Intra-Workout", rule: "Bring a sugary drink to sip slowly during longer rest periods to keep your nervous system fueled" },
  { topic: "Post-Workout (Critical)", rule: "Sit and cool down 15–20 min before consuming 1.5 scoops BAAM whey + ice-cold water (cut oat milk 100%), or unsweetened almond/pistachio milk to prevent an insulin spike" },
  { topic: "Creatine", rule: "Take 3–5g every single day, any time (no need to sync with training). Mix it into your BAAM whey or plain water. Consistency is key" },
  { topic: "Protein", rule: "Daily protein target: 1.6–2.0g per kg of bodyweight. Hit it every day to repair and build muscle" },
  { topic: "Water Intake", rule: "Push it up to 3.5–4.5 liters per day, every day. Water is the main vehicle for mobilizing belly fat" },
  { topic: "Training Frequency", rule: "Train 3 days per week. Rest days between sessions are when real muscle recovery happens" },
  { topic: "Cardio", rule: "Training days: incline treadmill walk 5–8% after lifting, speed 3.5–3.8 km/h, no holding the rails. Rest days: Zone 2 steady-state cardio, heart rate 120–125 bpm" },
]

const weekOverview = [
  { label: "Mon", tag: "Train", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Tue", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "Wed", tag: "Train", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Thu", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "Fri", tag: "Train", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Sat", tag: "Optional", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sun", tag: "Rest", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
]

// ─── Components ──────────────────────────────────────────────────────────────

function ExerciseRow({
  ex,
  completedSets,
  onToggleSet,
}: {
  ex: Exercise
  completedSets: boolean[]
  onToggleSet: (setIndex: number) => void
}) {
  const allDone = completedSets.every((s) => s)

  return (
    <div className={`border-b border-gray-800/50 last:border-0 px-4 py-4 space-y-3 ${allDone ? "opacity-60" : ""}`}>
      {/* Name + weight */}
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{ex.name}</h3>
        {ex.weight && (
          <span className="text-2xl font-bold text-blue-400 tabular-nums">{ex.weight}</span>
        )}
      </div>

      {/* Sets × Reps + Rest + Tempo */}
      <div className="space-y-0.5">
        <div className="text-sm text-white">
          {ex.sets}×{ex.reps} <span className="text-gray-500">• Rest {ex.rest}</span>
        </div>
        <div className="text-xs text-gray-500">
          Tempo: {ex.tempo}
        </div>
      </div>

      {/* Set tracking checkboxes */}
      <div className="flex gap-2">
        {Array.from({ length: ex.sets }).map((_, i) => (
          <button
            key={i}
            onClick={() => onToggleSet(i)}
            className={`flex-1 py-2 text-xs font-medium border rounded transition-all ${completedSets[i]
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-gray-700 text-gray-500 hover:border-emerald-500/50"
              }`}
          >
            {completedSets[i] ? "✓" : ""} Set {i + 1}
          </button>
        ))}
      </div>

      {/* Machine info */}
      <div className="text-xs text-gray-500 space-y-0.5">
        <div>
          <span className="text-gray-600">Machine:</span> {ex.machine}
        </div>
        {ex.altMachine && (
          <div>
            <span className="text-gray-600">Alt:</span> {ex.altMachine}
          </div>
        )}
        <div>
          <span className="text-gray-600">Setup:</span> {ex.setup}
        </div>
        {ex.video && (
          <a
            href={ex.video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
          >
            <Play className="h-3 w-3" />
            Video
          </a>
        )}
      </div>

      {/* All cues */}
      <div className="space-y-1">
        <div className="text-xs text-gray-600">Tips</div>
        {ex.cues.map((cue, i) => (
          <div key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
            <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
            <span>{cue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="container mx-auto max-w-2xl px-4 pt-6 pb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          Kowit C.
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/diet" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <Utensils className="h-3.5 w-3.5" />
            Diet Plan
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 pb-24 space-y-10">

        {/* Heading */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="h-4 w-4 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-semibold text-white">Training Plan — Recomp Edition (Flexible Machine Version)</h1>
          </div>
          <p className="text-sm text-gray-500 pl-6">Train 3×/week · No-Squat Edition · Plan B on all lifts · Treadmill walk, no holding rails</p>
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
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Monday</span>
            <h2 className="text-base font-semibold text-white">Workout A · Chest + Back + Shoulders</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20">
            {mondayExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name + i}
                ex={ex}
                completedSets={mondaySets[i]}
                onToggleSet={(setIndex) => toggleSet("monday", i, setIndex)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>Incline treadmill 6–8% · 15–20 min · 3.8 km/h · no holding rails</span>
          </div>
        </section>

        {/* ── Tue divider ── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest shrink-0">Tuesday</span>
          <div className="flex-1 h-px bg-blue-900/50" />
          <div className="flex items-center gap-1.5 text-xs text-blue-300 shrink-0">
            <Heart className="h-3 w-3" />
            <span>Zone 2 · 60 min · HR 120–125</span>
          </div>
        </div>

        {/* ── Wednesday ── */}
        <section>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Wednesday</span>
            <h2 className="text-base font-semibold text-white">Workout B · Legs + Arms + Extra Chest</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20">
            {wednesdayExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name + i}
                ex={ex}
                completedSets={wednesdaySets[i]}
                onToggleSet={(setIndex) => toggleSet("wednesday", i, setIndex)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>Incline treadmill 6–8% · 15–20 min · 3.8 km/h · no holding rails</span>
          </div>
        </section>

        {/* ── Thu divider ── */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest shrink-0">Thursday</span>
          <div className="flex-1 h-px bg-blue-900/50" />
          <div className="flex items-center gap-1.5 text-xs text-blue-300 shrink-0">
            <Heart className="h-3 w-3" />
            <span>Zone 2 · 60 min · HR 120–125</span>
          </div>
        </div>

        {/* ── Friday ── */}
        <section>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Friday</span>
            <h2 className="text-base font-semibold text-white">Workout C · Chest Focus + Back + Arms</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/20">
            {fridayExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.name + i}
                ex={ex}
                completedSets={fridaySets[i]}
                onToggleSet={(setIndex) => toggleSet("friday", i, setIndex)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 px-1">
            <Footprints className="h-3 w-3 shrink-0" />
            <span>Incline treadmill 6–8% · 15–20 min · 3.8 km/h · no holding rails</span>
          </div>
        </section>

        {/* ── Sat/Sun divider ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest shrink-0">Saturday</span>
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-500 shrink-0">Choose: Walk 45–60 min / Zone 2 45–60 min / Rest</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest shrink-0">Sunday</span>
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600 shrink-0">Full rest</span>
          </div>
        </div>

        {/* ── Ab & Back Machine Bonus ── */}
        <section className="border-2 border-dashed border-violet-500/30 rounded-xl p-4 bg-violet-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">🛠️ Bonus Weapon</span>
            <h2 className="text-base font-semibold text-white">Ab & Back Machine</h2>
          </div>
          <div className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
            <p>
              <span className="font-semibold text-violet-300">💡 How to use:</span>{" "}
              Any day you still feel you have gas left in the tank after lifting, or on{" "}
              <span className="font-semibold text-sky-300">&ldquo;Tuesday (active recovery day)&rdquo;</span>{" "}
              you can go hit this machine as a bonus.
            </p>
            <div className="flex items-start gap-2 bg-gray-900/40 rounded-lg p-3 border border-gray-800">
              <span className="text-[10px] text-amber-400 font-semibold shrink-0 mt-0.5">Exercise:</span>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-gray-300">
                  <span className="font-semibold">Ab Crunch</span> (forward trunk flexion)
                </p>
                <p className="text-xs text-gray-500">
                  2 sets × 15 reps · Focus on deep core contraction · Increase intra-abdominal pressure
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Nutrition ── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">Nutrition + Recovery</h2>
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
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">3 Key Techniques</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 w-28 pt-0.5">Eccentric 3s</span>
              <p className="text-sm text-gray-400 leading-relaxed">Lower the weight slowly 1...2...3... every single rep. Increases Time Under Tension and Metabolic Stress</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-bold text-amber-400 shrink-0 w-28 pt-0.5">Double Prog.</span>
              <p className="text-sm text-gray-400 leading-relaxed">Hold the weight until you can complete every rep of every set cleanly, then add 1–2 plates</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-bold text-pink-400 shrink-0 w-28 pt-0.5">Leng. Partials</span>
              <p className="text-sm text-gray-400 leading-relaxed">Last set of arm exercises: when you can&apos;t complete full reps anymore, pump out 4–5 more in the bottom half range</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
