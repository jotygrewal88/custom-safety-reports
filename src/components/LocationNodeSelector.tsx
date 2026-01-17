/**
 * Location Node Selector Component
 * 
 * Recursive tree view for selecting organizational locations (up to 6 levels).
 * Features:
 * - Expand/collapse nodes with chevron rotation
 * - Single selection with visual indication
 * - Child node inheritance highlighting
 * - Search/filter functionality
 * - Returns both NodeID and full path breadcrumb
 */

import React, { useState, useEffect } from "react";
import type { LocationNode } from "../schemas/locations";
import { buildLocationPath, flattenLocationTree, getAllChildNodeIds } from "../schemas/locations";

interface LocationNodeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nodeId: string, locationPath: string) => void;
  currentSelection?: string;
  nodes: LocationNode[];
}

export default function LocationNodeSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentSelection,
  nodes 
}: LocationNodeSelectorProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentSelection || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [implicitChildIds, setImplicitChildIds] = useState<Set<string>>(new Set());

  // Auto-expand to show current selection on mount
  useEffect(() => {
    if (isOpen && currentSelection) {
      setSelectedNodeId(currentSelection);
      const pathToRoot = getPathToRoot(currentSelection, nodes);
      setExpandedNodes(new Set(pathToRoot));
      
      // Calculate implicit children
      const childIds = getAllChildNodeIds(currentSelection, nodes);
      setImplicitChildIds(new Set(childIds));
    } else if (isOpen && !currentSelection) {
      // If no selection, expand first level
      const topLevelIds = nodes.map(n => n.id);
      setExpandedNodes(new Set(topLevelIds));
    }
  }, [isOpen, currentSelection, nodes]);

  // Update implicit children when selection changes
  useEffect(() => {
    if (selectedNodeId) {
      const childIds = getAllChildNodeIds(selectedNodeId, nodes);
      setImplicitChildIds(new Set(childIds));
    } else {
      setImplicitChildIds(new Set());
    }
  }, [selectedNodeId, nodes]);

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleConfirm = () => {
    if (selectedNodeId) {
      const path = buildLocationPath(selectedNodeId, nodes);
      onSelect(selectedNodeId, path);
    }
  };

  const handleCancel = () => {
    setSearchQuery("");
    setSelectedNodeId(currentSelection || "");
    onClose();
  };

  // Filter nodes based on search
  const filteredNodes = searchQuery.trim()
    ? filterNodesBySearch(nodes, searchQuery.toLowerCase())
    : nodes;

  // Auto-expand parents of search results
  useEffect(() => {
    if (searchQuery.trim()) {
      const flatNodes = flattenLocationTree(nodes);
      const matchingIds = flatNodes
        .filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(n => n.id);
      
      const parentsToExpand = new Set<string>();
      matchingIds.forEach(id => {
        const pathIds = getPathToRoot(id, nodes);
        pathIds.forEach(pid => parentsToExpand.add(pid));
      });
      
      setExpandedNodes(parentsToExpand);
    }
  }, [searchQuery, nodes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-50" 
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Location</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Selecting a location grants access to all child locations
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tree View - Scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {filteredNodes.length > 0 ? (
            <div className="space-y-1">
              {filteredNodes.map(node => (
                <TreeNodeComponent
                  key={node.id}
                  node={node}
                  level={0}
                  expandedNodes={expandedNodes}
                  selectedNodeId={selectedNodeId}
                  implicitChildIds={implicitChildIds}
                  onToggleExpand={toggleExpand}
                  onSelect={handleNodeSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-gray-500">No locations found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Selected Path Display */}
        {selectedNodeId && (
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 flex-shrink-0">
            <p className="text-xs font-medium text-blue-900 mb-1">Selected Location:</p>
            <p className="text-sm text-blue-700">{buildLocationPath(selectedNodeId, nodes)}</p>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              User will have access to this location and all child locations
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedNodeId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection
          </button>
        </div>

      </div>
    </div>
  );
}

interface TreeNodeComponentProps {
  node: LocationNode;
  level: number;
  expandedNodes: Set<string>;
  selectedNodeId: string;
  implicitChildIds: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
}

function TreeNodeComponent({ 
  node, 
  level, 
  expandedNodes, 
  selectedNodeId, 
  implicitChildIds,
  onToggleExpand, 
  onSelect 
}: TreeNodeComponentProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isImplicitChild = implicitChildIds.has(node.id) && !isSelected;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
          isSelected 
            ? "bg-blue-50 border-2 border-blue-500" 
            : isImplicitChild
            ? "bg-blue-25 border border-blue-200"
            : "hover:bg-gray-50 border border-transparent"
        }`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <div className="w-4" /> // Spacer for alignment
        )}

        {/* Icon */}
        <div className="flex-shrink-0">
          {hasChildren ? (
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Node Name */}
        <button
          onClick={() => onSelect(node.id)}
          className="flex-1 text-left text-sm font-medium text-gray-900"
        >
          {node.name}
        </button>

        {/* Checkmark if selected */}
        {isSelected && (
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}

        {/* Implicit indicator */}
        {isImplicitChild && (
          <span className="text-xs text-blue-600 flex-shrink-0">included</span>
        )}
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children!.map(child => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              selectedNodeId={selectedNodeId}
              implicitChildIds={implicitChildIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to get path to root
function getPathToRoot(nodeId: string, nodes: LocationNode[]): string[] {
  const path: string[] = [];
  const flatNodes = flattenLocationTree(nodes);
  let current = flatNodes.find(n => n.id === nodeId);
  
  while (current) {
    path.push(current.id);
    if (current.parentId) {
      current = flatNodes.find(n => n.id === current!.parentId);
    } else {
      current = undefined;
    }
  }
  
  return path;
}

// Helper function to filter nodes by search
function filterNodesBySearch(nodes: LocationNode[], query: string): LocationNode[] {
  const filtered: LocationNode[] = [];
  
  for (const node of nodes) {
    const matches = node.name.toLowerCase().includes(query);
    const filteredChildren = node.children ? filterNodesBySearch(node.children, query) : [];
    
    if (matches || filteredChildren.length > 0) {
      filtered.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
  }
  
  return filtered;
}
