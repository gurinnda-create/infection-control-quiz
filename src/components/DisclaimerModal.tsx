"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-black/5">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                ご利用上の注意
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Disclaimer
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            技術は日進月歩であるため、本アプリによるAI画像編集防止機能は、
                            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                                必ずしもすべてのAI編集を不可能にするものではありません。
                            </strong>
                            <br />
                            <br />
                            将来的なAI技術の進化により、この保護が無効化される可能性があることをご理解の上ご利用ください。
                        </p>
                    </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-4 flex justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-colors"
                    >
                        理解して利用を開始する
                    </button>
                </div>
            </div>
        </div>
    );
}
