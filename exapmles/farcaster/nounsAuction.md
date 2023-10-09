In this example we will create a Farcaster bot that will cast every time a new Noun is born and update its profile pic respectively.

We start by initilizing BotSwarm and setting up the config for Ethereum and Farcaster.

```ts
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
```

Next, we watch the `AuctionCreated` event on the `NounsAuctionHouse` contract.

```ts
watch(
  {
    contract: "NounsAuctionHouse",
    chain: "mainnet",
    event: "AuctionCreated",
  },
  async (event) => {
    ...
  }
);
```

When an `AuctionCreated` event is fired we then cast to Farcaster using arguments returned by the event object.

```ts
cast(
    `It's Noun o'clock and Noun ${event.args.nounId} is up for auction!\n\nBid now 👇`,
    {
    channel: Nouns,
    embeds: [{ url: `https://nouns.wtf/noun/${event.args.nounId}` }],
    }
);
```

Finally, we call `updateProfile` and pass in the new image url to the pfp property.

```ts
updateProfile({
    pfp: `https://api.cloudnouns.com/v2/nouns/${event.args.nounId}`,
});
```