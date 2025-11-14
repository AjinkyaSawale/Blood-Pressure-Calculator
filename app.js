
export const BpCategory = { Low:'Low', Ideal:'Ideal', PreHigh:'PreHigh', High:'High' };

export function classify(systolic, diastolic) {
  if (systolic < 70 || systolic > 190 || diastolic < 40 || diastolic > 100 || systolic <= diastolic) {
    throw new RangeError("Invalid blood pressure input.");
  }
  if (systolic >= 140 || diastolic >= 90) return BpCategory.High;
  if (systolic >= 120 || diastolic >= 80) return BpCategory.PreHigh;
  if (systolic >= 90 && systolic <= 119 && diastolic >= 60 && diastolic <= 79) return BpCategory.Ideal;
  return BpCategory.Low;
}


export function pulsePressure(s, d) {
  const v = s - d;
  return { value: v, isWide: v > 60 };
}


import { ApplicationInsights } from '@microsoft/applicationinsights-web';
const ai = new ApplicationInsights({
  config: {
    connectionString: window.appInsightsCfg?.connectionString || "",
    disableExceptionTracking: false,
    enableAutoRouteTracking: true,
  },
});
try { ai.loadAppInsights(); } catch {}

function trackClassification(sys, dia, category, pp) {
  try {
    ai.trackEvent({ name: "BpClassified",
      properties: { category, wide: String(pp.isWide) },
      measurements: { systolic: sys, diastolic: dia, pulsePressure: pp.value }
    });
  } catch {}
}

// --- Wire up UI ---
const form = document.getElementById('bp-form');
const sysEl = document.getElementById('sys');
const diaEl = document.getElementById('dia');
const out = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const s = Number(sysEl.value), d = Number(diaEl.value);
  try {
    const cat = classify(s, d);
    const pp = pulsePressure(s, d);
    out.textContent = `Category: ${cat} | Pulse Pressure: ${pp.value} mmHg ${pp.isWide ? "(Wide)" : ""}`;
    trackClassification(s, d, cat, pp);
  } catch (err) {
    out.textContent = err.message;
  }
});
