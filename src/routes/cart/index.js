import React, { Fragment } from 'react';
import { connect } from "react-redux";
import Features from '../../components/widgets/Features';
import { Button, Grid, Hidden, Checkbox } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MostSellingProducts from '../../components/widgets/MostSellingProducts';
import CustomizedInputs from '../../components/global/forms/CustomizedInputs';
import { api } from '../../api';
import { showAlert, updateCartData, updateProductQuantity } from '../../actions/action';
import appConfig from '../../constants/AppConfig';
import authAction from "../../redux/auth/actions";
import ConfirmationDialog from '../../components/global/confirmation-popup';

const { waiting } = authAction;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.confirmationDialog = React.createRef();
    this.state = {
      fields: [],
      total: 0,
      subtotal: 0,
      deliveryCost: 0,
      tax: 0
    };
    this.onDeleteCartItem = this.onDeleteCartItem.bind(this);
    this.handleCartUpdate = this.handleCartUpdate.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.proceedToCheckout = this.proceedToCheckout.bind(this);
  }

  onDeleteCartItem(cartItem) {
    this.cartItem = cartItem;
    this.confirmationDialog.current.openDialog();
  }

  deleteCartItem(popupResponse) {
    if (popupResponse) {
      var payload = {
        token: this.props.token,
        id: this.cartItem.id
      };
      var self = this;
      this.props.waiting(true);

      api.POST('basket/delete', payload)
        .then(function(res) {
          if (res.data.success) {
            var data = {
              token: self.props.token,
              userid: self.props.profile && self.props.profile.id
            }
            self.props.updateCartData(data);
          } else {
            self.props.showAlert(res.data.message, 'error');
          }
          self.props.waiting(false);
        })
        .catch(function(err) {
          self.props.waiting(false);
          self.props.showAlert('Failed to delete to cart item. Please try again later...', 'error');
        })
    }
  }

  handleCartUpdate(type, cart) {
    this.props.waiting(true);
    var newAmount = null;
    if (type === 'plus') {
      if (cart.count > cart.product.count) {
        this.props.showAlert('Amount goes beyond total quantity.', 'error');
        this.props.waiting(false);
        return true;
      } else {
        newAmount = cart.count + 1;
      }      
    } else {
      if (cart.count > 1) {
        newAmount = cart.count - 1;
      } else {
        this.props.waiting(false);
        return true;
      }
    }
    var payload = {
      token: this.props.token,
      id: cart.id,
      count: newAmount
    };
    var self = this;

    api.POST('basket/update', payload)
      .then(function(res) {
        if (res.data.success) {
          self.props.updateProductQuantity(res.data.result);
          self.updateMyQuantity(self.state.fields);
        } else if (res.data.errcode === 419) {
          self.props.showAlert('Amount goes beyond total quantity.', 'error');
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
        self.props.waiting(false);
      })
      .catch(function(err) {
        self.props.showAlert('Failed to update cart. Please try again later...', 'error');
        self.props.waiting(false);
      })
  }

  handleCheck(e) {
    var fields = this.state.fields;
    if (e.target.checked) {
      fields.push(parseInt(e.target.name));
    } else {
      fields.pop(parseInt(e.target.name));
    }

    this.updateMyQuantity(fields);

    this.setState({ fields });
  }

  proceedToCheckout() {
    if (this.state.fields.length === 0) {
      this.props.showAlert('Please selecte the products...', 'error');
      return false;
    }
    
    var arrStr = encodeURIComponent(JSON.stringify(this.state.fields));
    this.props.history.push(`/check-out?cart=${arrStr}`);
  }

  updateMyQuantity(fields) {
    var { cartData } = this.props;
    var total = 0;
    var subtotal = 0;
    var deliveryCost = 0;
    var tax = 0;
    for (var i = 0; i < fields.length; i++) {
      for (var j = 0; j < cartData.length; j++) {
        if (cartData[j].id === parseInt(fields[i])) {
          subtotal = subtotal + cartData[j].product.price*cartData[j].count;
        }
      }
    }

    if (subtotal !== 0) {
      deliveryCost = 10;
      tax = 3;
      total = subtotal + deliveryCost + tax;
      this.setState({ total, subtotal, deliveryCost, tax });
    }
  }
  
  render() {
    var { cartData } = this.props;
    var { total, subtotal, deliveryCost, tax } = this.state;
    
    return(
      <Fragment>
        <div className="iron-registration-page-wrap page-pad">
          {cartData && cartData.length !== 0 ? 
            <form>
              <div className="iron-gogreen-wrapper section-pad">
                <div className="iron-sec-heading-wrap heading-font-v2 text-center">
                  <div className="heading-title mb-40">
                    <h2>Go Green! Go Organic!</h2>
                  </div>
                </div>
              </div>
              <div className="mb-40 mt-40">
                <div className="container cart-container">
                  <Hidden only={['sm', 'xs']}>
                    <Grid container spacing={5} className="cart-header">
                      <Grid item md={2} lg={2} xl={2}></Grid>
                      <Grid item md={2} lg={2} xl={2}>IMAGE</Grid>
                      <Grid item md={2} lg={2} xl={2}>PRODUCT</Grid>
                      <Grid item md={2} lg={2} xl={2}>PRICE</Grid>
                      <Grid item md={2} lg={2} xl={2}>QUANTITY</Grid>
                      <Grid item md={1} lg={1} xl={1}>TOTAL</Grid>
                      <Grid item md={1} lg={1} xl={1}></Grid>
                    </Grid>
                  </Hidden>
                  <hr></hr>
                  {cartData.map((cart, key) => (
                    <div key={key}>
                      <Grid container spacing={5} justify="center" alignItems="center">
                        <Grid item xs={12} sm={1} md={1} lg={1} xl={1} className="center-content">                      
                          <Checkbox className="checkbox-color" name={String(cart.id)} onChange={this.handleCheck} />
                        </Grid>
                        <Grid item xs={12} sm={5} md={3} lg={3} xl={3}>                      
                            <img src={`${appConfig.S3_BUCKET}${cart.product.images[0]}`} alt='fruit' className="cart-img"/>                      
                        </Grid>
                        <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
                          <h4 className="center-content">{cart.product.name}</h4>
                          <div className="cart-item center-content">
                            <h5>Vendor:&nbsp;</h5>
                            <span style={{marginTop: 5}}>{cart.farm && cart.farm.name}'s Farm</span>
                          </div>
                        </Grid>
                        <Grid item xs={5} sm={3} md={2} lg={2} xl={2} className="center-content">
                          <h4>${cart.product.price.toFixed(2)}</h4>
                        </Grid>
                        <Grid item xs={5} sm={3} md={2} lg={2} xl={2} className="center-content">
                          <div className="cart-item center-content">
                            <h4>{cart.count}</h4>
                            <p>&nbsp;/{cart.product.unit}</p>
                          </div>
                          <div className="cart-amount-btn">
                            <Button className="increase-btn btn-disabled" disabled={this.props.wait} onClick={() => this.handleCartUpdate('plus', cart)}>+</Button>
                            <Button className="decrease-btn btn-disabled" disabled={this.props.wait} onClick={() => this.handleCartUpdate('minus', cart)}>-</Button>
                          </div>
                        </Grid>
                        <Grid item xs={5} sm={3} md={1} lg={1} xl={1} className="center-content">
                          <h4>${(cart.product.price*cart.count).toFixed(2)}</h4>
                        </Grid>
                        <Grid item xs={5} sm={2} md={1} lg={1} xl={1} className="center-content">
                          <Button
                            className="action-btn cart-del-btn btn-disabled"
                            onClick={() => this.onDeleteCartItem(cart)}
                            disabled={this.props.wait}
                          >
                            <i className="material-icons active-color">delete</i>
                          </Button>
                        </Grid>
                      </Grid>
                      <hr></hr>
                    </div>
                  ))}
                  <Grid container spacing={4} alignItems="flex-end">
                    <Grid item xs={12} sm={5} md={3} lg={3} xl={3}>
                      <CustomizedInputs placeholder="COUPON CODE" isTextAlignCenter={true}/>
                    </Grid>
                    <Grid item xs={12} sm={7} md={3} lg={3} xl={3} className=" coupon-btn">
                      <Button className="button-outline btn-xs">APPLY COUPON</Button>
                    </Grid>
                  </Grid>
                  
                </div>
                <div className="formgroup-container mt-40 pt-10 mb-20">
                  <Grid container className="cart-total mt-50">
                    <h3>Cart Total</h3>
                    {[["Subtotal", subtotal], ["Delivery Cost", deliveryCost], ["Tax", tax], ["Total", total]].map((value, key) => (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={key}>
                        <Grid container>
                          <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                            <h6>{value[0]}</h6>
                          </Grid>
                          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <h6>${value[1]}</h6>
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
                  <Grid container className="mt-20">
                    <Button className="button-outline ml-20" onClick={this.proceedToCheckout}>PROCEED TO CHECKOUT</Button>
                  </Grid>
                  <ConfirmationDialog
                    ref={this.confirmationDialog}
                    onConfirm={(res) => this.deleteCartItem(res)}
                  />
                </div>
              </div>
            </form>
           : 
            <form>
              <div className="iron-gogreen-wrapper section-pad">
                <div className="iron-sec-heading-wrap heading-font-v2 text-center">
                  <div className="heading-title mb-40">
                    <h2>Go Green! Go Organic!</h2>
                  </div>
                </div>
              </div>
              <div className="container cart-container">
                <Grid container spacing={5} justify="center" alignItems="center">
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="cart-empty">
                      <h3>
                        YOUR CART IS CURRENTLY EMPTY
                      </h3>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="return-btn">
                    <Button className="button btn-active" component={Link} to="/shop">RETURN TO SHOP</Button>
                  </Grid>
                </Grid>
              </div>                
            </form>
          }
          <div className="background-3 section-pad mt-60 pb-60">
            <div className="container mb-60">
              <MostSellingProducts />
            </div>            
          </div>
          <img src={require('../../assets/images/feature-image-1.jpg')} alt='fruit'/>
          <div className="iron-features-wrap" >
            <Features/>
            <div className="container">          
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting,
    cartData: state.ecommerce.cart
  }), { waiting, showAlert, updateCartData, updateProductQuantity })(HomePage);