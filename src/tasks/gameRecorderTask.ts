import { Task, api, log } from "actionhero";
import { task } from "actionhero/dist/modules/task";
import { GameRecord } from "../gameRecord";

export class GameRecorderTask extends Task {
  constructor() {
    super();
    this.name = "gameRecorderTask";
    this.description = "an actionhero task";
    this.frequency = 5000;
    this.queue = "GameRecord";
    this.middleware = [];
  }

  async run(): Promise<boolean> {
    api.log("gameRecorderTask run");
    // eslint-disable-next-line prefer-destructuring
    const gameRecord: GameRecord = api.gameRecord;
    return gameRecord.writeGameRecordToDb();
  }
}
