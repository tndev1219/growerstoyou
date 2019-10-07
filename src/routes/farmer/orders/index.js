/**
 * Orders List
 */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Button, TextField, Dialog, DialogContent, DialogTitle, Hidden, Grid,  } from '@material-ui/core';
import moment from 'moment';

import ReactTable from 'react-table';
//component
import ContentLoader from '../../../components/global/loaders/ContentLoader';
import { api } from '../../../api';
import { showAlert } from '../../../actions/action';
import appConfig from '../../../constants/AppConfig';
import './custom.scss';


class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderHistory: null,
      dataItemCount: 0,
      pages: 1,
      page: 0,
      pageSize: 10,
      searchKey: '',
      open: false,
      selectedData: null
    };
    this.updateOrderHistory = this.updateOrderHistory.bind(this);
    this.showOrderDetailModal = this.showOrderDetailModal.bind(this);
    this.updateOrderHistory = this.updateOrderHistory.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    var payload = {
      token: this.props.token,
      farmid: this.props.profile.farminfo.farm_id,
      offset: 0,
      limit: 10,
      keyword: this.state.searchKey
    };
    var self = this;
    var orderHistory = [];

    api.POST('order/getbyfarmid', payload)
      .then(function(res) {
        if (res.data.success) {
          var dataItemCount = res.data.allcount;
          var pages = parseInt(dataItemCount/10) + 1;
          
          orderHistory = res.data.results;
          self.setState({ orderHistory, dataItemCount, pages });
        } else {
          self.setState({ orderHistory });
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.setState({ orderHistory });
        self.props.showAlert('Failed to fetch order data. Please try again later...', 'error');
      })
  }

  showOrderDetailModal(dataItem) {
    this.setState({ open: true, selectedData: dataItem });
  }

  updateOrderHistory(pageSize, page) {
    var payload = {
      token: this.props.token,
      farmid: this.props.profile.farminfo.farm_id,
      offset: pageSize*page,
      limit: pageSize,
      keyword: this.state.searchKey
    };
    var self = this;
    var orderHistory = [];

    api.POST('order/getbyfarmid', payload)
      .then(function(res) {
        if (res.data.success) {
          var dataItemCount = res.data.allcount;
          var pages = parseInt(dataItemCount/pageSize) + 1;

          for (var i = 0; i < pageSize*page; i++) {
            orderHistory.push({basketidsinfo: [{empty: 'empty'}]});
          }
          for (i = 0; i < res.data.results.length; i++) {
            var order = res.data.results[i];
            order.no = order.no + pageSize*page;
            orderHistory.push(order);
          }
          self.setState({ orderHistory, dataItemCount, pages });
        } else {
          self.setState({ orderHistory });
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.setState({ orderHistory });
        self.props.showAlert('Failed to fetch order data. Please try again later...', 'error');
      })
  }

  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  render() {

    const { orderHistory, selectedData } = this.state;
    const columns = [
      {
        maxWidth: 150,
        sortable: false,
        Header: 'Number',
        accessor: 'no'
      },
      {
        maxWidth: 150,
        sortable: false,
        Header: 'Order Id',
        accessor: 'id'
      },
      {
        sortable: false,
        Header: 'Checkout Date',
        accessor: 'created_at',
        Cell: props => {
          var date = new Date(props.original.created_at);
          return (<span className='avatar'>{moment(date).format('MMMM Do YYYY, hh:mm:ss a')}</span>);
        }
      },
      {
        maxWidth: 150,
        sortable: false,
        Header: 'price',
        accessor: 'basketsinfo',
        Cell: props => {
          var totalPrice = 0;
          for (var i = 0; i < props.value.length; i++) {
            totalPrice = totalPrice + props.value[i].buyprice*props.value[i].count;
          }
          return (<span>{totalPrice}</span>);
        }
      },
      {
        maxWidth: 150,
        sortable: false,
        Header: 'status',
        accessor: 'status',
        Cell: props => {
          if (props.original.status === 0)  {
            return (<span className='avatar'>Paid</span>);
          }
        }
      },
      {
        maxWidth: 150,
        sortable: false,
        Header: 'action',
        Cell: props => {
          return (
            <div>
              <Button className="action-btn" onClick={() => this.showOrderDetailModal(props.original)}><i className="material-icons active-color">remove_red_eye</i></Button>
            </div>
          )
        },
      }
    ]

      return (
        <Fragment>
            {orderHistory !== null ?
              <div className="inner-container">
                <div className="iron-invoice-list-wrap">
                  <div className="page-title mb-20">
                      <h4 className="mb-0">Order List</h4>
                  </div>
                  <div className="iron-shadow rounded p-sm-20 p-15 mb-30 bg-base">
                      <Grid container spacing={3} className="search-box-wrap my-0">
                        <Grid item sm={12} md={12} lg={12} className="py-0 d-sm-flex d-block">
                            <div className="search-box d-block d-sm-flex align-items-center">
                              <TextField
                                id="standard-name"
                                label="Order Id"
                                className="mb-15 ml-30"
                                value={this.state.searchKey}
                                onChange={(e) => this.setState({ searchKey: e.target.value })}
                              />
                              <Button 
                                className="button btn-primary btn-active ml-30 my-15" 
                                onClick={() => {
                                  this.setState({ orderHistory: null });
                                  this.updateOrderHistory(this.state.pageSize, 0);
                                }}
                              >
                                search
                              </Button>
                            </div>
                        </Grid>
                      </Grid>
                  </div>
                  <div className="iron-shadow rounded p-20 bg-base">
                    <ReactTable
                      data={orderHistory}
                      columns={columns}
                      pages={this.state.pages}
                      page={this.state.page}
                      pageSize={this.state.pageSize}
                      onPageChange={(page) => {
                        this.setState({ page, orderHistory: null });
                        this.updateOrderHistory(this.state.pageSize, page);
                      }}
                      onPageSizeChange={(pageSize, page) => {
                        var pages = parseInt(this.state.dataItemCount/pageSize) + 1;
                        this.setState({ pages,  pageSize, page: 0, orderHistory: null });
                        this.updateOrderHistory(pageSize, 0);
                      }}
                    />
                  </div>
                </div>

                <Dialog
                  className="order-detail-dialog"
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="form-dialog-title"
                  disableBackdropClick
                >
                  <DialogTitle id="form-dialog-title">Order Detail</DialogTitle>
                  <DialogContent>
                    <Hidden only={['xs']}>
                      <Grid container spacing={5}>
                        <Grid item sm={1} md={1} lg={1} xl={1}></Grid>
                        <Grid item sm={2} md={2} lg={2} xl={2} className="order-detail-title">IMAGE</Grid>
                        <Grid item sm={2} md={2} lg={2} xl={2} className="order-detail-title">PRODUCT</Grid>
                        <Grid item sm={2} md={2} lg={2} xl={2} className="order-detail-title">PRICE</Grid>
                        <Grid item sm={2} md={2} lg={2} xl={2} className="order-detail-title">QUANTITY</Grid>
                        <Grid item sm={2} md={2} lg={2} xl={2} className="order-detail-title">TOTAL</Grid>
                        <Grid item sm={1} md={1} lg={1} xl={1} className="order-detail-title"></Grid>
                      </Grid>
                    </Hidden>
                    <hr></hr>
                    {selectedData && selectedData.basketsinfo.map((cart, key) => (
                      <div key={key}>
                        <Grid container spacing={5} justify="center" alignItems="center">
                          <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>                      
                          </Grid>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>                      
                            <img src={`${appConfig.S3_BUCKET}${cart.product.images[0]}`} alt='fruit' />                      
                          </Grid>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2} className="order-detail-item">
                            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                              <h4>Product Name:&nbsp;</h4>
                            </Hidden>
                            <h4>{cart.product.name}</h4>
                          </Grid>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2} className="order-detail-item">
                            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                              <h4>Price:&nbsp;</h4>
                            </Hidden>
                            <h4>${cart.buyprice.toFixed(2)}</h4>
                          </Grid>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2} className="order-detail-item">
                            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                              <h4>Quantity:&nbsp;</h4>
                            </Hidden>
                            <h4>{cart.count}/{cart.buyunit}</h4>
                          </Grid>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2} className="order-detail-item">
                            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                              <h4>Total Price:&nbsp;</h4>
                            </Hidden>
                            <h4>${(cart.buyprice*cart.count).toFixed(2)}</h4>
                          </Grid>
                          <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>
                          </Grid>
                        </Grid>
                        <hr></hr>
                      </div>
                    ))}

                    <Grid container className="mt-20" style={{maxWidth: '400px', margin: 'auto'}}>
                      <h3>Total</h3>
                      {[["Subtotal", selectedData && selectedData.productcost], ["Delivery Cost", selectedData && selectedData.shipmentcost], ["Tax", selectedData && '0'], ["Total", selectedData && selectedData.paymentcost]].map((value, key) => (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={key}>
                          <Grid container>
                            <Grid item xs={9} sm={9} md={9} lg={9} xl={9} style={{paddingLeft: '20px'}}>
                              <span>{value[0]}</span>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={{paddingLeft: '20px'}}>
                              <span>${value[1]}</span>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <hr></hr>
                            </Grid>
                          </Grid>
                        </Grid>                      
                      ))}
                    </Grid>

                    <div className="pt-25 text-right">
                      <Button variant="contained" className="btn-active text-white text-capitalize mb-15" onClick={this.handleClose}>Close</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              :
              <ContentLoader />
            }
        </Fragment>
      )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null
  }), { showAlert })(OrderList);