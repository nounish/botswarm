import {
  CastAddBody,
  FarcasterNetwork,
  NobleEd25519Signer,
  getSSLHubRpcClient,
  ReactionType,
} from "@farcaster/hub-nodejs";
import { BotSwarmConfig } from "../../BotSwarm";
import caster from "./caster";
import { Logger } from "../logger";

export type FarcasterSigner = NobleEd25519Signer;

export type FarcasterClient = ReturnType<typeof getSSLHubRpcClient>;

export type FarcasterNetworks = Lowercase<
  Exclude<keyof typeof FarcasterNetwork, "NONE">
>;

export type Channel = {
  name: string;
  parent_url: string;
  image: string;
  channel_id: string;
};

export type Cast = {
  fid: number;
  hash: Uint8Array;
} & CastAddBody;

export type Reaction = Lowercase<Exclude<keyof typeof ReactionType, "NONE">>;

export type FarcasterConfig = {
  fid: number;
  signerPrivateKey: string;
  rpc: { url: string; network: FarcasterNetworks };
};

export default function createFarcaster(
  botswarmConfig: BotSwarmConfig,
  log: Logger
) {
  return (config: {
    fid: FarcasterConfig["fid"];
    signerPrivateKey: FarcasterConfig["signerPrivateKey"];
    rpc?: FarcasterConfig["rpc"];
  }) => {
    const farcasterConfig = {
      rpc: { url: "testnet1.farcaster.xyz:2283", network: "testnet" },
      ...config,
    } satisfies FarcasterConfig;

    let farcasterClient: FarcasterClient = getSSLHubRpcClient(
      farcasterConfig.rpc.url
    );

    let farcasterSigner: FarcasterSigner = new NobleEd25519Signer(
      Buffer.from(config.signerPrivateKey)
    );

    const { cast, removeCast, reply, react, updateProfile } = caster(
      {
        fid: farcasterConfig.fid,
        network:
          FarcasterNetwork[
            farcasterConfig.rpc.network.toUpperCase() as Uppercase<FarcasterNetworks>
          ],
        farcasterClient,
        farcasterSigner,
      },
      log
    );

    return {
      farcasterClient,
      farcasterSigner,
      cast,
      removeCast,
      reply,
      react,
      updateProfile,
    };
  };
}
