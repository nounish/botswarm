export default [
  {
    type: "function",
    name: "config",
    inputs: [],
    outputs: [
      { name: "base", type: "address", internalType: "address" },
      { name: "externalDAO", type: "address", internalType: "address" },
      { name: "nativeToken", type: "address", internalType: "address" },
      { name: "zkSync", type: "address", internalType: "address" },
      { name: "governor", type: "address", internalType: "address" },
      {
        name: "quorumVotesBPS",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "init",
    inputs: [{ name: "_data", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "motivatorConfig",
    inputs: [],
    outputs: [
      {
        name: "refundBaseGas",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxRefundPriorityFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxRefundGasUsed",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxRefundBaseFee",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "tipAmount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "relayVotes",
    inputs: [
      {
        name: "_l1BatchNumber",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_index", type: "uint256", internalType: "uint256" },
      {
        name: "_l1BatchTxIndex",
        type: "uint16",
        internalType: "uint16",
      },
      { name: "_message", type: "bytes", internalType: "bytes" },
      {
        name: "_messageProof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "relayed",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setConfig",
    inputs: [
      {
        name: "_config",
        type: "tuple",
        internalType: "struct Relayer.Config",
        components: [
          { name: "base", type: "address", internalType: "address" },
          {
            name: "externalDAO",
            type: "address",
            internalType: "address",
          },
          {
            name: "nativeToken",
            type: "address",
            internalType: "address",
          },
          { name: "zkSync", type: "address", internalType: "address" },
          {
            name: "governor",
            type: "address",
            internalType: "address",
          },
          {
            name: "quorumVotesBPS",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setGovernorConfig",
    inputs: [
      {
        name: "_config",
        type: "tuple",
        internalType: "struct Governor.Config",
        components: [
          {
            name: "reliquary",
            type: "address",
            internalType: "address",
          },
          {
            name: "nativeToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "externalDAO",
            type: "address",
            internalType: "address",
          },
          {
            name: "storageProver",
            type: "address",
            internalType: "address",
          },
          {
            name: "logProver",
            type: "address",
            internalType: "address",
          },
          {
            name: "transactionProver",
            type: "address",
            internalType: "address",
          },
          {
            name: "factValidator",
            type: "address",
            internalType: "address",
          },
          {
            name: "messenger",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenDelegateSlot",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tokenBalanceSlot",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxProverVersion",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "castWindow",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "finalityBlocks",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      { name: "_gasLimit", type: "uint256", internalType: "uint256" },
      {
        name: "_gasPerPubdataByteLimit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "setGovernorMotivatorConfig",
    inputs: [
      {
        name: "_motivatorConfig",
        type: "tuple",
        internalType: "struct MotivatorV2.MotivatorConfig",
        components: [
          {
            name: "refundBaseGas",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxRefundPriorityFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxRefundGasUsed",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxRefundBaseFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tipAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      { name: "_gasLimit", type: "uint256", internalType: "uint256" },
      {
        name: "_gasPerPubdataByteLimit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "setMotivatorConfig",
    inputs: [
      {
        name: "_motivatorConfig",
        type: "tuple",
        internalType: "struct MotivatorV2.MotivatorConfig",
        components: [
          {
            name: "refundBaseGas",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxRefundPriorityFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxRefundGasUsed",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxRefundBaseFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tipAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_to", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawFromGovenor",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_to", type: "address", internalType: "address" },
      { name: "_gasLimit", type: "uint256", internalType: "uint256" },
      {
        name: "_gasPerPubdataByteLimit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "ConfigChanged",
    inputs: [
      {
        name: "config",
        type: "tuple",
        indexed: false,
        internalType: "struct Relayer.Config",
        components: [
          { name: "base", type: "address", internalType: "address" },
          {
            name: "externalDAO",
            type: "address",
            internalType: "address",
          },
          {
            name: "nativeToken",
            type: "address",
            internalType: "address",
          },
          { name: "zkSync", type: "address", internalType: "address" },
          {
            name: "governor",
            type: "address",
            internalType: "address",
          },
          {
            name: "quorumVotesBPS",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Refund",
    inputs: [
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Tip",
    inputs: [
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VotesRelayed",
    inputs: [
      {
        name: "proposal",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "support",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
      {
        name: "totalVotes",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalVotesCast",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "to",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyRelayed", inputs: [] },
  { type: "error", name: "InvalidMessageProof", inputs: [] },
  { type: "error", name: "QuorumNotMet", inputs: [] },
] as const;
