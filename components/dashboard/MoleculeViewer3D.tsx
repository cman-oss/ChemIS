import React, { useEffect, useRef, useState } from 'react';

// Make 3Dmol global types available
declare const $3Dmol: any;

interface MoleculeViewer3DProps {
  molData: string | null;
}

type ViewerStyle = 'stick' | 'sphere' | 'line';

const MoleculeViewer3D: React.FC<MoleculeViewer3DProps> = ({ molData }) => {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const glviewerRef = useRef<any>(null); // To hold the 3Dmol viewer instance
  const [style, setStyle] = useState<ViewerStyle>('stick');

  useEffect(() => {
    if (!viewerContainerRef.current) return;
    
    // Initialize viewer if it doesn't exist
    if (!glviewerRef.current) {
        const config = { backgroundColor: '#161B22' };
        glviewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, config);
    }
    
    const viewer = glviewerRef.current;

    // Update viewer when molData changes
    if (molData) {
        viewer.clear();
        viewer.addModel(molData, 'mol');
        
        // Apply the selected style
        if (style === 'sphere') {
             viewer.setStyle({}, { sphere: { scale: 0.8 } });
        } else if (style === 'line') {
             viewer.setStyle({}, { line: {} });
        } else { // stick is default
            viewer.setStyle({}, { stick: {} });
        }
        
        viewer.zoomTo();
        viewer.render();
    } else {
        viewer.clear();
    }
    
    // Resize viewer when container resizes
    const resizeObserver = new ResizeObserver(() => {
        if (glviewerRef.current) {
            glviewerRef.current.resize();
        }
    });
    
    resizeObserver.observe(viewerContainerRef.current);
    
    return () => {
        resizeObserver.disconnect();
    }

  }, [molData, style]);

  const parseAtomCount = (mol: string | null): number => {
      if (!mol) return 0;
      const lines = mol.split('\n');
      if (lines.length < 4) return 0;
      // In V2000 molfile format, the counts line is the 4th line (index 3).
      // The atom count is the first 3 characters.
      const countsLine = lines[3].trim();
      const atomCount = parseInt(countsLine.substring(0, 3), 10);
      return isNaN(atomCount) ? 0 : atomCount;
  };

  const StyleButton: React.FC<{buttonStyle: ViewerStyle, label: string}> = ({ buttonStyle, label}) => (
      <button
          onClick={() => setStyle(buttonStyle)}
          title={`Set style to ${label}`}
          aria-label={`Set style to ${label}`}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${style === buttonStyle ? 'bg-accent-cyan text-dark-bg font-semibold' : 'bg-dark-border text-dark-text-secondary hover:bg-dark-card'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="w-full h-full relative flex flex-col">
        <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-dark-bg/70 backdrop-blur-sm p-1 rounded-md border border-dark-border">
            <StyleButton buttonStyle="stick" label="Stick" />
            <StyleButton buttonStyle="sphere" label="Sphere" />
            <StyleButton buttonStyle="line" label="Line" />
        </div>
        <div ref={viewerContainerRef} className="flex-1 w-full h-full relative" />
        <div className="flex-shrink-0 bg-dark-bg/80 border-t border-dark-border text-xs text-dark-text-secondary p-1 px-3 text-center font-mono">
            Atom Count: <span className="font-bold text-white">{parseAtomCount(molData)}</span>
        </div>
    </div>
  );
};

export default MoleculeViewer3D;