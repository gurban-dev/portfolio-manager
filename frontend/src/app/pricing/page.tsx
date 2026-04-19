'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Building2,
  Check,
  ChevronRight,
  Crown,
  Leaf,
  Minus,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react'

type BillingMode = 'monthly' | 'annual'

const plans = [
  {
    name: 'Starter',
    eyebrow: 'Personal visibility',
    description: 'For individuals who want a clear operating view of spending, balances, and ESG signals.',
    monthlyPrice: '$0',
    annualPrice: '$0',
    priceCaption: 'No credit card required',
    ctaLabel: 'Start free',
    ctaHref: '/auth/register',
    badge: 'Get oriented fast',
    featured: false,
    features: [
      'Up to 3 connected accounts',
      'Transaction tracking and filters',
      'Basic ESG score visibility',
      'Weekly portfolio summaries',
      'Standard notification feed',
    ],
    accent: 'from-slate-900 to-slate-800',
    border: 'border-white/10',
    button: 'bg-emerald-600 text-white hover:bg-emerald-500',
  },
  {
    name: 'Growth',
    eyebrow: 'Best for active investors',
    description: 'For users managing multiple accounts and relying on portfolio insights every week.',
    monthlyPrice: '$19',
    annualPrice: '$15',
    priceCaption: 'per month, billed annually',
    ctaLabel: 'Choose Growth',
    ctaHref: '/auth/register',
    badge: 'Most popular',
    featured: true,
    features: [
      'Unlimited connected accounts',
      'Real-time alerts and watchlists',
      'ESG trend tracking by holding',
      'Deeper performance analytics',
      'CSV import and export workflows',
      'Priority product updates',
    ],
    accent: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-400/40',
    button: 'bg-slate-950 text-white hover:bg-slate-800',
  },
  {
    name: 'Scale',
    eyebrow: 'For advisors and operators',
    description: 'For small teams who need shared visibility, stronger controls, and higher reporting depth.',
    monthlyPrice: '$49',
    annualPrice: '$39',
    priceCaption: 'per workspace, billed annually',
    ctaLabel: 'Move to Scale',
    ctaHref: '/auth/register',
    badge: 'Team-ready',
    featured: false,
    features: [
      'Everything in Growth',
      '5 team seats included',
      'Shared reporting views',
      'Admin controls and activity history',
      'Custom KPI snapshots',
      'Priority onboarding support',
    ],
    accent: 'from-slate-950 to-emerald-950',
    border: 'border-white/10',
    button: 'bg-slate-800 text-white hover:bg-slate-700',
  },
  {
    name: 'Enterprise',
    eyebrow: 'For multi-team rollouts',
    description: 'For organizations that need custom controls, procurement support, and rollout guidance.',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    priceCaption: 'Designed around your stack',
    ctaLabel: 'Talk to sales',
    ctaHref: '/contact',
    badge: 'Custom deployment',
    featured: false,
    features: [
      'Everything in Scale',
      'Custom deployment planning',
      'Dedicated success and security review',
      'Advanced onboarding and training',
      'Contracted support SLAs',
      'Roadmap alignment conversations',
    ],
    accent: 'from-teal-950 to-slate-900',
    border: 'border-white/10',
    button: 'bg-slate-800 text-white hover:bg-slate-700',
  },
] as const

const comparisonRows = [
  {
    label: 'Connected accounts',
    values: ['3', 'Unlimited', 'Unlimited', 'Unlimited'],
  },
  {
    label: 'Portfolio analytics',
    values: ['Basic', 'Advanced', 'Advanced + team views', 'Custom'],
  },
  {
    label: 'ESG scoring',
    values: ['Summary only', 'Holdings + trend', 'Holdings + trend', 'Custom'],
  },
  {
    label: 'Real-time notifications',
    values: [false, true, true, true],
  },
  {
    label: 'CSV import/export',
    values: [false, true, true, true],
  },
  {
    label: 'Team seats',
    values: ['1', '1', '5 included', 'Custom'],
  },
  {
    label: 'Admin controls',
    values: [false, false, true, true],
  },
  {
    label: 'Onboarding support',
    values: ['Docs', 'Priority email', 'Guided onboarding', 'Dedicated success team'],
  },
] as const

const faqItems = [
  {
    question: 'Can I start on Starter and upgrade later?',
    answer:
      'Yes. The pricing model is designed to let you begin with basic portfolio visibility and move into Growth or Scale when you need more accounts, deeper analytics, or team workflows.',
  },
  {
    question: 'What changes between monthly and annual billing?',
    answer:
      'The functionality stays the same. Annual billing simply lowers the effective monthly rate for Growth and Scale, which is reflected directly in the pricing cards.',
  },
  {
    question: 'Do all plans include ESG insights?',
    answer:
      'Yes, but the depth changes. Starter includes top-level visibility, Growth and Scale expose richer ESG trend tracking, and Enterprise can be structured around custom operating requirements.',
  },
  {
    question: 'Is there a team plan for financial operators?',
    answer:
      'Scale is the team-oriented tier. It adds workspace pricing, included seats, shared reporting, and admin oversight for multi-person operating environments.',
  },
  {
    question: 'How do Enterprise engagements work?',
    answer:
      'Enterprise starts with a conversation around deployment shape, controls, support expectations, and rollout constraints. Pricing is scoped to that operating model rather than forced into a fixed template.',
  },
] as const

const includedHighlights = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Security-minded account flows',
    description: 'Authentication, protected sessions, and structured access patterns are part of the product foundation.',
  },
  {
    icon: <BellRing className="h-5 w-5" />,
    title: 'A notification layer that is actually useful',
    description: 'Every paid tier is built around faster awareness of account changes, portfolio movement, and ESG updates.',
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: 'Reporting that supports action',
    description: 'The pricing is aligned to decision support, not vanity dashboard surface area.',
  },
] as const

const rolloutMetrics = [
  {
    icon: <Wallet className="h-5 w-5" />,
    label: 'Pricing logic',
    value: 'Clear',
    detail: 'Each tier maps to a specific operating use case.',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: 'Upgrade path',
    value: 'Linear',
    detail: 'Start with visibility, then layer on analytics and team capability.',
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    label: 'Enterprise route',
    value: 'Flexible',
    detail: 'Custom support for larger rollouts and procurement processes.',
  },
] as const

export default function PricingPage() {
  const [billingMode, setBillingMode] = useState<BillingMode>('annual')

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#06130f_0%,#0c1f19_45%,#071411_100%)] text-white [&_a]:text-white [&_button]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_li]:text-white [&_p]:text-white [&_span]:text-white [&_summary]:text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.2),transparent_42%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/25">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">FinSight</span>
              <span className="text-xs uppercase tracking-[0.28em] text-white">
                Sustainable finance dashboard
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <a href="#plans" className="transition-colors hover:text-white">
              Plans
            </a>
            <a href="#compare" className="transition-colors hover:text-white">
              Compare
            </a>
            <Link href="/pricing" className="text-white">
              Pricing
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/35 hover:bg-white/10 sm:inline-flex"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Pricing designed around portfolio maturity, not arbitrary seat inflation
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Choose the plan that matches how you actually operate.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white sm:text-xl">
              Starter gets you oriented. Growth adds real-time portfolio intelligence. Scale gives
              teams shared visibility and control. Enterprise is for organizations with rollout,
              security, and support requirements that deserve a custom shape.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-700/20 transition-transform hover:-translate-y-0.5"
              >
                Start with Starter
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:border-white/35 hover:bg-white/10"
              >
                Talk through team needs
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {rolloutMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/10 bg-slate-900/55 p-5 shadow-lg shadow-slate-950/30 backdrop-blur"
                >
                  <div className="inline-flex rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
                    {metric.icon}
                  </div>
                  <p className="mt-4 text-sm font-medium text-white">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white">{metric.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-xl rounded-[2.25rem] border border-white/10 bg-slate-900/70 p-5 shadow-[0_45px_110px_-55px_rgba(15,23,42,0.85)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white">Billing model</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Simple upgrade path</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-white">
                  Annual saves up to 21%
                </span>
              </div>

              <div className="mt-5 rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white">Growth plan snapshot</p>
                    <p className="mt-2 text-4xl font-semibold">
                      {billingMode === 'annual' ? '$15' : '$19'}
                      <span className="ml-2 text-base font-medium text-white">/ month</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Crown className="h-5 w-5 text-emerald-300" />
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-white">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Unlimited connected accounts</span>
                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Deeper ESG intelligence</span>
                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Alert-driven portfolio monitoring</span>
                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-800/80 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white">What changes</p>
                  <p className="mt-2 text-xl font-semibold text-white">More depth, less noise</p>
                  <p className="mt-3 text-sm leading-7 text-white">
                    Paid tiers increase signal quality and operating leverage instead of padding the
                    product with filler features.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-800/80 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white">Who it fits</p>
                  <p className="mt-2 text-xl font-semibold text-white">From solo to scaled teams</p>
                  <p className="mt-3 text-sm leading-7 text-white">
                    Choose the smallest plan that supports your workflow now, then move up only when
                    the operating model changes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="plans" className="relative z-10 border-y border-white/10 bg-slate-950/35 py-20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                Plans
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Four tiers, each with a clear reason to exist.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white">
                The page is structured to help you compare actual operating value, not hunt through
                disconnected fine print.
              </p>
            </div>

            <div className="inline-flex w-full max-w-sm rounded-full border border-white/10 bg-white/5 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingMode('monthly')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  billingMode === 'monthly'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-white hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingMode('annual')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  billingMode === 'annual'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-white hover:text-white'
                }`}
              >
                Annual
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white">
                  Save
                </span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className={`relative flex h-full flex-col rounded-[2rem] border ${plan.border} bg-slate-900/70 p-6 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.45)]`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-6 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
                    {plan.badge}
                  </div>
                )}

                {!plan.featured && (
                  <div className="self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {plan.badge}
                  </div>
                )}

                <div className={`mt-4 rounded-[1.6rem] bg-gradient-to-br ${plan.accent} p-5 text-white`}>
                  <p className="text-xs uppercase tracking-[0.22em] text-white">
                    {plan.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{plan.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-white">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-semibold">
                      {billingMode === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice !== '$0' && plan.monthlyPrice !== 'Custom' && (
                      <span className="pb-1 text-sm text-white">
                        / month
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white">
                    {plan.priceCaption}
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-7 text-white">
                      <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href={plan.ctaHref}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${plan.button}`}
                  >
                    {plan.ctaLabel}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {includedHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-7 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.45)]"
              >
                <div className="inline-flex rounded-2xl bg-emerald-500/15 p-3 text-white">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="relative z-10 border-y border-white/10 bg-[linear-gradient(180deg,#071411_0%,#0c1f19_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Compare
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              See what increases as the operating complexity increases.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white">
              The table below keeps the tradeoffs explicit, so you can choose a tier based on real
              workflow needs rather than generic marketing language.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <div className="min-w-[860px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.55)]">
              <div className="grid grid-cols-[1.2fr_repeat(4,minmax(0,1fr))] border-b border-white/10 bg-slate-950 text-sm font-semibold text-white">
                <div className="px-5 py-4 text-white">Capability</div>
                {plans.map((plan) => (
                  <div key={plan.name} className="px-5 py-4 text-center">
                    {plan.name}
                  </div>
                ))}
              </div>

              {comparisonRows.map((row, rowIndex) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.2fr_repeat(4,minmax(0,1fr))] ${
                    rowIndex !== comparisonRows.length - 1 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <div className="px-5 py-4 text-sm font-medium text-white">{row.label}</div>
                  {row.values.map((value, valueIndex) => (
                    <div
                      key={`${row.label}-${valueIndex}`}
                      className="flex items-center justify-center px-5 py-4 text-center text-sm text-white"
                    >
                      {typeof value === 'boolean' ? (
                        value ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-white">
                            <Check className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                            <Minus className="h-4 w-4" />
                          </span>
                        )
                      ) : (
                        <span className="font-medium text-white">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The questions that usually matter before a decision gets made.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white">
              Pricing pages should resolve uncertainty. These answers focus on adoption, depth of
              insight, billing shape, and what changes when a team grows.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_55px_-45px_rgba(15,23,42,0.45)]"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                      View
                    </span>
                  </div>
                </summary>
                <p className="mt-4 text-sm leading-7 text-white">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_100%)] px-8 py-10 text-white shadow-[0_45px_110px_-55px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                Next step
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Start small, or map the full rollout if you already know the operating shape.
              </h2>
              <p className="mt-4 text-base leading-7 text-white">
                The page now gives `/pricing` a complete product story: plan framing, detailed
                pricing, comparison logic, FAQs, and direct routes into sign-up or contact.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-white sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} FinSight. Pricing aligned to portfolio operating depth.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/auth" className="transition-colors hover:text-white">
              Log In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
