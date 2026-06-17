import { type ChangeEvent } from 'react'
import {
  phase1DrawingSettings,
  phase1NumericLimits,
  phase2BPocketNumericLimits,
  phase2UTurnNumericLimits,
  type DrawingViewOptions,
  type MedianType,
  type StraightRoadParameters,
  type UTurnDirection,
} from '../domain/straightRoad'
import {
  deleteSelectedCanvasObject,
  duplicateSelectedManualObject,
  moveSelectedCanvasObjectZ,
  selectCanvasObject,
  syncGeneratedCanvasObjects,
  updateCanvasObject,
  updateParametricRoad,
  type CanvasObject,
  type ProjectDocument,
} from '../domain/projectDocument'
import type { ValidationIssue } from '../validation/validateStraightRoad'
import { ValidationPanel } from './ValidationPanel'

type RightInspectorProps = {
  document: ProjectDocument
  issues: ValidationIssue[]
  onDocumentChange: (document: ProjectDocument) => void
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

function markingLabel(object: CanvasObject) {
  const source = object.source === 'manual' ? 'Manual' : 'Generated'
  const label = object.id
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())

  return `${source}: ${label}`
}

export function RightInspector({
  document,
  issues,
  onDocumentChange,
}: RightInspectorProps) {
  const parameters = document.parametricRoad
  const viewOptions = document.viewOptions
  const markingObjects = document.canvasObjects.filter((object) => object.layer === 'marking')
  const orderedMarkingObjects = [...markingObjects].sort(
    (left, right) => right.zIndex - left.zIndex,
  )
  const selectedObject =
    markingObjects.find((object) => object.id === document.selectedObjectId) ?? null

  const updateRoad = <Key extends keyof StraightRoadParameters>(
    key: Key,
    value: StraightRoadParameters[Key],
  ) => onDocumentChange(updateParametricRoad(document, { [key]: value }))
  const updateViewOption = <Key extends keyof DrawingViewOptions>(
    key: Key,
    value: DrawingViewOptions[Key],
  ) => onDocumentChange({ ...document, viewOptions: { ...viewOptions, [key]: value } })
  const updateObject = (id: string, values: Partial<CanvasObject>) => {
    onDocumentChange(updateCanvasObject(document, id, values))
  }
  const updateUTurn = <Key extends keyof StraightRoadParameters['uTurn']>(
    key: Key,
    value: StraightRoadParameters['uTurn'][Key],
  ) =>
    onDocumentChange(
      syncGeneratedCanvasObjects({
        ...document,
        parametricRoad: {
          ...parameters,
          uTurn: { ...parameters.uTurn, [key]: value },
        },
      }),
    )
  const updateUTurnPocket = <Key extends keyof StraightRoadParameters['uTurn']['pocket']>(
    key: Key,
    value: StraightRoadParameters['uTurn']['pocket'][Key],
  ) =>
    onDocumentChange(
      syncGeneratedCanvasObjects({
        ...document,
        parametricRoad: {
          ...parameters,
          uTurn: {
            ...parameters.uTurn,
            pocket: { ...parameters.uTurn.pocket, [key]: value },
          },
        },
      }),
    )

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
            onChange={(value) => updateRoad('eastboundLaneCount', value)}
          />
          <NumberField
            label="Westbound lanes"
            value={parameters.westboundLaneCount}
            min={0}
            max={phase1DrawingSettings.maxLaneCountPerDirection}
            onChange={(value) => updateRoad('westboundLaneCount', value)}
          />
          <NumberField
            label="Lane width (m)"
            value={parameters.laneWidthMeters}
            step={0.1}
            min={phase1NumericLimits.laneWidthMeters.min}
            max={phase1NumericLimits.laneWidthMeters.max}
            onChange={(value) => updateRoad('laneWidthMeters', value)}
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
            onChange={(value) => updateRoad('shoulderWidthMeters', value)}
          />
          <label className="inspector-field">
            <span>Median type</span>
            <select
              value={parameters.medianType}
              onChange={(event) => updateRoad('medianType', event.target.value as MedianType)}
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
            onChange={(value) => updateRoad('medianWidthMeters', value)}
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
              onChange={(event) => updateRoad('showLaneArrows', event.target.checked)}
            />
          </label>
          <label className="inspector-field">
            <span>Selected marking</span>
            <select
              value={selectedObject?.id ?? ''}
              disabled={markingObjects.length === 0}
              onChange={(event) =>
                onDocumentChange(selectCanvasObject(document, event.target.value || null))
              }
            >
              <option value="">No object selected</option>
              {markingObjects.map((object) => (
                <option key={object.id} value={object.id}>
                  {markingLabel(object)}
                </option>
              ))}
            </select>
          </label>
          {selectedObject && (
            <div className="inspector-subgroup">
              <h4>Object controls</h4>
              <div className="object-actions">
                <button
                  type="button"
                  onClick={() => updateObject(selectedObject.id, { locked: !selectedObject.locked })}
                >
                  {selectedObject.locked ? 'Unlock' : 'Lock'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateObject(selectedObject.id, { visible: !selectedObject.visible })
                  }
                >
                  {selectedObject.visible ? 'Hide' : 'Show'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDocumentChange(moveSelectedCanvasObjectZ(document, 'forward'))
                  }
                >
                  Forward
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDocumentChange(moveSelectedCanvasObjectZ(document, 'backward'))
                  }
                >
                  Backward
                </button>
                <button
                  type="button"
                  disabled={selectedObject.source !== 'manual'}
                  onClick={() => onDocumentChange(duplicateSelectedManualObject(document))}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => onDocumentChange(deleteSelectedCanvasObject(document))}
                >
                  Delete
                </button>
              </div>
              <h4>Marking position</h4>
              <div className="inspector-row">
                <span>Source</span>
                <strong>{selectedObject.source}</strong>
              </div>
              <div className="inspector-row">
                <span>Source status</span>
                <strong>{selectedObject.sourceStatus}</strong>
              </div>
              <label className="inspector-field checkbox-field">
                <span>Visible</span>
                <input
                  type="checkbox"
                  checked={selectedObject.visible}
                  onChange={(event) =>
                    updateObject(selectedObject.id, { visible: event.target.checked })
                  }
                />
              </label>
              <label className="inspector-field checkbox-field">
                <span>Locked</span>
                <input
                  type="checkbox"
                  checked={selectedObject.locked}
                  onChange={(event) =>
                    updateObject(selectedObject.id, { locked: event.target.checked })
                  }
                />
              </label>
              <NumberField
                label="Nudge X (m)"
                value={selectedObject.x}
                step={0.25}
                disabled={selectedObject.locked}
                onChange={(value) => updateObject(selectedObject.id, { x: value })}
              />
              <NumberField
                label="Nudge Y (m)"
                value={selectedObject.y}
                step={0.25}
                disabled={selectedObject.locked}
                onChange={(value) => updateObject(selectedObject.id, { y: value })}
              />
              <NumberField
                label="Rotation (deg)"
                value={selectedObject.rotationDeg}
                step={5}
                disabled={selectedObject.locked}
                onChange={(value) => updateObject(selectedObject.id, { rotationDeg: value })}
              />
              <NumberField
                label="Scale"
                value={selectedObject.scale}
                step={0.1}
                min={0.4}
                max={2}
                disabled={selectedObject.locked}
                onChange={(value) => updateObject(selectedObject.id, { scale: value })}
              />
              <NumberField
                label="Z index"
                value={selectedObject.zIndex}
                step={1}
                disabled={selectedObject.locked}
                onChange={(value) => updateObject(selectedObject.id, { zIndex: value })}
              />
            </div>
          )}
          <div className="inspector-subgroup">
            <h4>Object list</h4>
            <div className="object-list">
              {orderedMarkingObjects.map((object) => (
                <button
                  key={object.id}
                  type="button"
                  className={`object-list-item${
                    object.id === document.selectedObjectId ? ' is-selected' : ''
                  }`}
                  onClick={() => onDocumentChange(selectCanvasObject(document, object.id))}
                >
                  <span>{markingLabel(object)}</span>
                  <small>
                    z{object.zIndex} {object.visible ? 'visible' : 'hidden'}{' '}
                    {object.locked ? 'locked' : 'editable'}
                  </small>
                </button>
              ))}
            </div>
          </div>
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
