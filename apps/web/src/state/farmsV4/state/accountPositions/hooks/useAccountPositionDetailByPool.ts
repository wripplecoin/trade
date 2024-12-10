import { Protocol } from '@pancakeswap/farms'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useStableSwapPairsByChainId } from 'state/farmsV4/state/accountPositions/hooks'
import { isAddressEqual } from 'utils'
import { Address } from 'viem'
import { PoolInfo } from '../../type'
import { getAccountV2LpDetails, getStablePairDetails } from '../fetcher'
import { getAccountV3Positions } from '../fetcher/v3'
import { PositionDetail, StableLPDetail, V2LPDetail } from '../type'
import { useLatestTxReceipt } from './useLatestTxReceipt'

type PoolPositionDetail = {
  [Protocol.STABLE]: StableLPDetail
  [Protocol.V2]: V2LPDetail
  [Protocol.V3]: PositionDetail[]
}

export const useAccountPositionDetailByPool = <TProtocol extends keyof PoolPositionDetail>(
  chainId: number,
  account?: Address | null,
  poolInfo?: PoolInfo,
): UseQueryResult<PoolPositionDetail[TProtocol]> => {
  const [currency0, currency1] = useMemo(() => {
    if (!poolInfo) return [undefined, undefined]
    const { token0, token1 } = poolInfo
    return [token0.wrapped, token1.wrapped]
  }, [poolInfo])
  const pairs = useStableSwapPairsByChainId(chainId, poolInfo?.protocol === 'stable')
  const [latestTxReceipt] = useLatestTxReceipt()

  return useQuery({
    queryKey: [
      'accountPosition',
      account,
      chainId,
      poolInfo?.lpAddress,
      poolInfo?.protocol,
      latestTxReceipt?.blockHash,
    ],
    queryFn: async () => {
      if (poolInfo?.protocol === 'v2') {
        return getAccountV2LpDetails(
          chainId,
          account!,
          currency0 && currency1 ? [[currency0.wrapped, currency1.wrapped]] : [],
        )
      }
      if (poolInfo?.protocol === 'stable') {
        const stablePair = pairs.find((pair) => {
          return isAddressEqual(pair.stableSwapAddress, poolInfo?.stableSwapAddress as Address)
        })
        return getStablePairDetails(chainId, account!, stablePair ? [stablePair] : [])
      }
      if (poolInfo?.protocol === 'v3') {
        return getAccountV3Positions(chainId, account!)
      }
      return Promise.resolve([])
    },
    enabled: Boolean(
      account &&
        poolInfo &&
        poolInfo.lpAddress &&
        poolInfo.protocol &&
        (poolInfo.protocol === 'stable' ? pairs.length : true),
    ),
    select: useCallback(
      (data) => {
        if (poolInfo?.protocol === 'v3') {
          // v3
          const d = data.filter((position) => {
            const { token0, token1, fee } = position as PositionDetail
            return (
              poolInfo?.token0.wrapped.address &&
              isAddressEqual(token0, poolInfo?.token0.wrapped.address as Address) &&
              poolInfo?.token1.address &&
              isAddressEqual(token1, poolInfo?.token1.wrapped.address as Address) &&
              fee === poolInfo?.feeTier
            )
          })
          return d as PositionDetail[]
        }

        return data?.[0] && (data[0].nativeBalance.greaterThan('0') || data[0].farmingBalance.greaterThan('0'))
          ? data[0]
          : undefined
      },
      [poolInfo],
    ),
  })
}
