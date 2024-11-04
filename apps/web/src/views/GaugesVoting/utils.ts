import { Gauge, GaugeType } from '@pancakeswap/gauges'
import { PCSDuoTokenVaultConfig, fetchPositionManager } from '@pancakeswap/position-managers'
import { Address, encodePacked, keccak256, zeroAddress } from 'viem'

export const getGaugeHash = (gaugeAddress: Address = zeroAddress, chainId: number = 0) => {
  return keccak256(encodePacked(['address', 'uint256'], [gaugeAddress, BigInt(chainId || 0)]))
}

export const getPositionManagerName = async (gauge: Gauge): Promise<string> => {
  if (gauge.type !== GaugeType.ALM) return ''

  const vaults: PCSDuoTokenVaultConfig[] = await fetchPositionManager(gauge.chainId)
  const matchedVault = vaults.find((v) => v.vaultAddress === gauge.address)

  if (!matchedVault) return gauge.managerName ?? ''

  return `${matchedVault?.name}#${matchedVault?.idByManager}`
}
