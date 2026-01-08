export function applyInvisibleNoise(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 8) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // High-frequency noise pattern
    // We iterate through every pixel
    for (let i = 0; i < data.length; i += 4) {
        // Skip fully transparent pixels if desired, though noise on alpha is usually weird
        if (data[i + 3] === 0) continue;

        // Apply noise to R, G, B
        // Intensity defines the max change. e.g. 5 means +/- 5.
        // Human eye characteristic: Blue channel is least sensitive, Green is most.
        // However, for AI disruption, uniform high-freq noise is effective.

        const noiseR = (Math.random() - 0.5) * intensity;
        const noiseG = (Math.random() - 0.5) * intensity;
        const noiseB = (Math.random() - 0.5) * intensity;

        data[i] = clamp(data[i] + noiseR);     // R
        data[i + 1] = clamp(data[i + 1] + noiseG); // G
        data[i + 2] = clamp(data[i + 2] + noiseB); // B
        // Alpha (data[i+3]) is left untouched
    }

    ctx.putImageData(imageData, 0, 0);
}

function clamp(value: number) {
    return Math.max(0, Math.min(255, value));
}
