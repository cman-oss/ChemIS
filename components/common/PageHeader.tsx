import React from 'react';

interface ActionButton {
  text: string;
  handler: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, primaryAction, secondaryAction }) => {
  return (
    <section className="bg-deep-blue text-white">
      <div className="container mx-auto px-6 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold">{title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">{subtitle}</p>
        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            {primaryAction && (
              <button
                onClick={primaryAction.handler}
                className="bg-molecular-teal text-deep-blue px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
              >
                {primaryAction.text}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.handler}
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-deep-blue transform hover:scale-105 transition-all"
              >
                {secondaryAction.text}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
