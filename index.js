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
  swatch.className = `color-swatch ${colorClassName} ${
    isOriginal ? "original-color" : ""
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

  swatch.appendChild(main);

  return swatch;
}

function populateColorGrid(scaleKey) {
  const scale = colorScales[scaleKey];
  const grid = document.getElementById(`${scaleKey}-grid`);

  // Add all color steps
  colorSteps.forEach((step) => {
    grid.appendChild(createColorSwatch(scale, step));
  });
}

// Helper functions for Optics contrast calculations
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

// Optics on color values based on actual system specifications
function getOpticsOnColor(scalePrefix, step) {
  const scaleHSL = getScaleHSL(scalePrefix);

  // Optics on color lightness values (using light mode values)
  const onLightness = {
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
    original: 100, // Default for original
  };

  const lightness = onLightness[step] || 100;
  return hslToHex(scaleHSL.h, scaleHSL.s, lightness);
}

// Optics on-alt color values based on actual system specifications
function getOpticsOnAltColor(scalePrefix, step) {
  const scaleHSL = getScaleHSL(scalePrefix);

  // Optics on-alt color lightness values (using light mode values)
  const onAltLightness = {
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
    original: 88, // Default for original
  };

  const lightness = onAltLightness[step] || 88;
  return hslToHex(scaleHSL.h, scaleHSL.s, lightness);
}

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
    // Regenerate variables when styles change
    setTimeout(generateColorVariables, 100);
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
      (property.includes("-h") ||
        property.includes("-s") ||
        property.includes("-l"))
    ) {
      setTimeout(generateColorVariables, 100);
    }
    return result;
  };
}

// Generate CSS classes first
generateColorClasses();

// Populate all color grids
Object.keys(colorScales).forEach((scaleKey) => {
  populateColorGrid(scaleKey);
});

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

// Generate and download JSON tokens file
function generateAndDownloadJSON() {
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

  // Create and download the JSON file
  const jsonString = JSON.stringify(output, null, 2);
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

// Setup variable generation and watching
setTimeout(() => {
  generateColorVariables();
  watchForVariableChanges();
}, 500);
