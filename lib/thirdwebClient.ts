import { createThirdwebClient } from "thirdweb";
import { arcTestnet } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT || "",
});

// Arc chain configuration (use sepolia testnet as fallback for development)
// Update this with actual Arc chain RPC when available
export const arcChain = arcTestnet;
