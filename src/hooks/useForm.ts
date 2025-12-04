import { useState } from 'react';

type ValidationRule<V> = (value: V) => string | undefined;

type FormRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

type FormState<T> = {
  [K in keyof T]: T[K];
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

function useForm<T extends Record<string, unknown>>(initialValues: T, rules: FormRules<T>) {
  const [formState, setFormState] = useState<FormState<T>>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const handleChange = (fieldName: keyof T) => (newValue: T[keyof T]) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: newValue,
    }));

    if (rules[fieldName]) {
      const fieldErrors = rules[fieldName]!.map((rule) => rule(newValue)).filter((error) => error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: fieldErrors.length > 0 ? fieldErrors[0] : undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors<T> = {};

    Object.keys(formState).forEach((key) => {
      const fieldName = key as keyof T;
      if (rules[fieldName]) {
        const fieldErrors = rules[fieldName]!.map((rule) => rule(formState[fieldName])).filter((error) => error);
        if (fieldErrors.length > 0) {
          newErrors[fieldName] = fieldErrors[0];
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (callback: () => void) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      callback();
    }
  };

  return {
    formState,
    errors,
    handleChange,
    handleSubmit,
  };
}

export default useForm;