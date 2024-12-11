import { ChainId } from '@pancakeswap/chains'
import { languageList, useTranslation } from '@pancakeswap/localization'
import { footerLinks } from '@pancakeswap/uikit'
import Footer from '@pancakeswap/uikit/components/Footer'
import { useCakePrice } from 'hooks/useCakePrice'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const FooterPage = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { data: cakePrice } = useCakePrice()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <Footer
      chainId={ChainId.BSC}
      items={getFooterLinks}
      isDark={isDark}
      toggleTheme={toggleTheme}
      langs={languageList}
      setLang={setLanguage}
      currentLang={currentLanguage.code}
      cakePriceUsd={cakePrice ? Number(cakePrice) : undefined}
      buyCakeLabel={t('Buy wXRP')}
      buyCakeLink="https://pancakeswap.finance/swap?outputCurrency=0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a&chainId=56"
    />
  )
}

export default FooterPage
