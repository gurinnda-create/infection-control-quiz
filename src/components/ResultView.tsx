"use client";

import React from 'react';
import { QuizResult, Question } from '../utils/storage';
import { Trophy, ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface ResultViewProps {
    results: QuizResult[];
    questions: Question[];
    onRetry: () => void;
    onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ results, questions, onRetry, onHome }) => {
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const correctRate = Math.round((correctCount / totalCount) * 100);

    return (
        <div className="max-w-3xl mx-auto animate-fade-in text-center py-10">
            <div className="mb-8">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                    <Trophy size={48} className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground">おつかれさまでした</p>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-12">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="text-muted-foreground text-sm font-medium mb-1">Score</div>
                    <div className="text-4xl font-bold text-foreground">
                        {correctCount}<span className="text-xl text-muted-foreground">/{totalCount}</span>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="text-muted-foreground text-sm font-medium mb-1">Accuracy</div>
                    <div className={`text-4xl font-bold ${correctRate >= 80 ? 'text-success' : correctRate >= 60 ? 'text-warning' : 'text-error'}`}>
                        {correctRate}<span className="text-xl">%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
                <button onClick={onRetry} className="w-full btn-primary flex items-center justify-center gap-2">
                    <RotateCcw size={20} />
                    <span>もう一度挑戦する</span>
                </button>
                <button onClick={onHome} className="w-full btn-outline flex items-center justify-center gap-2">
                    <ArrowLeft size={20} />
                    <span>ホームへ戻る</span>
                </button>
            </div>

            <div className="mt-16 text-left">
                <h3 className="text-xl font-bold mb-6 px-2">振り返り</h3>
                <div className="space-y-4">
                    {results.map((result, idx) => {
                        const question = questions.find(q => q.id === result.questionId);
                        if (!question) return null;
                        return (
                            <div key={idx} className={`p-4 rounded-xl border flex items-start gap-4 ${result.isCorrect ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}>
                                <div className="mt-1">
                                    {result.isCorrect ? <CheckCircle className="text-success" size={20} /> : <XCircle className="text-error" size={20} />}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground mb-1">{question.question}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {question.category}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResultView;
