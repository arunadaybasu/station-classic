// import { useTranslation } from "react-i18next"
// import { Card, Page } from "components/layout"
import { useMemo, useState, useEffect } from "react"
import { Select, Option } from "bymax-react-select"
import BarLoader from "react-spinners/BarLoader"
import axios from "axios"
import "./ChangeNow.css"

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
  const [depositAddress, setDepositAddress] = useState("...")
  const [refundAddress, setRefundAddress] = useState("...")
  const [userEmailAddress, setUserEmailAddress] = useState("...")
  const [payinAddress, setPayinAddress] = useState("...")
  const [payoutAddress, setPayoutAddress] = useState("...")
  const [finalQuantity, setFinalQuantity] = useState("0")
  const [payinMemo, setPayinMemo] = useState("...")
  const [txnId, setTxnId] = useState("...")

  const handleEstimate = async (event: any) => {
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

  const handleExchange = async (event: any) => {
    event.preventDefault()
    if (valueFrom && valueTo) {
      // console.log(quantity, valueFrom, valueTo)
      try {
        const { data: response } = await axios.get(
          baseUrlMiddleware +
            "exchangeapi/changenow/create-txn?from=" +
            (valueFrom as any).value +
            "&to=" +
            (valueTo as any).value +
            "&amount=" +
            quantity +
            "&deposit_address=" +
            depositAddress +
            "&refund_address=" +
            refundAddress +
            "&user_email=" +
            userEmailAddress
        )
        console.log(response)
        setPayinAddress(response.result_estimate.payinAddress)
        setPayoutAddress(response.result_estimate.payoutAddress)
        setRefundAddress(response.result_estimate.refundAddress)
        setTxnId(response.result_estimate.id)
        setFinalQuantity(response.result_estimate.amount)
        setPayinMemo(response.result_estimate.payinExtraId)
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
    <div className="x-page-container">
      <div className="x-row-full x-align-center">
        <BarLoader color="#0046a8" loading={loading} width={"100%"} />
        <div className="x-separator-20" />
      </div>
      <div className="x-row-full">
        <div className="x-col-50">
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
          <div className="x-separator-20" />
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
          <div className="x-separator-20" />
          <label>
            Enter Amount/Quantity:
            <input
              id="quantity"
              className="x-input-text"
              name="quantity"
              type="number"
              value={quantity}
              min={quantityMin}
              step="any"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <div className="x-separator-20" />
          <label>
            Enter <span className="x-upper-case">{(valueTo as any).value}</span>{" "}
            Deposit Address:
            <input
              id="depositAddress"
              className="x-input-text"
              name="depositAddress"
              type="text"
              value={depositAddress}
              onChange={(e) => setDepositAddress(e.target.value)}
            />
          </label>
          <div className="x-separator-20" />
          <label>
            Enter{" "}
            <span className="x-upper-case">{(valueFrom as any).value}</span>{" "}
            Refund Address:
            <input
              id="refundAddress"
              className="x-input-text"
              name="refundAddress"
              type="text"
              value={refundAddress}
              onChange={(e) => setRefundAddress(e.target.value)}
            />
          </label>
          <div className="x-separator-20" />
          <label>
            Enter Email Address:
            <input
              id="userEmailAddress"
              className="x-input-text"
              name="userEmailAddress"
              type="text"
              value={userEmailAddress}
              onChange={(e) => setUserEmailAddress(e.target.value)}
            />
          </label>
          <div className="x-separator-20" />
          <div className="x-row-full x-align-center">
            <div className="x-col-50">
              <button
                type="button"
                onClick={handleEstimate}
                className="x-input-button full"
              >
                Estimate
              </button>
            </div>
            <div className="x-col-50">
              <button
                type="button"
                onClick={handleExchange}
                className="x-input-button full"
              >
                Exchange
              </button>
            </div>
          </div>
        </div>
        <div className="x-col-50">
          <div className="x-exchange-result-box">
            <div className="x-row-full">
              <div className="x-col-50">
                <p>From: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">{(valueFrom as any).value}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>To: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">{(valueTo as any).value}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Quantity/Amount: </p>
              </div>
              <div className="x-col-50">
                <p>{quantity}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Minimum Quantity/Amount: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">
                  {quantityMin} {(valueFrom as any).value}
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Exchange Estimate: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">
                  {estimate} {(valueTo as any).value}
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Deposit Address: </p>
              </div>
              <div className="x-col-50">
                <p>
                  <p className="x-over-flow">{depositAddress}</p>
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Refund Address: </p>
              </div>
              <div className="x-col-50">
                <p>
                  <p className="x-over-flow">{refundAddress}</p>
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Email Address: </p>
              </div>
              <div className="x-col-50">
                <p>
                  <p className="x-over-flow">{userEmailAddress}</p>
                </p>
              </div>
            </div>
          </div>
          <div className="x-separator-20" />
          <div className="x-exchange-result-box">
            <div className="x-row-double">
              <p>Transaction ID</p>
              <div className="x-address-box">{txnId}</div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Final Exchange Quantity/Amount: </p>
              </div>
              <div className="x-col-50">
                <p>
                  {finalQuantity}{" "}
                  <span className="x-upper-case">{(valueTo as any).value}</span>
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-double">
              <p>
                Payin Address (
                <span className="x-upper-case">{(valueFrom as any).value}</span>{" "}
                Address to make payment to):
              </p>
              <div className="x-address-box">{payinAddress}</div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-double">
              <p>Payin Memo (Write in Memo while making payment):</p>
              <div className="x-address-box">{payinMemo}</div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-double">
              <p>
                Payout Address (Your{" "}
                <span className="x-upper-case">{(valueTo as any).value}</span>{" "}
                Address):
              </p>
              <div className="x-address-box">{payoutAddress}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeNow
