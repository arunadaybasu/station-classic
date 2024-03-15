// import { useTranslation } from "react-i18next"
// import { Card, Page } from "components/layout"
import { useMemo, useState, useEffect } from "react"
import { Select, Option } from "bymax-react-select"
import axios from "axios"
// import styles from "./ChangeNow.module.scss"

const ChangeNow = () => {
  // const { t } = useTranslation()
  var optionsFrom: Option[] = useMemo(() => [], [])
  var optionsTo: Option[] = useMemo(() => [], [])

  const baseUrlMiddleware = "http://localhost:5737/"
  const [loading, setLoading] = useState(true)
  const [valueFrom, setValueFrom] = useState<Option | Option[] | null>(
    optionsFrom[0]
  )
  const [valueTo, setValueTo] = useState<Option | Option[] | null>(optionsTo[0])

  useEffect(() => {
    const fetchDataFrom = async () => {
      setLoading(true)
      try {
        const { data: response } = await axios.get(
          baseUrlMiddleware + "exchangeapi/changenow/currencies"
        )
        console.log(response.result.length)
        for (var i = 0; response.result.length; i++) {
          optionsFrom.push({
            id: i + 1 + "",
            value: response.result[i].ticker,
            label: response.result[i].name,
            image: response.result[i].image,
            base: response.result[i].ticker,
          })
        }
      } catch (error) {
        console.error(error.message)
      }
      setLoading(false)
    }

    fetchDataFrom()
  }, [optionsFrom])

  // useEffect(() => {
  //   const fetchDataTo = async () => {
  //     setLoading(true)
  //     try {
  //       const { data: response } = await axios.get(
  //         baseUrlMiddleware + "exchangeapi/changenow/pairs-for?ticker=btc"
  //       )
  //       console.log(response.result)
  //       for (var i = 0; response.result.length; i++) {
  //         if (response.result[i].ticker === response.result[i].network) {
  //           optionsTo.push({
  //             id: i + 1 + "",
  //             value: response.result[i].ticker,
  //             label: response.result[i].name,
  //             image: response.result[i].image,
  //             base: response.result[i].ticker,
  //           })
  //         }
  //         else {
  //           optionsTo.push({
  //             id: i + 1 + "",
  //             value: response.result[i].ticker,
  //             label: response.result[i].name,
  //             image: response.result[i].image,
  //             base: response.result[i].ticker,
  //             quote: response.result[i].network,
  //           })
  //         }

  //       }
  //     } catch (error) {
  //       console.error(error.message)
  //     }
  //     setLoading(false)
  //   }

  //   fetchDataTo()
  // }, [optionsTo])

  return (
    <div style={{ width: "300px" }}>
      <p>{loading ? "Loading..." : ""}</p>
      <Select
        id="exchange-from-currency"
        value={valueFrom}
        isMulti={false}
        isClearable={true}
        options={optionsFrom}
        placeholder="Select a coin"
        noOptionsMessage="No coins found"
        onChange={(selectedOption) => {
          setValueFrom(selectedOption)
          console.log(selectedOption, valueFrom)
          const fetchDataTo = async (selectedOption: any) => {
            setLoading(true)
            try {
              if (selectedOption === undefined) return
              const { data: response } = await axios.get(
                baseUrlMiddleware +
                  "exchangeapi/changenow/pairs-for?ticker=" +
                  selectedOption.value
              )
              console.log(response.result.length)
              for (var i = 0; response.result.length; i++) {
                if (response.result[i].ticker === response.result[i].network) {
                  optionsTo.push({
                    id: i + 1 + "",
                    value: response.result[i].ticker,
                    label: response.result[i].name,
                    image: response.result[i].image,
                    base: response.result[i].ticker,
                  })
                } else {
                  optionsTo.push({
                    id: i + 1 + "",
                    value: response.result[i].ticker,
                    label: response.result[i].name,
                    image: response.result[i].image,
                    base: response.result[i].ticker,
                    quote: response.result[i].network,
                  })
                }
              }
            } catch (error) {
              console.error(error.message)
            }
            setLoading(false)
          }
          fetchDataTo(selectedOption)
        }}
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
