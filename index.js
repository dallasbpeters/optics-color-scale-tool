// Color scale definitions with H, S, L values
const colorScales = {
  primary: {
    name: "Primary",
    prefix: "primary",
    hVar: "--op-color-primary-h",
    sVar: "--op-color-primary-s",
    lVar: "--op-color-primary-l",
  },
  neutral: {
    name: "Neutral",
    prefix: "neutral",
    hVar: "--op-color-neutral-h",
    sVar: "--op-color-neutral-s",
    lVar: "--op-color-neutral-l",
  },
  warning: {
    name: "Warning",
    prefix: "alerts-warning",
    hVar: "--op-color-alerts-warning-h",
    sVar: "--op-color-alerts-warning-s",
    lVar: "--op-color-alerts-warning-l",
  },
  danger: {
    name: "Danger",
    prefix: "alerts-danger",
    hVar: "--op-color-alerts-danger-h",
    sVar: "--op-color-alerts-danger-s",
    lVar: "--op-color-alerts-danger-l",
  },
  info: {
    name: "Info",
    prefix: "alerts-info",
    hVar: "--op-color-alerts-info-h",
    sVar: "--op-color-alerts-info-s",
    lVar: "--op-color-alerts-info-l",
  },
  notice: {
    name: "Notice",
    prefix: "alerts-notice",
    hVar: "--op-color-alerts-notice-h",
    sVar: "--op-color-alerts-notice-s",
    lVar: "--op-color-alerts-notice-l",
  },
};

// Color steps in order from lightest to darkest
const colorSteps = [
  "original",
  "plus-max",
  "plus-eight",
  "plus-seven",
  "plus-six",
  "plus-five",
  "plus-four",
  "plus-three",
  "plus-two",
  "plus-one",
  "base",
  "minus-one",
  "minus-two",
  "minus-three",
  "minus-four",
  "minus-five",
  "minus-six",
  "minus-seven",
  "minus-eight",
  "minus-max",
];

// Convert RGB to Hex
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return rgb;

  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);

  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
  const rgb1 = typeof color1 === 'string' ? hexToRgb(color1) : color1;
  const rgb2 = typeof color2 === 'string' ? hexToRgb(color2) : color2;

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Get accessibility level based on contrast ratio
function getAccessibilityLevel(ratio, isLargeText = false) {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
  } else {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
  }
  return 'FAIL';
}

// Get computed color value from CSS variable
function getComputedColor(varName) {
  const computedStyle = getComputedStyle(document.documentElement);
  const color = computedStyle.getPropertyValue(varName).trim();
  return color;
}

// Generate all color variables using light-dark() with HSL values
function generateAllColorVariables() {
  const style = document.createElement("style");
  let css = ":root {\n";

  // Lightness values for light mode
  const lightMode = {
    bg: {
      "original": 40,
      "plus-max": 100,
      "plus-eight": 98,
      "plus-seven": 96,
      "plus-six": 94,
      "plus-five": 90,
      "plus-four": 84,
      "plus-three": 70,
      "plus-two": 64,
      "plus-one": 45,
      "base": 40,
      "minus-one": 36,
      "minus-two": 32,
      "minus-three": 28,
      "minus-four": 24,
      "minus-five": 20,
      "minus-six": 16,
      "minus-seven": 8,
      "minus-eight": 4,
      "minus-max": 0,
    },
    on: {
      "original": 100,
      "plus-max": 0,
      "plus-eight": 4,
      "plus-seven": 8,
      "plus-six": 16,
      "plus-five": 20,
      "plus-four": 24,
      "plus-three": 20,
      "plus-two": 16,
      "plus-one": 100,
      "base": 100,
      "minus-one": 94,
      "minus-two": 90,
      "minus-three": 86,
      "minus-four": 84,
      "minus-five": 88,
      "minus-six": 94,
      "minus-seven": 96,
      "minus-eight": 98,
      "minus-max": 100,
    },
    onAlt: {
      "original": 88,
      "plus-max": 20,
      "plus-eight": 24,
      "plus-seven": 28,
      "plus-six": 26,
      "plus-five": 40,
      "plus-four": 4,
      "plus-three": 10,
      "plus-two": 6,
      "plus-one": 95,
      "base": 88,
      "minus-one": 82,
      "minus-two": 78,
      "minus-three": 74,
      "minus-four": 72,
      "minus-five": 78,
      "minus-six": 82,
      "minus-seven": 84,
      "minus-eight": 86,
      "minus-max": 88,
    }
  };

  // Lightness values for dark mode
  const darkMode = {
    bg: {
      "original": 60,
      "plus-max": 12,
      "plus-eight": 14,
      "plus-seven": 16,
      "plus-six": 20,
      "plus-five": 24,
      "plus-four": 26,
      "plus-three": 29,
      "plus-two": 32,
      "plus-one": 35,
      "base": 38,
      "minus-one": 40,
      "minus-two": 45,
      "minus-three": 48,
      "minus-four": 52,
      "minus-five": 64,
      "minus-six": 72,
      "minus-seven": 80,
      "minus-eight": 88,
      "minus-max": 100,
    },
    on: {
      "original": 100,
      "plus-max": 100,
      "plus-eight": 88,
      "plus-seven": 80,
      "plus-six": 72,
      "plus-five": 72,
      "plus-four": 80,
      "plus-three": 78,
      "plus-two": 80,
      "plus-one": 80,
      "base": 100,
      "minus-one": 98,
      "minus-two": 98,
      "minus-three": 98,
      "minus-four": 2,
      "minus-five": 2,
      "minus-six": 8,
      "minus-seven": 8,
      "minus-eight": 4,
      "minus-max": 0,
    },
    onAlt: {
      "original": 84,
      "plus-max": 78,
      "plus-eight": 70,
      "plus-seven": 64,
      "plus-six": 96,
      "plus-five": 86,
      "plus-four": 92,
      "plus-three": 98,
      "plus-two": 92,
      "plus-one": 98,
      "base": 84,
      "minus-one": 90,
      "minus-two": 92,
      "minus-three": 96,
      "minus-four": 2,
      "minus-five": 20,
      "minus-six": 26,
      "minus-seven": 34,
      "minus-eight": 38,
      "minus-max": 38,
    }
  };

  Object.values(colorScales).forEach((scale) => {
    colorSteps.forEach((step) => {
      // Generate background color using light-dark()
      css += `  --op-color-${scale.prefix}-${step}: light-dark(\n`;
      css += `    hsl(var(--op-color-${scale.prefix}-h) var(--op-color-${scale.prefix}-s) ${lightMode.bg[step]}%),\n`;
      css += `    hsl(var(--op-color-${scale.prefix}-h) var(--op-color-${scale.prefix}-s) ${darkMode.bg[step]}%)\n`;
      css += `  );\n`;

      // Generate on color using light-dark()
      css += `  --op-color-${scale.prefix}-on-${step}: light-dark(\n`;
      css += `    hsl(var(--op-color-${scale.prefix}-h) var(--op-color-${scale.prefix}-s) ${lightMode.on[step]}%),\n`;
      css += `    hsl(var(--op-color-${scale.prefix}-h) var(--op-color-${scale.prefix}-s) ${darkMode.on[step]}%)\n`;
      css += `  );\n`;

      // Generate on-alt color using light-dark()
      css += `  --op-color-${scale.prefix}-on-${step}-alt: light-dark(\n`;
      css += `    hsl(var(--op-color-${scale.prefix}-h) var(--op-color-${scale.prefix}-s) ${lightMode.onAlt[step]}%),\n`;
      css += `    hsl(var(--op-color-${scale.prefix}-h) var(--op-color-${scale.prefix}-s) ${darkMode.onAlt[step]}%)\n`;
      css += `  );\n`;
    });
  });

  css += "}\n";
  style.textContent = css;
  document.head.appendChild(style);
}

// Get Optics color for a specific scale and step
// Removed - using light-dark() in CSS instead

// Generate CSS classes dynamically
function generateColorClasses() {
  const style = document.createElement("style");
  let css = "";

  Object.values(colorScales).forEach((scale) => {
    colorSteps.forEach((step) => {
      const className = `${scale.prefix}-${step}`;
      const colorVar = `--op-color-${scale.prefix}-${step}`;
      const onColorVar = `--op-color-${scale.prefix}-on-${step}`;
      const onAltColorVar = `--op-color-${scale.prefix}-on-${step}-alt`;

      // Background color class
      css += `.${className} { background-color: var(${colorVar}); }\n`;

      // Text color classes
      css += `.${className}-on { color: var(${onColorVar}); }\n`;
      css += `.${className}-on-alt { color: var(${onAltColorVar}); }\n`;
    });
  });

  style.textContent = css;
  document.head.appendChild(style);
}

function createColorSwatch(scale, step) {
  const isOriginal = step === "original";
  const isBase = step === "base";

  // Create the color class name for this swatch
  const colorClassName = `${scale.prefix}-${step}`;

  const swatch = document.createElement("div");
  swatch.className = `color-swatch ${colorClassName} ${isOriginal ? "original-color" : ""
    } ${isBase ? "base-color" : ""}`;

  const main = document.createElement("div");
  main.className = "swatch-main";

  const name = document.createElement("div");
  name.className = "swatch-name";
  main.appendChild(name);

  const onText = document.createElement("div");
  onText.className = `swatch-on-text ${colorClassName}-on`;
  onText.textContent = "On Text";
  main.appendChild(onText);

  const altText = document.createElement("div");
  altText.className = `swatch-alt-text ${colorClassName}-on-alt`;
  altText.textContent = "Alt Text";
  main.appendChild(altText);

  swatch.append(main);

  // Only add accessibility indicators for non-original steps
  if (step !== "original") {
    // Add accessibility indicators
    const accessibilityContainer = document.createElement("div");
    accessibilityContainer.className = "accessibility-indicators";

    const onIndicator = document.createElement("div");
    onIndicator.className = "accessibility-indicator on-indicator";
    onIndicator.setAttribute("data-step", step);
    onIndicator.setAttribute("data-scale", scale.prefix);
    onIndicator.setAttribute("data-type", "on");

    const altIndicator = document.createElement("div");
    altIndicator.className = "accessibility-indicator alt-indicator";
    altIndicator.setAttribute("data-step", step);
    altIndicator.setAttribute("data-scale", scale.prefix);
    altIndicator.setAttribute("data-type", "alt");

    accessibilityContainer.append(onIndicator);
    accessibilityContainer.append(altIndicator);

    swatch.append(accessibilityContainer);
  }

  return swatch;
}

function populateColorGrid(scaleKey) {
  const scale = colorScales[scaleKey];
  const grid = document.getElementById(`${scaleKey}-grid`);

  // Add all color steps
  colorSteps.forEach((step) => {
    const swatch = createColorSwatch(scale, step);
    // Clear the swatch name (remove the text I added)
    const nameElement = swatch.querySelector('.swatch-name');
    if (nameElement) {
      nameElement.textContent = '';
    }

    // Update the text labels to show CSS variable names (skip for original)
    const onText = swatch.querySelector('.swatch-on-text');
    const altText = swatch.querySelector('.swatch-alt-text');

    if (onText && altText) {
      if (step === 'original') {
        // Don't show text labels for original step
        onText.textContent = '';
        altText.textContent = '';
      } else {
        const stepName = step.replace('-', '').replace(/\b\w/g, l => l.toUpperCase());
        onText.textContent = `On${stepName}`;
        altText.textContent = `On${stepName}Alt`;
      }
    }

    grid.appendChild(swatch);
  });
}

// Update accessibility indicators for a specific scale and step
// Removed duplicate function - using the one below

// Update accessibility indicators for a specific scale and step
function updateAccessibilityIndicators(scalePrefix, step) {
  try {
    // Skip original step as it doesn't have accessibility indicators
    if (step === "original") {
      return;
    }

    // Calculate colors directly based on current color scheme
    const scaleHSL = getScaleHSL(scalePrefix);

    if (!scaleHSL || scaleHSL.h === null || scaleHSL.h === undefined ||
      scaleHSL.s === null || scaleHSL.s === undefined ||
      isNaN(scaleHSL.h) || isNaN(scaleHSL.s)) {
      return;
    }

    // Detect if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Use appropriate lightness values based on color scheme
    const mode = prefersDark ? 'dark' : 'light';

    const lightMode = {
      bg: { "original": 40, "plus-max": 100, "plus-eight": 98, "plus-seven": 96, "plus-six": 94, "plus-five": 90, "plus-four": 84, "plus-three": 70, "plus-two": 64, "plus-one": 45, "base": 40, "minus-one": 36, "minus-two": 32, "minus-three": 28, "minus-four": 24, "minus-five": 20, "minus-six": 16, "minus-seven": 8, "minus-eight": 4, "minus-max": 0 },
      on: { "original": 100, "plus-max": 0, "plus-eight": 4, "plus-seven": 8, "plus-six": 16, "plus-five": 20, "plus-four": 24, "plus-three": 20, "plus-two": 16, "plus-one": 100, "base": 100, "minus-one": 94, "minus-two": 90, "minus-three": 86, "minus-four": 84, "minus-five": 88, "minus-six": 94, "minus-seven": 96, "minus-eight": 98, "minus-max": 100 },
      onAlt: { "original": 88, "plus-max": 20, "plus-eight": 24, "plus-seven": 28, "plus-six": 26, "plus-five": 40, "plus-four": 4, "plus-three": 10, "plus-two": 6, "plus-one": 95, "base": 88, "minus-one": 82, "minus-two": 78, "minus-three": 74, "minus-four": 72, "minus-five": 78, "minus-six": 82, "minus-seven": 84, "minus-eight": 86, "minus-max": 88 }
    };

    const darkMode = {
      bg: { "original": 60, "plus-max": 12, "plus-eight": 14, "plus-seven": 16, "plus-six": 20, "plus-five": 24, "plus-four": 26, "plus-three": 29, "plus-two": 32, "plus-one": 35, "base": 38, "minus-one": 40, "minus-two": 45, "minus-three": 48, "minus-four": 52, "minus-five": 64, "minus-six": 72, "minus-seven": 80, "minus-eight": 88, "minus-max": 100 },
      on: { "original": 100, "plus-max": 100, "plus-eight": 88, "plus-seven": 80, "plus-six": 72, "plus-five": 72, "plus-four": 80, "plus-three": 78, "plus-two": 80, "plus-one": 80, "base": 100, "minus-one": 98, "minus-two": 98, "minus-three": 98, "minus-four": 2, "minus-five": 2, "minus-six": 8, "minus-seven": 8, "minus-eight": 4, "minus-max": 0 },
      onAlt: { "original": 84, "plus-max": 78, "plus-eight": 70, "plus-seven": 64, "plus-six": 96, "plus-five": 86, "plus-four": 92, "plus-three": 98, "plus-two": 92, "plus-one": 98, "base": 84, "minus-one": 90, "minus-two": 92, "minus-three": 96, "minus-four": 2, "minus-five": 20, "minus-six": 26, "minus-seven": 34, "minus-eight": 38, "minus-max": 38 }
    };

    const currentMode = prefersDark ? darkMode : lightMode;

    // Check if CSS variables have been updated for this specific step
    const onVarName = `--op-color-${scalePrefix}-on-${step}`;
    const onAltVarName = `--op-color-${scalePrefix}-on-${step}-alt`;


    // Get lightness values (check for updated values first)
    const onKey = `${scalePrefix}-${step}-on`;
    const onAltKey = `${scalePrefix}-${step}-alt`;

    let onLightness = currentMode.on[step];
    let onAltLightness = currentMode.onAlt[step];

    if (onLightness === undefined || onAltLightness === undefined) {
      return;
    }

    // Check if we have updated values
    if (updatedLightnessValues[onKey]) {
      const updated = updatedLightnessValues[onKey];
      onLightness = prefersDark ? updated.dark : updated.light;
    }

    if (updatedLightnessValues[onAltKey]) {
      const updated = updatedLightnessValues[onAltKey];
      onAltLightness = prefersDark ? updated.dark : updated.light;
    }

    // Calculate actual hex colors
    const backgroundColor = hslToHex(scaleHSL.h, scaleHSL.s, currentMode.bg[step]);
    const onColor = hslToHex(scaleHSL.h, scaleHSL.s, onLightness);
    const onAltColor = hslToHex(scaleHSL.h, scaleHSL.s, onAltLightness);

    // Calculate contrast ratios
    const onContrastRatio = getContrastRatio(onColor, backgroundColor);
    const altContrastRatio = getContrastRatio(onAltColor, backgroundColor);

    // Get accessibility levels (assuming normal text size)
    const onLevel = getAccessibilityLevel(onContrastRatio, false);
    const altLevel = getAccessibilityLevel(altContrastRatio, false);

    // Update indicators
    const onIndicator = document.querySelector(
      `.accessibility-indicator[data-scale="${scalePrefix}"][data-step="${step}"][data-type="on"]`
    );
    const altIndicator = document.querySelector(
      `.accessibility-indicator[data-scale="${scalePrefix}"][data-step="${step}"][data-type="alt"]`
    );

    if (onIndicator) {
      onIndicator.textContent = `${onLevel} (${onContrastRatio.toFixed(2)}:1)`;
      onIndicator.className = `accessibility-indicator on-indicator level-${onLevel.toLowerCase()}`;
      onIndicator.style.cursor = 'pointer';
      onIndicator.onclick = () => fixAccessibility(scalePrefix, step, 'on');
    }

    if (altIndicator) {
      altIndicator.textContent = `${altLevel} (${altContrastRatio.toFixed(2)}:1)`;
      altIndicator.className = `accessibility-indicator alt-indicator level-${altLevel.toLowerCase()}`;
      altIndicator.style.cursor = 'pointer';
      altIndicator.onclick = () => fixAccessibility(scalePrefix, step, 'alt');
    }
  } catch (error) {
    console.warn(`Failed to update accessibility for ${scalePrefix}-${step}:`, error);
  }
}

// Store updated lightness values (light/dark), persist in localStorage
const STORAGE_KEY = 'opticsLightnessOverrides';
const updatedLightnessValues = {};

function loadOverridesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.keys(parsed).forEach((k) => {
      const v = parsed[k];
      if (v && typeof v.light === 'number' && typeof v.dark === 'number') {
        updatedLightnessValues[k] = v;
      }
    });
  } catch (_) { }
}

function saveOverridesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLightnessValues));
  } catch (_) { }
}

function applyOverridesToCSS() {
  Object.keys(updatedLightnessValues).forEach((key) => {
    // key format: `${scalePrefix}-${step}-${type}` where type in ['on','alt']
    const [scalePrefix, ...rest] = key.split('-');
    const type = rest.pop();
    const step = rest.join('-');
    const override = updatedLightnessValues[key];
    if (!override) return;
    const varName = `--op-color-${scalePrefix}-on-${step}${type === 'alt' ? '-alt' : ''}`;
    const newValue = `light-dark(hsl(var(--op-color-${scalePrefix}-h) var(--op-color-${scalePrefix}-s) ${override.light}%), hsl(var(--op-color-${scalePrefix}-h) var(--op-color-${scalePrefix}-s) ${override.dark}%))`;
    document.documentElement.style.setProperty(varName, newValue);
  });
}

// -------------------------
// Batched update scheduler
// -------------------------
let scheduledFrame = false;
let needsRegenerateVars = false;
let needsUpdateIndicators = false;

function scheduleUpdate({ regenerateVars = false, updateIndicators = false } = {}) {
  needsRegenerateVars = needsRegenerateVars || regenerateVars;
  needsUpdateIndicators = needsUpdateIndicators || updateIndicators;
  if (scheduledFrame) return;
  scheduledFrame = true;
  requestAnimationFrame(() => {
    scheduledFrame = false;
    if (needsRegenerateVars) {
      // Regenerate, re-apply overrides
      generateColorVariables();
      generateAllColorVariables();
      applyOverridesToCSS();
      needsRegenerateVars = false;
    }
    if (needsUpdateIndicators) {
      updateAllAccessibilityIndicators();
      needsUpdateIndicators = false;
    }
  });
}

// Fix accessibility by adjusting text luminosity to pass standards
function fixAccessibility(scalePrefix, step, type) {
  try {
    const scaleHSL = getScaleHSL(scalePrefix);
    if (!scaleHSL) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Get background lightness for current mode
    const bgLightness = prefersDark ?
      { "original": 60, "plus-max": 12, "plus-eight": 14, "plus-seven": 16, "plus-six": 20, "plus-five": 24, "plus-four": 26, "plus-three": 29, "plus-two": 32, "plus-one": 35, "base": 38, "minus-one": 40, "minus-two": 45, "minus-three": 48, "minus-four": 52, "minus-five": 64, "minus-six": 72, "minus-seven": 80, "minus-eight": 88, "minus-max": 100 }[step] :
      { "original": 40, "plus-max": 100, "plus-eight": 98, "plus-seven": 96, "plus-six": 94, "plus-five": 90, "plus-four": 84, "plus-three": 70, "plus-two": 64, "plus-one": 45, "base": 40, "minus-one": 36, "minus-two": 32, "minus-three": 28, "minus-four": 24, "minus-five": 20, "minus-six": 16, "minus-seven": 8, "minus-eight": 4, "minus-max": 0 }[step];

    // Create background color
    const bgColor = hslToHex(scaleHSL.h, scaleHSL.s, bgLightness);

    // Determine current text lightness (honor prior updates if any)
    const bgRgb = hexToRgb(bgColor);
    if (!bgRgb) return;
    const targetRatio = 4.5;

    const onKey = `${scalePrefix}-${step}-${type}`;

    const defOnLightLight = { "original": 100, "plus-max": 0, "plus-eight": 4, "plus-seven": 8, "plus-six": 16, "plus-five": 20, "plus-four": 24, "plus-three": 20, "plus-two": 16, "plus-one": 100, "base": 100, "minus-one": 94, "minus-two": 90, "minus-three": 86, "minus-four": 84, "minus-five": 88, "minus-six": 94, "minus-seven": 96, "minus-eight": 98, "minus-max": 100 };
    const defOnLightDark = { "original": 100, "plus-max": 100, "plus-eight": 88, "plus-seven": 80, "plus-six": 72, "plus-five": 72, "plus-four": 80, "plus-three": 78, "plus-two": 80, "plus-one": 80, "base": 100, "minus-one": 98, "minus-two": 98, "minus-three": 98, "minus-four": 2, "minus-five": 2, "minus-six": 8, "minus-seven": 8, "minus-eight": 4, "minus-max": 0 };
    const defAltLightLight = { "original": 88, "plus-max": 20, "plus-eight": 24, "plus-seven": 28, "plus-six": 26, "plus-five": 40, "plus-four": 4, "plus-three": 10, "plus-two": 6, "plus-one": 95, "base": 88, "minus-one": 82, "minus-two": 78, "minus-three": 74, "minus-four": 72, "minus-five": 78, "minus-six": 82, "minus-seven": 84, "minus-eight": 86, "minus-max": 88 };
    const defAltLightDark = { "original": 84, "plus-max": 78, "plus-eight": 70, "plus-seven": 64, "plus-six": 96, "plus-five": 86, "plus-four": 92, "plus-three": 98, "plus-two": 92, "plus-one": 98, "base": 84, "minus-one": 90, "minus-two": 92, "minus-three": 96, "minus-four": 2, "minus-five": 20, "minus-six": 26, "minus-seven": 34, "minus-eight": 38, "minus-max": 38 };

    let currentTextLightness = type === 'alt'
      ? (prefersDark ? defAltLightDark[step] : defAltLightLight[step])
      : (prefersDark ? defOnLightDark[step] : defOnLightLight[step]);

    if (updatedLightnessValues[onKey]) {
      const updated = updatedLightnessValues[onKey];
      currentTextLightness = prefersDark ? updated.dark : updated.light;
    }

    const bgHex = bgColor;
    const currentTextHex = hslToHex(scaleHSL.h, scaleHSL.s, currentTextLightness);
    const currentRatio = getContrastRatio(currentTextHex, bgHex);

    // If already passing, do nothing
    if (currentRatio >= targetRatio) {
      console.log(`Fixed accessibility for ${scalePrefix}-${step}-${type}: ${currentTextLightness}% lightness`);
      return;
    }

    const options = [0, 4, 8, 16, 20, 24, 28, 32, 36, 40, 45, 64, 70, 78, 80, 82, 84, 86, 88, 90, 92, 94, 95, 96, 98, 100];
    const candidates = options.map(L => {
      const hex = hslToHex(scaleHSL.h, scaleHSL.s, L);
      return { L, ratio: getContrastRatio(hex, bgHex) };
    });
    const passing = candidates.filter(c => c.ratio >= targetRatio);

    let chosen = null;
    if (passing.length) {
      chosen = passing.reduce((best, cur) => {
        const dCur = Math.abs(cur.L - currentTextLightness);
        if (!best) return cur;
        const dBest = Math.abs(best.L - currentTextLightness);
        if (dCur < dBest) return cur;
        if (dCur > dBest) return best;
        // tie-breaker: higher ratio
        return cur.ratio > best.ratio ? cur : best;
      }, null);
    } else {
      // Snap to extreme that gives higher ratio
      const e0 = candidates.find(c => c.L === 0);
      const e100 = candidates.find(c => c.L === 100);
      chosen = (e0 && e100) ? (e0.ratio >= e100.ratio ? e0 : e100) : (e0 || e100);
    }

    const suggestedLightness = chosen ? chosen.L : currentTextLightness;

    // Find closest predefined lightness value
    const lightnessOptions = [0, 4, 8, 16, 20, 24, 28, 32, 36, 40, 45, 64, 70, 78, 80, 82, 84, 86, 88, 90, 92, 94, 95, 96, 98, 100];
    const closestLightness = lightnessOptions.reduce((prev, curr) =>
      Math.abs(curr - suggestedLightness) < Math.abs(prev - suggestedLightness) ? curr : prev
    );

    // Get original lightness values for the other mode
    const originalValues = type === 'alt' ?
      (prefersDark ?
        { "original": 84, "plus-max": 78, "plus-eight": 70, "plus-seven": 64, "plus-six": 96, "plus-five": 86, "plus-four": 92, "plus-three": 98, "plus-two": 92, "plus-one": 98, "base": 84, "minus-one": 90, "minus-two": 92, "minus-three": 96, "minus-four": 2, "minus-five": 20, "minus-six": 26, "minus-seven": 34, "minus-eight": 38, "minus-max": 38 }[step] :
        { "original": 88, "plus-max": 20, "plus-eight": 24, "plus-seven": 28, "plus-six": 26, "plus-five": 40, "plus-four": 4, "plus-three": 10, "plus-two": 6, "plus-one": 95, "base": 88, "minus-one": 82, "minus-two": 78, "minus-three": 74, "minus-four": 72, "minus-five": 78, "minus-six": 82, "minus-seven": 84, "minus-eight": 86, "minus-max": 88 }[step]) :
      (prefersDark ?
        { "original": 100, "plus-max": 100, "plus-eight": 88, "plus-seven": 80, "plus-six": 72, "plus-five": 72, "plus-four": 80, "plus-three": 78, "plus-two": 80, "plus-one": 80, "base": 100, "minus-one": 98, "minus-two": 98, "minus-three": 98, "minus-four": 2, "minus-five": 2, "minus-six": 8, "minus-seven": 8, "minus-eight": 4, "minus-max": 0 }[step] :
        { "original": 100, "plus-max": 0, "plus-eight": 4, "plus-seven": 8, "plus-six": 16, "plus-five": 20, "plus-four": 24, "plus-three": 20, "plus-two": 16, "plus-one": 100, "base": 100, "minus-one": 94, "minus-two": 90, "minus-three": 86, "minus-four": 84, "minus-five": 88, "minus-six": 94, "minus-seven": 96, "minus-eight": 98, "minus-max": 100 }[step]);

    // Create new light-dark value
    const newValue = prefersDark ?
      `light-dark(hsl(var(--op-color-${scalePrefix}-h) var(--op-color-${scalePrefix}-s) ${originalValues}%), hsl(var(--op-color-${scalePrefix}-h) var(--op-color-${scalePrefix}-s) ${closestLightness}%))` :
      `light-dark(hsl(var(--op-color-${scalePrefix}-h) var(--op-color-${scalePrefix}-s) ${closestLightness}%), hsl(var(--op-color-${scalePrefix}-h) var(--op-color-${scalePrefix}-s) ${originalValues}%))`;

    // Update the CSS variable
    const varName = `--op-color-${scalePrefix}-on-${step}${type === 'alt' ? '-alt' : ''}`;
    document.documentElement.style.setProperty(varName, newValue);

    // Store the updated lightness values
    const key = `${scalePrefix}-${step}-${type}`;
    const prev = updatedLightnessValues[key];
    const prevLight = prev && typeof prev.light === 'number' ? prev.light : (type === 'alt' ? (prefersDark ? defAltLightLight[step] : defAltLightLight[step]) : (prefersDark ? defOnLightLight[step] : defOnLightLight[step]));
    const prevDark = prev && typeof prev.dark === 'number' ? prev.dark : (type === 'alt' ? (prefersDark ? defAltLightDark[step] : defAltLightDark[step]) : (prefersDark ? defOnLightDark[step] : defOnLightDark[step]));

    if (prefersDark) {
      updatedLightnessValues[key] = {
        light: prev ? prev.light : prevLight,
        dark: suggestedLightness,
        updated: Date.now()
      };
    } else {
      updatedLightnessValues[key] = {
        light: suggestedLightness,
        dark: prev ? prev.dark : prevDark,
        updated: Date.now()
      };
    }
    saveOverridesToStorage();
    saveOverridesToStorage();

    // Update accessibility indicators immediately
    updateAccessibilityIndicators(scalePrefix, step);

    console.log(`Fixed accessibility for ${scalePrefix}-${step}-${type}: ${closestLightness}% lightness`);

  } catch (error) {
    console.warn(`Failed to fix accessibility for ${scalePrefix}-${step}-${type}:`, error);
  }
}

// Update all accessibility indicators
function updateAllAccessibilityIndicators() {
  Object.values(colorScales).forEach((scale) => {
    colorSteps.forEach((step) => {
      if (step !== "original") { // Skip original step
        updateAccessibilityIndicators(scale.prefix, step);
      }
    });
  });
}

// Helper functions for Optics contrast calculations

// Convert HSL to hex color
function hslToHex(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;

  // Special case: lightness = 0 should always be black
  if (l === 0) {
    return '#000000';
  }

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  const result = (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );

  return result;
}

// Extract lightness from computed RGB
function rgbToLightness(rgb) {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return 50;

  const [, r, g, b] = match.map(Number);
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  return ((max + min) / 2) * 100;
}

// Get scale HSL from computed styles
function getScaleHSL(scalePrefix) {
  if (!scalePrefix) {
    return null;
  }

  const computedStyle = getComputedStyle(document.documentElement);
  const hValue = computedStyle.getPropertyValue(`--op-color-${scalePrefix}-h`).trim();
  const sValue = computedStyle.getPropertyValue(`--op-color-${scalePrefix}-s`).trim();
  const lValue = computedStyle.getPropertyValue(`--op-color-${scalePrefix}-l`).trim();

  const h = parseInt(hValue);
  const s = parseInt(sValue);
  const l = parseInt(lValue);

  if (isNaN(h) || isNaN(s) || h === null || h === undefined || s === null || s === undefined) {
    return null;
  }

  return { h, s, l };
}

// Optics on color values based on actual system specifications
// Removed old color calculation functions - using light-dark() in CSS

// Generate color variables for copying - HSL base values only
function generateColorVariables() {
  const variablesContainer = document.getElementById("color-variables-output");
  if (!variablesContainer) return;

  let css = ":root {\n";

  Object.values(colorScales).forEach((scale) => {
    css += `  /* ${scale.name} Scale */\n`;

    // Get the current HSL values from CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const h = computedStyle
      .getPropertyValue(`--op-color-${scale.prefix}-h`)
      .trim();
    const s = computedStyle
      .getPropertyValue(`--op-color-${scale.prefix}-s`)
      .trim();
    const l = computedStyle
      .getPropertyValue(`--op-color-${scale.prefix}-l`)
      .trim();

    css += `  --op-color-${scale.prefix}-h: ${h};\n`;
    css += `  --op-color-${scale.prefix}-s: ${s};\n`;
    css += `  --op-color-${scale.prefix}-l: ${l};\n`;
    css += "\n";
  });

  css += "}";

  variablesContainer.textContent = css;
}

// Watch for changes in root variables
function watchForVariableChanges() {
  const observer = new MutationObserver(() => {
    // Batch updates when styles change
    scheduleUpdate({ regenerateVars: true, updateIndicators: true });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  // Also watch for programmatic style changes
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (
    property,
    value,
    priority
  ) {
    const result = originalSetProperty.call(this, property, value, priority);
    if (
      property.startsWith("--op-color-") &&
      (property.includes("-h") || property.includes("-s") || property.includes("-l"))
    ) {
      scheduleUpdate({ regenerateVars: true, updateIndicators: true });
    }
    return result;
  };
}

// React to system theme changes (light/dark)
function setupThemeChangeListener() {
  try {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Batch updates for new scheme flip
      scheduleUpdate({ regenerateVars: true, updateIndicators: true });
    };
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(handleChange);
    }
  } catch (_) { }
}

// Generate CSS classes first
generateColorClasses();

// Generate all color variables
generateAllColorVariables();

// Load and apply overrides immediately
loadOverridesFromStorage();
applyOverridesToCSS();

// Initialize HSL controls (prepopulate from CSS or storage) after arrays are defined

// HSL input controls persistence
const HSL_STORAGE_KEY = 'opticsHSLBaseValues';
const hslInputs = [
  { idH: 'hsl-primary-h', idS: 'hsl-primary-s', idL: 'hsl-primary-l', prefix: 'primary' },
  { idH: 'hsl-neutral-h', idS: 'hsl-neutral-s', idL: 'hsl-neutral-l', prefix: 'neutral' },
  { idH: 'hsl-alerts-warning-h', idS: 'hsl-alerts-warning-s', idL: 'hsl-alerts-warning-l', prefix: 'alerts-warning' },
  { idH: 'hsl-alerts-danger-h', idS: 'hsl-alerts-danger-s', idL: 'hsl-alerts-danger-l', prefix: 'alerts-danger' },
  { idH: 'hsl-alerts-info-h', idS: 'hsl-alerts-info-s', idL: 'hsl-alerts-info-l', prefix: 'alerts-info' },
  { idH: 'hsl-alerts-notice-h', idS: 'hsl-alerts-notice-s', idL: 'hsl-alerts-notice-l', prefix: 'alerts-notice' },
];

function loadHSLFromStorage() {
  try {
    const raw = localStorage.getItem(HSL_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (_) { return {}; }
}

function saveHSLToStorage(values) {
  try { localStorage.setItem(HSL_STORAGE_KEY, JSON.stringify(values)); } catch (_) { }
}

function initHSLControls() {
  const stored = loadHSLFromStorage();
  // Apply any stored HSL values to CSS variables on load so UI matches persisted state
  Object.keys(stored).forEach((prefix) => {
    const v = stored[prefix];
    if (!v) return;
    if (typeof v.h === 'number') {
      document.documentElement.style.setProperty(`--op-color-${prefix}-h`, `${v.h}`);
    }
    if (typeof v.s === 'number') {
      document.documentElement.style.setProperty(`--op-color-${prefix}-s`, `${v.s}%`);
    }
    if (typeof v.l === 'number') {
      document.documentElement.style.setProperty(`--op-color-${prefix}-l`, `${v.l}%`);
    }
  });
  // After applying stored values, schedule a refresh
  if (Object.keys(stored).length) {
    scheduleUpdate({ regenerateVars: true, updateIndicators: true });
  }
  hslInputs.forEach(({ idH, idS, idL, prefix }) => {
    const elH = document.getElementById(idH);
    const elS = document.getElementById(idS);
    const elL = document.getElementById(idL);
    if (!elH || !elS || !elL) return;
    const cur = stored[prefix] || {};
    // Fallback to current CSS vars if no stored
    const live = getScaleHSL(prefix) || { h: 0, s: 0, l: 0 };
    elH.value = typeof cur.h === 'number' ? cur.h : live.h;
    elS.value = typeof cur.s === 'number' ? cur.s : live.s;
    elL.value = typeof cur.l === 'number' ? cur.l : live.l;

    const handleChange = () => {
      const values = loadHSLFromStorage();
      values[prefix] = {
        h: Math.max(0, Math.min(360, parseInt(elH.value || '0'))),
        s: Math.max(0, Math.min(100, parseInt(elS.value || '0'))),
        l: Math.max(0, Math.min(100, parseInt(elL.value || '0'))),
      };
      saveHSLToStorage(values);
      // Apply to CSS vars
      document.documentElement.style.setProperty(`--op-color-${prefix}-h`, `${values[prefix].h}`);
      document.documentElement.style.setProperty(`--op-color-${prefix}-s`, `${values[prefix].s}%`);
      document.documentElement.style.setProperty(`--op-color-${prefix}-l`, `${values[prefix].l}%`);
      // Batch refresh
      scheduleUpdate({ regenerateVars: true, updateIndicators: true });
    };
    elH.addEventListener('input', handleChange);
    elS.addEventListener('input', handleChange);
    elL.addEventListener('input', handleChange);
  });
}

// Populate all color grids
Object.keys(colorScales).forEach((scaleKey) => {
  populateColorGrid(scaleKey);
});

// Setup variable generation and watching
setTimeout(() => {
  // Schedule initial full refresh instead of immediate heavy calls
  scheduleUpdate({ regenerateVars: true, updateIndicators: true });
  watchForVariableChanges();
  setupThemeChangeListener();
  initHSLControls();
}, 500);

// Copy variables function
function copyVariables() {
  const output = document.getElementById("color-variables-output");
  const text = output.textContent;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const button = document.querySelector(".copy-button");
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.style.background = "#28a745";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "#007bff";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      const button = document.querySelector(".copy-button");
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.style.background = "#28a745";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "#007bff";
      }, 2000);
    });
}

// Build tokens JSON from current UI state (HSL + overrides)
function buildTokensJSON() {
  // Helper function to get live HSL values from CSS
  function getLiveHSLValues(scalePrefix) {
    const computedStyle = getComputedStyle(document.documentElement);
    const h = parseInt(
      computedStyle.getPropertyValue(`--op-color-${scalePrefix}-h`).trim()
    );
    const s = parseInt(
      computedStyle.getPropertyValue(`--op-color-${scalePrefix}-s`).trim()
    );
    const l = parseInt(
      computedStyle.getPropertyValue(`--op-color-${scalePrefix}-l`).trim()
    );
    return { h, s, l };
  }

  // Lightness steps mapping - separate for light and dark modes
  const lightnessSteps = {
    light: {
      original: null, // Uses base lightness
      "plus-max": 100,
      "plus-eight": 98,
      "plus-seven": 96,
      "plus-six": 94,
      "plus-five": 90,
      "plus-four": 84,
      "plus-three": 70,
      "plus-two": 64,
      "plus-one": 45,
      base: 40,
      "minus-one": 36,
      "minus-two": 32,
      "minus-three": 28,
      "minus-four": 24,
      "minus-five": 20,
      "minus-six": 16,
      "minus-seven": 8,
      "minus-eight": 4,
      "minus-max": 0,
    },
    dark: {
      original: null, // Uses base lightness
      "plus-max": 12,
      "plus-eight": 14,
      "plus-seven": 16,
      "plus-six": 20,
      "plus-five": 24,
      "plus-four": 26,
      "plus-three": 29,
      "plus-two": 32,
      "plus-one": 35,
      base: 38,
      "minus-one": 40,
      "minus-two": 45,
      "minus-three": 48,
      "minus-four": 52,
      "minus-five": 64,
      "minus-six": 72,
      "minus-seven": 80,
      "minus-eight": 88,
      "minus-max": 100,
    },
  };

  // Convert HSL to hex
  function hslToHex(h, s, l) {
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  // Optics on color calculation using actual system values
  function getJSONOpticsOnColor(h, s, step, mode = "light") {
    const onLightness = {
      light: {
        "plus-max": 0,
        "plus-eight": 4,
        "plus-seven": 8,
        "plus-six": 16,
        "plus-five": 20,
        "plus-four": 24,
        "plus-three": 20,
        "plus-two": 16,
        "plus-one": 100,
        base: 100,
        "minus-one": 94,
        "minus-two": 90,
        "minus-three": 86,
        "minus-four": 84,
        "minus-five": 88,
        "minus-six": 94,
        "minus-seven": 96,
        "minus-eight": 98,
        "minus-max": 100,
        original: 100,
      },
      dark: {
        "plus-max": 100,
        "plus-eight": 88,
        "plus-seven": 80,
        "plus-six": 72,
        "plus-five": 72,
        "plus-four": 80,
        "plus-three": 78,
        "plus-two": 80,
        "plus-one": 80,
        base: 100,
        "minus-one": 98,
        "minus-two": 98,
        "minus-three": 98,
        "minus-four": 2,
        "minus-five": 2,
        "minus-six": 8,
        "minus-seven": 8,
        "minus-eight": 4,
        "minus-max": 0,
        original: 100,
      },
    };
    return hslToHex(h, s, onLightness[mode][step] || 100);
  }

  // Optics on-alt color calculation using actual system values
  function getJSONOpticsOnAltColor(h, s, step, mode = "light") {
    const onAltLightness = {
      light: {
        "plus-max": 20,
        "plus-eight": 24,
        "plus-seven": 28,
        "plus-six": 26,
        "plus-five": 40,
        "plus-four": 4,
        "plus-three": 10,
        "plus-two": 6,
        "plus-one": 95,
        base: 88,
        "minus-one": 82,
        "minus-two": 78,
        "minus-three": 74,
        "minus-four": 72,
        "minus-five": 78,
        "minus-six": 82,
        "minus-seven": 84,
        "minus-eight": 86,
        "minus-max": 88,
        original: 88,
      },
      dark: {
        "plus-max": 78,
        "plus-eight": 70,
        "plus-seven": 64,
        "plus-six": 96,
        "plus-five": 86,
        "plus-four": 92,
        "plus-three": 98,
        "plus-two": 92,
        "plus-one": 98,
        base: 84,
        "minus-one": 90,
        "minus-two": 92,
        "minus-three": 96,
        "minus-four": 2,
        "minus-five": 20,
        "minus-six": 26,
        "minus-seven": 34,
        "minus-eight": 38,
        "minus-max": 38,
        original: 84,
      },
    };
    return hslToHex(h, s, onAltLightness[mode][step] || 88);
  }

  // Generate complete color scale for specific mode
  function generateScale(scaleName, scaleData, mode = "light") {
    const { h, s, l } = scaleData;
    const scale = {
      original: {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-original)` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: hslToHex(h, s, l),
      },
      plus: {},
      minus: {},
      base: {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-base)` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: hslToHex(h, s, lightnessSteps[mode].base),
      },
      on: {
        plus: {},
        minus: {},
        base: {
          $codeSyntax: { WEB: `var(--op-color-${scaleName}-on-base)` },
          $scopes: ["ALL_SCOPES"],
          $type: "color",
          $value: getJSONOpticsOnColor(h, s, "base", mode),
        },
        "base-alt": {
          $codeSyntax: { WEB: `var(--op-color-${scaleName}-on-base-alt)` },
          $scopes: ["ALL_SCOPES"],
          $type: "color",
          $value: getJSONOpticsOnAltColor(h, s, "base", mode),
        },
      },
    };

    // Generate plus steps
    [
      "max",
      "eight",
      "seven",
      "six",
      "five",
      "four",
      "three",
      "two",
      "one",
    ].forEach((step) => {
      const stepKey = `plus-${step}`;
      const lightness = lightnessSteps[mode][stepKey];

      scale.plus[step] = {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-${stepKey})` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: hslToHex(h, s, lightness),
      };

      scale.on.plus[step] = {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-on-${stepKey})` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: getJSONOpticsOnColor(h, s, stepKey, mode),
      };

      scale.on.plus[`${step}-alt`] = {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-on-${stepKey}-alt)` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: getJSONOpticsOnAltColor(h, s, stepKey, mode),
      };
    });

    // Generate minus steps
    [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "max",
    ].forEach((step) => {
      const stepKey = `minus-${step}`;
      const lightness = lightnessSteps[mode][stepKey];

      scale.minus[step] = {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-${stepKey})` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: hslToHex(h, s, lightness),
      };

      scale.on.minus[step] = {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-on-${stepKey})` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: getJSONOpticsOnColor(h, s, stepKey, mode),
      };

      scale.on.minus[`${step}-alt`] = {
        $codeSyntax: { WEB: `var(--op-color-${scaleName}-on-${stepKey}-alt)` },
        $scopes: ["ALL_SCOPES"],
        $type: "color",
        $value: getJSONOpticsOnAltColor(h, s, stepKey, mode),
      };
    });

    return scale;
  }

  // Get live HSL values and generate output
  const liveHSL = {
    primary: getLiveHSLValues("primary"),
    neutral: getLiveHSLValues("neutral"),
    "alerts-warning": getLiveHSLValues("alerts-warning"),
    "alerts-danger": getLiveHSLValues("alerts-danger"),
    "alerts-info": getLiveHSLValues("alerts-info"),
    "alerts-notice": getLiveHSLValues("alerts-notice"),
  };

  // Generate Primitive Colors section with live HSL values
  function generatePrimitiveColors() {
    return {
      "op-color": {
        white: {
          $codeSyntax: { WEB: "var(--op-color-white)" },
          $scopes: ["ALL_SCOPES"],
          $type: "color",
          $value: "#ffffff",
        },
        black: {
          $codeSyntax: { WEB: "var(--op-color-black)" },
          $scopes: ["ALL_SCOPES"],
          $type: "color",
          $value: "#000000",
        },
      },
      "op-color-primary": {
        h: {
          $codeSyntax: { WEB: "var(--op-color-primary-h)" },
          $scopes: ["ALL_SCOPES"],
          $type: "float",
          $value: liveHSL.primary.h,
        },
        s: {
          $codeSyntax: { WEB: "var(--op-color-primary-s)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL.primary.s}%`,
        },
        l: {
          $codeSyntax: { WEB: "var(--op-color-primary-l)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL.primary.l}%`,
        },
      },
      "op-color-neutral": {
        h: {
          $codeSyntax: { WEB: "var(--op-color-neutral-h)" },
          $scopes: ["ALL_SCOPES"],
          $type: "float",
          $value: liveHSL.neutral.h,
        },
        s: {
          $codeSyntax: { WEB: "var(--op-color-neutral-s)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL.neutral.s}%`,
        },
        l: {
          $codeSyntax: { WEB: "var(--op-color-neutral-l)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL.neutral.l}%`,
        },
      },
      "op-color-alerts-warning": {
        h: {
          $codeSyntax: { WEB: "var(--op-color-alerts-warning-h)" },
          $scopes: ["ALL_SCOPES"],
          $type: "float",
          $value: liveHSL["alerts-warning"].h,
        },
        s: {
          $codeSyntax: { WEB: "var(--op-color-alerts-warning-s)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-warning"].s}%`,
        },
        l: {
          $codeSyntax: { WEB: "var(--op-color-alerts-warning-l)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-warning"].l}%`,
        },
      },
      "op-color-alerts-danger": {
        h: {
          $codeSyntax: { WEB: "var(--op-color-alerts-danger-h)" },
          $scopes: ["ALL_SCOPES"],
          $type: "float",
          $value: liveHSL["alerts-danger"].h,
        },
        s: {
          $codeSyntax: { WEB: "var(--op-color-alerts-danger-s)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-danger"].s}%`,
        },
        l: {
          $codeSyntax: { WEB: "var(--op-color-alerts-danger-l)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-danger"].l}%`,
        },
      },
      "op-color-alerts-info": {
        h: {
          $codeSyntax: { WEB: "var(--op-color-alerts-info-h)" },
          $scopes: ["ALL_SCOPES"],
          $type: "float",
          $value: liveHSL["alerts-info"].h,
        },
        s: {
          $codeSyntax: { WEB: "var(--op-color-alerts-info-s)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-info"].s}%`,
        },
        l: {
          $codeSyntax: { WEB: "var(--op-color-alerts-info-l)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-info"].l}%`,
        },
      },
      "op-color-alerts-notice": {
        h: {
          $codeSyntax: { WEB: "var(--op-color-alerts-notice-h)" },
          $scopes: ["ALL_SCOPES"],
          $type: "float",
          $value: liveHSL["alerts-notice"].h,
        },
        s: {
          $codeSyntax: { WEB: "var(--op-color-alerts-notice-s)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-notice"].s}%`,
        },
        l: {
          $codeSyntax: { WEB: "var(--op-color-alerts-notice-l)" },
          $scopes: ["ALL_SCOPES"],
          $type: "string",
          $value: `${liveHSL["alerts-notice"].l}%`,
        },
      },
    };
  }

  // Generate Primitive Variables section
  function generatePrimitiveVariables() {
    return {
      "op-space": {
        "3x-small": {
          $codeSyntax: { WEB: "var(--op-space-3x-small)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 2,
        },
        "2x-small": {
          $codeSyntax: { WEB: "var(--op-space-2x-small)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 4,
        },
        "x-small": {
          $codeSyntax: { WEB: "var(--op-space-x-small)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 8,
        },
        small: {
          $codeSyntax: { WEB: "var(--op-space-small)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 12,
        },
        medium: {
          $codeSyntax: { WEB: "var(--op-space-medium)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 16,
        },
        large: {
          $codeSyntax: { WEB: "var(--op-space-large)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 24,
        },
        "x-large": {
          $codeSyntax: { WEB: "var(--op-space-x-large)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 32,
        },
        "2x-large": {
          $codeSyntax: { WEB: "var(--op-space-2x-large)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 40,
        },
        "3x-large": {
          $codeSyntax: { WEB: "var(--op-space-3x-large)" },
          $scopes: [
            "WIDTH_HEIGHT",
            "GAP",
            "PARAGRAPH_SPACING",
            "PARAGRAPH_INDENT",
          ],
          $type: "float",
          $value: 48,
        },
      },
      "op-font": {
        "2x-small": {
          $codeSyntax: { WEB: "var(--op-font-2x-small)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 10,
        },
        "x-small": {
          $codeSyntax: { WEB: "var(--op-font-x-small)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 12,
        },
        small: {
          $codeSyntax: { WEB: "var(--op-font-small)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 14,
        },
        medium: {
          $codeSyntax: { WEB: "var(--op-font-medium)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 16,
        },
        large: {
          $codeSyntax: { WEB: "var(--op-font-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 18,
        },
        "x-large": {
          $codeSyntax: { WEB: "var(--op-font-x-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 20,
        },
        "2x-large": {
          $codeSyntax: { WEB: "var(--op-font-2x-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 24,
        },
        "3x-large": {
          $codeSyntax: { WEB: "var(--op-font-3x-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 30,
        },
        "4x-large": {
          $codeSyntax: { WEB: "var(--op-font-4x-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 36,
        },
        "5x-large": {
          $codeSyntax: { WEB: "var(--op-font-5x-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 48,
        },
        "6x-large": {
          $codeSyntax: { WEB: "var(--op-font-6x-large)" },
          $scopes: ["FONT_SIZE"],
          $type: "float",
          $value: 60,
        },
      },
      "op-z-index": {
        hide: {
          $codeSyntax: { WEB: "var(--op-z-index-hide)" },
          $type: "float",
          $value: -1,
        },
        auto: {
          $codeSyntax: { WEB: "var(--op-z-index-auto)" },
          $type: "float",
          $value: 0,
        },
        base: {
          $codeSyntax: { WEB: "var(--op-z-index-base)" },
          $type: "float",
          $value: 1,
        },
        docked: {
          $codeSyntax: { WEB: "var(--op-z-index-docked)" },
          $type: "float",
          $value: 10,
        },
        dropdown: {
          $codeSyntax: { WEB: "var(--op-z-index-dropdown)" },
          $type: "float",
          $value: 900,
        },
        sticky: {
          $codeSyntax: { WEB: "var(--op-z-index-sticky)" },
          $type: "float",
          $value: 100,
        },
        banner: {
          $codeSyntax: { WEB: "var(--op-z-index-banner)" },
          $type: "float",
          $value: 200,
        },
        overlay: {
          $codeSyntax: { WEB: "var(--op-z-index-overlay)" },
          $type: "float",
          $value: 300,
        },
        modal: {
          $codeSyntax: { WEB: "var(--op-z-index-modal)" },
          $type: "float",
          $value: 400,
        },
        popover: {
          $codeSyntax: { WEB: "var(--op-z-index-popover)" },
          $type: "float",
          $value: 600,
        },
        skipLink: {
          $codeSyntax: { WEB: "var(--op-z-index-skipLink)" },
          $type: "float",
          $value: 700,
        },
        toast: {
          $codeSyntax: { WEB: "var(--op-z-index-toast)" },
          $type: "float",
          $value: 800,
        },
        tooltip: {
          $codeSyntax: { WEB: "var(--op-z-index-tooltip)" },
          $type: "float",
          $value: 1000,
        },
      },
    };
  }

  // Generate Components section (simplified version)
  function generateComponents() {
    return {
      "text pair": {
        font: {
          small: {
            $codeSyntax: { WEB: "var(--_op-text-pair-font-size-small)" },
            $scopes: ["FONT_SIZE"],
            $type: "float",
            $libraryName: "",
            $collectionName: "Primitive Variables",
            $value: "{op-font.small}",
          },
          medium: {
            $codeSyntax: { WEB: "var(--_op-text-pair-font-size-medium)" },
            $scopes: ["FONT_SIZE"],
            $type: "float",
            $libraryName: "",
            $collectionName: "Primitive Variables",
            $value: "{op-font.medium}",
          },
          large: {
            $codeSyntax: { WEB: "var(--_op-text-pair-font-size-large)" },
            $scopes: ["FONT_SIZE"],
            $type: "float",
            $libraryName: "",
            $collectionName: "Primitive Variables",
            $value: "{op-font.large}",
          },
        },
      },
    };
  }

  const output = [
    {
      "Color Styles": {
        modes: {
          Light: {
            primary: generateScale("primary", liveHSL.primary, "light"),
            neutral: generateScale("neutral", liveHSL.neutral, "light"),
            alerts: {
              warning: generateScale(
                "alerts-warning",
                liveHSL["alerts-warning"],
                "light"
              ),
              danger: generateScale(
                "alerts-danger",
                liveHSL["alerts-danger"],
                "light"
              ),
              info: generateScale(
                "alerts-info",
                liveHSL["alerts-info"],
                "light"
              ),
              notice: generateScale(
                "alerts-notice",
                liveHSL["alerts-notice"],
                "light"
              ),
            },
          },
          Dark: {
            primary: generateScale("primary", liveHSL.primary, "dark"),
            neutral: generateScale("neutral", liveHSL.neutral, "dark"),
            alerts: {
              warning: generateScale(
                "alerts-warning",
                liveHSL["alerts-warning"],
                "dark"
              ),
              danger: generateScale(
                "alerts-danger",
                liveHSL["alerts-danger"],
                "dark"
              ),
              info: generateScale(
                "alerts-info",
                liveHSL["alerts-info"],
                "dark"
              ),
              notice: generateScale(
                "alerts-notice",
                liveHSL["alerts-notice"],
                "dark"
              ),
            },
          },
        },
      },
      Components: {
        modes: {
          "Mode 1": generateComponents(),
        },
      },
      "Primitive Colors": {
        modes: {
          "Light Theme": generatePrimitiveColors(),
        },
      },
      "Primitive Variables": {
        modes: {
          Value: generatePrimitiveVariables(),
        },
      },
    },
  ];

  return output;
}

// Generate and download JSON tokens file
function generateAndDownloadJSON() {
  const output = buildTokensJSON();
  const jsonString = JSON.stringify(output, null, 2);

  // Create and download the JSON file
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "optics-tokens-generated.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Update button feedback
  const button = document.querySelectorAll(".copy-button")[1]; // Second button
  const originalText = button.textContent;
  button.textContent = "Downloaded!";
  button.style.background = "#28a745";

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = "#007bff";
  }, 2000);
}

// Preview JSON in the variables output pane
function previewJSON() {
  try {
    const data = buildTokensJSON();
    const output = document.getElementById('color-variables-output');
    if (output) {
      output.textContent = JSON.stringify(data, null, 2);
    }
  } catch (e) {
    console.warn('Failed to preview JSON', e);
  }
}
