export const clamp = (value: number, min: number, max: number) => {
	return Math.max(min, Math.min(value, max));
};

export const copySign = (value: number, sign: number) => {
	return Math.abs(value) * (sign < 0 ? -1 : 1);
};
export const mapRange = (
	value: number,
	low1: number,
	high1: number,
	low2: number,
	high2: number
) => {
	return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

export const applyDeadband = (value: number, deadband: number) => {
	if (Math.abs(value) < deadband) {
		return 0;
	}

	return value;
};
