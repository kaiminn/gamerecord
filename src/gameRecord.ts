import { api, id, log, redis } from "actionhero";
import { Redis } from "ioredis";
import { Sequelize } from "sequelize-typescript";
import * as _ from "lodash";
import { Op } from "sequelize";
import * as Redlock from "redlock";
import gameRecord from "./models/gameRecord";

interface IRediskey {
  LockDefaultMs: number;
  KeyGameRecordTODOList: string;
  KeyGameRecordDoingList: string;
  // GameRecord Publish channel
  GameRecordPubChannel: string;
  // GameRecord Publish MessageID
  GameRecordMessageID: string;
  GameRecordLockKey: string;
}

export class GameRecord {
  rediskey: IRediskey;

  redisclient: Redis;

  saltRounds: number;

  sequelize: Sequelize;

  name: string;

  private redlock: Redlock;

  private locker = new Map();

  constructor(gameRecordConfig) {
    const { PubChannel } = gameRecordConfig;
    this.rediskey = {
      KeyGameRecordTODOList: `GameRecord-List-TODO`,
      KeyGameRecordDoingList: `GameRecord-List-Doing`,
      GameRecordPubChannel: PubChannel,
      GameRecordMessageID: `GameRecord-MessageID`,
      GameRecordLockKey: `GameRecord-Lock-Key`,
      LockDefaultMs: 1000,
    };
    this.name = "GameRecord";
    const redislock = api.redis.clients.client;

    this.redlock = new Redlock([redislock]);
  }

  async gameRecord(params: {
    memberID: string;
    gameID: string;
    gameName: string;
    seatID: string;
    roundCount: string;
    totalBet: number;
    totalWin: number;
    winLost: number;
    winType: string;
    debug: boolean;
    gameInfo: string;
    playDateTime: string;
    agentID: string;
    currencyType: string;
    gameType: string;
    tags?: Array<string>;
    subtotalWin?: number;
  }): Promise<boolean> {
    const redisClient = api.redis.clients.client;
    const {
      memberID,
      gameID,
      gameName,
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
      subtotalWin,
    } = params;

    const record = {
      memberID,
      gameID,
      gameName,
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
      currencyType: currencyType || "TWD",
      gameType: gameType || "SlotGame",
      subtotalWin,
      tags,
    };

    const gameRecordValue = JSON.stringify(record);
    api.log(
      `${this.name}(gameRecord) redis method: rpush key: ${this.rediskey.KeyGameRecordTODOList} data: ${gameRecordValue}`
    );
    await redisClient.rpush(
      this.rediskey.KeyGameRecordTODOList,
      gameRecordValue
    );

    // publish gameRecord
    await this.notifyGameRecord(record);

    return true;
  }

  /**
   * task拿取工作項目
   *
   * @returns {Promise<string>}
   * @memberof GameRecord
   */
  async writeGameRecordToDb(): Promise<boolean> {
    const redisClient = api.redis.clients.client;
    let checkRename = true;
    if (!(await this.lockKey(this.rediskey.KeyGameRecordDoingList))) {
      return true;
    }
    try {
      await redisClient.renamenx(
        this.rediskey.KeyGameRecordTODOList,
        this.rediskey.KeyGameRecordDoingList
      );
      const GameRecordList = await redisClient.lrange(
        this.rediskey.KeyGameRecordDoingList,
        0,
        -1
      );
      const insertData = [];
      _.map(GameRecordList, (value, key) => {
        const taskData = JSON.parse(value);
        insertData.push(taskData);
      });
      api.log(
        `${this.name}(writeGameRecordToDb) write to db data:${insertData}`
      );
      await gameRecord.bulkCreate(insertData).catch((e) => {
        api.log(`${this.name}(writeGameRecordToDb) db error`, "error", e);
        checkRename = false;
      });
      if (checkRename) {
        await redisClient.del(this.rediskey.KeyGameRecordDoingList);
      }
    } catch (error) {
      return false;
    } finally {
      await this.unlockKey(this.rediskey.KeyGameRecordDoingList);
    }

    // const checkNameReal = await redisClient.keys(
    //   this.rediskey.KeyGameRecordDoingList
    // );
    /**
     * 判斷是否有要處理資料
     */
    // if (checkNameReal.length !== 0) {

    // }

    return checkRename;
  }

  async getPlayRecord(
    param: {
      memberID: string;
      seatID?: string;
      roundCount?: string;
      gameID?: string;
      agentID?: string;
      startDateTime?: string;
      endDateTime?: string;
      winType?: string;
      gameType?: string;
      gameInfo?: string;
    },
    limit: number,
    offset: number
  ): Promise<{}> {
    const searchCondition = {
      memberID: param.memberID,
      seatID: param.seatID,
      roundCount: param.roundCount,
      gameID: param.gameID,
      agentID: param.agentID,
      playDateTime: undefined,
      winType: param.winType,
      gameType: param.gameType,
      gameInfo: param.gameInfo
        ? { [Op.like]: `%${param.gameInfo}%` }
        : undefined,
    };
    const { startDateTime, endDateTime } = param;
    if (startDateTime !== undefined && endDateTime !== undefined) {
      searchCondition.playDateTime = {
        [Op.gte]: startDateTime,
        [Op.lte]: endDateTime,
      };
    }

    let count;
    try {
      count = await gameRecord.findAndCountAll({
        where: _.pickBy(searchCondition, _.identity),
        order: [["playDateTime", "DESC"]],
        offset,
        limit,
      });
      api.log(
        `${this.name}(getPlayRecord) dbTableName# gameRecord action: findAndCountAll value: ${count.count}`
      );
    } catch (e) {
      api.log(
        `${this.name}(getPlayRecord) dbTableName# gameRecord action: findAndCountAll error: ${e} !!!`,
        "error"
      );
    }
    return {
      items: count.rows,
      total: count.count,
    };
  }

  async notifyGameRecord(_gameRecord: {}): Promise<void> {
    // 發佈 RedisPubSub GameRecord 資訊
    const pubChannel = this.rediskey.GameRecordPubChannel;

    try {
      const { client } = api.redis.clients;
      const keyMessageID = this.rediskey.GameRecordMessageID;
      // 取得 messageID
      const messageID = await client.incrby(keyMessageID, 1);

      // 產生 Message
      const message = {
        messageType: pubChannel,
        serverId: id,
        serverToken: api.config.general.serverToken,
        messageID,
        gameRecord: _gameRecord,
      };

      log(`${this.name} notifyGameRecord() message=${JSON.stringify(message)}`);
      // 發佈
      await redis.publish(message);
    } catch (error) {
      // log error
      log(`${this.name} notifyGameRecord() error=${error} Fail!!`, "error");
    }
  }

  // 偉大的上鎖
  async lockKey(keyOne: string): Promise<boolean> {
    const lockKey = `${this.rediskey.GameRecordLockKey}-${keyOne}`;
    try {
      const lock = await this.redlock.lock(
        lockKey,
        this.rediskey.LockDefaultMs
      );
      this.locker.set(lockKey, lock);
    } catch (err) {
      api.log(`${this.name} lockKey(${lockKey}) fail`, "error");
      return false;
    }
    return true;
  }

  // 偉大的解鎖
  async unlockKey(keyOne: string): Promise<boolean> {
    const unlockKey = `${this.rediskey.GameRecordLockKey}-${keyOne}`;
    const lock: Redlock.Lock = this.locker.get(unlockKey);
    if (lock === undefined) {
      api.log(`${this.name} unlockKey(${unlockKey}) fail`, "error");
      return false;
    }
    await lock.unlock();
    return true;
  }
}
