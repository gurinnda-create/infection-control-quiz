"use client";

import React, { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import { getStats, getIncorrectQuestionsIds, Question, UserStats } from '../utils/storage';
import QuizSettings, { QuizConfig } from '../components/QuizSettings';
import QuizGame from '../components/QuizGame';
import ResultView from '../components/ResultView';
import { Trophy, Activity, AlertTriangle, Book, Play } from 'lucide-react';

type ViewState = 'home' | 'settings' | 'game' | 'result';

export default function Home() {
    const [view, setView] = useState<ViewState>('home');
    const [stats, setStats] = useState<UserStats | null>(null);
    const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
    const [gameResults, setGameResults] = useState<any[]>([]); // ResultView will handle fetching results via storage or props, but we can pass them. Actually storage handles saving. ResultView might need props.
    // Wait, QuizGame saves to storage. ResultView just needs to know what just happened.
    // We can pass the results from QuizGame to ResultView via state here.
    const [lastGameResults, setLastGameResults] = useState<any[]>([]);

    useEffect(() => {
        // Client-side only
        setStats(getStats());
    }, [view]); // Refresh stats when view changes (e.g. coming back from game)

    const handleStartRequest = () => {
        setView('settings');
    };

    const handleStartGame = (config: QuizConfig) => {
        let selectedQuestions: Question[] = [];

        if (config.mode === 'incorrect') {
            const incorrectIds = getIncorrectQuestionsIds();
            selectedQuestions = questionsData.filter(q => incorrectIds.includes(q.id)) as Question[];
        } else {
            // All questions
            selectedQuestions = [...questionsData] as Question[];
        }

        // Shuffle
        selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

        // Slice to count
        if (selectedQuestions.length > config.questionCount) {
            selectedQuestions = selectedQuestions.slice(0, config.questionCount);
        }

        setGameQuestions(selectedQuestions);
        setView('game');
    };

    const handleGameComplete = () => {
        // Results are handled by QuizGame and passed to onComplete.
        setView('result');
    };

    const correctRate = stats && stats.totalAttempts > 0
        ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
        : 0;

    if (view === 'game') {
        return (
            <main className="min-h-screen p-4 md:p-8 bg-background text-foreground flex flex-col items-center justify-center">
                <QuizGame
                    questions={gameQuestions}
                    onComplete={(results: any) => {
                        setLastGameResults(results);
                        setView('result');
                    }}
                    onExit={() => setView('home')}
                />
            </main>
        )
    }

    if (view === 'settings') {
        return (
            <main className="min-h-screen p-4 md:p-8 bg-background text-foreground flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl mb-8 flex items-center justify-between animate-fade-in">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h1 className="text-2xl font-bold">クイズ設定</h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
                <QuizSettings
                    onStart={handleStartGame}
                    totalQuestionsAvailable={(questionsData as Question[]).length}
                />
            </main>
        )
    }

    if (view === 'result') {
        return (
            <main className="min-h-screen p-4 md:p-8 bg-background text-foreground flex flex-col items-center justify-center">
                <ResultView
                    results={lastGameResults}
                    questions={gameQuestions}
                    onRetry={() => setView('settings')}
                    onHome={() => setView('home')}
                />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
                <header className="mb-12 text-center">
                    <div className="inline-block p-3 rounded-2xl bg-white shadow-sm mb-4 border border-slate-100">
                        <Activity className="text-primary w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        感染認定看護師<br className="md:hidden" />対策ドリル
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        CDCガイドライン・基礎から学ぶ医療関連感染対策準拠
                    </p>
                </header>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="mb-2 p-3 bg-blue-50 text-blue-600 rounded-full">
                            <Trophy size={24} />
                        </div>
                        <div className="text-3xl font-bold mb-1">{correctRate}<span className="text-lg">%</span></div>
                        <div className="text-sm text-muted-foreground font-medium">通算正解率</div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="mb-2 p-3 bg-emerald-50 text-emerald-600 rounded-full">
                            <Book size={24} />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.totalCorrect || 0}</div>
                        <div className="text-sm text-muted-foreground font-medium">正解数</div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="mb-2 p-3 bg-amber-50 text-amber-600 rounded-full">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="text-3xl font-bold mb-1">{getIncorrectQuestionsIds().length}</div>
                        <div className="text-sm text-muted-foreground font-medium">要復習問題</div>
                    </div>
                </div>

                {/* Main Action */}
                <div className="flex justify-center">
                    <button
                        onClick={handleStartRequest}
                        className="btn-primary group relative inline-flex items-center justify-center px-8 py-5 text-xl font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <span className="mr-3">問題集をスタート</span>
                        <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" />

                        {/* Pulse effect */}
                        <span className="absolute -inset-1 rounded-full bg-primary/30 opacity-0 group-hover:opacity-100 animate-ping" />
                    </button>
                </div>

                {/* Footer info using simple text */}
                <div className="mt-20 text-center text-sm text-muted-foreground">
                    <p className="mb-2">全500問収録（予定）</p>
                    <p>Last Activity: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </main>
    );
}

// Helper icon
function ArrowLeft({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}
