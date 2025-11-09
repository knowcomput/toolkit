
import React from 'react';
import { Icon } from './Icon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mb-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <Icon name="sparkles" className="w-10 h-10 text-brand-secondary" />
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 tracking-tight">
          AI Toolkit
        </h1>
      </div>
      <p className="text-lg text-slate-400">
        A collection of smart tools powered by generative AI.
      </p>
    </header>
  );
};

export default Header;
