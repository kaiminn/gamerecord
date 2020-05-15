import { Table, Column, Model, DataType } from "sequelize-typescript";
@Table({ timestamps: false })
export default class GameRecords extends Model<GameRecords> {
  @Column(DataType.STRING)
  memberID: string;

  @Column(DataType.STRING)
  gameID: string;

  @Column(DataType.STRING)
  seatID: string;

  @Column(DataType.BIGINT)
  roundCount: string;

  @Column(DataType.BIGINT)
  totalBet: number;

  @Column(DataType.BIGINT)
  totalWin: number;

  @Column(DataType.BIGINT)
  winLost: number;

  @Column(DataType.STRING)
  winType: string;

  @Column(DataType.BOOLEAN)
  debug: boolean;

  @Column(DataType.STRING)
  gameInfo: string;

  @Column(DataType.DATE)
  playDateTime: Date;

  @Column(DataType.STRING)
  agentID: string;

  @Column(DataType.STRING)
  currencyType: string;

  @Column(DataType.STRING)
  gameType: string;
}
