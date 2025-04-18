# FrameRateHelper.js

**FrameRateHelper** is a lightweight, zero-dependency JavaScript utility that calculates the user's display refresh rate and provides a stable, clamped frame duration. It is ideal for synchronizing animations with screen refresh rates to produce smooth, consistent visual experiences.

---

## 🚀 Features

- 🔍 Automatically detects true screen refresh rate using `requestAnimationFrame`
- 🧠 Falls back to `requestIdleCallback` or `setTimeout` when needed
- 🧱 Built-in clamping prevents duration spikes on slow devices or inactive tabs
- 📦 Offers methods for calculating precise animation timing
- 📐 Frame-based timing with optional min/max/rounding controls
- 🪶 Lightweight and dependency-free — pure vanilla JavaScript

---

## 📦 Installation

### ✅ Use via CDN (for direct browser usage)

**jsDelivr:**
```html
<script src="https://cdn.jsdelivr.net/gh/InfinitumForm/FrameRateHelper@v1.0.1/dist/FrameRateHelper.js"></script>
```

**unpkg:**
```html
<script src="https://unpkg.com/framerate-helper@1.0.1/dist/FrameRateHelper.js"></script>
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

- Precision animations in sliders, carousels, or onboarding steps
- Smooth frame-based motion control in games or interactive UIs
- Avoiding stutters in custom scroll or fade effects
- Performance-friendly frame sync for canvas/webgl renderers

---

## 📄 License

MIT License — free for personal and commercial use.

---

## 👤 Author

Developed by [**INFINITUM FORM®**](https://infinitumform.com)  
Author: [Ivijan-Stefan Stipić](https://www.linkedin.com/in/ivijanstefanstipic/)  
© 2025 Ivijan-Stefan Stipić. All rights reserved.

---

For issues, contributions, or improvements, please visit the [GitHub repository](https://github.com/InfinitumForm/FrameRateHelper).

Happy animating! 🎨
