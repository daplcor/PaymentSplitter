
// We built a simple configuration object to switch between testnet and mainnet
const config = {
    testnet: {
      apiUrl: "https://api.testnet.chainweb.com",
      client: "https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact",
      contract: "n_f9b22d2046c2a52575cc94f961c8b9a095e349e7.wallet-reg",
      spireContract: "n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet",
      chainId: "1",
      networkId: "testnet04",
      spireKeyUrl: "https://spirekey.kadena.io",
    },
    mainnet: {
      apiUrl: "https://api.chainweb.com",
      client: "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact",
      contract: "n_f9b22d2046c2a52575cc94f961c8b9a095e349e7.wallet-reg",
      spireContract: "n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet",
      chainId: "8",
      networkId: "mainnet01",
      spireKeyUrl: "https://spirekey.kadena.io",
    }
  };
  
  // Determine the current environment
  const currentEnv = import.meta.env.VITE_APP_ENV === 'mainnet' ? 'mainnet' : 'testnet';
  // console.log(currentEnv);
  export default config[currentEnv];
  