import { Action, api, ActionProcessor, config } from "actionhero";
import * as _ from "lodash";
import { GameRecord } from "../gameRecord";

export class QueryGameRecord extends Action {
  constructor() {
    super();
    this.name = "queryGameRecord";
    this.description = "an actionhero queryGameRecord";
    this.outputExample = {
      data: {
        items: [],
        total: 100,
      },
    };
    this.inputs = {
      memberID: {
        required: false,
      },
      gameID: {
        required: false,
      },
      date: {
        required: false,
      },
      page: {
        required: true,
      },
      limit: {
        required: true,
      },
      seatID: {
        required: false,
      },
      roundCount: {
        required: false,
      },
      agentID: {
        required: false,
      },
      winType: {
        required: false,
      },
      gameType: {
        required: false,
      },
      gameInfo: {
        required: false,
      },
    };
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params } = data;
    const {
      page,
      gameID,
      memberID,
      date,
      seatID,
      roundCount,
      agentID,
      winType,
      gameType,
      gameInfo,
    } = params;
    let { limit } = params;
    let startDateTime;
    // eslint-disable-next-line no-underscore-dangle
    let endDateTime;
    if (date) {
      [startDateTime, endDateTime] = date;
    }
    const offset = page;
    const { limitMax } = config.gameRecord;
    if (limit >= limitMax) limit = limitMax;

    // limit => 每一頁幾筆資料  offset =>跳過多少筆
    // eslint-disable-next-line prefer-destructuring
    const gameRecord: GameRecord = api.gameRecord;
    const successCheck = await gameRecord.getPlayRecord(
      {
        memberID,
        gameID,
        seatID,
        roundCount,
        startDateTime,
        endDateTime,
        agentID,
        winType,
        gameType,
        gameInfo,
      },
      _.toNumber(limit),
      (_.toNumber(offset) - 1) * _.toNumber(limit)
    );

    response.data = successCheck;
    response.code = 20000;
  }
}
