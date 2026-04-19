'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  Leaf,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
} from 'lucide-react'

const beliefCards = [
  {
    icon: <Compass className="h-5 w-5" />,
    title: 'Clarity over dashboard noise',
    description:
      'We design for orientation first, so a user can understand what changed before they are asked to interpret charts or alerts.',
  },
  {
    icon: <Leaf className="h-5 w-5" />,
    title: 'Finance and impact belong together',
    description:
      'Performance and sustainability should be read in the same operating view, not in disconnected products or afterthought reports.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Trust is built into the workflow',
    description:
      'Every part of the experience should feel structured, legible, and responsible with user data and financial context.',
  },
]

const principles = [
  {
    title: 'Structured visibility',
    description:
      'Accounts, transactions, and ESG context should reinforce each other, not compete for attention.',
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: 'Decision-ready signals',
    description:
      'A useful platform does not just collect information. It surfaces what actually needs action.',
    icon: <BellRing className="h-6 w-6" />,
  },
  {
    title: 'Responsible product posture',
    description:
      'If sustainability is part of the promise, it has to shape the product language, priorities, and reporting model.',
    icon: <Target className="h-6 w-6" />,
  },
  {
    title: 'Human-scale workflow',
    description:
      'The interface should help both individual investors and small operating teams move with less friction.',
    icon: <Users className="h-6 w-6" />,
  },
]

const operatingSteps = [
  {
    label: 'Observe',
    title: 'See the full picture without context switching',
    description:
      'We want users to move from account visibility to transaction review to sustainability context without losing the thread.',
  },
  {
    label: 'Interpret',
    title: 'Convert raw movement into meaning',
    description:
      'Signals, summaries, and portfolio framing should help people understand why something matters, not merely that it happened.',
  },
  {
    label: 'Act',
    title: 'Support decisions with disciplined context',
    description:
      'The end goal is not more interface surface area. It is cleaner action, better timing, and more deliberate stewardship.',
  },
]

const metrics = [
  {
    icon: <Wallet className="h-5 w-5" />,
    label: 'Product stance',
    value: 'Practical',
    detail: 'Built to support real monitoring and decision workflows, not passive reporting.',
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    label: 'Team fit',
    value: 'Scalable',
    detail: 'Useful for an individual investor today and adaptable to a multi-person operating view later.',
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: 'Design intent',
    value: 'Legible',
    detail: 'Every page should explain itself quickly, with hierarchy that supports trust and speed.',
  },
]

const stewardshipPoints = [
  'Financial visibility should not require juggling multiple fragmented tools.',
  'A sustainability layer should be operational, not decorative.',
  'Notifications should reduce ambiguity instead of adding more of it.',
  'A good interface should read like a disciplined system, not a collection of widgets.',
] as const

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbf7_0%,#eef7f3_42%,#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_44%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/15 blur-3xl" />

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
            <Link href="/" className="transition-colors hover:text-slate-950">
              Home
            </Link>
            <a href="#beliefs" className="transition-colors hover:text-slate-950">
              Beliefs
            </a>
            <a href="#principles" className="transition-colors hover:text-slate-950">
              Principles
            </a>
            <Link href="/pricing" className="transition-colors hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/about" className="text-slate-950">
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
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-22">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              About the thinking behind FinSight
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              We built FinSight to make financial stewardship easier to read and easier to trust.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Too many finance products separate portfolio performance, transaction movement, and
              sustainability context into disconnected experiences. FinSight exists to bring those
              threads back into one operating view that feels intentional, calm, and useful.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-700/20 transition-transform hover:-translate-y-0.5"
              >
                Explore pricing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/85 px-7 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-900 hover:text-slate-950"
              >
                Talk to the team
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur"
                >
                  <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    {metric.icon}
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{metric.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-xl rounded-[2.3rem] border border-white/80 bg-white/90 p-6 shadow-[0_45px_110px_-55px_rgba(15,23,42,0.85)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Product stance</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">What FinSight is built to do</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Mission-led
                </span>
              </div>

              <div className="mt-5 rounded-[1.8rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Core promise</p>
                    <p className="mt-2 text-3xl font-semibold">Make the system legible</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <BadgeCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    Performance and sustainability should appear in the same decision frame.
                  </div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    Users should understand movement before they are asked to interpret charts.
                  </div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    Interface polish should serve trust, not distract from it.
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Why this matters</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">Less ambiguity</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Better tools reduce interpretation overhead so attention can move toward actual
                    financial and stewardship decisions.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">How we design</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">With discipline</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    We prefer strong hierarchy, measured motion, and pages that explain themselves
                    quickly on both desktop and mobile.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="beliefs" className="relative z-10 border-y border-slate-200/80 bg-white/78 py-20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Beliefs
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The product is shaped by a few non-negotiable ideas.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              We do not treat sustainability as a decorative label on top of a finance product.
              The platform is built around the assumption that responsible growth needs better
              visibility, stronger summaries, and more coherent decision support.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {beliefCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.45)]"
              >
                <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  {card.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" className="relative z-10 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Principles
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Elegant product decisions usually come from disciplined operating principles.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              FinSight is meant to feel confident without becoming heavy. That means every page has
              to justify its structure, every section has to earn its place, and every signal has to
              support a cleaner workflow.
            </p>

            <div className="mt-8 rounded-[2rem] border border-emerald-900/10 bg-slate-950 px-7 py-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
              <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Stewardship notes</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                {stewardshipPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-emerald-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.45)]"
              >
                <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  {principle.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{principle.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f2faf6_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              How the product thinks from signal to action.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              We treat the user journey as a disciplined sequence. First establish context. Then
              reduce noise. Then help the user act with more confidence than they had before.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {operatingSteps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.45)]"
              >
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {step.label}
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20 pt-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] px-8 py-10 text-white shadow-[0_45px_110px_-55px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Next step
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                If the product philosophy makes sense, the next move is simple.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Explore the pricing, create an account, or reach out if you want to understand how
                FinSight fits a broader operating or advisory workflow.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                View pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 bg-white/88 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-slate-600 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} FinSight. Built for clearer financial stewardship.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/" className="transition-colors hover:text-slate-950">
              Home
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/contact" className="transition-colors hover:text-slate-950">
              Contact
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
