import { Redis } from "ioredis";
import { Process, specHelper, utils, Api } from "actionhero";
import { GameRecord as GameRecordService } from "../../src/gameRecord";
import gameRecord from "../../src/models/gameRecord";

const actionhero = new Process();
let api: Api;

beforeAll(async () => {
  api = (await actionhero.start()) as Api;
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

describe("gameRecord publish", () => {
  test("gameRecoed Test ", async () => {
    const gameRecords = [
      {
        agentID: "mabu777",
        memberID: "NAK",
        gameID: "mabu",
        gameName: "Cracker",
        seatID: "99",
        roundCount: 99,
        totalBet: 99,
        totalWin: 99,
        winLost: 99,
        winType: "NG",
        debug: true,
        gameInfo: "string",
        playDateTime: "2019/11/12 12:00:00",
        currencyType: "TWD",
        gameType: "SlotGame"
      },
      {
        agentID: "mabu777",
        memberID: "NAK",
        gameID: "mabu",
        gameName: "Cracker",
        seatID: "99",
        roundCount: 100,
        totalBet: 99,
        totalWin: 99,
        winLost: 99,
        winType: "FG",
        debug: true,
        gameInfo: "string",
        playDateTime: "2019/11/12 12:01:00",
        currencyType: "TWD",
        gameType: "SlotGame"
      }
    ];

    // 訂閱
    // eslint-disable-next-line prefer-destructuring
    const gameRecordservice: GameRecordService = api.gameRecord;
    const pubChannel = gameRecordservice.rediskey.GameRecordPubChannel;
    const msgRecords = [];

    api.redis.subscriptionHandlers[pubChannel] = (message): void => {
      api.log(`subscription message = ${JSON.stringify(message)}`);
      msgRecords.push(message);
    };

    /**
     * 第一筆資料
     */
    let result = await specHelper.runAction("gameRecord", gameRecords[0]);
    expect(result.result).toBeTruthy();
    await utils.sleep(100);

    /**
     * 要收到 消息發佈
     */
    expect(msgRecords).toHaveLength(1);
    expect(msgRecords[0].messageID).toEqual(1);
    expect(gameRecords[0]).toMatchObject(msgRecords[0].gameRecord);

    /**
     * 第二筆資料
     */
    result = await specHelper.runAction("gameRecord", gameRecords[1]);
    expect(result.result).toBeTruthy();
    await utils.sleep(100);

    /**
     * 要收到 消息發佈
     */
    expect(msgRecords).toHaveLength(2);
    expect(msgRecords[1].messageID).toEqual(2);
    expect(gameRecords[1]).toMatchObject(msgRecords[1].gameRecord);
  });
});
