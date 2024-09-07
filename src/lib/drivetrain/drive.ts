// Combine Axis output to power differential drive motors
// Thos os from r2_control, not sure why rotate by 45. Best guess is to offset for
// the different power that one motor has since it is running in reverse.
// Here is WPILib's inverse kinematics for differential drive:

import { clamp, copySign } from '$lib/utils/math';

// https://github.com/wpilibsuite/allwpilib/blob/main/wpilibj/src/main/java/edu/wpi/first/wpilibj/drive/DifferentialDrive.java#L261
export const polarSteering = (drive: number, turn: number, maxSpeed = 1) => {
	// convert to polar
	const r = Math.hypot(drive, turn);
	const t = Math.atan2(turn, drive);

	// rotate by 45 degrees
	const rotatedAngle = t + Math.PI / 4;

	// back to cartesian
	const left = r * Math.cos(rotatedAngle);
	const right = r * Math.sin(rotatedAngle);

	// rescale the new coords
	const scaledLeft = left * Math.sqrt(2);
	const scaledRight = right * Math.sqrt(2);

	// clamp to -1/+1
	const clampedLeft = clamp(scaledLeft, -1, 1) * maxSpeed;
	const clampedRight = clamp(scaledRight, -1, 1) * maxSpeed;

	return { left: clampedLeft, right: clampedRight };
};

// source: https://github.com/wpilibsuite/allwpilib/blob/main/wpilibj/src/main/java/edu/wpi/first/wpilibj/drive/DifferentialDrive.java#L261
export const arcadeSteering = (drive: number, turn: number, squareInputs = false) => {
	let xSpeed = clamp(drive, -1.0, 1.0);
	let zRotation = clamp(turn, -1.0, 1.0);

	// Square the inputs (while preserving the sign) to increase fine control
	// while permitting full power.
	if (squareInputs) {
		xSpeed = copySign(xSpeed * xSpeed, xSpeed);
		zRotation = copySign(zRotation * zRotation, zRotation);
	}

	let leftSpeed = xSpeed - zRotation;
	let rightSpeed = xSpeed + zRotation;

	// Find the maximum possible value of (throttle + turn) along the vector
	// that the joystick is pointing, then desaturate the wheel speeds
	const greaterInput = Math.max(Math.abs(xSpeed), Math.abs(zRotation));
	const lesserInput = Math.min(Math.abs(xSpeed), Math.abs(zRotation));
	if (greaterInput == 0.0) {
		return { left: 0.0, right: 0.0 };
	}
	const saturatedInput = (greaterInput + lesserInput) / greaterInput;
	leftSpeed /= saturatedInput;
	rightSpeed /= saturatedInput;

	return { leftSpeed: 0.0, rightSpeed: 0.0 };
};
