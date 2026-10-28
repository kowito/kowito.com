import { SiteFooter } from "@/components/site-footer"
import {
  AlertTriangle,
  Check,
  Dumbbell,
  Flame,
  Info,
  Leaf,
  Moon,
  Pizza,
  Scale,
  Sun,
  Sunrise,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import {
  Burst,
  Caption,
  INK,
  PageTitle,
  Panel,
  SectionTitle,
  SiteHeader,
  Sticker,
  display,
  halftone,
  hardShadow,
  ink,
  lettering,
  smallShadow,
  tilts,
} from "@/components/comic"
import { Reveal } from "@/components/comic-motion"

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

const weekStrip: { label: string; tag: string; type: DayType }[] = [
  { label: "Mon", tag: "Clean", type: "regular" },
  { label: "Tue", tag: "Clean", type: "regular" },
  { label: "Wed", tag: "Clean", type: "regular" },
  { label: "Thu", tag: "Clean", type: "regular" },
  { label: "Fri", tag: "Clean", type: "regular" },
  { label: "Sat", tag: "Flex", type: "flex" },
  { label: "Sun", tag: "Cheat", type: "cheat" },
]

const goalPoints = [
  "High protein keeps muscles growing",
  "Minimal sauce = minimal hidden sugar",
  "Veggies unlimited = never hungry",
  "One cheat meal prevents crash-dieting",
  "7-Eleven is always a fallback",
]

// ─── Comic looks ─────────────────────────────────────────────────────────────

/**
 * Clean, flex and cheat days differ in ink, print pattern and icon as well as colour:
 * clean is flat green, flex is yellow with Ben-Day dots, cheat is red with hatching.
 */
const dayLook: Record<DayType, { label: string; icon: LucideIcon; light: boolean; paint: CSSProperties }> = {
  regular: { label: "Clean Day", icon: Leaf, light: false, paint: { backgroundColor: INK.green } },
  flex: {
    label: "Flexible Day",
    icon: Scale,
    light: false,
    paint: { backgroundColor: INK.yellow, ...halftone("rgba(0,0,0,0.22)", 6) },
  },
  cheat: {
    label: "Cheat Day",
    icon: Pizza,
    light: true,
    paint: {
      backgroundColor: INK.red,
      backgroundImage: "repeating-linear-gradient(-45deg, rgba(0,0,0,0.2) 0 3px, transparent 3px 10px)",
    },
  },
}

type MealTime = "Breakfast" | "Lunch" | "Dinner"

const mealLook: Record<MealTime, { color: string; icon: LucideIcon; light?: boolean }> = {
  Breakfast: { color: INK.cyan, icon: Sunrise },
  Lunch: { color: INK.yellow, icon: Sun },
  Dinner: { color: INK.purple, icon: Moon, light: true },
}

/** Pops in on page load, straight from CSS, so above-the-fold pieces never wait for JavaScript. */
const popIn = "animate-in fade-in zoom-in-50 fill-mode-backwards duration-300 motion-reduce:animate-none"

// ─── Components ──────────────────────────────────────────────────────────────

function WeekDay({ label, tag, type, index }: { label: string; tag: string; type: DayType; index: number }) {
  const look = dayLook[type]
  const Icon = look.icon
  return (
    <div
      className={`flex min-w-0 flex-col items-center gap-1 border-2 border-black px-0.5 py-2 shadow-[2px_2px_0_0_#000] sm:border-[3px] sm:py-3 sm:shadow-[3px_3px_0_0_#000] ${popIn} ${
        tilts[index % tilts.length]
      } ${look.light ? "text-white" : "text-black"}`}
      style={{ ...look.paint, animationDelay: `${250 + index * 70}ms` }}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
      <span className={`${display} text-lg leading-none sm:text-2xl`} style={look.light ? lettering(1, 1.5) : undefined}>
        {label}
      </span>
      <span className={`px-1 text-[10px] font-bold leading-tight sm:text-xs ${look.light ? "bg-black text-white" : ""}`}>{tag}</span>
    </div>
  )
}

function CatalogColumn({
  title,
  subtitle,
  items,
  color,
  unlimited = false,
  icon,
  index,
}: {
  title: string
  subtitle: string
  items: CatalogItem[]
  color: string
  unlimited?: boolean
  icon: ReactNode
  index: number
}) {
  return (
    <div
      className={`bg-white text-black ${ink} ${hardShadow} ${tilts[index % tilts.length]} ${popIn}`}
      style={{ animationDelay: `${500 + index * 120}ms` }}
    >
      <div
        className="flex items-start justify-between gap-2 border-b-[3px] border-black px-4 py-3"
        style={{ backgroundColor: color, ...halftone("rgba(0,0,0,0.14)", 6) }}
      >
        <div className="flex items-center gap-2.5">
          <span className={`grid h-10 w-10 shrink-0 place-items-center border-2 border-black bg-white ${smallShadow}`}>{icon}</span>
          <div>
            <p className={`${display} text-3xl leading-none`}>{title}</p>
            <p className="mt-0.5 text-xs font-bold text-black/70">{subtitle}</p>
          </div>
        </div>
        {unlimited && <Sticker className="shrink-0 rotate-3">Unlimited</Sticker>}
      </div>
      <div className="divide-y-2 divide-dashed divide-black/25 px-4 py-1.5">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-2 py-2.5">
            <span className="text-sm font-bold leading-snug">{item.name}</span>
            {item.note && (
              <Sticker color={color} className="shrink-0">
                {item.note}
              </Sticker>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MealSlot({ type, meal }: { type: MealTime; meal: Meal }) {
  const look = mealLook[type]
  const Icon = look.icon
  const cheat = meal.isCheat
  return (
    <div
      className={`space-y-2 border-2 border-black px-4 py-3 ${smallShadow} ${cheat ? "text-white" : "bg-white text-black"}`}
      style={cheat ? { backgroundColor: INK.red } : undefined}
    >
      <Sticker color={cheat ? "#000" : look.color} className={cheat || look.light ? "text-white" : undefined}>
        <Icon className="h-3 w-3" strokeWidth={3} />
        {type}
      </Sticker>
      <p
        className={cheat ? `${display} text-3xl leading-none` : "text-base font-bold leading-snug"}
        style={cheat ? lettering(1.5, 2) : undefined}
      >
        {meal.name}
      </p>
      {meal.detail && <p className={`text-sm leading-relaxed ${cheat ? "font-bold" : "text-black/70"}`}>{meal.detail}</p>}
      {meal.request && (
        <div className="flex items-start gap-1.5 pt-0.5">
          <span className="mt-0.5 shrink-0 bg-black px-1 py-px text-[10px] font-bold uppercase tracking-wider text-white">
            Request
          </span>
          <span className="text-sm font-bold leading-snug">{meal.request}</span>
        </div>
      )}
    </div>
  )
}

function DayMealCard({ plan, index }: { plan: DayPlan; index: number }) {
  const look = dayLook[plan.type]
  const Icon = look.icon
  return (
    <section
      className={`group relative bg-white text-black ${ink} ${hardShadow} ${index % 2 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-[3px] border-black px-5 py-3 md:px-7" style={look.paint}>
        <p
          className={`${display} text-3xl leading-none ${look.light ? "text-white" : "text-black"}`}
          style={look.light ? lettering(1.5, 2) : undefined}
        >
          {plan.day}
        </p>
        <Sticker color={look.light ? "#000" : "#fff"} className={look.light ? "text-white" : undefined}>
          <Icon className="h-3 w-3" strokeWidth={3} />
          {look.label}
        </Sticker>
      </div>
      {plan.type === "cheat" && (
        <Burst
          text="YUM!"
          className="pointer-events-none absolute -top-9 right-3 w-20 rotate-6 motion-safe:group-hover:animate-wiggle sm:w-24"
        />
      )}
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:p-7">
        <MealSlot type="Breakfast" meal={plan.breakfast} />
        <MealSlot type="Lunch" meal={plan.lunch} />
        <MealSlot type="Dinner" meal={plan.dinner} />
      </div>
    </section>
  )
}

/** A phrase to say at the stall, drawn as a speech bubble. */
function PhraseBubble({ phrase }: { phrase: TipPhrase }) {
  return (
    <div className="relative rounded-[18px] border-2 border-black bg-white px-3.5 py-2 text-black shadow-[2px_2px_0_0_#000]">
      <span aria-hidden className="absolute -bottom-[7px] left-6 h-3 w-3 rotate-45 border-b-2 border-r-2 border-black bg-white" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-sm font-bold">{phrase.label}</span>
        <span className="text-xs font-bold text-black/60">{phrase.en}</span>
      </div>
      <p lang="th" className="text-lg leading-snug">
        {phrase.th}
      </p>
    </div>
  )
}

function TipCard({ tip, index }: { tip: ProTipItem; index: number }) {
  return (
    <div
      className={`text-black ${ink} ${hardShadow} ${tilts[index % tilts.length]}`}
      style={{ backgroundColor: tip.warning ? INK.yellow : "#fff" }}
    >
      {tip.warning && (
        <div
          aria-hidden
          className="h-3.5 border-b-[3px] border-black"
          style={{ backgroundImage: "repeating-linear-gradient(-45deg, #000 0 8px, #FFD400 8px 16px)" }}
        />
      )}
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center border-2 border-black ${smallShadow}`}
            style={{ backgroundColor: tip.warning ? INK.red : INK.cyan }}
          >
            {tip.warning ? (
              <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2.5} />
            ) : (
              <Info className="h-5 w-5 text-black" strokeWidth={2.5} />
            )}
          </span>
          <div>
            <p className={`${display} text-2xl leading-none`}>{tip.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed">{tip.body}</p>
          </div>
        </div>
        {tip.phrases && (
          <div className="space-y-4 pb-1">
            {tip.phrases.map((phrase) => (
              <PhraseBubble key={phrase.label} phrase={phrase} />
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
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader className="max-w-6xl" links={[{ href: "/personal-training", label: "Training Plan", icon: Dumbbell }]} />

      <main className="container mx-auto max-w-6xl flex-1 px-4 pb-20">
        {/* Page heading */}
        <PageTitle
          kicker={
            <span className="inline-flex items-center gap-1.5">
              <Utensils className="h-3.5 w-3.5" strokeWidth={2.5} />
              Street food edition
            </span>
          }
          title="Thai Street Food Diet"
          color={INK.green}
        >
          <p className="max-w-xl text-base leading-relaxed">
            Real food, real streets. Machine 3&times;/week + eating like this = chest and six-pack emerge from the
            115&nbsp;kg chassis.
          </p>
        </PageTitle>

        {/* Week overview strip */}
        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 lg:flex-1">
            {weekStrip.map(({ label, tag, type }, i) => (
              <WeekDay key={label} label={label} tag={tag} type={type} index={i} />
            ))}
          </div>
          <Panel className={`rotate-1 px-4 py-3 lg:w-[22rem] lg:shrink-0 ${popIn}`} style={{ animationDelay: "800ms" }}>
            <p className={`${display} text-2xl leading-none`}>Meal Formula</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm font-bold">
              <Sticker color={INK.orange} className="text-xs">
                Protein (1–2)
              </Sticker>
              {" + "}
              <Sticker color={INK.yellow} className="text-xs">
                Carbs (1)
              </Sticker>
              {" + "}
              <Sticker color={INK.green} className="text-xs">
                Veggies (free)
              </Sticker>
            </p>
          </Panel>
        </div>

        <div className="mt-16 space-y-20">
          {/* ── Mix & Match Catalog ── */}
          <section className="space-y-7">
            <div className="space-y-3">
              <SectionTitle title="Mix & Match Catalog" sub="The Blueprint" color={INK.yellow} />
              <p className="max-w-2xl text-base leading-relaxed">
                Build every meal from these three columns. Pick 1–2 proteins, 1 carb, and as many veggies as you want.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <CatalogColumn
                title="Protein"
                subtitle="Pick 1–2 per meal"
                items={proteins}
                color={INK.orange}
                icon={<Dumbbell className="h-5 w-5" strokeWidth={2.5} />}
                index={0}
              />
              <CatalogColumn
                title="Carbs"
                subtitle="Pick 1 per meal"
                items={carbsList}
                color={INK.yellow}
                icon={<Zap className="h-5 w-5" strokeWidth={2.5} />}
                index={1}
              />
              <CatalogColumn
                title="Veggies"
                subtitle="No limit — fill your plate"
                items={veggiesList}
                color={INK.green}
                unlimited
                icon={<Leaf className="h-5 w-5" strokeWidth={2.5} />}
                index={2}
              />
            </div>
          </section>

          {/* ── 7-Day Meal Plan ── */}
          <section className="space-y-7">
            <Reveal className="space-y-3">
              <SectionTitle title="7-Day Meal Plan" sub="The Schedule" color={INK.cyan} />
              <p className="max-w-2xl text-base leading-relaxed">
                Street food edition. Every meal is available at any Thai market, hawker stall, or 7-Eleven.
              </p>
            </Reveal>
            <div className="space-y-8">
              {mealPlan.map((plan, i) => (
                <Reveal key={plan.day}>
                  <DayMealCard plan={plan} index={i} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Pro Tips ── */}
          <section className="space-y-7">
            <Reveal>
              <SectionTitle title="Pro Tips" sub="Street Smarts" color={INK.pink} />
            </Reveal>
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
              {proTips.map((tip, i) => (
                <Reveal key={tip.title} delay={i * 90}>
                  <TipCard tip={tip} index={i} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── The Goal ── */}
          <Reveal>
            <section
              className={`relative -rotate-[0.5deg] p-6 text-black md:p-8 ${ink} shadow-[8px_8px_0_0_#000]`}
              style={{ backgroundColor: INK.yellow, ...halftone("rgba(0,0,0,0.12)", 6) }}
            >
              <Burst
                text="POW!"
                className="pointer-events-none absolute -top-14 right-2 w-20 rotate-12 md:-top-16 md:right-6 md:w-28"
              />
              <div className="space-y-5">
                <div className="flex items-center gap-3 md:pr-32">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center bg-[#FF3B30] ${ink} ${smallShadow}`}>
                    <Flame className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </span>
                  <div className="space-y-2">
                    <Caption color="#fff" className="-rotate-1">
                      The Goal
                    </Caption>
                    <h2 className={`${display} text-4xl leading-none md:text-5xl`} style={{ ...lettering(2.5, 4), color: INK.red }}>
                      Why This Works
                    </h2>
                  </div>
                </div>
                <p className="max-w-2xl text-base leading-relaxed">
                  By eating like this and hitting the machines 3&times; a week, you aren&apos;t just
                  &ldquo;dieting&rdquo; &mdash; you are{" "}
                  <span className="box-decoration-clone bg-white px-1 font-bold">feeding the Chest and Six-pack</span> while burning
                  the 115&nbsp;kg belly. Street food is on your side. The sauces are not.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {goalPoints.map((point, i) => (
                    <span
                      key={point}
                      className={`inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 text-sm font-bold shadow-[2px_2px_0_0_#000] ${
                        i % 2 ? "rotate-1" : "-rotate-1"
                      }`}
                    >
                      <span className="grid h-4 w-4 shrink-0 place-items-center border-2 border-black bg-[#2DD881]">
                        <Check className="h-2.5 w-2.5" strokeWidth={4} />
                      </span>
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </main>

      <SiteFooter className="max-w-6xl px-4" />
    </div>
  )
}
