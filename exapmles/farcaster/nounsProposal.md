In this example we will create a Farcaster bot that will cast every time a new NounsDAO proposal has been put onchain.

We start by initilizing BotSwarm and setting up the config for Ethereum and Farcaster.

```ts
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
```

Next, we watch the `ProposalCreated` event on the `NounsDAOLogicV3` contract.

```ts
watch(
  {
    contract: "NounsDAOLogicV3",
    chain: "mainnet",
    event: "ProposalCreated",
  },
  async (event) => {
    ...
  }
);
```

When an `ProposalCreated` event is fired we then cast to Farcaster using arguments returned by the event object.

```ts
cast(`Prop ${event.args.id}: ${event.args.description}\n\nGo vote 👇`, {
    channel: Nouns,
    embeds: [{ url: `https://nouns.wtf/vote/${event.args.id}` }],
});
```