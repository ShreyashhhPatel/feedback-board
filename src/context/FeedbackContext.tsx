'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Board, Feedback, Company, User, Comment, FeedbackStatus, FeedbackCategory } from '@/types';

// ========================================
// State Types
// ========================================

interface AppState {
  companies: Company[];
  boards: Board[];
  feedbacks: Feedback[];
  comments: Comment[];
  currentUser: User | null;
  isLoading: boolean;
}

type Action =
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'UPDATE_FEEDBACK'; payload: Feedback }
  | { type: 'DELETE_FEEDBACK'; payload: string }
  | { type: 'TOGGLE_UPVOTE'; payload: { feedbackId: string; userId: string } }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'DELETE_COMMENT'; payload: string };

// ========================================
// Initial State
// ========================================

const initialState: AppState = {
  companies: [],
  boards: [],
  feedbacks: [],
  comments: [],
  currentUser: null,
  isLoading: true,
};

// ========================================
// Reducer
// ========================================

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_COMPANY':
      return { ...state, companies: [...state.companies, action.payload] };
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter((c) => c.id !== action.payload),
        boards: state.boards.filter((b) => {
          const company = state.companies.find((c) => c.id === action.payload);
          return company ? b.companyId !== company.id : true;
        }),
      };
    case 'ADD_BOARD':
      return { ...state, boards: [...state.boards, action.payload] };
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter((b) => b.id !== action.payload),
        feedbacks: state.feedbacks.filter((f) => f.boardId !== action.payload),
      };
    case 'ADD_FEEDBACK':
      return { ...state, feedbacks: [...state.feedbacks, action.payload] };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };
    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.filter((f) => f.id !== action.payload),
        comments: state.comments.filter((c) => c.feedbackId !== action.payload),
      };
    case 'TOGGLE_UPVOTE': {
      const { feedbackId, userId } = action.payload;
      return {
        ...state,
        feedbacks: state.feedbacks.map((f) => {
          if (f.id !== feedbackId) return f;
          const hasUpvoted = f.upvotes.includes(userId);
          return {
            ...f,
            upvotes: hasUpvoted
              ? f.upvotes.filter((id) => id !== userId)
              : [...f.upvotes, userId],
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    }
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.payload],
        feedbacks: state.feedbacks.map((f) =>
          f.id === action.payload.feedbackId
            ? { ...f, commentCount: f.commentCount + 1 }
            : f
        ),
      };
    case 'DELETE_COMMENT':
      const comment = state.comments.find((c) => c.id === action.payload);
      return {
        ...state,
        comments: state.comments.filter((c) => c.id !== action.payload),
        feedbacks: comment
          ? state.feedbacks.map((f) =>
              f.id === comment.feedbackId
                ? { ...f, commentCount: Math.max(0, f.commentCount - 1) }
                : f
            )
          : state.feedbacks,
      };
    default:
      return state;
  }
}

// ========================================
// Context
// ========================================

interface FeedbackContextType {
  state: AppState;
  // User actions
  login: (name: string, email: string) => void;
  logout: () => void;
  // Company actions
  createCompany: (data: Omit<Company, 'id' | 'ownerId' | 'createdAt'>) => Company;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  getCompanyBySlug: (slug: string) => Company | undefined;
  // Board actions
  createBoard: (data: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => Board;
  updateBoard: (board: Board) => void;
  deleteBoard: (id: string) => void;
  getBoardBySlug: (companySlug: string, boardSlug: string) => Board | undefined;
  getBoardsByCompany: (companyId: string) => Board[];
  // Feedback actions
  createFeedback: (data: {
    title: string;
    description: string;
    category: FeedbackCategory;
    boardId: string;
    authorName: string;
    authorEmail?: string;
  }) => Feedback;
  updateFeedback: (feedback: Feedback) => void;
  updateFeedbackStatus: (feedbackId: string, status: FeedbackStatus) => void;
  deleteFeedback: (id: string) => void;
  toggleUpvote: (feedbackId: string) => void;
  getFeedbacksByBoard: (boardId: string) => Feedback[];
  // Comment actions
  addComment: (data: { content: string; feedbackId: string; isOfficial?: boolean }) => Comment;
  deleteComment: (id: string) => void;
  getCommentsByFeedback: (feedbackId: string) => Comment[];
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

// ========================================
// Storage Keys
// ========================================

const STORAGE_KEYS = {
  companies: 'feedback-board-companies',
  boards: 'feedback-board-boards',
  feedbacks: 'feedback-board-feedbacks',
  comments: 'feedback-board-comments',
  user: 'feedback-board-user',
};

// ========================================
// Provider
// ========================================

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const companies = JSON.parse(localStorage.getItem(STORAGE_KEYS.companies) || '[]');
        const boards = JSON.parse(localStorage.getItem(STORAGE_KEYS.boards) || '[]');
        const feedbacks = JSON.parse(localStorage.getItem(STORAGE_KEYS.feedbacks) || '[]');
        const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.comments) || '[]');
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');

        dispatch({
          type: 'SET_STATE',
          payload: { companies, boards, feedbacks, comments, currentUser: user, isLoading: false },
        });
      } catch (error) {
        console.error('Error loading from storage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadFromStorage();
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(state.companies));
      localStorage.setItem(STORAGE_KEYS.boards, JSON.stringify(state.boards));
      localStorage.setItem(STORAGE_KEYS.feedbacks, JSON.stringify(state.feedbacks));
      localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(state.comments));
      if (state.currentUser) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }
  }, [state]);

  // ========================================
  // Actions
  // ========================================

  const login = (name: string, email: string) => {
    const user: User = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

  const createCompany = (data: Omit<Company, 'id' | 'ownerId' | 'createdAt'>): Company => {
    const company: Company = {
      ...data,
      id: uuidv4(),
      ownerId: state.currentUser?.id || 'anonymous',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMPANY', payload: company });
    return company;
  };

  const updateCompany = (company: Company) => {
    dispatch({ type: 'UPDATE_COMPANY', payload: company });
  };

  const deleteCompany = (id: string) => {
    dispatch({ type: 'DELETE_COMPANY', payload: id });
  };

  const getCompanyBySlug = (slug: string) => {
    return state.companies.find((c) => c.slug === slug);
  };

  const createBoard = (data: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Board => {
    const board: Board = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_BOARD', payload: board });
    return board;
  };

  const updateBoard = (board: Board) => {
    dispatch({
      type: 'UPDATE_BOARD',
      payload: { ...board, updatedAt: new Date().toISOString() },
    });
  };

  const deleteBoard = (id: string) => {
    dispatch({ type: 'DELETE_BOARD', payload: id });
  };

  const getBoardBySlug = (companySlug: string, boardSlug: string) => {
    const company = state.companies.find((c) => c.slug === companySlug);
    if (!company) return undefined;
    return state.boards.find((b) => b.companyId === company.id && b.slug === boardSlug);
  };

  const getBoardsByCompany = (companyId: string) => {
    return state.boards.filter((b) => b.companyId === companyId);
  };

  const createFeedback = (data: {
    title: string;
    description: string;
    category: FeedbackCategory;
    boardId: string;
    authorName: string;
    authorEmail?: string;
  }): Feedback => {
    const feedback: Feedback = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'under-review',
      boardId: data.boardId,
      authorId: state.currentUser?.id || 'anonymous',
      authorName: data.authorName || state.currentUser?.name || 'Anonymous',
      authorEmail: data.authorEmail || state.currentUser?.email,
      upvotes: state.currentUser ? [state.currentUser.id] : [],
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    return feedback;
  };

  const updateFeedback = (feedback: Feedback) => {
    dispatch({
      type: 'UPDATE_FEEDBACK',
      payload: { ...feedback, updatedAt: new Date().toISOString() },
    });
  };

  const updateFeedbackStatus = (feedbackId: string, status: FeedbackStatus) => {
    const feedback = state.feedbacks.find((f) => f.id === feedbackId);
    if (feedback) {
      dispatch({
        type: 'UPDATE_FEEDBACK',
        payload: { ...feedback, status, updatedAt: new Date().toISOString() },
      });
    }
  };

  const deleteFeedback = (id: string) => {
    dispatch({ type: 'DELETE_FEEDBACK', payload: id });
  };

  const toggleUpvote = (feedbackId: string) => {
    const userId = state.currentUser?.id || 'anonymous-' + Math.random().toString(36).substr(2, 9);
    dispatch({ type: 'TOGGLE_UPVOTE', payload: { feedbackId, userId } });
  };

  const getFeedbacksByBoard = (boardId: string) => {
    return state.feedbacks.filter((f) => f.boardId === boardId);
  };

  const addComment = (data: { content: string; feedbackId: string; isOfficial?: boolean }): Comment => {
    const comment: Comment = {
      id: uuidv4(),
      content: data.content,
      feedbackId: data.feedbackId,
      authorId: state.currentUser?.id || 'anonymous',
      authorName: state.currentUser?.name || 'Anonymous',
      isOfficial: data.isOfficial || false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: comment });
    return comment;
  };

  const deleteComment = (id: string) => {
    dispatch({ type: 'DELETE_COMMENT', payload: id });
  };

  const getCommentsByFeedback = (feedbackId: string) => {
    return state.comments.filter((c) => c.feedbackId === feedbackId);
  };

  const value: FeedbackContextType = {
    state,
    login,
    logout,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyBySlug,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardBySlug,
    getBoardsByCompany,
    createFeedback,
    updateFeedback,
    updateFeedbackStatus,
    deleteFeedback,
    toggleUpvote,
    getFeedbacksByBoard,
    addComment,
    deleteComment,
    getCommentsByFeedback,
  };

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

// ========================================
// Hook
// ========================================

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}

