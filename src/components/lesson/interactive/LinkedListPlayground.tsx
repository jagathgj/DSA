import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextInput, Button } from '@carbon/react'
import { Add, TrashCan, Search, ArrowRight } from '@carbon/icons-react'

export function LinkedListPlayground() {
  const [list, setList] = useState<number[]>([10, 20, 30])
  const [value, setValue] = useState('')
  const [highlight, setHighlight] = useState<number[]>([])
  const [log, setLog] = useState<string>('Add nodes at the head or tail.')

  function flash(idxs: number[]) {
    setHighlight(idxs)
    setTimeout(() => setHighlight([]), 1500)
  }

  function addHead() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number first.')
    setList((l) => [v, ...l])
    flash([0])
    setLog(`✓ inserted ${v} at head — O(1), just rewires the head pointer.`)
  }

  function addTail() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number first.')
    setList((l) => [...l, v])
    flash([list.length])
    setLog(`✓ inserted ${v} at tail — O(n) without tail pointer, O(1) with one.`)
  }

  function removeHead() {
    if (list.length === 0) return setLog('⚠ List is empty.')
    const v = list[0]
    setList((l) => l.slice(1))
    setLog(`✓ removed ${v} from head — O(1).`)
  }

  function search() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number.')
    const i = list.indexOf(v)
    if (i === -1) setLog(`✗ ${v} not found — O(n) walk.`)
    else {
      flash([i])
      setLog(`✓ found ${v} at position ${i} — O(n) walk from head.`)
    }
  }

  return (
    <div className="dsa-surface">
      <div className="dsa-interactive__viewport">
        {list.length === 0 ? (
          <div className="dsa-interactive__empty dsa-interactive__empty--code">
            null (empty list)
          </div>
        ) : (
          <div className="dsa-row dsa-row--gap-2">
            <AnimatePresence mode="popLayout">
              {list.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="dsa-ll-segment"
                >
                  <div
                    className={
                      'dsa-ll-node' +
                      (highlight.includes(i) ? ' dsa-array-cell--highlight' : '')
                    }
                  >
                    {v}
                  </div>
                  <ArrowRight size={16} className="dsa-ll-arrow" />
                </motion.div>
              ))}
            </AnimatePresence>
            <span className="dsa-ll-null">null</span>
          </div>
        )}
      </div>

      <div className="dsa-interactive__field">
        <TextInput
          id="ll-value"
          labelText="Value"
          placeholder="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
        />
      </div>

      <div className="dsa-interactive__buttons">
        <Button size="sm" kind="tertiary" renderIcon={Add} onClick={addHead}>
          add head
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={Add} onClick={addTail}>
          add tail
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={TrashCan} onClick={removeHead}>
          remove head
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={Search} onClick={search}>
          search
        </Button>
      </div>

      <div className="dsa-interactive__log">{log}</div>
    </div>
  )
}
