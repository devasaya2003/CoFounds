'use client';

import React, { Fragment } from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <Fragment key={`step-${index}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              currentStep === index + 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className="h-1 flex-1 mx-2 bg-gray-200">
              <div
                className={`h-full bg-indigo-600 ${
                  currentStep > index + 1 ? 'w-full' : 'w-0'
                }`}
              ></div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}