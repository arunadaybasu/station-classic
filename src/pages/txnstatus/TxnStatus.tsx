// import { useTranslation } from "react-i18next"
// import { Card, Page } from "components/layout"
import { useState } from "react"
// import { Select, Option } from "bymax-react-select"
// import BarLoader from "react-spinners/BarLoader"
import axios from "axios"
import "./TxnStatus.css"

const ChangeNow = () => {
  const baseUrlMiddleware = "http://localhost:5737/"
  const [loading, setLoading] = useState(true)
  const [txnStatus, setTxnStatus] = useState("...")
  const [payinAddress, setPayinAddress] = useState("...")
  const [payoutAddress, setPayoutAddress] = useState("...")
  const [fromCurrency, setFromCurrency] = useState("...")
  const [toCurrency, setToCurrency] = useState("...")
  const [refundAddress, setRefundAddress] = useState("...")
  const [txnId, setTxnId] = useState("...")
  const [updatedAt, setUpdatedAt] = useState("...")
  const [expectedSendAmount, setExpectedSendAmount] = useState("0")
  const [expectedReceiveAmount, setExpectedReceiveAmount] = useState("0")
  const [createdAt, setCreatedAt] = useState("...")

  const handleTxnStatus = async (event: any) => {
    event.preventDefault()
    if (txnId && txnId !== "" && txnId !== "...") {
      console.log(txnId)
      try {
        const { data: response } = await axios.get(
          baseUrlMiddleware + "exchangeapi/changenow/txn-status?txnid=" + txnId
        )
        console.log(response)
        setTxnStatus(response.result.status)
        setPayinAddress(response.result.payinAddress)
        setPayoutAddress(response.result.payoutAddress)
        setFromCurrency(response.result.fromCurrency)
        setToCurrency(response.result.toCurrency)
        setRefundAddress(response.result.refundAddress)
        setUpdatedAt(response.result.updatedAt)
        setCreatedAt(response.result.createdAt)
        setExpectedSendAmount(response.result.expectedSendAmount)
        setExpectedReceiveAmount(response.result.expectedReceiveAmount)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="x-page-container">
      <div className="x-row-full">
        <div className="x-col-50">
          <div className="x-row-normal">
            <h1 className="x-page-title">Transaction Status</h1>
            <div className="x-separator-20" />
            <p>
              Query the transaction status of Exchange transactions here. Enter
              the Transaction ID received during the exchange transaction and
              click on Status
            </p>
            <div className="x-separator-20" />
          </div>
          <div className="x-separator-20" />
          <label>
            Enter Transaction ID:
            <input
              id="x-txn-id"
              className="x-input-text"
              name="x-txn-id"
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
            />
          </label>
          <div className="x-separator-20" />
          <div className="x-row-full x-align-center">
            <button
              type="button"
              onClick={handleTxnStatus}
              className="x-input-button full"
            >
              Status
            </button>
          </div>
        </div>
        <div className="x-col-50">
          <div className="x-exchange-result-box">
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Transaction ID: </p>
              </div>
              <div className="x-col-50">
                <p>{txnId}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Status: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">{txnStatus}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>From: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">{fromCurrency}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>To: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">{toCurrency}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Expected Send Amount: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">
                  {expectedSendAmount} {fromCurrency}
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Expected Receive Amount: </p>
              </div>
              <div className="x-col-50">
                <p className="x-upper-case">
                  {expectedReceiveAmount} {toCurrency}
                </p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Created At: </p>
              </div>
              <div className="x-col-50">
                <p>{createdAt}</p>
              </div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-full">
              <div className="x-col-50">
                <p>Updated At: </p>
              </div>
              <div className="x-col-50">
                <p>{updatedAt}</p>
              </div>
            </div>
          </div>
          <div className="x-separator-20" />
          <div className="x-exchange-result-box">
            <div className="x-row-double">
              <p>Payin Address:</p>
              <div className="x-address-box">{payinAddress}</div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-double">
              <p>Payout Address:</p>
              <div className="x-address-box">{payoutAddress}</div>
            </div>
            <div className="x-separator-20" />
            <div className="x-row-double">
              <p>Refund Address:</p>
              <div className="x-address-box">{refundAddress}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeNow
