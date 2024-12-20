import React from "react";
import { styled } from "styled-components";
import { Colors } from "../../theme";
import Skeleton from "../Skeleton/Skeleton";
import Text from "../Text/Text";

export interface Props {
  color?: keyof Colors;
  cakePriceUsd?: number;
  showSkeleton?: boolean;
  chainId: number;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const CakePrice: React.FC<React.PropsWithChildren<Props>> = ({
  cakePriceUsd,
  color = "textSubtle",
  showSkeleton = true,
  chainId,
}) => {
  return cakePriceUsd ? (
    <PriceLink
      href={`https://pancakeswap.finance/swap?outputCurrency=0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a&chainId=${chainId}`}
      target="_blank"
    >
      {/* Thay LogoRound bằng logo wripple */}
      <img
        src="http://wripple.net/static/img/xrp.png"
        alt="Wripple Logo"
        width="30px"
        style={{ marginRight: "8px", verticalAlign: "middle" }}
      />
      <Text color={color} bold>{`$${cakePriceUsd.toFixed(3)}`}</Text>
    </PriceLink>
  ) : showSkeleton ? (
    <Skeleton width={80} height={24} />
  ) : null;
};

export default React.memo(CakePrice);
