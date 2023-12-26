import Color from 'colorjs.io'
import { describe, expect, it } from 'vitest'

describe('color contrasts on light mode', () => {
  const fgPrimary = new Color("#212121")
  const fgSecondary = new Color("#757575")
  const colors = [
    new Color('rgba(255, 59, 48, 50%)'),
    new Color('rgba(255, 204, 0, 50%)'),
    new Color('rgba(40, 205, 65, 50%)'),
    // new Color('rgba(0, 122, 255, 50%)'),
    new Color('rgba(85, 190, 240, 50%)'),
    // new Color('rgba(175, 82, 222, 50%)'),
  ]
  const th = 4.5

  it('primary', () => {
    const colorBg = new Color("#ffffff")
    const contrast = fgPrimary.contrastWCAG21(colorBg)
    expect(contrast).toBeGreaterThan(th)
  })

  it('secondary', () => {
    const colorBg = new Color("#ffffff")
    const contrast = fgSecondary.contrastWCAG21(colorBg)
    expect(contrast).toBeGreaterThan(th)
  })

  it('background colors', () => {
    colors.forEach((c) => {
      const contrast = fgPrimary.contrastWCAG21(c)
      expect(contrast).toBeGreaterThan(th)
    })
  })
})

describe('color contrast on dark mode', () => {
  const fgPrimary = new Color("#fafafa")
  const fgSecondary = new Color("#eeeeee")
  const colors = [
    new Color('rgba(255, 69, 58, 50%)'),
    // new Color('rgba(255, 214, 10, 50%)'),
    // new Color('rgba(50, 215, 75, 50%)'),
    new Color('rgba(10, 132, 255, 50%)'),
    // new Color('rgba(90, 200, 245, 50%)'),
    new Color('rgba(191, 90, 242, 50%)'),
  ]
  const th = 3

  it('primary', () => {
    const colorBg = new Color("#424242")
    const contrast = fgPrimary.contrastWCAG21(colorBg)
    expect(contrast).toBeGreaterThan(th)
  })

  it('secondary', () => {
    const colorBg = new Color("#424242")
    const contrast = fgSecondary.contrastWCAG21(colorBg)
    expect(contrast).toBeGreaterThan(th)
  })

  it('background colors', () => {
    colors.forEach((c) => {
      const contrast = fgPrimary.contrastWCAG21(c)
      expect(contrast).toBeGreaterThan(th)
    })
  })
})
