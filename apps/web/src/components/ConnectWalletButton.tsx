import { Button, ButtonProps, FlexGap, WalletFilledV2Icon } from '@pancakeswap/uikit'

import { useCallback, useState } from 'react'
import WalletModalManager from 'components/WalletModalManager'
import Trans from './Trans'

interface ConnectWalletButtonProps extends ButtonProps {
  withIcon?: boolean
}

const ConnectWalletButton = ({ children, withIcon, ...props }: ConnectWalletButtonProps) => {
  const [open, setOpen] = useState(false)
  const handleOnDismiss = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button onClick={() => setOpen(true)} {...props}>
        <FlexGap gap="8px" justifyContent="center" alignItems="center">
          {children || <Trans>Connect Wallet</Trans>} {withIcon && <WalletFilledV2Icon color="invertedContrast" />}
        </FlexGap>
      </Button>
      <style jsx global>{`
        w3m-modal {
          position: relative;
          z-index: 99;
        }
      `}</style>
      <WalletModalManager isOpen={open} onDismiss={handleOnDismiss} />
    </>
  )
}

export default ConnectWalletButton
