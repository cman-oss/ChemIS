
import React, { useEffect, useState } from 'react';

// RDKit is loaded globally via a script tag in index.html
declare const initRDKitModule: () => Promise<any>;

// Singleton promise to ensure RDKit is initialized only once
let rdkitModulePromise: Promise<any> | null = null;
const getRDKit = () => {
    if (!rdkitModulePromise) {
        rdkitModulePromise = new Promise((resolve) => {
             initRDKitModule().then(RDKit => {
                resolve(RDKit);
             });
        });
    }
    return rdkitModulePromise;
};

interface Molecule2DViewerProps {
    molString: string;
    className?: string;
}

// Helper to sanitize AI generated strings
const cleanInput = (str: string) => {
    if (!str) return "";
    // Remove markdown code blocks if any (AI sometimes returns ```json ... ```)
    let cleaned = str.replace(/```json/g, '').replace(/```/g, '');
    // Remove quotes if the AI wrapped the string in them
    cleaned = cleaned.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    // Trim whitespace
    return cleaned.trim();
}

const Molecule2DViewer: React.FC<Molecule2DViewerProps> = ({ molString, className }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const generateSvg = async () => {
            setIsLoading(true);
            setError(null);
            
            const rawInput = cleanInput(molString);

            // Basic check for empty inputs
            if (!rawInput || rawInput === "" || (rawInput.includes("0  0  0  0  0  0") && rawInput.includes("V2000"))) {
                if (isMounted) {
                    setIsLoading(false);
                    setSvgContent(null);
                }
                return;
            }

            try {
                const RDKit = await getRDKit();
                if (!isMounted) return;

                let mol = null;
                // Heuristic: Check if it looks like a MOL block (contains coordinates/V2000/M END)
                // otherwise assume SMILES. 
                // Note: Standard SMILES like c1ccccc1 don't have newlines.
                const isMolBlock = rawInput.includes('M  END') || rawInput.includes('V2000') || (rawInput.split('\n').length > 5);

                try {
                    if (isMolBlock) {
                        mol = RDKit.get_mol(rawInput);
                    } else {
                        // Try parsing as SMILES
                        mol = RDKit.get_mol_from_smiles(rawInput);
                        // If standard parse fails, try looser parsing (qmol) which handles some query features
                        if (!mol) {
                            mol = RDKit.get_qmol(rawInput);
                        }
                    }
                } catch (parseError) {
                    console.warn("RDKit parse threw error", parseError);
                }

                // Fallback: Swap methods if the first heuristic failed
                if (!mol) {
                    if (isMolBlock) {
                         // Maybe it was just a really long SMILES string with newlines?
                         mol = RDKit.get_mol_from_smiles(rawInput);
                    } else {
                         // Maybe it was a compressed MOL block?
                         mol = RDKit.get_mol(rawInput);
                    }
                }

                if (!mol) {
                    console.warn("RDKit could not parse molecule:", rawInput.substring(0, 50) + "...");
                    throw new Error("Invalid molecule structure.");
                }

                // Generate SVG with specific drawing options for better visuals
                // Using get_svg_with_highlights allows passing a JSON string for options if needed
                const svg = mol.get_svg(300, 180);
                mol.delete(); // Free WASM memory

                if (isMounted) {
                    setSvgContent(svg);
                }
            } catch (e: any) {
                console.error("RDKit render error:", e);
                if (isMounted) {
                    setSvgContent(null);
                    setError("Invalid Structure");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        generateSvg();

        return () => {
            isMounted = false;
        };
    }, [molString]);

    return (
        <div className={`w-full h-full bg-white rounded-md overflow-hidden flex items-center justify-center p-2 ${className}`}>
            {isLoading && <p className="text-gray-400 text-xs animate-pulse">...</p>}
            
            {!isLoading && error && (
                 <div className="flex flex-col items-center justify-center text-center">
                     <p className="text-red-300 text-[10px] font-bold uppercase mb-1">Render Error</p>
                     <p className="text-gray-400 text-[10px] italic max-w-[100px] truncate">{cleanInput(molString) || 'Empty'}</p>
                 </div>
            )}
            
            {!isLoading && !error && svgContent && (
                <div 
                    className="w-full h-full flex items-center justify-center pointer-events-none select-none"
                    dangerouslySetInnerHTML={{ __html: svgContent }} 
                />
            )}
            
            {!isLoading && !error && !svgContent && (
                <p className="text-gray-300 text-xs italic">No structure</p>
            )}
        </div>
    );
};

export default Molecule2DViewer;
