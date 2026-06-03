import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextInput, Button } from '@carbon/react'
import { Add, TrashCan, Search, Edit } from '@carbon/icons-react'

export function ArrayPlayground() {
  const [arr, setArr] = useState<number[]>([10, 25, 40, 55])
  const [value, setValue] = useState('')
  const [index, setIndex] = useState('')
  const [highlight, setHighlight] = useState<number[]>([])
  const [log, setLog] = useState<string>('Try operations to see how arrays behave.')

  function flashHighlight(idxs: number[]) {
    setHighlight(idxs)
    setTimeout(() => setHighlight([]), 1500)
  }

  function handlePushEnd() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number first.')
    setArr((a) => [...a, v])
    flashHighlight([arr.length])
    setLog(`✓ push(${v}) — O(1), added to end.`)
  }

  function handleInsertAt() {
    const v = Number(value)
    const i = Number(index)
    if (!Number.isFinite(v) || !Number.isFinite(i))
      return setLog('⚠ Need value and index.')
    if (i < 0 || i > arr.length)
      return setLog(`⚠ Index out of range (0–${arr.length}).`)
    setArr((a) => [...a.slice(0, i), v, ...a.slice(i)])
    flashHighlight([i])
    setLog(`✓ inserted ${v} at index ${i} — O(n) because everything after shifts.`)
  }

  function handleRemoveAt() {
    const i = Number(index)
    if (!Number.isFinite(i)) return setLog('⚠ Enter an index.')
    if (i < 0 || i >= arr.length)
      return setLog(`⚠ Index out of range (0–${arr.length - 1}).`)
    const removed = arr[i]
    setArr((a) => a.filter((_, k) => k !== i))
    setLog(`✓ removed ${removed} from index ${i} — O(n) because items shift left.`)
  }

  function handleSearch() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number to search.')
    const i = arr.indexOf(v)
    if (i === -1) {
      setLog(`✗ ${v} not found — searched all ${arr.length} slots, O(n).`)
    } else {
      flashHighlight([i])
      setLog(`✓ found ${v} at index ${i} — O(n) linear search.`)
    }
  }

  function handleUpdate() {
    const v = Number(value)
    const i = Number(index)
    if (!Number.isFinite(v) || !Number.isFinite(i))
      return setLog('⚠ Need value and index.')
    if (i < 0 || i >= arr.length) return setLog(`⚠ Index out of range.`)
    setArr((a) => a.map((x, k) => (k === i ? v : x)))
    flashHighlight([i])
    setLog(`✓ arr[${i}] = ${v} — O(1) direct access.`)
  }

  return (
    <div className="dsa-surface">
      <div className="dsa-interactive__viewport">
        {arr.length === 0 ? (
          <div className="dsa-interactive__empty">
            empty array — try adding something
          </div>
        ) : (
          <div className="dsa-interactive__row">
            <AnimatePresence mode="popLayout">
              {arr.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="dsa-array-cell-stack"
                >
                  <div
                    className={
                      'dsa-array-cell' +
                      (highlight.includes(i) ? ' dsa-array-cell--highlight' : '')
                    }
                  >
                    {v}
                  </div>
                  <div className="dsa-array-cell-index-below">{i}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="dsa-interactive__controls">
        <TextInput
          id="arr-value"
          labelText="Value"
          placeholder="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
        />
        <TextInput
          id="arr-index"
          labelText="Index"
          placeholder="position"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          size="sm"
        />
      </div>

      <div className="dsa-interactive__buttons">
        <Button size="sm" kind="tertiary" renderIcon={Add} onClick={handlePushEnd}>
          push end
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={Add} onClick={handleInsertAt}>
          insert at
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={TrashCan} onClick={handleRemoveAt}>
          remove at
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={Search} onClick={handleSearch}>
          search
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={Edit} onClick={handleUpdate}>
          update at
        </Button>
      </div>

      <div className="dsa-interactive__log">{log}</div>
    </div>
  )
}
