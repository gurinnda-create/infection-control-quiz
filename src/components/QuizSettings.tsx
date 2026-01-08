"use client";

import React, { useState } from 'react';
import { getIncorrectQuestionsIds } from '../utils/storage';
import { BookOpen, AlertCircle, PlayCircle, History, CheckCircle } from 'lucide-react';

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
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mode Selection */}
                <div
                    onClick={() => setMode('all')}
                    className={`cursor-pointer group relative p-6 rounded-2xl border-2 transition-all duration-300 ${mode === 'all'
                            ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                        }`}
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-xl ${mode === 'all' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold">通常モード</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">全{totalQuestionsAvailable}問からランダムに出題します。</p>
                    {mode === 'all' && (
                        <div className="absolute top-4 right-4 text-primary">
                            <CheckCircle size={20} />
                        </div>
                    )}
                </div>

                <div
                    onClick={() => hasIncorrectQuestions && setMode('incorrect')}
                    className={`cursor-pointer group relative p-6 rounded-2xl border-2 transition-all duration-300 ${mode === 'incorrect'
                            ? 'border-warning bg-warning/5 shadow-lg scale-[1.02]'
                            : hasIncorrectQuestions
                                ? 'border-border bg-card hover:border-warning/50 hover:bg-accent/50'
                                : 'border-border bg-secondary/10 opacity-60 cursor-not-allowed'
                        }`}
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-xl ${mode === 'incorrect' ? 'bg-warning text-white' : 'bg-accent text-muted-foreground group-hover:bg-warning/20 group-hover:text-warning'}`}>
                            <History size={24} />
                        </div>
                        <h3 className="text-lg font-bold">復習モード</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">過去に間違えた問題（{incorrectIds.length}問）のみ出題します。</p>
                    {mode === 'incorrect' && (
                        <div className="absolute top-4 right-4 text-warning">
                            <CheckCircle size={20} />
                        </div>
                    )}
                    {!hasIncorrectQuestions && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-2xl">
                            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">対象問題なし</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Question Count Selection */}
            <div className="glass-panel p-8 rounded-3xl space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <AlertCircle className="text-primary" size={24} />
                    <span>出題数を選択</span>
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    {[5, 10, 30].map((count) => (
                        <button
                            key={count}
                            onClick={() => setQuestionCount(count)}
                            className={`p-4 rounded-xl font-bold text-lg transition-all duration-200 ${questionCount === count
                                    ? 'bg-primary text-white shadow-md transform scale-105'
                                    : 'bg-accent hover:bg-accent/80 text-foreground'
                                }`}
                        >
                            {count}問
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
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
