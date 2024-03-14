// import { useTranslation } from "react-i18next"
// import { Card, Page } from "components/layout"
import { useMemo, useState, useEffect } from "react"
import { Select, Option } from "bymax-react-select"
import axios from "axios"
// import styles from "./ChangeNow.module.scss"

const ChangeNow = () => {
  // const { t } = useTranslation()

  var optionsFrom: Option[] = useMemo(
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

  var optionsTo: Option[] = useMemo(
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
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [valueFrom, setValueFrom] = useState<Option | Option[] | null>(
    optionsFrom[0]
  )
  const [valueTo, setValueTo] = useState<Option | Option[] | null>(optionsTo[0])

  useEffect(() => {
    const fetchDataFrom = async () => {
      setLoading(true)
      try {
        const { data: response } = await axios.get(
          "http://localhost:5737/exchangeapi/changenow/currencies"
        )
        setData(response.result)
        console.log(response.result)
        for (var i = 0; response.result.length; i++) {
          optionsFrom.push({
            id: i + 1 + "",
            value: response.result[i].ticker,
            label: response.result[i].name,
            image: response.result[i].image,
          })
        }
      } catch (error) {
        console.error(error.message)
      }
      setLoading(false)
    }

    fetchDataFrom()
  }, [optionsFrom])

  return (
    <div style={{ width: "300px" }}>
      <Select
        id="exchange-from-currency"
        value={valueFrom}
        isMulti={false}
        isClearable={true}
        options={optionsFrom}
        placeholder="Select a coin"
        noOptionsMessage="No coins found"
        onChange={(selectedOption) => setValueFrom(selectedOption)}
      />
      <Select
        id="exchange-to-currency"
        value={valueTo}
        isMulti={false}
        isClearable={true}
        options={optionsTo}
        placeholder="Select a coin"
        noOptionsMessage="No coins found"
        onChange={(selectedOption) => setValueTo(selectedOption)}
      />
    </div>
  )
}

export default ChangeNow
