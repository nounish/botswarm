# Ping Pong Demo

This example demonstrates how to write a bot that can interact with contracts on two different chains. There are two contracts, `Ping` and `Pong`. Each contract has a function that when called emits an event with the current block number. 

Note: Running this example will cause an infinite loop that will slowly drain your wallets funds on Sepolia and Goerli to gas fees. Do not leave it running for an extended period of time.

```solidity
contract Ping {
    event PingEvent(uint256 pingBlock);

    function ping() external {
        emit PingEvent(block.number);
    }
}

contract Pong {
    event PongEvent(uint256 pongBlock);

    function pong() external {
        emit PongEvent(block.number);
    }
}
```

We kick the loop off by writing to the `Ping` contract.

```ts
write({
  contract: "Ping",
  chain: "sepolia",
  functionName: "ping",
});
```

Once the transaction has been completed, BotSwarm picks up on the `PingEvent` emission on the Sepolia testnet and then writes to the `Pong` contract on Goerli.

```ts
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
```

The `Pong` contract on Goerli then emits the `PongEvent` which writes back to the `Ping` contract to start the whole loop over again.

```ts
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
```