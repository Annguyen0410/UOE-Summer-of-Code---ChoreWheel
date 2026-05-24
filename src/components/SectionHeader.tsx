import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

const badgeColors = {
  blue: 'bg-blue-100 text-blue-900 border-blue-300',
  green: 'bg-green-100 text-green-900 border-green-300',
  amber: 'bg-amber-100 text-amber-900 border-amber-300',
  purple: 'bg-purple-100 text-purple-900 border-purple-300',
  red: 'bg-red-100 text-red-900 border-red-300',
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = 'blue'
}) => {
  return (
    <div className="section-header-wrapper">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          {icon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold font-header text-slate-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {badge && (
          <span className={`badge text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColors[badgeColor]} flex-shrink-0`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
