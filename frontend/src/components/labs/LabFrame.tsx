import type { ComponentType, ReactNode } from 'react';

type LabFrameProps = {
  children: ReactNode;
  className?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
};

export const LabFrame = ({ children, className = '', icon: Icon, title }: LabFrameProps) => {
  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6 ${className}`.trim()}>
      <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Icon size={16} />
        {title}
      </div>
      {children}
    </div>
  );
};
