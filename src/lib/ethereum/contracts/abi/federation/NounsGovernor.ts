export default [
  {
    type: "constructor",
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
      { name: "_owner", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "config",
    inputs: [],
    outputs: [
      { name: "reliquary", type: "address", internalType: "address" },
      { name: "nativeToken", type: "address", internalType: "address" },
      { name: "externalDAO", type: "address", internalType: "address" },
      {
        name: "storageProver",
        type: "address",
        internalType: "address",
      },
      { name: "logProver", type: "address", internalType: "address" },
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
      { name: "messenger", type: "address", internalType: "address" },
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
      { name: "castWindow", type: "uint256", internalType: "uint256" },
      {
        name: "finalityBlocks",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProposal",
    inputs: [{ name: "_proposal", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Governor.Proposal",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          {
            name: "startBlock",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "endBlock",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "forVotes",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "againstVotes",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "abstainVotes",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReceipt",
    inputs: [
      { name: "_proposal", type: "uint256", internalType: "uint256" },
      { name: "_voter", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Governor.Receipt",
        components: [
          { name: "hasVoted", type: "bool", internalType: "bool" },
          { name: "support", type: "uint8", internalType: "uint8" },
          { name: "votes", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "init",
    inputs: [{ name: "", type: "bytes", internalType: "bytes" }],
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
    name: "proposals",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "startBlock", type: "uint256", internalType: "uint256" },
      { name: "endBlock", type: "uint256", internalType: "uint256" },
      { name: "forVotes", type: "uint256", internalType: "uint256" },
      {
        name: "againstVotes",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "abstainVotes", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "receipts",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "hasVoted", type: "bool", internalType: "bool" },
      { name: "support", type: "uint8", internalType: "uint8" },
      { name: "votes", type: "uint256", internalType: "uint256" },
    ],
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
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "settleVotes",
    inputs: [
      { name: "_proposal", type: "uint256", internalType: "uint256" },
      { name: "_blockProof", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "settled",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
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
    name: "vote",
    inputs: [
      { name: "_proposal", type: "uint256", internalType: "uint256" },
      { name: "_support", type: "uint8", internalType: "uint8" },
      { name: "_reason", type: "string", internalType: "string" },
      { name: "_metadata", type: "string", internalType: "string" },
      {
        name: "_voterProofBatch",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "_voterProofAccounts",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_proposalCreatedProof",
        type: "bytes",
        internalType: "bytes",
      },
      { name: "_blockProof", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
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
    type: "event",
    name: "ConfigChanged",
    inputs: [
      {
        name: "config",
        type: "tuple",
        indexed: false,
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
    name: "ProposalSynced",
    inputs: [
      {
        name: "proposal",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "endBlock",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "startBlock",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
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
    name: "VoteCast",
    inputs: [
      {
        name: "proposal",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "voter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "support",
        type: "uint8",
        indexed: true,
        internalType: "uint8",
      },
      {
        name: "votes",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "metadata",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VotesSettled",
    inputs: [
      {
        name: "proposal",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "forVotes",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "againstVotes",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "abstainVotes",
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
  { type: "error", name: "AlreadyVoted", inputs: [] },
  { type: "error", name: "CallerIsNotDelegate", inputs: [] },
  { type: "error", name: "CastNotInWindow", inputs: [] },
  { type: "error", name: "InvalidProofBatchLength", inputs: [] },
  {
    type: "error",
    name: "InvalidProverVersion",
    inputs: [{ name: "", type: "string", internalType: "string" }],
  },
  { type: "error", name: "InvalidSupport", inputs: [] },
  { type: "error", name: "MissingProposalCreatedProof", inputs: [] },
  { type: "error", name: "NoVotingPower", inputs: [] },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
  },
  { type: "error", name: "ProofBatchAndAccountMismatch", inputs: [] },
  { type: "error", name: "ProposalEnded", inputs: [] },
  { type: "error", name: "ProposalNotFound", inputs: [] },
  { type: "error", name: "ProposalNotStarted", inputs: [] },
  { type: "error", name: "SyncProposalInvalidProof", inputs: [] },
  {
    type: "error",
    name: "VoteInvalidProof",
    inputs: [{ name: "", type: "string", internalType: "string" }],
  },
] as const;
