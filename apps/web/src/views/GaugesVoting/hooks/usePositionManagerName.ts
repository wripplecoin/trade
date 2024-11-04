import { Gauge } from '@pancakeswap/gauges'
import { useQuery } from '@tanstack/react-query'
import { getPositionManagerName } from 'views/GaugesVoting/utils'

export const usePositionManagerName = (data: Gauge) => {
  const { data: managerName } = useQuery({
    queryKey: ['position-manager-name'],
    queryFn: async () => {
      try {
        const result = await getPositionManagerName(data)
        return result
      } catch {
        return ''
      }
    },
    enabled: Boolean(data),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return {
    managerName: managerName ?? '',
  }
}
