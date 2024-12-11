import { languageList, useTranslation } from '@pancakeswap/localization'
import { Menu as UikitMenu, footerLinks } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { GlobalSettings } from './GlobalSettings'
import { Logo } from './Logo'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const LinkComponent = (linkProps: any) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const Menu = (props: any) => {
  const { chainId } = useActiveChainId()
  const { isDark, setTheme } = useTheme()
  const cakePrice = useCakePrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <UikitMenu
      logoComponent={<Logo />}
      linkComponent={LinkComponent}
      rightSide={
        <>
          <GlobalSettings />
          <NetworkSwitcher />
          <UserMenu />
        </>
      }
      chainId={chainId}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePrice.eq(BIG_ZERO) ? undefined : cakePrice}
      links={menuItems}
      subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={getFooterLinks}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy wXRP')}
      buyCakeLink="https://pancakeswap.finance/swap?outputCurrency=0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a&chainId=56"
      {...props}
    />
  )
}

export default Menu
