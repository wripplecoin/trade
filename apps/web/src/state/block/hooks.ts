import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlockNumber as useWagmiBlockNumber, useBlock as useWagmiBlock } from 'wagmi'
import {
  useWatchBlock,
  useBlockNumber,
  useBlockTimestamp,
  useInitialBlockNumber,
  useInitialBlockTimestamp as useInitBlockTimestamp,
  getInitialBlockTimestampQueryKey,
} from '@pancakeswap/wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback } from 'react'

export const usePollBlockNumber = () => {
  const { chainId } = useActiveChainId()

  useWatchBlock({
    chainId,
    enabled: true,
  })

  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: true,
  })

  useQuery({
    queryKey: [FAST_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId),
    refetchInterval: FAST_INTERVAL,
  })

  useQuery({
    queryKey: [SLOW_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId),
    refetchInterval: SLOW_INTERVAL,
  })
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: currentBlock = 0 } = useBlockNumber({
    chainId,
    watch: true,
  })
  return Number(currentBlock)
}

export function useCurrentBlockTimestamp(chainId?: number) {
  const { chainId: activeChainId } = useActiveChainId()
  const isTargetDifferent = Boolean(chainId && activeChainId !== chainId)
  useWatchBlock({ chainId, enabled: isTargetDifferent })
  const { data: timestamp } = useBlockTimestamp({
    chainId: chainId ?? activeChainId,
  })
  return timestamp
}

export const useChainCurrentBlock = (chainId?: number) => {
  const { chainId: activeChainId } = useActiveChainId()
  const activeChainBlockNumber = useCurrentBlock()
  const isTargetDifferent = Boolean(chainId && activeChainId !== chainId)
  const { data: targetChainBlockNumber } = useWagmiBlockNumber({
    chainId,
    watch: true,
    query: {
      enabled: isTargetDifferent,
      select: useCallback((data: bigint) => (data !== undefined ? Number(data) : undefined), []),
    },
  })

  return isTargetDifferent ? targetChainBlockNumber : activeChainBlockNumber
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlock = 0 } = useInitialBlockNumber({
    chainId,
  })
  return Number(initialBlock)
}

export const useInitialBlockTimestamp = (chainId?: number): number => {
  const { chainId: activeChainId } = useActiveChainId()
  const isTargetDifferent = Boolean(chainId && activeChainId !== chainId)
  const queryClient = useQueryClient()
  const { data: initialBlockTimestamp = 0 } = useInitBlockTimestamp({
    chainId: chainId ?? activeChainId,
  })
  useWagmiBlock({
    chainId,
    query: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      enabled: !initialBlockTimestamp && isTargetDifferent,
      select: useCallback(
        (block) => {
          queryClient.setQueryData(
            getInitialBlockTimestampQueryKey(chainId),
            block !== undefined ? Number(block.timestamp) : undefined,
          )
        },
        [chainId, queryClient],
      ),
    },
  })
  return initialBlockTimestamp
}
