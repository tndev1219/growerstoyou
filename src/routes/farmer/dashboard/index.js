/**
 * reports
 */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import TransactionList from '../../../components/widgets/TransactionList';
import ContentLoader from '../../../components/global/loaders/ContentLoader';

//component
import BuySellChart from '../../../components/widgets/BuySellChart';

export default class InvoiceList extends Component {
   state = {
      anchorEl: null,
      transactionList: [1,2,3],
      transferReport: [1,2,3],
      expenseCategory: [1,2,3],
      allChartData: [1,2,3],
   };

   componentDidMount() {
      this.getTransactionListData();
      this.getTransferReportData();
      this.getExpenseCategoryData();
      this.getAllChartData();
   }

   //get transaction data
   getTransactionListData() {
   }
   //get transfer report data
   getTransferReportData() {
   }
   //get expense category data
   getExpenseCategoryData() {
   }
   //get chart data
   getAllChartData() {
   }

   render() {
      const { transactionList, transferReport, expenseCategory, allChartData } = this.state;
      return (
         <Fragment>
            {transactionList !== null && transferReport !== null && expenseCategory !== null && allChartData !== null ?
               <div className="inner-container">
                  <div className="iron-reports-wrap">
                     <BuySellChart data={allChartData} />
                     <div className="iron-shadow rounded p-20 bg-base">
                        <TransactionList transactionList={transactionList} transferReport={transferReport} expenseCategory={expenseCategory} />
                     </div>
                  </div>
               </div>
               :
               <ContentLoader />
            }
         </Fragment>
      )
   }
}