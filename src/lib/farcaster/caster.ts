import {
  makeCastAdd,
  makeCastRemove,
  makeReactionAdd,
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
    farcasterClient: FarcasterClient;
    farcasterSigner: FarcasterSigner;
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
      embedsDeprecated?: CastAddBody["embedsDeprecated"];
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
        embedsDeprecated: options?.embedsDeprecated ?? [],
        mentions: options?.mentions ?? [],
        mentionsPositions: options?.mentionsPositions ?? [],
        parentUrl,
      },
      dataOptions,
      casterConfig.farcasterSigner
    );

    if (addCast.isErr()) {
      log.error(addCast.error.message);
      return;
    }

    const submitMessage = await casterConfig.farcasterClient.submitMessage(
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
      casterConfig.farcasterSigner
    );

    if (removeCast.isErr()) {
      log.error(removeCast.error.message);
      return false;
    }

    const submitMessage = await casterConfig.farcasterClient.submitMessage(
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
      embedsDeprecated?: CastAddBody["embedsDeprecated"];
      mentions?: CastAddBody["mentions"];
      mentionsPositions?: CastAddBody["mentionsPositions"];
    }
  ) {
    const addCast = await makeCastAdd(
      {
        text,
        embeds: options?.embeds ?? [],
        embedsDeprecated: options?.embedsDeprecated ?? [],
        mentions: options?.mentions ?? [],
        mentionsPositions: options?.mentionsPositions ?? [],
        parentCastId: {
          fid: cast.fid,
          hash: cast.hash,
        },
      },
      dataOptions,
      casterConfig.farcasterSigner
    );

    if (addCast.isErr()) {
      log.error(addCast.error.message);
      return;
    }

    const submitMessage = await casterConfig.farcasterClient.submitMessage(
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
      casterConfig.farcasterSigner
    );

    if (addReaction.isErr()) {
      log.error(addReaction.error.message);
      return false;
    }

    const submitMessage = await casterConfig.farcasterClient.submitMessage(
      addReaction.value
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
  }) {
    if (value.pfp) {
      const addPfp = await makeUserDataAdd(
        {
          type: UserDataType.PFP,
          value: value.pfp,
        },
        dataOptions,
        casterConfig.farcasterSigner
      );

      if (addPfp.isErr()) {
        log.error(addPfp.error.message);
        return false;
      }

      const submitMessage = await casterConfig.farcasterClient.submitMessage(
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
        casterConfig.farcasterSigner
      );

      if (addDisplayName.isErr()) {
        log.error(addDisplayName.error.message);
        return false;
      }

      const submitMessage = await casterConfig.farcasterClient.submitMessage(
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
        casterConfig.farcasterSigner
      );

      if (addBio.isErr()) {
        log.error(addBio.error.message);
        return false;
      }

      const submitMessage = await casterConfig.farcasterClient.submitMessage(
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
        casterConfig.farcasterSigner
      );

      if (addUrl.isErr()) {
        log.error(addUrl.error.message);
        return false;
      }

      const submitMessage = await casterConfig.farcasterClient.submitMessage(
        addUrl.value
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
    updateProfile,
  };
}
