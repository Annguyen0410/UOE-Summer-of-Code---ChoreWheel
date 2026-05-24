import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface QuickStartGuideProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ isVisible, onDismiss }) => {
  if (!isVisible) return null;

  const tips = [
    { icon: '🎡', title: 'Spin the Wheel', description: 'Select a chore, then spin to randomly assign it' },
    { icon: '👥', title: 'Add Roommates', description: 'Use the + button to add household members' },
    { icon: '⭐', title: 'Earn Points', description: 'Complete chores to earn points toward rewards' },
    { icon: '🎫', title: 'Redeem Rewards', description: 'Use points in the Coupon Store for privileges' },
  ];

  return (
    <div className="quick-start-banner">
      <div className="app-shell quick-start-banner-inner">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-indigo-600 flex-shrink-0" />
            <h3 className="font-bold font-header text-sm text-indigo-950">Quick Start Guide</h3>
          </div>
          <button
            onClick={onDismiss}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            title="Dismiss"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-indigo-200 p-3 text-xs"
            >
              <div className="text-lg mb-1">{tip.icon}</div>
              <p className="font-bold text-indigo-950 mb-1">{tip.title}</p>
              <p className="text-slate-600 leading-tight">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
