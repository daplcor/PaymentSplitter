import { Pact, readKeyset, createClient } from "@kadena/client";
import config from "./config";

export const pactCalls = async (code, chain, netId) => {
  
  const apiUrl = netId === "testnet04" ? "https://api.testnet.chainweb.com" : "https://api.chainweb.com";
  const pactClient = createClient(`${apiUrl}/chainweb/0.0/${netId}/chain/${chain}/pact`);


  const tx = Pact.builder
    .execution(code)
    .setMeta({
      chainId: String(chain),
      gasLimit: 100000,
      gasPrice: 0.0000001,
    })
    .setNetworkId(netId)
    .createTransaction();

  try {
    const res = await pactClient.dirtyRead(tx);
    // console.log("pactCalls", res);
    return res.result.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    return null;
  }
};