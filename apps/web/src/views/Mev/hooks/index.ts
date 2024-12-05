import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { WalletClient } from 'viem'
import { bsc } from 'viem/chains'

import { useWalletClient } from 'wagmi'

async function checkWalletSupportAddEthereumChain(walletClient: WalletClient) {
  try {
    await walletClient.request({
      method: 'wallet_addEthereumChain',
      // @ts-ignore
      params: [
        // mock data without key params nativeCurrency
        {
          chainId: '0x38', // Chain ID in hexadecimal (56 for Binance Smart Chain)
          chainName: 'PancakeSwap MEV Guard',
          rpcUrls: ['https://bscrpc.pancakeswap.finance'], // PancakeSwap MEV RPC}
        },
      ],
    })

    console.error('lack of parameter, should be error')
    return false
  } catch (error) {
    if ((error as any)?.code === -32602) {
      console.info("the mock test passed, there's some parameter issue as expected", error)
      return true
    }
    if ((error as any)?.code === -32601) {
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
      const networkParams = {
        chainId: '0x38', // Chain ID in hexadecimal (56 for Binance Smart Chain)
        chainName: 'PancakeSwap MEV Guard',
        rpcUrls: ['https://bscrpc.pancakeswap.finance'], // PancakeSwap MEV RPC
        nativeCurrency: bsc.nativeCurrency,
        blockExplorerUrls: [bsc.blockExplorers.default.url],
      }

      // Check if the Ethereum provider is available
      if (walletClient) {
        try {
          // Prompt the wallet to add the custom network
          await walletClient.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          })
          console.info('RPC network added successfully!')
          onSuccess?.()
        } catch (error) {
          console.error('Error adding RPC network:', error)
        }
      } else {
        console.warn('Ethereum provider not found. Please check your wallet')
      }
    } catch (error) {
      if ((error as any).code === -32601) console.error('wallet_addEthereumChain is not supported')
      else console.error(error)
    } finally {
      onFinish?.()
    }
  }, [onBeforeStart, onSuccess, onFinish, walletClient])
  return { addMevRpc }
}
