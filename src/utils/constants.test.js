import { describe, it, expect } from 'vitest'
import { getPlatformById, getPlatformIds, PLATFORMS } from './constants.js'

describe('constants', () => {
  it('getPlatformById returns the matching platform', () => {
    expect(getPlatformById('PC')).toEqual({ id: 'PC', name: 'PC', icon: 'pc' })
  })

  it('getPlatformById returns undefined for an unknown id', () => {
    expect(getPlatformById('nope')).toBeUndefined()
  })

  it('getPlatformIds returns every platform id in order', () => {
    expect(getPlatformIds()).toEqual(['PC', 'X1', 'PS4', 'SWITCH'])
  })

  it('PLATFORMS has exactly 4 entries', () => {
    expect(PLATFORMS).toHaveLength(4)
  })
})
