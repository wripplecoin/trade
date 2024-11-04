import { ChainId } from '@pancakeswap/chains'
import { fetchPositionManager, VaultConfig } from '@pancakeswap/position-managers'
import { useQuery } from '@tanstack/react-query'

export const usePositionManager = (chainId: ChainId): VaultConfig[] => {
  const { data } = useQuery({
    queryKey: ['vault-config-by-chain', chainId],
    queryFn: async () => {
      try {
        const result = await fetchPositionManager(chainId)
        return result
      } catch {
        return []
      }
    },
    enabled: Boolean(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return data ?? []
}
