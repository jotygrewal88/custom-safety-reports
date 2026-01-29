"use client";

import React, { useState, useMemo, useCallback } from "react";
import { type SDSDocument } from "./UploadSDSModal";

// Tree node structure
interface LocationNode {
  name: string;
  path: string[];
  children: Map<string, LocationNode>;
  documentCount: number;
}

interface LocationTreeProps {
  documents: SDSDocument[];
  selectedPath: string[] | null;
  onSelectLocation: (path: string[] | null) => void;
}

// Build hierarchical tree from document location paths
function buildLocationTree(documents: SDSDocument[]): Map<string, LocationNode> {
  const root = new Map<string, LocationNode>();

  documents.forEach((doc) => {
    let currentLevel = root;
    const pathSoFar: string[] = [];

    doc.locationPath.forEach((segment, index) => {
      pathSoFar.push(segment);

      if (!currentLevel.has(segment)) {
        currentLevel.set(segment, {
          name: segment,
          path: [...pathSoFar],
          children: new Map(),
          documentCount: 0,
        });
      }

      const node = currentLevel.get(segment)!;
      node.documentCount++;

      currentLevel = node.children;
    });
  });

  return root;
}

// Check if two paths are equal
function pathsEqual(path1: string[] | null, path2: string[]): boolean {
  if (!path1) return false;
  if (path1.length !== path2.length) return false;
  return path1.every((segment, index) => segment === path2[index]);
}

// Check if path1 starts with path2 (path2 is ancestor of path1)
function isAncestorPath(childPath: string[], ancestorPath: string[]): boolean {
  if (ancestorPath.length > childPath.length) return false;
  return ancestorPath.every((segment, index) => childPath[index] === segment);
}

// Tree node component
interface TreeNodeProps {
  node: LocationNode;
  level: number;
  selectedPath: string[] | null;
  expandedPaths: Set<string>;
  onToggleExpand: (pathKey: string) => void;
  onSelectLocation: (path: string[]) => void;
}

function TreeNode({
  node,
  level,
  selectedPath,
  expandedPaths,
  onToggleExpand,
  onSelectLocation,
}: TreeNodeProps) {
  const pathKey = node.path.join("/");
  const isExpanded = expandedPaths.has(pathKey);
  const hasChildren = node.children.size > 0;
  const isSelected = pathsEqual(selectedPath, node.path);
  const isInSelectedPath = selectedPath ? isAncestorPath(selectedPath, node.path) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectLocation(node.path);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(pathKey);
    }
  };

  // Level labels for tooltips
  const levelLabels = ["Site", "Area", "System", "Equipment", "Sub-unit", "Component"];
  const levelLabel = levelLabels[level] || "Location";

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors group ${
          isSelected
            ? "bg-blue-100 text-blue-900"
            : isInSelectedPath
            ? "bg-blue-50 text-blue-800"
            : "hover:bg-gray-100 text-gray-700"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        title={`${levelLabel}: ${node.name}`}
      >
        {/* Expand/Collapse Toggle */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
          >
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}

        {/* Folder/Location Icon */}
        {hasChildren ? (
          <svg
            className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-amber-500"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {isExpanded ? (
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                clipRule="evenodd"
              />
            ) : (
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            )}
          </svg>
        ) : (
          <svg
            className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}

        {/* Node Name */}
        <span
          className={`text-sm truncate flex-1 ${
            level === 0 ? "font-semibold" : "font-normal"
          }`}
        >
          {node.name}
        </span>

        {/* Document Count Badge */}
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            isSelected
              ? "bg-blue-200 text-blue-800"
              : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
          }`}
        >
          {node.documentCount}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="border-l border-gray-200 ml-4">
          {Array.from(node.children.values()).map((child) => (
            <TreeNode
              key={child.path.join("/")}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
              onSelectLocation={onSelectLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationTree({
  documents,
  selectedPath,
  onSelectLocation,
}: LocationTreeProps) {
  // Build tree from documents
  const tree = useMemo(() => buildLocationTree(documents), [documents]);

  // Track expanded nodes
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    // Initially expand the first level (sites)
    const initial = new Set<string>();
    tree.forEach((node) => {
      initial.add(node.path.join("/"));
    });
    return initial;
  });

  const toggleExpand = useCallback((pathKey: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(pathKey)) {
        next.delete(pathKey);
      } else {
        next.add(pathKey);
      }
      return next;
    });
  }, []);

  const handleSelectLocation = useCallback(
    (path: string[]) => {
      // If clicking the already selected path, deselect it
      if (pathsEqual(selectedPath, path)) {
        onSelectLocation(null);
      } else {
        onSelectLocation(path);
        // Auto-expand the selected path and its ancestors
        setExpandedPaths((prev) => {
          const next = new Set(prev);
          for (let i = 1; i <= path.length; i++) {
            next.add(path.slice(0, i).join("/"));
          }
          return next;
        });
      }
    },
    [selectedPath, onSelectLocation]
  );

  const handleShowAll = () => {
    onSelectLocation(null);
  };

  const handleExpandAll = () => {
    const allPaths = new Set<string>();
    const addAllPaths = (nodes: Map<string, LocationNode>) => {
      nodes.forEach((node) => {
        allPaths.add(node.path.join("/"));
        if (node.children.size > 0) {
          addAllPaths(node.children);
        }
      });
    };
    addAllPaths(tree);
    setExpandedPaths(allPaths);
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set());
  };

  if (tree.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No locations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleShowAll}
          className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
            selectedPath === null
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Show All
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExpandAll}
            className="text-xs text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
            title="Expand All"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={handleCollapseAll}
            className="text-xs text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
            title="Collapse All"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Level Labels */}
      <div className="flex items-center gap-1 text-xs text-gray-400 px-2">
        <span>Site</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>Area</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>...</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>Component</span>
      </div>

      {/* Tree */}
      <div className="space-y-0.5 max-h-[400px] overflow-y-auto pr-1">
        {Array.from(tree.values()).map((node) => (
          <TreeNode
            key={node.path.join("/")}
            node={node}
            level={0}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onToggleExpand={toggleExpand}
            onSelectLocation={handleSelectLocation}
          />
        ))}
      </div>

      {/* Selected Path Display */}
      {selectedPath && selectedPath.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Selected Location:</p>
          <div className="flex items-center flex-wrap gap-1 text-xs">
            {selectedPath.map((segment, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded ${
                    index === selectedPath.length - 1
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {segment}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
