import type { ChangeEvent } from 'react'
import {
  phase1DrawingSettings,
  phase1NumericLimits,
  phase2UTurnNumericLimits,
  type MedianType,
  type StraightRoadParameters,
  type UTurnDirection,
} from '../domain/straightRoad'
import type { ValidationIssue } from '../validation/validateStraightRoad'
import { ValidationPanel } from './ValidationPanel'

type RightInspectorProps = {
  parameters: StraightRoadParameters
  issues: ValidationIssue[]
  onChange: (parameters: StraightRoadParameters) => void
}

function NumberField({
  label,
  value,
  step = 1,
  min,
  max,
  disabled = false,
  onChange,
}: {
  label: string
  value: number
  step?: number
  min?: number
  max?: number
  disabled?: boolean
  onChange: (value: number) => void
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value === '' ? Number.NaN : event.target.valueAsNumber)
  }

  return (
    <label className="inspector-field">
      <span>{label}</span>
      <input
        type="number"
        value={Number.isNaN(value) ? '' : value}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        onChange={handleChange}
      />
    </label>
  )
}

export function RightInspector({ parameters, issues, onChange }: RightInspectorProps) {
  const update = <Key extends keyof StraightRoadParameters>(
    key: Key,
    value: StraightRoadParameters[Key],
  ) => onChange({ ...parameters, [key]: value })
  const updateUTurn = <Key extends keyof StraightRoadParameters['uTurn']>(
    key: Key,
    value: StraightRoadParameters['uTurn'][Key],
  ) => onChange({ ...parameters, uTurn: { ...parameters.uTurn, [key]: value } })

  return (
    <aside className="right-panel">
      <section className="inspector-panel">
        <div className="panel-intro">
          <span className="eyebrow">Selected template</span>
          <h2>Straight road segment</h2>
          <p>Adjust concept parameters and review the live SVG preview.</p>
        </div>

        <div className="status-card">
          <span>Drawing context</span>
          <strong>THAILAND - LEFT-HAND TRAFFIC</strong>
          <p>Eastbound is upper; westbound is lower. Dimensions are concept assumptions.</p>
        </div>

        <div className="inspector-group">
          <h3>Lanes</h3>
          <NumberField
            label="Eastbound lanes"
            value={parameters.eastboundLaneCount}
            min={0}
            max={phase1DrawingSettings.maxLaneCountPerDirection}
            onChange={(value) => update('eastboundLaneCount', value)}
          />
          <NumberField
            label="Westbound lanes"
            value={parameters.westboundLaneCount}
            min={0}
            max={phase1DrawingSettings.maxLaneCountPerDirection}
            onChange={(value) => update('westboundLaneCount', value)}
          />
          <NumberField
            label="Lane width (m)"
            value={parameters.laneWidthMeters}
            step={0.1}
            min={phase1NumericLimits.laneWidthMeters.min}
            max={phase1NumericLimits.laneWidthMeters.max}
            onChange={(value) => update('laneWidthMeters', value)}
          />
        </div>

        <div className="inspector-group">
          <h3>Shoulders and median</h3>
          <NumberField
            label="Outer shoulder (m)"
            value={parameters.shoulderWidthMeters}
            step={0.1}
            min={phase1NumericLimits.shoulderWidthMeters.min}
            max={phase1NumericLimits.shoulderWidthMeters.max}
            onChange={(value) => update('shoulderWidthMeters', value)}
          />
          <label className="inspector-field">
            <span>Median type</span>
            <select
              value={parameters.medianType}
              onChange={(event) => update('medianType', event.target.value as MedianType)}
            >
              <option value="none">None</option>
              <option value="painted">Painted</option>
              <option value="raised">Raised</option>
            </select>
          </label>
          <NumberField
            label="Median width (m)"
            value={parameters.medianWidthMeters}
            step={0.1}
            min={phase1NumericLimits.medianWidthMeters.min}
            max={phase1NumericLimits.medianWidthMeters.max}
            disabled={parameters.medianType === 'none'}
            onChange={(value) => update('medianWidthMeters', value)}
          />
        </div>

        <div className="inspector-group">
          <h3>Markings</h3>
          <label className="inspector-field checkbox-field">
            <span>Show lane arrows</span>
            <input
              type="checkbox"
              checked={parameters.showLaneArrows}
              onChange={(event) => update('showLaneArrows', event.target.checked)}
            />
          </label>
        </div>

        <div className="inspector-group">
          <h3>U-turn / median opening</h3>
          <label className="inspector-field checkbox-field">
            <span>Enable U-turn opening</span>
            <input
              type="checkbox"
              checked={parameters.uTurn.enabled}
              onChange={(event) => updateUTurn('enabled', event.target.checked)}
            />
          </label>
          <label className="inspector-field">
            <span>Direction</span>
            <select
              value={parameters.uTurn.direction}
              disabled={!parameters.uTurn.enabled}
              onChange={(event) =>
                updateUTurn('direction', event.target.value as UTurnDirection)
              }
            >
              <option value="eastbound-to-westbound">Eastbound to westbound</option>
              <option value="westbound-to-eastbound">Westbound to eastbound</option>
            </select>
          </label>
          <NumberField
            label="Opening position (m)"
            value={parameters.uTurn.positionMeters}
            step={0.5}
            min={0}
            max={phase1DrawingSettings.segmentLengthMeters}
            disabled={!parameters.uTurn.enabled}
            onChange={(value) => updateUTurn('positionMeters', value)}
          />
          <NumberField
            label="Opening width (m)"
            value={parameters.uTurn.openingWidthMeters}
            step={0.5}
            min={phase2UTurnNumericLimits.openingWidthMeters.min}
            max={phase2UTurnNumericLimits.openingWidthMeters.max}
            disabled={!parameters.uTurn.enabled}
            onChange={(value) => updateUTurn('openingWidthMeters', value)}
          />
          <label className="inspector-field checkbox-field">
            <span>Show U-turn arrow</span>
            <input
              type="checkbox"
              checked={parameters.uTurn.showArrow}
              disabled={!parameters.uTurn.enabled}
              onChange={(event) => updateUTurn('showArrow', event.target.checked)}
            />
          </label>
        </div>
      </section>
      <ValidationPanel issues={issues} />
    </aside>
  )
}
