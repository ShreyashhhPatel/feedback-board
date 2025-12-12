'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Building2,
  ExternalLink,
  Settings,
  Trash2,
  MessageSquare,
  BarChart3,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Button, Card, Modal, Input, Textarea } from '@/components/ui';
import { useFeedback } from '@/context/FeedbackContext';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function DashboardPage() {
  const { state, createCompany, createBoard, deleteCompany, deleteBoard, getBoardsByCompany, getFeedbacksByBoard } = useFeedback();
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyForm, setCompanyForm] = useState({ name: '', description: '', website: '' });
  const [boardForm, setBoardForm] = useState({ name: '', description: '' });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyForm.name) {
      createCompany({
        name: companyForm.name,
        slug: slugify(companyForm.name),
        description: companyForm.description,
        website: companyForm.website,
      });
      setCompanyForm({ name: '', description: '', website: '' });
      setIsCompanyModalOpen(false);
    }
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardForm.name && selectedCompanyId) {
      createBoard({
        name: boardForm.name,
        slug: slugify(boardForm.name),
        description: boardForm.description,
        companyId: selectedCompanyId,
        isPublic: true,
        allowAnonymous: true,
      });
      setBoardForm({ name: '', description: '' });
      setIsBoardModalOpen(false);
      setSelectedCompanyId(null);
    }
  };

  const openBoardModal = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsBoardModalOpen(true);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
                Dashboard
              </h1>
              <p className="text-text-secondary mt-1">
                Manage your companies and feedback boards
              </p>
            </div>
            <Button
              onClick={() => setIsCompanyModalOpen(true)}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              New Company
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.companies.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No Companies Yet
            </h2>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Create your first company to start collecting feedback from your users.
              Each company can have multiple feedback boards.
            </p>
            <Button
              onClick={() => setIsCompanyModalOpen(true)}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Create Your First Company
            </Button>
          </motion.div>
        ) : (
          /* Companies List */
          <div className="space-y-8">
            {state.companies.map((company, companyIndex) => {
              const boards = getBoardsByCompany(company.id);
              const totalFeedbacks = boards.reduce(
                (acc, board) => acc + getFeedbacksByBoard(board.id).length,
                0
              );

              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: companyIndex * 0.1 }}
                >
                  <Card padding="none" className="overflow-hidden">
                    {/* Company Header */}
                    <div className="p-6 border-b border-border-primary bg-bg-tertiary">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {company.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-text-primary">
                              {company.name}
                            </h2>
                            {company.description && (
                              <p className="text-sm text-text-secondary mt-0.5">
                                {company.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-text-tertiary flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {boards.length} boards
                              </span>
                              <span className="text-xs text-text-tertiary flex items-center gap-1">
                                <BarChart3 className="w-3.5 h-3.5" />
                                {totalFeedbacks} feedbacks
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          <button
                            onClick={() => deleteCompany(company.id)}
                            className="p-2 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Boards */}
                    <div className="p-6">
                      {boards.length === 0 ? (
                        <div className="text-center py-8 bg-bg-tertiary rounded-xl">
                          <p className="text-text-tertiary mb-4">
                            No boards yet for this company
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openBoardModal(company.id)}
                            leftIcon={<Plus className="w-4 h-4" />}
                          >
                            Create Board
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-text-primary">
                              Feedback Boards
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openBoardModal(company.id)}
                              leftIcon={<Plus className="w-4 h-4" />}
                            >
                              Add Board
                            </Button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {boards.map((board) => {
                              const feedbacks = getFeedbacksByBoard(board.id);
                              const totalVotes = feedbacks.reduce(
                                (acc, f) => acc + f.upvotes.length,
                                0
                              );

                              return (
                                <motion.div
                                  key={board.id}
                                  whileHover={{ y: -2 }}
                                  className="group"
                                >
                                  <div className="p-4 bg-bg-tertiary rounded-xl border border-border-primary hover:border-primary-300 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                      <h4 className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                                        {board.name}
                                      </h4>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          deleteBoard(board.id);
                                        }}
                                        className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {board.description && (
                                      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                                        {board.description}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-text-tertiary mb-4">
                                      <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {feedbacks.length}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {totalVotes} votes
                                      </span>
                                    </div>

                                    <div className="flex gap-2">
                                      <Link
                                        href={`/board/${company.slug}/${board.slug}`}
                                        className="flex-1"
                                      >
                                        <Button variant="secondary" size="sm" className="w-full">
                                          View Board
                                        </Button>
                                      </Link>
                                      <Link
                                        href={`/board/${company.slug}/${board.slug}/manage`}
                                      >
                                        <Button variant="ghost" size="sm">
                                          <Settings className="w-4 h-4" />
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      <Modal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title="Create New Company"
      >
        <form onSubmit={handleCreateCompany} className="space-y-5">
          <Input
            label="Company Name"
            placeholder="Acme Inc."
            value={companyForm.name}
            onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
            required
          />
          <Textarea
            label="Description (optional)"
            placeholder="What does your company do?"
            value={companyForm.description}
            onChange={(e) =>
              setCompanyForm({ ...companyForm, description: e.target.value })
            }
          />
          <Input
            label="Website (optional)"
            type="url"
            placeholder="https://example.com"
            value={companyForm.website}
            onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCompanyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Company</Button>
          </div>
        </form>
      </Modal>

      {/* Create Board Modal */}
      <Modal
        isOpen={isBoardModalOpen}
        onClose={() => {
          setIsBoardModalOpen(false);
          setSelectedCompanyId(null);
        }}
        title="Create New Board"
      >
        <form onSubmit={handleCreateBoard} className="space-y-5">
          <Input
            label="Board Name"
            placeholder="Feature Requests"
            value={boardForm.name}
            onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="What kind of feedback should users submit here?"
            value={boardForm.description}
            onChange={(e) => setBoardForm({ ...boardForm, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsBoardModalOpen(false);
                setSelectedCompanyId(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

