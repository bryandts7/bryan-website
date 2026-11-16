import type { ComponentType } from "react";
import BaseRateExplorer from "./BaseRateExplorer";
import CostThreshold from "./CostThreshold";

/**
 * Demos a post can embed with a fenced block, for example:
 *
 * ```demo
 * base-rate-explorer
 * ```
 *
 * The name on the first line picks the demo. Unknown names render as plain code.
 */
export const DEMOS: Record<string, ComponentType> = {
  "base-rate-explorer": BaseRateExplorer,
  "cost-threshold": CostThreshold,
};
