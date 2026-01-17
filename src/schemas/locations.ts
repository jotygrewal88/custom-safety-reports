/**
 * EHS Location Hierarchy Type Definitions
 * 
 * Defines a 6-level recursive organizational tree structure.
 * Users assigned to a node inherit visibility for that node and all children.
 */

export interface LocationNode {
  id: string;
  name: string;
  level: number;              // 1-6 (1 = top level, 6 = deepest)
  parentId: string | null;    // null for root nodes
  children?: LocationNode[];  // Recursive children
}

// Utility function to build a full path string from a node
export function buildLocationPath(nodeId: string, allNodes: LocationNode[]): string {
  const path: string[] = [];
  let currentNode = findNodeById(nodeId, allNodes);
  
  while (currentNode) {
    path.unshift(currentNode.name);
    if (currentNode.parentId) {
      currentNode = findNodeById(currentNode.parentId, allNodes);
    } else {
      currentNode = null;
    }
  }
  
  return path.join(' > ');
}

// Utility function to find a node by ID in the tree
export function findNodeById(nodeId: string, nodes: LocationNode[]): LocationNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(nodeId, node.children);
      if (found) return found;
    }
  }
  return null;
}

// Utility function to get all child node IDs (recursive)
export function getAllChildNodeIds(nodeId: string, nodes: LocationNode[]): string[] {
  const node = findNodeById(nodeId, nodes);
  if (!node) return [];
  
  const childIds: string[] = [nodeId]; // Include the node itself
  
  if (node.children) {
    node.children.forEach(child => {
      childIds.push(...getAllChildNodeIds(child.id, nodes));
    });
  }
  
  return childIds;
}

// Utility function to flatten tree to array (for searching)
export function flattenLocationTree(nodes: LocationNode[]): LocationNode[] {
  const flattened: LocationNode[] = [];
  
  function traverse(nodeList: LocationNode[]) {
    nodeList.forEach(node => {
      flattened.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  }
  
  traverse(nodes);
  return flattened;
}
