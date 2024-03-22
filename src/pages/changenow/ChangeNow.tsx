// import { useTranslation } from "react-i18next"
// import { Card, Page } from "components/layout"
import { useMemo, useState, useEffect } from "react"

import Grid from "@mui/material/Unstable_Grid2"
import Divider from "@mui/material/Divider"
import LinearProgress from "@mui/material/LinearProgress"
import IconButton from "@mui/material/IconButton"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

import { Select, Option } from "bymax-react-select"
import { CopyToClipboard } from "react-copy-to-clipboard"

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

  const baseUrlMiddleware = "https://station-middleware.terraclassic.tech/"
  const [loading, setLoading] = useState(false)
  const [warningMsgEstimate, setWarningMsgEstimate] = useState(false)
  const [warningMsgTextEstimate, setWarningMsgTextEstimate] = useState("...")
  const [warningMsgExchange, setWarningMsgExchange] = useState(false)
  const [warningMsgTextExchange, setWarningMsgTextExchange] = useState("...")
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
    setLoading(true)
    if (quantity && quantity !== "0") {
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
        if (response.status === 200) {
          setWarningMsgEstimate(false)
          setQuantityMin(response.result_min_amt.minAmount)
          setEstimate(response.result_estimate.estimatedAmount)
          console.log(quantity + " < " + response.result_min_amt.minAmount)
          if (Number(quantity) < Number(response.result_min_amt.minAmount)) {
            setWarningMsgEstimate(true)
            setWarningMsgTextEstimate(
              "Quantity/Amount entered is less than Minimum"
            )
          }
        } else {
          setWarningMsgEstimate(true)
          setWarningMsgTextEstimate(response.error_message.message)
          if (Number(quantity) < Number(quantityMin)) {
            setWarningMsgEstimate(true)
            setWarningMsgTextEstimate(
              "Quantity/Amount entered is less than Minimum"
            )
          }
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      setWarningMsgEstimate(true)
      setWarningMsgTextEstimate("Please enter valid Quantity/Amount")
    }
    setLoading(false)
  }

  const handleExchange = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    if (depositAddress === "..." || depositAddress === "") {
      setWarningMsgExchange(true)
      setWarningMsgTextExchange("Please enter valid Deposit Address")
    }
    if (refundAddress === "..." || refundAddress === "") {
      setWarningMsgExchange(true)
      setWarningMsgTextExchange("Please enter valid Refund Address")
    }
    if (userEmailAddress === "..." || userEmailAddress === "") {
      setWarningMsgExchange(true)
      setWarningMsgTextExchange("Please enter valid Email Address")
    }

    if (
      depositAddress &&
      refundAddress &&
      userEmailAddress &&
      depositAddress !== "..." &&
      refundAddress !== "..." &&
      userEmailAddress !== "..." &&
      depositAddress !== "" &&
      refundAddress !== "" &&
      userEmailAddress !== ""
    ) {
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
        if (response.status === 200) {
          setWarningMsgExchange(false)
          setPayinAddress(response.result_estimate.payinAddress)
          setPayoutAddress(response.result_estimate.payoutAddress)
          setRefundAddress(response.result_estimate.refundAddress)
          setTxnId(response.result_estimate.id)
          setFinalQuantity(response.result_estimate.amount)
          setPayinMemo(response.result_estimate.payinExtraId)
        } else {
          setWarningMsgExchange(true)
          setWarningMsgTextExchange(response.error_message.message)
        }
      } catch (error) {
        console.error(error)
      }
    }
    setLoading(false)
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
            value: response.result[i].legacyTicker,
            label: response.result[i].name,
            image: response.result[i].image,
            base: response.result[i].legacyTicker,
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
    <Grid container spacing={5} paddingTop={5} paddingLeft={5} paddingRight={5}>
      <Grid xs={12} sm={2}></Grid>
      <Grid xs={12} sm={4}>
        <div className="x-row-normal">
          <h1 className="x-page-title">Exchange</h1>
          <div className="x-separator-20" />
          <p>
            Swaps between non-related currencies such as $LUNC & $BTC (which are
            not on the same blockchain) using an exchange API rather than a
            blockchain contract as the broker
          </p>
          <div className="x-separator-20" />
          <p>
            Step 1: Select From & To currencies. Enter amount/quantity to
            exchange
          </p>
          <div className="x-separator-10" />
          <p>Step 2: Click on Estimate</p>
          <div className="x-separator-10" />
          <p>Step 3: Enter Deposit, Refund & Email addresses</p>
          <div className="x-separator-10" />
          <p>Step 4: Click on Exchange</p>
          <div className="x-separator-10" />
          <p>Step 5: Make payment to Payin Address (write Memo if displayed)</p>
          <div className="x-separator-10" />
          <p>Step 6: Copy Transaction ID</p>
          <div className="x-separator-10" />
          <p>
            Step 7: Check status of transaction on{" "}
            <a href="/exchange-status">Exchange Status</a> page
          </p>
          <div className="x-separator-10" />
          <Divider />
          <div className="x-separator-10" />
          <p>PLEASE NOTE:</p>
          <div className="x-separator-10" />
          <p>
            If you need help with any transaction, email at:{" "}
            <a href="mailto:contact@terraclassic.tech">
              contact@terraclassic.tech
            </a>{" "}
            or contact{" "}
            <a
              href="https://changenow.io/contact"
              target="_blank"
              rel="noreferrer"
            >
              ChangeNow Support
            </a>{" "}
            directly
          </p>
        </div>
        <div className="x-separator-20" />
        <Select
          id="exchange-from-currency"
          value={valueFrom}
          isMulti={false}
          isClearable={false}
          options={optionsFrom}
          placeholder="Exchange From Currency"
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
          placeholder="Exchange To Currency"
          noOptionsMessage="No coins found"
          onChange={(selectedOption) => setValueTo(selectedOption)}
        />
        <div className="x-separator-20" />
        {loading && (
          <LinearProgress
            sx={{
              width: "100%",
            }}
          />
        )}
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
          Enter <span className="x-upper-case">{(valueFrom as any).value}</span>{" "}
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
              className="x-input-button w-95"
            >
              Estimate
            </button>
          </div>
          <div className="x-col-50">
            <button
              type="button"
              onClick={handleExchange}
              className="x-input-button w-95"
            >
              Exchange
            </button>
          </div>
        </div>
        <div className="x-separator-20" />
        <div className="x-row-full x-align-center">
          {warningMsgEstimate && (
            <div className="x-warning-box">ERROR: {warningMsgTextEstimate}</div>
          )}
        </div>
        <div className="x-separator-20" />
        <div className="x-row-full x-align-center">
          {warningMsgExchange && (
            <div className="x-warning-box">ERROR: {warningMsgTextExchange}</div>
          )}
        </div>
      </Grid>
      <Grid xs={12} sm={4}>
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
            <div className="x-address-box">
              {txnId}
              <CopyToClipboard text={txnId}>
                <IconButton aria-label="Copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
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
            <div className="x-address-box">
              {payinAddress}
              <CopyToClipboard text={payinAddress}>
                <IconButton aria-label="Copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
          </div>
          <div className="x-separator-20" />
          <div className="x-row-double">
            <p>Payin Memo (Write in Memo while making payment):</p>
            <div className="x-address-box">
              {payinMemo}
              <CopyToClipboard text={payinMemo}>
                <IconButton aria-label="Copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
          </div>
          <div className="x-separator-20" />
          <div className="x-row-double">
            <p>
              Payout Address (Your{" "}
              <span className="x-upper-case">{(valueTo as any).value}</span>{" "}
              Address):
            </p>
            <div className="x-address-box">
              {payoutAddress}
              <CopyToClipboard text={payoutAddress}>
                <IconButton aria-label="Copy">
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </Grid>
      <Grid xs={12} sm={2}></Grid>
    </Grid>
  )
}

export default ChangeNow
