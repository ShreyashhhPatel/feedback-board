'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  LayoutDashboard,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { Button, Modal, Input } from '@/components/ui';
import { useFeedback } from '@/context/FeedbackContext';

export function Navbar() {
  const { state, login, logout } = useFeedback();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.name && loginForm.email) {
      login(loginForm.name, loginForm.email);
      setIsLoginModalOpen(false);
      setLoginForm({ name: '', email: '' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md"
              >
                <MessageSquare className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold font-display gradient-text">
                FeedbackFlow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors animated-underline"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              {state.currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                      {state.currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {state.currentUser.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsLoginModalOpen(true)} size="sm">
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border-primary bg-bg-secondary"
            >
              <div className="px-4 py-4 space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-full"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {state.currentUser ? (
                  <div className="pt-4 border-t border-border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                        {state.currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{state.currentUser.name}</p>
                        <p className="text-sm text-text-tertiary">{state.currentUser.email}</p>
                      </div>
                    </div>
                    <Button variant="secondary" onClick={logout} className="w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsLoginModalOpen(true)} className="w-full">
                    Sign In
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Welcome Back"
        size="sm"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Your Name"
            placeholder="John Doe"
            value={loginForm.name}
            onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
          <p className="text-center text-sm text-text-tertiary">
            No account needed - just enter your details to get started
          </p>
        </form>
      </Modal>
    </>
  );
}

