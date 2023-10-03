export default [
  {
    inputs: [],
    name: "AlreadyVoted",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerIsNotDelegate",
    type: "error",
  },
  {
    inputs: [],
    name: "CastNotInWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositSmallerThanBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "InvalidProverVersion",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSupport",
    type: "error",
  },
  {
    inputs: [],
    name: "NoVotingPower",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMotivator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ProposalEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "ProposalNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "ProposalNotStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "SyncProposalInvalidProof",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "VoteInvalidProof",
    type: "error",
  },
  {
    anonymous: false,
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
        indexed: false,
        internalType: "struct Governor.Config",
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
        internalType: "uint256",
        name: "proposal",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endBlock",
        type: "uint256",
      },
    ],
    name: "ProposalSynced",
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
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "support",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votes",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "VoteCast",
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
        internalType: "uint256",
        name: "forVotes",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "againstVotes",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "abstainVotes",
        type: "uint256",
      },
    ],
    name: "VotesSettled",
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
        internalType: "uint256",
        name: "_proposal",
        type: "uint256",
      },
    ],
    name: "getProposal",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "forVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "againstVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "abstainVotes",
            type: "uint256",
          },
        ],
        internalType: "struct Governor.Proposal",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposal",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "getReceipt",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "hasVoted",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "support",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "votes",
            type: "uint256",
          },
        ],
        internalType: "struct Governor.Receipt",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "forVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "againstVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "abstainVotes",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "receipts",
    outputs: [
      {
        internalType: "bool",
        name: "hasVoted",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "support",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "votes",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_proposal",
        type: "uint256",
      },
    ],
    name: "settleVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "settled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
    inputs: [
      {
        internalType: "uint256[]",
        name: "_proposals",
        type: "uint256[]",
      },
      {
        internalType: "uint8[]",
        name: "_supports",
        type: "uint8[]",
      },
      {
        internalType: "string[]",
        name: "_reasons",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "_metadata",
        type: "string[]",
      },
      {
        internalType: "bytes[]",
        name: "_voterProofBatches",
        type: "bytes[]",
      },
      {
        internalType: "bytes[]",
        name: "_proposalCreatedProofs",
        type: "bytes[]",
      },
    ],
    name: "vote",
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
