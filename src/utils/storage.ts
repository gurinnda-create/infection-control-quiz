"use client";

export type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  reference: string;
};

export type QuizResult = {
  questionId: number;
  isCorrect: boolean;
  timestamp: number;
};

export type UserStats = {
  totalAttempts: number;
  totalCorrect: number;
  questionStats: Record<number, { attempts: number; correct: number }>;
};

const STORAGE_KEY = 'infection_control_quiz_stats';

export const saveQuizResult = (results: QuizResult[]) => {
  if (typeof window === 'undefined') return;

  const currentStats = getStats();

  results.forEach(result => {
    currentStats.totalAttempts += 1;
    if (result.isCorrect) {
      currentStats.totalCorrect += 1;
    }

    if (!currentStats.questionStats[result.questionId]) {
      currentStats.questionStats[result.questionId] = { attempts: 0, correct: 0 };
    }

    currentStats.questionStats[result.questionId].attempts += 1;
    if (result.isCorrect) {
      currentStats.questionStats[result.questionId].correct += 1;
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStats));
};

export const getStats = (): UserStats => {
  if (typeof window === 'undefined') {
    return { totalAttempts: 0, totalCorrect: 0, questionStats: {} };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { totalAttempts: 0, totalCorrect: 0, questionStats: {} };
  }

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stats", e);
    return { totalAttempts: 0, totalCorrect: 0, questionStats: {} };
  }
};

export const getIncorrectQuestionsIds = (): number[] => {
  const stats = getStats();
  const incorrectIds: number[] = [];

  Object.entries(stats.questionStats).forEach(([id, stat]) => {
    // 一度でも間違えたことがある、または正解率が100%でない問題を抽出するロジック
    // ここでは「最後に間違えた」ではなく「過去に間違えたことがある」問題とします
    // 要件: "間違えた問題のみで問題集を作成できる" -> 過去に一度でも間違えた または 正解率が低い？
    // シンプルに: 正解数 < トライ数 (つまり一度でも間違えている)
    if (stat.correct < stat.attempts) {
      incorrectIds.push(Number(id));
    }
  });

  return incorrectIds;
};

export const clearStats = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
