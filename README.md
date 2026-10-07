# FrameRateHelper.js - JavaScript Screen Refresh Rate Detector

**FrameRateHelper** is a lightweight, zero-dependency JavaScript library for detecting screen refresh rates (60Hz, 120Hz, 144Hz and higher) using `requestAnimationFrame`. It provides accurate frame timing and duration calculations for animations, rendering, and other refresh-rate-aware browser applications.

---

## 🚀 Features

- 🔍 Detects screen refresh rate using requestAnimationFrame
- 🖥️ Supports 60Hz, 90Hz, 120Hz, 144Hz, 165Hz and higher refresh rates
- 🧠 Falls back to requestIdleCallback or setTimeout when needed
- 🧱 Built-in clamping prevents duration spikes on slow devices or inactive tabs
- 📐 Calculates frame duration and frame-based animation timing
- ⚙️ Optional min/max duration limits and rounding controls
- 🪶 Lightweight, zero-dependency, pure vanilla JavaScript

---

## 📦 Installation

### ✅ Use via CDN (for direct browser usage)

**jsDelivr:**
```html
<!-- Development version (readable, unminified, includes source map) -->
<script src="https://cdn.jsdelivr.net/gh/InfinitumForm/FrameRateHelper@v1.0.2/dist/FrameRateHelper.js"></script>

<!-- Production version (minified, optimized for speed) -->
<script src="https://cdn.jsdelivr.net/gh/InfinitumForm/FrameRateHelper@v1.0.2/dist/FrameRateHelper.min.js"></script>
```

**unpkg:**
```html
<!-- Development version (readable, unminified, includes source map) -->
<script src="https://unpkg.com/framerate-helper@1.0.2/dist/FrameRateHelper.js"></script>

<!-- Production version (minified, optimized for speed) -->
<script src="https://unpkg.com/framerate-helper@1.0.2/dist/FrameRateHelper.min.js"></script>
```

This exposes `window.FrameRateHelper` globally.

### ✅ Use via NPM (modern JavaScript projects)

```bash
npm install framerate-helper
```

Then in your module:
```js
import FrameRateHelper from 'framerate-helper';
```

---

## 🧪 Usage Tutorial

### 1. Basic Setup (auto-detect refresh rate)
```js
const fps = new FrameRateHelper();

fps.onReady((hz) => {
  console.log('Detected refresh rate:', hz.toFixed(2), 'Hz');
  console.log('Estimated frame duration:', fps.getDuration(), 'ms');
});
```

### 2. Get adjusted duration for animations
```js
const duration = fps.getDuration(300); // base + 300ms offset
```

### 3. Calculate animation duration from frame count
```js
const duration = fps.getDurationForFrames(90); // Duration for 90 frames
```

### 4. Clamp duration with min/max values
```js
const duration = fps.getDurationForFrames(90, {
  min: 1000,      // minimum 1 second
  max: 2000,      // maximum 2 seconds
  rounded: true   // round to nearest integer
});
```

### 5. Animate based on desired frames with fallback
```js
const desiredFrames = 120;
let duration = fps.getDurationForFrames(desiredFrames, {
  max: 2500,   // prevent overly long animations
  min: 800,    // ensure minimum visibility
  rounded: true
});

myElement.style.transitionDuration = `${duration}ms`;
```

---

## 🧰 API Reference

### `new FrameRateHelper()`
Creates a new instance and begins refresh rate measurement immediately.

### `onReady(callback)`
Waits for refresh rate calculation to complete and then executes the callback.
- `callback (function)`: Receives detected refresh rate (Hz)

### `getDuration(offset = 0)`
Returns an adjusted frame duration based on screen refresh rate.
- `offset (number)`: Optional duration to add (in ms)
- **Returns:** total duration in ms

### `getDurationForFrames(frames, options)`
Calculates duration based on number of frames.
- `frames (number)`: Desired number of animation frames
- `options (object)` (optional):
  - `min (number)`: Minimum allowed duration in ms
  - `max (number)`: Maximum allowed duration in ms
  - `rounded (boolean)`: If `true`, rounds result
- **Returns:** clamped, optionally rounded duration in ms

---

## 💡 Real-World Use Cases

### jQuery Integration Examples

You can seamlessly use `FrameRateHelper` (for example) with jQuery animation methods to ensure frame-synced transitions:

```js
const fps = new FrameRateHelper();

fps.onReady(() => {
  const duration = fps.getDuration(400); // add a 400ms offset if desired

  // Smoothly toggle element visibility with frame-accurate duration
  $('.my-element').slideToggle(duration);

  // Show/hide with consistent frame-based speed
  $('.other-element').show(duration);
  $('.another-one').hide(duration);
});
```

FrameRateHelper is especially useful when animations need to behave consistently across displays with different refresh rates, including 60Hz, 120Hz, 144Hz and higher.


- Precision timing for sliders, carousels and UI transitions
- Frame-based motion control for games and interactive interfaces
- Refresh-rate-aware scroll, fade and transition effects
- Frame timing for Canvas and WebGL rendering
- Consistent animation behavior across standard and high-refresh-rate displays

---

## 📄 License

MIT License — free for personal and commercial use.

---

## 👤 Author

Author: [Ivijan-Stefan Stipić](https://www.linkedin.com/in/ivijanstefanstipic/)  
© 2025 Ivijan-Stefan Stipić. All rights reserved.

---

For issues, contributions, or improvements, please visit the [GitHub repository](https://github.com/InfinitumForm/FrameRateHelper).

Happy animating! 🎨
