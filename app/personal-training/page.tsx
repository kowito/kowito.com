"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
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
  /** Optional intensity tag, e.g. "80% RM", "Volume", "Heavy". */
  intensity?: string
  tempo: string
  rest: string
  cues: readonly string[]
  muscle: Muscle
  target?: string
  secondaryMuscles?: readonly string[]
  weight?: string
  video?: string
  /** Folder under /public/exercises containing 0.jpg (start) and 1.jpg (end). */
  img?: string
}

// ─── Exercise Library (single source of truth) ───────────────────────────────

const exercises = {
  latPulldown: {
    name: "Lat Pulldown",
    img: "latPulldown",
    target: "Lats",
    secondaryMuscles: ["Biceps", "Rhomboids"],
    machine: "Lat Pulldown Machine",
    altMachine: "Iso-Lateral High Row",
    setup: "Sit upright, lock the thigh pad firmly, grip slightly wider than shoulders, and puff your chest up before pulling down",
    sets: 3,
    reps: "8–10",
    tempo: "Drive elbows straight down to your waist (1s), then return slowly over 3s to fully stretch the lats",
    rest: "90 sec",
    cues: [
      "Puff chest up",
      "Drive elbows down to your waist",
      "Don't cheat with arm strength",
      "Return slowly over 3 seconds",
      "Fully stretch the lats"
    ],
    muscle: "Back" as Muscle,
    weight: "52 KG",
    video: "https://www.youtube.com/watch?v=bNmvKpJSWKM",
  },
  inclineChestPress: {
    name: "Incline Chest Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Incline Chest Press Machine",
    altMachine: "Pec Fly Machine (lower the seat)",
    setup: "Set the seat to a 30–45° incline. Tuck elbows in at a 45–60° angle (arrow shape, no T-flare). Pin shoulder blades firmly into the back pad",
    sets: 4,
    reps: "6–8",
    intensity: "80% RM",
    tempo: "Press sharply, then lower slowly counting 1...2...3... (Eccentric Overload)",
    rest: "90–120 sec",
    cues: [
      "True heavy set — recruit Type 2 fibers",
      "Tuck elbows 45–60° (no T-flare)",
      "Pin shoulder blades into the pad",
      "Press sharp, lower slow 1...2...3...",
      "Stop at RIR 1–2 with clean form"
    ],
    muscle: "Chest" as Muscle,
    weight: "40 KG",
    video: "https://www.youtube.com/shorts/98HWfiRonkE",
  },
  inclineChestPressVolume: {
    name: "Incline Chest Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Incline Chest Press Machine",
    altMachine: "Pec Fly Machine (lower the seat)",
    setup: "Same incline setup as Monday — 30–45° seat, elbows tucked 45–60°, shoulder blades pinned into the pad",
    sets: 3,
    reps: "8–10",
    intensity: "Volume",
    tempo: "Controlled press up, then a slow 3-second negative",
    rest: "90 sec",
    cues: [
      "Volume builder after the heavy flat press",
      "Controlled press, no bouncing",
      "Slow 3-second negative every rep",
      "Keep shoulder blades pinned"
    ],
    muscle: "Chest" as Muscle,
    weight: "36–40 KG",
    video: "https://www.youtube.com/shorts/98HWfiRonkE",
  },
  seatedCableRow: {
    name: "Seated Cable Row",
    img: "seatedCableRow",
    target: "Upper Back",
    secondaryMuscles: ["Rhomboids", "Rear Delts"],
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
    img: "shoulderPress",
    target: "Shoulders",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Shoulder Press Machine",
    altMachine: "Dumbbell Shoulder Press",
    setup: "Hips glued to the seat backrest. Press straight up without arching your lower back. If the weight shakes, prioritize form first",
    sets: 3,
    reps: "6–8",
    intensity: "Heavy",
    tempo: "Press up cleanly, then lower slowly 1...2...3... to insulate the shoulder joints from injury",
    rest: "90 sec",
    cues: [
      "Stay pressed into the backrest",
      "Press straight up, no back arch",
      "Lower slowly 1...2...3...",
      "Protect the shoulder joints",
      "If it shakes, strip weight immediately"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "32 KG",
    video: "https://www.youtube.com/watch?v=6v4nrRVySj0",
  },
  legPress: {
    name: "Leg Press",
    img: "legPress",
    target: "Quads",
    secondaryMuscles: ["Hamstrings", "Glutes"],
    machine: "Leg Press & Calf Raise",
    altMachine: "Lying/Seated Leg Curl",
    setup: "Place feet high and wide on the platform to maximize glute/hamstring engagement and protect the patellar tendon. Brace your core tightly and don't let your knees cave inward",
    sets: 4,
    reps: "8–10",
    tempo: "Press out smoothly (1s), then lower slowly over 3 full seconds (Eccentric 3s)",
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
    img: "hipThrust",
    target: "Glutes",
    secondaryMuscles: ["Hamstrings"],
    machine: "Smith Machine Hip Thrust",
    altMachine: "Cable Pull-Through",
    setup: "Position the bench securely under your shoulder blades and pad the bar at your hip crease",
    sets: 3,
    reps: "8–10",
    intensity: "80% RM",
    tempo: "Explode up powerfully (1s for power), squeeze glutes at full lockout for 2s, then lower slowly over 3s (Eccentric 3s)",
    rest: "90 sec",
    cues: [
      "Drive hips to full lockout",
      "Squeeze glutes for 2 seconds",
      "Build firm, shapely glutes"
    ],
    muscle: "Glutes" as Muscle,
    weight: "60 KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  chestPress: {
    name: "Chest Press",
    img: "chestPress",
    target: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Chest Press Machine",
    altMachine: "Pec Fly Machine",
    setup: "Lower the seat so the handles align exactly at nipple level. Puff your chest and pin your shoulder blades firmly into the pad",
    sets: 4,
    reps: "6–8",
    intensity: "80% RM",
    tempo: "Press sharp and focused, then lower slowly over 3 full seconds (Eccentric 3s)",
    rest: "90–120 sec",
    cues: [
      "True heavy set — recruit Type 2 fibers",
      "Pin shoulder blades firmly into the pad",
      "Press sharp, lower slow 1...2...3...",
      "Full mid/lower chest emphasis"
    ],
    muscle: "Chest" as Muscle,
    weight: "56 KG",
    video: "https://www.youtube.com/shorts/Qu7-ceCvq7w",
  },
  tricepsPushdown: {
    name: "Triceps Pushdown",
    img: "tricepsPushdown",
    target: "Triceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Set the pulley low, use a rope or straight bar, elbows glued to your sides, depress your shoulders before starting. Pick a weight where reps 8–10 feel hard",
    sets: 3,
    reps: "8–10",
    tempo: "Lock elbows in place, return slowly over 3s (last set: do Lengthened Partials for 4–5 reps in the bottom half)",
    rest: "2 min",
    cues: [
      "Lock elbows firmly at your sides",
      "Press and squeeze triceps till they burn",
      "Return slowly 1...2...3...",
      "Set 3: Lengthened Partials bottom half 4–5 reps"
    ],
    muscle: "Triceps" as Muscle,
    weight: "42 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  bicepsCurl: {
    name: "Biceps Curl",
    img: "bicepsCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "Set the pulley low, grip the bar or rope, pin your elbows firmly at your sides and lock your wrists stable",
    sets: 3,
    reps: "8–10",
    tempo: "Pin elbows, no swinging, return slowly over 3s (last set: do Lengthened Partials for 4–5 reps in the bottom half)",
    rest: "2 min",
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
  rearDeltFly: {
    name: "Rear Delt Fly",
    img: "rearDeltFly",
    target: "Rear Delts",
    secondaryMuscles: ["Upper Back"],
    machine: "Rear Delt Fly Machine (Reverse Pec Deck)",
    altMachine: "Cable Rope Rear-Delt Row",
    setup: "Sit facing the pad. Adjust the handles so your arms move parallel to the floor, and keep a slight bend in your elbows",
    sets: 3,
    reps: "10–12",
    tempo: "Fly outward smoothly, squeeze the back of your shoulders, then return slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Arms move parallel to the floor",
      "Keep a slight bend in the elbows",
      "Squeeze the rear delts at the back",
      "Return slowly 1...2...3...",
      "No momentum — control the weight"
    ],
    muscle: "Shoulders" as Muscle,
  },
  lateralRaise: {
    name: "Lateral Raise",
    img: "lateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Lateral Raise Machine",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Adjust the seat so the pads rest against your outer arms. Keep your shoulders depressed — do not engage your traps",
    sets: 4,
    reps: "10–12",
    tempo: "Raise outward smoothly, hold a split second at the peak, then lower slowly over 2–3s",
    rest: "60–90 sec",
    cues: [
      "Choose a load allowing strict form — no shrugging",
      "Keep shoulders depressed (no traps)",
      "Hold a split second at the top",
      "Lower slowly over 2–3 seconds",
      "Builds V-shape shoulder width"
    ],
    muscle: "Shoulders" as Muscle,
  },
  gluteBridge: {
    name: "Glute Bridge",
    img: "gluteBridge",
    target: "Glutes",
    secondaryMuscles: ["Hamstrings", "Core"],
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, knees bent, feet flat on the floor hip-width apart. Arms at your sides, palms down",
    sets: 3,
    reps: 15,
    tempo: "Drive hips up, squeeze glutes at the top for 1s, lower slowly",
    rest: "30 sec",
    cues: [
      "Drive through your heels",
      "Squeeze glutes hard at the top",
      "Don't hyperextend your back",
      "Keep your core braced"
    ],
    muscle: "Glutes" as Muscle,
  },
  deadBug: {
    name: "Dead Bug",
    img: "deadBug",
    target: "Core",
    secondaryMuscles: ["Hip Flexors", "Lower Back"],
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, arms extended toward the ceiling, hips and knees bent at 90°. Press your lower back into the floor",
    sets: 3,
    reps: 10,
    tempo: "Slow and controlled — extend opposite arm and leg, return, repeat",
    rest: "30 sec",
    cues: [
      "Press lower back flat into the floor",
      "Move slowly, no rushing",
      "Keep your core braced throughout",
      "Don't let your back arch"
    ],
    muscle: "Core" as Muscle,
  },
  hipFlexorStretch: {
    name: "Hip Flexor Stretch (Couch Stretch)",
    img: "hipFlexorStretch",
    target: "Hip Flexors",
    secondaryMuscles: ["Quads"],
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
      "Don't arch your lower back"
    ],
    muscle: "Core" as Muscle,
  },
  lowerBackStretch: {
    name: "Lower Back Stretch (Child's Pose)",
    img: "lowerBackStretch",
    target: "Lower Back",
    secondaryMuscles: ["Lats"],
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
  halfKneelingHipFlexorStretch: {
    name: "Half-Kneeling Hip Flexor Stretch",
    target: "Hip Flexors",
    secondaryMuscles: ["Quads", "Glutes"],
    machine: "Mat / Floor",
    setup: "Kneel on one knee, step the other leg forward, keep your torso upright, tighten your core and glutes",
    sets: 1,
    reps: "1 min per side",
    tempo: "Hold the stretch, shift your hips forward until you feel a stretch in the front of your hip",
    rest: "—",
    cues: [
      "Keep your torso upright",
      "Tighten your core and glutes",
      "Shift your hips forward",
      "Feel the stretch in the front of your hip",
      "Breathe deeply and relax"
    ],
    muscle: "Core" as Muscle,
  },
} as const

// ─── Workout Programs ────────────────────────────────────────────────────────

const warmup = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
  exercises.gluteBridge,
  exercises.deadBug,
] as const

// Monday · Workout A — Legs + Upper Chest
const mondayExercises = [
  ...warmup,
  exercises.legPress,
  exercises.hipThrust,
  exercises.inclineChestPress,
] as const

// Wednesday · Workout B — Back + Rear Delts + Biceps
const wednesdayExercises = [
  ...warmup,
  exercises.latPulldown,
  exercises.seatedCableRow,
  exercises.rearDeltFly,
  exercises.bicepsCurl,
] as const

// Friday · Workout C — Chest + Shoulders + Triceps
const fridayExercises = [
  ...warmup,
  exercises.chestPress,
  exercises.inclineChestPressVolume,
  exercises.shoulderPress,
  exercises.lateralRaise,
  exercises.tricepsPushdown,
] as const

type DayKey = "monday" | "wednesday" | "friday"

const globalRules = [
  { topic: "Volume", rule: "Weekly direct chest sets = 11, direct shoulder sets = 10. Both clear the ≥10 sets/week threshold shown to trigger maximum hypertrophy in your priority areas." },
  { topic: "Intensity", rule: "Main pressing lifts stay at 6–8 reps (~80% RM). This maximizes recruitment of high-growth Type 2 (fast-twitch) fibers while preventing the CNS burnout of ultra-high-volume training." },
  { topic: "Eccentric 3s", rule: "Every rep of every lift uses a strict 3-second lowering phase to generate maximal mechanical tension and metabolic stress." },
  { topic: "Double Prog.", rule: "Hold the designated weight until you can hit the top of the rep range on all sets with perfect form and tempo — only then add the smallest possible increment." },
  { topic: "Leng. Partials", rule: "On the last set of arm isolations, once you reach full-range failure, pump out 4–5 partial reps in the stretched bottom half to fully exhaust the fibers." },
  { topic: "Nutrition", rule: "Target 1.6–2.0g protein per kg bodyweight daily. Meal frequency is secondary to the daily total — large protein-dense meals (post-workout shabu, heavy servings) work fine as long as the daily budget is met." },
  { topic: "Hydration", rule: "Drink 3.5–4.5 L water daily to clear metabolic waste and mobilize fat. Take 3–5g creatine monohydrate daily at any consistent time for full muscle phosphagen saturation." },
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

// ─── Progress persistence ────────────────────────────────────────────────────

type Progress = Record<DayKey, boolean[][]>

const STORAGE_KEY = "pt-progress-v4"

function blankProgress(): Progress {
  return {
    monday: mondayExercises.map((e) => Array(e.sets).fill(false)),
    wednesday: wednesdayExercises.map((e) => Array(e.sets).fill(false)),
    friday: fridayExercises.map((e) => Array(e.sets).fill(false)),
  }
}

// Reshape whatever was saved into the current program shape, dropping stale data.
function parseProgress(raw: string | null): Progress {
  const base = blankProgress()
  if (!raw) return base
  try {
    const saved = JSON.parse(raw)
      ; (Object.keys(base) as DayKey[]).forEach((day) => {
        const savedDay = saved?.[day]
        if (Array.isArray(savedDay) && savedDay.length === base[day].length) {
          base[day] = base[day].map((arr, i) =>
            Array.isArray(savedDay[i]) && savedDay[i].length === arr.length
              ? savedDay[i].map(Boolean)
              : arr
          )
        }
      })
  } catch {
    /* ignore corrupt storage */
  }
  return base
}

// ── localStorage-backed store (read via useSyncExternalStore, so it's
//    hydration-safe and doesn't need a setState-in-effect on load) ──
const serverSnapshot: Progress = blankProgress()
let cache: Progress | null = null
let cacheRaw: string | null = null
const listeners = new Set<() => void>()

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getSnapshot(): Progress {
  const raw = readRaw()
  if (cache && raw === cacheRaw) return cache // stable reference while unchanged
  cacheRaw = raw
  cache = parseProgress(raw)
  return cache
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null // force re-parse from the other tab's write
      onChange()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

function writeProgress(next: Progress) {
  cache = next
  try {
    cacheRaw = JSON.stringify(next)
    localStorage.setItem(STORAGE_KEY, cacheRaw)
  } catch {
    /* storage full or unavailable — keep the in-memory value */
  }
  listeners.forEach((l) => l())
}

// ─── Components ──────────────────────────────────────────────────────────────

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-0.5">{label}</div>
      <p className="text-[13px] text-gray-400 leading-relaxed">{children}</p>
    </div>
  )
}

function ExerciseRow({
  ex,
  completedSets,
  onToggleSet,
}: {
  ex: Exercise
  completedSets: boolean[]
  onToggleSet: (setIndex: number) => void
}) {
  const doneCount = completedSets.filter(Boolean).length
  const allDone = doneCount === ex.sets && ex.sets > 0

  return (
    <div className={`px-4 py-5 border-b border-gray-800/60 last:border-0 transition-colors ${allDone ? "bg-emerald-500/[0.04]" : ""}`}>
      {/* Demo photos: start & end position */}
      {ex.img && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {[0, 1].map((n) => (
            <div key={n} className="relative aspect-[3/2] overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
              <Image
                src={`/exercises/${ex.img}/${n}.jpg`}
                alt={`${ex.name} — ${n === 0 ? "start" : "end"} position`}
                fill
                sizes="(max-width: 640px) 45vw, 320px"
                className="object-cover"
                loading="eager"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-200">
                {n === 0 ? "Start" : "End"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Header: name + weight */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className={`text-[15px] font-semibold leading-tight ${allDone ? "text-emerald-300" : "text-white"}`}>
              {ex.name}
            </h3>
            {ex.target && (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                {ex.target}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] text-gray-400">
            {ex.sets} {ex.sets === 1 ? "set" : "sets"} × {ex.reps}
            {ex.intensity && (
              <span className="mx-2 rounded border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide text-amber-300">
                {ex.intensity}
              </span>
            )}
            <span className="text-gray-600"> · rest {ex.rest}</span>
          </p>
        </div>
        {ex.weight && (
          <div className="shrink-0 text-xl font-bold text-blue-400 tabular-nums leading-none">
            {ex.weight}
          </div>
        )}
      </div>

      {/* Set tracking */}
      <div className="mt-3 flex gap-2">
        {Array.from({ length: ex.sets }).map((_, i) => {
          const active = completedSets[i]
          return (
            <button
              key={i}
              onClick={() => onToggleSet(i)}
              aria-label={`Set ${i + 1}${active ? " done" : ""}`}
              className={`flex-1 h-10 rounded-lg border text-sm font-semibold transition-all active:scale-95 ${active
                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                : "border-gray-700 bg-gray-900/40 text-gray-500 hover:border-emerald-500/50 hover:text-gray-300"
                }`}
            >
              {active ? "✓" : i + 1}
            </button>
          )
        })}
      </div>

      {/* Muscles worked */}
      {ex.target && (
        <div className="mt-4">
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-600">Muscles worked</div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              {ex.target}
            </span>
            {ex.secondaryMuscles?.map((m) => (
              <span key={m} className="rounded-full border border-gray-700 bg-gray-800/50 px-2 py-0.5 text-[11px] text-gray-400">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* How to — always visible */}
      <div className="mt-4 space-y-3 rounded-lg border border-gray-800 bg-gray-900/40 p-3">
        <DetailBlock label="Machine">
          {ex.machine}
          {ex.altMachine && <span className="text-gray-600"> · alt: {ex.altMachine}</span>}
        </DetailBlock>
        <DetailBlock label="Setup">{ex.setup}</DetailBlock>
        <DetailBlock label="Tempo">{ex.tempo}</DetailBlock>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5">Tips</div>
          <ul className="space-y-1.5">
            {ex.cues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-gray-400">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>
        {ex.video && (
          <a
            href={ex.video}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] text-blue-400 hover:underline"
          >
            <Play className="h-3.5 w-3.5" />
            Watch demo video
          </a>
        )}
      </div>
    </div>
  )
}

function DaySection({
  eyebrow,
  eyebrowColor,
  title,
  exercises,
  sets,
  onToggle,
  onReset,
  footer,
}: {
  eyebrow: string
  eyebrowColor: string
  title: string
  exercises: readonly Exercise[]
  sets: boolean[][]
  onToggle: (exerciseIndex: number, setIndex: number) => void
  onReset: () => void
  footer?: React.ReactNode
}) {
  const total = sets.reduce((a, s) => a + s.length, 0)
  const done = sets.reduce((a, s) => a + s.filter(Boolean).length, 0)
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-2">
        <div>
          <div className={`text-[10px] font-semibold uppercase tracking-widest ${eyebrowColor}`}>{eyebrow}</div>
          <h2 className="mt-0.5 text-[17px] font-semibold text-white">{title}</h2>
        </div>
        {done > 0 && (
          <button onClick={onReset} className="shrink-0 text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-[11px] text-gray-500 tabular-nums">{done}/{total} sets</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
        {exercises.map((ex, i) => (
          <ExerciseRow
            key={ex.name + i}
            ex={ex}
            completedSets={sets[i]}
            onToggleSet={(setIndex) => onToggle(i, setIndex)}
          />
        ))}
      </div>

      {footer}
    </section>
  )
}

const cardioFooter = (
  <div className="mt-2 flex items-center gap-2 px-1 text-[12px] text-gray-600">
    <Footprints className="h-3.5 w-3.5 shrink-0" />
    <span>Incline treadmill 6–8% · 15–20 min · 3.8 km/h · no holding rails</span>
  </div>
)

function ZoneDivider({ day }: { day: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-blue-400">{day}</span>
      <div className="h-px flex-1 bg-blue-900/50" />
      <div className="flex shrink-0 items-center gap-1.5 text-xs text-blue-300">
        <Heart className="h-3 w-3" />
        <span>Zone 2 · 30–45 min · HR 120–125 (or rest)</span>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
  const progress = React.useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)

  const toggleSet = (day: DayKey, exerciseIndex: number, setIndex: number) => {
    writeProgress({
      ...progress,
      [day]: progress[day].map((arr, i) =>
        i === exerciseIndex ? arr.map((v, j) => (j === setIndex ? !v : v)) : arr
      ),
    })
  }

  const resetDay = (day: DayKey) => {
    writeProgress({
      ...progress,
      [day]: progress[day].map((arr) => arr.map(() => false)),
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="container mx-auto flex max-w-2xl items-center justify-between px-4 pb-4 pt-6">
        <Link href="/" className="text-sm text-gray-500 transition-colors hover:text-white">
          Kowit C.
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/diet" className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-white">
            <Utensils className="h-3.5 w-3.5" />
            Diet Plan
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl space-y-10 px-4 pb-24">

        {/* Heading */}
        <div className="pt-2">
          <div className="mb-1 flex items-center gap-2">
            <Dumbbell className="h-4 w-4 shrink-0 text-emerald-400" />
            <h1 className="text-xl font-semibold text-white">Recomp Hypertrophy Plan</h1>
          </div>
          <p className="pl-6 text-sm text-gray-500">
            Week 7–20 · 3× strength + 2× Zone 2 · Machine-based · High intensity, low volume. Tap a set to check it off — progress is saved on this device.
          </p>
        </div>

        {/* Week strip */}
        <div className="flex gap-1.5">
          {weekOverview.map(({ label, tag, style }) => (
            <div key={label} className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 ${style}`}>
              <span className="text-[11px] font-semibold">{label}</span>
              <span className="text-[9px] opacity-50">{tag}</span>
            </div>
          ))}
        </div>

        {/* Monday */}
        <DaySection
          eyebrow="Monday · Workout A"
          eyebrowColor="text-emerald-400"
          title="Legs + Upper Chest"
          exercises={mondayExercises}
          sets={progress.monday}
          onToggle={(exIdx, setIdx) => toggleSet("monday", exIdx, setIdx)}
          onReset={() => resetDay("monday")}
          footer={cardioFooter}
        />

        <ZoneDivider day="Tuesday" />

        {/* Wednesday */}
        <DaySection
          eyebrow="Wednesday · Workout B"
          eyebrowColor="text-emerald-400"
          title="Back + Rear Delts + Biceps"
          exercises={wednesdayExercises}
          sets={progress.wednesday}
          onToggle={(exIdx, setIdx) => toggleSet("wednesday", exIdx, setIdx)}
          onReset={() => resetDay("wednesday")}
          footer={cardioFooter}
        />

        <ZoneDivider day="Thursday" />

        {/* Friday */}
        <DaySection
          eyebrow="Friday · Workout C"
          eyebrowColor="text-emerald-400"
          title="Chest + Shoulders + Triceps"
          exercises={fridayExercises}
          sets={progress.friday}
          onToggle={(exIdx, setIdx) => toggleSet("friday", exIdx, setIdx)}
          onReset={() => resetDay("friday")}
          footer={cardioFooter}
        />

        {/* Sat/Sun divider */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-amber-400">Saturday</span>
            <div className="h-px flex-1 bg-gray-800" />
            <span className="shrink-0 text-xs text-gray-500">Optional 45–60 min walk, or full rest</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-gray-700">Sunday</span>
            <div className="h-px flex-1 bg-gray-800" />
            <span className="shrink-0 text-xs text-gray-600">Full rest — CNS reset</span>
          </div>
        </div>

        {/* Core Scientific Protocols */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">Core Scientific Protocols</h2>
          <div className="space-y-3">
            {globalRules.map(({ topic, rule }) => (
              <div key={topic} className="flex gap-3">
                <span className="w-28 shrink-0 pt-0.5 text-xs font-medium text-violet-400">{topic}</span>
                <p className="text-sm leading-relaxed text-gray-400">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Credit */}
        <p className="border-t border-gray-900 pt-4 text-center text-[11px] leading-relaxed text-gray-700">
          Muscle data from{" "}
          <a
            href="https://github.com/hasaneyldrm/exercises-dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-400"
          >
            ExerciseDB
          </a>
          {" · "}
          Exercise photos from{" "}
          <a
            href="https://github.com/yuhonas/free-exercise-db"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-400"
          >
            free-exercise-db
          </a>{" "}
          (public domain)
        </p>

      </main>
    </div>
  )
}
