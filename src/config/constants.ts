// Shared constants that define scales and baselines for visuals

// Baseline used to estimate time when we don't have a specific override
export const BASELINE_NS_PER_OP = 100; // 100 ns per operation

// Time bar scale
export const TIME_MIN_S = 1e-6; // 1 microsecond
export const TIME_MAX_S = 20;   // 20 seconds clamp

// Space bar scale
export const SPACE_SCALE_MAX_BYTES = 1024 ** 3; // ~1 GB visual scale

// Upper bound for demo arrays to keep UI responsive
export const MAX_ITEMS = 10000;
