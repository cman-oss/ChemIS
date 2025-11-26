
import React, { useEffect, useRef } from 'react';

// Make 3Dmol global type available
declare const $3Dmol: any;

interface MoleculeHeroAnimationProps {
    className?: string;
    molString?: string;
    rotateSpeed?: number;
    scale?: number;
    primaryColor?: string;
    secondaryColor?: string;
}

const DEFAULT_MOL = `
  -OEChem-01251709482D

 14 15  0     0  0  0  0  0  0999 V2000
    0.6970    2.0526    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.0179    1.6398    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.0179    0.8142    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    0.6970    0.4014    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4119    0.8142    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4119    1.6398    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7327    2.0526    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7327    0.4014    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6970   -0.4242    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    1.3649   -0.9095    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0328   -0.4242    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.1268    2.0526    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6970    2.8782    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.3649   -1.7351    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
  3  4  1  0  0  0  0
  4  5  2  0  0  0  0
  5  6  1  0  0  0  0
  6  1  1  0  0  0  0
  2  7  2  0  0  0  0
  3  8  1  0  0  0  0
  4  9  1  0  0  0  0
  9 10  1  0  0  0  0
 10 11  2  0  0  0  0
 11  5  1  0  0  0  0
  6 12  1  0  0  0  0
  1 13  1  0  0  0  0
 10 14  1  0  0  0  0
M  END
`;

const MoleculeHeroAnimation: React.FC<MoleculeHeroAnimationProps> = ({ 
    className, 
    molString = DEFAULT_MOL, 
    rotateSpeed = 0.5,
    scale = 1,
    primaryColor = '#00C49A', // molecular-teal
    secondaryColor = '#30363D' // dark-border/grey
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current || typeof $3Dmol === 'undefined') return;

        // Transparent background
        const config = { backgroundColor: '0x000000', backgroundAlpha: 0 };
        
        if (!viewerRef.current) {
             viewerRef.current = $3Dmol.createViewer(containerRef.current, config);
        }
        
        const viewer = viewerRef.current;
        viewer.clear();

        viewer.addModel(molString, "mol");
        
        // Custom styling for a "Tech/AI" look
        // We use a combination of stick and spheres with custom colors
        viewer.setStyle({}, { 
            stick: { radius: 0.12, color: secondaryColor }, 
            sphere: { scale: 0.28, color: primaryColor } 
        });
        
        viewer.zoomTo();
        // Zoom out slightly more than default fit to ensure it stays in bounds during rotation
        viewer.zoom(scale * 0.8); 

        let animationId: number;
        const animate = () => {
            viewer.rotate(rotateSpeed, "y");
            viewer.rotate(rotateSpeed * 0.5, "x");
            viewer.render();
            animationId = requestAnimationFrame(animate);
        };
        
        animate();

        const handleResize = () => {
             viewer.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if(viewerRef.current) {
                // Optional cleanup if 3Dmol supports it cleanly, mostly handled by clear() on re-run
            }
        };
    }, [molString, rotateSpeed, scale, primaryColor, secondaryColor]);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`} style={{ pointerEvents: 'none', minHeight: '300px' }} />
    );
};

export default MoleculeHeroAnimation;
