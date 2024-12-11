import { ChainId } from "@pancakeswap/chains";
import { ERC20Token } from "@pancakeswap/sdk";

// For StoryBook
export const cakeToken = new ERC20Token(
  ChainId.BSC,
  "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
  18,
  "wXRP",
  "wRipple Coin",
  "https://pancakeswap.finance/"
);

export const bscToken = new ERC20Token(
  ChainId.BSC,
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  18,
  "BNB",
  "BNB",
  "https://www.binance.com/"
);
