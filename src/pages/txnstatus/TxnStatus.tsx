import { useState } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import axios from "axios"
import "./TxnStatus.css"

const ChangeNow = () => {
  const baseUrlMiddleware = "https://station-middleware.terraclassic.tech/"
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

  const resultListStyle = {
    width: "100%",
    padding: 2,
    bgcolor: "#f0f0f0",
    borderRadius: 1,
    border: 1,
    borderColor: "lightgray",
  }

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
    <Grid
      container
      spacing={5}
      xs
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingTop={5}
    >
      <Grid xs={2}></Grid>
      <Grid xs={4}>
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
      </Grid>
      <Grid xs={4}>
        <List dense sx={resultListStyle}>
          <ListItem>
            <ListItemText primary="Transaction ID:" secondary={txnId} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Status:" secondary={txnStatus} />
          </ListItem>
          <ListItem>
            <ListItemText primary="From:" secondary={fromCurrency} />
          </ListItem>
          <ListItem>
            <ListItemText primary="To:" secondary={toCurrency} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Expected Send Amount:"
              secondary={expectedSendAmount + " " + fromCurrency}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Expected Receive Amount:"
              secondary={expectedReceiveAmount + " " + toCurrency}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Created At:" secondary={createdAt} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Updated At:" secondary={updatedAt} />
          </ListItem>
        </List>
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
      </Grid>
      <Grid xs={2}></Grid>
    </Grid>
  )
}

export default ChangeNow
