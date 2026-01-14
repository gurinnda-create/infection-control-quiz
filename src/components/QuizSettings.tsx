"use client";

import React, { useState } from 'react';
import { getIncorrectQuestionsIds } from '../utils/storage';
import { BookOpen, AlertCircle, PlayCircle, History } from 'lucide-react';

type QuizMode = 'all' | 'incorrect';

export type QuizConfig = {
    questionCount: number;
    mode: QuizMode;
};

interface QuizSettingsProps {
    onStart: (config: QuizConfig) => void;
    totalQuestionsAvailable: number;
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ onStart, totalQuestionsAvailable }) => {
    const [questionCount, setQuestionCount] = useState<number>(5);
    const [mode, setMode] = useState<QuizMode>('all');

    const incorrectIds = getIncorrectQuestionsIds();
    const hasIncorrectQuestions = incorrectIds.length > 0;

    const handleStart = () => {
        onStart({ questionCount, mode });
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Mode Selection */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="text-primary" size={24} />
                    <span>出題モードを選択</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => setMode('all')}
                        className={`cursor-pointer group relative p-5 rounded-xl border-2 transition-all duration-200 ${mode === 'all'
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen size={20} className={mode === 'all' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className="font-bold">通常モード</span>
                        </div>
                        <p className="text-sm text-muted-foreground">全{totalQuestionsAvailable}問からランダムに出題します</p>
                    </div>

                    <div
                        onClick={() => hasIncorrectQuestions && setMode('incorrect')}
                        className={`cursor-pointer group relative p-5 rounded-xl border-2 transition-all duration-200 ${mode === 'incorrect'
                            ? 'border-warning bg-warning/5 shadow-md'
                            : hasIncorrectQuestions
                                ? 'border-border bg-card hover:border-warning/30 hover:bg-accent/30'
                                : 'border-border bg-secondary/10 opacity-60 cursor-not-allowed'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <History size={20} className={mode === 'incorrect' ? 'text-warning' : 'text-muted-foreground'} />
                            <span className="font-bold">復習モード</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{hasIncorrectQuestions ? `${incorrectIds.length}問の要復習問題` : '復習対象なし'}</p>
                    </div>
                </div>
            </div>

            {/* Question Count Selection */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <AlertCircle className="text-primary" size={24} />
                    <span>出題数を選択</span>
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    {[5, 10, 30].map((count) => (
                        <button
                            key={count}
                            onClick={() => setQuestionCount(count)}
                            className={`p-3 rounded-xl font-bold text-lg transition-all duration-200 ${questionCount === count
                                ? 'shadow-md transform scale-105'
                                : 'bg-accent hover:bg-accent/80 text-foreground'
                                }`}
                            style={questionCount === count ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : {}}
                        >
                            {count}問
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <div className="text-center pt-2">
                <button
                    onClick={handleStart}
                    className="btn-primary text-xl px-12 py-4 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto group"
                >
                    <span>テストを開始する</span>
                    <PlayCircle size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default QuizSettings;
