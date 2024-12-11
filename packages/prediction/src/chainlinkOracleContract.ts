import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { SupportedChainId } from './constants/supportedChains'
import { ContractAddresses } from './type'

export const chainlinkOracleBNB: Record<string, Address> = {
  [ChainId.BSC]: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const chainlinkOracleCAKE: Record<string, Address> = {
  [ChainId.BSC]: '0x93A67D414896A280bF8FFB3b389fE3686E014fda',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const chainlinkOracleETH: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const chainlinkOracleWBTC: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>
