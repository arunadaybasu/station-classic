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
      },
    ],
    []
  )
  var optionsTo: Option[] = useMemo(
    () => [
      {
        id: "1",
        value: "lunc",
        label: "Terra Classic",
        image: "https://content-api.changenow.io/uploads/lunc_8d1dd5b681.svg",
        base: "lunc",
      },
    ],
    []
  )

  const baseUrlMiddleware = "http://localhost:5737/"
  const [loading, setLoading] = useState(true)
  const [valueFrom, setValueFrom] = useState<Option | Option[] | null>(
    optionsFrom[0]
  )
  const [valueTo, setValueTo] = useState<Option | Option[] | null>(optionsTo[0])
  const [quantity, setQuantity] = useState("0")
  const [estimate, setEstimate] = useState("0")
  const [quantityMin, setQuantityMin] = useState(0)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (valueFrom && valueTo) {
      console.log(quantity, valueFrom, valueTo)
      try {
        const { data: response } = await axios.get(
          baseUrlMiddleware +
            "exchangeapi/changenow/estimate?from=" +
            (valueFrom as any).value +
            "&to=" +
            (valueTo as any).value +
            "&amount=" +
            quantity
        )
        console.log(response)
        setQuantityMin(response.result_min_amt.minAmount)
        setEstimate(response.result_estimate.estimatedAmount)
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    const fetchDataFrom = async () => {
      setLoading(true)
      try {
        const { data: response } = await axios.get(
          baseUrlMiddleware + "exchangeapi/changenow/currencies"
        )
        // console.log(response.result)
        for (var i = 0; response.result.length; i++) {
          optionsFrom[i] = {
            id: i + 1 + "",
            value: response.result[i].ticker,
            label: response.result[i].name,
            image: response.result[i].image,
            base: response.result[i].ticker,
          }
        }
      } catch (error) {
        console.error(error.message)
      }
      setLoading(false)
    }

    fetchDataFrom()
  }, [optionsFrom])

  const fetchDataTo = async (selectedOption: any) => {
    setLoading(true)
    // console.log(selectedOption.value)
    try {
      const { data: response } = await axios.get(
        baseUrlMiddleware +
          "exchangeapi/changenow/pairs-for?ticker=" +
          selectedOption.value
      )
      // console.log(response.result.length)
      for (var i = 0; response.result.length; i++) {
        if (response.result[i].ticker === response.result[i].network) {
          optionsTo[i] = {
            id: i + 1 + "",
            value: response.result[i].ticker,
            label: response.result[i].name,
            image: response.result[i].image,
            base: response.result[i].ticker,
          }
        } else {
          optionsTo[i] = {
            id: i + 1 + "",
            value: response.result[i].ticker,
            label: response.result[i].name,
            image: response.result[i].image,
            base: response.result[i].ticker,
            quote: response.result[i].network,
          }
        }
      }
    } catch (error) {
      console.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ width: "300px" }}>
      <p>{loading ? "Loading..." : ""}</p>
      <Select
        id="exchange-from-currency"
        value={valueFrom}
        isMulti={false}
        isClearable={false}
        options={optionsFrom}
        placeholder="Select a coin"
        noOptionsMessage="No coins found"
        onChange={(selectedOption) => {
          setValueFrom(selectedOption)
          console.log(selectedOption)
          if (selectedOption) fetchDataTo(selectedOption)
        }}
      />
      <Select
        id="exchange-to-currency"
        value={valueTo}
        isMulti={false}
        isClearable={false}
        options={optionsTo}
        placeholder="Select a coin"
        noOptionsMessage="No coins found"
        onChange={(selectedOption) => setValueTo(selectedOption)}
      />
      <form onSubmit={handleSubmit}>
        <label>
          Enter Amount/Quantity:
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={quantity}
            min={quantityMin}
            step="any"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button type="submit">Estimate</button>
        <p>From: </p>
        <p>{(valueFrom as any).value}</p>
        <p>To: </p>
        <p>{(valueTo as any).value}</p>
        <p>Quantity/Amount: </p>
        <p>{quantity}</p>
        <p>Exchange Estimate: </p>
        <p>
          {estimate} {(valueTo as any).value}
        </p>
      </form>
    </div>
  )
}

export default ChangeNow
