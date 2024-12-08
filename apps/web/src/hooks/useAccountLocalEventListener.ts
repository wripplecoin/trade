import { useAccountEffect } from 'wagmi'
import { useMemo } from 'react'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
import { resetUserState } from '../state/global/actions'
import useActiveWeb3React from './useActiveWeb3React'

export const useAccountLocalEventListener = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useLocalDispatch()

  useAccountEffect(
    useMemo(
      () => ({
        onDisconnect() {
          if (chainId) {
            dispatch(resetUserState({ chainId }))
          }
        },
      }),
      [chainId, dispatch],
    ),
  )
}
