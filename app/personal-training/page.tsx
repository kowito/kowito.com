"use client"

import React from "react"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import {
  Burst,
  Caption,
  INK,
  PageTitle,
  Panel,
  RED_TEXT,
  SectionTitle,
  SiteHeader,
  Sticker,
  buttonClass,
  display,
  halftone,
  ink,
  lettering,
  tilts,
} from "@/components/comic"
import { Reveal } from "@/components/comic-motion"
import { AlertTriangle, Check, ChevronRight, Dumbbell, Heart, Moon, Play, RotateCcw, Target, Utensils } from "lucide-react"

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
  /** The day's comic ink (see INK). */
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
    color: INK.green,
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
    color: INK.cyan,
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
    color: INK.green,
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
    color: INK.purple,
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
    color: INK.yellow,
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
    color: INK.yellow,
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
    color: INK.cyan,
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
  { label: "Mon", tag: "Chest", color: INK.green },
  { label: "Tue", tag: "Zone 2", color: INK.cyan },
  { label: "Wed", tag: "Upper", color: INK.green },
  { label: "Thu", tag: "Rest", color: INK.purple },
  { label: "Fri", tag: "Back", color: INK.yellow },
  { label: "Sat", tag: "Legs", color: INK.yellow },
  { label: "Sun", tag: "Zone 2", color: INK.cyan },
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

/** Day inks read white only on purple; every other one takes black lettering. */
const onInk = (color: string) => (color === INK.purple ? "text-white" : "text-black")

const stripes = (color: string, light: string) => `repeating-linear-gradient(45deg, ${color} 0 10px, ${light} 10px 20px)`

const eyebrowLabel = "text-[10px] font-bold uppercase tracking-wider text-black/60"

/** Rubber-stamped onto a finished day or exercise. */
function DoneStamp({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 -rotate-6 border-[2.5px] bg-white px-1.5 py-0.5 ${display} text-sm leading-none animate-in fade-in zoom-in-150 duration-200 motion-reduce:animate-none ${className}`}
      style={{ color: RED_TEXT, borderColor: RED_TEXT, outline: `1.5px solid ${RED_TEXT}`, outlineOffset: "2px" }}
    >
      Done!
    </span>
  )
}

/** Slams in, then puffs away, next to the set that finished the day. Skipped for reduced motion. */
function DoneBurst({ className = "" }: { className?: string }) {
  return <Burst text="DONE!" className={`pointer-events-none absolute z-20 w-20 animate-comic-pop motion-reduce:hidden ${className}`} />
}

/**
 * Wraps a day's toggle so the tap that checks its last working set is remembered, and the
 * exercise it landed on can pop a "DONE!" burst. Warm-up drills never count.
 */
function useDonePop(sets: boolean[][], offset: number, onToggle: (exerciseIndex: number, setIndex: number) => void) {
  const [pop, setPop] = React.useState<{ n: number; ex: number } | null>(null)
  const toggle = (exerciseIndex: number, setIndex: number) => {
    const finishing =
      exerciseIndex >= offset &&
      !sets[exerciseIndex][setIndex] &&
      sets.slice(offset).every((s, i) => s.every((v, j) => v || (offset + i === exerciseIndex && j === setIndex)))
    if (finishing) setPop((p) => ({ n: (p?.n ?? 0) + 1, ex: exerciseIndex }))
    onToggle(exerciseIndex, setIndex)
  }
  return { pop, toggle }
}

/** A set to tick off: an inked box that presses flat and gets a check stamped into it. */
function SetBox({ n, done, label, onClick, big = false }: { n: number; done: boolean; label: string; onClick: () => void; big?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid select-none place-items-center ${ink} ${display} leading-none text-black transition-[transform,box-shadow] duration-100 motion-reduce:transition-none ${
        big ? "h-11 flex-1 text-2xl" : "h-9 w-9 shrink-0 text-xl"
      } ${
        done
          ? "translate-x-[3px] translate-y-[3px] shadow-none"
          : "bg-white shadow-[3px_3px_0_0_#000] hover:bg-[#FFF4DC] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      }`}
      style={done ? { backgroundColor: INK.green, ...halftone("rgba(0,0,0,0.2)", 5) } : undefined}
    >
      {done ? (
        <Check
          className={`${big ? "h-7 w-7" : "h-6 w-6"} -rotate-6 animate-in fade-in zoom-in-150 spin-in-12 duration-200 motion-reduce:animate-none`}
          strokeWidth={4}
        />
      ) : (
        n
      )}
    </button>
  )
}

function SafetyNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-2 border-2 border-black px-3 py-2 shadow-[2px_2px_0_0_#000] ${className}`} style={{ backgroundColor: INK.yellow }}>
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
      <p className="text-[13px] leading-snug text-black">{children}</p>
    </div>
  )
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={`mb-0.5 ${eyebrowLabel}`}>{label}</div>
      <p className="text-[13px] leading-relaxed text-black">{children}</p>
    </div>
  )
}

/** Day name in a narration box, then the session lettered in the day's ink. */
function DayHeading({ program, children }: { program: DayProgram; children?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0 space-y-2.5">
        <Caption color={program.color} className={`-rotate-2 ${onInk(program.color)}`}>
          {program.eyebrow}
        </Caption>
        <h2 className={`${display} text-3xl leading-[1.05] md:text-4xl`} style={{ ...lettering(2, 3), color: program.color }}>
          {program.title}
        </h2>
      </div>
      {children}
    </div>
  )
}

function ExerciseRow({
  ex,
  completedSets,
  onToggleSet,
  compact = false,
  celebrate,
}: {
  ex: Exercise
  completedSets: boolean[]
  onToggleSet: (setIndex: number) => void
  /** Warm-up drills render tighter: smaller photos, no "muscles worked" chips. */
  compact?: boolean
  /** Key of the "DONE!" burst to pop on this exercise, when it was the one that finished the day. */
  celebrate?: number
}) {
  const doneCount = completedSets.filter(Boolean).length
  const allDone = doneCount === ex.sets && ex.sets > 0

  return (
    <div className={compact ? "px-3 py-4" : "p-4"}>
      {/* Demo photos: start & end position */}
      {ex.img && (
        <div className={`mb-4 grid grid-cols-2 gap-3 ${compact ? "max-w-xs" : ""}`}>
          {[0, 1].map((n) => (
            <div key={n} className={`relative aspect-[3/2] overflow-hidden bg-white ${ink} ${n === 0 ? "-rotate-1" : "rotate-1"}`}>
              <Image
                src={`/exercises/${ex.img}/${n}.jpg`}
                alt={`${ex.name} — ${n === 0 ? "start" : "end"} position`}
                fill
                sizes="(max-width: 640px) 45vw, 320px"
                className="object-cover"
                loading="eager"
              />
              <span
                className="absolute bottom-1 left-1 border-2 border-black px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-black"
                style={{ backgroundColor: INK.yellow }}
              >
                {n === 0 ? "Start" : "End"}
              </span>
            </div>
          ))}
          {ex.imgNote && <p className="col-span-2 text-[11px] italic leading-relaxed text-black/60">{ex.imgNote}</p>}
        </div>
      )}

      {/* Header: name + weight */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <h3 className={`${display} ${compact ? "text-xl" : "text-2xl"} leading-none text-black`}>{ex.name}</h3>
            {ex.target && <Sticker color={INK.green}>{ex.target}</Sticker>}
            {allDone && <DoneStamp className="ml-1" />}
          </div>
          <p className="mt-2 text-[13px] font-bold leading-relaxed text-black">
            {ex.sets} {ex.sets === 1 ? "set" : "sets"} × {ex.reps}
            {ex.intensity && (
              <Sticker color={INK.yellow} className="mx-2 align-middle text-[10px] uppercase tracking-wide">
                {ex.intensity}
              </Sticker>
            )}
            <span className="whitespace-nowrap font-normal text-black/60"> · rest {ex.rest}</span>
          </p>
        </div>
        {ex.weight && (
          <span
            className={`max-w-[45%] shrink-0 rotate-2 border-2 border-black px-2 py-1 text-right ${display} text-xl leading-none tabular-nums text-black shadow-[2px_2px_0_0_#000]`}
            style={{ backgroundColor: INK.yellow }}
          >
            {ex.weight}
          </span>
        )}
      </div>

      {/* Set tracking */}
      <div className="relative mt-3.5 flex gap-2.5">
        {Array.from({ length: ex.sets }).map((_, i) => {
          const active = completedSets[i]
          return <SetBox key={i} big n={i + 1} done={active} label={`Set ${i + 1}${active ? " done" : ""}`} onClick={() => onToggleSet(i)} />
        })}
        {celebrate !== undefined && <DoneBurst key={celebrate} className="-top-9 right-0" />}
      </div>

      {/* Fatigue caveat */}
      {ex.note && (
        <p className="mt-3.5 border-2 border-black px-3 py-2 text-[13px] leading-snug text-black shadow-[2px_2px_0_0_#000]" style={{ backgroundColor: INK.yellow }}>
          {ex.note}
        </p>
      )}

      {/* Muscles worked */}
      {ex.target && !compact && (
        <div className="mt-4">
          <div className={`mb-1.5 ${eyebrowLabel}`}>Muscles worked</div>
          <div className="flex flex-wrap gap-2">
            <Sticker color={INK.green}>{ex.target}</Sticker>
            {ex.secondaryMuscles?.map((m) => (
              <Sticker key={m}>{m}</Sticker>
            ))}
          </div>
        </div>
      )}

      {/* How to — always visible */}
      <div className="mt-4 space-y-3 border-2 border-black p-3" style={{ backgroundColor: INK.paper }}>
        <DetailBlock label="Machine">
          {ex.machine}
          {ex.altMachine && <span className="text-black/60"> · alt: {ex.altMachine}</span>}
        </DetailBlock>
        <DetailBlock label="Setup">{ex.setup}</DetailBlock>
        <DetailBlock label="Tempo">{ex.tempo}</DetailBlock>
        <div>
          <div className={`mb-1.5 ${eyebrowLabel}`}>Tips</div>
          <ul className="space-y-1.5">
            {ex.cues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-black">
                <span className="mt-[7px] h-2 w-2 shrink-0 rotate-45 border border-black" style={{ backgroundColor: INK.green }} />
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
            className={buttonClass("sm", "bg-[#FF3B30] text-white")}
            style={lettering(1.5, 2)}
          >
            <Play className="h-4 w-4" strokeWidth={3} />
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
  const complete = total > 0 && done === total
  const { pop, toggle } = useDonePop(sets, offset, onToggle)

  return (
    <section className="space-y-5">
      <DayHeading program={program}>
        {sets.some((s) => s.some(Boolean)) && (
          <button onClick={onReset} className={buttonClass("sm", "shrink-0")}>
            <RotateCcw className="h-4 w-4" strokeWidth={3} />
            Reset
          </button>
        )}
      </DayHeading>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className={`h-5 flex-1 overflow-hidden bg-white ${ink} shadow-[3px_3px_0_0_#000]`}>
          <div
            className={`h-full transition-[width] duration-300 motion-reduce:transition-none ${pct > 0 && pct < 100 ? "border-r-[3px] border-black" : ""}`}
            style={{ width: `${pct}%`, background: stripes(INK.green, "#8DF0BE") }}
          />
        </div>
        <span className="shrink-0 text-xs font-bold tabular-nums text-black">
          {done}/{total} working sets
        </span>
        {complete && <DoneStamp />}
      </div>

      {program.safety && <SafetyNote>{program.safety}</SafetyNote>}

      {/* Warm-up — collapsed into one block */}
      {offset > 0 && (
        <details className={`group bg-white ${ink} shadow-[3px_3px_0_0_#000]`}>
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-black [&::-webkit-details-marker]:hidden">
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 motion-reduce:transition-none" strokeWidth={3} />
            <span className={`${display} shrink-0 text-xl leading-none`}>{program.warmupLabel ?? "Warm-up"}</span>
            <span className="hidden min-w-0 text-xs text-black/60 sm:inline">· {warmup.map((e) => e.name.replace(/\s*\(.*\)$/, "")).join(" · ")}</span>
            {warmupDone && (
              <Sticker color={INK.green} className="ml-auto shrink-0">
                done
              </Sticker>
            )}
          </summary>
          <div className="divide-y-2 divide-dashed divide-black/30 border-t-[3px] border-black">
            {warmup.map((ex, i) => (
              <ExerciseRow key={ex.name + i} ex={ex} compact completedSets={sets[i]} onToggleSet={(setIndex) => toggle(i, setIndex)} />
            ))}
            {program.rampUp && <p className="px-3 py-3 text-[13px] leading-relaxed text-black/70">{program.rampUp}</p>}
          </div>
        </details>
      )}

      <div className="space-y-6">
        {work.map((ex, i) => (
          <Panel key={ex.name + i}>
            <ExerciseRow
              ex={ex}
              completedSets={sets[offset + i]}
              onToggleSet={(setIndex) => toggle(offset + i, setIndex)}
              celebrate={complete && pop?.ex === offset + i ? pop.n : undefined}
            />
          </Panel>
        ))}
      </div>
    </section>
  )
}

function RecoveryDay({ program }: { program: DayProgram }) {
  const rec = program.recovery
  const isZone2 = Boolean(rec?.duration)

  return (
    <section className="space-y-5">
      <DayHeading program={program} />
      <Panel className="p-4">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center ${ink} shadow-[2px_2px_0_0_#000]`}
            style={{ backgroundColor: isZone2 ? INK.cyan : INK.purple }}
          >
            {isZone2 ? <Heart className="h-5 w-5" fill={INK.red} strokeWidth={2.5} /> : <Moon className="h-5 w-5 text-white" strokeWidth={2.5} />}
          </span>
          <div>
            {isZone2 && <p className={`${display} text-2xl leading-none text-black`}>Zone 2 · {rec?.duration}</p>}
            <p className={`text-sm leading-relaxed text-black ${isZone2 ? "mt-1.5" : ""}`}>{rec?.note}</p>
          </div>
        </div>

        {program.safety && <SafetyNote className="mt-3">{program.safety}</SafetyNote>}

        {isZone2 && (
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[...zone2Settings, { label: "Duration", value: rec!.duration! }].map(({ label, value }) => (
              <div
                key={label}
                className="border-2 border-black p-2.5 shadow-[2px_2px_0_0_#000]"
                style={{ backgroundColor: INK.cyan, ...halftone("rgba(0,0,0,0.12)", 6) }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-black/70">{label}</div>
                <div className="mt-0.5 text-[13px] font-bold tabular-nums text-black">{value}</div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </section>
  )
}

/** The gym view: one inked panel per day, every set a box to stamp. */
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
  const complete = total > 0 && done === total
  const light = program.color === INK.purple
  const { pop, toggle } = useDonePop(sets, offset, onToggle)

  return (
    <section>
    <Panel>
      <div
        className={`flex items-center justify-between gap-3 border-b-[3px] border-black px-3 py-2 ${onInk(program.color)}`}
        style={{ backgroundColor: program.color, ...halftone("rgba(0,0,0,0.12)", 6) }}
      >
        <h2 className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[26px] leading-none" style={light ? lettering(1.5, 2) : undefined}>
              {dayName}
            </span>
            {isTrainer && (
              <Sticker color="#000" className="rotate-3 text-[13px] leading-none text-white">
                trainer
              </Sticker>
            )}
          </span>
          <span className="sr-only"> — </span>
          <span className="mt-1 block font-sans text-[13px] font-bold leading-snug tracking-normal">{program.title}</span>
        </h2>
        {total > 0 && (
          <div className="flex shrink-0 items-center gap-2.5">
            {complete && <DoneStamp />}
            <button
              onClick={onReset}
              title="Reset"
              className={`border-2 border-black px-2 py-0.5 ${display} text-lg leading-tight tabular-nums text-black shadow-[2px_2px_0_0_#000] transition-[transform,box-shadow] duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none motion-reduce:transition-none`}
              style={{ backgroundColor: complete ? INK.green : "#fff" }}
            >
              {done}/{total}
            </button>
          </div>
        )}
      </div>

      <div className="divide-y-2 divide-dashed divide-black/30">
        {(recovery || program.safety || warmup.length > 0) && (
          <div className="space-y-2 px-3 py-2.5">
            {recovery && <p className="text-sm font-bold leading-snug text-black">{recovery.short}</p>}
            {program.safety && <SafetyNote>{program.safety}</SafetyNote>}
            {warmup.length > 0 && (
              <p className="text-[12px] leading-relaxed text-black/70">
                <b className="text-black">Warm-up</b> · {warmup.map((e) => e.name.replace(/\s*\(.*\)$/, "")).join(" · ")}
                {program.rampUp && <span className="block">{program.rampUp}</span>}
              </p>
            )}
          </div>
        )}

        {work.map((ex, i) => {
          const completed = sets[offset + i]
          const allDone = completed.every(Boolean)
          return (
            <div key={ex.name + i} className="px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`text-[15px] font-bold leading-snug ${allDone ? "text-black/60 line-through decoration-[3px]" : "text-black"}`}
                  style={allDone ? { textDecorationColor: RED_TEXT } : undefined}
                >
                  {ex.name}
                </span>
                <span className={`${display} shrink-0 text-lg leading-none tabular-nums text-black`}>
                  {ex.sets} × {ex.reps}
                </span>
              </div>
              <div className="relative mt-2 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {completed.map((active, j) => (
                    <SetBox
                      key={j}
                      n={j + 1}
                      done={active}
                      label={`${ex.name} set ${j + 1}${active ? " done" : ""}`}
                      onClick={() => toggle(offset + i, j)}
                    />
                  ))}
                </div>
                {ex.weight && (
                  <Sticker color={INK.yellow} className="min-w-0 text-right text-[13px] tabular-nums">
                    {ex.weight}
                  </Sticker>
                )}
                {complete && pop?.ex === offset + i && <DoneBurst key={pop.n} className="-top-6 right-2" />}
              </div>
              {ex.note && <SafetyNote className="mt-2.5">{ex.note}</SafetyNote>}
            </div>
          )
        })}
      </div>
    </Panel>
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
    <div className="space-y-7 animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
      {dayKeys.map((key) => (
        <TextDay
          key={key}
          program={dayPrograms[key]}
          sets={progress[key]}
          onToggle={(exIdx, setIdx) => onToggle(key, exIdx, setIdx)}
          onReset={() => onReset(key)}
        />
      ))}

      <Panel className="space-y-1.5 p-3 text-[13px] leading-relaxed">
        <p>RIR 1–2 on compounds · RIR 0–2 on isolation · controlled 2–3s eccentric.</p>
        <p>Double progression: top of the rep range on every set, then the smallest jump in weight.</p>
        <p>
          <span className="box-decoration-clone px-1 font-bold" style={{ backgroundColor: INK.yellow }}>
            Bad sleep? Keep the weight, hit good reps, move on.
          </span>
        </p>
      </Panel>
    </div>
  )
}

function ViewToggle({ view }: { view: View }) {
  return (
    <div role="radiogroup" aria-label="View" className="inline-grid grid-cols-2 gap-2.5">
      {(["text", "full"] as View[]).map((v) => {
        const on = view === v
        return (
          <button
            key={v}
            role="radio"
            aria-checked={on}
            onClick={() => setView(v)}
            className={`min-w-[5.5rem] ${ink} px-3 py-1 ${display} text-xl capitalize leading-tight text-black transition-[transform,box-shadow,background-color] duration-150 motion-reduce:transition-none ${
              on ? "translate-x-[3px] translate-y-[3px] bg-[#FFD400] shadow-[2px_2px_0_0_#000]" : "bg-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5"
            }`}
          >
            {v}
          </button>
        )
      })}
    </div>
  )
}

const filterButton = (on: boolean) =>
  `flex min-w-0 flex-col items-center justify-center gap-1 ${ink} px-1 py-1.5 text-black transition-[transform,box-shadow,background-color] duration-150 motion-reduce:transition-none ${
    on ? "translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_0_#000]" : "bg-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5"
  }`

const sectionIntro = "text-sm leading-relaxed text-black"
const footnote = "text-[13px] leading-relaxed text-black/70"

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
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-2xl" links={[{ href: "/diet", label: "Diet Plan", icon: Utensils }]} />

      <main className="container mx-auto max-w-2xl flex-1 space-y-10 px-4 pb-24">
        {/* Heading */}
        <PageTitle
          compact
          className="pt-2"
          color={INK.red}
          kicker={
            <>
              <Dumbbell className="-mt-0.5 mr-1.5 inline h-3.5 w-3.5" strokeWidth={3} />
              Meanwhile, at the gym…
            </>
          }
          title="4-Day Hypertrophy Cut"
        >
          {view === "full" ? (
            <>
              <p className="max-w-xl text-base leading-relaxed text-black">
                {weeklyWorkingSets} working sets across 4 lifting days · 2 Zone 2 sessions · 1 full rest day. Chest and back are trained
                three times a week, with Friday and Saturday fixed as the trainer-led anchors. Tap a set to check it off — progress is
                saved on this device.
              </p>
              {/* The program's motto, in a speech bubble. */}
              <blockquote className={`relative mt-5 rounded-[22px] bg-white px-4 py-3 text-sm font-bold italic leading-relaxed text-black ${ink} shadow-[4px_4px_0_0_#000]`}>
                <span aria-hidden className="absolute -top-[14px] left-10 h-6 w-6 rotate-45 border-l-[3px] border-t-[3px] border-black bg-white" />
                <span className="relative">
                  Train for hypertrophy first. Strength progression is valuable, but powerlifting performance is secondary and should not
                  compromise muscle growth or recovery.
                </span>
              </blockquote>
            </>
          ) : (
            <p className="text-sm font-bold leading-relaxed text-black">
              {weeklyWorkingSets}{" "}working sets · 4 lifting days · chest &amp; back 3×/week · Fri &amp; Sat trainer
            </p>
          )}

          {/* View toggle */}
          <ViewToggle view={view} />
        </PageTitle>

        {view === "text" && <TextWeek progress={progress} onToggle={toggleSet} onReset={resetDay} />}

        {view === "full" && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
            {/* Goal */}
            <Panel className="px-4 pb-4 pt-6">
              <Caption color={INK.green} className="absolute -top-4 left-3 -rotate-2">
                <Target className="-mt-0.5 mr-1.5 inline h-3.5 w-3.5" strokeWidth={3} />
                Goal
              </Caption>
              <p className={`${display} text-2xl leading-tight text-black`}>
                Hypertrophy first, fat loss alongside
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-black">
                Maximise muscle hypertrophy while reducing body fat and preserving strength through the deficit.
                Priority muscles: chest — especially the upper chest; shoulders — especially the lateral delts for width;
                back thickness and overall back development; and legs and glutes to keep development balanced.
              </p>
              <p className={`mt-2 ${footnote}`}>
                Friday and Saturday are trainer-led and fixed — the rest of the week is built around them, not the other way round.
                Strength is a secondary goal, not the organising principle: powerlifting-specific work is optional here and must not
                come at the cost of muscle growth or recovery. If competition numbers ever become the goal, that wants a dedicated
                strength block rather than sacrificing hypertrophy year-round.
              </p>
            </Panel>

            {/* Day filter */}
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
              <button
                onClick={() => setActiveDay(null)}
                aria-pressed={activeDay === null}
                className={filterButton(activeDay === null)}
                style={activeDay === null ? { backgroundColor: INK.yellow } : undefined}
              >
                <span className={`${display} text-lg leading-none`}>All</span>
              </button>
              {weekOverview.map((d, i) => {
                const on = activeDay === i
                const light = on && d.color === INK.purple
                return (
                  <button
                    key={d.label}
                    onClick={() => setActiveDay(activeDay === i ? null : i)}
                    aria-pressed={on}
                    className={filterButton(on)}
                    style={on ? { backgroundColor: d.color } : undefined}
                  >
                    <span className={`flex items-center gap-1 ${display} text-lg leading-none ${light ? "text-white" : ""}`} style={light ? lettering(1, 1.5) : undefined}>
                      {!on && <span aria-hidden className="h-2.5 w-2.5 border-2 border-black" style={{ backgroundColor: d.color }} />}
                      {d.label}
                    </span>
                    <span className={`text-[10px] font-bold leading-none ${light ? "text-white" : "text-black/60"}`}>{d.tag}</span>
                  </button>
                )
              })}
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
            <section className="space-y-4">
              <Reveal>
                <SectionTitle title="Progressive Overload" color={INK.green} />
              </Reveal>
              <p className={sectionIntro}>
                Double progression, kept practical: add reps until you hit the top of the range on <em>all</em> sets, then take the smallest
                practical jump in weight and build it back up.
              </p>
              <Panel>
                <div className="border-b-[3px] border-black bg-black px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white">
                  Example · Low-Incline DB Press, 3 × 6–8
                </div>
                <div className="divide-y-2 divide-black">
                  {progressionExample.map((row) => (
                    <div
                      key={row.session}
                      className="flex items-center gap-3 px-3 py-2.5"
                      style={row.bump ? { backgroundColor: INK.green, ...halftone("rgba(0,0,0,0.12)", 6) } : undefined}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center border-2 border-black bg-white ${display} text-base leading-none`}>
                        {row.session}
                      </span>
                      <span className={`flex-1 text-[13px] text-black ${row.bump ? "font-bold" : ""}`}>{row.load}</span>
                      <span className={`${display} shrink-0 text-right text-xl leading-none tabular-nums text-black`}>{row.reps}</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <p className={footnote}>
                Illustrative numbers — actual progress depends on recovery, technique and the equipment available. On machines, compare
                performance on the <em>same</em> machine, since stack numbers differ between models.
              </p>
              <Panel color={INK.yellow} className="-rotate-[0.5deg] p-3 text-[13px] leading-relaxed">
                <strong className="font-bold">Bad sleep = don&rsquo;t force progression.</strong> If you slept five hours and the working
                weight feels terrible, you have nothing to prove. Keep the load and the target RIR, hit good reps, and move on.
                Consistency over months beats one heroic workout.
              </Panel>
            </section>

            {/* Intensity */}
            <section className="space-y-4">
              <Reveal>
                <SectionTitle title="Intensity & Tempo" color={INK.orange} />
              </Reveal>
              <p className={sectionIntro}>
                No mandatory 3-second eccentrics. Lower under control — roughly 2–3 seconds — but never so slowly that it costs you
                productive load. Priority order: <em>full range of motion → stable technique → sufficient effort → progressive overload → recovery.</em>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {intensityRules.map(({ label, value }, i) => (
                  <Reveal key={label} delay={(i % 2) * 70} className="h-full">
                    <div className={`h-full bg-white p-3 ${ink} shadow-[3px_3px_0_0_#000] ${tilts[i % tilts.length]}`}>
                      <div className="text-[11px] font-bold text-black/60">{label}</div>
                      <div className={`mt-1 ${display} text-xl leading-tight text-black`}>{value}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Fatigue management */}
            <section className="space-y-4">
              <Reveal>
                <SectionTitle title="Recovery & Adjustment Rules" color={INK.purple} />
              </Reveal>
              <p className={sectionIntro}>
                Recovery is part of the program, not an optional extra. Friday and Saturday run back to back, so what gets cut matters
                more than what gets added.
              </p>
              <Panel className="divide-y-2 divide-black">
                {fatigueRules.map(({ when, then }) => (
                  <div key={when} className="px-3 py-2.5">
                    <div className={`${display} text-lg leading-tight text-black`}>{when}</div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-black">{then}</p>
                  </div>
                ))}
              </Panel>
              <p className={footnote}>
                Don&rsquo;t add sets just to make a session feel harder. Add volume only when recovery is good <em>and</em> the target
                muscle has stopped progressing.
              </p>
            </section>

            {/* Weekly volume */}
            <section className="space-y-4">
              <Reveal>
                <SectionTitle title="Weekly Volume Targets" color={INK.cyan} />
              </Reveal>
              <p className={sectionIntro}>
                Direct sets per muscle per week — {weeklyWorkingSets} in total. This is deliberately less than a high-volume program:
                while performance keeps progressing, there is no reason to add sets.
              </p>
              <Panel className="divide-y-2 divide-black">
                {weeklyVolume.map(({ muscle, direct, days, bar, hero, indirect }) => (
                  <div key={muscle} className="px-3 py-2.5" style={hero ? { backgroundColor: INK.yellow } : undefined}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={`text-sm text-black ${hero ? "font-bold" : ""}`}>{muscle}</span>
                      <span className="shrink-0 text-right text-[13px] text-black">
                        <span className="font-bold tabular-nums">{direct}</span> direct <span className="text-black/60">· {days}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-3.5 overflow-hidden border-2 border-black bg-white">
                      <div
                        className="h-full border-r-2 border-black"
                        style={{ width: `${(bar / 13) * 100}%`, background: hero ? stripes(INK.red, "#FF7A70") : INK.cyan }}
                      />
                    </div>
                    {indirect && <p className="mt-1 text-[11px] text-black/60">Indirect: {indirect} — not counted as a direct session.</p>}
                  </div>
                ))}
              </Panel>
              <p className={footnote}>
                Direct working sets only, counted from the sessions above. Compounds also stimulate secondary muscles, but indirect work is
                never counted as a direct session. A single exercise can be direct for two muscles — Bulgarian split squats count for quads
                and glutes — so these rows deliberately sum to more than the {weeklyWorkingSets} working sets in the week.
              </p>
              <p className="text-[13px] leading-relaxed text-black">
                <strong className="font-bold">Chest and back are deliberately prioritised, and direct arm volume is low.</strong>{" "}
                If arm growth becomes a higher priority, add 2 sets of curls on Friday and 2 sets of triceps pressdowns or machine extensions
                on Wednesday — provided recovery stays adequate.
              </p>
            </section>

            {/* Nutrition */}
            <section className="space-y-4">
              <Reveal>
                <SectionTitle title="Nutrition During the Cut" color={INK.pink} />
              </Reveal>
              <p className={sectionIntro}>
                Lose fat while preserving training performance and lean mass. The weekly trend decides the next move, not any single reading.
              </p>
              <Panel className="divide-y-2 divide-black">
                {nutrition.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className={`${display} shrink-0 text-lg leading-none text-black`}>{label}</span>
                    <span className="text-right text-[13px] font-bold text-black">{value}</span>
                  </div>
                ))}
              </Panel>
              <div className={`space-y-1.5 ${footnote}`}>
                <p>The slower end of that pace is usually preferable when preserving muscle and strength is the priority.</p>
                <p>Track average weekly weight, waist circumference, gym performance and recovery together — not a single body-composition reading.</p>
                <p>Creatine, if you already use it and it suits you: daily consistency matters more than timing it around workouts.</p>
              </div>
              <SafetyNote>
                If medication substantially reduces your appetite, don&rsquo;t let protein, hydration or total intake drift too low.
                Follow your prescribing clinician&rsquo;s instructions for any medication.
              </SafetyNote>
            </section>

            {/* Weekly review */}
            <section className="space-y-4">
              <Reveal>
                <SectionTitle title="Weekly Review" color={INK.yellow} />
              </Reveal>
              <p className={sectionIntro}>
                Record these every week. Review the trend every two weeks before changing calories, cardio or volume — not sooner.
              </p>
              <ol className="space-y-2.5">
                {weeklyReview.map((item, i) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center border-2 border-black bg-black ${display} text-base leading-none text-white`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-black">{item}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Final principle */}
            <Reveal>
              <Panel color={INK.yellow} dots className="rotate-[0.5deg] p-4">
                <h2 className={`${display} mb-2 text-3xl leading-none text-black`}>Final Training Principle</h2>
                <p className="text-base font-bold leading-relaxed text-black">
                  Train hard enough to stimulate growth, use progressive overload to measure improvement, and manage fatigue so that you
                  can repeat high-quality sessions consistently.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-black/70">
                  Hypertrophy is the primary objective. Powerlifting-style strength gains are welcome when they support it, but they are
                  not worth sacrificing recovery or productive muscle-building volume.
                </p>
              </Panel>
            </Reveal>
          </div>
        )}

        {/* Credit */}
        <p className="border-t-2 border-dashed border-black/30 pt-4 text-center text-[11px] leading-relaxed text-black/60">
          Muscle data from{" "}
          <a
            href="https://github.com/hasaneyldrm/exercises-dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-black underline underline-offset-2 hover:text-[#E5221A]"
          >
            ExerciseDB
          </a>
          {" · "}
          Exercise photos from{" "}
          <a
            href="https://github.com/yuhonas/free-exercise-db"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-black underline underline-offset-2 hover:text-[#E5221A]"
          >
            free-exercise-db
          </a>{" "}
          (public domain)
        </p>
      </main>

      <SiteFooter className="max-w-2xl px-4" />
    </div>
  )
}
