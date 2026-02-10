import type { GenerationRun, GenerationSettings, PBRMapSet } from '../../types/generation';
import { applyCreativeFreedomB } from './creativeFreedomB';

const WIDTH = 3840;
const HEIGHT = 2160;

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function generateSeamlessNoise(
  width: number,
  height: number,
  seed: number,
  scale: number,
  octaves: number = 4
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const random = seededRandom(seed);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = 0;
      let amplitude = 1;
      let frequency = scale;
      let maxValue = 0;

      for (let o = 0; o < octaves; o++) {
        const sampleX = (x / width) * frequency;
        const sampleY = (y / height) * frequency;

        const noise = Math.sin(sampleX * Math.PI * 2 + random() * 10) * 
                     Math.cos(sampleY * Math.PI * 2 + random() * 10);
        
        value += noise * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      value = (value / maxValue + 1) * 0.5;
      const idx = (y * width + x) * 4;
      const gray = Math.floor(value * 255);
      data[idx] = gray;
      data[idx + 1] = gray;
      data[idx + 2] = gray;
      data[idx + 3] = 255;
    }
  }

  return imageData;
}

function generateAlbedo(seed: number, variation: number, creativeFreedom: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  const baseSeed = applyCreativeFreedomB(seed, variation, creativeFreedom);
  const noise = generateSeamlessNoise(WIDTH, HEIGHT, baseSeed, 4 + variation / 20, 6);
  ctx.putImageData(noise, 0, 0);

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  const hue = (baseSeed % 360);
  gradient.addColorStop(0, `hsla(${hue}, 40%, 45%, 0.3)`);
  gradient.addColorStop(1, `hsla(${(hue + 30) % 360}, 50%, 55%, 0.3)`);
  ctx.fillStyle = gradient;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  return canvas.toDataURL('image/png');
}

function generateNormal(seed: number, variation: number, creativeFreedom: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  const baseSeed = applyCreativeFreedomB(seed + 1000, variation, creativeFreedom);
  const noise = generateSeamlessNoise(WIDTH, HEIGHT, baseSeed, 8 + variation / 15, 5);
  ctx.putImageData(noise, 0, 0);

  ctx.fillStyle = 'rgba(128, 128, 255, 0.5)';
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  return canvas.toDataURL('image/png');
}

function generateRoughness(seed: number, variation: number, creativeFreedom: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  const baseSeed = applyCreativeFreedomB(seed + 2000, variation, creativeFreedom);
  const noise = generateSeamlessNoise(WIDTH, HEIGHT, baseSeed, 6 + variation / 25, 4);
  ctx.putImageData(noise, 0, 0);

  return canvas.toDataURL('image/png');
}

function generateFluid(seed: number, variation: number, creativeFreedom: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  const baseSeed = applyCreativeFreedomB(seed + 3000, variation, creativeFreedom);
  const noise = generateSeamlessNoise(WIDTH, HEIGHT, baseSeed, 10 + variation / 10, 3);
  ctx.putImageData(noise, 0, 0);

  ctx.fillStyle = 'rgba(0, 100, 200, 0.2)';
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  return canvas.toDataURL('image/png');
}

function generateMetallic(seed: number, variation: number, creativeFreedom: boolean): string {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  const baseSeed = applyCreativeFreedomB(seed + 4000, variation, creativeFreedom);
  const noise = generateSeamlessNoise(WIDTH, HEIGHT, baseSeed, 5 + variation / 30, 3);
  ctx.putImageData(noise, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function generateTileablePBR(settings: GenerationSettings): Promise<GenerationRun> {
  const { category, seed, variation, creativeFreedom, description } = settings;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const maps: PBRMapSet = {
    albedo: generateAlbedo(seed, variation, creativeFreedom),
    normal: generateNormal(seed, variation, creativeFreedom),
    roughness: generateRoughness(seed, variation, creativeFreedom),
    fluid: generateFluid(seed, variation, creativeFreedom),
    metallic: generateMetallic(seed, variation, creativeFreedom),
  };

  const run: GenerationRun = {
    runId: `${Date.now()}-${seed}`,
    timestamp: Date.now(),
    category,
    seed,
    variation,
    creativeFreedom,
    description,
    maps,
  };

  return run;
}
