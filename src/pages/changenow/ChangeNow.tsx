import { useTranslation } from "react-i18next"
import { Page } from "components/layout"

const ChangeNow = () => {
  const { t } = useTranslation()

  const iframeStyle1 = {
    height: "356px",
    width: "100%",
    border: "none",
  }

  const iframeSrc1 =
    "https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=true&amount=1000000&amountFiat=100&backgroundColor=FFFFFF&darkMode=false&from=lunc&fromFiat=usd&horizontal=false&isFiat&lang=en-US&link_id=46acbfb97c0adb&locales=true&logo=true&primaryColor=00C26F&to=btc&toFiat=lunc&toTheMoon=true"
  const iframeSrc2 =
    "https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js"

  return (
    <Page title={t("Exchange")} small>
      <iframe
        title="iframe-changenow-widget"
        id="iframe-changenow-widget"
        src={iframeSrc1}
        style={iframeStyle1}
      ></iframe>
      <script defer type="text/javascript" src={iframeSrc2}></script>
    </Page>
  )
}

export default ChangeNow
