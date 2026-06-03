import { useState } from 'react'
import {
  RadioButtonGroup,
  RadioButton,
  Toggle,
  Button,
  Modal,
} from '@carbon/react'
import { TrashCan, Sun, Moon, Screen } from '@carbon/icons-react'
import { useSettingsStore, type Theme } from '@/stores/useSettingsStore'
import { useProgressStore } from '@/stores/useProgressStore'

export function SettingsPage() {
  const { theme, reduceMotion, fontSize, setTheme, setReduceMotion, setFontSize } =
    useSettingsStore()
  const reset = useProgressStore((s) => s.reset)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="dsa-stack dsa-stack--gap-6">
      <header className="dsa-page-header">
        <h1 className="dsa-page-header__title">Settings</h1>
        <p className="dsa-page-header__subtitle">
          Configure appearance, accessibility, and progress data.
        </p>
      </header>

      <section className="dsa-surface dsa-settings__group">
        <h2 className="dsa-settings__heading">Appearance</h2>
        <RadioButtonGroup
          legendText="Theme"
          name="theme"
          valueSelected={theme}
          onChange={(value) => setTheme(value as Theme)}
          orientation="vertical"
        >
          <RadioButton
            id="theme-light"
            value="light"
            labelText={
              <span className="dsa-settings__radio-with-icon">
                <Sun size={14} />
                Light
              </span>
            }
          />
          <RadioButton
            id="theme-dark"
            value="dark"
            labelText={
              <span className="dsa-settings__radio-with-icon">
                <Moon size={14} />
                Dark
              </span>
            }
          />
          <RadioButton
            id="theme-system"
            value="system"
            labelText={
              <span className="dsa-settings__radio-with-icon">
                <Screen size={14} />
                Follow system
              </span>
            }
          />
        </RadioButtonGroup>

        <div className="dsa-settings__group-extra">
          <RadioButtonGroup
            legendText="Font size"
            name="font-size"
            valueSelected={fontSize}
            onChange={(value) => setFontSize(value as 'sm' | 'md' | 'lg')}
            orientation="horizontal"
          >
            <RadioButton id="font-sm" value="sm" labelText="Small" />
            <RadioButton id="font-md" value="md" labelText="Medium" />
            <RadioButton id="font-lg" value="lg" labelText="Large" />
          </RadioButtonGroup>
        </div>
      </section>

      <section className="dsa-surface dsa-settings__group">
        <h2 className="dsa-settings__heading">Accessibility</h2>
        <Toggle
          id="reduce-motion"
          labelText="Reduce motion"
          labelA="Off"
          labelB="On"
          toggled={reduceMotion}
          onToggle={setReduceMotion}
        />
        <div className="dsa-settings__hint">
          When on, animations and transitions are minimized.
        </div>
      </section>

      <section className="dsa-surface dsa-settings__group">
        <h2 className="dsa-settings__heading">Progress data</h2>
        <p className="dsa-settings__hint dsa-mt-2">
          Your XP, completed lessons, problems, achievements, and streak are
          stored locally in your browser. Resetting clears everything.
        </p>
        <div className="dsa-mt-4">
          <Button
            kind="danger"
            renderIcon={TrashCan}
            onClick={() => setConfirmOpen(true)}
          >
            Reset all progress
          </Button>
        </div>
      </section>

      <Modal
        open={confirmOpen}
        modalHeading="Reset all progress?"
        primaryButtonText="Reset everything"
        secondaryButtonText="Cancel"
        danger
        onRequestClose={() => setConfirmOpen(false)}
        onSecondarySubmit={() => setConfirmOpen(false)}
        onRequestSubmit={() => {
          reset()
          setConfirmOpen(false)
        }}
      >
        <p>
          This will permanently delete your XP, all completed lessons and
          problems, your streak, and every unlocked achievement. You can't undo
          this.
        </p>
      </Modal>
    </div>
  )
}
