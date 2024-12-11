import { Token } from '@pancakeswap/swap-sdk-core'
import { describe, expect, it } from 'vitest'
import tryParseAmount from './tryParseAmount'

describe('utils/tryParseAmount', () => {
  it('should be undefined when no valid input', () => {
    expect(tryParseAmount()).toBeUndefined()
  })
  it('should be undefined when input is 0', () => {
    expect(tryParseAmount('0.00')).toBeUndefined()
  })

  it('should pared value', () => {
    expect(
      tryParseAmount(
        '100',
        new Token(
          56,
          '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
          18,
          'XRP',
          'Ripple Coin',
          'https://pancakeswap.finance/',
        ),
      ),
    ).toBeTruthy()
  })
})
