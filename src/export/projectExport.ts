export function buildStandaloneSvgText(svgMarkup: string, cssText = '') {
  const openingTag = svgMarkup.match(/^<svg\b[^>]*>/)?.[0] ?? '<svg>'
  let output = svgMarkup

  if (!openingTag.includes('xmlns=')) {
    output = output.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
  if (!openingTag.includes('width=')) output = output.replace('<svg', '<svg width="1000"')
  if (!openingTag.includes('height=')) output = output.replace('<svg', '<svg height="600"')
  if (cssText.trim()) {
    output = output.replace(/(<svg\b[^>]*>)/, `$1<style>${cssText}</style>`)
  }

  return output.endsWith('\n') ? output : `${output}\n`
}

function collectPageCss() {
  return Array.from(window.document.styleSheets)
    .flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((rule) => rule.cssText)
      } catch {
        return []
      }
    })
    .join('\n')
}

export function serializeSvgElement(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement

  clone.querySelectorAll('.selection-ring').forEach((node) => node.remove())
  clone.querySelectorAll('.is-selected').forEach((node) => node.classList.remove('is-selected'))

  return buildStandaloneSvgText(clone.outerHTML, collectPageCss())
}

export function downloadTextFile(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = window.document.createElement('a')

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
