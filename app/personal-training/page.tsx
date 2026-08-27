"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Dumbbell, Footprints, Utensils, Play, Target, ChevronRight } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Muscle = "Chest" | "Back" | "Shoulders" | "Triceps" | "Biceps" | "Legs" | "Glutes" | "Core" | "Arms"

type Exercise = {
  name: string
  machine: string
  altMachine?: string
  setup: string
  sets: number
  reps: number | string
  /** Optional intensity tag, e.g. "RIR 1–2", "Volume", "Heavy". */
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
}

// ─── Exercise Library (single source of truth) ───────────────────────────────

const exercises = {
  // ── Warm-up & mobility ──
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
  gluteBridge: {
    name: "Glute Bridge",
    img: "gluteBridge",
    target: "Glutes",
    secondaryMuscles: ["Hamstrings", "Core"],
    machine: "Bodyweight / Mat",
    setup: "Lie on your back, knees bent, feet flat on the floor hip-width apart. Arms at your sides, palms down",
    sets: 1,
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
      "Joint insurance for pressing 3× a week",
      "Never force through a sharp pain"
    ],
    muscle: "Shoulders" as Muscle,
    video: "https://www.youtube.com/watch?v=riVxa9By-pM",
  },

  // ── Chest ──
  inclineChestPress: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Set the bench to a low 15–30° incline (1–2 notches up). Pin shoulder blades firmly into the pad, chest puffed out. Tuck elbows at 45–60° (arrow shape, no T-flare) to maximize chest recruitment and insulate the shoulder joints",
    sets: 3,
    reps: "6–8",
    intensity: "RIR 1–2",
    tempo: "Press powerfully, driving elbows inward toward each other at the top. Lower slowly counting 1...2...3... (Eccentric Overload)",
    rest: "90–120 sec",
    cues: [
      "The #1 lift of this program — heaviest mechanical tension on the upper chest",
      "Low 15–30° incline — 1–2 notches up",
      "Tuck elbows 45–60° (arrow shape, no T-flare)",
      "Press powerfully, lower slow 1...2...3...",
      "Deeply stretch the clavicular fibers at the bottom"
    ],
    muscle: "Chest" as Muscle,
    weight: "20–22 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  inclineChestPressCondo: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Dumbbell + Adjustable Bench (condo gym)",
    setup: "Same low 15–30° incline setup — shoulder blades locked back into the pad, chest puffed out. Condo dumbbells cap out lighter, so buy the extra stimulus with tempo, not weight",
    sets: 3,
    reps: "8",
    intensity: "Volume",
    tempo: "Controlled press up, squeeze hard at peak for 1 full second, then strict 3-second negative descent. Do not bounce at the bottom",
    rest: "90 sec",
    cues: [
      "Third upper-chest exposure of the week — this is the frequency that changes a T-shirt",
      "Squeeze hard at peak contraction for 1s",
      "Strict 3-second negative — no bouncing",
      "If the top dumbbell feels easy, slow the eccentric to 4s"
    ],
    muscle: "Chest" as Muscle,
    weight: "16–18 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  inclineChestPressFriday: {
    name: "Low-Incline Dumbbell Press",
    img: "inclineChestPress",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Dumbbell + Adjustable Bench",
    setup: "Set the bench to a low 15–30° incline (1–2 notches up). Pin shoulder blades firmly into the pad, chest puffed out. Tuck elbows at 45–60° (arrow shape, no T-flare) to maximize chest recruitment and insulate the shoulder joints",
    sets: 2,
    reps: "8–10",
    intensity: "Volume",
    tempo: "Controlled press up, squeeze hard at peak for 1 full second, then strict 3-second negative descent. Do not bounce at the bottom",
    rest: "90 sec",
    cues: [
      "Friday upper-chest hit — light enough for volume, heavy enough to build",
      "Low 15–30° incline — 1–2 notches up",
      "Tuck elbows 45–60° (arrow shape, no T-flare)",
      "Squeeze hard at peak, lower strict 3s"
    ],
    muscle: "Chest" as Muscle,
    weight: "18–20 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=U_N0Pjohh9I",
  },
  chestPress: {
    name: "Chest Press",
    img: "chestPress",
    target: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    machine: "Chest Press Machine",
    altMachine: "Pec Fly Machine",
    setup: "Lower the seat so the handles align exactly at nipple level. Puff your chest and pin your shoulder blades firmly into the pad",
    sets: 2,
    reps: "6–8",
    intensity: "RIR 1–2",
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
  lateralRaiseMonday: {
    name: "Machine Lateral Raise",
    img: "lateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Lateral Raise Machine",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Adjust the seat so the pads rest against your outer arms. Keep your shoulders depressed — do not engage your traps",
    sets: 2,
    reps: "10–12",
    intensity: "Heavy",
    tempo: "Raise outward smoothly, hold a split second at the peak, then lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Heavy strict set — no shrugging",
      "Keep shoulders depressed (no traps)",
      "Raise smoothly, lower over 3 seconds",
      "Side delts are hit 3× a week — this is the width driver"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
    video: "https://www.youtube.com/watch?v=0o07iGKUarI",
  },
  pecDeck: {
    name: "Pec Deck",
    img: "pecDeck",
    target: "Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Pec Deck / Chest Fly Machine",
    altMachine: "Cable Crossover",
    setup: "Set the seat so the handles sit at nipple height. Pin your shoulder blades back and down, keep a fixed slight bend in the elbows the whole set",
    sets: 2,
    reps: "10–12",
    intensity: "RIR 0–1",
    tempo: "Squeeze the handles together (1s), hold the peak contraction 1s, then open slowly over 3s into a deep stretch",
    rest: "60–90 sec",
    cues: [
      "Finisher — chase the stretch and the burn, not the weight",
      "Elbow angle stays fixed — this is a fly, not a press",
      "Hold the squeeze 1 second every rep",
      "Last set to RIR 0–1"
    ],
    muscle: "Chest" as Muscle,
    video: "https://www.youtube.com/watch?v=ze4JaQCcGLg",
  },
  cableFly: {
    name: "Cable Fly",
    target: "Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Cable Crossover (both pulleys set mid-chest height)",
    altMachine: "Machine Pec Fly",
    setup: "Set both pulleys at mid-chest height. Stand in a split stance dead center, arms out wide with a fixed slight elbow bend. Allow a natural stretch in the chest",
    sets: 3,
    reps: "10–15",
    intensity: "RIR 0–1",
    tempo: "Squeeze the handles together in a smooth arc (1s), hold the peak 1s, then open slowly over 3s into a deep stretch",
    rest: "60–90 sec",
    cues: [
      "Horizontal arc at mid-chest height — builds the middle chest",
      "Elbows stay at a fixed angle, arms don't bend or straighten",
      "Constant cable tension: never let the stack rest",
      "Deep stretch on the opening — that's where growth happens"
    ],
    muscle: "Chest" as Muscle,
    video: "https://www.youtube.com/watch?v=JUDTGZh4rhg",
  },
  inclineCableFly: {
    name: "Incline Cable Fly",
    img: "inclineCableFly",
    target: "Upper Chest",
    secondaryMuscles: ["Front Delts"],
    machine: "Cable Crossover (both pulleys set low)",
    altMachine: "Incline Dumbbell Fly",
    setup: "Set both pulleys at the lowest notch. Stand in a split stance dead center, arms out wide and low with a soft fixed elbow bend",
    sets: 2,
    reps: "12",
    intensity: "RIR 0–1",
    tempo: "Sweep both hands up and inward toward chin height (1s), cross-squeeze 1s, then lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Low-to-high arc — this is what fills the shelf under the collarbone",
      "Finish with the hands together at chin height, not hip height",
      "Constant cable tension: never let the stack rest",
      "Light weight, ruthless form"
    ],
    muscle: "Chest" as Muscle,
    video: "https://www.youtube.com/watch?v=eQ_NBB6OBH4",
  },
  reversePecDeck: {
    name: "Reverse Pec Deck",
    target: "Rear Delts",
    secondaryMuscles: ["Upper Back", "Rhomboids"],
    machine: "Reverse Pec Deck Machine",
    altMachine: "Cable Rear Delt Fly",
    setup: "Sit upright with chest against the pad. Grip the handles with a neutral grip at shoulder height. Elbows stay high and outside of the handles",
    sets: 2,
    reps: "12–15",
    intensity: "RIR 0–1",
    tempo: "Squeeze the handles back in a wide arc (1s), hold the peak contraction 1s, then return slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Chest stays glued to the pad — no torso rotation",
      "Sweep your elbows wide, not back toward the hips",
      "Squeeze the rear delts hard at the peak",
      "This hits rear delts and upper back without lower-back involvement"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "30–35 KG",
  },

  // ── Shoulders ──
  shoulderPress: {
    name: "Machine Shoulder Press",
    img: "shoulderPress",
    target: "Front Delts",
    secondaryMuscles: ["Side Delts", "Triceps"],
    machine: "Shoulder Press Machine",
    altMachine: "Dumbbell Shoulder Press",
    setup: "Hips glued to the seat backrest. Press straight up without arching your lower back. If the weight shakes, prioritize form first",
    sets: 3,
    reps: "6–8",
    intensity: "RIR 1–2",
    tempo: "Press up cleanly, then lower slowly 1...2...3... to insulate the shoulder joints from injury",
    rest: "90–120 sec",
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
  lateralRaise: {
    name: "Machine Lateral Raise",
    img: "lateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Lateral Raise Machine",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Adjust the seat so the pads rest against your outer arms. Keep your shoulders depressed — do not engage your traps",
    sets: 3,
    reps: "10–12",
    intensity: "Heavy",
    tempo: "Raise outward smoothly, hold a split second at the peak, then lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Heavy strict set — no shrugging",
      "Keep shoulders depressed (no traps)",
      "Raise smoothly, lower over 3 seconds",
      "Side delts are hit 3× a week — this is the width driver"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
    video: "https://www.youtube.com/watch?v=0o07iGKUarI",
  },
  lateralRaiseCondo: {
    name: "Machine Lateral Raise",
    img: "lateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Lateral Raise Machine",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Same setup — keep shoulders depressed. Drop to 7–8 KG if form breaks",
    sets: 3,
    reps: "12",
    intensity: "Volume",
    tempo: "High-volume metabolic pump — hold a split second at peak width, control down over 3s",
    rest: "60 sec",
    cues: [
      "High-volume metabolic pump set",
      "Hold a split second at peak width",
      "Control the descent, no swinging",
      "Drop weight if form breaks"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "9 KG",
    video: "https://www.youtube.com/watch?v=0o07iGKUarI",
  },
  lateralRaiseFriday: {
    name: "Machine Lateral Raise",
    img: "lateralRaise",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Lateral Raise Machine",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Adjust the seat so the pads rest against your outer arms. Keep your shoulders depressed — do not engage your traps",
    sets: 2,
    reps: "10–12",
    intensity: "Volume",
    tempo: "Raise outward smoothly, hold a split second at the peak, then lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Friday delt hit — second exposure of the week",
      "Keep shoulders depressed (no traps)",
      "Raise smoothly, lower over 3 seconds",
      "Control the descent, no swinging"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "8–9 KG",
    video: "https://www.youtube.com/watch?v=0o07iGKUarI",
  },
  cableLateralRaise: {
    name: "Cable Lateral Raise",
    img: "cableLateralRaise",
    imgNote: "Photo shows the seated two-cable version — stand for the single-arm version described below",
    target: "Side Delts",
    secondaryMuscles: [],
    machine: "Cable Crossover (single low pulley)",
    altMachine: "Dumbbell Lateral Raise",
    setup: "Set one pulley at the lowest notch. Stand side-on, reach across your body with the far hand and grab the cable behind your thigh",
    sets: 2,
    reps: "12",
    intensity: "Stretch",
    tempo: "Raise out to shoulder height (1s), pause at the top, then resist all the way down over 3s",
    rest: "60 sec",
    cues: [
      "Cables load the delt in the stretched position — the machine can't",
      "Lead with the elbow, pinky slightly high",
      "No torso swing — brace and stay still",
      "Last set to RIR 0–1"
    ],
    muscle: "Shoulders" as Muscle,
    video: "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
  },
  rearDeltFly: {
    name: "Incline Bench Rear Delt Fly",
    img: "inclineRearDeltFly",
    imgNote: "Photo shows the flat-bench version — set the bench to a low 30–45° incline and lie chest-down on it",
    target: "Rear Delts",
    secondaryMuscles: ["Upper Back", "Rhomboids"],
    machine: "Incline Bench + Dumbbells",
    altMachine: "Reverse Pec Deck Machine",
    setup: "Set the bench to 30–45° and lie chest-down on it, feet braced on the floor. Let the dumbbells hang straight down with a soft elbow bend you hold fixed for the whole set",
    sets: 3,
    reps: "12",
    intensity: "RIR 0–1",
    tempo: "Sweep the dumbbells out and slightly back in a wide arc (1s), squeeze the back of your shoulders 1s, then lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Chest never leaves the pad — the bench is what kills the body english",
      "Keep your elbows high, lead with the pinkies",
      "Sweep wide to the walls — don't row the weight to your hips",
      "Go light: the rear delt loses every argument with momentum"
    ],
    muscle: "Shoulders" as Muscle,
    weight: "6–8 KG / dumbbell",
    video: "https://www.youtube.com/watch?v=X5kmqWnprvI",
  },

  // ── Back ──
  latPulldown: {
    name: "Wide-Grip Lat Pulldown",
    img: "latPulldown",
    target: "Lats",
    secondaryMuscles: ["Biceps", "Rhomboids"],
    machine: "Lat Pulldown Machine",
    altMachine: "Iso-Lateral High Row",
    setup: "Sit upright, lock the thigh pad firmly, grip well outside shoulder width, and puff your chest up before pulling down",
    sets: 3,
    reps: "8",
    intensity: "RIR 1–2",
    tempo: "Drive elbows straight down to your waist (1s), then return slowly over 3s to fully stretch the lats",
    rest: "90–120 sec",
    cues: [
      "Puff chest up",
      "Drive elbows down to your waist",
      "Don't cheat with arm strength",
      "Return slowly over 3 seconds",
      "Wide grip = wide V-taper, which makes the waist read smaller"
    ],
    muscle: "Back" as Muscle,
    weight: "52 KG",
    video: "https://www.youtube.com/watch?v=bNmvKpJSWKM",
  },
  neutralGripLatPulldown: {
    name: "Neutral-Grip Lat Pulldown",
    target: "Lats",
    secondaryMuscles: ["Biceps", "Upper Back"],
    machine: "Lat Pulldown Machine (neutral grip attachment)",
    altMachine: "Wide-Grip Lat Pulldown",
    setup: "Sit upright, lock the thigh pad firmly. Grip the attachment with a neutral grip (palms facing each other, hands shoulder-width or slightly wider)",
    sets: 4,
    reps: "6–8",
    intensity: "RIR 1–2",
    tempo: "Drive elbows straight down, leading with the elbows (1s), then return slowly over 3s to a full stretch",
    rest: "90–120 sec",
    cues: [
      "Neutral grip is a hybrid between wide and close grip — targets the whole lat",
      "Elbows stay wide, not tucked in",
      "Drive elbows down and back",
      "Powerful rep with a strong stretch at the top",
      "Heavy heavy sets — this is a primary movement on Friday"
    ],
    muscle: "Back" as Muscle,
    weight: "55–60 KG",
  },
  singleArmLatPulldown: {
    name: "Single-Arm Lat Pulldown",
    target: "Lats",
    secondaryMuscles: ["Biceps"],
    machine: "Lat Pulldown Machine (single-handle attachment)",
    altMachine: "Single-Arm Cable Pulldown",
    setup: "Sit upright, lock the thigh pad. Use a single handle (or one side of a split attachment). Grab with one hand and let your arm straighten fully at the top",
    sets: 3,
    reps: "10–12",
    intensity: "RIR 0–1",
    tempo: "Pull down and across your body in a smooth arc (1s), squeeze 1s, return slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Single-arm work allows unilateral lat recruitment and core engagement",
      "Pull down and slightly across — don't just straight down",
      "Full stretch at the top of every rep",
      "Squeeze the lat hard at the peak",
      "Light weight: quality beats quantity"
    ],
    muscle: "Back" as Muscle,
    weight: "25–30 KG per side",
  },
  chestSupportedRow: {
    name: "Chest-Supported Row",
    img: "chestSupportedRow",
    imgNote: "Photo shows the T-bar version — any chest-supported row machine works the same way",
    target: "Upper Back",
    secondaryMuscles: ["Lats", "Rhomboids"],
    machine: "Chest-Supported Row Machine",
    altMachine: "Seated Cable Row",
    setup: "Set the chest pad so your arms hang free at full stretch. Ribs stay glued to the pad for the whole set — that's what removes the lower back from the equation",
    sets: 3,
    reps: "8",
    intensity: "RIR 1–2",
    tempo: "Row to your lower ribs (1s), squeeze the shoulder blades together 1s, then return slowly over 3s to a full stretch",
    rest: "90–120 sec",
    cues: [
      "Chest never leaves the pad — no torso english",
      "Pull with the elbows, not the hands",
      "Squeeze the shoulder blades 1 second",
      "Let the arms fully straighten at the bottom"
    ],
    muscle: "Back" as Muscle,
    weight: "41 KG",
    video: "https://www.youtube.com/watch?v=FU6YQawma2Q",
  },
  machineHighRow: {
    name: "Machine High Row",
    img: "machineHighRow",
    target: "Lats",
    secondaryMuscles: ["Upper Back", "Rear Delts"],
    machine: "Iso-Lateral High Row",
    altMachine: "Wide-Grip Lat Pulldown",
    setup: "Chest into the pad, grip the high handles with straight arms overhead. Depress the shoulder blades before the first rep",
    sets: 2,
    reps: "10",
    intensity: "Volume",
    tempo: "Pull down and back toward your hips (1s), hold 1s, then return slowly over 3s letting the shoulders travel up into a stretch",
    rest: "90 sec",
    cues: [
      "Hits the lats from a different angle than the pulldown",
      "Let the shoulder blade rise at the top for a full stretch",
      "Run it single-arm if the machine allows — better contraction",
      "Volume work, not a max-out"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=gg5hwJuv6KI",
  },
  machinePullover: {
    name: "Machine Pullover",
    img: "machinePullover",
    imgNote: "Photo shows the cable straight-arm version — the same movement if the pullover machine is taken",
    target: "Lats",
    secondaryMuscles: ["Chest", "Serratus"],
    machine: "Pullover Machine",
    altMachine: "Cable Straight-Arm Pulldown",
    setup: "Sit tall with the seat set so your elbows sit on the pads with the shoulders in a deep overhead stretch. Belt in if the machine has one",
    sets: 2,
    reps: "10",
    intensity: "Stretch",
    tempo: "Pull the pads down to your abdomen (1s), squeeze 1s, then let the arms travel back overhead over 3s under full control",
    rest: "60–90 sec",
    cues: [
      "Straight-arm movement — no elbow bending",
      "The overhead stretch is the whole point",
      "Also loads the serratus and expands the rib cage",
      "Move slow, this joint position doesn't like momentum"
    ],
    muscle: "Back" as Muscle,
    video: "https://www.youtube.com/watch?v=oxpAl14EYyc",
  },

  // ── Arms ──
  preacherCurl: {
    name: "Preacher / Machine Curl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Preacher Bench + Barbell / Machine Curl",
    altMachine: "Machine Biceps Curl",
    setup: "Sit upright with the back of your arms against the pad. Grip at shoulder width and establish an initial stretch",
    sets: 3,
    reps: "8–12",
    intensity: "RIR 1–2",
    tempo: "Curl up with constant tension, squeeze at the top 1s, lower slowly over 3s",
    rest: "90 sec",
    cues: [
      "Back of arms glued to the pad — no momentum",
      "Full range: stretch at the bottom, squeeze at the top",
      "Slow eccentric is the hypertrophy driver",
      "Stop 1–2 reps short of failure"
    ],
    muscle: "Biceps" as Muscle,
    weight: "25–30 KG",
  },
  cableHammerCurl: {
    name: "Cable Hammer Curl",
    target: "Biceps",
    secondaryMuscles: ["Forearms", "Brachialis"],
    machine: "Cable Crossover (low pulley, rope attachment)",
    altMachine: "Dumbbell Hammer Curl",
    setup: "Set the pulley low. Stand facing the stack with feet shoulder-width apart. Grip the rope with a hammer curl position (palms facing each other)",
    sets: 3,
    reps: "10–12",
    intensity: "RIR 0–1",
    tempo: "Curl the rope up to chest height, squeeze 1s, lower slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Hammer curl angle targets the brachialis and outer biceps",
      "Constant cable tension: never let the stack relax",
      "Keep elbows fixed at your sides — no swinging",
      "Squeeze hard at the top"
    ],
    muscle: "Biceps" as Muscle,
    weight: "15–20 KG",
  },
  tricepsPushdown: {
    name: "Cable Pushdown",
    img: "tricepsPushdown",
    target: "Triceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Set the pulley high, use a rope or straight bar, elbows glued to your sides, depress your shoulders before starting. Pick a weight where reps 8–10 feel hard",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 0–1",
    tempo: "Lock elbows in place, return slowly over 3s (last set: do Lengthened Partials for 4–5 reps in the bottom half)",
    rest: "90 sec",
    cues: [
      "Lock elbows firmly at your sides",
      "Press and squeeze triceps till they burn",
      "Return slowly 1...2...3...",
      "Last set: Lengthened Partials, bottom half, 4–5 reps"
    ],
    muscle: "Triceps" as Muscle,
    weight: "42 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  tricepsPushdownCondo: {
    name: "Triceps Pushdown",
    img: "tricepsPushdown",
    target: "Triceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Same setup — lock elbows at sides, depress shoulders. Volume load for a metabolic pump",
    sets: 2,
    reps: "10",
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
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  tricepsPushdownFriday: {
    name: "Cable Pushdown",
    img: "tricepsPushdown",
    target: "Triceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Triceps Pushdown",
    altMachine: "Machine Triceps Dip",
    setup: "Set the pulley high, use a rope or straight bar, elbows glued to your sides, depress your shoulders before starting. Pick a weight where reps 8–10 feel hard",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 0–1",
    tempo: "Lock elbows in place, return slowly over 3s",
    rest: "90 sec",
    cues: [
      "Lock elbows firmly at your sides",
      "Press and squeeze triceps till they burn",
      "Return slowly 1...2...3...",
      "Friday arm hit — keep it strict"
    ],
    muscle: "Triceps" as Muscle,
    weight: "40 KG",
    video: "https://www.youtube.com/watch?v=1FjkhpZsaxc",
  },
  bicepsCurl: {
    name: "Cable Curl",
    img: "bicepsCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "Set the pulley low, grip the bar or rope, pin your elbows firmly at your sides and lock your wrists stable",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 0–1",
    tempo: "Pin elbows, no swinging, return slowly over 3s (last set: do Lengthened Partials for 4–5 reps in the bottom half)",
    rest: "90 sec",
    cues: [
      "Pin elbows at your sides",
      "No momentum, no swinging",
      "Squeeze the biceps tight",
      "Return slowly 1...2...3...",
      "Last set: Lengthened Partials, bottom half, 4–5 reps"
    ],
    muscle: "Biceps" as Muscle,
    weight: "25 KG",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
  bicepsCurlCondo: {
    name: "Cable Curl",
    img: "bicepsCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "Same setup — pin elbows at sides. Volume load for a metabolic pump",
    sets: 2,
    reps: "10",
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
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },
  bicepsCurlFriday: {
    name: "Cable Curl",
    img: "bicepsCurl",
    target: "Biceps",
    secondaryMuscles: ["Forearms"],
    machine: "Cable Biceps Curl",
    altMachine: "Dumbbell Biceps Curl",
    setup: "Set the pulley low, grip the bar or rope, pin your elbows firmly at your sides and lock your wrists stable",
    sets: 2,
    reps: "8–10",
    intensity: "RIR 0–1",
    tempo: "Pin elbows, no swinging, return slowly over 3s",
    rest: "90 sec",
    cues: [
      "Pin elbows at your sides",
      "No momentum, no swinging",
      "Squeeze the biceps tight",
      "Return slowly 1...2...3...",
      "Friday arm hit — keep it strict"
    ],
    muscle: "Biceps" as Muscle,
    weight: "24 KG",
    video: "https://www.youtube.com/watch?v=CrbTqNOlFgE",
  },

  // ── Legs ──
  legPress: {
    name: "Leg Press",
    img: "legPress",
    target: "Quads",
    secondaryMuscles: ["Hamstrings", "Glutes"],
    machine: "Leg Press & Calf Raise",
    altMachine: "Hack Squat",
    setup: "Place feet high and wide on the platform to maximize glute/hamstring engagement and protect the patellar tendon. Brace your core tightly and don't let your knees cave inward",
    sets: 3,
    reps: "8",
    intensity: "RIR 1–2",
    tempo: "Press out smoothly (1s), then lower slowly over 3 full seconds (Eccentric 3s)",
    rest: "90–120 sec",
    cues: [
      "Place feet high and wide",
      "Brace core, torso stable",
      "Press out with controlled rhythm",
      "Return slowly 1...2...3...",
      "No-Squat Edition – knee-friendly"
    ],
    muscle: "Legs" as Muscle,
    weight: "50 KG",
    video: "https://www.youtube.com/watch?v=K5n2vg3oZa4",
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
    reps: "8",
    intensity: "RIR 1–2",
    tempo: "Explode up powerfully (1s for power), squeeze glutes at full lockout for 2s, then lower slowly over 3s (Eccentric 3s)",
    rest: "90–120 sec",
    cues: [
      "Drive hips to full lockout",
      "Squeeze glutes for 2 seconds",
      "Chin tucked, ribs down — don't hyperextend the lower back"
    ],
    muscle: "Glutes" as Muscle,
    weight: "60 KG",
    video: "https://www.youtube.com/watch?v=CvuVYMFd11g",
  },
  legExtension: {
    name: "Leg Extension",
    img: "legExtension",
    target: "Quads",
    secondaryMuscles: [],
    machine: "Machine Leg Extension",
    setup: "Sit back firmly, locking your hips into the seat. Adjust the shin pad so it sits right above your ankles",
    sets: 2,
    reps: "12",
    intensity: "RIR 0–1",
    tempo: "Extend up smoothly (1s), squeeze quads at the top for 1s, then lower slowly over 3 full seconds (Eccentric 3s)",
    rest: "60–90 sec",
    cues: [
      "Patellar-safe isolation — no crushing spinal load",
      "Knee-friendly: don't let your feet pull too far back under the seat at the bottom (limit extreme knee flexion)",
      "Focus on the slow 3-second negative to rebuild tendon collagen",
      "Squeeze the quads hard at the top for 1s"
    ],
    muscle: "Legs" as Muscle,
    video: "https://www.youtube.com/watch?v=4ZDm5EbiFI8",
  },
  legCurl: {
    name: "Hamstring Curl",
    img: "legCurl",
    target: "Hamstrings",
    secondaryMuscles: [],
    machine: "Lying or Seated Leg Curl Machine",
    setup: "Align your knee joints perfectly with the machine's pivot point. Secure the thigh pad tightly if seated",
    sets: 2,
    reps: "12",
    intensity: "RIR 0–1",
    tempo: "Curl down/in powerfully (1s), squeeze the hamstrings at full contraction, then return slowly over 3s",
    rest: "60–90 sec",
    cues: [
      "Keep your feet flexed toward your shins",
      "Don't let your lower back arch or lift off the pad",
      "Balances quad dominance and stabilizes the knee joint"
    ],
    muscle: "Legs" as Muscle,
    video: "https://www.youtube.com/watch?v=Orxowest56U",
  },
  calfRaise: {
    name: "Standing Calf Raise",
    img: "calfRaise",
    target: "Calves",
    secondaryMuscles: [],
    machine: "Standing Calf Raise Machine",
    altMachine: "Leg Press Calf Press",
    setup: "Balls of the feet on the edge of the platform, heels hanging free. Keep the knees straight but not locked hard",
    sets: 2,
    reps: "12",
    intensity: "RIR 0–1",
    tempo: "Rise to the top (1s), hold the peak 1s, then sink into a deep heel-down stretch over 3s and pause 1s at the bottom",
    rest: "60 sec",
    cues: [
      "Full range: deep stretch at the bottom, full squeeze at the top",
      "Pause 1 second at the bottom — no bouncing off the tendon",
      "Knees straight, no bending to cheat height",
      "Calves need the stretch more than they need the load"
    ],
    muscle: "Legs" as Muscle,
    video: "https://www.youtube.com/watch?v=SVtg-1loH4c",
  },
  bulgarianSplitSquat: {
    name: "Bulgarian Split Squat",
    target: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    machine: "Dumbbell + Bench / Box",
    altMachine: "Smith Machine Split Squat",
    setup: "Hold a dumbbell in each hand (or two dumbbells) at your sides. Stand facing away from a bench with one foot elevated behind you on the bench, the other foot forward. Keep your torso upright",
    sets: 3,
    reps: "8–10",
    intensity: "RIR 1–2",
    tempo: "Lower down until the back knee almost touches the floor (2s), then drive up powerfully (1s) to a strong lockout",
    rest: "90 sec per leg",
    cues: [
      "Front knee tracks over the toes — don't let it cave inward",
      "Front knee should reach about 90° at the bottom",
      "Torso stays upright; drive from the front leg, not the back",
      "Single-leg loading = quad-focused and stabilizer demanding",
      "Dumbbells at your sides balance the load naturally"
    ],
    muscle: "Legs" as Muscle,
    weight: "16–20 KG per hand",
  },

  // ── Core ──
  cableCrunch: {
    name: "Cable Crunch",
    img: "cableCrunch",
    target: "Abs",
    secondaryMuscles: ["Obliques"],
    machine: "Cable Crossover (rope, high pulley)",
    altMachine: "Machine Ab Crunch",
    setup: "Kneel facing the stack, rope at your temples, hips fixed in place. Set the weight so 15 reps burn without you pulling with the arms",
    sets: 3,
    reps: 15,
    intensity: "RIR 0–1",
    tempo: "Crunch by rounding your spine down toward your knees (1s), hold the crunch 1s, return slowly over 3s",
    rest: "60 sec",
    cues: [
      "Round the spine — this is a crunch, not a hip hinge",
      "Hips stay locked, only the ribs move toward the pelvis",
      "Elbows stay glued to the sides of your head",
      "Loaded abs thicken the blocks — the deficit reveals them"
    ],
    muscle: "Core" as Muscle,
    video: "https://www.youtube.com/watch?v=AV5PmZJIrrw",
  },
  cableCrunchLight: {
    name: "Cable Crunch",
    img: "cableCrunch",
    target: "Abs",
    secondaryMuscles: ["Obliques"],
    machine: "Cable Crossover (rope, high pulley)",
    altMachine: "Machine Ab Crunch",
    setup: "Same setup, lighter load — this is a recovery-day touch, not a session",
    sets: 2,
    reps: 15,
    intensity: "Volume",
    tempo: "Crunch down (1s), hold 1s, return slowly over 3s",
    rest: "60 sec",
    cues: [
      "Round the spine, hips locked",
      "Keep it strict — you're not fresh from a heavy day",
      "Stop 2 reps short of failure",
      "In and out in 5 minutes"
    ],
    muscle: "Core" as Muscle,
    video: "https://www.youtube.com/watch?v=AV5PmZJIrrw",
  },
} as const

// ─── Workout Programs ────────────────────────────────────────────────────────
// The first `warmup` exercises of each day render inside a collapsed warm-up block.

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

const warmupMobility = [
  exercises.thoracicOpener,
  exercises.hipFlexorStretch,
  exercises.shoulderMobility,
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
}

const dayPrograms: Record<DayKey, DayProgram> = {
  monday: {
    eyebrow: "Monday",
    title: "Chest + Shoulders",
    color: "text-emerald-400",
    warmup: warmupFull,
    work: [
      exercises.inclineChestPress,
      exercises.chestPress,
      exercises.cableLateralRaise,
      exercises.shoulderPress,
    ],
  },
  tuesday: {
    eyebrow: "Tuesday",
    title: "Biceps + Zone 2",
    color: "text-blue-400",
    warmupLabel: "Warm-up",
    warmup: warmupChildsPose,
    work: [
      exercises.preacherCurl,
      exercises.cableHammerCurl,
    ],
  },
  wednesday: {
    eyebrow: "Wednesday",
    title: "Chest + Shoulders + Triceps",
    color: "text-emerald-400",
    warmup: warmupFull,
    work: [
      exercises.inclineChestPressCondo,
      exercises.cableFly,
      exercises.cableLateralRaise,
      exercises.reversePecDeck,
      exercises.tricepsPushdown,
    ],
  },
  thursday: {
    eyebrow: "Thursday",
    title: "Zone 2 / Recovery",
    color: "text-blue-400",
    warmup: [],
    work: [],
  },
  friday: {
    eyebrow: "Friday · Trainer Day",
    title: "Heavy Back + Delts",
    color: "text-amber-400",
    warmup: warmupFull,
    work: [
      exercises.neutralGripLatPulldown,
      exercises.chestSupportedRow,
      exercises.machineHighRow,
      exercises.singleArmLatPulldown,
      exercises.cableLateralRaise,
      exercises.reversePecDeck,
    ],
  },
  saturday: {
    eyebrow: "Saturday · Trainer Day",
    title: "Heavy Legs",
    color: "text-amber-400",
    warmup: warmupCouchChildsPose,
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
  },
}

const dayKeys = Object.keys(dayPrograms) as DayKey[]

const globalRules = [
  { topic: "Double Progression", rule: "Never add weight before you hit the top of the rep range on every set with clean form. Add reps first, weight second." },
  { topic: "3-Second Eccentric", rule: "Every lowering phase takes 3 full seconds. In a calorie deficit the eccentric is what tells your body to keep the muscle it already has." },
  { topic: "Protein & Carb Timing", rule: "Protein high and constant; put your complex carbs around the training window so glycogen lands in the muscle, not around the waist." },
  { topic: "Maximize Sleep", rule: "Deep sleep suppresses cortisol. Low cortisol is what finally lets the stubborn subcutaneous water around the midsection go — abs are revealed in bed as much as in the gym." },
]

const progressionExample = [
  { week: "Week 1", weight: "22 kg", reps: "6 / 6 / 6" },
  { week: "Week 2", weight: "22 kg", reps: "7 / 6 / 6" },
  { week: "Week 3", weight: "22 kg", reps: "8 / 7 / 6" },
  { week: "Week 4", weight: "22 kg", reps: "8 / 8 / 8" },
  { week: "Week 5", weight: "24 kg", reps: "6 / 6 / 6", bump: true },
]

const intensityRules = [
  { label: "Heavy compounds", value: "RIR 1–2" },
  { label: "Isolation, last set", value: "RIR 0–1" },
  { label: "Every eccentric", value: "3 seconds" },
  { label: "Cheating", value: "None" },
]

const weeklyVolume = [
  { muscle: "Chest", sets: 12, hero: true },
  { muscle: "Lateral Delts", sets: 8, hero: true },
  { muscle: "Back", sets: 14, hero: true },
  { muscle: "Rear Delts", sets: 4 },
  { muscle: "Front Delts", sets: 2 },
  { muscle: "Biceps", sets: 6 },
  { muscle: "Triceps", sets: 2 },
  { muscle: "Legs", sets: 14 },
  { muscle: "Zone 2 Cardio", sets: 90, hero: false },
]

const weekOverview = [
  { label: "Mon", tag: "Chest", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Tue", tag: "Biceps", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "Wed", tag: "Chest", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Thu", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "Fri", tag: "Back", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sat", tag: "Legs", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sun", tag: "Zone 2", style: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
]

// ─── Progress persistence ────────────────────────────────────────────────────

type Progress = Record<DayKey, boolean[][]>

const STORAGE_KEY = "pt-progress-v7"

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
  footer,
}: {
  program: DayProgram
  sets: boolean[][]
  onToggle: (exerciseIndex: number, setIndex: number) => void
  onReset: () => void
  footer?: React.ReactNode
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
            <span className="text-gray-600">· {warmup.map((e) => e.name.replace(/\s*\(.*\)$/, "")).join(" · ")}</span>
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

      {footer}
    </section>
  )
}

const cardioFooter = (
  <div className="mt-2 flex items-center gap-2 px-1 text-[12px] text-gray-600">
    <Footprints className="h-3.5 w-3.5 shrink-0" />
    <span>Zone 2 · 60 min · treadmill 2.8 km/h · 9% incline · no holding rails</span>
  </div>
)

const recoveryFooter = (
  <div className="mt-2 flex items-center gap-2 px-1 text-[12px] text-gray-600">
    <Footprints className="h-3.5 w-3.5 shrink-0" />
    <span>Zone 2 · 60 min + 15 min mobility · no lifting today — this day exists so the other six work</span>
  </div>
)

function RestDay({ day, description }: { day: string; description: string }) {
  return (
    <section>
      <div className="mb-2">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{day}</div>
        <h2 className="mt-0.5 text-[17px] font-semibold text-white">Rest Day</h2>
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
            <h1 className="text-xl font-semibold text-white">Weekly Hypertrophy + Zone 2</h1>
          </div>
          <p className="pl-6 text-sm text-gray-500">
            7 days: 4 lifting days + 3 Zone 2 / Recovery days · Heavy Back (Friday) and Heavy Legs (Saturday) with trainer · 90–125 min/week Zone 2. Tap a set to check it off — progress is saved on this device.
          </p>
          <blockquote className="ml-6 mt-4 border-l-2 border-emerald-500/40 pl-3 text-[13px] italic leading-relaxed text-gray-400">
            Train like a powerbuilder, recover like a bodybuilder, diet like a physique athlete.
          </blockquote>
        </div>

        {/* Goal */}
        <section className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-200">Goal · Maximum hypertrophy</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-400">
                Build muscle with a focus on chest, shoulders, and back thickness. Heavy compounds on Monday–Wednesday, Friday, and Saturday. Zone 2 cardio (90–125 min/week) supports recovery and cardiovascular health.
              </p>
              <p className="mt-2 text-[12px] text-gray-600">
                Monday–Thursday and Sunday: gym + Zone 2 · Friday–Saturday: trainer-led heavy sessions
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

        {dayKeys.map((key, i) =>
          activeDay === null || activeDay === i ? (
            <div key={key}>
              {dayPrograms[key].work.length === 0 ? (
                <RestDay
                  day={dayPrograms[key].eyebrow}
                  description={key === "thursday"
                    ? "No resistance training. Zone 2 only. Treadmill: 4.5 km/h, 9% incline, ~135 bpm, 30–40 min. This is a low-fatigue buffer before Friday's Heavy Back session."
                    : "No resistance training. Zone 2 only. Treadmill: 4.5 km/h, 9% incline, ~135 bpm, 30–45 min. Active recovery and cardiovascular maintenance."}
                />
              ) : (
                <DaySection
                  program={dayPrograms[key]}
                  sets={progress[key]}
                  onToggle={(exIdx, setIdx) => toggleSet(key, exIdx, setIdx)}
                  onReset={() => resetDay(key)}
                  footer={cardioFooter}
                />
              )}
            </div>
          ) : null
        )}

        {/* Progression */}
        <section>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Progression · Double Progression</h2>
          <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
            Every compound lift follows double progression: add reps until you hit the top of the range on <em>all</em> sets, then add weight and start again.
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
          <p className="mt-3 text-[13px] leading-relaxed text-amber-300/80">
            Never increase the weight before reaching the top of the rep range with clean form.
          </p>
        </section>

        {/* Intensity */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">Intensity</h2>
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
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">Weekly Volume</h2>
          <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
            Hard sets per muscle per week. The three highlighted rows are where the priority sits — everything else is held at a maintenance dose.
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20">
            {weeklyVolume.map(({ muscle, sets, hero }) => (
              <div
                key={muscle}
                className={`flex items-center gap-3 border-b border-gray-800/60 px-4 py-2.5 last:border-0 ${hero ? "bg-emerald-500/[0.05]" : ""}`}
              >
                <span className={`w-28 shrink-0 text-[13px] ${hero ? "font-medium text-emerald-300" : "text-gray-400"}`}>
                  {muscle}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className={`h-full rounded-full ${hero ? "bg-emerald-500" : "bg-gray-600"}`}
                    style={{ width: `${(sets / 16) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-[13px] tabular-nums text-gray-300">{sets}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4 Pillars */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">4 Pillars of Perfect Execution</h2>
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
