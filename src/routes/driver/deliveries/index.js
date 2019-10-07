/**
 * Invoices List
 */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ReactTable from 'react-table';
//component
import ContentLoader from '../../../components/global/loaders/ContentLoader';
import ConfirmationBox from './components/ConfirmationBox';
import InvoicePopup from './components/InvoicePopup';

export default class InvoiceList extends Component {
   constructor(props) {
      super(props);
      this.confirmationDialog = React.createRef();
   }

   state = {
      name: '',
      invoiceList: [{
         count:1,
         id:1,
         buyer:"test",
         date:"2019-02-25",
         price:"$20",
         payment_type:"Paypal",
         status:"canceled"
      },{
         count:1,
         id:1,
         buyer:"test",
         date:"2019-02-25",
         price:"$120",
         payment_type:"Card",
         status:"canceled"
      },{
         count:1,
         id:1,
         buyer:"test3",
         date:"2019-02-21",
         price:"$20",
         payment_type:"Card",
         status:"pending"
      },{
         count:1,
         id:1,
         buyer:"test2",
         date:"2013-02-25",
         price:"$23",
         payment_type:"Card",
         status:"purchased"
      }],
      searchClientText: '',
   };

   allUserInvoice = [];     //all clients data

   handleChange = name => event => {
      this.setState({ [name]: event.target.value });
   };
   componentDidMount() {
      this.getInvoiceData();
   }

   //get invoice list
   getInvoiceData() {
   }
   onSearchClient(searchText) {
      if (searchText === '') {
         this.setState({
            ...this.state,
            invoiceList: this.allUserInvoice,
            searchClientText: searchText,
         });
      } else {
         let searchClients = this.allUserInvoice.filter((invoice) => {
            if (searchText === searchText.toLowerCase()) {
               let buyer = invoice.buyer.toLowerCase().indexOf(searchText.toLowerCase()) > -1
               return (
                  buyer
               )
            }
            else {
               let buyer = invoice.buyer.toUpperCase().indexOf(searchText.toUpperCase()) > -1
               return (
                  buyer
               )
            }
         });
         this.setState({
            ...this.state,
            searchClientText: searchText,
            invoiceList: searchClients
         })
      }
   }

   onDeleteCartItem(data) {
      this.data = data;
      this.confirmationDialog.current.openDialog();
   }

   deleteCartItem(popupResponse) {
      if (popupResponse) {
         let deleteItem = this.data;
         let newData = this.state.invoiceList.filter((invoiceListItem) => invoiceListItem.id !== deleteItem.id)
         this.setState({
            invoiceList: newData
         })
      }
   }

   render() {

      const { invoiceList } = this.state;
      const columns = [
         {
            maxWidth: 75,
            Header: 'No.',
            accessor: 'count'
         },
         {
            sortable: false,
            Header: 'Invoice Id',
            accessor: 'id',

         },
         {
            minWidth: 160,
            Header: 'Buyer',
            accessor: 'buyer',
         },
         {
            Header: 'Date',
            accessor: 'date',
         },
         {
            Header: 'Price',
            accessor: 'price',
         },
         {
            Header: 'Payment',
            accessor: 'payment_type',
         },
         {
            Header: 'Status',
            accessor: 'status',
         },
         {
            Header: 'action',
            accessor: 'action',
            Cell: props => {
               return (
                  <div>
                     <InvoicePopup />
                     <Button
                        className="action-btn"
                        onClick={() => this.onDeleteCartItem(props.original)}
                     >
                        <i className="material-icons active-color">delete</i>
                     </Button>
                  </div>
               )
            },
         }
      ]
      return (
         <Fragment>
            {invoiceList !== null ?
               <div className="inner-container">
                  <div className="iron-invoice-list-wrap">
                     <div className="page-title mb-20">
                        <h4 className="mb-0">Delivery List</h4>
                     </div>
                     <div className="iron-shadow rounded p-sm-20 p-15 mb-30 bg-base">
                        <Grid container spacing={3} className="search-box-wrap my-0">
                           <Grid item sm={12} md={12} lg={12} className="py-0 d-sm-flex d-block">
                              <div className="search-box d-block d-sm-flex align-items-center">
                                 <TextField
                                    id="standard-name"
                                    label="Search Delivery"
                                    className="my-0 iron-form-input-wrap mr-5"
                                    fullWidth
                                    value={this.state.searchClientText}
                                    onChange={(e) => this.onSearchClient(e.target.value)}
                                 />
                              </div>
                           </Grid>
                        </Grid>
                     </div>
                     <div className="iron-shadow rounded p-20 bg-base">
                        <ReactTable
                           data={invoiceList}
                           columns={columns}
                           minRows={6}
                           defaultPageSize={10}
                        />
                     </div>
                  </div>
                  <ConfirmationBox
                     ref={this.confirmationDialog}
                     onConfirm={(res) => this.deleteCartItem(res)}
                  />
               </div>
               :
               <ContentLoader />
            }
         </Fragment>
      )
   }
}