import { Trans, t } from "@lingui/macro";

import ExchangeInfoRow from "components/Exchange/ExchangeInfoRow";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import Tooltip from "components/Tooltip/Tooltip";
import { TokenData, TokensRatio, convertToTokenAmount, getTokensRatioByPrice } from "domain/synthetics/tokens";

import { formatUsdPrice, calculateDisplayDecimals } from "lib/numbers";
import { USD_DECIMALS } from "config/factors";
import { formatAmount, formatTokenAmount, formatUsd } from "lib/numbers";
import { useMemo } from "react";

export type Props = {
  maxLiquidityUsd?: bigint;
  fromToken?: TokenData;
  toToken?: TokenData;
  markRatio?: TokensRatio;
};

export function SwapCard(p: Props) {
  const { fromToken, toToken, maxLiquidityUsd } = p;

  const maxLiquidityAmount = convertToTokenAmount(maxLiquidityUsd, toToken?.decimals, toToken?.prices?.maxPrice);

  const ratioStr = useMemo(() => {
    if (!fromToken || !toToken) return "...";

    const markRatio = getTokensRatioByPrice({
      fromToken,
      toToken,
      fromPrice: fromToken.prices.minPrice,
      toPrice: toToken.prices.maxPrice,
    });

    const smallest = markRatio.smallestToken;
    const largest = markRatio.largestToken;

    const ratioDecimals = calculateDisplayDecimals(markRatio.ratio);

    return `${formatAmount(markRatio.ratio, USD_DECIMALS, ratioDecimals)} ${smallest.symbol} / ${largest.symbol}`;
  }, [fromToken, toToken]);

  const maxOutValue = useMemo(
    () => [
      formatTokenAmount(maxLiquidityAmount, toToken?.decimals, toToken?.symbol, {
        useCommas: true,
        displayDecimals: 0,
      }),
      `(${formatUsd(maxLiquidityUsd, { displayDecimals: 0 })})`,
    ],
    [maxLiquidityAmount, maxLiquidityUsd, toToken?.decimals, toToken?.symbol]
  );

  return (
    <div className="Exchange-swap-market-box App-box App-box-border">
      <div className="App-card-title">
        <Trans>Swap</Trans>
      </div>
      <div className="App-card-divider" />

      <div>
        <ExchangeInfoRow
          label={t`${fromToken?.symbol} Price`}
          value={formatUsdPrice(fromToken?.prices?.minPrice) || "..."}
        />

        <ExchangeInfoRow
          label={t`${toToken?.symbol} Price`}
          value={formatUsdPrice(toToken?.prices?.maxPrice) || "..."}
        />

        <ExchangeInfoRow
          label={t`Available Liquidity`}
          value={
            <Tooltip
              handle={formatUsd(maxLiquidityUsd) || "..."}
              position="bottom-end"
              renderContent={() => (
                <div>
                  <StatsTooltipRow
                    textClassName="al-swap"
                    label={t`Max ${toToken?.symbol} out`}
                    value={maxOutValue}
                    showDollar={false}
                  />
                </div>
              )}
            />
          }
        />

        <ExchangeInfoRow label={t`Price`} value={ratioStr} />
      </div>
    </div>
  );
}
