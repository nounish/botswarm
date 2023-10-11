import BotSwarm from "@federationwtf/botswarm";
import { NounsAuctionHouse } from "@federationwtf/botswarm/contracts";
import { Nouns } from "@federationwtf/botswarm/channels";

const { Ethereum, Farcaster } = BotSwarm();

const { watch } = Ethereum({
  contracts: {
    NounsAuctionHouse,
  },
  privateKey: process.env.ETHEREUM_PRIVATE_KEY as string,
});

const { cast, updateProfile } = Farcaster({
  fid: 16074, // @federation
  signerPrivateKey: process.env.FARCASTER_PRIVATE_KEY as string,
});

watch(
  {
    contract: "NounsAuctionHouse",
    chain: "mainnet",
    event: "AuctionCreated",
  },
  async (event) => {
    cast(
      `It's Noun o'clock and Noun ${event.args.nounId} is up for auction!\n\nBid now 👇`,
      {
        channel: Nouns,
        embeds: [{ url: `https://nouns.wtf/noun/${event.args.nounId}` }],
      }
    );

    updateProfile({
      pfp: `https://api.cloudnouns.com/v2/nouns/${event.args.nounId}`,
    });
  }
);
