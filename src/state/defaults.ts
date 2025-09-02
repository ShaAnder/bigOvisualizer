// Default control values used when a tab first loads.
import type { ControlsState } from "../types/controls";

export const defaultControls: ControlsState = {
	metric: "time",
	n: 1000,
	bytesPerItem: 8,
	arrayCSV: "1,2,3,4,5,6,7,8,9,10",
	target: "7",
};
