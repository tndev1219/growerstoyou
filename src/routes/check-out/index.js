import React, { Fragment } from 'react';
import { connect } from "react-redux";
import Features from '../../components/widgets/Features';
import { Button, Grid, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Animate } from "react-show";
import CustomizedInputs from '../../components/global/forms/CustomizedInputs';
import MostSellingProducts from '../../components/widgets/MostSellingProducts';
import authAction from "../../redux/auth/actions";
import { showAlert, updateCartData } from '../../actions/action';
import SnackBar from '../../components/global/forms/SnackBar';
import { abbreviation2Name, name2Abbreviation, states } from '../../assets/data/states';
import CustomizedSelect from '../../components/global/forms/CustomizedSelect';
import { api } from '../../api';

const { waiting } = authAction;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorsShow: [],
      basketids: JSON.parse(decodeURIComponent(this.props.location.search).split('=')[1]),
      showSnackBar: false,
      fields: {
        fname: this.props.profile ? this.props.profile.fname : '',
        lname: this.props.profile ? this.props.profile.lname : '',
        address: this.props.profile ? this.props.profile.s_address ? this.props.profile.s_address : this.props.profile.address : '',
        city: this.props.profile ? this.props.profile.s_city ? this.props.profile.s_city : this.props.profile.city : '',
        state: this.props.profile ? this.props.profile.s_state ? name2Abbreviation(this.props.profile.s_state).abbreviation : name2Abbreviation(this.props.profile.state).abbreviation : '',
        zipcode: this.props.profile ? this.props.profile.s_zipcode ? this.props.profile.s_zipcode : this.props.profile.zipcode : '',
        email: this.props.profile ? this.props.profile.email : '',
        phone: this.props.profile ? this.props.profile.phone : '',
      },
      errors: {},
      cardData: [],
      open: false,
      selectedCard: null
    };
    this.toggleVendorsShow = this.toggleVendorsShow.bind(this);
    this.hideSnackBar = this.hideSnackBar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    var payload = {
      token: this.props.token
    }
    var self = this;

    api.POST('card/usercard', payload)
      .then(function(res) {
        if (res.data.success) {
          self.setState({ cardData: res.data.results, selectedCard: res.data.results[0].customerid });
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to fetch card data. Please try again later...', 'error');
      })
  }

  toggleVendorsShow(key) {
    var vendorsShow = this.state.vendorsShow;
    if (vendorsShow[key] !== undefined) {
      vendorsShow[key] = !vendorsShow[key];
    } else {
      vendorsShow[key] = true;
    }
    this.setState({ vendorsShow });
  };

  hideSnackBar() {
    this.setState({showSnackBar: false});
  };

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //FirstName
    if (!fields["fname"]) {
      formIsValid = false;
      errors["fname"] = true;
    }

    //LastName
    if (!fields["lname"]) {
        formIsValid = false;
        errors["lname"] = true;
    }

    //StreetAddress
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = true;
    }

    //Town/City
    if (!fields["city"]) {
        formIsValid = false;
        errors["city"] = true;
    }

    //State
    if (!fields["state"]) {
        formIsValid = false;
        errors["state"] = true;
    }

    //Zip
    if (!fields["zipcode"]) {
      formIsValid = false;
      errors["zipcode"] = true;
    }

    if (typeof fields["zipcode"] !== "undefined") {
      if (!fields["zipcode"].match(/^[0-9]+$/)) {
         formIsValid = false;
         errors["zipcode"] = true;
      }
    }

    //Email
    if (!fields["email"]) {
        formIsValid = false;
        errors["email"] = true;
    }

    if (typeof fields["email"] !== "undefined") {
        let lastAtPos = fields["email"].lastIndexOf('@');
        let lastDotPos = fields["email"].lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
          formIsValid = false;
          errors["email"] = true;
        }
    }

    //Phone Number
    if (!fields["phone"]) {
      formIsValid = false;
      errors["phone"] = true;
    }

    if (typeof fields["phone"] !== "undefined") {
      if (!fields["phone"].match(/^[0-9\s+-]+$/)) {
         formIsValid = false;
         errors["phone"] = true;
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  };
  
  handleClick() {
    if (this.handleValidation()) {
      this.handleClickOpen();
      return true;
    } else {
      this.setState({showSnackBar: true});
      return false;
    }
  };

  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleSelect(e) {
    this.setState({ selectedCard: e.target.value })
  }

  handleSubmit() {
    var fields = this.state.fields;
    var payload = {
      token: this.props.token,
      basketids: this.state.basketids,
      customerid: this.state.selectedCard,
      fname: fields.fname,
      lname: fields.lname,
      email: fields.email,
      phone: fields.phone,
      address: fields.address,
      city: fields.city,
      state: fields.state.length === 2 ? abbreviation2Name(fields.state).name : fields.state,
      zipcode: fields.zipcode
    }
    var self = this;
    this.handleClose();
    this.props.waiting(true);

    api.POST('order/add', payload)
      .then(function(res) {
        if (res.data.success) {
          self.props.waiting(false);
          self.props.showAlert('Operation Success!', 'success');
          var data = {
            token: self.props.token,
            userid: self.props.profile && self.props.profile.id
          }
          self.props.updateCartData(data);
          self.props.history.push('/cart');
        } else {
          self.props.waiting(false);
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.waiting(false);
        self.props.showAlert('Failed to pay. Please try again later...', 'error');
      })
  }

  render() {
    var { cartData } = this.props;
    var { basketids, fields, errors, cardData } = this.state;
    var total = 0;
    var subtotal = 0;
    var deliveryCost = 10;
    var tax = 3;
    var farminfo = [];

    for (var i = 0; i < cartData.length; i++) {
      for (var j = 0; j < basketids.length; j++) {
        if (cartData[i].id === basketids[j]) {
          subtotal = subtotal + cartData[i].count*cartData[i].product.price;
          if (farminfo.length === 0) {
            farminfo.push(cartData[i].farm);
          } else {
            for (var k = 0; k < farminfo.length; k++) {
              if (farminfo[k].id !== cartData[i].farm.id) {
                farminfo.push(cartData[i].farm);
              }
            }
          }          
        }
      }
    }
    total = subtotal + deliveryCost + tax;

    return(
      <Fragment>
        <div className="iron-registration-page-wrap page-pad">
          <form>
            <div className="iron-gogreen-wrapper section-pad">
              <div className="iron-sec-heading-wrap heading-font-v2 text-center">
                <div className="heading-title mb-40">
                  <h2>Go Green! Go Organic!</h2>
                </div>
              </div>
            </div>
            <div className="mb-40 mt-40">
              <div className="formgroup-container mb-20">
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <CustomizedInputs 
                      label="First Name" 
                      isRequire={true}
                      inputType="text" 
                      name="fname" 
                      error={errors["fname"]} 
                      handleChange={this.handleChange}
                      value={fields['fname']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <CustomizedInputs 
                      label="Last Name" 
                      isRequire={true}
                      inputType="text"
                      name="lname"
                      error={errors["lname"]}
                      handleChange={this.handleChange}
                      value={fields['lname']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                    <CustomizedInputs 
                      label="Street Address" 
                      isRequire={true}
                      inputType="text"
                      name="address"
                      error={errors["address"]}
                      handleChange={this.handleChange}
                      value={fields['address']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <CustomizedInputs 
                      label="Town/City" 
                      isRequire={true}
                      inputType="text"
                      name="city"
                      error={errors["city"]}
                      handleChange={this.handleChange}
                      value={fields['city']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                    <CustomizedSelect 
                      label="State"
                      isRequire={true}
                      name="state"
                      error={errors["state"]}
                      values={states}
                      abbreviation2Name={abbreviation2Name}
                      handleChange={this.handleChange}
                      value={fields['state']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                    <CustomizedInputs 
                      label="Zip" 
                      isRequire={true}
                      inputType="text"
                      name="zipcode"
                      error={errors["zipcode"]}
                      handleChange={this.handleChange}
                      value={fields['zipcode']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <CustomizedInputs 
                      label="Email Address" 
                      isRequire={true}
                      inputType="email" 
                      name="email" 
                      error={errors["email"]} 
                      handleChange={this.handleChange}
                      value={fields['email']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <CustomizedInputs 
                      label="Phone Number" 
                      isRequire={true}
                      inputType="text" 
                      name="phone" 
                      error={errors["phone"]} 
                      handleChange={this.handleChange}
                      value={fields['phone']}
                    />
                  </Grid>
                </Grid>
                {/* <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FormControlLabel control={<Checkbox className="checkbox-color" checked={this.state.isChecked} onChange={this.handleChange} />} label="Create Account" />
                  </Grid>
                </Grid> */}
                <Grid container spacing={5} className="message-form mt-10">
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h4>Vendors</h4>
                    <hr></hr>
                    {farminfo.map((farm, index) => (
                      <div key={index}>
                        <h6 onClick={() => this.toggleVendorsShow(String(farm.id))}>{this.state.vendorsShow[String(farm.id)] ? `- ${farm.name}'s Farm` : `+ ${farm.name}'s Farm`}</h6>
                        <hr></hr>
                        <Animate
                          show={this.state.vendorsShow[String(farm.id)] === undefined ? false : this.state.vendorsShow[String(farm.id)]}
                          transitionOnMount
                          stayMounted={false}
                          style={{ height: "auto" }}
                          start={{
                            opacity: 0,
                            height: 0
                          }}
                        >
                          {/* <span className="company-info">
                            111 XX Street,<br></br>
                            City,<br></br>
                            State,<br></br>
                            USA
                          </span> */}
                          <Grid container spacing={5} className="company-info">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Farm Name</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.name}</p>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Farm URL</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.link_url}</p>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Farm Street Address</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.address}</p>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Town/City</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.city}</p>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>State</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.state}</p>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Zip</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.zipcode}</p>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                  <h6>Phone Number</h6>
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8}>
                                  <p>{farm.link_phone}</p>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Animate>
                      </div>             
                    ))}                    
                    {/* <p>Leave a message for the farm</p>
                    <TextField
                      multiline
                      margin="normal"
                      variant="outlined"
                      className="textfield-width"
                    /> */}
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container spacing={3} >
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h4 className="right-content">Driver</h4>
                        <hr></hr>
                      </Grid>  
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <span>Leave a message for the driver</span>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          multiline
                          margin="normal"
                          variant="outlined"
                          className="textfield-width"
                        />
                      </Grid>
                    </Grid>
                  </Grid> */}
                </Grid>
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
                <Grid container>
                  <Button className="button-outline btn-disabled ml-20" onClick={this.handleClick} disabled={this.props.wait}>CHECKOUT</Button>
                </Grid>
                {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "-33px", marginLeft: "64px"}} />}
              </div>
            </div>
          </form>
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
        <SnackBar 
          showSnackBar={this.state.showSnackBar}
          hideSnackBar={this.hideSnackBar}
          message={'Please input the correct value...'}
        />
        <Dialog
          className="add-user-dialog admin-invoice-wrap"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          disableBackdropClick
        >
          <DialogTitle id="form-dialog-title">Select Card</DialogTitle>
          <DialogContent>
            <div>
              <form onSubmit={this.onFormSubmit}>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-20">
                    <FormControl
                      className="iron-form-input-wrap"
                    >
                      <InputLabel htmlFor="card">Card</InputLabel>
                      <Select
                        value={this.state.selectedCard}
                        onChange={this.handleSelect}
                        inputProps={{
                          name: 'card',
                          id: 'card',
                        }}
                        style={{width: 220}}
                      >
                        {cardData.map((card, index) => (
                          <MenuItem key={index} value={card.customerid}>{card.branch} -- {card.funding} Card</MenuItem>  
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="pt-25 text-right">
                  <Button variant="contained" onClick={this.handleClose} className="btn-primary mr-15 text-capitalize mb-15">Cancel</Button>
                  <Button variant="contained" className="btn-active text-white text-capitalize mb-15" onClick={this.handleSubmit}>Submit</Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    cartData: state.ecommerce.cart,
    wait: state.Auth.waiting
  }), { waiting, showAlert, updateCartData })(HomePage);