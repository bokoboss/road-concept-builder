import { useMemo, useState, type ChangeEvent } from 'react'
import {
  phase1DrawingSettings,
  phase1NumericLimits,
  phase2BPocketNumericLimits,
  phase2UTurnNumericLimits,
  type DrawingViewOptions,
  type MedianType,
  type PavementMarkingAdjustment,
  type StraightRoadParameters,
  type UTurnDirection,
} from '../domain/straightRoad'
import { buildStraightRoadGeometry } from '../geometry/straightRoadGeometry'
import type { ValidationIssue } from '../validation/validateStraightRoad'
import { ValidationPanel } from './ValidationPanel'

type RightInspectorProps = {
  parameters: StraightRoadParameters
  viewOptions: DrawingViewOptions
  issues: ValidationIssue[]
  onChange: (parameters: StraightRoadParameters) => void
  onViewOptionsChange: (viewOptions: DrawingViewOptions) => void
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

function markingLabel(id: string) {
  return id
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function adjustmentFor(
  parameters: StraightRoadParameters,
  id: string,
): PavementMarkingAdjustment {
  return {
    offsetXMeters: parameters.markingAdjustments[id]?.offsetXMeters ?? 0,
    offsetYMeters: parameters.markingAdjustments[id]?.offsetYMeters ?? 0,
    visible: parameters.markingAdjustments[id]?.visible ?? true,
    scale: parameters.markingAdjustments[id]?.scale ?? 1,
  }
}

export function RightInspector({
  parameters,
  viewOptions,
  issues,
  onChange,
  onViewOptionsChange,
}: RightInspectorProps) {
  const geometry = useMemo(
    () => buildStraightRoadGeometry(parameters, phase1DrawingSettings),
    [parameters],
  )
  const generatedMarkings = geometry.pavementMarkings.filter(
    (marking) => marking.source === 'generated',
  )
  const [selectedMarkingId, setSelectedMarkingId] = useState('')
  const activeMarking =
    generatedMarkings.find((marking) => marking.id === selectedMarkingId) ?? generatedMarkings[0]
  const activeAdjustment = activeMarking ? adjustmentFor(parameters, activeMarking.id) : null

  const update = <Key extends keyof StraightRoadParameters>(
    key: Key,
    value: StraightRoadParameters[Key],
  ) => onChange({ ...parameters, [key]: value })
  const updateViewOption = <Key extends keyof DrawingViewOptions>(
    key: Key,
    value: DrawingViewOptions[Key],
  ) => onViewOptionsChange({ ...viewOptions, [key]: value })
  const updateMarkingAdjustment = (
    id: string,
    values: Partial<PavementMarkingAdjustment>,
  ) => {
    const current = adjustmentFor(parameters, id)
    onChange({
      ...parameters,
      markingAdjustments: {
        ...parameters.markingAdjustments,
        [id]: { ...current, ...values },
      },
    })
  }
  const updateUTurn = <Key extends keyof StraightRoadParameters['uTurn']>(
    key: Key,
    value: StraightRoadParameters['uTurn'][Key],
  ) => onChange({ ...parameters, uTurn: { ...parameters.uTurn, [key]: value } })
  const updateUTurnPocket = <Key extends keyof StraightRoadParameters['uTurn']['pocket']>(
    key: Key,
    value: StraightRoadParameters['uTurn']['pocket'][Key],
  ) =>
    onChange({
      ...parameters,
      uTurn: {
        ...parameters.uTurn,
        pocket: { ...parameters.uTurn.pocket, [key]: value },
      },
    })

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
          <h3>View options</h3>
          <label className="inspector-field checkbox-field">
            <span>Show drawing labels</span>
            <input
              type="checkbox"
              checked={viewOptions.showLabels}
              onChange={(event) => updateViewOption('showLabels', event.target.checked)}
            />
          </label>
          <label className="inspector-field checkbox-field">
            <span>Show lane labels</span>
            <input
              type="checkbox"
              checked={viewOptions.showLaneLabels}
              disabled={!viewOptions.showLabels}
              onChange={(event) => updateViewOption('showLaneLabels', event.target.checked)}
            />
          </label>
          <label className="inspector-field checkbox-field">
            <span>Show feature labels</span>
            <input
              type="checkbox"
              checked={viewOptions.showFeatureLabels}
              disabled={!viewOptions.showLabels}
              onChange={(event) => updateViewOption('showFeatureLabels', event.target.checked)}
            />
          </label>
          <label className="inspector-field checkbox-field">
            <span>Show pavement markings</span>
            <input
              type="checkbox"
              checked={viewOptions.showPavementMarkings}
              onChange={(event) => updateViewOption('showPavementMarkings', event.target.checked)}
            />
          </label>
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
          <label className="inspector-field">
            <span>Selected marking</span>
            <select
              value={activeMarking?.id ?? ''}
              disabled={generatedMarkings.length === 0}
              onChange={(event) => setSelectedMarkingId(event.target.value)}
            >
              {generatedMarkings.length === 0 ? (
                <option value="">No generated markings</option>
              ) : (
                generatedMarkings.map((marking) => (
                  <option key={marking.id} value={marking.id}>
                    {markingLabel(marking.id)}
                  </option>
                ))
              )}
            </select>
          </label>
          {activeMarking && activeAdjustment && (
            <div className="inspector-subgroup">
              <h4>Marking position</h4>
              <label className="inspector-field checkbox-field">
                <span>Visible</span>
                <input
                  type="checkbox"
                  checked={activeAdjustment.visible}
                  onChange={(event) =>
                    updateMarkingAdjustment(activeMarking.id, { visible: event.target.checked })
                  }
                />
              </label>
              <NumberField
                label="Nudge X (m)"
                value={activeAdjustment.offsetXMeters}
                step={0.25}
                onChange={(value) =>
                  updateMarkingAdjustment(activeMarking.id, { offsetXMeters: value })
                }
              />
              <NumberField
                label="Nudge Y (m)"
                value={activeAdjustment.offsetYMeters}
                step={0.25}
                onChange={(value) =>
                  updateMarkingAdjustment(activeMarking.id, { offsetYMeters: value })
                }
              />
              <NumberField
                label="Scale"
                value={activeAdjustment.scale}
                step={0.1}
                min={0.4}
                max={2}
                onChange={(value) => updateMarkingAdjustment(activeMarking.id, { scale: value })}
              />
            </div>
          )}
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
          <div className="inspector-subgroup">
            <h4>U-turn pocket</h4>
            <label className="inspector-field checkbox-field">
              <span>Enable U-turn pocket</span>
              <input
                type="checkbox"
                checked={parameters.uTurn.pocket.enabled}
                disabled={!parameters.uTurn.enabled}
                onChange={(event) => updateUTurnPocket('enabled', event.target.checked)}
              />
            </label>
            <NumberField
              label="Storage length (m)"
              value={parameters.uTurn.pocket.storageLengthMeters}
              step={0.5}
              min={phase2BPocketNumericLimits.storageLengthMeters.min}
              max={phase2BPocketNumericLimits.storageLengthMeters.max}
              disabled={!parameters.uTurn.enabled}
              onChange={(value) => updateUTurnPocket('storageLengthMeters', value)}
            />
            <NumberField
              label="Taper length (m)"
              value={parameters.uTurn.pocket.taperLengthMeters}
              step={0.5}
              min={phase2BPocketNumericLimits.taperLengthMeters.min}
              max={phase2BPocketNumericLimits.taperLengthMeters.max}
              disabled={!parameters.uTurn.enabled}
              onChange={(value) => updateUTurnPocket('taperLengthMeters', value)}
            />
            <label className="inspector-field checkbox-field">
              <span>Show pocket arrow</span>
              <input
                type="checkbox"
                checked={parameters.uTurn.pocket.showArrow}
                disabled={!parameters.uTurn.enabled}
                onChange={(event) => updateUTurnPocket('showArrow', event.target.checked)}
              />
            </label>
          </div>
        </div>
      </section>
      <ValidationPanel issues={issues} />
    </aside>
  )
}
