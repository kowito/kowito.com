"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Dumbbell, Utensils, Play, Target, ChevronRight, Heart, Moon } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "Chest" | "Back" | "Shoulders" | "Triceps" | "Biceps" | "Legs" | "Glutes" | "Core"

type Exercise = {
  name: string
  machine: string
  altMachine?: string
  setup: string
  sets: number
  reps: number | string
  /** Optional intensity tag, e.g. "RIR 1–2". */
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
  /** Shown under the photos when the stock demo is a close variant, not this exact machine. */
  imgNote?: string
  /** Highlighted caveat — e.g. a set that is optional when fatigue is high. */
  note?: string
}

// ─── Exercise Library (single source of truth) ───────────────────────────────

const exercises = {
  // ── Warm-up & mobility ──
  thoracicOpener: {
    name: "Thoracic Rotation (Open Book)",
    img: "thoracicOpener",
    imgNote: "Photo shows the seated-twist version — same rotation, do it side-lying if you have a mat",
    target: "Thoracic Spine",
    secondaryMuscles: ["Chest", "Obliques"],
    machine: "Mat / Chair",
    setup: "Lie on your side, knees stacked at 90°, arms extended straight in front at shoulder height. Seated version: sit tall, hands behind your head, elbows wide",
    sets: 1,
    reps: "8 per side",
    tempo: "Sweep the top arm in a wide arc across your body and open to the floor behind you — hold the end range 3s, return slowly",
    rest: "—",
    cues: [
      "Keep your knees glued together on the floor",
      "Rotate from the mid-back, not the lower back",
      "Follow your hand with your eyes",
      "A mobile T-spine is what lets you set a proper incline press arch"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=YMswmjk7Qj4",
  },
  shoulderMobility: {
    name: "Shoulder Pass-Throughs + Wall Slides",
    img: "shoulderMobility",
    target: "Shoulders",
    secondaryMuscles: ["Upper Back", "Rotator Cuff"],
    machine: "Resistance Band / Broomstick + Wall",
    setup: "Hold a band or broomstick wide with straight arms in front of your hips. For wall slides, stand with your back, head and forearms flat against a wall",
    sets: 1,
    reps: "10 pass-throughs + 10 slides",
    tempo: "Pass the band overhead and behind with locked elbows; slide the forearms overhead keeping contact with the wall",
    rest: "—",
    cues: [
      "Keep your ribs down — don't arch to fake range",
      "Widen your grip if the shoulders pinch",
      "Cheap insurance for the pressing and pulling that follows",
      "Never force through a sharp pain"
    ],
    muscle: "Shoulders" as Muscle,
    video: "https://www.youtube.com/watch?v=riVxa9By-pM",
  },
  lowerBackStretch: {
    name: "Lower Back Stretch (Child's Pose)",
    img: "lowerBackStretch",
    target: "Lower Back",
    secondaryMuscles: ["Lats"],
    machine: "Mat",
    setup: "Kneel on the mat, sit back on your heels, fold forward and extend your arms in front. Rest your forehead on the mat",
    sets: 1,
    reps: "90 sec",
    tempo: "Hold the stretch, breathe deeply, let your lower back release",
    rest: "—",
    cues: [
      "Sit your hips back toward your heels",
      "Extend your arms forward",
      "Breathe deeply into your lower back",
      "Let gravity do the work"
    ],
    muscle: "Core" as Muscle,
    video: "https://www.youtube.com/watch?v=_ZX_zTOBgp8",
  },
  hipFlexorStretch: {
    name: "Hip Flexor Stretch (Couch Stretch)",
    img: "hipFlexorStretch",
    target: "Hip Flexors",
    secondaryMuscles: ["Quads"],
    machine: "Wall / Couch / Mat",
    setup: "Kneel in front of a wall or couch. Place one foot flat on the floor in front, the other shin vertical against the wall behind you. Keep your torso upright",
    sets: 1,
    reps: "90 sec per side",
    tempo: "Hold the stretch, breathe deeply, relax into it",
    rest: "—",
    cues: [
      "Keep your torso upright",
      "Squeeze the glute on the stretched side",
      "Breathe deeply and relax",
      "Don't arch your lower back"
    ],
    muscle: "Core" as Muscle,
    video: "https://www.youtube.com/watch?v=QiKl5UoiG5c",
  },
  gluteBridge: {
    name: "Glute Bridge",
    img: "gluteBridge",
    target: "Glutes",
    secondaryMuscles: ["Hamstrings", "Core"],
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, knees bent, feet flat on the floor hip-width apart. Arms at your sides, palms down",
    sets: 1,
    reps: 15,
    tempo: "Drive hips up, squeeze glutes at the top for 1s, lower under control",
    rest: "30 sec",
    cues: [
      "Drive through your heels",
      "Squeeze glutes hard at the top",
      "Don't hyperextend your back",
      "Wakes the glutes up before heavy pressing with the legs"
    ],
    muscle: "Glutes" as Muscle,
    video: "https://www.youtube.com/watch?v=XLXGydU5DdU",
  },
  deadBug: {
    name: "Dead Bug",
    img: "deadBug",
    target: "Core",
    secondaryMuscles: ["Hip Flexors", "Lower Back"],
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, arms extended toward the ceiling, hips and knees bent at 90°. Press your lower back into the floor",
    sets: 1,
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
    video: "https://www.youtube.com/watch?v=GbSC02oU3To",
  },

  // ── Monday · Chest + Shoulders ──
  inclineChestPress: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Set the bench to a low 15–30° incline (1–2 notches up). Pin the shoulder blades into the pad, chest puffed. Tuck the elbows to about 45–60° rather than flaring them into a T",
    sets: 3,
    reps: "6–8",
    intensity: "RIR 1–2",
    tempo: "Lower under control for about 2–3 seconds into a deep stretch, then drive up strongly. Controlled, not slow-motion",
    rest: "2–3 min",
    cues: [
      "This is the primary chest movement of the week — give it your best effort",
      "Low 15–30° incline, 1–2 notches up",
      "Deep controlled stretch at the bottom, strong drive out of it",
      "Leave 1–2 reps in the tank — no grinding to failure",
      "Full rest here: 2–3 minutes buys you better sets"
    ],
    muscle: "Chest" as Muscle,
    weight: "20–22 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  chestPress: {
    name: "Machine Chest Press",
    img: "chestPress",
    target: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Chest Press Machine",
    altMachine: "Pec Fly Machine",
    setup: "Lower the seat so the handles line up at nipple level. Puff the chest and pin the shoulder blades into the pad",
    sets: 2,
    reps: "6–10",
    intensity: "RIR 1–2",
    tempo: "Press strongly, lower under control for 2–3 seconds",
    rest: "2 min",
    cues: [
      "Heavy, stable pressing — the machine lets you push hard with no balance tax",
      "Pin the shoulder blades into the pad",
      "No need to take either set to failure",
      "Full range on every rep"
    ],
    muscle: "Chest" as Muscle,
    weight: "56–60 KG",
    video: "https://www.youtube.com/shorts/Qu7-ceCvq7w",
  },
  cableLateralRaiseMon: {
    name: "Cable Lateral Raise",
    img: "cableLateralRaise",
    imgNote: "Photo shows the seated two-cable version — stand for the single-arm version described below",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Cable Crossover (single low pulley)",
    altMachine: "Machine Lateral Raise",
    setup: "Set one pulley at the lowest notch. Stand side-on, reach across your body with the far hand and grab the cable behind your thigh",
    sets: 2,
    reps: "10–15",
    intensity: "RIR 0–1",
    tempo: "Raise to shoulder height (1s), pause at the top, then resist all the way down for 2–3s",
    rest: "60–90 sec",
    cues: [
      "Direct lateral-delt work with almost no systemic fatigue cost",
      "Cables load the delt in the stretched position — the machine can't",
      "Lead with the elbow, pinky slightly high",
      "Take these close to failure; they're cheap to recover from"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
    video: "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
  },
  shoulderPress: {
    name: "Machine Shoulder Press",
    img: "shoulderPress",
    target: "Front Delts",
    secondaryMuscles: ["Side Delts", "Triceps"],
    machine: "Shoulder Press Machine",
    altMachine: "Dumbbell Shoulder Press",
    setup: "Hips glued to the backrest. Press straight up without arching the lower back",
    sets: 2,
    reps: "6–10",
    intensity: "RIR 1–2",
    tempo: "Press up cleanly, lower under control for 2–3 seconds",
    rest: "2 min",
    cues: [
      "Stay pressed into the backrest, no back arch",
      "Stop at 1–2 reps in reserve",
      "Do not add load if the shoulder or tendon is the limiting factor",
      "Then you're done — four exercises is the whole session"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "25–30 KG",
    note: "Second set is optional. Skip it if the shoulder feels cranky or the session already took a lot out of you.",
    video: "https://www.youtube.com/watch?v=6v4nrRVySj0",
  },

  // ── Wednesday · Upper Body + Arms ──
  inclineChestPressWed: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Same low 15–30° incline as Monday. Shoulder blades locked into the pad, chest puffed out",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 1–2",
    tempo: "Controlled 2–3 second lowering, strong press up",
    rest: "2 min",
    cues: [
      "Second chest exposure of the week — a quality stimulus, not a second heavy day",
      "Slightly lighter than Monday to hit the 8–10 range cleanly",
      "Same depth and same elbow path as Monday",
      "Stop at 1–2 reps in reserve"
    ],
    muscle: "Chest" as Muscle,
    weight: "18–20 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  chestSupportedRowWed: {
    name: "Chest-Supported Row",
    img: "chestSupportedRow",
    imgNote: "Photo shows the T-bar version — any chest-supported row machine works the same way",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Rhomboids"],
    machine: "Chest-Supported Row Machine",
    altMachine: "Seated Cable Row",
    setup: "Set the chest pad so the arms hang free at full stretch. Ribs stay on the pad for the whole set",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 1–2",
    tempo: "Row to the lower ribs, squeeze the shoulder blades for a beat, return under control for 2–3s to a full stretch",
    rest: "2 min",
    cues: [
      "Light back exposure only — Friday is the real back day",
      "Chest never leaves the pad, so the lower back stays out of it",
      "Pull with the elbows, not the hands",
      "Keep it comfortably short of failure"
    ],
    muscle: "Back" as Muscle,
    weight: "45–50 KG",
    video: "https://www.youtube.com/watch?v=FU6YQawma2Q",
  },
  cableLateralRaiseWed: {
    name: "Cable Lateral Raise",
    img: "cableLateralRaise",
    imgNote: "Photo shows the seated two-cable version — stand for the single-arm version described below",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Cable Crossover (single low pulley)",
    altMachine: "Machine Lateral Raise",
    setup: "Same setup as Monday — one low pulley, stand side-on, cable crossing behind the thigh",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 0–1",
    tempo: "Raise to shoulder height, pause, resist down for 2–3s",
    rest: "60–90 sec",
    cues: [
      "Second of three weekly lateral-delt exposures",
      "Higher reps here than Monday — chase the burn, not the load",
      "No torso swing; if you're heaving it, drop the weight",
      "Stay at 9 kg until 15 clean reps are routine"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
    video: "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
  },
  preacherCurl: {
    name: "Preacher / Machine Curl",
    img: "preacherCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Machine Preacher Curl",
    altMachine: "Preacher Bench + EZ Bar",
    setup: "Sit upright with the backs of the arms flat on the pad, armpits into the top of the pad. Grip at shoulder width and start from a full stretch",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1",
    tempo: "Curl up with constant tension, squeeze at the top, lower for 2–3s to a full stretch",
    rest: "90 sec",
    cues: [
      "Arms glued to the pad — the pad is what removes the cheating",
      "Full range: complete stretch at the bottom, hard squeeze at the top",
      "The stretched position is where the biceps grow",
      "One exercise is enough direct biceps work on this day"
    ],
    muscle: "Biceps" as Muscle,
    weight: "25–30 KG",
    video: "https://www.youtube.com/watch?v=Ja6ZlIDONac",
  },
  tricepsPushdown: {
    name: "Cable Pushdown",
    img: "tricepsPushdown",
    target: "Triceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Pulley high, rope or straight bar, elbows glued to the sides, shoulders depressed before the first rep",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1",
    tempo: "Lock the elbows in place, press down hard, return for 2–3s",
    rest: "90 sec",
    cues: [
      "Elbows pinned at your sides for every rep",
      "Press down and squeeze until the triceps burn",
      "Your pressing already gives the triceps plenty — this is the top-up",
      "Then leave. The session is done"
    ],
    muscle: "Triceps" as Muscle,
    weight: "42–45 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },

  // ── Friday · Heavy Back + Delts (trainer) ──
  neutralGripLatPulldown: {
    name: "Neutral-Grip Lat Pulldown",
    img: "neutralGripLatPulldown",
    imgNote: "Photo shows the close V-bar version — use a shoulder-width neutral handle and keep the torso closer to upright",
    target: "Lats",
    secondaryMuscles: ["Biceps", "Upper Back"],
    machine: "Lat Pulldown Machine (neutral-grip handle)",
    altMachine: "Wide-Grip Lat Pulldown",
    setup: "Sit upright, thigh pad locked down. Neutral grip (palms facing each other) at roughly shoulder width. Chest up before the first rep",
    sets: 3,
    reps: "6–8",
    intensity: "RIR 1–2",
    tempo: "Drive the elbows down and back, then return for 2–3s until the lats are fully stretched overhead",
    rest: "2–3 min",
    cues: [
      "Heaviest pulling of the week — this and the row are the whole point of Friday",
      "Lead with the elbows, don't pull with the hands",
      "Full stretch at the top of every rep",
      "Stop at 1–2 reps in reserve; the trainer will push, you set the ceiling",
      "Take the full 2–3 minutes between sets"
    ],
    muscle: "Back" as Muscle,
    weight: "55–60 KG",
    video: "https://www.youtube.com/watch?v=KgZqDuNx7rI",
  },
  chestSupportedRow: {
    name: "Chest-Supported Row",
    img: "chestSupportedRow",
    imgNote: "Photo shows the T-bar version — any chest-supported row machine works the same way",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Rhomboids"],
    machine: "Chest-Supported Row Machine",
    altMachine: "Seated Cable Row",
    setup: "Chest pad set so the arms hang free at full stretch. Ribs glued to the pad — that is what keeps the lower back out of it",
    sets: 3,
    reps: "6–10",
    intensity: "RIR 1–2",
    tempo: "Row to the lower ribs, squeeze the shoulder blades for a beat, return for 2–3s into a full stretch",
    rest: "2–3 min",
    cues: [
      "Second heavy movement of the day — treat it like a main lift",
      "Chest never leaves the pad, no torso english",
      "Squeeze the shoulder blades together at the top",
      "Let the arms fully straighten at the bottom",
      "Chest support means zero lower-back cost before Saturday's legs"
    ],
    muscle: "Back" as Muscle,
    weight: "50–55 KG",
    video: "https://www.youtube.com/watch?v=FU6YQawma2Q",
  },
  machineHighRow: {
    name: "Machine High Row",
    img: "machineHighRow",
    target: "Lats",
    secondaryMuscles: ["Upper Back", "Rear Delts"],
    machine: "Iso-Lateral High Row",
    altMachine: "Wide-Grip Lat Pulldown",
    setup: "Chest into the pad, high handles with arms straight overhead. Depress the shoulder blades before the first rep",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1",
    tempo: "Pull down and back toward the hips, hold a beat, return for 2–3s letting the shoulder blades rise",
    rest: "90 sec",
    cues: [
      "Third and final back movement — a different angle, not another max-out",
      "Let the shoulder blade travel up at the top for a full stretch",
      "Run it single-arm if the machine allows",
      "If Friday ever starts degrading, this is the first set to cut"
    ],
    muscle: "Back" as Muscle,
    weight: "45–50 KG",
    video: "https://www.youtube.com/watch?v=gg5hwJuv6KI",
  },
  cableLateralRaiseFri: {
    name: "Cable Lateral Raise",
    img: "cableLateralRaise",
    imgNote: "Photo shows the seated two-cable version — stand for the single-arm version described below",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Cable Crossover (single low pulley)",
    altMachine: "Machine Lateral Raise",
    setup: "One low pulley, stand side-on, far hand reaching across to the cable behind the thigh",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 0–1",
    tempo: "Raise to shoulder height, pause, resist down for 2–3s",
    rest: "60–90 sec",
    cues: [
      "Third weekly lateral exposure — six quality sets a week builds width",
      "These can go close to failure; heavy back work cannot",
      "Strict form even when the back work has drained you",
      "Drop the weight rather than swinging"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
    video: "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
  },
  reversePecDeck: {
    name: "Reverse Pec Deck",
    img: "reversePecDeck",
    target: "Rear Delts",
    secondaryMuscles: ["Upper Back", "Rhomboids"],
    machine: "Reverse Pec Deck Machine",
    altMachine: "Cable Rear Delt Fly",
    setup: "Chest against the pad, handles at shoulder height, elbows high and slightly bent",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 0–1",
    tempo: "Sweep the elbows wide and back, squeeze for a beat, return for 2–3s",
    rest: "60–90 sec",
    cues: [
      "The week's only direct rear-delt work — two sets is enough alongside heavy rowing",
      "Chest stays on the pad, no torso rotation",
      "Sweep wide to the walls, don't row toward the hips",
      "Light load, hard squeeze"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "30–35 KG",
    video: "https://www.youtube.com/watch?v=dC7jhEk-29A",
  },

  // ── Saturday · Heavy Legs (trainer) ──
  legPress: {
    name: "Leg Press",
    img: "legPress",
    target: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    machine: "Leg Press",
    altMachine: "Hack Squat",
    setup: "Feet high and wide on the platform to share the load with the glutes and hamstrings and spare the patellar tendon. Brace the core, knees tracking out",
    sets: 3,
    reps: "6–10",
    intensity: "RIR 1–2",
    tempo: "Press out smoothly, lower for 2–3s to a deep but controlled bottom position",
    rest: "2–3 min",
    cues: [
      "Primary leg movement — heavy and full range",
      "Feet high and wide, knees never caving in",
      "Stop before your lower back rounds off the pad",
      "1–2 reps in reserve; no ego sets on the stack"
    ],
    muscle: "Legs" as Muscle,
    weight: "120–140 KG",
    video: "https://www.youtube.com/watch?v=K5n2vg3oZa4",
  },
  legCurl: {
    name: "Hamstring Curl",
    img: "legCurl",
    target: "Hamstrings",
    secondaryMuscles: [],
    machine: "Lying or Seated Leg Curl Machine",
    setup: "Line the knee joints up with the machine's pivot. Thigh pad tight if seated",
    sets: 3,
    reps: "8–12",
    intensity: "RIR 1",
    tempo: "Curl hard, squeeze at full contraction, return for 2–3s",
    rest: "90 sec",
    cues: [
      "The only direct hamstring work of the week — make all three sets count",
      "Feet flexed toward the shins",
      "Hips stay down; don't let the lower back lift off the pad",
      "Balances the quad-dominant pressing and protects the knees"
    ],
    muscle: "Legs" as Muscle,
    weight: "40–45 KG",
    video: "https://www.youtube.com/watch?v=Orxowest56U",
  },
  hipThrust: {
    name: "Hip Thrust",
    img: "hipThrust",
    target: "Glutes",
    secondaryMuscles: ["Hamstrings"],
    machine: "Smith Machine Hip Thrust",
    altMachine: "Glute Drive Machine",
    setup: "Bench under the shoulder blades, bar padded at the hip crease, chin tucked",
    sets: 2,
    reps: "6–10",
    intensity: "RIR 1–2",
    tempo: "Drive the hips up powerfully, squeeze the glutes at lockout for 1–2s, lower for 2–3s",
    rest: "2 min",
    cues: [
      "Drive to full hip lockout, then squeeze",
      "Ribs down and chin tucked — don't hyperextend the lower back",
      "Use the glute machine instead if the Smith setup is a hassle",
      "Two hard sets beat four sloppy ones"
    ],
    muscle: "Glutes" as Muscle,
    weight: "60–80 KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  bulgarianSplitSquat: {
    name: "Bulgarian Split Squat",
    img: "bulgarianSplitSquat",
    target: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    machine: "Dumbbells + Bench",
    altMachine: "Smith Machine Split Squat",
    setup: "Dumbbell in each hand at your sides. Rear foot up on the bench, front foot far enough forward that the front knee reaches about 90° at the bottom. Torso upright",
    sets: 2,
    reps: "8–10 per leg",
    intensity: "RIR 1–2",
    tempo: "Lower for 2–3s until the front knee is around 90°, then drive up strongly through the front leg",
    rest: "90 sec per leg",
    cues: [
      "Front knee tracks over the toes, never caves inward",
      "Drive from the front leg — the back leg is a kickstand, not a pusher",
      "Single-leg loading gets a lot of stimulus from very little weight",
      "Quality reps only; stop the set when technique goes"
    ],
    muscle: "Legs" as Muscle,
    weight: "16–20 KG / hand",
    note: "First thing to cut. If the other three exercises already emptied the tank, do one set or skip it — it is not worth the recovery debt.",
    video: "https://www.youtube.com/watch?v=hPlKPjohFS0",
  },
} as const

// ─── Workout Programs ────────────────────────────────────────────────────────
// The first `warmup` exercises of each day render inside a collapsed warm-up block.

const warmupUpper = [
  exercises.thoracicOpener,
  exercises.shoulderMobility,
  exercises.lowerBackStretch,
] as const

const warmupLower = [
  exercises.hipFlexorStretch,
  exercises.gluteBridge,
  exercises.deadBug,
] as const

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

type DayProgram = {
  eyebrow: string
  title: string
  color: string
  /** Warm-up drills first, then the working exercises. */
  warmup: readonly Exercise[]
  work: readonly Exercise[]
  warmupLabel?: string
  /** Set on non-lifting days; rendered instead of an exercise list. */
  recovery?: {
    /** Zone 2 duration — omit for a full rest day. */
    duration?: string
    note: string
    /** One-line summary for the text view. Zone 2 days derive theirs from `duration`. */
    short?: string
  }
}

const dayPrograms: Record<DayKey, DayProgram> = {
  monday: {
    eyebrow: "Monday",
    title: "Chest + Shoulders",
    color: "text-emerald-400",
    warmup: warmupUpper,
    work: [
      exercises.inclineChestPress,
      exercises.chestPress,
      exercises.cableLateralRaiseMon,
      exercises.shoulderPress,
    ],
  },
  tuesday: {
    eyebrow: "Tuesday",
    title: "Zone 2 / Recovery",
    color: "text-blue-400",
    warmup: [],
    work: [],
    recovery: {
      duration: "35–45 min",
      note: "No resistance training. Don't treat Zone 2 as another hard workout — if you slept badly or your legs are unusually fatigued, cut the duration. The job here is cardiovascular fitness and energy expenditure without compromising Friday's heavy back session.",
    },
  },
  wednesday: {
    eyebrow: "Wednesday",
    title: "Upper Body + Arms",
    color: "text-emerald-400",
    warmup: warmupUpper,
    work: [
      exercises.inclineChestPressWed,
      exercises.chestSupportedRowWed,
      exercises.cableLateralRaiseWed,
      exercises.preacherCurl,
      exercises.tricepsPushdown,
    ],
  },
  thursday: {
    eyebrow: "Thursday",
    title: "Rest",
    color: "text-gray-500",
    warmup: [],
    work: [],
    recovery: {
      note: "No training at all. This day is deliberately empty: it is the low-fatigue buffer that makes Friday's heavy back session possible. Sleep is the work today.",
      short: "No training. Sleep is the work.",
    },
  },
  friday: {
    eyebrow: "Friday · Trainer",
    title: "Heavy Back + Delts",
    color: "text-amber-400",
    warmup: warmupUpper,
    work: [
      exercises.neutralGripLatPulldown,
      exercises.chestSupportedRow,
      exercises.machineHighRow,
      exercises.cableLateralRaiseFri,
      exercises.reversePecDeck,
    ],
  },
  saturday: {
    eyebrow: "Saturday · Trainer",
    title: "Heavy Legs",
    color: "text-amber-400",
    warmup: warmupLower,
    work: [
      exercises.legPress,
      exercises.legCurl,
      exercises.hipThrust,
      exercises.bulgarianSplitSquat,
    ],
  },
  sunday: {
    eyebrow: "Sunday",
    title: "Zone 2 / Recovery",
    color: "text-blue-400",
    warmup: [],
    work: [],
    recovery: {
      duration: "30–45 min",
      note: "Comfortably aerobic — this is not another hard workout. If your sleep was particularly poor during the week, make it a recovery walk instead and leave it there.",
    },
  },
}

const dayKeys = Object.keys(dayPrograms) as DayKey[]

/** Constant treadmill settings for every Zone 2 session. */
const zone2Settings = [
  { label: "Speed", value: "4.5 km/h" },
  { label: "Incline", value: "9%" },
  { label: "Heart rate", value: "~135 bpm" },
]

const priorities = [
  { topic: "Calorie deficit", rule: "Enough to keep losing fat consistently — not an extreme crash diet you can't hold." },
  { topic: "High protein", rule: "Protects lean mass and feeds hypertrophy while you're in a deficit." },
  { topic: "Progressive lifting", rule: "Gives the body a reason to keep the muscle. Strength and rep progress is the signal that it's working." },
  { topic: "Sleep & recovery", rule: "Your binding constraint. Short sleep is exactly why this program is four days and low volume — not a reason to train more." },
  { topic: "Zone 2", rule: "Cardiovascular fitness and extra expenditure. It supports the lifting; it never competes with it." },
]

const progressionExample = [
  { week: "Week 1", weight: "22 kg", reps: "8 / 7 / 6" },
  { week: "Week 2", weight: "22 kg", reps: "8 / 8 / 7" },
  { week: "Week 3", weight: "22 kg", reps: "8 / 8 / 8" },
  { week: "Week 4", weight: "24 kg", reps: "6 / 6 / 6", bump: true },
]

const intensityRules = [
  { label: "Main compounds", value: "RIR 1–2" },
  { label: "Isolation work", value: "RIR 0–2" },
  { label: "Eccentric", value: "Controlled 2–3s" },
  { label: "Sets to failure", value: "Rarely" },
]

/** `bar` drives the chart width; `range` is the target as prescribed. */
const weeklyVolume = [
  { muscle: "Chest", range: "7–9", bar: 9, hero: true },
  { muscle: "Back", range: "10–12", bar: 12, hero: true },
  { muscle: "Lateral Delts", range: "~6", bar: 6, hero: true },
  { muscle: "Glutes", range: "5–7", bar: 7 },
  { muscle: "Quads", range: "4–6", bar: 6 },
  { muscle: "Hamstrings", range: "3–5", bar: 5 },
  { muscle: "Biceps", range: "~4 + pulling", bar: 4 },
  { muscle: "Triceps", range: "~4 + pressing", bar: 4 },
  { muscle: "Rear Delts", range: "~2", bar: 2 },
]

const bodyComp = {
  weight: "102 kg",
  bodyFat: "31.6%",
  leanMass: "69.8 kg",
  targets: [
    { bf: "25%", weight: "93.1 kg" },
    { bf: "20%", weight: "87.3 kg" },
    { bf: "18%", weight: "85.1 kg" },
    { bf: "16%", weight: "83.1 kg", hero: true },
  ],
}

const weekOverview = [
  { label: "Mon", tag: "Chest", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Tue", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "Wed", tag: "Upper", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Thu", tag: "Rest", style: "bg-gray-500/15 text-gray-400 border-gray-600/30" },
  { label: "Fri", tag: "Back", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sat", tag: "Legs", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sun", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
]

/** Working sets per lifting day, for the volume section summary. */
const weeklyWorkingSets = dayKeys.reduce(
  (total, day) => total + dayPrograms[day].work.reduce((a, e) => a + e.sets, 0),
  0
)

// ─── Progress persistence ────────────────────────────────────────────────────

type Progress = Record<DayKey, boolean[][]>

const STORAGE_KEY = "pt-progress-v8"

/** Warm-up drills occupy the first slots of each day's progress array. */
function allExercises(day: DayKey): readonly Exercise[] {
  return [...dayPrograms[day].warmup, ...dayPrograms[day].work]
}

function blankProgress(): Progress {
  return Object.fromEntries(
    dayKeys.map((day) => [day, allExercises(day).map((e) => Array(e.sets).fill(false))])
  ) as Progress
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

// ─── View preference ────────────────────────────────────────────────────────
// "text" is the default: the whole week as plain lines. "full" adds photos,
// videos, cues and the reference sections.

type View = "text" | "full"

const VIEW_KEY = "pt-view"
const viewListeners = new Set<() => void>()

function getView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === "full" ? "full" : "text"
  } catch {
    return "text"
  }
}

function subscribeView(onChange: () => void): () => void {
  viewListeners.add(onChange)
  const onStorage = (e: StorageEvent) => {
    if (e.key === VIEW_KEY) onChange()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    viewListeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

function setView(next: View) {
  try {
    localStorage.setItem(VIEW_KEY, next)
  } catch {
    /* storage unavailable — the toggle still works for this render */
  }
  viewListeners.forEach((l) => l())
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
  compact = false,
}: {
  ex: Exercise
  completedSets: boolean[]
  onToggleSet: (setIndex: number) => void
  /** Warm-up drills render tighter: smaller photos, no "muscles worked" chips. */
  compact?: boolean
}) {
  const doneCount = completedSets.filter(Boolean).length
  const allDone = doneCount === ex.sets && ex.sets > 0

  return (
    <div className={`px-4 py-5 border-b border-gray-800/60 last:border-0 transition-colors ${allDone ? "bg-emerald-500/[0.04]" : ""}`}>
      {/* Demo photos: start & end position */}
      {ex.img && (
        <div className={`mb-4 grid grid-cols-2 gap-2 ${compact ? "max-w-xs" : ""}`}>
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
          {ex.imgNote && (
            <p className="col-span-2 text-[11px] leading-relaxed text-gray-600">{ex.imgNote}</p>
          )}
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
          <div className="shrink-0 text-lg font-bold text-blue-400 tabular-nums leading-tight text-right">
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

      {/* Fatigue caveat */}
      {ex.note && (
        <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-[12px] leading-relaxed text-amber-300/90">
          {ex.note}
        </p>
      )}

      {/* Muscles worked */}
      {ex.target && !compact && (
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
  program,
  sets,
  onToggle,
  onReset,
}: {
  program: DayProgram
  sets: boolean[][]
  onToggle: (exerciseIndex: number, setIndex: number) => void
  onReset: () => void
}) {
  const { warmup, work } = program
  const offset = warmup.length

  // The progress bar tracks working sets only — warm-up drills shouldn't pad the number.
  const workSets = sets.slice(offset)
  const total = workSets.reduce((a, s) => a + s.length, 0)
  const done = workSets.reduce((a, s) => a + s.filter(Boolean).length, 0)
  const pct = total ? Math.round((done / total) * 100) : 0
  const warmupDone = sets.slice(0, offset).every((s) => s.every(Boolean))

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-2">
        <div>
          <div className={`text-[10px] font-semibold uppercase tracking-widest ${program.color}`}>{program.eyebrow}</div>
          <h2 className="mt-0.5 text-[17px] font-semibold text-white">{program.title}</h2>
        </div>
        {sets.some((s) => s.some(Boolean)) && (
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
        <span className="shrink-0 text-[11px] text-gray-500 tabular-nums">{done}/{total} working sets</span>
      </div>

      {/* Warm-up — collapsed into one block */}
      {offset > 0 && (
        <details className="group mb-3 overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[13px] text-gray-400 transition-colors hover:text-gray-200">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-600 transition-transform group-open:rotate-90" />
            <span className="font-medium text-gray-300">{program.warmupLabel ?? "Warm-up"}</span>
            <span className="hidden text-gray-600 sm:inline">· {warmup.map((e) => e.name.replace(/\s*\(.*\)$/, "")).join(" · ")}</span>
            {warmupDone && <span className="ml-auto shrink-0 text-[11px] text-emerald-400">done</span>}
          </summary>
          <div className="border-t border-gray-800">
            {warmup.map((ex, i) => (
              <ExerciseRow
                key={ex.name + i}
                ex={ex}
                compact
                completedSets={sets[i]}
                onToggleSet={(setIndex) => onToggle(i, setIndex)}
              />
            ))}
          </div>
        </details>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
        {work.map((ex, i) => (
          <ExerciseRow
            key={ex.name + i}
            ex={ex}
            completedSets={sets[offset + i]}
            onToggleSet={(setIndex) => onToggle(offset + i, setIndex)}
          />
        ))}
      </div>
    </section>
  )
}

function RecoveryDay({ program }: { program: DayProgram }) {
  const rec = program.recovery
  const isZone2 = Boolean(rec?.duration)

  return (
    <section>
      <div className="mb-2">
        <div className={`text-[10px] font-semibold uppercase tracking-widest ${program.color}`}>{program.eyebrow}</div>
        <h2 className="mt-0.5 text-[17px] font-semibold text-white">{program.title}</h2>
      </div>
      <div className={`rounded-xl border p-4 ${isZone2 ? "border-blue-900/40 bg-blue-950/20" : "border-gray-800 bg-gray-900/20"}`}>
        <div className="flex items-start gap-3">
          {isZone2
            ? <Heart className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            : <Moon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />}
          <div>
            {isZone2 && (
              <p className="text-sm font-medium text-blue-200">Zone 2 · {rec?.duration}</p>
            )}
            <p className={`text-[13px] leading-relaxed text-gray-400 ${isZone2 ? "mt-1" : ""}`}>{rec?.note}</p>
          </div>
        </div>

        {isZone2 && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[...zone2Settings, { label: "Duration", value: rec!.duration! }].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-blue-900/40 bg-blue-950/30 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
                <div className="mt-0.5 text-[13px] font-semibold text-blue-200 tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TextDay({
  program,
  sets,
  onToggle,
  onReset,
}: {
  program: DayProgram
  sets: boolean[][]
  onToggle: (exerciseIndex: number, setIndex: number) => void
  onReset: () => void
}) {
  const { warmup, work, recovery } = program
  const offset = warmup.length
  const workSets = sets.slice(offset)
  const total = workSets.reduce((a, s) => a + s.length, 0)
  const done = workSets.reduce((a, s) => a + s.filter(Boolean).length, 0)
  const dayName = program.eyebrow.split(" · ")[0]
  const isTrainer = program.eyebrow.includes("Trainer")

  return (
    <section>
      <div className="flex items-baseline justify-between gap-2 border-b border-gray-800 pb-1.5">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-white">
          {dayName} <span className="text-gray-600">—</span> {program.title}
          {isTrainer && (
            <span className="ml-2 text-[10px] font-medium normal-case tracking-normal text-amber-400">trainer</span>
          )}
        </h2>
        {total > 0 && (
          <button
            onClick={onReset}
            className="shrink-0 text-[11px] tabular-nums text-gray-600 transition-colors hover:text-gray-400"
          >
            {done}/{total}
          </button>
        )}
      </div>

      {recovery && (
        <p className="pt-2 text-[13px] text-gray-400">
          {recovery.duration
            ? [recovery.duration, ...zone2Settings.map((z) => z.value)].join(" · ")
            : recovery.short}
        </p>
      )}

      {warmup.length > 0 && (
        <p className="pt-2 text-[12px] text-gray-600">
          Warm-up · {warmup.map((e) => e.name.replace(/\s*\(.*\)$/, "")).join(" · ")}
        </p>
      )}

      <div className="divide-y divide-gray-900">
        {work.map((ex, i) => {
          const completed = sets[offset + i]
          const allDone = completed.every(Boolean)
          return (
            <div key={ex.name + i} className="py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className={`text-[13px] ${allDone ? "text-gray-600 line-through" : "text-gray-200"}`}>
                  {ex.name}
                </span>
                <span className="shrink-0 text-[13px] tabular-nums text-gray-400">
                  {ex.sets} × {ex.reps}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <div className="flex gap-1">
                  {completed.map((active, j) => (
                    <button
                      key={j}
                      onClick={() => onToggle(offset + i, j)}
                      aria-label={`${ex.name} set ${j + 1}${active ? " done" : ""}`}
                      className={`h-7 w-7 rounded border text-[11px] font-semibold transition-all active:scale-95 ${active
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-700 bg-gray-900/40 text-gray-500 hover:border-emerald-500/50 hover:text-gray-300"
                        }`}
                    >
                      {active ? "✓" : j + 1}
                    </button>
                  ))}
                </div>
                {ex.weight && (
                  <span className="text-right text-[12px] tabular-nums text-blue-400">{ex.weight}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function TextWeek({
  progress,
  onToggle,
  onReset,
}: {
  progress: Progress
  onToggle: (day: DayKey, exerciseIndex: number, setIndex: number) => void
  onReset: (day: DayKey) => void
}) {
  return (
    <div className="space-y-7">
      {dayKeys.map((key) => (
        <TextDay
          key={key}
          program={dayPrograms[key]}
          sets={progress[key]}
          onToggle={(exIdx, setIdx) => onToggle(key, exIdx, setIdx)}
          onReset={() => onReset(key)}
        />
      ))}

      <div className="space-y-1.5 border-t border-gray-800 pt-4 text-[12px] leading-relaxed text-gray-500">
        <p>RIR 1–2 on compounds · RIR 0–2 on isolation · controlled 2–3s eccentric.</p>
        <p>Double progression: top of the rep range on every set, then the smallest jump in weight.</p>
        <p className="text-amber-300/80">Bad sleep? Keep the weight, hit good reps, move on.</p>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalTrainingPage() {
  const progress = React.useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  const view = React.useSyncExternalStore(subscribeView, getView, (): View => "text")
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
            <h1 className="text-xl font-semibold text-white">4-Day Hypertrophy Cut</h1>
          </div>
          {view === "full" ? (
            <>
              <p className="pl-6 text-sm text-gray-500">
                {weeklyWorkingSets} working sets across 4 lifting days · 2 Zone 2 sessions · 1 full rest day · Friday Heavy Back and Saturday Heavy Legs are the fixed anchors. Tap a set to check it off — progress is saved on this device.
              </p>
              <blockquote className="ml-6 mt-4 border-l-2 border-emerald-500/40 pl-3 text-[13px] italic leading-relaxed text-gray-400">
                Train hard enough to demand muscle growth, but not so much that recovery becomes the limiting factor.
              </blockquote>
            </>
          ) : (
            <p className="pl-6 text-sm text-gray-500">
              {weeklyWorkingSets} working sets · 4 lifting days · Fri &amp; Sat trainer
            </p>
          )}

          {/* View toggle */}
          <div className="mt-4 ml-6 inline-flex rounded-lg border border-gray-800 bg-gray-900/40 p-0.5">
            {(["text", "full"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold capitalize transition-colors ${view === v ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "text" && (
          <TextWeek progress={progress} onToggle={toggleSet} onReset={resetDay} />
        )}

        {view === "full" && (
          <>
          {/* Goal */}
          <section className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-200">Goal · Maximum muscle growth per unit of fatigue</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-400">
                  Not &ldquo;as many sets as possible&rdquo; — as much growth as can be recovered from while body fat comes down.
                  You can train hard, but sleep is short, so volume stays low and every working set has to earn its place.
                </p>
                <p className="mt-2 text-[12px] text-gray-600">
                  Friday and Saturday are trainer-led and fixed — the rest of the week is built around them, not the other way round.
                </p>
              </div>
            </div>
          </section>

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

          {/* Days */}
          {dayKeys.map((key, i) =>
            activeDay === null || activeDay === i ? (
              dayPrograms[key].work.length === 0 ? (
                <RecoveryDay key={key} program={dayPrograms[key]} />
              ) : (
                <DaySection
                  key={key}
                  program={dayPrograms[key]}
                  sets={progress[key]}
                  onToggle={(exIdx, setIdx) => toggleSet(key, exIdx, setIdx)}
                  onReset={() => resetDay(key)}
                />
              )
            ) : null
          )}

          {/* Progression */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Progressive Overload</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              Double progression, kept practical: add reps until you hit the top of the range on <em>all</em> sets, then take the smallest
              practical jump in weight and build it back up.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
              <div className="border-b border-gray-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Example · Low-Incline DB Press, 3 × 6–8
              </div>
              {progressionExample.map((row) => (
                <div
                  key={row.week}
                  className={`flex items-center justify-between gap-3 border-b border-gray-800/60 px-4 py-2.5 last:border-0 ${row.bump ? "bg-emerald-500/[0.06]" : ""}`}
                >
                  <span className="w-20 shrink-0 text-[13px] text-gray-500">{row.week}</span>
                  <span className={`w-20 shrink-0 text-[13px] font-medium tabular-nums ${row.bump ? "text-emerald-300" : "text-blue-400"}`}>
                    {row.weight}
                  </span>
                  <span className="flex-1 text-right text-[13px] tabular-nums text-gray-300">{row.reps}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2.5 text-[13px] leading-relaxed text-amber-300/90">
              <strong className="font-semibold">Bad sleep = don&rsquo;t force progression.</strong> If you slept five hours and the working
              weight feels terrible, you have nothing to prove. Keep the load, hit good reps at roughly the intended RIR, and move on.
              Consistency over months beats one heroic workout.
            </p>
          </section>

          {/* Intensity */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Intensity &amp; Tempo</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              No mandatory 3-second eccentrics. Lower under control — roughly 2–3 seconds — but never so slowly that it costs you
              productive load. Priority order: <em>full range of motion → stable technique → sufficient effort → progressive overload → recovery.</em>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {intensityRules.map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-gray-800 bg-gray-900/20 p-3">
                  <div className="text-[11px] text-gray-500">{label}</div>
                  <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Weekly volume */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Weekly Volume Targets</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              Direct sets per muscle per week — {weeklyWorkingSets} in total. This is deliberately less than a high-volume program:
              while performance keeps progressing, there is no reason to add sets.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
              {weeklyVolume.map(({ muscle, range, bar, hero }) => (
                <div
                  key={muscle}
                  className={`flex items-center gap-3 border-b border-gray-800/60 px-4 py-2.5 last:border-0 ${hero ? "bg-emerald-500/[0.05]" : ""}`}
                >
                  <span className={`w-24 shrink-0 text-[13px] ${hero ? "font-medium text-emerald-300" : "text-gray-400"}`}>
                    {muscle}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className={`h-full rounded-full ${hero ? "bg-emerald-500" : "bg-gray-600"}`}
                      style={{ width: `${(bar / 12) * 100}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-[12px] tabular-nums text-gray-300">{range}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
              Front delts get substantial indirect work from incline and overhead pressing, so the real shoulder stimulus is larger than
              the direct lateral and rear-delt numbers suggest.
            </p>
          </section>

          {/* Body composition */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Where This Is Going</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              At {bodyComp.weight} and {bodyComp.bodyFat} body fat, lean mass is roughly <strong className="font-medium text-gray-300">{bodyComp.leanMass}</strong>.
              Hold on to most of that and the scale lands here:
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
              {bodyComp.targets.map(({ bf, weight, hero }) => (
                <div
                  key={bf}
                  className={`flex items-center justify-between gap-3 border-b border-gray-800/60 px-4 py-2.5 last:border-0 ${hero ? "bg-emerald-500/[0.06]" : ""}`}
                >
                  <span className={`text-[13px] tabular-nums ${hero ? "font-medium text-emerald-300" : "text-gray-400"}`}>
                    {bf} body fat
                  </span>
                  <span className={`text-[13px] font-medium tabular-nums ${hero ? "text-emerald-300" : "text-gray-300"}`}>
                    {weight}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
              You can&rsquo;t selectively burn abdominal fat. The waist and visceral fat come down as total body fat comes down — which is
              exactly why the lifting matters: it decides how much of that {bodyComp.leanMass} you keep on the way there.
            </p>
          </section>

          {/* Priority hierarchy */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Priority Hierarchy</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              When something has to give, give it up from the bottom of this list.
            </p>
            <div className="space-y-3">
              {priorities.map(({ topic, rule }, i) => (
                <div key={topic} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-[11px] font-semibold text-violet-300 tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-violet-400">{topic}</span>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-400">{rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          </>
        )}

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
