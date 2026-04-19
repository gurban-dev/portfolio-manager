'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  Leaf,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const highlightCards = [
  {
    label: 'Portfolios tracked',
    value: '120+',
    detail: 'Accounts, holdings, and transactions in one view.',
  },
  {
    label: 'Insight refresh',
    value: 'Live',
    detail: 'Notifications and ESG signals update as activity lands.',
  },
  {
    label: 'Decision support',
    value: '24/7',
    detail: 'Clear summaries for growth, exposure, and sustainability.',
  },
]

const featureCards = [
  {
    icon: <LineChart className="h-6 w-6" />,
    title: 'Unified portfolio intelligence',
    description:
      'Track balances, transactions, and performance trends without bouncing across multiple tools.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Security-first account flow',
    description:
      'Structured authentication and protected data flows keep the experience reliable from sign-in onward.',
  },
  {
    icon: <BellRing className="h-6 w-6" />,
    title: 'Actionable notifications',
    description:
      'Surface account changes, investment events, and ESG alerts fast enough to act on them.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Sustainability context',
    description:
      'Pair financial performance with ESG visibility so growth is measured against impact, not only return.',
  },
]

const workflowSteps = [
  {
    title: 'Connect your financial picture',
    description:
      'Bring accounts, cash flow, and holdings into a single operating view for day-to-day monitoring.',
  },
  {
    title: 'Review movement and exposure',
    description:
      'Spot balance changes, unusual activity, and portfolio drift before they become expensive surprises.',
  },
  {
    title: 'Act with ESG-backed context',
    description:
      'Use the same dashboard to compare performance with sustainability signals and make cleaner decisions.',
  },
]

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f6fbf6_0%,#eef7f4_48%,#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />

      <header className="relative z-10 border-b border-emerald-950/8 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3 text-slate-950">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/25">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">FinSight</span>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Sustainable finance dashboard
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition-colors hover:text-slate-950">
              Features
            </a>
            <a href="#workflow" className="transition-colors hover:text-slate-950">
              Workflow
            </a>
            <Link href="/pricing" className="transition-colors hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/about" className="transition-colors hover:text-slate-950">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-slate-950">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden rounded-full border border-slate-300/80 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950 sm:inline-flex"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-18 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Bring financial clarity and ESG context into the same workspace
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              A cleaner operating view for modern portfolio management.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              FinSight turns accounts, transactions, and sustainability signals into one structured
              decision surface, so the page you land on immediately tells you what changed and what
              needs attention.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-700/20 transition-transform hover:-translate-y-0.5"
              >
                Create an account
                <ArrowUpRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/85 px-7 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-900 hover:text-slate-950"
              >
                Open the dashboard
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {highlightCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-lg shadow-slate-900/5 backdrop-blur"
                >
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-slate-200/80 bg-white/78 py-20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              What the landing experience should communicate
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A page structure that explains the product before the user signs in.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The homepage now has a stable shell, clear hierarchy, and supporting proof blocks
              instead of relying on missing media or unstyled raw content.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_22px_55px_-35px_rgba(15,23,42,0.45)]"
              >
                <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The structure now matches the product story from first glance to first click.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Instead of dropping visitors into a loose stack of sections, the page leads with
              value, supports it with interface evidence, and ends with a direct route into the
              authenticated experience.
            </p>

            <div className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-slate-950 px-7 py-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
              <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Operator view</p>
              <p className="mt-4 text-2xl font-semibold">
                Replace visual ambiguity with a landing page that gives users orientation fast.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-400" />
                  Clear header navigation and primary calls to action.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-400" />
                  A hero that explains the product without a missing image.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-400" />
                  Balanced sections that hold together on desktop and mobile.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-5">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="flex gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.5)] sm:p-8"
              >
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-lg font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] px-8 py-10 text-white shadow-[0_45px_110px_-55px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Ready to continue
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Start with a homepage that reads like a product, not a placeholder.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                The structure is now explicit, the hero is self-contained, and the styling pipeline
                is configured so the layout actually renders as designed.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Review pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 bg-white/88 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-slate-600 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} FinSight. Portfolio visibility with ESG context.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/about" className="transition-colors hover:text-slate-950">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-slate-950">
              Contact
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/auth" className="transition-colors hover:text-slate-950">
              Log In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute -left-4 top-12 hidden rounded-[1.75rem] border border-emerald-200/80 bg-white/90 px-4 py-3 shadow-xl shadow-emerald-900/10 backdrop-blur sm:block">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">ESG pulse</p>
        <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-950">
          84
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            improving
          </span>
        </p>
      </div>

      <div className="absolute -right-3 bottom-16 hidden rounded-[1.75rem] border border-sky-200/80 bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:block">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Alerts</p>
        <p className="mt-2 text-lg font-semibold text-slate-950">2 balance shifts today</p>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_42px_120px_-52px_rgba(15,23,42,0.9)] backdrop-blur sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Portfolio cockpit</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">Sustainable allocation</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Healthy
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Net worth</p>
                <p className="mt-2 text-3xl font-semibold">$248,400</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <Wallet className="h-5 w-5 text-emerald-300" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <StatBar label="Growth sleeve" value="+12.4%" width="74%" tone="bg-emerald-400" />
              <StatBar label="Cash reserve" value="18%" width="44%" tone="bg-sky-400" />
              <StatBar label="ESG leaders" value="61%" width="61%" tone="bg-teal-300" />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">This month</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">Momentum snapshot</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniMetric value="+8.2%" label="Return" />
              <MiniMetric value="27" label="Signals" />
              <MiniMetric value="Low" label="Risk drift" />
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Activity trend</p>
              <div className="mt-4 flex h-24 items-end gap-2">
                {['36%', '52%', '47%', '68%', '58%', '76%', '88%'].map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="flex-1 rounded-t-full bg-gradient-to-t from-emerald-500 to-teal-300"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent updates</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">What changed today</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <BellRing className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ActivityRow
              title="Green ETF contribution posted"
              meta="Investment account"
              amount="+$1,250"
              tone="text-emerald-700"
            />
            <ActivityRow
              title="Carbon exposure score improved"
              meta="ESG analytics"
              amount="+6 pts"
              tone="text-teal-700"
            />
            <ActivityRow
              title="Spending anomaly flagged"
              meta="Cash management"
              amount="Review"
              tone="text-amber-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  )
}

function StatBar({
  label,
  value,
  width,
  tone,
}: {
  label: string
  value: string
  width: string
  tone: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div className={`h-2 rounded-full ${tone}`} style={{ width }} />
      </div>
    </div>
  )
}

function ActivityRow({
  title,
  meta,
  amount,
  tone,
}: {
  title: string
  meta: string
  amount: string
  tone: string
}) {
  return (
    <div className="flex items-center justify-between rounded-[1.4rem] bg-slate-50 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-full bg-white p-2 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="font-medium text-slate-950">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{meta}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${tone}`}>{amount}</span>
    </div>
  )
}
