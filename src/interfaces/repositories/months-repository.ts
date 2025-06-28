import { Month } from "../entities";

export default interface IMonthsRepository {
  findAll(): Promise<Month[] | null>;
  findByValue(month: string): Promise<Month | null>
  create(month: Month): Promise<Month>;
}   