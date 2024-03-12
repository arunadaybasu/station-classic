import { useTranslation } from "react-i18next"
import { Card, Page } from "components/layout"

const ChangeNow = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Exchange")} small>
      <Card>
        <p>
          Coming Soon - Exchange APIs enable swap between non-related currencies
          such as $LUNC & $BTC using an exchange rather than a blockchain
          contract.
        </p>
      </Card>
    </Page>
  )
}

export default ChangeNow
