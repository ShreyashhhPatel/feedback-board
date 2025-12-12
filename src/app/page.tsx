'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageSquare,
  ChevronUp,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui';

const features = [
  {
    icon: MessageSquare,
    title: 'Collect Feedback',
    description:
      'Let your users share ideas, report bugs, and request features in one central place.',
  },
  {
    icon: ChevronUp,
    title: 'Prioritize with Votes',
    description:
      'Users upvote the features they care about most, helping you prioritize your roadmap.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description:
      'Keep users informed with status updates from Under Review to Completed.',
  },
  {
    icon: Users,
    title: 'Build Community',
    description:
      'Engage with your users through comments and show them their voice matters.',
  },
];

const benefits = [
  'Unlimited feedback boards',
  'Real-time voting system',
  'Status tracking & roadmap',
  'Comment discussions',
  'Anonymous submissions',
  'Custom branding',
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-32 left-[15%] w-16 h-16 bg-primary-500/10 rounded-2xl blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-48 right-[20%] w-24 h-24 bg-accent-500/10 rounded-full blur-sm"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Launch your feedback board in minutes
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-text-primary leading-tight"
            >
              Turn User Feedback Into
              <br />
              <span className="gradient-text">Your Competitive Edge</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto"
            >
              Create beautiful feedback boards where your users can share ideas,
              vote on features, and help you build the product they actually want.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg">
                  View Demo Board
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-text-tertiary"
            >
              {['No credit card required', 'Setup in 2 minutes', 'Free forever'].map(
                (text, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {text}
                  </span>
                )
              )}
            </motion.div>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 lg:mt-24 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Browser Frame */}
              <div className="bg-bg-secondary rounded-2xl shadow-2xl border border-border-primary overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-bg-tertiary">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-bg-primary rounded-lg px-4 py-1.5 text-sm text-text-tertiary text-center max-w-md mx-auto">
                      feedbackflow.app/acme/feature-requests
                    </div>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 w-48 bg-gradient-to-r from-primary-200 to-primary-100 rounded-lg" />
                      <div className="h-4 w-64 bg-bg-tertiary rounded mt-2" />
                    </div>
                    <div className="h-10 w-32 bg-primary-500 rounded-lg" />
                  </div>

                  {/* Feedback Cards */}
                  {[
                    { votes: 47, color: 'bg-green-100' },
                    { votes: 32, color: 'bg-blue-100' },
                    { votes: 28, color: 'bg-yellow-100' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex gap-4 p-4 bg-bg-tertiary rounded-xl"
                    >
                      <div
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl ${item.color}`}
                      >
                        <ChevronUp className="w-5 h-5 text-text-primary" />
                        <span className="text-lg font-bold text-text-primary">{item.votes}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-bg-primary rounded" />
                        <div className="h-3 w-full bg-bg-primary rounded" />
                        <div className="h-3 w-2/3 bg-bg-primary rounded" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full opacity-20 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-bg-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
              Everything You Need to
              <span className="gradient-text"> Close the Loop</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              A complete feedback management system that helps you understand your users
              and build products they love.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-secondary p-6 rounded-2xl border border-border-primary hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Simple & Powerful
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
                Get Started in Minutes,
                <br />
                <span className="gradient-text">Not Hours</span>
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                No complex setup, no steep learning curve. Create your feedback board,
                share the link with your users, and start collecting valuable insights
                immediately.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-primary text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/dashboard">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Create Your Board
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Steps Illustration */}
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Create Your Board',
                    desc: 'Name your board and customize settings',
                  },
                  {
                    step: '2',
                    title: 'Share the Link',
                    desc: 'Send your unique URL to users',
                  },
                  {
                    step: '3',
                    title: 'Collect Feedback',
                    desc: 'Watch insights roll in automatically',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4 p-5 bg-bg-secondary rounded-2xl border border-border-primary shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{item.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Ready to Build What Users Actually Want?
            </h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
              Join thousands of product teams using FeedbackFlow to collect,
              organize, and act on user feedback.
            </p>
            <div className="mt-10">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Collecting Feedback
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-bg-secondary border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold font-display gradient-text">
                FeedbackFlow
              </span>
            </div>
            <p className="text-sm text-text-tertiary">
              © {new Date().getFullYear()} FeedbackFlow. Built with ❤️ for product teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
