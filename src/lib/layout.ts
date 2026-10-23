import type { ContentSystem } from '../content/types.ts';

export interface PlacedNode {
  id: string;
  /** Centre, in diagram units. */
  x: number;
  y: number;
}

export interface DiagramLayout {
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  cols: number;
  rows: number;
  nodes: Map<string, PlacedNode>;
  edges: { from: string; to: string; d: string }[];
}

/**
 * Deterministic grid layout for a system diagram (no DOM measuring, so screen
 * and print render identically). Columns are pipeline stages; rows hold
 * parallel steps and are centred vertically within their column.
 */
export function layoutSystem(system: ContentSystem, width: number, height: number, nodeWidth: number, nodeHeight: number): DiagramLayout {
  const cols = Math.max(...system.nodes.map((n) => n.col)) + 1;
  const rowsPerCol = new Map<number, number>();
  for (const n of system.nodes) rowsPerCol.set(n.col, Math.max(rowsPerCol.get(n.col) ?? 0, (n.row ?? 0) + 1));
  const rows = Math.max(...rowsPerCol.values());

  const colWidth = cols > 1 ? (width - nodeWidth) / (cols - 1) : 0;
  const rowGap = nodeHeight * 0.55;
  const nodes = new Map<string, PlacedNode>();
  for (const n of system.nodes) {
    const inCol = rowsPerCol.get(n.col) ?? 1;
    const blockHeight = inCol * nodeHeight + (inCol - 1) * rowGap;
    const top = (height - blockHeight) / 2;
    const x = cols > 1 ? nodeWidth / 2 + n.col * colWidth : width / 2;
    const y = top + (n.row ?? 0) * (nodeHeight + rowGap) + nodeHeight / 2;
    nodes.set(n.id, { id: n.id, x, y });
  }

  const edges = system.edges.flatMap(([from, to]) => {
    const a = nodes.get(from);
    const b = nodes.get(to);
    if (!a || !b) return [];
    const x1 = a.x + nodeWidth / 2;
    const x2 = b.x - nodeWidth / 2;
    const mid = (x1 + x2) / 2;
    const d = `M${x1.toFixed(1)} ${a.y.toFixed(1)} C${mid.toFixed(1)} ${a.y.toFixed(1)} ${mid.toFixed(1)} ${b.y.toFixed(1)} ${x2.toFixed(1)} ${b.y.toFixed(1)}`;
    return [{ from, to, d }];
  });

  return { width, height, nodeWidth, nodeHeight, cols, rows, nodes, edges };
}

/** Group nodes by column, for the stacked (mobile / list) rendering. */
export function stages(system: ContentSystem) {
  const cols = new Map<number, ContentSystem['nodes']>();
  for (const n of system.nodes) cols.set(n.col, [...(cols.get(n.col) ?? []), n]);
  return [...cols.entries()].sort(([a], [b]) => a - b).map(([, nodes]) => nodes.sort((a, b) => (a.row ?? 0) - (b.row ?? 0)));
}
