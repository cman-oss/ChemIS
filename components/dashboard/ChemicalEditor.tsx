import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// Make Kekule global type available
declare const Kekule: any;

export interface ChemicalEditorRef {
  getMolfile: () => Promise<string>;
  getSmiles: () => Promise<string>;
  setMolecule: (molString: string) => Promise<void>;
}

interface ChemicalEditorProps {
    onMoleculeChange: (molData: string) => void;
    initialMoleculeMol: string | null;
}

const ChemicalEditor = forwardRef<ChemicalEditorRef, ChemicalEditorProps>(({ onMoleculeChange, initialMoleculeMol }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const composerRef = useRef<any>(null); // Kekule Composer instance
    const onMoleculeChangeRef = useRef(onMoleculeChange);

    useEffect(() => {
        onMoleculeChangeRef.current = onMoleculeChange;
    }, [onMoleculeChange]);

    useImperativeHandle(ref, () => ({
        async getMolfile() {
            if (composerRef.current) {
                try {
                    const chemObj = composerRef.current.getChemObj();
                    
                    // 1. Try V2000 MOL export
                    let output = Kekule.IO.saveFormatData(chemObj, 'mol');
                    
                    // Check if the output is effectively empty.
                    // A typical empty V2000 file has a counts line like "  0  0  0  0  0  0"
                    // If the user drew something complex, this line should have non-zero counts.
                    const isEmptyV2000 = !output || output.includes("  0  0  0  0  0  0");
                    
                    if (isEmptyV2000) {
                        // 2. Fallback: Try SMILES export
                        // Sometimes complex nested structures in Kekule (like ChemDocuments with Layers) 
                        // fail to export cleanly to MOL but work for SMILES.
                        const smiles = Kekule.IO.saveFormatData(chemObj, 'smi');
                        if (smiles && smiles.trim().length > 0) {
                            return smiles;
                        }
                    }
                    
                    return output;
                } catch (e) {
                    console.error("Error getting molfile", e);
                    // Final fallback to SMILES if MOL errors out entirely
                    try {
                         const chemObj = composerRef.current.getChemObj();
                         return Kekule.IO.saveFormatData(chemObj, 'smi');
                    } catch (e2) {
                        return '';
                    }
                }
            }
            return '';
        },
        async getSmiles() {
             if (composerRef.current) {
                try {
                    const chemObj = composerRef.current.getChemObj();
                    return Kekule.IO.saveFormatData(chemObj, 'smi');
                } catch (e) {
                    console.error("Error getting SMILES", e);
                    return '';
                }
            }
            return '';
        },
        async setMolecule(molString: string) {
            if (composerRef.current && molString) {
                try {
                    // Attempt to detect format or try common ones
                    let chemObj;
                    if (molString.includes('V2000') || molString.includes('M  END')) {
                         chemObj = Kekule.IO.loadFormatData(molString, 'mol');
                    } else {
                         chemObj = Kekule.IO.loadFormatData(molString, 'smi');
                    }
                    
                    if (chemObj) {
                        composerRef.current.setChemObj(chemObj);
                        // Trigger change event manually if needed, or let listener handle it
                        // We use a timeout to let Kekule render before saving back to trigger change
                        setTimeout(() => {
                            try {
                                const newMol = Kekule.IO.saveFormatData(chemObj, 'mol');
                                onMoleculeChangeRef.current(newMol);
                            } catch(e) {}
                        }, 50);
                    }
                } catch (e) { 
                    console.error("Failed to set molecule", e); 
                }
            } else if (composerRef.current && !molString) {
                 // Clear
                 composerRef.current.newDoc();
            }
        },
    }));

    // Initialize Kekule
    useEffect(() => {
        if (typeof Kekule === 'undefined') {
            console.error("Kekule.js is not loaded.");
            return;
        }

        if (!editorContainerRef.current || composerRef.current) {
            return;
        }

        try {
            // Initialize Composer
            const composer = new Kekule.Editor.Composer(editorContainerRef.current);
            
            // Configure UI
            composer.setDimension('100%', '100%');
            
            // Enable autosize to fit container
            composer.setEnableDimensionTransform(true);

            composerRef.current = composer;

            // Load initial molecule if present
            if (initialMoleculeMol) {
                 try {
                    let chemObj;
                    if (initialMoleculeMol.includes('V2000') || initialMoleculeMol.includes('M  END')) {
                         chemObj = Kekule.IO.loadFormatData(initialMoleculeMol, 'mol');
                    } else {
                         chemObj = Kekule.IO.loadFormatData(initialMoleculeMol, 'smi');
                    }
                    if (chemObj) composer.setChemObj(chemObj);
                 } catch(e) {
                     console.warn("Could not load initial molecule", e);
                 }
            }

            // Listen for changes
            composer.on('load', () => {
                 setTimeout(async () => {
                    try {
                        const mol = Kekule.IO.saveFormatData(composer.getChemObj(), 'mol');
                        onMoleculeChangeRef.current(mol);
                    } catch(e) {}
                 }, 100);
            });
            
            // Mouseup listener for drawing interactions
            editorContainerRef.current.addEventListener('mouseup', async () => {
                 setTimeout(() => {
                     try {
                         const obj = composer.getChemObj();
                         if (obj) {
                            const mol = Kekule.IO.saveFormatData(obj, 'mol');
                            onMoleculeChangeRef.current(mol);
                         }
                     } catch(e) {}
                 }, 200);
            });

        } catch (e) {
            console.error("Failed to initialize Kekule Composer:", e);
        }

    }, []);

    return (
       <div className="w-full h-full bg-dark-card rounded-lg overflow-hidden relative shadow-inner border border-dark-border">
         <div id="kekule-composer-container" ref={editorContainerRef} className="w-full h-full z-10 block"></div>
         
         <style>{`
            /* Container & General Reset */
            .K-Chem-Composer {
                background-color: #161B22 !important; /* dark-card */
                border: none !important;
                font-family: 'Inter', sans-serif;
            }

            /* Toolbars (Top, Left, Bottom, Right) */
            .K-Widget-Toolbar {
                background-image: none !important;
                background-color: #0D1117 !important; /* dark-bg */
                border: none !important;
                border-bottom: 1px solid #30363D !important;
                border-right: 1px solid #30363D !important;
                padding: 4px !important;
                box-shadow: none !important;
            }

            /* Buttons */
            .K-Widget-Button {
                background-image: none !important;
                background-color: transparent !important;
                border: 1px solid transparent !important;
                border-radius: 6px !important;
                margin: 3px !important;
                box-shadow: none !important;
                transition: all 0.2s ease;
                min-width: 28px !important;
                min-height: 28px !important;
            }

            /* Icons - Invert to white/grey */
            .K-Widget-Button-Inner {
                filter: invert(0.8) sepia(0) saturate(0) hue-rotate(0deg) brightness(1.2);
                opacity: 0.7;
                transform: scale(0.9);
                transition: transform 0.2s;
            }

            /* Hover State */
            .K-Widget-Button-Hover, .K-Widget-Button:hover {
                background-color: rgba(255, 255, 255, 0.08) !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }
            .K-Widget-Button-Hover .K-Widget-Button-Inner {
                opacity: 1;
                transform: scale(1);
            }

            /* Active / Checked / Pressed State */
            .K-Widget-Button-Check, .K-Widget-Button-Active, .K-Widget-Button-Down {
                background-color: #00C49A !important; /* molecular-teal */
                border-color: #00C49A !important;
                box-shadow: 0 0 8px rgba(0, 196, 154, 0.4) !important;
            }
            
            /* Active Icons - Black for contrast */
            .K-Widget-Button-Check .K-Widget-Button-Inner, 
            .K-Widget-Button-Active .K-Widget-Button-Inner,
            .K-Widget-Button-Down .K-Widget-Button-Inner {
                filter: none !important; /* Revert inversion */
                filter: brightness(0) !important; /* Make black */
                opacity: 1;
            }

            /* Dropdowns */
            .K-Widget-DropButton-DropDown {
                background-image: none !important;
                background-color: transparent !important;
            }
             .K-Widget-DropButton-DropDown-Arrow {
                 border-top-color: #8B949E !important;
             }
             .K-Widget-Button-Hover .K-Widget-DropButton-DropDown-Arrow {
                 border-top-color: white !important;
             }
             .K-Widget-Button-Check .K-Widget-DropButton-DropDown-Arrow {
                 border-top-color: #0A2540 !important;
             }

            /* Canvas Area */
            .K-Chem-Composer-Client {
                border: 1px solid #30363D !important;
                border-radius: 6px !important;
                background-color: #ffffff !important; 
                margin: 6px !important;
                box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
            }

            /* Dialogs (if any) */
            .K-Widget-Dialog {
                background-color: #161B22 !important;
                border: 1px solid #30363D !important;
                color: #C9D1D9 !important;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
                border-radius: 8px !important;
            }
            .K-Widget-Dialog-Caption {
                background-image: none !important;
                background-color: #0D1117 !important;
                border-bottom: 1px solid #30363D !important;
                color: #00C49A !important;
                font-weight: 600;
            }
            .K-Widget-Dialog-Client {
                 background-color: #161B22 !important;
            }

            /* Scrollbars within editor */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #0D1117; 
            }
            ::-webkit-scrollbar-thumb {
                background: #30363D; 
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #586069; 
            }
         `}</style>
       </div>
    );
});

export default ChemicalEditor;