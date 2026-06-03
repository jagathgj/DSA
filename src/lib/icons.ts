import * as Icons from '@carbon/icons-react'

// Module data was originally authored with lucide icon names. Rather than
// editing 21 modules, we resolve here. Anything unknown falls back to a circle.
const MAP: Record<string, string> = {
  Sparkles: 'StarFilled',
  Gauge: 'Meter',
  LayoutGrid: 'GridAlt',
  Type: 'StringText',
  Repeat: 'Repeat',
  Link2: 'Link',
  Layers: 'Layers',
  AlignLeft: 'TextAlignLeft',
  KeySquare: 'Password',
  Boxes: 'Box',
  GitBranch: 'TreeViewAlt',
  Binary: 'TreeView',
  Mountain: 'Chip',
  Network: 'ChartNetwork',
  ArrowDownUp: 'SortAscending',
  Search: 'Search',
  MoveHorizontal: 'ArrowsHorizontal',
  Move3D: 'Move',
  TrendingUp: 'ChartLine',
  RotateCcw: 'Reset',
  Brain: 'MachineLearningModel',
}

export function resolveIcon(name: string): any {
  const carbonName = MAP[name] ?? name
  return (Icons as any)[carbonName] ?? Icons.Document
}
