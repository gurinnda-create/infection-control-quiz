export const SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/tiff",
    "image/svg+xml",
    "image/bmp",
    "image/heic",
    "image/heif",
];

export const EXTENSION_MAP: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    tiff: "image/tiff",
    tif: "image/tiff",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    heic: "image/heic",
    heif: "image/heif",
};

export const REVERSE_MAP: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/tiff": "tiff",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/x-icon": "ico"
};

export function getMimeType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return EXTENSION_MAP[ext] || "image/png"; // Default fallback
}
