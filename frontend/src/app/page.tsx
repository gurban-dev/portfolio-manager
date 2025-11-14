'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BarChart3, Bell, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="
      min-h-screen bg-gradient-to-b from-slate-50
      to-slate-100 text-gray-800 flex flex-col
    ">
      {/* Navbar */}
      {/* <nav className="
        flex justify-between items-center
        px-8 py-4 shadow-sm bg-white/70
        backdrop-blur-md
      ">
        <h1 className="text-2xl font-bold text-slate-800">
          FinSight
        </h1>

        <div className="flex gap-4">
          <Link href="/auth/login"
            className="
              text-sm font-medium text-gray-700
              hover:text-slate-900
            "
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="
              px-4 py-2 rounded-xl bg-slate-800
              text-white text-sm font-semibold
              hover:bg-slate-700 transition-colors
            "
          >
            Get Started
          </Link>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="
        flex flex-col md:flex-row items-center
        justify-between px-8 md:px-16 py-20
        md:py-32 gap-12
      ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h2 className="
            text-4xl md:text-5xl font-extrabold
            mb-6 text-slate-900 leading-tight
          ">
            Smarter Finance Management with ESG Insights
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Monitor your investments, transactions, and sustainability performance in one unified
            dashboard. Empower your financial decisions with real-time analytics and responsible
            growth metrics.
          </p>

          <Link
            href="/auth/register"
            className="
              inline-flex items-center gap-2 px-6 py-3
              rounded-xl bg-slate-900 text-white
              font-semibold hover:bg-slate-800
              transition-colors
            "
          >
            Start for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center"
        >
          {/*
            hero-dashboard.webp is located in the public/ folder.
          
            Any file in the public/ folder is served at the root / of your site.

            You do not include public in the path when referencing it in src.
          */}
          <img
            src="/hero-dashboard.webp"
            alt="Finance dashboard illustration"
            className="
              w-full max-w-md rounded-2xl shadow-xl
            "
          />
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-20 px-8 md:px-16">
        <h3 className="text-3xl font-bold text-center mb-14 text-slate-900">
          Why Choose FinSight?
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BarChart3 className="w-10 h-10 text-slate-800" />}
            title="Unified Analytics"
            description="Visualize your accounts, transactions, and investment performance in a clean, modern dashboard."
          />

          <FeatureCard
            icon={<ShieldCheck className="w-10 h-10 text-slate-800" />}
            title="Secure by Design"
            description="Your data is protected with enterprise-grade encryption and session-based authentication."
          />

          <FeatureCard
            icon={<Bell className="w-10 h-10 text-slate-800" />}
            title="Real-Time Notifications"
            description="Stay informed about account changes, ESG alerts, and new financial insights instantly."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-gray-200 py-10 px-8 md:px-16">
        <div className="
          max-w-6xl mx-auto flex flex-col
          md:flex-row justify-between
          items-center gap-6
        ">
          <p className="text-sm">
            © {new Date().getFullYear()} FinSight. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link href="/auth/login" className="hover:text-white">Login</Link>
            <Link href="/auth/register" className="hover:text-white">Register</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="
        bg-slate-50 rounded-2xl p-8 text-center
        shadow-sm hover:shadow-md transition-shadow
      "
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-slate-900">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}