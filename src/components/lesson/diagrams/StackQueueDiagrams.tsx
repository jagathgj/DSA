interface Props {
  values: (string | number)[]
}

export function StackDiagram({ values }: Props) {
  return (
    <div className="dsa-row dsa-row--start dsa-row--gap-4">
      <div className="dsa-stack-viz">
        {values.map((v, i) => (
          <div
            key={i}
            className={
              'dsa-stack-viz__item' +
              (i === values.length - 1 ? ' dsa-stack-viz__item--top' : '')
            }
          >
            {String(v)}
          </div>
        ))}
        {values.length === 0 && (
          <div className="dsa-stack-viz__item dsa-stack-viz__item--empty">
            empty
          </div>
        )}
      </div>
      {values.length > 0 && <div className="dsa-stack-label">← top</div>}
    </div>
  )
}

export function QueueDiagram({ values }: Props) {
  return (
    <div className="dsa-row dsa-row--gap-3">
      <div className="dsa-text-arrow-front">front →</div>
      <div className="dsa-queue-viz">
        {values.length === 0 ? (
          <div className="dsa-queue-viz__item dsa-queue-viz__item--empty">
            empty
          </div>
        ) : (
          values.map((v, i) => (
            <div key={i} className="dsa-queue-viz__item">
              {String(v)}
            </div>
          ))
        )}
      </div>
      <div className="dsa-text-arrow-back">← back</div>
    </div>
  )
}
