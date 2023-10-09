import BotSwarm from "../../src/BotSwarm.js";
import { NounsAuctionHouse } from "../../src/lib/ethereum/contracts/index.js";
import { Nouns } from "../../src/lib/farcaster/channels/index.js";

const { Ethereum, Farcaster } = BotSwarm();

const { watch } = Ethereum({
  contracts: {
    NounsAuctionHouse,
  },
  privateKey: process.env.ETHEREUM_PRIVATE_KEY as string,
});

const { cast, updateProfile } = Farcaster({
  fid: 10500,
  signerPrivateKey: process.env.FARCASTER_PRIVATE_KEY as string,
});

watch(
  {
    contract: "NounsAuctionHouse",
    chain: "sepolia",
    event: "AuctionCreated",
  },
  async (event) => {
    cast(`Noun ${event.args.nounId} is up for auction!\n\nBid now 👇`, {
      channel: Nouns,
      embeds: [{ url: `https://nouns.wtf/noun/${event.args.nounId}` }],
    });

    updateProfile({
      pfp: `https://api.cloudnouns.com/v2/nouns/${event.args.nounId}`,
    });
  }
);
