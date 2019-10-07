/**
 * cart list item
 */
/* eslint-disable */
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
import { Link } from 'react-router-dom';

//connect to store
import { connect } from "react-redux";

// global component
import CurrencyIcon from '../../global/currency/CurrencyIcon';
import ConfirmationDialog from '../../global/confirmation-popup';
import appConfig from '../../../constants/AppConfig';
import { api } from '../../../api';

//action
import { removeProductItem } from '../../../actions/action';
import { showAlert, updateCartData } from '../../../actions/action';
import authAction from "../../../redux/auth/actions";

const { waiting } = authAction;

class Cart extends React.Component {

  constructor(props) {
      super(props);
      this.confirmationDialog = React.createRef();
      this.state = {
        anchorEl: null,
      };
  }

  //Define function for open dropdown
  handleClick = event => {
      this.setState({
        anchorEl: event.currentTarget,
      });
  };

  //Define function for close dropdown
  handleClose = () => {
      this.setState({
        anchorEl: null,
      });
  };

  //Function to delete product from cart
  onDeleteCartItem(cartItem) {
      this.cartItem = cartItem;
      this.confirmationDialog.current.openDialog();
  }

  //Function for delete cart product
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
      this.setState({
        anchorEl: null,
      });
  }

  render() {

      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);
      const { cart } = this.props;

      return (
        <div className="iron-cart-wrap">
            <IconButton
              color="inherit"
              aria-owns={open ? 'simple-popper' : null}
              aria-haspopup="true"
              variant="contained"
              onClick={this.handleClick}
              className="cart-btn mr-10"
              aria-label="Cart"
            >
              {cart && cart.length > 0 ?
                  (
                    <Badge
                        badgeContent={cart.length}
                        color="secondary"
                        className="badge-active"
                    >
                        <i className="material-icons">shopping_cart</i>
                    </Badge>
                  )
                  :
                  (
                    <i className="material-icons">shopping_cart</i>
                  )
              }
            </IconButton>
            <Popover
              id="simple-popper"
              open={open}
              anchorEl={anchorEl}
              onClose={this.handleClose}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
              }}
            >
              <div>
                  {(cart && cart.length > 0) ?
                    (
                        <Fragment>
                          <ul className="iron-cart-list-wrap mb-0">
                              {cart && cart.map((cartItem, index) => {
                                return (
                                    <li key={index} className="cart-menu-item p-10 mb-0">
                                      <div className="d-flex iron-cart-post">
                                          <div className="cart-thumb">
                                            <img
                                              src={`${appConfig.S3_BUCKET}${cartItem.product.images[0]}`}
                                              alt='product-thumbnail'
                                            />
                                          </div>
                                          <div className=" cart-content-wrap d-flex justify-content-start align-items-center">
                                            <div className="cart-content" >
                                                {/* <h6 className="mb-5 text-truncate">{cartItem.name}</h6> */}
                                                <h6 className="mb-5 text-truncate">{cartItem.product.name}</h6>
                                                <span><CurrencyIcon /> {cartItem.product.price*cartItem.product.count}</span>
                                            </div>
                                            <div className="cart-edit-action d-flex justify-content-end align-items-center">
                                                <Button
                                                  className="icon-btn button mr-5"
                                                  onClick={() => this.onDeleteCartItem(cartItem)}
                                                >
                                                  <i className="material-icons">remove_shopping_cart</i>
                                                </Button>
                                                <Button component={Link} to="/cart" className="icon-btn button" onClick={this.handleClose} >
                                                  <i className="material-icons">edit</i>
                                                </Button>
                                            </div>
                                          </div>
                                      </div>
                                    </li>
                                )
                              })
                              }
                          </ul>
                          <div className=" py-15 px-10">
                              <Button onClick={this.handleClose} component={Link} to="/cart" className="button btn-active w-100">
                                go to cart
                              </Button>
                          </div>
                        </Fragment>
                    )
                    :
                    (
                        <div>
                          <span className="text-capitalize text-14 dark-color d-block px-40 py-15">no product found</span>
                        </div>
                    )
                  }
              </div>
              <ConfirmationDialog
                  ref={this.confirmationDialog}
                  onConfirm={(res) => this.deleteCartItem(res)}
              />
            </Popover>
        </div>
      );
  }
}

// map state to props
const mapStateToProps = (state) => {
  const { cart } = state.ecommerce;
  const token = state.Auth.idToken;
  const profile = state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : nell
  const wait = state.Auth.waiting;
  return { cart, wait, token, profile };
}

export default connect(mapStateToProps, {
  removeProductItem, waiting, showAlert, updateCartData
})(Cart);

