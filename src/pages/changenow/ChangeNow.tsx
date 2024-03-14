import { useTranslation } from "react-i18next"
import { Card, Page } from "components/layout"
import { useMemo, useState } from "react"
import { Select, Option } from "bymax-react-select"
// import styles from "./ChangeNow.module.scss"

const ChangeNow = () => {
  const { t } = useTranslation()

  const options: Option[] = useMemo(
    () => [
      {
        id: "1",
        value: "BTC",
        label: "Bitcoin",
        image: "https://content-api.changenow.io/uploads/btc_1_527dc9ec3c.svg",
        base: "BTC",
        quote: "USDT",
      },
      {
        id: "2",
        value: "eth",
        label: "Ethereum",
        base: "ETH",
      },
      {
        id: "3",
        value: "sol",
        label: "Solana",
      },
    ],
    []
  )

  const [value, setValue] = useState<Option | Option[] | null>(options[0])

  return (
    <div style={{ width: "300px" }}>
      <Select
        id="exchange-from"
        value={value}
        isMulti={false}
        isClearable={true}
        options={options}
        placeholder="Select a coin"
        noOptionsMessage="No coins found"
        onChange={(selectedOption) => setValue(selectedOption)}
      />
    </div>
  )
}

export default ChangeNow
