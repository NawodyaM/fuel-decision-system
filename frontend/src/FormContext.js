import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'fuel-dashboard-draft-v2';
const DEFAULT_FORM = {
  IV_Vehicle_Type: '', IV_Fuel_Type: '', IV_Driving_Style: '',
  IV_Average_Speed: '', IV_Traffic_Type: '', IV_Fuel_Consumption_Rating: '',
  IV_Quick_Acceleration: '', IV_Sudden_Brakes: '', IV_Traffic_Congestion: '',
  IV_Stop_and_Go: '', IV_Distance_KM: '', weeklyAllocation: ''
};
const OPTION_LIMITS = {
  IV_Vehicle_Type: [1, 6], IV_Fuel_Type: [1, 2], IV_Driving_Style: [1, 3],
  IV_Average_Speed: [1, 5], IV_Traffic_Type: [1, 3], IV_Fuel_Consumption_Rating: [1, 3],
  IV_Quick_Acceleration: [0, 2], IV_Sudden_Brakes: [0, 2],
  IV_Traffic_Congestion: [1, 3], IV_Stop_and_Go: [0, 1]
};
const FormContext = createContext(null);

function restoreDraft() {
  const draft = { ...DEFAULT_FORM };
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return draft;
    for (const key of Object.keys(draft)) {
      const value = saved[key];
      if (typeof value !== 'string') continue;
      const limits = OPTION_LIMITS[key];
      if (limits) {
        if (/^\d$/.test(value) && Number(value) >= limits[0] && Number(value) <= limits[1]) draft[key] = value;
      } else if (value === '' || (value.trim() !== '' && Number.isFinite(Number(value)))) {
        draft[key] = value;
      }
    }
  } catch {
    // Invalid or unavailable storage must not prevent use of the form.
  }
  return draft;
}

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(restoreDraft);
  useEffect(() => {
    try {
      if (Object.keys(DEFAULT_FORM).every(key => formData[key] === DEFAULT_FORM[key])) {
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      }
    } catch {
      // Context still preserves inputs between pages when storage is blocked.
    }
  }, [formData]);

  const resetForm = () => setFormData({ ...DEFAULT_FORM });
  return <FormContext.Provider value={{ formData, setFormData, resetForm }}>{children}</FormContext.Provider>;
}

export const useFormDraft = () => useContext(FormContext);
