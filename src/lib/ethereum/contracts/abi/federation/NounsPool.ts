export default [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BidAuctionEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "BidInvalidSupport",
    type: "error",
  },
  {
    inputs: [],
    name: "BidMaxBidExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "BidModulePaused",
    type: "error",
  },
  {
    inputs: [],
    name: "BidNoAuction",
    type: "error",
  },
  {
    inputs: [],
    name: "BidProposalNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "BidReserveNotMet",
    type: "error",
  },
  {
    inputs: [],
    name: "BidTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "BidVoteAlreadyCast",
    type: "error",
  },
  {
    inputs: [],
    name: "CastVoteAlreadyCast",
    type: "error",
  },
  {
    inputs: [],
    name: "CastVoteBidDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "CastVoteNoDelegations",
    type: "error",
  },
  {
    inputs: [],
    name: "CastVoteNotInWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimAlreadyRefunded",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimNotRefundable",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimOnlyBidder",
    type: "error",
  },
  {
    inputs: [],
    name: "ConfigModuleHasActiveLock",
    type: "error",
  },
  {
    inputs: [],
    name: "InitAuctionCloseBlocksNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "InitBaseWalletNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "InitCastWindowNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "InitExternalDAONotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "InitExternalTokenNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "InitFeeRecipientNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawAlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawBidNotOffered",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawBidRefunded",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawDelegateOrOwnerOnly",
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
    name: "WithdrawInvalidProof",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawMaxProverVersion",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawNoBalanceAtPropStart",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawNoTokensDelegated",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawPropIsActive",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawVoteNotCast",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dao",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "propId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "support",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "BidPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "ConfigChanged",
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
        name: "refund",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tip",
        type: "uint256",
      },
    ],
    name: "GasRefundWithTip",
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ProtocolFeeApplied",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dao",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "propId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "RefundClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "balanceSlot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "delegateSlot",
        type: "bytes32",
      },
    ],
    name: "SlotsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dao",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "propId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "support",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
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
        internalType: "address",
        name: "dao",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "propId",
        type: "uint256[]",
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
    name: "MAX_REFUND_GAS_USED",
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
    name: "MAX_REFUND_PRIORITY_FEE",
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
    name: "REFUND_BASE_GAS",
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
    name: "balanceSlotIdx",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_support",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_reason",
        type: "string",
      },
    ],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pId",
        type: "uint256",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pId",
        type: "uint256",
      },
    ],
    name: "claimRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "delegateSlotIdx",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pId",
        type: "uint256",
      },
    ],
    name: "getBid",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "remainingAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "remainingVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "creationBlock",
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
            name: "auctionEndBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "support",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "bidder",
            type: "address",
          },
          {
            internalType: "bool",
            name: "executed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "refunded",
            type: "bool",
          },
        ],
        internalType: "struct GovernancePool.Bid",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getConfig",
    outputs: [
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
            name: "feeRecipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "reservePrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeBuffer",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minBidIncrementPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "castWindow",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auctionCloseBlocks",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tip",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeBPS",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxBaseFeeRefund",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxProverVersion",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "reliquary",
            type: "address",
          },
          {
            internalType: "address",
            name: "dcash",
            type: "address",
          },
          {
            internalType: "address",
            name: "factValidator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "useStartBlockFromPropId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "reason",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "migrationPropId",
            type: "uint256",
          },
        ],
        internalType: "struct ModuleConfig.Config",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "minBidAmount",
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
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_reliquary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_delegateCash",
        type: "address",
      },
      {
        internalType: "address",
        name: "_factValidator",
        type: "address",
      },
    ],
    name: "setAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timeBuffer",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_auctionCloseBlocks",
        type: "uint256",
      },
    ],
    name: "setAuctionSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_castWindow",
        type: "uint256",
      },
    ],
    name: "setCastWindow",
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
            name: "feeRecipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "reservePrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeBuffer",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minBidIncrementPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "castWindow",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "auctionCloseBlocks",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tip",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeBPS",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxBaseFeeRefund",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxProverVersion",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "reliquary",
            type: "address",
          },
          {
            internalType: "address",
            name: "dcash",
            type: "address",
          },
          {
            internalType: "address",
            name: "factValidator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "useStartBlockFromPropId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "reason",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "migrationPropId",
            type: "uint256",
          },
        ],
        internalType: "struct ModuleConfig.Config",
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
        internalType: "uint256",
        name: "_feeBPS",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_feeRecipient",
        type: "address",
      },
    ],
    name: "setFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_version",
        type: "uint256",
      },
    ],
    name: "setMaxProverVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_migrationPropId",
        type: "uint256",
      },
    ],
    name: "setMigrationPropId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_reason",
        type: "string",
      },
    ],
    name: "setReason",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_reservePrice",
        type: "uint256",
      },
    ],
    name: "setReservePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balanceSlot",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "delegateSlot",
        type: "uint256",
      },
    ],
    name: "setSlots",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tip",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxBaseFeeRefund",
        type: "uint256",
      },
    ],
    name: "setTipAndRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pId",
        type: "uint256",
      },
    ],
    name: "setUseStartBlockFromPropId",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_prover",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_pIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_fee",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "_proofBatches",
        type: "bytes[]",
      },
    ],
    name: "withdraw",
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
        name: "_pId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "withdrawn",
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
] as const;
