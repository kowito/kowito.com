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
    sets: 4,
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
    name: "Low-Incline Dumbbell Press",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Set the bench to a low 15–30° incline (1–2 notches up). Pin shoulder blades firmly into the pad, chest puffed out. Tuck elbows at 45–60° (arrow shape, no T-flare) to maximize chest recruitment and insulate the shoulder joints",
    sets: 4,
    reps: "6–8",
    intensity: "80% RM",
    tempo: "Press powerfully, driving elbows inward toward each other at the top. Lower slowly counting 1...2...3... (Eccentric Overload)",
    rest: "90–120 sec",
    cues: [
      "Blast upper chest with heavy mechanical tension",
      "Low 15–30° incline — 1–2 notches up",
      "Tuck elbows 45–60° (arrow shape, no T-flare)",
      "Press powerfully, lower slow 1...2...3...",
      "Deeply stretch the clavicular fibers at the bottom"
    ],
    muscle: "Chest" as Muscle,
    weight: "20–22 KG / dumbbell",
  },
  inclineChestPressVolume: {
    name: "Low-Incline Dumbbell Press",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Same low 15–30° incline setup — shoulder blades locked back into the pad, chest puffed out",
    sets: 4,
    reps: "8–10",
    intensity: "Volume",
    tempo: "Controlled press up, squeeze hard at peak for 1 full second, then strict 3-second negative descent. Do not bounce at the bottom",
    rest: "90 sec",
    cues: [
      "Volume builder to square off upper chest shape",
      "Squeeze hard at peak contraction for 1s",
      "Strict 3-second negative — no bouncing",
      "Keep shoulder blades pinned"
    ],
    muscle: "Chest" as Muscle,
    weight: "16–18 KG / dumbbell",
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
  legExtension: {
    name: "Leg Extension",
    img: "legExtension",
    target: "Quads",
    secondaryMuscles: [],
    machine: "Machine Leg Extension",
    setup: "Sit back firmly, locking your hips into the seat. Adjust the shin pad so it sits right above your ankles",
    sets: 3,
    reps: "12–15",
    intensity: "Quad Focus",
    tempo: "Extend up smoothly (1s), squeeze quads at the top for 1s, then lower slowly over 3 full seconds (Eccentric 3s)",
    rest: "90 sec",
    cues: [
      "Patellar-safe isolation — no crushing spinal load",
      "Knee-friendly: don't let your feet pull too far back under the seat at the bottom (limit extreme knee flexion)",
      "Focus on the slow 3-second negative to rebuild tendon collagen",
      "Squeeze the quads hard at the top for 1s"
    ],
    muscle: "Legs" as Muscle,
  },
  legCurl: {
    name: "Leg Curl",
    img: "legCurl",
    target: "Hamstrings",
    secondaryMuscles: [],
    machine: "Lying or Seated Leg Curl Machine",
    setup: "Align your knee joints perfectly with the machine's pivot point. Secure the thigh pad tightly if seated",
    sets: 3,
    reps: "10–12",
    intensity: "Moderate",
    tempo: "Curl down/in powerfully (1s), squeeze the hamstrings at full contraction, then return slowly over 3s",
    rest: "90 sec",
    cues: [
      "Keep your feet flexed toward your shins",
      "Don't let your lower back arch or lift off the pad",
      "Balances quad dominance and stabilizes the knee joint"
    ],
    muscle: "Legs" as Muscle,
  },
  legPress: {
    name: "Leg Press",
    img: "legPress",
    target: "Quads",
    secondaryMuscles: ["Hamstrings", "Glutes"],
    machine: "Leg Press & Calf Raise",
    altMachine: "Lying/Seated Leg Curl",
    setup: "Place feet high and wide on the platform to maximize glute/hamstring engagement and protect the patellar tendon. Brace your core tightly and don't let your knees cave inward",
    sets: 5,
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
    sets: 4,
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
  tricepsPushdownVolume: {
    name: "Triceps Pushdown",
    img: "tricepsPushdown",
    target: "Triceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Same setup — lock elbows at sides, depress shoulders. Volume load for metabolic pump",
    sets: 3,
    reps: "10–12",
    intensity: "Volume",
    tempo: "Lock elbows, press and squeeze down completely, return over 3s",
    rest: "60–90 sec",
    cues: [
      "Lock elbows firmly at your sides",
      "Press and squeeze down completely",
      "Return slowly over 3 seconds",
      "Volume pump — squeeze hard at peak"
    ],
    muscle: "Triceps" as Muscle,
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
  bicepsCurlVolume: {
    name: "Biceps Curl",
    img: "bicepsCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "Same setup — pin elbows at sides. Volume load for metabolic pump",
    sets: 3,
    reps: "10–12",
    intensity: "Volume",
    tempo: "Strict arm isolation, squeeze hard at peak, return over 3s",
    rest: "60–90 sec",
    cues: [
      "Pin elbows at your sides",
      "Strict isolation — eliminate torso swing",
      "Squeeze hard at the peak",
      "Return slowly over 3 seconds"
    ],
    muscle: "Biceps" as Muscle,
  },
  rearDeltFly: {
    name: "Cable Rear Delt Fly",
    img: "rearDeltFly",
    target: "Rear Delts",
    secondaryMuscles: ["Upper Back", "Rhomboids"],
    machine: "Cable Crossover Station (grip the bare cable lines, no handles)",
    altMachine: "Reverse Pec Deck Machine",
    setup: "Set the pulleys at upper-chest height. Cross your arms to grab the left cable with your right hand and the right cable with your left hand. Stand dead center",
    sets: 4,
    reps: "10–12",
    intensity: "Low–Mod",
    tempo: "Fly your arms out and back in a smooth arc (1s), squeeze the back of your shoulders, then return slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Keep your elbows high and parallel to the floor",
      "Sweep your hands wide to the walls — don't just pull them back",
      "Squeeze the back of your shoulders at the peak",
      "Zero momentum — let the constant cable tension build the delts"
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
    intensity: "Heavy",
    tempo: "Raise outward smoothly, hold a split second at the peak, then lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Heavy strict set — no shrugging",
      "Keep shoulders depressed (no traps)",
      "Raise smoothly, lower over 3 seconds",
      "Builds V-shape shoulder width"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
  },
  lateralRaiseVolume: {
    name: "Lateral Raise",
    img: "lateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Lateral Raise Machine",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Same setup — keep shoulders depressed. Drop to 7–8 KG if form breaks",
    sets: 4,
    reps: "12–15",
    intensity: "Volume",
    tempo: "High-volume metabolic pump — hold a split second at peak width, control down",
    rest: "60 sec",
    cues: [
      "High-volume metabolic pump set",
      "Hold a split second at peak width",
      "Control the descent, no swinging",
      "Drop weight if form breaks"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
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

// Warm-up & Activation blocks (differ per day)
const warmupFull = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
  exercises.gluteBridge,
  exercises.deadBug,
] as const

const warmupChildsPose = [
  exercises.lowerBackStretch,
] as const

const warmupCouchChildsPose = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
] as const

// Monday · Workout A — Push Focus
const mondayExercises = [
  ...warmupFull,
  exercises.inclineChestPress,
  exercises.chestPress,
  exercises.lateralRaise,
  exercises.tricepsPushdown,
] as const

// Wednesday · Workout B — Pull Focus
const wednesdayExercises = [
  ...warmupFull,
  exercises.latPulldown,
  exercises.seatedCableRow,
  exercises.rearDeltFly,
  exercises.bicepsCurl,
] as const

// Friday · Workout C — Shoulders & Arms Specialization
const fridayExercises = [
  ...warmupChildsPose,
  exercises.shoulderPress,
  exercises.lateralRaiseVolume,
  exercises.inclineChestPressVolume,
  exercises.tricepsPushdownVolume,
  exercises.bicepsCurlVolume,
] as const

// Saturday · Workout D — Legs + Core Heavy Destruction
const saturdayExercises = [
  ...warmupCouchChildsPose,
  exercises.legPress,
  exercises.hipThrust,
  exercises.legExtension,
  exercises.gluteBridge,
  exercises.deadBug,
] as const

type DayKey = "monday" | "wednesday" | "friday" | "saturday"

const globalRules = [
  { topic: "Double Progression", rule: "Lock these weights down. Only increase dumbbell weights once you can hit the maximum rep ceiling across all sets with seamless form." },
  { topic: "3-Second Negative", rule: "Never drop the weight. The slow lowering phase is where the mechanical micro-tears happen, driving upper chest hypertrophy." },
  { topic: "Riceberry Timing", rule: "Consume your complex carbs strictly around your training windows to shove glycogen directly into the muscle bellies." },
  { topic: "Maximize Sleep", rule: "Deep sleep suppresses systemic cortisol. Dropping cortisol is the primary hormonal trigger your body needs to drop stubborn subcutaneous water retention around your midsection." },
]

const weekOverview = [
  { label: "Mon", tag: "Push", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Tue", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "Wed", tag: "Pull", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Thu", tag: "Rest", style: "bg-gray-500/15 text-gray-400 border-gray-600/30" },
  { label: "Fri", tag: "Arms", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Sat", tag: "Legs", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Sun", tag: "Rest", style: "bg-gray-500/15 text-gray-400 border-gray-600/30" },
]

// ─── Progress persistence ────────────────────────────────────────────────────

type Progress = Record<DayKey, boolean[][]>

const STORAGE_KEY = "pt-progress-v6"

function blankProgress(): Progress {
  return {
    monday: mondayExercises.map((e) => Array(e.sets).fill(false)),
    wednesday: wednesdayExercises.map((e) => Array(e.sets).fill(false)),
    friday: fridayExercises.map((e) => Array(e.sets).fill(false)),
    saturday: saturdayExercises.map((e) => Array(e.sets).fill(false)),
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
    <span>Treadmill · 40 min · 2.8 km/h · 9% incline · no holding rails</span>
  </div>
)

function CardioDay({ day, label, duration }: { day: string; label: string; duration: string }) {
  return (
    <section>
      <div className="mb-2">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">{day}</div>
        <h2 className="mt-0.5 text-[17px] font-semibold text-white">{label}</h2>
      </div>
      <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4">
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-200">Zone 2 Cardio · {duration}</p>
            <p className="mt-1 text-[13px] text-gray-400">Treadmill walk · 2.8 km/h · 9% incline</p>
            <p className="mt-1 text-[12px] text-gray-600">No weight training today. Focus on sleep, hydration, and active recovery.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function RestDay({ day, description }: { day: string; description: string }) {
  return (
    <section>
      <div className="mb-2">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{day}</div>
        <h2 className="mt-0.5 text-[17px] font-semibold text-white">Full Rest Day</h2>
      </div>
      <div className="rounded-xl border border-gray-800 bg-gray-900/20 p-4">
        <p className="text-[13px] leading-relaxed text-gray-500">{description}</p>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
  const progress = React.useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  const [activeDay, setActiveDay] = React.useState<number | null>(null) // null = show all

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
            4-day strength split + Zone 2 cardio · Machine-based · High intensity, low volume. Tap a set to check it off — progress is saved on this device.
          </p>
        </div>

        {/* Day filter */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveDay(null)}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border px-2.5 py-1.5 transition-all active:scale-95 ${activeDay === null ? "border-white/30 bg-white/10 text-white" : "border-gray-800 bg-gray-900/40 text-gray-500 hover:text-gray-300"}`}
          >
            <span className="text-[11px] font-semibold">All</span>
          </button>
          {weekOverview.map((d, i) => (
            <button
              key={d.label}
              onClick={() => setActiveDay(activeDay === i ? null : i)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 transition-all active:scale-95 ${activeDay === i ? `${d.style} ring-1 ring-white/20` : "border-gray-800 bg-gray-900/40 opacity-50 hover:opacity-80"}`}
            >
              <span className="text-[11px] font-semibold">{d.label}</span>
              <span className="text-[9px] opacity-60">{d.tag}</span>
            </button>
          ))}
        </div>

        {/* Monday */}
        {(activeDay === null || activeDay === 0) && (
          <DaySection
            eyebrow="Monday · Workout A"
            eyebrowColor="text-emerald-400"
            title="Push Focus"
            exercises={mondayExercises}
            sets={progress.monday}
            onToggle={(exIdx, setIdx) => toggleSet("monday", exIdx, setIdx)}
            onReset={() => resetDay("monday")}
            footer={cardioFooter}
          />
        )}

        {/* Tuesday */}
        {(activeDay === null || activeDay === 1) && (
          <CardioDay day="Tuesday" label="Zone 2 Cardio (Active Recovery)" duration="45 min" />
        )}

        {/* Wednesday */}
        {(activeDay === null || activeDay === 2) && (
          <DaySection
            eyebrow="Wednesday · Workout B"
            eyebrowColor="text-emerald-400"
            title="Pull Focus"
            exercises={wednesdayExercises}
            sets={progress.wednesday}
            onToggle={(exIdx, setIdx) => toggleSet("wednesday", exIdx, setIdx)}
            onReset={() => resetDay("wednesday")}
            footer={cardioFooter}
          />
        )}

        {/* Thursday */}
        {(activeDay === null || activeDay === 3) && (
          <RestDay
            day="Thursday"
            description="Zero training. Prioritize maximum sleep, keep cortisol low, and let your body drop accumulated water retention."
          />
        )}

        {/* Friday */}
        {(activeDay === null || activeDay === 4) && (
          <DaySection
            eyebrow="Friday · Workout C"
            eyebrowColor="text-emerald-400"
            title="Shoulders & Arms Specialization"
            exercises={fridayExercises}
            sets={progress.friday}
            onToggle={(exIdx, setIdx) => toggleSet("friday", exIdx, setIdx)}
            onReset={() => resetDay("friday")}
            footer={cardioFooter}
          />
        )}

        {/* Saturday */}
        {(activeDay === null || activeDay === 5) && (
          <DaySection
            eyebrow="Saturday · Workout D"
            eyebrowColor="text-emerald-400"
            title="Legs + Core Heavy Destruction"
            exercises={saturdayExercises}
            sets={progress.saturday}
            onToggle={(exIdx, setIdx) => toggleSet("saturday", exIdx, setIdx)}
            onReset={() => resetDay("saturday")}
            footer={cardioFooter}
          />
        )}

        {/* Sunday */}
        {(activeDay === null || activeDay === 6) && (
          <RestDay
            day="Sunday"
            description="Complete metabolic reset. Sleep as much as humanly possible, keep hydration high, and let your body grow."
          />
        )}

        {/* 4 Rules for Perfect Execution */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">4 Pillars of Perfect Recomp Execution</h2>
          <div className="space-y-3">
            {globalRules.map(({ topic, rule }) => (
              <div key={topic} className="flex gap-3">
                <span className="w-32 shrink-0 pt-0.5 text-xs font-medium text-violet-400">{topic}</span>
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
