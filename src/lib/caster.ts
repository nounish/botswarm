import type { FarcasterClient } from "../utils/createConfig";
import { Cast, MerkleAPIClient } from "@standard-crypto/farcaster-js";
import { error } from "./logger";

export default function caster(
  client: FarcasterClient,
  options: { log: boolean }
) {
  const missingMnemonicError = "Missing property FARCASTER_PHRASE from .env";

  async function cast(text: string, options?: { channel?: string }) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      // TODO: Add channel support to farcaster-js
      if (options?.channel) return client.publishCast(text, options.channel);

      return client.publishCast(text);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function deleteCast(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.deleteCast(cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function reply(text: string, cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.publishCast(text, cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function recast(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.recast(cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function removeRecast(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.deleteRecast(cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function like(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.reactToCast("like", cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function removeLike(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.removeReactionToCast("like", cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function watchCast(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.watchCast(cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function unwatchCast(cast: Cast) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      return client.unwatchCast(cast);
    } catch (error) {
      handleErrors(error);
    }
  }

  async function followUser(user: number | string) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      let fid: number;

      if (typeof user === "number") fid = user;
      else {
        const _fid = await client.lookupUserByUsername(user);

        if (!_fid) throw new Error(`User with the handle ${user} not found`);

        fid = _fid.fid;
      }

      return client.followUser({ fid });
    } catch (error) {
      handleErrors(error);
    }
  }

  async function unfollowUser(user: number | string) {
    try {
      if (!client) throw new Error(missingMnemonicError);

      let fid: number;

      if (typeof user === "number") fid = user;
      else {
        const _fid = await client.lookupUserByUsername(user);

        if (!_fid) throw new Error(`User with the handle ${user} not found`);

        fid = _fid.fid;
      }

      return client.unfollowUser({ fid });
    } catch (error) {
      handleErrors(error);
    }
  }

  function handleErrors(_error: any) {
    if (MerkleAPIClient.isApiErrorResponse(_error)) {
      const apiErrors = _error.response.data.errors as any;

      for (const apiError of apiErrors) {
        if (options.log) {
          error(apiError.message);
        }
      }
    }

    if (_error instanceof Error && options.log) {
      error(_error.message);
    }
  }

  return {
    cast,
    deleteCast,
    reply,
    recast,
    removeRecast,
    like,
    removeLike,
    watchCast,
    unwatchCast,
    followUser,
    unfollowUser,
  };
}
