"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Dumbbell, Utensils, Play, Target, ChevronRight, Heart, Moon, AlertTriangle } from "lucide-react"

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

  // ── Monday · Chest, Shoulders, Triceps + Light Legs ──
  inclineChestPress: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Set the bench to a low 15–30° incline. Pin the shoulder blades into the pad, chest puffed, elbows tucked to roughly 45–60° rather than flared into a T",
    sets: 3,
    reps: "6–8",
    intensity: "RIR 1–3",
    tempo: "Control the lowering phase of every rep, then drive up strongly",
    rest: "2–3 min",
    cues: [
      "The priority lift of the week — upper chest leads this program",
      "Keep the incline low so it stays a chest press, not a shoulder press",
      "Control the descent on every single rep",
      "Leave 1–3 reps in reserve; no forced reps here"
    ],
    muscle: "Chest" as Muscle,
    weight: "20–22 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  pecDeck: {
    name: "Pec Deck / Chest Fly",
    img: "pecDeck",
    target: "Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Pec Deck / Chest Fly Machine",
    altMachine: "Cable Crossover",
    setup: "Seat set so the handles sit at mid-chest height. Shoulder blades back and down, a fixed slight elbow bend held all set",
    sets: 2,
    reps: "10–15",
    intensity: "RIR 1–2",
    tempo: "Squeeze the handles together, hold the contraction a beat, open slowly into a deep stretch",
    rest: "60–120 sec",
    cues: [
      "Isolation after the heavy press — stretch and squeeze, not load",
      "Elbow angle stays fixed; this is a fly, not a press",
      "Stop with 1–2 reps left, not at failure",
      "Log the load you settle on"
    ],
    muscle: "Chest" as Muscle,
    video: "https://www.youtube.com/watch?v=ze4JaQCcGLg",
  },
  seatedRowMachineMon: {
    name: "Seated Row Machine",
    img: "seatedRowMachine",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Biceps"],
    machine: "Seated Row Machine",
    altMachine: "Seated Cable Row",
    setup: "Chest against the pad, feet planted. Arms reach to full stretch at the front of each rep without the torso swinging forward",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1–3",
    tempo: "Row with the elbows, hold the squeeze a beat, return under control to a full stretch",
    rest: "2 min",
    cues: [
      "Back's first of three weekly exposures — Friday carries the heavy work",
      "Controlled range of motion; never use momentum to move the weight",
      "Bring the elbows back, keep the torso stable",
      "Start conservative and log the load"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=TeFo51Q_Nsc",
  },
  dumbbellLateralRaiseMon: {
    name: "Dumbbell Lateral Raise",
    img: "dumbbellLateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Dumbbells",
    altMachine: "Cable Lateral Raise",
    setup: "Stand tall, dumbbells at your sides, a slight fixed bend in the elbows. Shoulders stay down — no shrugging into the traps",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 1–2",
    tempo: "Raise to shoulder height, pause briefly at the top, lower under control",
    rest: "60–90 sec",
    cues: [
      "Lateral delts are a priority — this is what builds shoulder width",
      "No swinging the torso and no excessive shrugging",
      "Lead with the elbows, pinkies slightly high",
      "Lighter than you think; the reps should be the hard part"
    ],
    muscle: "Shoulders" as Muscle,
    video: "https://www.youtube.com/watch?v=Kl3LEzQ5Zqs",
  },
  tricepsPressMachine: {
    name: "Triceps Press Machine",
    img: "tricepsPressMachine",
    target: "Triceps",
    secondaryMuscles: [],
    machine: "Triceps Press / Extension Machine",
    altMachine: "Cable Triceps Pushdown",
    setup: "Seat set so the elbows line up with the machine's pivot and stay pinned through the whole set",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1–2",
    tempo: "Press out hard, return under control to a full stretch",
    rest: "60–120 sec",
    cues: [
      "The week's only direct triceps work — pressing covers the rest",
      "Elbows stay fixed; nothing moves but the forearms",
      "Full range beats heavy partials",
      "Log the load so Monday-to-Monday progress is comparable"
    ],
    muscle: "Triceps" as Muscle,
    video: "https://www.youtube.com/watch?v=j4XSuFLiZ6I",
  },
  legPressMon: {
    name: "45-Degree Leg Press",
    img: "legPress",
    target: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    machine: "45-Degree Leg Press",
    altMachine: "Hack Squat",
    setup: "Feet mid-platform and shoulder-width. Pick a depth you can control without the lower back lifting off the pad",
    sets: 2,
    reps: "10–15",
    intensity: "RIR 1–3",
    tempo: "Press out smoothly, lower under control — no bouncing at the bottom",
    rest: "2 min",
    cues: [
      "Deliberately submaximal — Saturday is the main leg session",
      "A second weekly quad stimulus, not a second leg day",
      "Knees track over the toes, never caving inward",
      "Keep well clear of failure; this should not cost you anything by Friday"
    ],
    muscle: "Legs" as Muscle,
    weight: "Submaximal — well under Saturday",
    video: "https://www.youtube.com/watch?v=K5n2vg3oZa4",
  },

  // ── Wednesday · Upper Body + Hamstrings ──
  inclineChestPressWed: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Same low 15–30° incline as Monday. Shoulder blades locked into the pad, chest puffed out",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 1–3",
    tempo: "Controlled lowering, strong press up",
    rest: "2–3 min",
    cues: [
      "Chest's second weekly exposure — quality stimulus, not a second heavy day",
      "Slightly lighter than Monday to own the 8–10 range",
      "Same depth and elbow path as Monday",
      "Stop with 1–3 reps in reserve"
    ],
    muscle: "Chest" as Muscle,
    weight: "18–20 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  seatedRowMachineWed: {
    name: "Seated Row Machine",
    img: "seatedRowMachine",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Biceps"],
    machine: "Seated Row Machine",
    altMachine: "Seated Cable Row",
    setup: "Chest against the pad, feet planted, full stretch at the front of every rep",
    sets: 3,
    reps: "8–12",
    intensity: "RIR 1–3",
    tempo: "Row with the elbows, squeeze a beat, return under control to a full stretch",
    rest: "2 min",
    cues: [
      "Back thickness work — the main driver alongside Friday",
      "Controlled range of motion; no momentum",
      "Torso stays stable, elbows drive back",
      "Same logged load as Monday unless it feels different"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=TeFo51Q_Nsc",
  },
  shoulderPress: {
    name: "Shoulder Press Machine",
    img: "shoulderPress",
    target: "Front Delts",
    secondaryMuscles: ["Side Delts", "Triceps"],
    machine: "Shoulder Press Machine",
    altMachine: "Dumbbell Shoulder Press",
    setup: "Hips glued to the backrest. Press straight up without arching the lower back",
    sets: 2,
    reps: "6–10",
    intensity: "RIR 1–3",
    tempo: "Press up cleanly, lower under control",
    rest: "2–3 min",
    cues: [
      "Challenging but technically consistent — don't let form slide for an extra rep",
      "Stay pressed into the backrest, no back arch",
      "The week's only direct front-delt work; pressing covers the rest",
      "Stop the set if technique deteriorates or anything pinches"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "25–30 KG",
    video: "https://www.youtube.com/watch?v=6v4nrRVySj0",
  },
  preacherCurl: {
    name: "Preacher Curl",
    img: "preacherCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Machine Preacher Curl",
    altMachine: "Preacher Bench + EZ Bar",
    setup: "Sit upright with the backs of the arms flat on the pad, armpits into the top of it. Start every rep from a full stretch",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1–2",
    tempo: "Curl with constant tension, squeeze at the top, lower under control to a full stretch",
    rest: "60–120 sec",
    cues: [
      "The week's only direct biceps work — pulling covers the rest",
      "Arms glued to the pad; the pad is what removes the cheating",
      "Full controlled range of motion on every rep",
      "Add two sets of curls on Friday if arm growth becomes a priority"
    ],
    muscle: "Biceps" as Muscle,
    weight: "25–30 KG",
    video: "https://www.youtube.com/watch?v=Ja6ZlIDONac",
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
    intensity: "RIR 1–2",
    tempo: "Sweep the elbows wide and back, squeeze a beat, return under control",
    rest: "60–90 sec",
    cues: [
      "Rear delts twice a week, Wednesday and Friday — four sets total",
      "Chest stays on the pad, no torso rotation",
      "Sweep wide to the walls, don't row toward the hips",
      "Light load, hard squeeze"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "30–35 KG",
    video: "https://www.youtube.com/watch?v=dC7jhEk-29A",
  },
  legCurlWed: {
    name: "Seated or Lying Leg Curl",
    img: "legCurl",
    target: "Hamstrings",
    secondaryMuscles: [],
    machine: "Seated or Lying Leg Curl Machine",
    setup: "Line the knee joints up with the machine's pivot. Thigh pad tight if seated. Use whichever machine is free",
    sets: 3,
    reps: "10–15",
    intensity: "RIR 1–2",
    tempo: "Curl hard, squeeze at full contraction, control the return — never let the weight drop",
    rest: "60–120 sec",
    cues: [
      "Hamstrings' first of two weekly sessions; Saturday carries the heavier three",
      "Control the return instead of letting the stack fall",
      "Feet flexed toward the shins",
      "Hips stay down; don't let the lower back lift off the pad"
    ],
    muscle: "Legs" as Muscle,
    weight: "Lighter than Saturday",
    note: "No seated or lying curl machine available? Substitute 45-degree back extensions, 2–3 × 10–15, as long as the movement is comfortable and technically clean.",
    video: "https://www.youtube.com/watch?v=Orxowest56U",
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
    setup: "Sit upright, thigh pad locked down. Neutral grip at roughly shoulder width, chest up before the first rep",
    sets: 3,
    reps: "6–8",
    intensity: "RIR 1–3",
    tempo: "Drive the elbows down and back, return under control to a full overhead stretch",
    rest: "2–3 min",
    cues: [
      "A controlled vertical pull — this is the lat builder of the week",
      "Lead with the elbows, don't pull with the hands",
      "Full stretch at the top of every rep",
      "Coordinate the load with your trainer; don't take every heavy set to failure"
    ],
    muscle: "Back" as Muscle,
    weight: "55–60 KG",
    video: "https://www.youtube.com/watch?v=KgZqDuNx7rI",
  },
  seatedCableRow: {
    name: "Seated Cable Row",
    img: "seatedCableRow",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Rhomboids"],
    machine: "Seated Cable Row",
    altMachine: "Seated Row Machine",
    setup: "Sit upright with a slight knee bend, chest tall, feet braced. Arms straighten fully at the front of each rep — stretch from the shoulder blades, not by rounding the lower back",
    sets: 3,
    reps: "8–10",
    intensity: "RIR 1–3",
    tempo: "Row to the lower ribs, squeeze the shoulder blades a beat, return under control to a full stretch",
    rest: "2–3 min",
    cues: [
      "Second heavy movement of the day — treat it like a main lift",
      "Bring the elbows back while the torso stays stable",
      "Squeeze the shoulder blades together at the top of every rep",
      "Take the full 2–3 minutes between sets"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=LyZH4UGdDTc",
  },
  chestSupportedDumbbellRow: {
    name: "Chest-Supported Dumbbell Row",
    img: "chestSupportedDumbbellRow",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Rear Delts"],
    machine: "Dumbbells + Incline Bench",
    altMachine: "Chest-Supported Row Machine",
    setup: "Lie chest-down on a bench set to roughly 30–45°, feet braced. Dumbbells hanging at full stretch, neutral grip",
    sets: 2,
    reps: "8–12",
    intensity: "RIR 1–3",
    tempo: "Row the dumbbells toward the hips, hold a beat, lower under control to a full stretch",
    rest: "2 min",
    cues: [
      "Extra back volume without loading the lower back to stabilise it",
      "Chest never leaves the pad — no torso english",
      "Pull toward the hips, not straight up to the shoulders",
      "Start conservative and log the load"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=vmX58YYK3-8",
  },
  dumbbellLateralRaiseFri: {
    name: "Dumbbell Lateral Raise",
    img: "dumbbellLateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Dumbbells",
    altMachine: "Cable Lateral Raise",
    setup: "Stand tall, dumbbells at your sides, slight fixed elbow bend, shoulders down",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 1–2",
    tempo: "Raise to shoulder height, brief pause, lower under control",
    rest: "60–90 sec",
    cues: [
      "Lateral delts' second weekly session — four quality sets a week builds the width",
      "Strict form even when the back work has drained you",
      "No swinging, no shrugging",
      "Drop the weight rather than letting the technique go"
    ],
    muscle: "Shoulders" as Muscle,
    video: "https://www.youtube.com/watch?v=Kl3LEzQ5Zqs",
  },

  // ── Saturday · Legs + Chest Accessory (trainer) ──
  legPress: {
    name: "45-Degree Leg Press",
    img: "legPress",
    target: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    machine: "45-Degree Leg Press",
    altMachine: "Hack Squat",
    setup: "Feet mid-platform and shoulder-width or slightly wider. Brace the core and keep the knees tracking out",
    sets: 3,
    reps: "8–12",
    intensity: "RIR 1–3",
    tempo: "Press out smoothly, lower under control to a consistent depth",
    rest: "2–3 min",
    cues: [
      "Primary leg movement — go heavy but keep every rep controlled",
      "Use a depth you can own without the lower back lifting from the pad",
      "Same depth every rep so the load means something week to week",
      "1–3 reps in reserve; no ego sets on the stack"
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
    machine: "Seated or Lying Leg Curl Machine",
    setup: "Line the knee joints up with the machine's pivot. Thigh pad tight if seated",
    sets: 3,
    reps: "8–12",
    intensity: "RIR 1–2",
    tempo: "Curl hard, squeeze at full contraction, control the return",
    rest: "90–120 sec",
    cues: [
      "The heavier of the two weekly hamstring sessions",
      "Feet flexed toward the shins",
      "Hips stay down; don't let the lower back lift off the pad",
      "Balances the quad-dominant pressing and protects the knees"
    ],
    muscle: "Legs" as Muscle,
    weight: "40–45 KG",
    video: "https://www.youtube.com/watch?v=Orxowest56U",
  },
  bulgarianSplitSquat: {
    name: "Bulgarian Split Squat",
    img: "bulgarianSplitSquat",
    target: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    machine: "Dumbbells + Bench",
    altMachine: "Smith Machine Split Squat",
    setup: "Dumbbell in each hand at your sides, rear foot up on the bench, front foot far enough forward that the knee reaches about 90°. Torso upright",
    sets: 2,
    reps: "8–10 per leg",
    intensity: "RIR 1–3",
    tempo: "Lower under control, then drive up through the front leg",
    rest: "2 min",
    cues: [
      "Stable balance and a comfortable range of motion beat extra depth",
      "Front knee tracks over the toes, never caves inward",
      "Drive from the front leg — the back leg is a kickstand",
      "Counts as direct work for both quads and glutes"
    ],
    muscle: "Legs" as Muscle,
    weight: "16–20 KG / hand",
    video: "https://www.youtube.com/watch?v=hPlKPjohFS0",
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
    reps: "8–12",
    intensity: "RIR 1–3",
    tempo: "Drive the hips up, squeeze at lockout for a beat, lower under control",
    rest: "2 min",
    cues: [
      "Finish with controlled hip extension, not an arched lower back",
      "Ribs down and chin tucked throughout",
      "The main direct glute movement of the week",
      "Squeeze hard at lockout rather than chasing the load"
    ],
    muscle: "Glutes" as Muscle,
    weight: "60–80 KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  pecDeckSat: {
    name: "Pec Deck / Chest Fly",
    img: "pecDeck",
    target: "Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Pec Deck / Chest Fly Machine",
    altMachine: "Cable Crossover",
    setup: "Same setup as Monday — handles at mid-chest height, shoulder blades back and down, fixed elbow bend",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 1–2",
    tempo: "Squeeze together, hold a beat, open slowly into a stretch",
    rest: "60–120 sec",
    cues: [
      "Chest's third weekly exposure — an accessory, not another maximal pressing session",
      "Run it after the leg work so it never compromises the main lower-body lifts",
      "Lighter than Monday by design",
      "Stop with 1–2 reps left"
    ],
    muscle: "Chest" as Muscle,
    video: "https://www.youtube.com/watch?v=ze4JaQCcGLg",
  },
} as const

// ─── Workout Programs ────────────────────────────────────────────────────────
// The first `warmup` exercises of each day render inside a collapsed warm-up block.

const warmupUpper = [
  exercises.thoracicOpener,
  exercises.shoulderMobility,
] as const

/** Friday is shoulder/scapular mobility only — the ramp-up sets do the rest. */
const warmupFriday = [
  exercises.shoulderMobility,
] as const

const warmupLower = [
  exercises.hipFlexorStretch,
  exercises.lowerBackStretch,
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
  /** Progressive warm-up sets to run after the mobility work, before set 1. */
  rampUp?: string
  /** Safety constraint shown prominently in both views. */
  safety?: string
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
    title: "Chest, Shoulders, Triceps + Light Legs",
    color: "text-emerald-400",
    warmup: warmupUpper,
    rampUp: "Then 2–4 progressively heavier warm-up sets on the first main lift.",
    work: [
      exercises.inclineChestPress,
      exercises.pecDeck,
      exercises.seatedRowMachineMon,
      exercises.dumbbellLateralRaiseMon,
      exercises.tricepsPressMachine,
      exercises.legPressMon,
    ],
  },
  tuesday: {
    eyebrow: "Tuesday",
    title: "Zone 2 Cardio",
    color: "text-blue-400",
    warmup: [],
    work: [],
    recovery: {
      duration: "35–45 min",
      short: "35–45 min · conversational · ~3–4/10 · walk, elliptical or bike",
      note: "Aerobic fitness and fat loss without compromising lifting recovery. Use a pace that lets you speak in complete sentences — heart rate can guide intensity, but the right range varies by person. Finish feeling you could have continued a little longer. Do not turn this into an interval session.",
    },
  },
  wednesday: {
    eyebrow: "Wednesday",
    title: "Upper Body + Hamstrings",
    color: "text-emerald-400",
    warmup: warmupUpper,
    rampUp: "Then 2–4 progressively heavier warm-up sets on the first main lift.",
    work: [
      exercises.inclineChestPressWed,
      exercises.seatedRowMachineWed,
      exercises.shoulderPress,
      exercises.preacherCurl,
      exercises.reversePecDeck,
      exercises.legCurlWed,
    ],
  },
  thursday: {
    eyebrow: "Thursday",
    title: "Rest and Recovery",
    color: "text-gray-500",
    warmup: [],
    work: [],
    recovery: {
      note: "Let fatigue dissipate before the two consecutive trainer-led sessions. Normal daily walking, light mobility if you want it, adequate food and hydration, and sleep. Avoid adding an extra hard workout simply because this is a non-training day.",
      short: "Rest. Walking, light mobility, food, sleep — no extra workout.",
    },
  },
  friday: {
    eyebrow: "Friday · Trainer",
    title: "Heavy Back + Delts",
    color: "text-amber-400",
    warmup: warmupFriday,
    rampUp: "Then light warm-up sets of Lat Pulldown and Seated Cable Row before the working sets.",
    work: [
      exercises.neutralGripLatPulldown,
      exercises.seatedCableRow,
      exercises.chestSupportedDumbbellRow,
      exercises.dumbbellLateralRaiseFri,
      exercises.reversePecDeck,
    ],
  },
  saturday: {
    eyebrow: "Saturday · Trainer",
    title: "Legs + Chest Accessory",
    color: "text-amber-400",
    warmup: warmupLower,
    safety: "Your trainer may reorder these based on fatigue, equipment and technique. Keep the overall volume similar unless there is a clear reason to change it.",
    work: [
      exercises.legPress,
      exercises.legCurl,
      exercises.bulgarianSplitSquat,
      exercises.hipThrust,
      exercises.pecDeckSat,
    ],
  },
  sunday: {
    eyebrow: "Sunday",
    title: "Zone 2 Cardio",
    color: "text-blue-400",
    warmup: [],
    work: [],
    recovery: {
      duration: "30–45 min",
      short: "30–45 min · easy · lower-impact option if the legs are sore",
      note: "Keep this easy enough to recover from Friday and Saturday. If leg soreness is significant, pick a lower-impact option or shorten the session.",
    },
  },
}

const dayKeys = Object.keys(dayPrograms) as DayKey[]

/** Shared targets for every Zone 2 session — effort-based, not a fixed treadmill prescription. */
const zone2Settings = [
  { label: "Intensity", value: "Conversational" },
  { label: "Effort", value: "~3–4 / 10" },
  { label: "Options", value: "Incline walk, elliptical or bike" },
]

const progressionExample = [
  { session: "1", load: "Same load", reps: "8, 7, 6" },
  { session: "2", load: "Same load", reps: "8, 8, 7" },
  { session: "3", load: "Same load", reps: "8, 8, 8" },
  { session: "4", load: "Small increase", reps: "7, 6, 6", bump: true },
]

const fatigueRules = [
  { when: "Friday and Saturday", then: "Keep the workload coordinated with your trainer across both days." },
  { when: "Performance declining over several sessions", then: "Review sleep, calorie intake and accumulated fatigue before changing the program." },
  { when: "Soreness or fatigue persisting", then: "Reduce accessory volume before cutting the main exercises." },
  { when: "Weight loss stalls", then: "Check dietary adherence and the weight trend first. Do not automatically add cardio or lifting volume." },
  { when: "Technique deteriorating or pain", then: "Stop the set. Modify the movement rather than forcing the planned load." },
  { when: "Every week", then: "Hold a consistent sleep schedule and an adequate sleep duration — recovery is part of the program, not an optional extra." },
]

const weeklyReview = [
  "Average weekly body weight",
  "Waist circumference",
  "Working weights and repetitions",
  "Sleep quality and recovery",
  "Completion of planned sessions",
]

const intensityRules = [
  { label: "Compound exercises", value: "RIR 1–3" },
  { label: "Isolation exercises", value: "RIR 1–2" },
  { label: "Forced reps", value: "Avoid" },
  { label: "Training to failure", value: "Rarely, and not on compounds" },
]

/**
 * Direct working sets, counted from the day programs above.
 * `indirect` is listed separately and never counted as a direct session.
 */
const weeklyVolume = [
  { muscle: "Back", direct: 13, days: "Mon · Wed · Fri", bar: 13, hero: true },
  { muscle: "Chest", direct: 9, days: "Mon · Wed · Sat", bar: 9, hero: true },
  { muscle: "Quadriceps", direct: 7, days: "Mon · Sat", bar: 7, indirect: "includes the unilateral split-squat work" },
  { muscle: "Hamstrings", direct: 6, days: "Wed · Sat", bar: 6 },
  { muscle: "Lateral Delts", direct: 4, days: "Mon · Fri", bar: 4, hero: true },
  { muscle: "Rear Delts", direct: 4, days: "Wed · Fri", bar: 4 },
  { muscle: "Glutes", direct: 4, days: "Sat", bar: 4, indirect: "plus leg-press work on Monday and Saturday" },
  { muscle: "Front Delts", direct: 2, days: "Wed", bar: 2, indirect: "plus every incline and overhead press" },
  { muscle: "Biceps", direct: 2, days: "Wed", bar: 2, indirect: "plus all the pulling" },
  { muscle: "Triceps", direct: 2, days: "Mon", bar: 2, indirect: "plus all the pressing" },
]

const nutrition = [
  { label: "Calories", value: "Moderate deficit, adjusted on the 2–3 week trend" },
  { label: "Protein", value: "~190–210 g/day" },
  { label: "Fat", value: "Enough — don't cut it excessively" },
  { label: "Carbohydrates", value: "The remaining allowance, to fuel training" },
  { label: "Pace", value: "0.5–1.0% body weight per week" },
]

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

function SafetyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
      <p className="text-[12px] leading-relaxed text-amber-200/90">{children}</p>
    </div>
  )
}

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

      {program.safety && <div className="mb-3"><SafetyNote>{program.safety}</SafetyNote></div>}

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
            {program.rampUp && (
              <p className="border-t border-gray-800/60 px-4 py-3 text-[12px] leading-relaxed text-gray-500">
                {program.rampUp}
              </p>
            )}
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

        {program.safety && <SafetyNote>{program.safety}</SafetyNote>}

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
        <p className="pt-2 text-[13px] text-gray-400">{recovery.short}</p>
      )}

      {program.safety && <SafetyNote>{program.safety}</SafetyNote>}

      {warmup.length > 0 && (
        <p className="pt-2 text-[12px] text-gray-600">
          Warm-up · {warmup.map((e) => e.name.replace(/\s*\(.*\)$/, "")).join(" · ")}
          {program.rampUp && <span className="block">{program.rampUp}</span>}
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
              {ex.note && <SafetyNote>{ex.note}</SafetyNote>}
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
                {weeklyWorkingSets} working sets across 4 lifting days · 2 Zone 2 sessions · 1 full rest day. Chest and back are trained
                three times a week, with Friday and Saturday fixed as the trainer-led anchors. Tap a set to check it off — progress is
                saved on this device.
              </p>
              <blockquote className="ml-6 mt-4 border-l-2 border-emerald-500/40 pl-3 text-[13px] italic leading-relaxed text-gray-400">
                Train for hypertrophy first. Strength progression is valuable, but powerlifting performance is secondary and should not
            compromise muscle growth or recovery.
              </blockquote>
            </>
          ) : (
            <p className="pl-6 text-sm text-gray-500">
              {weeklyWorkingSets} working sets · 4 lifting days · chest &amp; back 3×/week · Fri &amp; Sat trainer
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
                <p className="text-sm font-medium text-emerald-200">Goal · Hypertrophy first, fat loss alongside</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-400">
                  Maximise muscle hypertrophy while reducing body fat and preserving strength through the deficit.
                  Priority muscles: chest — especially the upper chest; shoulders — especially the lateral delts for width;
                  back thickness and overall back development; and legs and glutes to keep development balanced.
                </p>
                <p className="mt-2 text-[12px] text-gray-600">
                  Friday and Saturday are trainer-led and fixed — the rest of the week is built around them, not the other way round.
                  Strength is a secondary goal, not the organising principle: powerlifting-specific work is optional here and must not
                  come at the cost of muscle growth or recovery. If competition numbers ever become the goal, that wants a dedicated
                  strength block rather than sacrificing hypertrophy year-round.
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
                  key={row.session}
                  className={`flex items-center gap-3 border-b border-gray-800/60 px-4 py-2.5 last:border-0 ${row.bump ? "bg-emerald-500/[0.06]" : ""}`}
                >
                  <span className="w-5 shrink-0 text-[13px] tabular-nums text-gray-600">{row.session}</span>
                  <span className={`flex-1 text-[12px] ${row.bump ? "font-medium text-emerald-300" : "text-gray-400"}`}>
                    {row.load}
                  </span>
                  <span className={`shrink-0 text-right text-[13px] tabular-nums ${row.bump ? "text-emerald-300" : "text-blue-400"}`}>
                    {row.reps}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
              Illustrative numbers — actual progress depends on recovery, technique and the equipment available. On machines, compare
              performance on the <em>same</em> machine, since stack numbers differ between models.
            </p>
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2.5 text-[13px] leading-relaxed text-amber-300/90">
              <strong className="font-semibold">Bad sleep = don&rsquo;t force progression.</strong> If you slept five hours and the working
              weight feels terrible, you have nothing to prove. Keep the load and the target RIR, hit good reps, and move on.
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

          {/* Fatigue management */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Recovery &amp; Adjustment Rules</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              Recovery is part of the program, not an optional extra. Friday and Saturday run back to back, so what gets cut matters
              more than what gets added.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
              {fatigueRules.map(({ when, then }) => (
                <div key={when} className="border-b border-gray-800/60 px-4 py-2.5 last:border-0">
                  <div className="text-[12px] font-medium text-gray-300">{when}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">{then}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
              Don&rsquo;t add sets just to make a session feel harder. Add volume only when recovery is good <em>and</em> the target
              muscle has stopped progressing.
            </p>
          </section>

          {/* Weekly volume */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Weekly Volume Targets</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              Direct sets per muscle per week — {weeklyWorkingSets} in total. This is deliberately less than a high-volume program:
              while performance keeps progressing, there is no reason to add sets.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
              {weeklyVolume.map(({ muscle, direct, days, bar, hero, indirect }) => (
                <div
                  key={muscle}
                  className={`border-b border-gray-800/60 px-4 py-2.5 last:border-0 ${hero ? "bg-emerald-500/[0.05]" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`text-[13px] ${hero ? "font-medium text-emerald-300" : "text-gray-400"}`}>
                      {muscle}
                    </span>
                    <span className="shrink-0 text-right text-[12px] text-gray-300">
                      <span className="tabular-nums">{direct}</span> direct <span className="text-gray-600">· {days}</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className={`h-full rounded-full ${hero ? "bg-emerald-500" : "bg-gray-600"}`}
                      style={{ width: `${(bar / 13) * 100}%` }}
                    />
                  </div>
                  {indirect && (
                    <p className="mt-1 text-[11px] text-gray-600">Indirect: {indirect} — not counted as a direct session.</p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
              Direct working sets only, counted from the sessions above. Compounds also stimulate secondary muscles, but indirect work is
              never counted as a direct session. A single exercise can be direct for two muscles — Bulgarian split squats count for quads
              and glutes — so these rows deliberately sum to more than the {weeklyWorkingSets} working sets in the week.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-gray-500">
              <strong className="font-medium text-gray-300">Chest and back are deliberately prioritised, and direct arm volume is low.</strong>{" "}
              If arm growth becomes a higher priority, add 2 sets of curls on Friday and 2 sets of triceps pressdowns or machine extensions
              on Wednesday — provided recovery stays adequate.
            </p>
          </section>

          {/* Nutrition */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Nutrition During the Cut</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              Lose fat while preserving training performance and lean mass. The weekly trend decides the next move, not any single reading.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
              {nutrition.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-gray-800/60 px-4 py-2.5 last:border-0">
                  <span className="shrink-0 text-[13px] text-gray-400">{label}</span>
                  <span className="text-right text-[13px] font-medium text-gray-200">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-gray-600">
              <p>The slower end of that pace is usually preferable when preserving muscle and strength is the priority.</p>
              <p>Track average weekly weight, waist circumference, gym performance and recovery together — not a single body-composition reading.</p>
              <p>Creatine, if you already use it and it suits you: daily consistency matters more than timing it around workouts.</p>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <p className="text-[12px] leading-relaxed text-amber-200/90">
                If medication substantially reduces your appetite, don&rsquo;t let protein, hydration or total intake drift too low.
                Follow your prescribing clinician&rsquo;s instructions for any medication.
              </p>
            </div>
          </section>

          {/* Weekly review */}
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Weekly Review</h2>
            <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
              Record these every week. Review the trend every two weeks before changing calories, cardio or volume — not sooner.
            </p>
            <div className="space-y-2">
              {weeklyReview.map((item, i) => (
                <div key={item} className="flex items-baseline gap-3">
                  <span className="w-4 shrink-0 text-[12px] tabular-nums text-gray-600">{i + 1}</span>
                  <span className="text-[13px] text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Final principle */}
          <section className="rounded-xl border border-gray-800 bg-gray-900/20 p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600">Final Training Principle</h2>
            <p className="text-[14px] font-medium leading-relaxed text-gray-200">
              Train hard enough to stimulate growth, use progressive overload to measure improvement, and manage fatigue so that you
              can repeat high-quality sessions consistently.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-gray-500">
              Hypertrophy is the primary objective. Powerlifting-style strength gains are welcome when they support it, but they are
              not worth sacrificing recovery or productive muscle-building volume.
            </p>
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
