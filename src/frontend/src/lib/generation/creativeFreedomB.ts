export const CREATIVE_FREEDOM_B_PARAMS = {
  temperature: 1.5,
  topP: 0.90,
};

export function applyCreativeFreedomB(
  seed: number,
  variation: number,
  enabled: boolean
): number {
  if (!enabled) {
    return seed + Math.floor(variation * 100);
  }

  const tempMultiplier = CREATIVE_FREEDOM_B_PARAMS.temperature;
  const topPMultiplier = CREATIVE_FREEDOM_B_PARAMS.topP;

  const variationBoost = variation * tempMultiplier * 150;
  const randomness = Math.floor(Math.random() * 1000 * topPMultiplier);

  return seed + Math.floor(variationBoost) + randomness;
}
