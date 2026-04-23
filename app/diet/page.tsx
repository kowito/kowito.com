import Link from "next/link"
import { ArrowLeft, Utensils, Dumbbell, Zap, Leaf, Flame, AlertTriangle, Info } from "lucide-react"
import type { ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type DayType = "regular" | "flex" | "cheat"

type CatalogItem = {
  name: string
  note?: string
}

type Meal = {
  name: string
  detail?: string
  request?: string
  isCheat?: boolean
}

type DayPlan = {
  day: string
  type: DayType
  breakfast: Meal
  lunch: Meal
  dinner: Meal
}

type TipPhrase = {
  label: string
  th: string
  en: string
}

type ProTipItem = {
  title: string
  body: string
  warning: boolean
  phrases?: TipPhrase[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const proteins: CatalogItem[] = [
  { name: "Grilled Chicken — Kai Yang", note: "No skin" },
  { name: "Boiled Eggs", note: "3–4 eggs" },
  { name: "Grilled Fish — Pla Pao" },
  { name: "Lean Pork — Moo Yang", note: "No fat" },
  { name: "Steamed Tofu / Fish Ball", note: "Grade A" },
]

const carbsList: CatalogItem[] = [
  { name: "Rice", note: "1 small bowl" },
  { name: "Sticky Rice", note: "Half a bag" },
  { name: "Rice Vermicelli — Kanom Jeen" },
  { name: "Boiled Pumpkin / Corn" },
  { name: "Whole Wheat Bread", note: "7-Eleven" },
]

const veggiesList: CatalogItem[] = [
  { name: "Steamed Cabbage / Morning Glory" },
  { name: "Cucumber / Raw Yardlong Beans" },
  { name: "Som Tum", note: "No sugar / MSG" },
  { name: "Clear Soup with Cabbage" },
  { name: "Fresh Lettuce / Basil" },
]

const mealPlan: DayPlan[] = [
  {
    day: "Monday",
    type: "regular",
    breakfast: {
      name: "Moo Ping — Grilled Pork Skewers",
      detail: "2–3 skewers + Half bag Sticky Rice",
      request: "No fat",
    },
    lunch: {
      name: "Khao Mun Kai — Boiled Chicken & Rice",
      request: "No skin, no oily rice",
    },
    dinner: {
      name: "Kao Lao — Meat Soup",
      detail: "With extra veggies",
      request: "No offal",
    },
  },
  {
    day: "Tuesday",
    type: "regular",
    breakfast: {
      name: "3 Boiled Eggs + Black Coffee",
      detail: "1 cup",
      request: "No sugar",
    },
    lunch: {
      name: "Pad Krapow — Chicken or Pork",
      detail: "With Rice",
      request: "No sugar, low oil",
    },
    dinner: {
      name: "Pla Pao — Salt-crusted Grilled Fish",
      detail: "With lots of veggies",
    },
  },
  {
    day: "Wednesday",
    type: "regular",
    breakfast: {
      name: "Khao Tom — Rice Porridge",
      detail: "Extra minced pork or fish",
    },
    lunch: {
      name: "Kuay Tiew — Noodle Soup",
      detail: "Clear broth only",
      request: "Extra meat, no garlic oil",
    },
    dinner: {
      name: "Larb Moo — Minced Pork Salad",
      detail: "Lean pork + fresh veggies",
    },
  },
  {
    day: "Thursday",
    type: "regular",
    breakfast: {
      name: "Grilled Chicken Breast (7-11) + 1 Boiled Egg",
    },
    lunch: {
      name: "Khao Ka Moo — Braised Pork on Rice",
      request: "Meat only — no skin, no fat, no juice",
    },
    dinner: {
      name: "Yum Talay — Seafood Salad",
      request: "Less sugar and sweetness",
    },
  },
  {
    day: "Friday",
    type: "regular",
    breakfast: {
      name: "2–3 Boiled Eggs + Steamed Pumpkin",
    },
    lunch: {
      name: "Khao Rad Kaeng — Rice with Stir-fries",
      detail: "Pick 2 dry dishes",
      request: "Not coconut curries",
    },
    dinner: {
      name: "Pla Nueng — Steamed Fish",
      detail: "With spicy lime dip",
    },
  },
  {
    day: "Saturday",
    type: "flex",
    breakfast: {
      name: "Kai Kata — Pan Eggs",
      detail: "With lean ham or minced pork",
    },
    lunch: {
      name: "Chicken Steak",
      detail: "EAT AM ARE or street stall",
      request: "Salad or Mash — not Fries",
    },
    dinner: {
      name: "Suki Nam — Thai Hot Pot Soup",
      request: "No vermicelli, extra meat and eggs",
    },
  },
  {
    day: "Sunday",
    type: "cheat",
    breakfast: {
      name: "CHEAT MEAL",
      detail: "Eat what you want — stop at 80% full",
      isCheat: true,
    },
    lunch: {
      name: "Healthy Choice",
      detail: "Protein-focused",
    },
    dinner: {
      name: "Healthy Choice",
      detail: "Light & Lean",
    },
  },
]

const proTips: ProTipItem[] = [
  {
    title: 'The "Nam Jim" Trap',
    body: "Thai dipping sauces — Seafood sauce, Jaew, Suki sauce — are loaded with hidden sugar. Use them sparingly: dip, don't drench.",
    warning: true,
  },
  {
    title: 'The "No" List',
    body: "Tell the vendor before they start cooking. These three phrases protect you from hidden calories in every single meal.",
    warning: false,
    phrases: [
      { label: "Mai Sai Nam Tan", th: "ไม่ใส่น้ำตาล", en: "No sugar" },
      { label: "Mai Sai Pong Choo Rod", th: "ไม่ใส่ผงชูรส", en: "No MSG" },
      { label: "Mai Jiew", th: "ไม่เจียว", en: "No fried garlic oil" },
    ],
  },
  {
    title: "7-Eleven is Your Friend",
    body: "If you can't find clean food on the street, walk into any 7-11. These three are always available and always safe.",
    warning: false,
    phrases: [
      { label: "Chicken Breast", th: "อกไก่", en: "High protein, low fat" },
      { label: "Boiled Eggs", th: "ไข่ต้ม", en: "Cheap protein" },
      { label: "All Café Black", th: "กาแฟดำ", en: "Zero sugar" },
    ],
  },
]

const weekStrip = [
  { label: "Mon", tag: "Clean", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Tue", tag: "Clean", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Wed", tag: "Clean", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Thu", tag: "Clean", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Fri", tag: "Clean", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "Sat", tag: "Flex", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "Sun", tag: "Cheat", style: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
]

const goalPoints = [
  "High protein keeps muscles growing",
  "Minimal sauce = minimal hidden sugar",
  "Veggies unlimited = never hungry",
  "One cheat meal prevents crash-dieting",
  "7-Eleven is always a fallback",
]

// ─── Components ──────────────────────────────────────────────────────────────

function CatalogColumn({
  title,
  subtitle,
  items,
  bar,
  titleColor,
  noteBadge,
  unlimited = false,
  icon,
}: {
  title: string
  subtitle: string
  items: CatalogItem[]
  bar: string
  titleColor: string
  noteBadge: string
  unlimited?: boolean
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 overflow-hidden">
      <div className={`h-[2px] bg-gradient-to-r ${bar}`} />
      <div className="p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className={titleColor}>{icon}</span>
            <div>
              <p className={`text-sm font-semibold ${titleColor}`}>{title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          {unlimited && (
            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300">
              Unlimited
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-800/80 bg-gray-950/40 px-3 py-2.5"
            >
              <span className="text-sm text-gray-200 leading-snug">{item.name}</span>
              {item.note && (
                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${noteBadge}`}>
                  {item.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MealSlot({ type, meal }: { type: "Breakfast" | "Lunch" | "Dinner"; meal: Meal }) {
  const badgeStyle = {
    Breakfast: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    Lunch: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    Dinner: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  }
  return (
    <div
      className={`rounded-xl border px-4 py-3 space-y-1.5 ${
        meal.isCheat ? "border-rose-500/30 bg-rose-500/10" : "border-gray-800 bg-gray-900/50"
      }`}
    >
      <span
        className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${
          meal.isCheat ? "border-rose-500/30 bg-rose-500/15 text-rose-300" : badgeStyle[type]
        }`}
      >
        {type}
      </span>
      <p className={`text-sm font-semibold leading-snug ${meal.isCheat ? "text-rose-200" : "text-white"}`}>
        {meal.name}
      </p>
      {meal.detail && <p className="text-xs text-gray-400 leading-relaxed">{meal.detail}</p>}
      {meal.request && (
        <div className="flex items-start gap-1.5 pt-0.5">
          <span className="text-[10px] uppercase tracking-wider text-amber-500 font-medium shrink-0 mt-0.5">
            Request
          </span>
          <span className="text-xs text-amber-200 leading-relaxed">{meal.request}</span>
        </div>
      )}
    </div>
  )
}

function DayMealCard({ plan }: { plan: DayPlan }) {
  const topBar: Record<DayType, string> = {
    regular: "from-emerald-500 to-teal-400",
    flex: "from-amber-500 to-orange-400",
    cheat: "from-rose-500 to-pink-400",
  }
  const dayTag: Record<DayType, { label: string; style: string } | null> = {
    regular: null,
    flex: { label: "Flexible Day", style: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
    cheat: { label: "Cheat Day", style: "bg-rose-500/10 text-rose-300 border-rose-500/30" },
  }
  const tag = dayTag[plan.type]
  return (
    <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
      <div className={`h-[2px] bg-gradient-to-r ${topBar[plan.type]}`} />
      <div className="p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">{plan.day}</p>
          {tag && (
            <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${tag.style}`}>
              {tag.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <MealSlot type="Breakfast" meal={plan.breakfast} />
          <MealSlot type="Lunch" meal={plan.lunch} />
          <MealSlot type="Dinner" meal={plan.dinner} />
        </div>
      </div>
    </section>
  )
}

function TipCard({ tip }: { tip: ProTipItem }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        tip.warning ? "border-amber-500/30 bg-amber-500/5" : "border-gray-800 bg-gray-900/40"
      }`}
    >
      {tip.warning && <div className="h-[2px] bg-gradient-to-r from-amber-500 to-orange-500" />}
      <div className="p-5 space-y-3.5">
        <div className="flex items-start gap-2.5">
          {tip.warning ? (
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          ) : (
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
          )}
          <div>
            <p className={`text-sm font-semibold ${tip.warning ? "text-amber-200" : "text-white"}`}>{tip.title}</p>
            <p className={`mt-1 text-xs leading-relaxed ${tip.warning ? "text-amber-200/80" : "text-gray-400"}`}>
              {tip.body}
            </p>
          </div>
        </div>
        {tip.phrases && (
          <div className="space-y-1.5 ml-6">
            {tip.phrases.map((phrase) => (
              <div
                key={phrase.label}
                className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center rounded-xl border border-gray-800 bg-gray-950/60 px-3 py-2"
              >
                <span className="text-xs font-semibold text-white">{phrase.label}</span>
                <span className="text-xs text-gray-500 truncate">{phrase.th}</span>
                <span className="text-[10px] text-gray-400 shrink-0">{phrase.en}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DietPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 left-0 h-[650px] w-[650px] rounded-full bg-gradient-to-b from-emerald-900/20 to-teal-900/20 blur-3xl -translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 right-0 h-[650px] w-[650px] rounded-full bg-gradient-to-t from-amber-900/20 to-orange-900/20 blur-3xl translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      <header className="container mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="font-light tracking-wider text-lg text-white hover:text-gray-300 transition-colors">
          Kowit C.
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/personal-training"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Training Plan
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
            <Utensils className="h-6 w-6 text-emerald-400 shrink-0" />
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Thai Street Food Diet</h1>
          </div>
          <p className="max-w-xl text-gray-400 text-sm leading-relaxed">
            Real food, real streets. Machine 3&times;/week + eating like this = chest and six-pack emerge from the
            115&nbsp;kg chassis.
          </p>
        </div>

        {/* Week overview strip */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {weekStrip.map(({ label, tag, style }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 rounded-xl border px-4 py-2.5 min-w-[52px] ${style}`}
            >
              <span className="text-xs font-semibold tracking-wide">{label}</span>
              <span className="text-[10px] opacity-60">{tag}</span>
            </div>
          ))}
          <div className="ml-auto rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-2.5 text-xs text-gray-400 shrink-0">
            <span className="font-medium text-white block mb-0.5">Meal Formula</span>
            Protein (1–2) + Carbs (1) + Veggies (free)
          </div>
        </div>

        <div className="space-y-10">

          {/* ── Mix & Match Catalog ── */}
          <section className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">The Blueprint</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Mix &amp; Match Catalog</h2>
              <p className="mt-1 text-sm text-gray-400">
                Build every meal from these three columns. Pick 1–2 proteins, 1 carb, and as many veggies as you want.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <CatalogColumn
                title="Protein"
                subtitle="Pick 1–2 per meal"
                items={proteins}
                bar="from-emerald-500 to-teal-500"
                titleColor="text-emerald-300"
                noteBadge="bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                icon={<Dumbbell className="h-4 w-4" />}
              />
              <CatalogColumn
                title="Carbs"
                subtitle="Pick 1 per meal"
                items={carbsList}
                bar="from-amber-500 to-orange-500"
                titleColor="text-amber-300"
                noteBadge="bg-amber-500/10 text-amber-300 border-amber-500/25"
                icon={<Zap className="h-4 w-4" />}
              />
              <CatalogColumn
                title="Veggies"
                subtitle="No limit — fill your plate"
                items={veggiesList}
                bar="from-teal-500 to-cyan-500"
                titleColor="text-teal-300"
                noteBadge="bg-teal-500/10 text-teal-300 border-teal-500/25"
                unlimited
                icon={<Leaf className="h-4 w-4" />}
              />
            </div>
          </section>

          {/* ── 7-Day Meal Plan ── */}
          <section className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">The Schedule</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">7-Day Meal Plan</h2>
              <p className="mt-1 text-sm text-gray-400">
                Street food edition. Every meal is available at any Thai market, hawker stall, or 7-Eleven.
              </p>
            </div>
            <div className="space-y-3">
              {mealPlan.map((plan) => (
                <DayMealCard key={plan.day} plan={plan} />
              ))}
            </div>
          </section>

          {/* ── Pro Tips ── */}
          <section className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Street Smarts</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Pro Tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {proTips.map((tip) => (
                <TipCard key={tip.title} tip={tip} />
              ))}
            </div>
          </section>

          {/* ── The Goal ── */}
          <section className="rounded-3xl border border-gray-800 bg-black/40 overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">The Goal</p>
                  <h2 className="text-xl font-semibold tracking-tight text-white mt-0.5">Why This Works</h2>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                By eating like this and hitting the machines 3&times; a week, you aren&apos;t just
                &ldquo;dieting&rdquo; &mdash; you are{" "}
                <span className="text-white font-medium">feeding the Chest and Six-pack</span> while burning
                the 115&nbsp;kg belly. Street food is on your side. The sauces are not.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {goalPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
