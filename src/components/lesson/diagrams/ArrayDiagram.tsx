import { motion } from 'framer-motion'

interface Props {
  values: (string | number)[]
  highlight?: number[]
  labels?: string[]
}

export function ArrayDiagram({ values, highlight = [], labels }: Props) {
  return (
    <div className="dsa-array-cells dsa-array-pad-top">
      {values.map((v, i) => {
        const isHl = highlight.includes(i)
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={
              'dsa-array-cell' + (isHl ? ' dsa-array-cell--highlight' : '')
            }
          >
            <span className="dsa-array-cell__index">{labels?.[i] ?? i}</span>
            <span>{String(v)}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
