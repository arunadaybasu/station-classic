import { useTranslation } from "react-i18next"
import { Card, Page } from "components/layout"

const ChangeNow = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Exchange")} small>
      <Card>
        <p>
          Coming Soon - Exchange APIs enable swaps between non-related
          currencies such as $LUNC & $BTC (which are not on the same blockchain)
          using an exchange rather than a blockchain contract as the broker.
        </p>
      </Card>
    </Page>
  )
}

export default ChangeNow
