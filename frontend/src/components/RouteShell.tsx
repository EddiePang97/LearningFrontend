import type { ReactNode } from 'react';

type RouteShellProps = {
  children: ReactNode;
  shellKey: string;
};

export const RouteShell = ({ children, shellKey }: RouteShellProps) => {
  return (
    <div
      key={shellKey}
      className="relative z-10 grow flex flex-col max-w-[1680px] mx-auto w-full p-4 md:p-6 xl:p-8 transition-all duration-700"
    >
      <main className="grow flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
};
