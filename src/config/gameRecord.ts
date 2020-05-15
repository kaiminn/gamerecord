export const DEFAULT = {
  gameRecord: (config) => {
    let JWTokenKEY = "MabuTest0123";
    const defaultAgentID = "mabu777";
    // GameRecord Publish channel
    const PubChannel = "GameRecord-Channel";

    // JWT 私鑰
    if (process.env.JWToken_KEY)
      JWTokenKEY = process.env.JWToken_KEY.toString();

    return {
      limitMax: 500,
      JWTokenKEY,
      defaultAgentID,
      PubChannel,
    };
  },
};

export const test = {
  gameRecord: (config) => {
    return {
      limitMax: 50,
      JWTokenDisable: true,
    };
  },
};

export const production = {};
