import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Features from '../../components/widgets/Features';
import MostSellingProducts from '../../components/widgets/MostSellingProducts';
import RecommendFruits from '../../components/widgets/RecommendFruits';
import { Button, Card, Grid, TextField, CircularProgress } from '@material-ui/core';
import { ArrowForwardRounded } from '@material-ui/icons';
import 'rc-input-number/assets/index.css';
import InputNumber from 'rc-input-number';
import Rating from 'react-rating';
import { Animate } from "react-show";
import 'font-awesome/css/font-awesome.css';
import { api } from '../../api';
import { showAlert, showConfirmAlert, updateCartData } from '../../actions/action';
import appConfig from '../../constants/AppConfig';
import ContentLoader from '../../components/global/loaders/ContentLoader';
import authAction from "../../redux/auth/actions";

const { waiting } = authAction;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      reviewsShow: true,
      vendorInfoShow: false,
      productId: parseInt(this.props.match.params.id),
      currentDataItem: null,
      amount: 1
    };
    this.onChange = this.onChange.bind(this);
    this.addCart = this.addCart.bind(this);
  }

  componentWillMount() {
    var payload = {
			id: this.state.productId
		}
    var self = this;
    
    api.POST('product/getbyid', payload)
      .then(function(res) {
        if (res.data.success) {
          var previewImage = res.data.results.images[0];

          self.setState({ currentDataItem: res.data.results, previewImage });
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
      })
  }

  changePreviewImage = (previewImage) => {
    this.setState({ previewImage });
  };

  toggleReviewsShow = () => {
    this.setState({ reviewsShow: !this.state.reviewsShow });
  };

  toggleVendorInfoShow = () => {
    this.setState({ vendorInfoShow: !this.state.vendorInfoShow });
  };

  onChange(e) {
    e = !e ? 1 : e
    this.setState({ amount: parseInt(e) })
  }

  addCart() {
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
      productid: this.state.currentDataItem.id,
      count: this.state.amount
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
    var { currentDataItem } = this.state;

    return(
      <Fragment>
        {currentDataItem !== null ?
          <div className="iron-about-page-wrap page-pad">
            <div className="product-detail-title-bg"></div>
            <div className="iron-welcome-wrapper section-pad background-1">
              <div className="container mt-60 pt-60">
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12} md={7} lg={7} xl={7} className="pt-40">
                    <Grid container spacing={5}>
                      <Grid item xs={3} sm={2} md={2} lg={2} xl={2}>
                        <Grid container spacing={2} direction="column">
                          {currentDataItem.images.map((gallery, key) => (
                            <Grid key={key} item xs={12} sm={12} md={12} lg={12} xl={12} style={{height: '100%'}}>
                              <Card className="product-preview-image product-gallery-image">
                                <img src={`${appConfig.S3_BUCKET}${gallery}`} onMouseOver={() => this.changePreviewImage(gallery)} alt='fruit' />        
                              </Card>
                            </Grid>
                          ))}
                        </Grid>                        
                      </Grid>
                      <Grid item xs={9} sm={10} md={10} lg={10} xl={10}>
                        <Card className="product-preview-image product-main-image">
                          <img src={`${appConfig.S3_BUCKET}${this.state.previewImage}`} alt='fruit' />        
                        </Card>
                      </Grid>
                    </Grid>                  
                  </Grid>              
                  <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                    <Grid container justify="flex-end">
                      <Grid item xs={11} sm={11} md={11} lg={11} xl={11} className="product-detail-info">
                        <h2>{currentDataItem.name}</h2>
                        <span>${currentDataItem.price.toFixed(2)}</span><span>/{currentDataItem.unit}</span>
                        <Grid container spacing={3} alignItems="center" className="mt-10">
                          <Grid item>
                            <InputNumber
                              // style={{ width: 100 }}
                              required
                              // defaultValue={1}
                              value={this.state.amount}
                              min={1}
                              onChange={this.onChange}
                              precision={1}
                            />
                          </Grid>
                          <Grid item className="product-detail-category">
                            <Grid>
                              <Grid item>
                                <span>Category: </span>
                                <span>{currentDataItem.category.category_name}</span>
                              </Grid>
                              <Grid item style={{marginTop: 12}}>
                                <span>Vendor: </span>
                                <span>{currentDataItem.farm.name}</span>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Button className="button-outline btn-xs btn-disabled mt-20" onClick={this.addCart} disabled={this.props.wait}>
                          ADD TO CART
                        </Button>
                        {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "22px", marginLeft: "-80px"}} />}
                      </Grid>              
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="product-detail-review">       
                        <hr></hr>
                        <h6 className="btn-h6" onClick={this.toggleReviewsShow}>{this.state.reviewsShow ? "- Reviews (0)" : "+ Reviews (0)"}</h6>
                        <hr></hr>
                        <Animate
                          show={this.state.reviewsShow}
                          transitionOnMount
                          stayMounted={false}
                          style={{ height: "auto" }}
                          start={{
                            opacity: 0,
                            height: 0
                          }}
                        >
                          <h6>Reviews</h6>
                          <p>There are no reviews yet.</p>
                          <h6>Be the first to review "{currentDataItem.name}"</h6>
                          <p>Your email address will not be published. Required fileds are marked *</p>
                          <h6>Your Rating</h6>
                          <Rating
                            emptySymbol="fa fa-star-o fa-2x"
                            fullSymbol="fa fa-star fa-2x"
                            fractions={2}
                          />
                          <h6 className="mt-20">Your Review</h6>
                          <TextField
                            multiline
                            margin="normal"
                            variant="outlined"
                            className="textfield-width"
                          />
                          <Button className="button btn-active btn-xs btn-disabled right-content mt-15 mb-20" disabled={!this.props.isCustomer}>SUBMIT</Button>
                          <hr></hr>
                        </Animate>

                        <h6 className="btn-h6" onClick={this.toggleVendorInfoShow}>{this.state.vendorInfoShow ? "- Vendor Info" : "+ Vendor Info"}</h6>
                        <hr></hr>
                        <Animate
                          show={this.state.vendorInfoShow}
                          transitionOnMount
                          stayMounted={false}
                          style={{ height: "auto" }}
                          start={{
                            opacity: 0,
                            height: 0
                          }}
                        >
                          <Grid container spacing={5}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Farm Name</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.name}</p>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Farm URL</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.link_url}</p>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Farm Street Address</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.address}</p>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Town/City</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.city}</p>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>State</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.state}</p>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Zip</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.zipcode}</p>
                                </Grid>
                              </Grid>

                              <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Phone Number</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{currentDataItem.farm.link_phone}</p>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Animate>
                      </Grid>              
                    </Grid>
                  </Grid>              
                </Grid>
              </div>
            </div>
            <div className="background-3 section-pad mt-60 pb-60">
              <div className="container mb-60">
                <RecommendFruits />
              </div>            
            </div>
            <div className="section-pad pb-60 background-5">
              <div className="container mb-60">
                <MostSellingProducts />
                <Grid container justify="center">
                  <Grid item>
                    <Button className="button-outline right-icon" component={Link} to="/shop">SHOP NOW
                      <ArrowForwardRounded fontSize="small"/>
                    </Button>  
                  </Grid>              
                </Grid>
              </div>            
            </div>
            <img src={require('../../assets/images/feature-image-1.jpg')} alt='fruit'/>
            <div className="iron-features-wrap" >
                <Features/>
              <div className="container">          
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

export default connect(
  state => ({
    token: state.Auth.idToken,
    isLoggedIn: state.Auth.idToken ? true : false,
    isCustomer: !state.Auth.idProfile ? false : JSON.parse(state.Auth.idProfile).role === 1 ? true : false,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting
  }), { waiting, showAlert, showConfirmAlert, updateCartData })(HomePage);