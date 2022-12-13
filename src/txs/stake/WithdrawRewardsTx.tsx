import { useTranslation } from "react-i18next"
import { combineState } from "data/query"
import { calcRewardsValues, useRewards } from "data/queries/distribution"
import { useDelegations, useValidators } from "data/queries/staking"
import { has } from "utils/num"
import { useCurrency } from "data/settings/Currency"
import { useActiveDenoms, useMemoizedCalcValue } from "data/queries/coingecko"
import { useIBCWhitelist } from "data/Terra/TerraAssets"
import { Page, Card } from "components/layout"
import DelegationsPromote from "app/containers/DelegationsPromote"
import TxContext from "../TxContext"
import WithdrawRewardsForm from "./WithdrawRewardsForm"
import { useChainID } from "data/wallet"

const WithdrawRewardsTx = () => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const chainID = useChainID()
  const calcValue = useMemoizedCalcValue()

  const { data: activeDenoms, ...activeDenomsState } = useActiveDenoms()
  const { data: rewards, ...rewardsState } = useRewards()
  const { data: delegations, ...delegationsState } = useDelegations(chainID)
  const { data: validators, ...validatorsState } = useValidators(chainID)
  const { data: IBCWhitelist, ...IBCWhitelistState } = useIBCWhitelist()

  const state = combineState(
    activeDenomsState,
    rewardsState,
    delegationsState,
    validatorsState,
    IBCWhitelistState
  )

  const render = () => {
    if (!activeDenoms) return null
    if (!(rewards && delegations && validators && IBCWhitelist)) return null
    // @ts-expect-error
    const { total } = calcRewardsValues(rewards, currency.id, calcValue)
    const hasRewards = !!has(total.sum)
    const hasDelegations = !!delegations.length

    if (!hasRewards)
      return hasDelegations ? (
        <Card>{t("No rewards yet")}</Card>
      ) : (
        <DelegationsPromote />
      )

    return (
      <Card>
        <TxContext>
          <WithdrawRewardsForm
            activeDenoms={activeDenoms}
            // @ts-expect-error
            rewards={rewards}
            // @ts-expect-error
            validators={validators}
            IBCWhitelist={IBCWhitelist}
          />
        </TxContext>
      </Card>
    )
  }

  return (
    <Page {...state} title={t("Withdraw rewards")} small>
      {render()}
    </Page>
  )
}

export default WithdrawRewardsTx
