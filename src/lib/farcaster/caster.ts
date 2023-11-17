import {
  makeCastAdd,
  makeCastRemove,
  makeReactionAdd,
  makeReactionRemove,
  makeUserDataAdd,
  ReactionType,
  UserDataType,
} from "@farcaster/hub-nodejs";
import { Channel, FarcasterClient, FarcasterSigner, Cast, Reaction } from ".";
import { Logger } from "../logger";
import type { CastAddBody, FarcasterNetwork } from "@farcaster/hub-nodejs";

export default function caster(
  casterConfig: {
    fid: number;
    network: FarcasterNetwork;
    client: FarcasterClient;
    signer: FarcasterSigner;
  },
  log: Logger
) {
  const dataOptions: Parameters<typeof makeCastAdd>["1"] = {
    fid: casterConfig.fid,
    network: casterConfig.network,
  };

  async function cast(
    text: string,
    options?: {
      embeds?: CastAddBody["embeds"];
      mentions?: CastAddBody["mentions"];
      mentionsPositions?: CastAddBody["mentionsPositions"];
      channel?: Channel | string;
    }
  ) {
    const parentUrl =
      typeof options?.channel === "string"
        ? options.channel
        : options?.channel?.parent_url;

    const addCast = await makeCastAdd(
      {
        text,
        embeds: options?.embeds ?? [],
        embedsDeprecated: [],
        mentions: options?.mentions ?? [],
        mentionsPositions: options?.mentionsPositions ?? [],
        parentUrl,
      },
      dataOptions,
      casterConfig.signer
    );

    if (addCast.isErr()) {
      log.error(addCast.error.message);
      return;
    }

    const submitMessage = await casterConfig.client.submitMessage(
      addCast.value
    );

    if (submitMessage.isErr()) {
      log.error(submitMessage.error.message);
      return;
    }

    return {
      fid: addCast.value.data.fid,
      hash: submitMessage.value.hash,
      ...addCast.value.data.castAddBody,
    };
  }

  async function removeCast(cast: Cast) {
    const removeCast = await makeCastRemove(
      { targetHash: cast.hash },
      dataOptions,
      casterConfig.signer
    );

    if (removeCast.isErr()) {
      log.error(removeCast.error.message);
      return false;
    }

    const submitMessage = await casterConfig.client.submitMessage(
      removeCast.value
    );

    if (submitMessage.isErr()) {
      log.error(submitMessage.error.message);
      return false;
    }

    return true;
  }

  async function reply(
    text: string,
    cast: Cast,
    options?: {
      embeds?: CastAddBody["embeds"];
      mentions?: CastAddBody["mentions"];
      mentionsPositions?: CastAddBody["mentionsPositions"];
    }
  ) {
    const addCast = await makeCastAdd(
      {
        text,
        embeds: options?.embeds ?? [],
        embedsDeprecated: [],
        mentions: options?.mentions ?? [],
        mentionsPositions: options?.mentionsPositions ?? [],
        parentCastId: {
          fid: cast.fid,
          hash: cast.hash,
        },
      },
      dataOptions,
      casterConfig.signer
    );

    if (addCast.isErr()) {
      log.error(addCast.error.message);
      return;
    }

    const submitMessage = await casterConfig.client.submitMessage(
      addCast.value
    );

    if (submitMessage.isErr()) {
      log.error(submitMessage.error.message);
      return;
    }

    return {
      fid: addCast.value.data.fid,
      hash: submitMessage.value.hash,
      ...addCast.value.data.castAddBody,
    };
  }

  async function react(cast: Cast, type: Reaction) {
    const addReaction = await makeReactionAdd(
      {
        type: ReactionType[type.toUpperCase() as Uppercase<Reaction>],
        targetCastId: {
          fid: cast.fid,
          hash: cast.hash,
        },
      },
      dataOptions,
      casterConfig.signer
    );

    if (addReaction.isErr()) {
      log.error(addReaction.error.message);
      return false;
    }

    const submitMessage = await casterConfig.client.submitMessage(
      addReaction.value
    );

    if (submitMessage.isErr()) {
      log.error(submitMessage.error.message);
      return false;
    }

    return true;
  }

  async function removeReaction(cast: Cast, type: Reaction) {
    const removeReaction = await makeReactionRemove(
      {
        type: ReactionType[type.toUpperCase() as Uppercase<Reaction>],
        targetCastId: {
          fid: cast.fid,
          hash: cast.hash,
        },
      },
      dataOptions,
      casterConfig.signer
    );

    if (removeReaction.isErr()) {
      log.error(removeReaction.error.message);
      return false;
    }

    const submitMessage = await casterConfig.client.submitMessage(
      removeReaction.value
    );

    if (submitMessage.isErr()) {
      log.error(submitMessage.error.message);
      return false;
    }

    return true;
  }

  async function updateProfile(value: {
    pfp?: string;
    displayName?: string;
    bio?: string;
    url?: string;
    username?: string;
  }) {
    if (value.pfp) {
      const addPfp = await makeUserDataAdd(
        {
          type: UserDataType.PFP,
          value: value.pfp,
        },
        dataOptions,
        casterConfig.signer
      );

      if (addPfp.isErr()) {
        log.error(addPfp.error.message);
        return false;
      }

      const submitMessage = await casterConfig.client.submitMessage(
        addPfp.value
      );

      if (submitMessage.isErr()) {
        log.error(submitMessage.error.message);
        return false;
      }
    }

    if (value.displayName) {
      const addDisplayName = await makeUserDataAdd(
        {
          type: UserDataType.DISPLAY,
          value: value.displayName,
        },
        dataOptions,
        casterConfig.signer
      );

      if (addDisplayName.isErr()) {
        log.error(addDisplayName.error.message);
        return false;
      }

      const submitMessage = await casterConfig.client.submitMessage(
        addDisplayName.value
      );

      if (submitMessage.isErr()) {
        log.error(submitMessage.error.message);
        return false;
      }
    }

    if (value.bio) {
      const addBio = await makeUserDataAdd(
        {
          type: UserDataType.BIO,
          value: value.bio,
        },
        dataOptions,
        casterConfig.signer
      );

      if (addBio.isErr()) {
        log.error(addBio.error.message);
        return false;
      }

      const submitMessage = await casterConfig.client.submitMessage(
        addBio.value
      );

      if (submitMessage.isErr()) {
        log.error(submitMessage.error.message);
        return false;
      }
    }

    if (value.url) {
      const addUrl = await makeUserDataAdd(
        {
          type: UserDataType.URL,
          value: value.url,
        },
        dataOptions,
        casterConfig.signer
      );

      if (addUrl.isErr()) {
        log.error(addUrl.error.message);
        return false;
      }

      const submitMessage = await casterConfig.client.submitMessage(
        addUrl.value
      );

      if (submitMessage.isErr()) {
        log.error(submitMessage.error.message);
        return false;
      }
    }

    if (value.username) {
      const addUsername = await makeUserDataAdd(
        {
          type: UserDataType.USERNAME,
          value: value.username,
        },
        dataOptions,
        casterConfig.signer
      );

      if (addUsername.isErr()) {
        log.error(addUsername.error.message);
        return false;
      }

      const submitMessage = await casterConfig.client.submitMessage(
        addUsername.value
      );

      if (submitMessage.isErr()) {
        log.error(submitMessage.error.message);
        return false;
      }
    }

    return true;
  }

  return {
    cast,
    removeCast,
    reply,
    react,
    removeReaction,
    updateProfile,
  };
}
