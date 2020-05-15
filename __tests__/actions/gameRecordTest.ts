import { Redis } from "ioredis";
import { Process, specHelper, cache, config, action } from "actionhero";
import gameRecord from "../../src/models/gameRecord";

const actionhero = new Process();
let api;

beforeAll(async () => {
  api = await actionhero.start();
});

afterAll(async () => {
  const redis: Redis = api.redis.clients.client;
  await redis.flushdb();
  await api.cache.clear();
  await actionhero.stop();
});

afterEach(async () => {
  await gameRecord.destroy({ where: {} });
});

describe("gameRecoed Test", () => {
  test("gameRecoed Test ", async () => {
    /**
     * 少給資料
     */
    let result = await specHelper.runAction("gameRecord", {
      memberID: "NAK",
      gameID: "mabu",
      gameName: "Cracker",
      seatID: "99",
      roundCount: 99,
      totalBet: 99,
      winLost: 99,
      winType: "FG",
      debug: true,
      gameInfo: "string",
      agentID: "mma",
      playDateTime: "2019/11/11 11:11:31"
    });
    expect(result.result).not.toBeTruthy();
    /**
     * 正確資料
     */
    result = await specHelper.runAction("gameRecord", {
      memberID: "NAK",
      gameID: "mabu",
      gameName: "Cracker",
      seatID: "99",
      roundCount: 99,
      totalBet: 99,
      totalWin: 99,
      winLost: 99,
      winType: "FG",
      debug: true,
      gameInfo: "string",
      agentID: "mma",
      playDateTime: "2019/11/12 12:00:00"
    });
    expect(result.result).toBeTruthy();
    /**
     * 要寫db有資料
     */
    result = await specHelper.runTask("gameRecorderTask", {});
    api.log("gameRecorderTask", result);
    expect(result).toBeTruthy();
    /**
     * 要寫db無資料
     */
    result = await specHelper.runTask("gameRecorderTask", {});
    expect(result).not.toBeTruthy();

    result = await specHelper.runAction("queryGameRecord", {
      memberID: "NAK",
      limit: 20,
      page: 1,
      date: ["2019/11/10 11:16:31", "2019/11/13 11:16:31"],
      agentID: "mma"
    });
    const { items, total } = result.data;
    expect(items[0].memberID).toBe("NAK");
    expect(items[0].gameID).toBe("mabu");
    expect(items[0].seatID).toBe("99");
    expect(items[0].roundCount).toBe("99");
    expect(items[0].agentID).toBe("mma");
    expect(total).toBe(1);
  });
});
