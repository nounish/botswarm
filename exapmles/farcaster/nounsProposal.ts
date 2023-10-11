import BotSwarm from "@federationwtf/botswarm";
import { NounsDAOLogicV3 } from "@federationwtf/botswarm/contracts";
import { Nouns } from "@federationwtf/botswarm/channels";

const { Ethereum, Farcaster } = BotSwarm();

const { watch } = Ethereum({
  contracts: {
    NounsDAOLogicV3,
  },
  privateKey: process.env.ETHEREUM_PRIVATE_KEY as string,
});

const { cast } = Farcaster({
  fid: 16074, // @federation
  signerPrivateKey: process.env.FARCASTER_PRIVATE_KEY as string,
});

watch(
  {
    contract: "NounsDAOLogicV3",
    chain: "mainnet",
    event: "ProposalCreated",
  },
  async (event) => {
    cast(`Prop ${event.args.id}: ${event.args.description}\n\nGo vote 👇`, {
      channel: Nouns,
      embeds: [{ url: `https://nouns.wtf/vote/${event.args.id}` }],
    });
  }
);
