import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography, Badge } from '@material-ui/core';
import {AddShoppingCartRounded} from '@material-ui/icons';
import config from '../../../constants/AppConfig';
import { api } from '../../../api';
import authAction from "../../../redux/auth/actions";
import { showAlert, showConfirmAlert, updateCartData } from '../../../actions/action';

const { waiting } = authAction;

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  handleAddToCart() {
    if (!this.props.isLoggedIn) {
      this.props.showConfirmAlert('You must login to perform this operation. Do you want to login?');
      return false;
    }

    if (!this.props.isCustomer) {
      this.props.showAlert('Please login as a Customer to perform this operation.', 'error');
      return false;
    }

    var payload = {
      token: this.props.token,
      productid: this.props.product.id,
      count: 1
    }
    var self = this;
    this.props.waiting(true);

    api.POST('basket/add', payload)
      .then(function(res) {
        if (res.data.success) {
          var data = {
            token: self.props.token,
            userid: self.props.profile && self.props.profile.id
          }
          self.props.updateCartData(data);
          self.props.showAlert('Operation Success!', 'success');
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
        self.props.waiting(false);
      })
      .catch(function(err) {
        self.props.waiting(false);
        self.props.showAlert('Failed to add cart. Please try again later...', 'error');
      })
  }

  render() {
    var { product } = this.props;

    return (
      <Badge badgeContent={`$ ${product.price}`} color="primary" className="badge-productcard">
        <Card className="productCard">
          <CardActionArea component={Link} to={`/product-detail/${product.id}`}>
            <CardMedia
              component="img"
              image={`${config.S3_BUCKET}${product.images[0]}`}
              className="product-card2 mb-20"
            />
            <CardContent className="product-cardcontent">
              <Typography gutterBottom variant="h5" component="h4">
                {product.name}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className="productCard-action">
            <Button className="button-black right-icon btn-sm btn-addcart-disabled" disabled={this.props.wait} onClick={this.handleAddToCart}>Add To Cart
              <AddShoppingCartRounded fontSize="small" />
            </Button>
          </CardActions>
        </Card>
      </Badge>
    );    
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    isLoggedIn: state.Auth.idToken ? true : false,
    isCustomer: !state.Auth.idProfile ? false : JSON.parse(state.Auth.idProfile).role === 1 ? true : false,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting
  }), { waiting, showAlert, showConfirmAlert, updateCartData })(ProductCard);