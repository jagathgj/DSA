import { ArrowRight } from '@carbon/icons-react'

interface Props {
  values: (string | number)[]
  nullTerminated?: boolean
}

export function LinkedListDiagram({ values, nullTerminated = true }: Props) {
  return (
    <div className="dsa-ll-nodes">
      {values.map((v, i) => (
        <div key={i} className="dsa-ll-segment">
          <div className="dsa-ll-node">{String(v)}</div>
          {i < values.length - 1 && (
            <ArrowRight size={16} className="dsa-ll-arrow" />
          )}
        </div>
      ))}
      {nullTerminated && (
        <>
          <ArrowRight size={16} className="dsa-ll-arrow" />
          <span className="dsa-ll-null-end">null</span>
        </>
      )}
    </div>
  )
}
