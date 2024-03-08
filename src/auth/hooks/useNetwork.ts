import { atom, useRecoilState } from "recoil"
import { useNetworks } from "app/InitNetworks"
import { sandbox } from "../scripts/env"
import { getStoredNetwork, storeNetwork } from "../scripts/network"

const networkState = atom({
  key: "network",
  default: getStoredNetwork(),
})

export const useNetworkState = () => {
  const [network, setNetwork] = useRecoilState(networkState)

  const changeNetwork = (network: NetworkName) => {
    setNetwork(network)
    storeNetwork(network)
  }

  return [network, changeNetwork] as const
}

/* helpers */
export const useNetworkOptions = () => {
  const networks = useNetworks()

  if (!sandbox) return

  return Object.values(networks).map(({ name }) => {
    return { value: name, label: name }
  })
}

export const useNetwork = (): CustomNetwork => {
  const networks = useNetworks()
  return networks.classic
}

export const useNetworkName = () => {
  const { name } = useNetwork()
  return name
}

export const useChainID = () => {
  const { chainID } = useNetwork()
  return chainID
}
