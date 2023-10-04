export default [
  {
    inputs: [],
    name: "AlreadyRelayed",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositSmallerThanBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMessageProof",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMotivator",
    type: "error",
  },
  {
    inputs: [],
    name: "QuorumNotMet",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "base",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalDAO",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "zkSync",
            type: "address",
          },
          {
            internalType: "address",
            name: "governor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "quorumVotesBPS",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Relayer.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "ConfigChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "motivator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Refund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Tip",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposal",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "support",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalVotes",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalVotesCast",
        type: "uint256",
      },
    ],
    name: "VotesRelayed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "motivator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "balance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "config",
    outputs: [
      {
        internalType: "address",
        name: "base",
        type: "address",
      },
      {
        internalType: "address",
        name: "externalDAO",
        type: "address",
      },
      {
        internalType: "address",
        name: "externalToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "zkSync",
        type: "address",
      },
      {
        internalType: "address",
        name: "governor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quorumVotesBPS",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "motivator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_l2BlockNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "_l2TxNumberInBlock",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_messageProof",
        type: "bytes32[]",
      },
    ],
    name: "relayVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "base",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalDAO",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "zkSync",
            type: "address",
          },
          {
            internalType: "address",
            name: "governor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "quorumVotesBPS",
            type: "uint256",
          },
        ],
        internalType: "struct Relayer.Config",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "setConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "reliquary",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "externalDAO",
            type: "address",
          },
          {
            internalType: "address",
            name: "storageProver",
            type: "address",
          },
          {
            internalType: "address",
            name: "logProver",
            type: "address",
          },
          {
            internalType: "address",
            name: "factValidator",
            type: "address",
          },
          {
            internalType: "address",
            name: "messenger",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "tokenDelegateSlot",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "tokenBalanceSlot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "maxProverVersion",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "castWindow",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "finalityBlocks",
            type: "uint256",
          },
        ],
        internalType: "struct Governor.Config",
        name: "_config",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_gasLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_gasPerPubdataByteLimit",
        type: "uint256",
      },
    ],
    name: "setGovernorConfig",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "refundBaseGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefundPriorityFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefundGasUsed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefund",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefundBaseFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tipAmount",
            type: "uint256",
          },
        ],
        internalType: "struct ExternalMotivator.MotivatorConfig",
        name: "_motivatorConfig",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_gasLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_gasPerPubdataByteLimit",
        type: "uint256",
      },
    ],
    name: "setGovernorMotivatorConfig",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "refundBaseGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefundPriorityFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefundGasUsed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefund",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRefundBaseFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tipAmount",
            type: "uint256",
          },
        ],
        internalType: "struct ExternalMotivator.MotivatorConfig",
        name: "_motivatorConfig",
        type: "tuple",
      },
    ],
    name: "setMotivatorConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tip",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
