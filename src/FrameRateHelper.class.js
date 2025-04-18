/**
 * FrameRateHelper
 *
 * Detects the screen refresh rate and provides a safe, clamped frame duration
 * for use in animations or transitions. Uses requestAnimationFrame if available,
 * with requestIdleCallback fallback for optimal idle accuracy, and setTimeout as last resort.
 */
class FrameRateHelper {
	constructor() {
		this.estimatedFrameDuration = 1000 / 60; // Default assumption: 60Hz = 16.67ms
		this.ready = false;
		this._callbacks = [];

		this._init();
	}

	/**
	 * Starts the detection of the refresh rate using the best available method.
	 */
	_init() {
		// Try requestAnimationFrame if available
		if (typeof window.requestAnimationFrame === 'function') {
			this._measureWithRAF();
		} else if (typeof window.requestIdleCallback === 'function') {
			this._measureWithIdleCallback();
		} else {
			this._measureWithTimeout();
		}
	}

	/**
	 * Measures refresh rate using requestAnimationFrame.
	 * Most accurate under normal conditions.
	 */
	_measureWithRAF() {
		const frameTimes = [];
		let lastTime = performance.now();

		const check = (timestamp) => {
			const delta = timestamp - lastTime;
			frameTimes.push(delta);

			if (frameTimes.length > 60) {
				this._finalize(frameTimes);
				return;
			}

			lastTime = timestamp;
			requestAnimationFrame(check);
		};

		requestAnimationFrame(check);
	}

	/**
	 * Fallback: measure refresh rate with requestIdleCallback.
	 * Useful in inactive tabs or low-power devices.
	 */
	_measureWithIdleCallback() {
		const samples = [];
		let count = 0;

		const collect = (deadline) => {
			const now = performance.now();
			samples.push(now);
			count++;

			if (count > 60) {
				const deltas = samples.slice(1).map((t, i) => t - samples[i]);
				this._finalize(deltas);
				return;
			}

			requestIdleCallback(collect);
		};

		requestIdleCallback(collect);
	}

	/**
	 * Fallback: use setTimeout to estimate frame intervals.
	 * Least accurate but ensures basic support.
	 */
	_measureWithTimeout() {
		const frameTimes = [];
		let lastTime = performance.now();

		const check = () => {
			const now = performance.now();
			const delta = now - lastTime;
			frameTimes.push(delta);

			if (frameTimes.length > 60) {
				this._finalize(frameTimes);
				return;
			}

			lastTime = now;
			setTimeout(check, 16);
		};

		setTimeout(check, 16);
	}

	/**
	 * Finalizes frame duration calculation with clamping to ensure stability.
	 *
	 * @param {number[]} frameTimes - Array of frame intervals in milliseconds
	 */
	_finalize(frameTimes) {
		const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

		// Clamp average to safe range: between 10ms (100Hz) and 20ms (50Hz)
		const clamped = Math.min(Math.max(avg, 10), 20);
		this.estimatedFrameDuration = clamped;

		this.ready = true;
		const refreshRate = 1000 / clamped;

		// Execute all queued callbacks
		this._callbacks.forEach(cb => cb(refreshRate));
		this._callbacks = [];
	}

	/**
	 * Returns the estimated frame duration with optional offset.
	 *
	 * @param {number} offset - Optional offset in milliseconds.
	 * @returns {number} Frame duration in milliseconds.
	 */
	getDuration(offset = 0) {
		return this.estimatedFrameDuration + offset;
	}

	/**
	 * Registers a callback to be executed when frame duration is ready.
	 *
	 * @param {function} callback - Receives the refresh rate (Hz).
	 */
	onReady(callback) {
		if (this.ready) {
			callback(1000 / this.estimatedFrameDuration);
		} else {
			this._callbacks.push(callback);
		}
	}
}

// Optional export for ES Modules
// export default FrameRateHelper;