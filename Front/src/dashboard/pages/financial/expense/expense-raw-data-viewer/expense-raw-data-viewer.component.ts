import { Component, OnInit, Input } from "@angular/core";
import * as Highcharts from 'highcharts';
import { FinancialApiService } from "../../../../services/financial-api.service";
import * as moment from 'moment';
import { Transaction } from '../../../../models/transaction.model';
import * as Enumerable from 'linq';
import { Moment } from 'moment';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { HighchartsOptions } from 'src/utils/highcharts.options';

@Component({
  selector: "app-expense-raw-data-viewer",
  templateUrl: "./expense-raw-data-viewer.component.html",
})
export class ExpenseRawDataViewerComponent extends DashboardParentComponent {
  /** 取引履歴生データ */
  @Input()
  public set transactions(value: Transaction[]) {
    this.createTableData(value);
  }

  public tableData: Transaction[];
  public totalAmount: number;

  public tableColumns = [{
    name: "日付",
    width: "110px"
  }, {
    name: "金額",
    width: "100px"
  }, {
    name: "大カテゴリ",
    width: "130px"
  }, {
    name: "中カテゴリ",
    width: "130px"
  }, {
    name: "詳細",
    width: null
  }, {
    name: "メモ",
    width: "80px"
  }];

  /**
   * 資産推移チャート更新処理
   *
   * @private
   * @param {Transaction[]} transactions 生データ
   * @returns {Promise<void>}
   * @memberof ExpenseRawDataViewerComponent
   */
  private async createTableData(transactions: Transaction[]): Promise<void> {
    this.tableData = Enumerable.from(transactions).select(x => {
      return {
        ...x,
        amount: -x.amount
      }
    }).where(x => x.amount > 0)
      .orderBy(x => x.date)
      .toArray();
    this.totalAmount = Enumerable.from(this.tableData).sum(x => x.amount);
  }
}
