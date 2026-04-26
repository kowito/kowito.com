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
    name: "Box Squat",
    machine: "Bench or Box + Bodyweight (or light dumbbell)",
    setup: "Stand in front of a bench, feet shoulder-width, sit back to the bench then stand tall",
    sets: 3, reps: 8,
    tempo: "2s down / 1s pause / 1s stand",
    rest: "60–90s",
    cue: "Sit back under control until your hips lightly touch the bench, keep your chest tall and knees tracking over mid-foot, then stand up by pushing through your whole foot. Do not crash onto the bench or rock forward; the bench is only a depth target. This replaces heavy barbell squats so you can build safe leg strength first.",
    muscle: "Legs",
  },
  {
    name: "Lat Pulldown",
    machine: "Lat Pulldown Machine",
    setup: "Thigh pad snug, grip wide (just outside shoulder-width)",
    sets: 3, reps: 10,
    tempo: "1s pull / 2s return",
    rest: "60–90s",
    cue: "Think of your hands as hooks and initiate the pull by driving your elbows down toward your back pockets — not by yanking with your biceps. Lean back no more than 10–15° and pull the bar to your upper chest; your elbows should end up pointing straight down at the bottom. Control the bar back up over 2 full seconds — if you just let it fly up, you're giving away half the rep and loading your shoulder joints unnecessarily.",
    muscle: "Back",
  },
  {
    name: "Seated Row",
    machine: "Row Machine",
    setup: "Sit tall, chest against pad, neutral grip",
    sets: 3, reps: 10,
    tempo: "1s pull / 2s return",
    rest: "60–90s",
    cue: "Sit tall with your chest pressed against the pad throughout the entire rep — the moment your chest lifts off, your lower back takes over and the back muscles disengage. Pull the handles all the way to your lower abs, then think about pinching your shoulder blades together hard, like you're trying to crack a walnut between them. Slow the return down deliberately over 2 seconds to keep constant tension in the lats and rhomboids instead of just letting the weight stack reset.",
    muscle: "Back",
  },
  {
    name: "Pec Deck",
    machine: "Pec Deck Machine",
    setup: "Elbows at chest height, upper arm parallel to floor",
    sets: 3, reps: 12,
    tempo: "Slow and controlled",
    rest: "45–60s",
    cue: "Open your arms slowly at the start until you feel a deep stretch across your chest — most people stop too early and miss the full range that actually stretches the pec fibers. Drive your arms inward and squeeze your chest hard when the pads meet; hold that squeeze for one full second before you release. Keep your elbows slightly bent at all times — never fully straighten them — or the load shifts off the chest and onto the elbow joints.",
    muscle: "Chest",
  },
  {
    name: "Triceps Pushdown",
    machine: "Cable Machine",
    setup: "Rope or bar attachment at head height, elbows tucked by sides",
    sets: 3, reps: 10,
    tempo: "1s push / 2s return",
    rest: "45–60s",
    cue: "Pin your upper arms against your sides and keep them completely still for the entire set — if your elbows drift forward or back, you're recruiting the shoulder instead of isolating the triceps. Push all the way down to full elbow extension on every rep; stopping short is the most common mistake and is why most people don't feel this in their triceps at all. Return slowly over 2 seconds, letting the cable stretch the long head of the triceps — that stretch under load is what drives the muscle to grow.",
    muscle: "Triceps",
  },
  {
    name: "Leg Press",
    machine: "Leg Press Machine",
    setup: "Feet shoulder-width, toes slightly out, mid-platform",
    sets: 3, reps: 12,
    tempo: "Controlled down / push up",
    rest: "60–90s",
    cue: "Lower the platform slowly until your knees are at 90° or slightly deeper — don't rush this part; the slow descent pre-loads the quads and glutes before the push. Drive through your entire foot (not just the toes) and push the platform away evenly with both legs. Stop just short of locking your knees out at the top — a slight bend keeps continuous tension on the muscles and protects the knee joint from compressive force at full extension.",
    muscle: "Legs",
  },
  {
    name: "Hip Thrust",
    machine: "Hip Thrust Machine",
    setup: "Pad across hips, feet flat and shoulder-width, shoulder blades on bench edge",
    sets: 3, reps: 10,
    tempo: "1s up / 2s lower",
    rest: "60–90s",
    cue: "Before you thrust up, tuck your chin slightly and think about tilting your pelvis backward (posterior tilt) — this cue ensures your glutes do the work instead of your lower back hyperextending at the top. Drive your hips up by squeezing your glutes as hard as you can; your body should form a straight line from knees to shoulders at the top — not a banana arch. Hold the top position for a full 1 second and make sure you actually feel the glutes contracting — if you feel it in your lower back, reset your foot position and try again.",
    muscle: "Glutes",
  },
  {
    name: "Cable Pull-Through",
    machine: "Cable Machine",
    setup: "Low pulley, rope attachment. Stand facing away from cable, hinge at hips",
    sets: 3, reps: 12,
    tempo: "Controlled",
    rest: "45–60s",
    cue: "Walk far enough from the cable stack that the rope is pulling your hips back even at the start — this pre-loads the glutes and hamstrings. Hinge at the hips like you're closing a car door with your backside: push your hips straight back, keep a soft bend in your knees, and let your torso lean forward naturally. On the drive forward, think 'squeeze glutes and drive hips to the wall in front of you' — this is a hip hinge movement, not a squat, so your shins should stay nearly vertical the entire time.",
    muscle: "Glutes",
  },
  {
    name: "Plank",
    machine: "Bodyweight",
    setup: "Forearms on floor, elbows under shoulders, body in a straight line",
    sets: 3, reps: "30–45s",
    tempo: "Hold",
    rest: "45–60s",
    cue: "A plank done right is an active full-body contraction, not just balancing on your arms. Simultaneously: squeeze your abs inward (like bracing for a punch), clench your glutes, and push your heels back like you're trying to slide across the floor — all three at once. Breathe in short controlled breaths; if your hips start to sag or your lower back aches, drop to your knees and maintain that tension rather than grinding out bad reps.",
    muscle: "Core",
  },
]

const wednesdayExercises: Exercise[] = [
  {
    name: "Incline Push-up",
    machine: "Bench, Smith bar, or sturdy table",
    setup: "Hands elevated at chest height, body in a straight line from head to heels",
    sets: 3, reps: 8,
    tempo: "1s press / 2s lower",
    rest: "60–90s",
    cue: "Brace your core before each rep and lower your chest to the edge in control; press back up without flaring your elbows. The higher the surface, the easier and safer the movement. This replaces floor burpees and mountain climbers to avoid rapid blood-pressure spikes.",
    muscle: "Chest",
  },
  {
    name: "Lat Pulldown",
    machine: "Lat Pulldown Machine",
    setup: "Wide grip, chest tall, thigh pad tight",
    sets: 3, reps: 10,
    tempo: "1s pull / 2s return",
    rest: "60–90s",
    cue: "Before each rep, take a breath and 'open' your chest by pulling your shoulder blades slightly back and down — this loads your lats before the pull even begins. Focus purely on driving your elbows toward the floor and behind your body; your biceps are just along for the ride. At the bottom of each rep, hold for half a second and try to feel the lats contracting — if you can't feel them, the weight is likely too heavy and your biceps are compensating.",
    muscle: "Back",
  },
  {
    name: "Seated Row",
    machine: "Row Machine",
    setup: "Neutral spine, chest against pad",
    sets: 3, reps: 10,
    tempo: "1s pull / 2s return",
    rest: "60–90s",
    cue: "Chest stays on the pad the whole rep — that's non-negotiable. If it lifts off, you've shifted the work to your lower back and removed the rhomboids from the movement entirely. At the end of each pull, pause and think about driving your elbows past your body; this extra inch of range fully contracts the mid-back muscles that most people never reach. Extend slowly back to the start — you should feel a gentle stretch between your shoulder blades at the end of every rep.",
    muscle: "Back",
  },
  {
    name: "Pec Deck",
    machine: "Pec Deck Machine",
    setup: "Elbows level with chest, full range of motion",
    sets: 3, reps: 12,
    tempo: "Slow",
    rest: "45–60s",
    cue: "Push the pads apart as wide as your shoulder flexibility comfortably allows before driving them together — the bigger the range, the more muscle fibers you'll recruit. As you bring the pads in, imagine you're trying to make your two hands touch in front of your chest; that intention creates maximum chest contraction even though the machine physically stops the movement. On Wednesday, add a 1-second hold at the peak squeeze and try to consciously feel the middle of your chest working — this mind-muscle connection is a skill that builds over weeks.",
    muscle: "Chest",
  },
  {
    name: "Triceps Pushdown",
    machine: "Cable Machine",
    setup: "Elbows fixed by sides — they should not move at all",
    sets: 3, reps: 10,
    tempo: "1s push / 2s return",
    rest: "45–60s",
    cue: "Imagine your elbows are bolted to your ribs — they cannot move forward, backward, or outward. If you watch yourself in a mirror and your upper arms are shifting, reduce the weight immediately because you're using momentum rather than muscle. Push all the way down until your arms are fully straight, hold for a half second to eliminate elastic rebound, and then slowly let the cable pull your hands back up over 2 full seconds — that slow return is what develops the long head of the tricep most effectively.",
    muscle: "Triceps",
  },
  {
    name: "Leg Press",
    machine: "Leg Press Machine",
    setup: "Feet stable and flat on platform",
    sets: 3, reps: 12,
    tempo: "Controlled",
    rest: "60–90s",
    cue: "Lower the platform slowly and in full control, pausing for a full second when your knees reach 90° — this eliminates the bounce reflex and forces your muscles to do the entire lift from a dead stop. Keep your feet flat and push evenly through your whole foot; if your heels start rising, your feet are too low on the platform. Drive the platform away powerfully but smoothly, exhaling as you push, and stop just short of locking out at the top to maintain constant leg tension.",
    muscle: "Legs",
  },
  {
    name: "Hip Thrust",
    machine: "Hip Thrust Machine",
    setup: "Same as Monday",
    sets: 3, reps: 10,
    tempo: "1s up / 2s lower",
    rest: "60–90s",
    cue: "Today focus on the isometric contraction at the top: pause for a full 1 second and actively try to squeeze both glutes as hard as you physically can before lowering. This pause eliminates hip flexor momentum and isolates the glutes far more effectively than continuous reps. Lower over 2 full seconds — the eccentric portion of the hip thrust is underrated and trains the glute fibers that are responsible for hip stabilization when you walk and run.",
    muscle: "Glutes",
  },
  {
    name: "Cable Pull-Through",
    machine: "Cable Machine",
    setup: "Same as Monday",
    sets: 3, reps: 12,
    tempo: "Controlled",
    rest: "45–60s",
    cue: "Your arms are not involved — they're just the link between the cable and your hips. All force comes from your hips driving forward and your glutes contracting at the top of the movement. A common mistake is pulling with the arms on the drive forward — if you feel this happening, loosen your grip so your hands are barely holding the rope; this forces your hips to generate all the power.",
    muscle: "Glutes",
  },
  {
    name: "Plank",
    machine: "Bodyweight",
    setup: "Forearms on floor, straight line from head to heels",
    sets: 3, reps: "30–45s",
    tempo: "Hold",
    rest: "45–60s",
    cue: "Each breath during the plank should be controlled and nasal if possible — short, shallow mouth breathing is a sign your core is releasing tension with each exhale. Maintain the triple contraction — abs braced, glutes squeezed, heels pressing back — through every single breath cycle. If your form collapses at 20 seconds, reduce to 20 seconds and do it perfectly; 20 perfect seconds beats 45 sloppy seconds every time.",
    muscle: "Core",
  },
]

const fridayExercises: Exercise[] = [
  {
    name: "Long Walk",
    machine: "Outdoor walk or treadmill incline 0–2%",
    setup: "Comfortable pace where you can speak in full sentences",
    sets: 1, reps: "20–30 min",
    tempo: "Steady",
    rest: "N/A",
    cue: "Keep effort at a steady conversational pace from start to finish. No jogging, no jumping, and no all-out intervals. This replaces jumping jacks as your Friday cardio.",
    muscle: "Legs",
  },
  {
    name: "Lat Pulldown",
    machine: "Lat Pulldown Machine",
    setup: "Same as Monday",
    sets: 3, reps: 10,
    tempo: "1s pull / 2s return",
    rest: "60–90s",
    cue: "By Friday your nervous system knows this movement well, so use that familiarity to focus entirely on the eccentric — the return of the bar to the top. Fight the cable on every single rep; it should take a full 2 seconds for the bar to travel from your chest back to the start position. If you can do 10 reps and still feel fresh, you need more weight; the last 2 reps should require genuine effort and a tight back to complete.",
    muscle: "Back",
  },
  {
    name: "Seated Row",
    machine: "Row Machine",
    setup: "Same as Monday",
    sets: 3, reps: 10,
    tempo: "1s pull / 2s return",
    rest: "60–90s",
    cue: "Think of 'stacking your spine' before each pull — sit tall, take a breath into your belly, and brace before you touch the handles. Pull the handles all the way to your lower abs, not your chest; pulling too high shifts the load from the lats and rhomboids to the rear delts and traps. At the end of the pull, drive your elbows back 2–3 cm further than feels natural — that last bit of range is where the deep mid-back muscles fully contract and is exactly where most people stop short.",
    muscle: "Back",
  },
  {
    name: "Pec Deck",
    machine: "Pec Deck Machine",
    setup: "Same as Monday",
    sets: 3, reps: 12,
    tempo: "Slow",
    rest: "45–60s",
    cue: "Friday pec deck is where you master the mind-muscle connection that will serve you for years — slow everything down by 30% and focus entirely on feeling the chest fibers stretch wide open on each rep. At the peak squeeze, hold for a deliberate 1 full second and notice whether you can feel both pecs equally; if one side feels less involved, you may have a strength imbalance worth monitoring. The stretch phase is where the pec fibers are under maximum load, so open wide and go to the limit of your comfortable range every single rep.",
    muscle: "Chest",
  },
  {
    name: "Triceps Pushdown",
    machine: "Cable Machine",
    setup: "Same as Monday",
    sets: 3, reps: 10,
    tempo: "1s push / 2s return",
    rest: "45–60s",
    cue: "On Friday, go for full elbow lockout on every single rep and actively hold the extended position for a half second — this peak contraction at full extension is what separates tricep training from just moving weight. Keep your breathing synchronized with the reps: exhale on the push down, inhale on the slow return. If you've been consistent this week, your triceps will be slightly pre-fatigued from Monday and Wednesday — that's a good thing; it means lighter weight can be just as effective today if you control it properly.",
    muscle: "Triceps",
  },
  {
    name: "Biceps Curl",
    machine: "Cable Machine or Dumbbell",
    setup: "Stand tall, elbows close to ribs, neutral wrists",
    sets: 3, reps: 10,
    tempo: "1s curl / 2s lower",
    rest: "45–60s",
    cue: "Stand tall with your back against a wall if needed to eliminate all swinging — if your torso rocks backward on each curl, you're using momentum instead of muscle, and that momentum is stolen directly from the bicep contraction. Curl up with a 1-second positive and resist the weight all the way back down over a full 2 seconds; research consistently shows the eccentric (lowering) phase drives more hypertrophy than the lift itself. At the bottom, fully extend your arms — don't let your elbows stay bent — so the bicep gets a complete stretch before the next rep.",
    muscle: "Biceps",
  },
  {
    name: "Leg Press",
    machine: "Leg Press Machine",
    setup: "Same as Monday",
    sets: 3, reps: 12,
    tempo: "Controlled",
    rest: "60–90s",
    cue: "On Friday, push for full depth — lower the platform until your thighs are at or past parallel to the floor, pausing for one full second at the bottom to eliminate the stretch reflex. This bottom pause is the hardest part of the rep and where you'll get the most muscle recruitment, so don't rush it. Drive through your full foot on the way up, exhale at the top, and remember: never lock out the knees — a slight bend at the top keeps your quads and glutes working continuously through all 12 reps.",
    muscle: "Legs",
  },
  {
    name: "Hip Thrust",
    machine: "Hip Thrust Machine",
    setup: "Same as Monday",
    sets: 3, reps: 10,
    tempo: "1s up / 2s lower",
    rest: "60–90s",
    cue: "This is the last hip thrust of the week, so make it count by dialing in everything you've learned Monday and Wednesday. Before the first rep, do a mental checklist: chin tucked, pelvis posteriorly tilted, feet flat, pad centered on hips. Drive up hard, hold the top squeeze for a full second, and lower slowly — treat this set like a technique drill, not just a workout finisher.",
    muscle: "Glutes",
  },
  {
    name: "Cable Pull-Through",
    machine: "Cable Machine",
    setup: "Same as Monday",
    sets: 3, reps: 12,
    tempo: "Controlled",
    rest: "45–60s",
    cue: "By Friday you know the pattern — this time focus on the return phase almost exclusively. As your hips hinge back, resist the cable pulling you by actively controlling the pace: take 2–3 seconds to lower your torso back to the hinge position. This slow eccentric loads the glutes and hamstrings under stretch, which is the primary growth stimulus for this movement. Keep your knees soft, your spine neutral, and your arms completely limp — all tension should be felt in the back of your hips, never in your arms or lower back.",
    muscle: "Glutes",
  },
  {
    name: "Dead Bug",
    machine: "Bodyweight (floor mat)",
    setup: "Lie on back, knees over hips at 90°, arms straight toward ceiling, low back gently pressed into floor",
    sets: 3, reps: "8 each side",
    tempo: "Controlled",
    rest: "45–60s",
    cue: "Slowly lower opposite arm and leg while keeping your lower back glued to the floor, then return and switch sides. Exhale during the reach to keep your ribs down. This replaces crunches and sit-ups to train your core without straining your neck or lower back.",
    muscle: "Core",
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
  { topic: "Weight selection", rule: "Last 2–3 reps of each set should be hard but doable with good form." },
  { topic: "Weekly progression", rule: "Once all reps feel easy, add a small amount of weight next session." },
  { topic: "Cardio intensity", rule: "Steady effort only. No HIIT/sprints until your base fitness is built." },
  { topic: "Session length", rule: "50–60 min total including warm-up and steady cardio. Don\u2019t drag it out." },
  { topic: "Training frequency", rule: "3\u00d7 per week. Rest days between sessions are not optional — they\u2019re when you grow." },
]

const safetyOverrides = [
  {
    day: "Monday (Lower Body / Leg Day)",
    remove: "Remove #1 running/jumping and #3 barbell squats.",
    detail: "No treadmill running, box jumps, or heavy back-loaded squats at 115kg as a beginner.",
    replace: "Use box squats (sit to bench, stand up under control).",
  },
  {
    day: "Wednesday (Upper Body / Push-Pull Day)",
    remove: "Remove #2 floor burpees/mountain climbers and #5 HIIT/sprints.",
    detail: "Avoid repeated floor-to-stand spikes and all-out intervals while building cardiovascular base.",
    replace: "Use incline push-ups and seated rows with steady effort cardio only.",
  },
  {
    day: "Friday (Full Body / Circuit Day)",
    remove: "Remove #4 crunches/sit-ups and #1 jumping jacks.",
    detail: "Protect neck, lower back, knees, and ankles by removing high-impact and neck-dominant ab work.",
    replace: "Use dead bugs for abs and a long walk for cardio.",
  },
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

function SteadyCardio({ minutes = 15, mode = "bike" }: { minutes?: number; mode?: "bike" | "walk" }) {
  const steadyMinutes = Math.max(minutes - 5, 8)
  const title = mode === "walk" ? "Long Walk (No Jogging)" : "Steady Bike (No Sprints)"
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800">
        <Bike className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="ml-auto text-xs text-gray-400">{minutes} min total</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        <p className="text-xs text-gray-300">
          Keep effort steady at conversation pace (RPE 4–5/10). You should be able to speak full sentences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-sky-300 font-medium">Warm-up</p>
            <p className="text-xs text-sky-200 mt-0.5">3 min easy pace</p>
          </div>
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-medium">Steady Work</p>
            <p className="text-xs text-emerald-200 mt-0.5">{steadyMinutes} min continuous</p>
          </div>
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-cyan-300 font-medium">Cool-down</p>
            <p className="text-xs text-cyan-200 mt-0.5">2 min very easy</p>
          </div>
        </div>
        <p className="text-[10px] text-amber-300">No HIIT and no all-out sprints.</p>
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
            Beginner-safe and low-impact, 3&times;/week. Every exercise includes setup, sets&times;reps, tempo, rest
            time, and a coaching cue. No running, jumping, sprint HIIT, barbell back squats, floor burpees, crunches,
            or sit-ups.
          </p>
        </div>

        {/* Mandatory safety overrides */}
        <section className="mb-8 rounded-3xl border border-rose-500/25 bg-rose-500/8 p-5 md:p-6">
          <p className="text-[11px] uppercase tracking-widest text-rose-300 font-medium">Mandatory Safety Overrides</p>
          <p className="mt-1 text-xs text-rose-200/80 max-w-3xl">
            Starting at 115kg with no exercise history: remove the listed high-risk categories exactly as shown and use
            the replacement movement.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {safetyOverrides.map(({ day, remove, detail, replace }) => (
              <article key={day} className="rounded-2xl border border-rose-500/20 bg-black/20 px-4 py-3">
                <p className="text-sm font-semibold text-rose-100">{day}</p>
                <p className="mt-2 text-xs text-rose-100/90"><span className="font-semibold">Remove:</span> {remove}</p>
                <p className="mt-1 text-xs text-rose-200/80">{detail}</p>
                <p className="mt-2 text-xs text-emerald-200"><span className="font-semibold">Instead:</span> {replace}</p>
              </article>
            ))}
          </div>
        </section>

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
            <span className="font-medium text-white block mb-0.5">Safety Flow</span>
            Controlled strength &rarr; no impact &rarr; steady cardio
          </div>
        </div>

        {/* Day cards */}
        <div className="space-y-5">

          {/* ── Monday ── */}
          <DayCard day="Monday" title="Lower Body / Leg Day (Low Impact)" type="train">
            <ExerciseGrid exercises={mondayExercises} />
            <SteadyCardio minutes={15} mode="bike" />
          </DayCard>

          {/* ── Tuesday ── */}
          <DayCard day="Tuesday" title="Active Rest" type="rest">
            <p className="text-sm text-gray-400 -mt-2 mb-1">
              Light movement to flush soreness. Don&rsquo;t skip stretching — it helps Wednesday feel better.
            </p>
            <StretchList stretches={tuesdayStretches} />
          </DayCard>

          {/* ── Wednesday ── */}
          <DayCard day="Wednesday" title="Upper Body / Push-Pull Day (Steady Effort)" type="train">
            <ExerciseGrid exercises={wednesdayExercises} />
            <SteadyCardio minutes={15} mode="bike" />
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
          <DayCard day="Friday" title="Full Body / Circuit Day (No Jumping)" type="train">
            <ExerciseGrid exercises={fridayExercises} />
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
