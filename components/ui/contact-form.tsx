// components/ContactForm.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

// Styles specific to this form's animations and input labels
// We are NOT styling html, body, or #__next here.
const formSpecificGlobalStyles = `
  input:focus, textarea:focus { /* This can also be in globals.css if preferred for all inputs */
    outline: none !important;
    box-shadow: none !important;
    border-color: white !important; 
  }
  .slide-enter { transform: translateY(-30px); opacity: 0; }
  .slide-enter-active { transform: translateY(0); opacity: 1; transition: all 500ms ease; }
  .slide-exit { transform: translateY(0); opacity: 1; position: absolute; width: 100%; left: 0; } /* Ensure these are scoped or specific enough if moved to globals.css */
  .slide-exit-active { transform: translateY(30px); opacity: 0; transition: all 500ms ease; }
  .input-label { 
    font-size: 0.75rem; 
    font-weight: 600; 
    margin-bottom: 0.25rem; 
    color: #a0a0a0; 
  }
`;

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  message: string;
  services: string[];
}

interface FormStep {
  label: string;
  formField: keyof FormData | (keyof FormData)[];
  isRequired: boolean;
  type?: string;
  placeholder?: string;
  options?: string[];
}

const formSteps: FormStep[] = [
  {
    label: "Hva heter du?",
    formField: "name",
    isRequired: true,
    type: "text",
    placeholder: "Skriv inn navnet ditt"
  },
  {
    label: "Hva er e-postadressen din?",
    formField: "email",
    isRequired: true,
    type: "email",
    placeholder: "Skriv inn e-postadressen din"
  },
  {
    label: "Hva er telefonnummeret ditt?",
    formField: "phone",
    isRequired: false,
    type: "tel",
    placeholder: "Skriv inn telefonnummeret ditt"
  },
  {
    label: "Hvilket selskap representerer du?",
    formField: "company",
    isRequired: false,
    type: "text",
    placeholder: "Skriv inn selskapsnavnet"
  },
  {
    label: "Har du en nettside?",
    formField: "website",
    isRequired: false,
    type: "url",
    placeholder: "https://example.com"
  },
  {
    label: "Fortell oss om prosjektet ditt",
    formField: "message",
    isRequired: true,
    type: "textarea",
    placeholder: "Beskriv prosjektet ditt her..."
  }
];

export function ContactForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    message: '',
    services: []
  });
  const [stepError, setStepError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[activeStep]) {
      inputRefs.current[activeStep]?.focus();
    }
  }, [activeStep]);

  const validateStep = () => {
    setStepError('');
    const currentStepData = formSteps[activeStep];
    
    if (!currentStepData) return true;

    if (currentStepData.type === 'email' && currentStepData.isRequired) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData[currentStepData.formField as keyof FormData] as string)) {
        setStepError("Vennligst skriv inn en gyldig e-postadresse.");
        inputRefs.current[activeStep]?.focus();
        return false;
      }
    }

    if (currentStepData.type === 'url' && formData[currentStepData.formField as keyof FormData]) {
      try {
        new URL(formData[currentStepData.formField as keyof FormData] as string);
      } catch {
        setStepError("Vennligst skriv inn en gyldig nettside-URL (inkluder http:// eller https://).");
        inputRefs.current[activeStep]?.focus();
        return false;
      }
    }

    if (currentStepData.isRequired && !Array.isArray(currentStepData.formField) && 
      typeof formData[currentStepData.formField as keyof FormData] === 'string' && 
      !(formData[currentStepData.formField as keyof FormData] as string).trim()) {
      setStepError(`"${currentStepData.label}" er et påkrevd felt.`);
      inputRefs.current[activeStep]?.focus();
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep < formSteps.length - 1) {
        setActiveStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
    } catch (error) {
      setStepError('Det oppstod en feil ved innsending av skjemaet. Vennligst prøv igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-8">
        <div className="rounded-full bg-green-100 p-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold">Takk for din henvendelse!</h3>
        <p className="text-muted-foreground">
          Vi vil kontakte deg så snart som mulig.
        </p>
      </div>
    );
  }

  const currentStep = formSteps[activeStep];
  const isLastStep = activeStep === formSteps.length - 1;

  return (
    <div className="space-y-8 w-full max-w-lg mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">{currentStep.label}</h2>
        {stepError && (
          <p className="text-red-500 text-sm">{stepError}</p>
        )}
      </div>

      <div className="space-y-4">
        {currentStep.type === 'textarea' ? (
          <Textarea
            ref={(el) => {
              if (el) inputRefs.current[activeStep] = el;
            }}
            value={formData[currentStep.formField as keyof FormData] as string}
            onChange={(e) => {
              const field = currentStep.formField as keyof FormData;
              setFormData({ ...formData, [field]: e.target.value });
            }}
            placeholder={currentStep.placeholder}
            onKeyDown={handleKeyPress}
            rows={5}
            className="resize-none"
          />
        ) : (
          <Input
            ref={(el) => {
              if (el) inputRefs.current[activeStep] = el;
            }}
            type={currentStep.type}
            value={formData[currentStep.formField as keyof FormData] as string}
            onChange={(e) => {
              const field = currentStep.formField as keyof FormData;
              setFormData({ ...formData, [field]: e.target.value });
            }}
            placeholder={currentStep.placeholder}
            onKeyDown={handleKeyPress}
          />
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
          </Button>

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isLastStep ? (
              isSubmitting ? 'Sender...' : 'Send'
            ) : (
              <>
                Neste <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-2">
          {formSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx === activeStep ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactForm;