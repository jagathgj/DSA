import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextInput, Button } from '@carbon/react'
import { Add, ArrowDown, ArrowUp, View } from '@carbon/icons-react'

export function StackPlayground() {
  const [stack, setStack] = useState<number[]>([10, 20, 30])
  const [value, setValue] = useState('')
  const [log, setLog] = useState('LIFO — last in, first out.')

  function push() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number.')
    setStack((s) => [...s, v])
    setLog(`✓ push(${v}) — added on top, O(1).`)
  }

  function pop() {
    if (stack.length === 0) return setLog('⚠ Stack is empty.')
    const top = stack[stack.length - 1]
    setStack((s) => s.slice(0, -1))
    setLog(`✓ pop() returned ${top} — O(1).`)
  }

  function peek() {
    if (stack.length === 0) return setLog('⚠ Stack is empty.')
    setLog(`👁 peek() returned ${stack[stack.length - 1]} — O(1).`)
  }

  return (
    <div className="dsa-surface">
      <div className="dsa-interactive__viewport dsa-interactive__viewport--stack">
        <div className="dsa-stack-viz dsa-stack-viz--wide">
          <div className="dsa-stack-viz__floor" />
          <AnimatePresence>
            {stack.map((v, i) => (
              <motion.div
                key={`${i}-${v}`}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.18 }}
                className={
                  'dsa-stack-viz__item' +
                  (i === stack.length - 1 ? ' dsa-stack-viz__item--top' : '')
                }
              >
                {v}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="dsa-interactive__field">
        <TextInput
          id="stack-value"
          labelText="Value"
          placeholder="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
        />
      </div>

      <div className="dsa-interactive__buttons">
        <Button size="sm" kind="tertiary" renderIcon={ArrowDown} onClick={push}>
          push
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={ArrowUp} onClick={pop}>
          pop
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={View} onClick={peek}>
          peek
        </Button>
      </div>

      <div className="dsa-interactive__log">{log}</div>
    </div>
  )
}

export function QueuePlayground() {
  const [queue, setQueue] = useState<number[]>([10, 20, 30])
  const [value, setValue] = useState('')
  const [log, setLog] = useState('FIFO — first in, first out.')

  function enqueue() {
    const v = Number(value)
    if (!Number.isFinite(v)) return setLog('⚠ Enter a number.')
    setQueue((q) => [...q, v])
    setLog(`✓ enqueue(${v}) — added to back, O(1).`)
  }

  function dequeue() {
    if (queue.length === 0) return setLog('⚠ Queue is empty.')
    const front = queue[0]
    setQueue((q) => q.slice(1))
    setLog(`✓ dequeue() returned ${front} — O(1) with linked list, O(n) with plain array.`)
  }

  return (
    <div className="dsa-surface">
      <div className="dsa-interactive__viewport dsa-interactive__viewport--queue">
        <div className="dsa-queue-label">
          <span>front →</span>
          <span>← back</span>
        </div>
        {queue.length === 0 ? (
          <div className="dsa-interactive__empty">empty</div>
        ) : (
          <div className="dsa-row dsa-row--center">
            <AnimatePresence mode="popLayout">
              {queue.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className={
                    'dsa-queue-viz__item' +
                    (i === 0 ? ' dsa-queue-viz__item--front' : '')
                  }
                >
                  {v}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="dsa-interactive__field">
        <TextInput
          id="queue-value"
          labelText="Value"
          placeholder="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
        />
      </div>

      <div className="dsa-interactive__buttons">
        <Button size="sm" kind="tertiary" renderIcon={Add} onClick={enqueue}>
          enqueue
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={ArrowUp} onClick={dequeue}>
          dequeue
        </Button>
      </div>

      <div className="dsa-interactive__log">{log}</div>
    </div>
  )
}
