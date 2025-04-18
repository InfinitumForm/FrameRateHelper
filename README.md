# FrameRateHelper.js

**FrameRateHelper** is a lightweight, zero-dependency JavaScript utility that calculates the user's display refresh rate and provides a stable, clamped frame duration. It is ideal for synchronizing animations with screen refresh rates for smoother UI interactions.

## Features

- 🔍 Detects real screen refresh rate using `requestAnimationFrame`
- 🧠 Includes fallback to `requestIdleCallback` and `setTimeout`
- 🧱 Clamp logic prevents frame duration spikes on low-power or inactive tabs
- 💡 Asynchronous, event-driven design
- 🪶 No dependencies, pure vanilla JS

---

## Installation

### ✅ CDN
Use directly in HTML via jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/InfinitumForm/FrameRateHelper@v1.0.0/dist/FrameRateHelper.js"></script>
```

Or via unpkg:

```html
<script src="https://unpkg.com/framerate-helper@1.0.0/dist/FrameRateHelper.js"></script>
```

### ✅ NPM (for modern build environments)
```bash
npm install framerate-helper
```

Then in your module:
```js
import FrameRateHelper from 'framerate-helper';
```

---

## Usage

### Basic Example
```js
const fps = new FrameRateHelper();

fps.onReady((hz) => {
  console.log('Detected refresh rate:', hz.toFixed(2), 'Hz');
  console.log('Adjusted duration:', fps.getDuration(300), 'ms');
});
```

---

## API

### `new FrameRateHelper()`
Creates an instance and begins measuring refresh rate immediately.

### `onReady(callback)`
Registers a callback to be called when the refresh rate is determined.

**Parameters:**
- `callback (function)`: Function that receives the detected refresh rate in Hz.

### `getDuration(offset = 0)`
Returns a calculated duration adjusted for the screen's refresh rate.

**Parameters:**
- `offset (number)`: Optional additional duration in milliseconds.

**Returns:**
- `number`: Total adjusted duration in ms

---

## Use Case

Perfect for developers building custom sliders, carousels, animation loops, or precision-based timing utilities where frame-perfect sync matters.

---

## License

MIT License

---

## Author

Developed by **[INFINITUM FORM®](https://infinitumform.com)**  
Author: [Ivijan-Stefan Stipić](https://www.linkedin.com/in/ivijanstefanstipic/)  
Copyright © 2025 Ivijan-Stefan Stipić. All rights reserved.