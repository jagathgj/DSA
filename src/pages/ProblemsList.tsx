import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchInput, Tag, Button } from '@carbon/react'
import { CheckmarkFilled, CircleDash } from '@carbon/icons-react'
import { getAllProblems } from '@/content/problems'
import { useProgressStore } from '@/stores/useProgressStore'

type Difficulty = 'all' | 'Easy' | 'Medium' | 'Hard'

export function ProblemsListPage() {
  const completedProblems = useProgressStore((s) => s.completedProblems)
  const problems = useMemo(() => getAllProblems(), [])
  const [difficulty, setDifficulty] = useState<Difficulty>('all')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    problems.forEach((p) => p.tags.forEach((t) => s.add(t)))
    return Array.from(s).sort()
  }, [problems])

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false
      if (activeTag && !p.tags.includes(activeTag)) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [problems, difficulty, activeTag, search])

  const solvedCount = problems.filter((p) => completedProblems[p.id]).length

  return (
    <div className="dsa-stack dsa-stack--gap-5">
      <header className="dsa-problems-list__header">
        <div>
          <h1 className="dsa-page-header__title">Practice problems</h1>
          <p className="dsa-page-header__subtitle">
            LeetCode-style challenges. Solve them in the in-browser editor.
          </p>
        </div>
        <div className="dsa-problems-list__count">
          <span className="dsa-problems-list__count-label">solved </span>
          <span className="dsa-problems-list__count-value">
            {solvedCount} / {problems.length}
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="dsa-surface dsa-stack dsa-stack--gap-3">
        <div className="dsa-problems-list__filters">
          <div className="dsa-problems-list__search">
            <SearchInput
              id="problem-search"
              labelText="Search problems"
              size="sm"
              placeholder="Search problems…"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
          <div className="dsa-problems-list__difficulty">
            {(['all', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
              <Button
                key={d}
                size="sm"
                kind={difficulty === d ? 'primary' : 'ghost'}
                onClick={() => setDifficulty(d)}
              >
                {d === 'all' ? 'All' : d}
              </Button>
            ))}
          </div>
        </div>
        {allTags.length > 0 && (
          <div className="dsa-problems-list__tags">
            <Button
              onClick={() => setActiveTag(null)}
              kind={activeTag === null ? 'primary' : 'ghost'}
              size="sm"
            >
              all tags
            </Button>
            {allTags.map((t) => (
              <Button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
                kind={activeTag === t ? 'primary' : 'ghost'}
                size="sm"
              >
                {t}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="dsa-problems-list__list">
        {filtered.length === 0 ? (
          <div className="dsa-problems-list__empty">
            No problems match those filters.
          </div>
        ) : (
          filtered.map((p) => {
            const isDone = !!completedProblems[p.id]
            const diffType =
              p.difficulty === 'Easy'
                ? 'green'
                : p.difficulty === 'Medium'
                  ? 'warm-gray'
                  : 'red'
            return (
              <Link
                key={p.id}
                to={`/problem/${p.id}`}
                className="dsa-problems-list__row"
              >
                {isDone ? (
                  <CheckmarkFilled
                    size={16}
                    className="dsa-problems-list__row-status dsa-problems-list__row-status--done"
                  />
                ) : (
                  <CircleDash
                    size={16}
                    className="dsa-problems-list__row-status dsa-problems-list__row-status--pending"
                  />
                )}
                <div className="dsa-problems-list__row-main">
                  <div className="dsa-problems-list__row-title">{p.title}</div>
                  <div className="dsa-problems-list__row-tags">
                    {p.tags.map((t) => (
                      <Tag key={t} size="sm" type="cool-gray">
                        {t}
                      </Tag>
                    ))}
                  </div>
                </div>
                <Tag size="sm" type={diffType}>
                  {p.difficulty}
                </Tag>
                <div className="dsa-problems-list__row-xp">+{p.xpReward}</div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
