import BotSwarm from "../../src/BotSwarm.js";
import { NounsDAOLogicV3 } from "../../src/lib/ethereum/contracts/index.js";
import { Nouns } from "../../src/lib/farcaster/channels/index.js";

const { Ethereum, Farcaster } = BotSwarm();

const { watch } = Ethereum({
  contracts: {
    NounsDAOLogicV3,
  },
  privateKey: process.env.ETHEREUM_PRIVATE_KEY as string,
});

const { cast } = Farcaster({
  fid: 10500,
  signerPrivateKey: process.env.FARCASTER_PRIVATE_KEY as string,
});

watch(
  {
    contract: "NounsDAOLogicV3",
    chain: "sepolia",
    event: "ProposalCreated",
  },
  async (event) => {
    cast(
      `Prop ${event.args.id}: ${
        event.args.description
      }\nVoting Closes in ${formatTime(
        event.args.endBlock,
        event.blockNumber
      )}`,
      {
        channel: Nouns,
        embeds: [{ url: `https://nouns.wtf/vote/${event.args.id}` }],
      }
    );
  }
);

function formatTime(endBlock: bigint, blockNumber: bigint) {
  const seconds = (Number(endBlock) - Number(blockNumber)) * 12;

  // 2 days
  if (seconds > 172_800) {
    return `${Math.floor(seconds / 86_400)} days`;
  }

  // 1 day
  if (seconds > 86_400) {
    return `1 day`;
  }

  // 2 hours
  if (seconds > 7_200) {
    return `${Math.floor(seconds / 3600)} hours`;
  }

  // 1 hour
  if (seconds > 3_600) {
    return `1 hour`;
  }

  // 2 mins
  if (seconds > 120) {
    return `${Math.floor(seconds / 60)} mins`;
  }

  return `1 min`;
}
