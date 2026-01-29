'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Collapsible Section Component
function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
      >
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// Code Block Component
function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-4">
      {title && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg">
          {title}
        </div>
      )}
      <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono ${title ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// Table Component
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Workflow Step Component
function WorkflowStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function SDSLibraryProductSpecs() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SDS Library Product Requirements</h1>
              <p className="text-sm text-gray-500 mt-1">Technical Documentation for Engineers</p>
            </div>
            <Link
              href="/sds-library"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View SDS Library
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex gap-4 text-sm overflow-x-auto">
            <a href="#executive-summary" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Executive Summary</a>
            <a href="#architecture" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Architecture</a>
            <a href="#data-models" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Data Models</a>
            <a href="#components" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Components</a>
            <a href="#workflows" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Workflows</a>
            <a href="#integrations" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Integrations</a>
            <a href="#technical-specs" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Technical Specs</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Executive Summary */}
        <section id="executive-summary">
          <CollapsibleSection title="1. Executive Summary">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Module Purpose</h3>
              <p className="text-gray-700 mb-4">
                The SDS Library module provides comprehensive <strong>GHS-compliant Safety Data Sheet management</strong> for 
                industrial and manufacturing environments. It enables organizations to maintain regulatory compliance while 
                providing easy access to critical chemical safety information.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Document Management</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• Upload and store SDS documents</li>
                    <li>• AI-powered data extraction (simulated)</li>
                    <li>• 16-section GHS standard support</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Location Hierarchy</h4>
                  <ul className="text-sm text-green-800 mt-2 space-y-1">
                    <li>• 6-level CMMS hierarchy</li>
                    <li>• Location-based filtering</li>
                    <li>• Access control integration</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">Compliance Tools</h4>
                  <ul className="text-sm text-purple-800 mt-2 space-y-1">
                    <li>• Secondary container label generation</li>
                    <li>• Right-to-Know site binder creation</li>
                    <li>• OSHA-compliant formats</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900">User Experience</h4>
                  <ul className="text-sm text-orange-800 mt-2 space-y-1">
                    <li>• Quick view and full view modes</li>
                    <li>• Search by product, manufacturer, CAS</li>
                    <li>• AI assistant for SDS questions</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Users</h3>
              <Table
                headers={['User Role', 'Primary Use Cases']}
                rows={[
                  ['Safety Managers', 'Upload SDSs, generate compliance documents, manage library'],
                  ['Compliance Officers', 'Audit SDS coverage, generate site binders, verify GHS data'],
                  ['Operations Teams', 'Quick access to safety info, PPE requirements, first aid'],
                  ['Maintenance Staff', 'Location-specific SDS lookup, chemical handling guidance'],
                ]}
              />
            </div>
          </CollapsibleSection>
        </section>

        {/* Architecture Overview */}
        <section id="architecture">
          <CollapsibleSection title="2. Architecture Overview">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Architecture</h3>
            
            {/* Architecture Diagram */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex flex-col items-center">
                {/* Main Page */}
                <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium mb-4">
                  app/sds-library/page.tsx
                </div>
                
                <div className="w-px h-8 bg-gray-400"></div>
                
                {/* Components Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    UploadSDSModal
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    FullSDSModal
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    SDSQuickViewDrawer
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    LabelGeneratorModal
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    BinderBuilderModal
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    LocationTree
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    GHSPictograms
                  </div>
                  <div className="bg-white border-2 border-blue-200 px-3 py-2 rounded text-xs text-center">
                    SDSAIAssistant
                  </div>
                </div>

                <div className="w-px h-8 bg-gray-400 mt-4"></div>

                {/* Integration Layer */}
                <div className="flex gap-4 mt-4">
                  <div className="bg-green-100 border border-green-300 px-4 py-2 rounded text-sm">
                    AccessContext
                  </div>
                  <div className="bg-green-100 border border-green-300 px-4 py-2 rounded text-sm">
                    localStorage
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">File Structure</h3>
            <CodeBlock title="Directory Structure">{`app/
└── sds-library/
    └── page.tsx              # Main SDS Library page

src/
└── components/
    └── sds/
        ├── UploadSDSModal.tsx      # 3-step upload wizard
        ├── FullSDSModal.tsx        # 16-section GHS display
        ├── SDSQuickViewDrawer.tsx  # Side drawer quick view
        ├── LabelGeneratorModal.tsx # Label printing
        ├── BinderBuilderModal.tsx  # Site binder generation
        ├── LocationTree.tsx        # Location hierarchy explorer
        ├── GHSPictograms.tsx       # Pictogram components
        └── SDSAIAssistant.tsx      # AI chatbot assistant`}</CodeBlock>
          </CollapsibleSection>
        </section>

        {/* Data Models */}
        <section id="data-models">
          <CollapsibleSection title="3. Data Models">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Interface: SDSDocument</h3>
            <p className="text-gray-600 mb-4">
              The core data structure representing a Safety Data Sheet in the system.
            </p>
            
            <CodeBlock title="src/components/sds/UploadSDSModal.tsx">{`interface SDSDocument {
  id: string;
  
  // Section 1: Identification
  product: string;
  manufacturer: string;
  casNumber: string;
  revisionDate: string;
  productCode: string;
  
  // Section 2: Hazard Identification
  signalWord: string;              // "Danger" | "Warning" | "None"
  pictograms: GHSPictogramType[];
  hazardStatements: string[];
  
  // Section 4 & 8: Safety Response
  ppe: string[];
  firstAid: {
    eyes: string;
    skin: string;
    inhalation: string;
  };
  
  // Section 7: Storage & Handling
  storageHandling: {
    storage: string[];
    handling: string[];
  };
  
  // Section 9: Physical Properties
  flashPoint: string;
  phValue: string;
  appearance: string;
  
  // Location Assignment
  locationPath: string[];  // 6-level CMMS hierarchy
  uploadedAt: string;
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">GHS Pictogram Types</h3>
            <p className="text-gray-600 mb-4">
              The 9 standard GHS pictograms supported by the system:
            </p>
            
            <CodeBlock title="src/components/sds/GHSPictograms.tsx">{`type GHSPictogramType = 
  | "Flame"              // Flammable materials
  | "Exclamation Mark"   // Irritant/harmful
  | "Health Hazard"      // Serious health hazard
  | "Corrosion"          // Corrosive materials
  | "Skull and Crossbones" // Acute toxicity
  | "Environment"        // Environmental hazard
  | "Oxidizer"           // Oxidizing materials
  | "Gas Cylinder"       // Compressed gases
  | "Exploding Bomb";    // Explosive materials`}</CodeBlock>

            <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mt-4 mb-6">
              {['Flame', 'Exclamation', 'Health', 'Corrosion', 'Skull', 'Environment', 'Oxidizer', 'Gas', 'Explosive'].map((name) => (
                <div key={name} className="bg-white border-2 border-red-500 p-2 rounded text-center">
                  <div className="w-8 h-8 mx-auto bg-red-50 rounded flex items-center justify-center text-xs">
                    GHS
                  </div>
                  <span className="text-xs text-gray-600 mt-1 block">{name}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Location Hierarchy</h3>
            <p className="text-gray-600 mb-4">
              SDSs are assigned to a 6-level CMMS location hierarchy:
            </p>
            
            <Table
              headers={['Level', 'Example', 'Description']}
              rows={[
                ['1. Site', 'Chicago Manufacturing Plant', 'Top-level facility'],
                ['2. Area', 'Building A', 'Major area within site'],
                ['3. System', 'Production Line 1', 'Functional system'],
                ['4. Equipment', 'CNC Machine A1', 'Specific equipment'],
                ['5. Sub-unit', 'Coolant System', 'Equipment subsystem'],
                ['6. Component', 'Pump Assembly', 'Individual component'],
              ]}
            />
          </CollapsibleSection>
        </section>

        {/* Component Reference */}
        <section id="components">
          <CollapsibleSection title="4. Component Reference">
            
            {/* UploadSDSModal */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UploadSDSModal</h3>
              <p className="text-gray-600 mb-4">
                A 3-step wizard for uploading and processing SDS documents with simulated AI extraction.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Wizard Steps:</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    <span className="text-sm">Upload PDF</span>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                    <span className="text-sm">Review GHS Data</span>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                    <span className="text-sm">Assign Location</span>
                  </div>
                </div>
              </div>

              <Table
                headers={['Feature', 'Implementation']}
                rows={[
                  ['File Upload', 'react-dropzone for drag-and-drop PDF support'],
                  ['AI Processing', 'Simulated 2.5s extraction with progress indicator'],
                  ['Form Validation', 'Required fields: product name, manufacturer'],
                  ['Location Assignment', '6-level cascading dropdown selectors'],
                ]}
              />
            </div>

            {/* FullSDSModal */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FullSDSModal</h3>
              <p className="text-gray-600 mb-4">
                Displays complete 16-section GHS Safety Data Sheet in a scrollable modal.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {[
                  '1. Identification',
                  '2. Hazards',
                  '3. Composition',
                  '4. First-Aid',
                  '5. Fire-Fighting',
                  '6. Accidental Release',
                  '7. Handling/Storage',
                  '8. Exposure Controls',
                  '9. Physical Properties',
                  '10. Stability',
                  '11. Toxicology',
                  '12. Ecology',
                  '13. Disposal',
                  '14. Transport',
                  '15. Regulatory',
                  '16. Other Info',
                ].map((section) => (
                  <div key={section} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                    {section}
                  </div>
                ))}
              </div>
            </div>

            {/* SDSQuickViewDrawer */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SDSQuickViewDrawer</h3>
              <p className="text-gray-600 mb-4">
                A slide-in drawer from the right side providing quick access to critical safety information.
              </p>
              
              <Table
                headers={['Section', 'Content']}
                rows={[
                  ['Hazard Statements', 'H-codes and descriptions'],
                  ['PPE Requirements', 'Visual icons for required protective equipment'],
                  ['First Aid', 'Eye, skin, and inhalation response'],
                  ['Storage & Handling', 'Safe storage conditions and precautions'],
                  ['Physical Properties', 'Flash point, pH, appearance'],
                ]}
              />
            </div>

            {/* LabelGeneratorModal */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LabelGeneratorModal</h3>
              <p className="text-gray-600 mb-4">
                Generates OSHA-compliant secondary container labels (4&quot;x6&quot; format) for batch printing.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-yellow-900 mb-2">Label Contents:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Product name and signal word</li>
                  <li>• GHS pictograms (visual hazard indicators)</li>
                  <li>• Hazard statements (H-codes)</li>
                  <li>• PPE summary icons</li>
                  <li>• CAS number for identification</li>
                </ul>
              </div>
            </div>

            {/* BinderBuilderModal */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">BinderBuilderModal</h3>
              <p className="text-gray-600 mb-4">
                Creates Right-to-Know compliance packages with auto-generated table of contents.
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-100 p-3 rounded text-center">
                  <span className="text-sm font-medium">Confirm</span>
                  <p className="text-xs text-gray-500">Review location & count</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 bg-gray-100 p-3 rounded text-center">
                  <span className="text-sm font-medium">Loading</span>
                  <p className="text-xs text-gray-500">Generate PDF</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 bg-gray-100 p-3 rounded text-center">
                  <span className="text-sm font-medium">Success</span>
                  <p className="text-xs text-gray-500">Download ready</p>
                </div>
              </div>
            </div>

            {/* LocationTree */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LocationTree</h3>
              <p className="text-gray-600 mb-4">
                Hierarchical tree component for navigating and filtering by location.
              </p>
              
              <Table
                headers={['Feature', 'Description']}
                rows={[
                  ['Expand/Collapse', 'Per-node expansion with chevron indicators'],
                  ['Document Counts', 'Badges showing SDS count per location'],
                  ['Selection', 'Click to filter documents by location'],
                  ['Actions', 'Show All, Expand All, Collapse All buttons'],
                ]}
              />
            </div>

            {/* GHSPictograms */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GHSPictograms</h3>
              <p className="text-gray-600 mb-4">
                Components for displaying and selecting GHS pictograms.
              </p>
              
              <Table
                headers={['Component', 'Purpose']}
                rows={[
                  ['GHSPictogram', 'Single pictogram display with size variants (sm, md, lg, xl)'],
                  ['GHSPictogramList', 'Horizontal list of pictograms'],
                  ['GHSPictogramSelector', 'Multi-select grid for form input'],
                ]}
              />
            </div>

            {/* SDSAIAssistant */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SDSAIAssistant</h3>
              <p className="text-gray-600 mb-4">
                Floating chatbot in bottom-right corner for answering SDS-related questions.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Supported Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {['PPE Requirements', 'First Aid', 'Storage Conditions', 'Hazard Information', 'Location Lookup'].map((topic) => (
                    <span key={topic} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </section>

        {/* User Workflows */}
        <section id="workflows">
          <CollapsibleSection title="5. User Workflows">
            
            {/* Workflow 1: Upload New SDS */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 1: Upload New SDS</h3>
              <WorkflowStep
                number={1}
                title="Click 'Upload SDS' button"
                description="Opens the 3-step upload wizard modal"
              />
              <WorkflowStep
                number={2}
                title="Upload PDF file"
                description="Drag & drop or click to browse. Supported format: PDF"
              />
              <WorkflowStep
                number={3}
                title="AI Processing"
                description="System extracts GHS data (simulated 2.5s processing with progress indicator)"
              />
              <WorkflowStep
                number={4}
                title="Review & Edit"
                description="Verify extracted data, edit identification, hazards, PPE, and physical properties"
              />
              <WorkflowStep
                number={5}
                title="Assign Location"
                description="Select from 6-level CMMS hierarchy using cascading dropdowns"
              />
              <WorkflowStep
                number={6}
                title="Save"
                description="Document added to library, success toast displayed"
              />
            </div>

            {/* Workflow 2: View SDS Details */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 2: View SDS Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Quick View (Side Drawer)</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. Click &quot;Quick View&quot; button on any row</li>
                    <li>2. Drawer slides in from right</li>
                    <li>3. View critical safety info at a glance</li>
                    <li>4. Click outside or X to close</li>
                  </ol>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Full View (Modal)</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. Click document icon on any row</li>
                    <li>2. Full 16-section modal opens</li>
                    <li>3. Scroll through all GHS sections</li>
                    <li>4. Print button available in header</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Workflow 3: Generate Labels */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 3: Generate Labels</h3>
              <WorkflowStep
                number={1}
                title="Select Documents"
                description="Use checkboxes to select one or more SDSs"
              />
              <WorkflowStep
                number={2}
                title="Click 'Generate Labels'"
                description="Button appears when documents are selected"
              />
              <WorkflowStep
                number={3}
                title="Review Labels"
                description="Preview 4x6 OSHA-compliant labels in modal"
              />
              <WorkflowStep
                number={4}
                title="Print"
                description="Click print button for batch printing with optimized CSS"
              />
            </div>

            {/* Workflow 4: Create Site Binder */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 4: Create Site Binder</h3>
              <WorkflowStep
                number={1}
                title="Click 'Site Binder' button"
                description="Opens the binder builder modal"
              />
              <WorkflowStep
                number={2}
                title="Confirm Location"
                description="Review current location filter and document count"
              />
              <WorkflowStep
                number={3}
                title="Generate"
                description="System compiles Right-to-Know package with progress indicator"
              />
              <WorkflowStep
                number={4}
                title="Download"
                description="PDF with table of contents ready for download"
              />
            </div>

            {/* Workflow 5: Location-Based Filtering */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 5: Location-Based Filtering</h3>
              <WorkflowStep
                number={1}
                title="Navigate Location Tree"
                description="Use left panel to explore location hierarchy"
              />
              <WorkflowStep
                number={2}
                title="Expand Nodes"
                description="Click chevrons to reveal nested locations"
              />
              <WorkflowStep
                number={3}
                title="Select Location"
                description="Click any location to filter documents"
              />
              <WorkflowStep
                number={4}
                title="Clear Filter"
                description="Click 'Show All' to remove location filter"
              />
            </div>

            {/* Workflow 6: Search & Filter */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 6: Search & Filter</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Search Fields:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Product Name:</strong> Full or partial match</li>
                  <li>• <strong>Manufacturer:</strong> Company name search</li>
                  <li>• <strong>CAS Number:</strong> Chemical identifier lookup</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  Search combines with location filter for precise results.
                </p>
              </div>
            </div>

            {/* Workflow 7: AI Assistant */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow 7: AI Assistant</h3>
              <WorkflowStep
                number={1}
                title="Click Floating Chat Button"
                description="Blue chat icon in bottom-right corner"
              />
              <WorkflowStep
                number={2}
                title="Ask Question"
                description="Type question or use quick action buttons"
              />
              <WorkflowStep
                number={3}
                title="Receive Response"
                description="AI provides keyword-based answers about SDS content"
              />
            </div>
          </CollapsibleSection>
        </section>

        {/* Integration Points */}
        <section id="integrations">
          <CollapsibleSection title="6. Integration Points">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Context Providers</h3>
            <Table
              headers={['Context', 'Purpose', 'Usage']}
              rows={[
                ['AccessContext', 'Location-based permissions', 'Controls which locations user can view/edit'],
                ['localStorage', 'Persistent storage', 'Stores uploaded SDS documents client-side'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Navigation Integration</h3>
            <CodeBlock title="src/components/Sidebar.tsx">{`// SDS Library navigation item
{
  label: "SDS Library",
  icon: "document",
  href: "/sds-library"
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Header Integration</h3>
            <p className="text-gray-600 mb-4">
              The SDS Library respects the location context set in the header LocationSwitcher component.
              Non-admin users see a locked &quot;Showing&quot; badge indicating their assigned location scope.
            </p>
          </CollapsibleSection>
        </section>

        {/* Technical Specifications */}
        <section id="technical-specs">
          <CollapsibleSection title="7. Technical Specifications">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
            <Table
              headers={['Package', 'Version', 'Purpose']}
              rows={[
                ['react-dropzone', '^14.x', 'Drag-and-drop file upload'],
                ['react', '^19.x', 'UI framework'],
                ['next', '^16.x', 'App framework with App Router'],
                ['tailwindcss', '^4.x', 'Utility-first CSS'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">State Management</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Component State:</strong> React useState for UI state</li>
                <li><strong>Persistence:</strong> localStorage for SDS document storage</li>
                <li><strong>Context:</strong> AccessContext for permission state</li>
                <li><strong>No Redux/Zustand:</strong> Simple state management approach</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Optimization</h3>
            <CodeBlock title="Print CSS Media Queries">{`@media print {
  /* Hide non-essential elements */
  .no-print { display: none !important; }
  
  /* Label sizing: 4" x 6" */
  .label-container {
    width: 4in;
    height: 6in;
    page-break-after: always;
  }
  
  /* Pictogram sizing for print */
  .ghs-pictogram-print {
    width: 0.75in;
    height: 0.75in;
  }
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Sample Data</h3>
            <p className="text-gray-600 mb-4">
              The module includes 10 pre-loaded industrial chemical SDSs for demonstration:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                'Industrial Acetone',
                'Sulfuric Acid',
                'Isopropyl Alcohol',
                'Sodium Hydroxide',
                'Hydrochloric Acid',
                'Methanol',
                'Toluene',
                'Xylene',
                'Ethanol',
                'Ammonia Solution',
              ].map((chemical) => (
                <div key={chemical} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 text-center">
                  {chemical}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Performance Considerations</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>Lazy Loading:</strong> Modals loaded on demand</li>
              <li>• <strong>Memoization:</strong> useMemo for filtered document lists</li>
              <li>• <strong>Virtualization:</strong> Not implemented (suitable for &lt;1000 documents)</li>
              <li>• <strong>Client-side:</strong> All processing happens in browser</li>
            </ul>
          </CollapsibleSection>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>SDS Library Module - UpKeep EHS</p>
          <p className="mt-1">Last Updated: January 2026</p>
        </footer>
      </main>
    </div>
  );
}
