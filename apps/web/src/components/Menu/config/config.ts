import { ContextApi } from '@pancakeswap/localization'
import { SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS } from '@pancakeswap/position-managers'
import { DropdownMenuItems, EarnFillIcon, EarnIcon, MenuItemsType, SwapFillIcon, SwapIcon } from '@pancakeswap/uikit'
import { SUPPORT_FARMS } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & {
  hideSubNav?: boolean
  overrideSubNavItems?: DropdownMenuItems['items']
  matchHrefs?: string[]
}
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & {
  hideSubNav?: boolean
  image?: string
  items?: ConfigMenuDropDownItemsType[]
  overrideSubNavItems?: ConfigMenuDropDownItemsType[]
}

export const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/',
      hideSubNav: true,
      items: [
        {
          label: t('Swap'),
          href: '/',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Earn'),
      href: '/v2/add/BNB/0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      supportChainIds: SUPPORT_FARMS,
      overrideSubNavItems: [
        {
          label: t('Liquidity'),
          href: '/v2/add/BNB/0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a',
          supportChainIds: SUPPORT_FARMS,
        },
        {
          label: t('wXRP Staking'),
          href: 'https://stake.wripple.net',
          supportChainIds: POSITION_MANAGERS_SUPPORTED_CHAINS,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
      items: [
        {
          label: t('Add Liquidity'),
          href: '/v2/add/BNB/0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a',
          supportChainIds: SUPPORT_FARMS,
        },
        {
          label: t('wXRP Staking'),
          href: 'https://stake.wripple.net',
          supportChainIds: POSITION_MANAGERS_SUPPORTED_CHAINS,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
