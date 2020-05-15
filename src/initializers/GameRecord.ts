import { Initializer, api } from "actionhero";

import { GameRecord } from "../gameRecord";

export class GameRecordInitializer extends Initializer {
  constructor() {
    super();
    this.name = "gameRecord";
    this.loadPriority = 1000;
    this.startPriority = 1000;
    this.stopPriority = 1000;
  }

  async initialize(config): Promise<void> {
    const { gameRecord } = config;
    api.gameRecord = new GameRecord(gameRecord);
    // api.gameRecord.initSequelize();
    // api.log(`${this.name} run and sequelize new`);
  }

  // async start(): Promise<void> {}

  // async stop(): Promise<void> {}
}
