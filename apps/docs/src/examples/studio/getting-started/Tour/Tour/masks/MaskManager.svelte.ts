import { tweened } from 'svelte/motion'
import type { Mask } from './Mask'

export class MaskManager {
  public tourStopMask: Mask | undefined

  public wrapperRef: HTMLElement | undefined

  public svg = $state<SVGSVGElement | undefined>()

  public maskRect = $state<SVGRectElement | undefined>()

  public highlightRect = $state<SVGRectElement | undefined>()

  public darkenerRect = $state<SVGRectElement | undefined>()

  private updateMaskHandler: number | undefined

  private _globalOpacity = tweened(0, {
    duration: 400
  })
  private opacity = $state(0)

  private _darkenerOpacity = tweened(0, {
    duration: 400
  })
  private darkenerOpacity = $state(0)

  constructor() {
    this.updateMask = this.updateMask.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)

    this._globalOpacity.subscribe((value) => {
      this.opacity = value
    })
    this._darkenerOpacity.subscribe((value) => {
      this.darkenerOpacity = value
    })

    $effect(() => {
      if (!this.svg) return
      this.svg.style.opacity = this.opacity.toString()
    })

    $effect(() => {
      if (!this.darkenerRect) return
      this.darkenerRect.style.opacity = this.darkenerOpacity.toString()
    })
  }

  setMask(tourStopMask: Mask) {
    this.tourStopMask = tourStopMask
    this.tourStopMask.initialize?.()
    this.updateMaskHandler = requestAnimationFrame(this.updateMask)
    this._globalOpacity.set(1)
    if (tourStopMask.darkenBackground) {
      this._darkenerOpacity.set(1)
    } else {
      this._darkenerOpacity.set(0)
    }
  }

  clearMask() {
    if (this.updateMaskHandler) cancelAnimationFrame(this.updateMaskHandler)
    this.tourStopMask = undefined
    this._globalOpacity.set(0)
  }

  updateMask() {
    if (!this.maskRect || !this.highlightRect || !this.tourStopMask) return

    const mask = this.tourStopMask
    mask.update?.()

    if (mask.spotlight) {
      const sp = mask.spotlight
      // show spotlight
      this.maskRect.style.display = 'unset'
      this.highlightRect.style.display = 'unset'

      if (sp.shape === 'circle') {
        this.maskRect.setAttribute('rx', '9999px')
        this.maskRect.setAttribute('ry', '9999px')
        this.highlightRect.setAttribute('rx', '9999px')
        this.highlightRect.setAttribute('ry', '9999px')

        const radius = (Math.max(sp.width, sp.height) / 2) * Math.sqrt(2) + sp.padding
        const diameter = radius * 2

        this.maskRect.setAttribute('width', `${radius * 2}px`)
        this.maskRect.setAttribute('height', `${radius * 2}px`)
        this.maskRect.setAttribute('x', `${sp.left - (diameter - sp.width) / 2}px`)
        this.maskRect.setAttribute('y', `${sp.top - (diameter - sp.height) / 2}px`)

        this.highlightRect.setAttribute('width', `${radius * 2}px`)
        this.highlightRect.setAttribute('height', `${radius * 2}px`)
        this.highlightRect.setAttribute('x', `${sp.left - (diameter - sp.width) / 2}px`)
        this.highlightRect.setAttribute('y', `${sp.top - (diameter - sp.height) / 2}px`)
      } else if (sp.shape === 'rectangle') {
        this.maskRect.setAttribute('rx', '8px')
        this.maskRect.setAttribute('ry', '8px')
        this.highlightRect.setAttribute('rx', '8px')
        this.highlightRect.setAttribute('ry', '8px')

        this.maskRect.setAttribute('width', `${sp.width + sp.padding * 2}px`)
        this.maskRect.setAttribute('height', `${sp.height + sp.padding * 2}px`)
        this.maskRect.setAttribute('x', `${sp.left - sp.padding}px`)
        this.maskRect.setAttribute('y', `${sp.top - sp.padding}px`)

        this.highlightRect.setAttribute('width', `${sp.width + sp.padding * 2}px`)
        this.highlightRect.setAttribute('height', `${sp.height + sp.padding * 2}px`)
        this.highlightRect.setAttribute('x', `${sp.left - sp.padding}px`)
        this.highlightRect.setAttribute('y', `${sp.top - sp.padding}px`)
      }
    } else {
      // hide spotlight
      this.maskRect.style.display = 'none'
      this.highlightRect.style.display = 'none'
    }

    this.updateMaskHandler = requestAnimationFrame(this.updateMask)
  }

  onPointerMove(event: PointerEvent) {
    if (!this.wrapperRef || !this.tourStopMask) return

    // pointerEvents: "none" lets clicks through the mask
    // pointerEvents: "auto" blocks clicks on the mask

    if (!this.tourStopMask.blockPointer) {
      this.wrapperRef.style.pointerEvents = 'none'
      return
    }

    this.tourStopMask.update?.()

    if (this.tourStopMask.spotlight) {
      const sp = this.tourStopMask.spotlight

      if (
        event.clientX >= sp.left &&
        event.clientX <= sp.left + sp.width &&
        event.clientY >= sp.top &&
        event.clientY <= sp.top + sp.height
      ) {
        this.wrapperRef.style.pointerEvents = 'none'
      } else {
        this.wrapperRef.style.pointerEvents = 'auto'
      }
    } else {
      this.wrapperRef.style.pointerEvents = 'auto'
    }
  }
}
