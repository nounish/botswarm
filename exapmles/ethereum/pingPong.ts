import BotSwarm from "@federationwtf/botswarm";

const PingABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pingBlock",
        type: "uint256",
      },
    ],
    name: "PingEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "ping",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const PongABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pongBlock",
        type: "uint256",
      },
    ],
    name: "PongEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "pong",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const { Ethereum } = BotSwarm();

const { watch, write } = Ethereum({
  contracts: {
    Ping: {
      abi: PingABI,
      deployments: {
        sepolia: "0x9bbe6ab5de9fc311626d7b6becf212220d628829",
      },
    },
    Pong: {
      abi: PongABI,
      deployments: {
        goerli: "0x42182129cd18fb95c043c03a0546e143dab961f8",
      },
    },
  },
  privateKey: process.env.ETHEREUM_PRIVATE_KEY as string,
});

write({
  contract: "Ping",
  chain: "sepolia",
  functionName: "ping",
});

watch(
  {
    contract: "Ping",
    chain: "sepolia",
    event: "PingEvent",
  },
  async () => {
    write({
      contract: "Pong",
      chain: "goerli",
      functionName: "pong",
    });
  }
);

watch(
  {
    contract: "Pong",
    chain: "goerli",
    event: "PongEvent",
  },
  async () => {
    write({
      contract: "Ping",
      chain: "sepolia",
      functionName: "ping",
    });
  }
);
