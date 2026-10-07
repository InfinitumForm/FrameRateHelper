/*!
 * FrameRateHelper.js v1.0.3
 * Author: Ivijan-Stefan Stipić
 * MIT Licensed | https://github.com/InfinitumForm/FrameRateHelper
 */
class FrameRateHelper {
	/**
	 * Initializes the FrameRateHelper instance with optional configuration.
	 *
	 * @param {object} [options={}] - Configuration object.
	 * @param {boolean} [options.cache=false] - If true, enables localStorage caching to avoid repeated calculations.
	 */
	constructor(options = {}) {
		this.estimatedFrameDuration = 1000 / 60; // Default assumption: 60Hz = 16.67ms
		this.ready = false;
		this._callbacks = [];
		this._durationsList = {};

		this._cache = options.cache === true;
		this._storageKey = 'FrameRateHelper.frameDuration.v1.0.3';

		this._init();
	}

	/**
	 * Starts the detection of the refresh rate using the best available method.
	 */
	_init() {
		if (this._cache && typeof localStorage !== 'undefined') {
			try {
				const stored = parseFloat(
					localStorage.getItem(this._storageKey)
				);

				if (
					Number.isFinite(stored) &&
					stored >= (1000 / 480) &&
					stored <= (1000 / 50)
				) {
					this.estimatedFrameDuration = stored;
					this.ready = true;

					const refreshRate = 1000 / stored;

					const callbacks = this._callbacks;
					this._callbacks = [];

					callbacks.forEach(callback => {
						try {
							callback(refreshRate);
						} catch (error) {
							setTimeout(() => {
								throw error;
							}, 0);
						}
					});

					return;
				}
			} catch (error) {
				// Ignore storage errors and continue with live measurement.
			}
		}

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
		let lastTime = null;

		const check = (timestamp) => {
			if (lastTime !== null) {
				frameTimes.push(timestamp - lastTime);
			}

			lastTime = timestamp;

			if (frameTimes.length >= 60) {
				this._finalize(frameTimes);
				return;
			}

			window.requestAnimationFrame(check);
		};

		window.requestAnimationFrame(check);
	}

	/**
	 * Fallback: estimates a usable frame duration using requestIdleCallback.
	 * This does not represent the actual display refresh rate.
	 */
	_measureWithIdleCallback() {
		const samples = [];
		let count = 0;

		const collect = () => {
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
	 * Fallback: estimates a usable frame duration using setTimeout.
	 * This does not represent the actual display refresh rate.
	 */
	_measureWithTimeout() {
		const frameTimes = [];
		let lastTime = performance.now();

		const check = () => {
			const now = performance.now();
			const delta = now - lastTime;
			frameTimes.push(delta);

			if (frameTimes.length >= 60) {
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
	 * @param {number[]} frameTimes - Array of frame intervals in milliseconds.
	 */
	_finalize(frameTimes) {
		const validFrameTimes = frameTimes.filter(
			value => Number.isFinite(value) && value > 0
		);

		if (validFrameTimes.length === 0) {
			return;
		}

		const sorted = [...validFrameTimes].sort((a, b) => a - b);
		const middle = Math.floor(sorted.length / 2);

		const estimated = sorted.length % 2 === 0
			? (sorted[middle - 1] + sorted[middle]) / 2
			: sorted[middle];

		const clamped = Math.min(
			Math.max(estimated, 1000 / 480),
			1000 / 50
		);

		this.estimatedFrameDuration = clamped;
		this.ready = true;
		this._durationsList = {};

		if (this._cache && typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(this._storageKey, clamped);
			} catch (error) {
				// Ignore storage errors.
			}
		}

		const refreshRate = 1000 / clamped;

		const callbacks = this._callbacks;
		this._callbacks = [];

		callbacks.forEach(callback => {
			try {
				callback(refreshRate);
			} catch (error) {
				setTimeout(() => {
					throw error;
				}, 0);
			}
		});
	}

	/**
	 * Returns the estimated frame duration with optional offset.
	 *
	 * @param {number} offset - Optional offset in milliseconds.
	 * @returns {number} Frame duration in milliseconds.
	 */
	getDuration(offset = 0) {
		if (Object.prototype.hasOwnProperty.call(this._durationsList, offset)) {
			return this._durationsList[offset];
		}
		
		this._durationsList[offset] = this.estimatedFrameDuration + offset;
		
		return this._durationsList[offset];
	}
	
	/**
	 * Calculates total duration based on the number of animation frames.
	 *
	 * @param {number} frames - Number of animation frames to simulate.
	 * @param {object} [options] - Optional configuration.
	 * @param {number} [options.min] - Minimum clamped duration (in ms).
	 * @param {number} [options.max] - Maximum clamped duration (in ms).
	 * @param {boolean} [options.rounded=false] - Whether to round the result to the nearest integer.
	 * @returns {number} Duration in milliseconds (clamped and optionally rounded).
	 */
	getDurationForFrames(frames, options = {}) {
		let duration = frames * this.estimatedFrameDuration;

		// Apply clamping if provided
		if (typeof options.min === 'number' && duration < options.min) {
			duration = options.min;
		}
		if (typeof options.max === 'number' && duration > options.max) {
			duration = options.max;
		}

		// Round the result if requested
		if (options.rounded === true) {
			duration = Math.round(duration);
		}

		return duration;
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

// Expose to global scope (for browser usage via IIFE)
window.FrameRateHelper = FrameRateHelper;
