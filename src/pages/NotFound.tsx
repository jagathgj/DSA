import { Link } from 'react-router-dom'
import { Button } from '@carbon/react'
import { ArrowLeft, Compass } from '@carbon/icons-react'

export function NotFoundPage() {
  return (
    <div className="dsa-surface dsa-not-found">
      <Compass size={48} className="dsa-not-found__icon" />
      <h1 className="dsa-not-found__title">404 — page not found</h1>
      <p className="dsa-not-found__body">
        We couldn't find what you're looking for. The link might be stale, or
        you may have typed the URL by hand.
      </p>
      <Link to="/">
        <Button kind="primary" renderIcon={ArrowLeft}>
          Back to dashboard
        </Button>
      </Link>
    </div>
  )
}
