import { Action, api } from "actionhero";
import { GameRecord } from "../gameRecord";

export class GameRecordAction extends Action {
  constructor() {
    super();
    this.name = "gameRecord";
    this.description = "an actionhero GameRecord";
    this.outputExample = {};
    this.inputs = {
      memberID: {
        required: true
      },
      gameName: {
        required: true
      },
      gameID: {
        required: true
      },
      seatID: {
        required: true
      },
      roundCount: {
        required: true
      },
      totalBet: {
        required: true
      },
      totalWin: {
        required: true
      },
      winLost: {
        required: true
      },
      winType: {
        required: true
      },
      debug: {
        required: true
      },
      gameInfo: {
        required: true
      },
      playDateTime: {
        required: true
      },
      agentID: {
        required: true
      },
      currencyType: {
        required: false
      },
      gameType: {
        required: false
      },
      tags: {
        required: false
      },
      subtotalWin: {
        required: false
      }
    };
  }

  async run({ params, response }): Promise<void> {
    // your logic here
    const {
      agentID,
      memberID,
      gameName,
      gameID,
      seatID,
      roundCount,
      totalBet,
      totalWin,
      winLost,
      winType,
      debug,
      gameInfo,
      playDateTime,
      currencyType,
      gameType,
      subtotalWin,
      tags
    } = params;

    // eslint-disable-next-line prefer-destructuring
    const gameRecord: GameRecord = api.gameRecord;

    const successCheck = await gameRecord.gameRecord({
      memberID,
      gameName,
      gameID,
      seatID,
      roundCount,
      totalBet,
      totalWin,
      winLost,
      winType,
      debug,
      gameInfo,
      playDateTime,
      agentID,
      currencyType,
      gameType,
      tags,
      subtotalWin
    });
    response.result = successCheck;
  }
}
