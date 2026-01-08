"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Save, ShieldCheck, RefreshCw, FileImage, Download } from "lucide-react";
import { applyInvisibleNoise } from "@/utils/noise";
import { EXTENSION_MAP, REVERSE_MAP, getMimeType } from "@/utils/formats";
import heic2any from "heic2any";
import UTIF from "utif";

export default function ImageProcessor() {
    const [file, setFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // To show processed result
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProtected, setIsProtected] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [originalUrl, previewUrl]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setIsProtected(false);

            // Handle special formats loading
            const ext = selectedFile.name.split(".").pop()?.toLowerCase();

            try {
                if (ext === "heic" || ext === "heif") {
                    const convertedBlob = await heic2any({ blob: selectedFile, toType: "image/jpeg" });
                    const url = URL.createObjectURL(Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob);
                    setOriginalUrl(url);
                } else if (ext === "tiff" || ext === "tif") {
                    // UTIF handling
                    const buffer = await selectedFile.arrayBuffer();
                    const ifds = UTIF.decode(buffer);
                    UTIF.decodeImage(buffer, ifds[0]);
                    const rgba = UTIF.toRGBA8(ifds[0]);
                    // Create canvas to convert RGBA to Blob URL
                    const c = document.createElement("canvas");
                    c.width = ifds[0].width;
                    c.height = ifds[0].height;
                    const ctx = c.getContext("2d");
                    if (ctx) {
                        const imgData = new ImageData(new Uint8ClampedArray(rgba), c.width, c.height);
                        ctx.putImageData(imgData, 0, 0);
                        const url = c.toDataURL("image/png");
                        setOriginalUrl(url);
                    }
                } else {
                    // Standard formats
                    const url = URL.createObjectURL(selectedFile);
                    setOriginalUrl(url);
                }
            } catch (err) {
                console.error("Error loading file:", err);
                alert("画像の読み込みに失敗しました。");
            }
        }
    };

    const processImage = async () => {
        if (!originalUrl || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = originalUrl;

        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(img, 0, 0);

                // Apply Noise
                applyInvisibleNoise(ctx, canvas.width, canvas.height, 10); // Intensity 10

                // Update Preview
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setPreviewUrl(url);
                        setIsProtected(true);
                    }
                    setIsProcessing(false);
                }, getMimeType(file?.name || "image.png"));
            }
        };

        img.onerror = () => {
            setIsProcessing(false);
            alert("画像の処理中にエラーが発生しました。");
        }
    };

    const saveImage = () => {
        if (!previewUrl || !file) return;

        const link = document.createElement("a");
        link.href = previewUrl;

        // Determine extension
        const originalExt = file.name.split(".").pop()?.toLowerCase() || "png";
        // Check if browser supports saving as original extension (e.g. can't save as .heic natively usually)
        // We try to keep the name extension, but the MIME type in toBlob might be png/jpeg.
        // If we name it .heic but content is jpeg, it works in some viewers but is technically wrong.
        // Requirements: "Save extension depends on original".
        // I will construct the filename with the original extension.

        const baseName = file.name.substring(0, file.name.lastIndexOf("."));
        link.download = `${baseName}_protected.${originalExt}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
            {/* Upload Area */}
            {!originalUrl ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center cursor-pointer hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors bg-zinc-50 dark:bg-zinc-900/50"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.gif,.webp,.tiff,.tif,.svg,.heif,.heic,.bmp"
                    />
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Upload className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Click to upload image</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                JPG, PNG, HEIC, TIFF, WebP, etc.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Preview Area */}
                    <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
                        <img
                            src={isProtected && previewUrl ? previewUrl : originalUrl}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain"
                        />

                        {isProtected && (
                            <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm shadow-sm">
                                <ShieldCheck className="h-4 w-4" />
                                Protected
                            </div>
                        )}
                    </div>

                    {/* Hidden Canvas for Processing */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Controls */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {!isProtected ? (
                            <button
                                onClick={processImage}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
                            >
                                {isProcessing ? (
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                ) : (
                                    <ShieldCheck className="h-5 w-5" />
                                )}
                                {isProcessing ? "Processing..." : "Protect Image"}
                            </button>
                        ) : (
                            <button
                                onClick={saveImage}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
                            >
                                <Download className="h-5 w-5" />
                                Save Protected Image
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setFile(null);
                                setOriginalUrl(null);
                                setPreviewUrl(null);
                                setIsProtected(false);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            Open Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
