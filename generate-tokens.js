// Auto-generating Optics color tokens from HSL values
// This script runs automatically and generates a new export.json file

// Base HSL values for each color scale
const colorScales = {
  primary: { h: 216, s: 58, l: 48 },
  neutral: { h: 120, s: 6, l: 49 },
  warning: { h: 48, s: 100, l: 50 },
  danger: { h: 0, s: 99, l: 50 },
  info: { h: 216, s: 58, l: 48 },
  notice: { h: 133, s: 61, l: 52 }
};

// Lightness steps for each color level
const lightnessSteps = {
  'original': null, // Uses base lightness
  'plus-max': 100,
  'plus-eight': 98,
  'plus-seven': 96,
  'plus-six': 94,
  'plus-five': 90,
  'plus-four': 84,
  'plus-three': 70,
  'plus-two': 64,
  'plus-one': 45,
  'base': 40,
  'minus-one': 36,
  'minus-two': 32,
  'minus-three': 28,
  'minus-four': 24,
  'minus-five': 20,
  'minus-six': 16,
  'minus-seven': 8,
  'minus-eight': 4,
  'minus-max': 0
};

// Convert HSL to hex
function hslToHex(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Generate contrast colors (simplified logic)
function getContrastColor(lightness) {
  return lightness > 60 ? "#000000" : "#ffffff";
}

function getAltContrastColor(lightness, baseHue) {
  if (lightness > 80) return hslToHex(baseHue, 70, 20);
  if (lightness > 60) return hslToHex(baseHue, 60, 25);
  if (lightness > 40) return hslToHex(baseHue, 50, 85);
  return hslToHex(baseHue, 40, 90);
}

// Generate color scale structure
function generateColorScale(scaleName, scaleConfig) {
  const scale = {
    "original": {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-original)` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": hslToHex(scaleConfig.h, scaleConfig.s, scaleConfig.l)
    },
    "plus": {},
    "minus": {},
    "base": {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-base)` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": hslToHex(scaleConfig.h, scaleConfig.s, lightnessSteps.base)
    },
    "on": {
      "original": {
        "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-original)` },
        "$scopes": ["ALL_SCOPES"],
        "$type": "color",
        "$value": getContrastColor(scaleConfig.l)
      },
      "original-alt": {
        "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-original-alt)` },
        "$scopes": ["ALL_SCOPES"],
        "$type": "color",
        "$value": getAltContrastColor(scaleConfig.l, scaleConfig.h)
      },
      "base": {
        "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-base)` },
        "$scopes": ["ALL_SCOPES"],
        "$type": "color",
        "$value": getContrastColor(lightnessSteps.base)
      },
      "base-alt": {
        "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-base-alt)` },
        "$scopes": ["ALL_SCOPES"],
        "$type": "color",
        "$value": getAltContrastColor(lightnessSteps.base, scaleConfig.h)
      },
      "plus": {},
      "minus": {}
    }
  };

  // Generate plus steps
  ['max', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'].forEach(step => {
    const stepKey = `plus-${step}`;
    const lightness = lightnessSteps[stepKey];

    scale.plus[step] = {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-${stepKey})` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": hslToHex(scaleConfig.h, scaleConfig.s, lightness)
    };

    scale.on.plus[step] = {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-${stepKey})` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": getContrastColor(lightness)
    };

    scale.on.plus[`${step}-alt`] = {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-${stepKey}-alt)` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": getAltContrastColor(lightness, scaleConfig.h)
    };
  });

  // Generate minus steps
  ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'max'].forEach(step => {
    const stepKey = `minus-${step}`;
    const lightness = lightnessSteps[stepKey];

    scale.minus[step] = {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-${stepKey})` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": hslToHex(scaleConfig.h, scaleConfig.s, lightness)
    };

    scale.on.minus[step] = {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-${stepKey})` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": getContrastColor(lightness)
    };

    scale.on.minus[`${step}-alt`] = {
      "$codeSyntax": { "WEB": `var(--op-color-${scaleName}-on-${stepKey}-alt)` },
      "$scopes": ["ALL_SCOPES"],
      "$type": "color",
      "$value": getAltContrastColor(lightness, scaleConfig.h)
    };
  });

  return scale;
}

// Generate alert scales structure
function generateAlertScales() {
  const alerts = {};

  ['warning', 'danger', 'info', 'notice'].forEach(alertType => {
    const config = colorScales[alertType];
    alerts[alertType] = generateColorScale(`alerts-${alertType}`, config);
  });

  return alerts;
}

// Generate the complete token structure
function generateTokens() {
  const tokens = [{
    "Color Styles": {
      "modes": {
        "Light": {
          "primary": generateColorScale('primary', colorScales.primary),
          "neutral": generateColorScale('neutral', colorScales.neutral),
          "alerts": generateAlertScales()
        },
        "Dark": {
          "primary": generateColorScale('primary', colorScales.primary),
          "neutral": generateColorScale('neutral', colorScales.neutral),
          "alerts": generateAlertScales()
        }
      }
    }
  }];

  return tokens;
}

// Auto-run the generation
console.log('🎨 Generating Optics color tokens...');

const generatedTokens = generateTokens();
const jsonOutput = JSON.stringify(generatedTokens, null, 2);

// For CodeSandbox - create downloadable file
if (typeof window !== 'undefined') {
  // Browser environment (CodeSandbox)
  const blob = new Blob([jsonOutput], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = 'optics-tokens-generated.json';
  link.textContent = 'Download Generated Tokens JSON';
  link.style.cssText = 'display: block; margin: 20px; padding: 10px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; text-align: center;';

  document.body.insertBefore(link, document.body.firstChild);

  console.log('✅ Generated tokens ready for download!');
  console.log('📁 File size:', (jsonOutput.length / 1024).toFixed(2), 'KB');
} else {
  // Node.js environment
  const fs = require('fs');
  fs.writeFileSync('optics-tokens-generated.json', jsonOutput);
  console.log('✅ Generated optics-tokens-generated.json');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateTokens, colorScales, hslToHex };
}

console.log('🎨 Color generation complete!');
