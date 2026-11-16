/**
 * The arithmetic behind the base-rate demos. Kept apart from the components so
 * it can be checked against the numbers written in the post.
 */

export interface DetectorInput {
  /** Number of devices in the population. */
  population: number;
  /** One device in `oneIn` is a bot (e.g. 1000 means 0.1%). */
  oneIn: number;
  /** Share of bots a single signal catches (0–1). */
  recall: number;
  /** Share of real devices a single signal wrongly flags (0–1). */
  falsePositiveRate: number;
  /** Independent signals a device must trip to be flagged (1 or more). */
  signals: number;
}

export interface DetectorResult {
  bots: number;
  real: number;
  truePositives: number;
  falseNegatives: number;
  falsePositives: number;
  trueNegatives: number;
  flags: number;
  /** When the detector flags a device, how often it really is a bot. */
  precision: number;
  /** Share of all devices classified correctly. */
  accuracy: number;
  /** Accuracy of a detector that never flags anything. */
  doNothingAccuracy: number;
  /** How much more often the combined signals fire on bots than on real devices. */
  likelihoodRatio: number;
}

export function runDetector({ population, oneIn, recall, falsePositiveRate, signals }: DetectorInput): DetectorResult {
  const bots = population / oneIn;
  const real = population - bots;
  // Independent signals that must all fire multiply their rates.
  const combinedRecall = recall ** signals;
  const combinedFalsePositiveRate = falsePositiveRate ** signals;

  const truePositives = bots * combinedRecall;
  const falseNegatives = bots - truePositives;
  const falsePositives = real * combinedFalsePositiveRate;
  const trueNegatives = real - falsePositives;
  const flags = truePositives + falsePositives;

  return {
    bots,
    real,
    truePositives,
    falseNegatives,
    falsePositives,
    trueNegatives,
    flags,
    precision: flags > 0 ? truePositives / flags : 0,
    accuracy: (truePositives + trueNegatives) / population,
    doNothingAccuracy: real / population,
    likelihoodRatio: combinedFalsePositiveRate > 0 ? combinedRecall / combinedFalsePositiveRate : Infinity,
  };
}

/** Flag when P(bot | evidence) is above this: C_false / (C_false + C_miss). */
export function flagThreshold(costOfFalseFlag: number, costOfMiss: number): number {
  return costOfFalseFlag / (costOfFalseFlag + costOfMiss);
}
