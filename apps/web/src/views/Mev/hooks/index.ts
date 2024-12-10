import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { MethodNotFoundRpcError, WalletClient } from 'viem'

import { BSCMevGuardChain } from 'utils/mevGuardChains'
import { addChain } from 'viem/actions'
import { Connector, useAccount, useWalletClient } from 'wagmi'

const WalletProviders = [
  'isApexWallet',
  'isAvalanche',
  'isBackpack',
  'isBifrost',
  'isBitKeep',
  'isBitski',
  'isBlockWallet',
  'isBraveWallet',
  'isCoinbaseWallet',
  'isDawn',
  'isEnkrypt',
  'isExodus',
  'isFrame',
  'isFrontier',
  'isGamestop',
  'isHyperPay',
  'isImToken',
  'isKuCoinWallet',
  'isMathWallet',
  // 'isMetaMask',
  'isOkxWallet',
  'isOKExWallet',
  'isOneInchAndroidWallet',
  'isOneInchIOSWallet',
  'isOneKey',
  'isOpera',
  'isPhantom',
  'isPortal',
  'isRabby',
  'isRainbow',
  'isStatus',
  'isTally',
  'isTokenPocket',
  'isTokenary',
  'isTrust',
  'isTrustWallet',
  'isUniswapWallet',
  'isXDEFI',
  'isZerion',
]

async function checkWalletSupportAddEthereumChain(connector: Connector) {
  try {
    if (typeof connector.getProvider !== 'function') return false

    const provider = (await connector.getProvider()) as any

    return provider && provider.isMetaMask && !WalletProviders.some((p: string) => p in provider)
  } catch (error) {
    console.error(error, 'wallet_addEthereumChain is not supported')
    return false
  }
}

async function fetchMEVStatus(walletClient: WalletClient): Promise<{ mevEnabled: boolean }> {
  if (!walletClient || !walletClient?.request) {
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
  const { connector } = useAccount()
  const { data, isLoading } = useQuery({
    queryKey: ['walletSupportsAddEthereumChain', connector?.uid],
    queryFn: () => checkWalletSupportAddEthereumChain(connector!),
    enabled: Boolean(connector),
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
        const result = await addChain(walletClient, { chain: BSCMevGuardChain })
        console.info('RPC network added successfully!', result)
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
