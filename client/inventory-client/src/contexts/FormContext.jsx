// FormContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { API_BASE_URL } from "../vars";
import { useForm, FormProvider as RHFProvider } from "react-hook-form";

const STORAGE_KEY = "nltac-wizard-data";

const FormContext = createContext();

export const useFormContextData = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("Must be used within FormProvider");
  return ctx;
};

export const FormProvider = ({ children }) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const methods = useForm({
    defaultValues: saved ? JSON.parse(saved) : {},
    mode: "onBlur",
  });

  const { watch, reset } = methods;
  
  // Auto-save to localStorage
  useEffect(() => {
    const subscription = watch((values) => {
      // ✅ strip out file fields before persisting
      const safeValues = { ...values };
      Object.keys(safeValues).forEach((key) => {
        if (
          safeValues[key] instanceof FileList ||
          safeValues[key] instanceof File
        ) {
          delete safeValues[key];
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeValues));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const resetForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    reset({}); // reset form after submit
  };

  const value = useMemo(
    () => ({ ...methods, resetForm }),
    [methods, resetForm]
  );

  return (
    <FormContext.Provider value={value}>
      <RHFProvider {...methods}>{children}</RHFProvider>
    </FormContext.Provider>
  );
};
