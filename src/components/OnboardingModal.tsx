import React, { useState } from 'react';
import { X, ChevronRight, Sparkles, RefreshCw, Shuffle, ShoppingBag, Award } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to ChoreWheel! 🎡",
      description: "The fun way to manage household chores with roommates.",
      icon: <Sparkles size={40} className="text-indigo-500" />,
      details: "Get ready to spin, trade, and earn rewards!"
    },
    {
      title: "Spin the Wheel",
      description: "Pick a chore and click the spin button to randomly assign it to a roommate.",
      icon: <RefreshCw size={40} className="text-blue-500" />,
      details: "The more you spin, the more fair rotation happens. Each roommate gets tracked fairly!"
    },
    {
      title: "Earn Points",
      description: "Complete chores to earn points. Harder chores earn more points!",
      icon: <Award size={40} className="text-amber-500" />,
      details: "Track your progress on the Leaderboard. Be the MVP of your household!"
    },
    {
      title: "Trade & Deal",
      description: "Don't like your chore? Trade it with a roommate directly!",
      icon: <Shuffle size={40} className="text-orange-500" />,
      details: "Both parties must agree to the trade. Fair and simple!"
    },
    {
      title: "Privilege Store",
      description: "Redeem your points for household privileges or rewards.",
      icon: <ShoppingBag size={40} className="text-emerald-500" />,
      details: "Create custom rewards like 'Pick next movie' or 'Free pass on chores'!"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="onboarding-overlay flex items-center justify-center z-50">
      <div className="onboarding-modal glass-card p-6 relative animate-zoomIn max-w-md w-full mx-4">
        <button 
          onClick={onClose} 
          className="btn-close-sketch absolute top-3 right-3" 
          title="Close"
        >
          <X size={14} />
        </button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="progress-bar bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
            <div 
              className="progress-fill bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <div className="onboarding-content text-center">
          <div className="mb-4 flex justify-center">
            {step.icon}
          </div>
          <h2 className="text-2xl font-bold font-header mb-2 text-indigo-950">
            {step.title}
          </h2>
          <p className="text-sm font-medium text-slate-700 mb-3">
            {step.description}
          </p>
          <p className="text-xs text-slate-600 italic leading-relaxed">
            {step.details}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 py-2 px-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold font-header text-xs rounded-lg transition-all border border-slate-400 disabled:border-slate-300"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-header text-xs rounded-lg transition-all flex items-center justify-center gap-1 border border-indigo-700"
          >
            {currentStep === steps.length - 1 ? "Get Started!" : "Next"}
            {currentStep < steps.length - 1 && <ChevronRight size={14} />}
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-2 justify-center mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`dot-indicator w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-indigo-600 w-4'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Skip Link */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-xs text-slate-500 hover:text-slate-700 underline font-medium"
        >
          Skip Tutorial
        </button>
      </div>
    </div>
  );
};
