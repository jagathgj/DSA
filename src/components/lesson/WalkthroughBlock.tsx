import { useState } from 'react'
import type { WalkthroughSection } from '@/types'
import { Button } from '@carbon/react'
import { ChevronLeft, ChevronRight } from '@carbon/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

export function WalkthroughBlock({ section }: { section: WalkthroughSection }) {
  const [step, setStep] = useState(0)
  const total = section.steps.length
  const cur = section.steps[step]

  return (
    <section className="dsa-section">
      <div className="dsa-walkthrough">
        <div className="dsa-walkthrough__head">
          <div>
            <div className="dsa-eyebrow">Walkthrough</div>
            <div className="dsa-walkthrough__title">{section.title}</div>
          </div>
          <div className="dsa-walkthrough__step-count">
            {step + 1} / {total}
          </div>
        </div>
        <div className="dsa-walkthrough__body">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              <p className="dsa-walkthrough__text">{cur.text}</p>
              {cur.code && <pre className="dsa-code-block">{cur.code}</pre>}
              {cur.highlight && (
                <div className="dsa-walkthrough__highlight">{cur.highlight}</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="dsa-walkthrough__nav">
          <Button
            kind="ghost"
            size="sm"
            renderIcon={ChevronLeft}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Previous
          </Button>
          <div className="dsa-walkthrough-dots">
            {section.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={
                  'dsa-walkthrough-dot' +
                  (i === step ? ' dsa-walkthrough-dot--active' : '')
                }
                aria-label={`Step ${i + 1}`}
                type="button"
              />
            ))}
          </div>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={ChevronRight}
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
            disabled={step === total - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}
