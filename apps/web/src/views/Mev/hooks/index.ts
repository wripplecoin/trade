import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { InternalRpcError, InvalidParamsRpcError, MethodNotFoundRpcError, WalletClient } from 'viem'
import { addChain } from 'viem/actions'

import { useWalletClient } from 'wagmi'
import { bsc } from 'viem/chains'
import { BSCMevGuardChain } from 'utils/mevGuardChains'

async function checkWalletSupportAddEthereumChain(walletClient: WalletClient) {
  try {
    if (window?.ethereum?.isSafePal) return false
    await walletClient.request({
      method: 'wallet_addEthereumChain',
      params: [
        // mock data without key params chainId
        // @ts-ignore
        {
          chainName: 'PancakeSwap MEV Guard',
          rpcUrls: ['https://bscrpc.pancakeswap.finance'], // PancakeSwap MEV RPC}
          nativeCurrency: bsc.nativeCurrency,
          blockExplorerUrls: [bsc.blockExplorers.default.url],
        },
      ],
    })

    console.error('lack of parameter, should be error')
    return false
  } catch (error) {
    if (
      [InvalidParamsRpcError.code, InternalRpcError.code].includes((error as any)?.code) &&
      (error as any)?.message?.includes('chainId')
    ) {
      console.info("the mock test passed, there's some parameter issue as expected", error)
      return true
    }
    if ((error as any)?.code === MethodNotFoundRpcError.code) {
      console.error('wallet_addEthereumChain is not supported')
      return false
    }

    console.error(error, 'wallet_addEthereumChain is not supported')
    return false
  }
}

async function fetchMEVStatus(walletClient: WalletClient): Promise<{ mevEnabled: boolean }> {
  if (!walletClient || !walletClient.request) {
    console.error('Ethereum provider not found')
    return { mevEnabled: false }
  }

  try {
    const result = await walletClient.request({
      // @ts-ignore
      method: 'eth_call',
      params: [
        {
          from: walletClient.account?.address ?? '0x',
          to: '0x0000000000000000000000000000000000000048',
          value: '0x30',
          data: '0x',
        },
        'latest',
      ],
    })
    return { mevEnabled: result === '0x30' }
  } catch (error) {
    console.error('Error checking MEV status:', error)
    return { mevEnabled: false }
  }
}

export function useWalletSupportsAddEthereumChain() {
  const { data: walletClient } = useWalletClient()
  const { data, isLoading } = useQuery({
    queryKey: ['walletSupportsAddEthereumChain', walletClient],
    queryFn: () => checkWalletSupportAddEthereumChain(walletClient!),
    enabled: Boolean(walletClient),
    retry: false,
  })
  return { walletSupportsAddEthereumChain: data ?? false, isLoading }
}

export function useIsMEVEnabled() {
  const { data: walletClient } = useWalletClient()
  const { account, chainId } = useActiveWeb3React()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['isMEVEnabled', walletClient, account, chainId],
    queryFn: () => fetchMEVStatus(walletClient!),
    enabled: Boolean(account) && walletClient && chainId === ChainId.BSC,
    staleTime: 60000,
  })

  return { isMEVEnabled: data?.mevEnabled ?? false, isLoading, refetch }
}

export const useShouldShowMEVToggle = () => {
  const { walletSupportsAddEthereumChain, isLoading: isWalletSupportLoading } = useWalletSupportsAddEthereumChain()
  const { account } = useActiveWeb3React()
  const { isMEVEnabled, isLoading } = useIsMEVEnabled()
  return !isMEVEnabled && !isLoading && !isWalletSupportLoading && Boolean(account) && walletSupportsAddEthereumChain
}

export const useAddMevRpc = (onSuccess?: () => void, onBeforeStart?: () => void, onFinish?: () => void) => {
  const { data: walletClient } = useWalletClient()
  const addMevRpc = useCallback(async () => {
    onBeforeStart?.()
    try {
      // Check if the Ethereum provider is available
      if (walletClient) {
        // Prompt the wallet to add the custom network
        await addChain(walletClient, { chain: BSCMevGuardChain })
        console.info('RPC network added successfully!')
        onSuccess?.()
      } else {
        console.warn('Ethereum provider not found. Please check your wallet')
      }
    } catch (error) {
      if ((error as any).code === MethodNotFoundRpcError.code) console.error('wallet_addEthereumChain is not supported')
      else console.error('Error adding RPC network:', error)
    } finally {
      onFinish?.()
    }
  }, [onBeforeStart, onSuccess, onFinish, walletClient])
  return { addMevRpc }
}
