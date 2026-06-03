import { useState } from 'react'
import { Button } from '@carbon/react'
import {
  SortAscending,
  Search,
  TreeViewAlt,
  ChartNetwork,
} from '@carbon/icons-react'
import { SortingVisualizer } from '@/components/visualizers/SortingVisualizer'
import { SearchingVisualizer } from '@/components/visualizers/SearchingVisualizer'
import { TreeVisualizer } from '@/components/visualizers/TreeVisualizer'
import { GraphVisualizer } from '@/components/visualizers/GraphVisualizer'

type Tab = 'sorting' | 'searching' | 'trees' | 'graphs'

const TABS: { id: Tab; label: string; icon: any; description: string }[] = [
  {
    id: 'sorting',
    label: 'Sorting',
    icon: SortAscending,
    description:
      'Watch comparisons and swaps for bubble, selection, insertion, merge, and quick sort.',
  },
  {
    id: 'searching',
    label: 'Searching',
    icon: Search,
    description: 'Linear vs binary search — see how the search window shrinks.',
  },
  {
    id: 'trees',
    label: 'Trees',
    icon: TreeViewAlt,
    description: 'BFS, inorder, preorder, and postorder traversals on a BST.',
  },
  {
    id: 'graphs',
    label: 'Graphs',
    icon: ChartNetwork,
    description: 'BFS uses a queue, DFS uses a stack — watch both unfold.',
  },
]

export function VisualizerPage() {
  const [tab, setTab] = useState<Tab>('sorting')
  const current = TABS.find((t) => t.id === tab)!

  return (
    <div className="dsa-stack dsa-stack--gap-5">
      <header className="dsa-page-header">
        <h1 className="dsa-page-header__title">Algorithm visualizer</h1>
        <p className="dsa-page-header__subtitle">
          Step through algorithms frame by frame. Adjust speed, change the
          input, and watch the data structure evolve.
        </p>
      </header>

      <div className="dsa-tabs" role="tablist">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = t.id === tab
          return (
            <Button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={'dsa-tab' + (active ? ' dsa-tab--active' : '')}
              kind="ghost"
            >
              <Icon size={16} />
              {t.label}
            </Button>
          )
        })}
      </div>

      <div className="dsa-text-secondary">{current.description}</div>

      <div>
        {tab === 'sorting' && <SortingVisualizer />}
        {tab === 'searching' && <SearchingVisualizer />}
        {tab === 'trees' && <TreeVisualizer />}
        {tab === 'graphs' && <GraphVisualizer />}
      </div>
    </div>
  )
}
