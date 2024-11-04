import { ChainId } from '@pancakeswap/chains'
import { ERC20Token } from '@pancakeswap/sdk'
import { POSITION_MANAGER_API_V2 } from '../constants/endpoints'
import { VaultConfig } from '../types'

const positionManagerCache: Record<string, VaultConfig[]> = {}

export const fetchPositionManager = async (chainId: ChainId): Promise<VaultConfig[]> => {
  const cacheKey = `${chainId}-all}`

  // Return cached data if it exists
  if (positionManagerCache[cacheKey]) {
    return positionManagerCache[cacheKey]
  }

  try {
    const params = { chainId }
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    const response = await fetch(`${POSITION_MANAGER_API_V2}?${queryString}`, {
      signal: AbortSignal.timeout(3000),
    })
    const result = await response.json()
    const newData: VaultConfig[] = result.map((p: any) => ({
      ...p,
      currencyA: new ERC20Token(
        p.currencyA.chainId,
        p.currencyA.address,
        p.currencyA.decimals,
        p.currencyA.symbol,
        p.currencyA.name,
        p.currencyA.projectLink,
      ),
      currencyB: new ERC20Token(
        p.currencyB.chainId,
        p.currencyB.address,
        p.currencyB.decimals,
        p.currencyB.symbol,
        p.currencyB.name,
        p.currencyB.projectLink,
      ),
      earningToken: new ERC20Token(
        p.earningToken.chainId,
        p.earningToken.address,
        p.earningToken.decimals,
        p.earningToken.symbol,
        p.earningToken.name,
        p.earningToken.projectLink,
      ),
    }))

    // Cache the result before returning it
    positionManagerCache[cacheKey] = newData

    return newData
  } catch (error) {
    return []
  }
}
