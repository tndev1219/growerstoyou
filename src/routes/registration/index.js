import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { FormControl, CircularProgress, RadioGroup, FormControlLabel, Radio, Button, Grid, FormLabel } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Features from '../../components/widgets/Features';
import RegistrationCommonFormGroup from '../../components/widgets/RegistrationCommonFormGroup';
import RegistrationFarmerFormGroup from '../../components/widgets/RegistrationFarmerFormGroup';
import RegistrationDriverFormGroup from '../../components/widgets/RegistrationDriverFormGroup';
import SnackBar from '../../components/global/forms/SnackBar';
import authAction from "../../redux/auth/actions";

const { signup, waiting } = authAction;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        usertype: "Customer"
      },
      errors: {},
      showSnackBar: false
    };
  }

  handleChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  };

  uploadLicenseId = (image) => {
    let fields = this.state.fields;
    fields['uploadID'] = image;
    this.setState({ fields });
  }

  handleClick = () => {
    if (this.handleValidation()) {
      this.handleSubmit();
      return true;
    } else {
      this.setState({showSnackBar: true});
      return false;
    }
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //FirstName
    if (!fields["firstName"]) {
      formIsValid = false;
      errors["firstName"] = true;
    }

    //LastName
    if (!fields["lastName"]) {
        formIsValid = false;
        errors["lastName"] = true;
    }

    //StreetAddress
    if (!fields["streetAddress"]) {
      formIsValid = false;
      errors["streetAddress"] = true;
    }

    //Town/City
    if (!fields["townCity"]) {
        formIsValid = false;
        errors["townCity"] = true;
    }

    //State
    if (!fields["state"]) {
        formIsValid = false;
        errors["state"] = true;
    }

    //Zip
    if (!fields["zip"]) {
      formIsValid = false;
      errors["zip"] = true;
    }

    if (typeof fields["zip"] !== "undefined") {
      if (!fields["zip"].match(/^[0-9]+$/)) {
         formIsValid = false;
         errors["zip"] = true;
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

    //Confirm Email
    if (!fields["confirmEmail"]) {
      formIsValid = false;
      errors["confirmEmail"] = true;
    }

    if (typeof fields["confirmEmail"] !== "undefined") {
      if (fields["confirmEmail"] !== fields["email"]) {
        formIsValid = false;
        errors["confirmEmail"] = true;
      }
    }

    //Password
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = true;
    }

    //Confirm Password
    if (!fields["confirmPassword"]) {
      formIsValid = false;
      errors["confirmPassword"] = true;
    }

    if (typeof fields["confirmPassword"] !== "undefined") {
      if (fields["confirmPassword"] !== fields["password"]) {
        formIsValid = false;
        errors["confirmPassword"] = true;
      }
    }

    //Phone Number
    if (!fields["phoneNumber"]) {
      formIsValid = false;
      errors["phoneNumber"] = true;
    }

    if (typeof fields["phoneNumber"] !== "undefined") {
      if (!fields["phoneNumber"].match(/^[0-9\s+-]+$/)) {
         formIsValid = false;
         errors["phoneNumber"] = true;
      }
    }

    if (fields["usertype"] === "Farmer") {
      //Farm Name
      if (!fields["farmName"]) {
        formIsValid = false;
        errors["farmName"] = true;
      } 

      //Farm Street Address
      if (!fields["farmStreetAddress"]) {
        formIsValid = false;
        errors["farmStreetAddress"] = true;
      }

      //Farm Town/City 
      if (!fields["farmTownCity"]) {
        formIsValid = false;
        errors["farmTownCity"] = true;
      }

      //Farm State 
      if (!fields["farmState"]) {
        formIsValid = false;
        errors["farmState"] = true;
      }

      //Farm Zip
      if (!fields["farmZip"]) {
        formIsValid = false;
        errors["farmZip"] = true;
      }

      if (typeof fields["farmZip"] !== "undefined") {
        if (!fields["farmZip"].match(/^[0-9]+$/)) {
           formIsValid = false;
           errors["farmZip"] = true;
        }
      }

      //Farm Phone Number
      if (!fields["farmPhoneNumber"]) {
        formIsValid = false;
        errors["farmPhoneNumber"] = true;
      }

      if (typeof fields["farmPhoneNumber"] !== "undefined") {
        if (!fields["farmPhoneNumber"].match(/^[0-9\s+-]+$/)) {
           formIsValid = false;
           errors["farmPhoneNumber"] = true;
        }
      }
    }

    if (fields["usertype"] === "Driver") {
      //Driver's License No
      if (!fields["licenseNumber"]) {
        formIsValid = false;
        errors["licenseNumber"] = true;
      }

      //Issued Date
      if (!fields["issuedDate"]) {
        formIsValid = false;
        errors["issuedDate"] = true;
      } else if (fields['issuedDate'] === "") {
        formIsValid = false;
        errors["issuedDate"] = true;
      } else if (fields['issuedDate'].includes('_')) {
        formIsValid = false;
        errors["issuedDate"] = true;
      }

      //Expiry Date
      if (!fields["expiryDate"]) {
        formIsValid = false;
        errors["expiryDate"] = true;
      } else if (fields['expiryDate'] === "") {
        formIsValid = false;
        errors["expiryDate"] = true;
      } else if (fields['expiryDate'].includes('_')) {
        formIsValid = false;
        errors["expiryDate"] = true;
      }

      //Street Address
      if (!fields["driverStreetAddress"]) {
        formIsValid = false;
        errors["driverStreetAddress"] = true;
      }

      //Town/City
      if (!fields["driverTownCity"]) {
        formIsValid = false;
        errors["driverTownCity"] = true;
      }

      //State 
      if (!fields["driverState"]) {
        formIsValid = false;
        errors["driverState"] = true;
      }

      //Zip 
      if (!fields["driverZip"]) {
        formIsValid = false;
        errors["driverZip"] = true;
      }

      if (typeof fields["driverZip"] !== "undefined") {
        if (!fields["driverZip"].match(/^[0-9]+$/)) {
           formIsValid = false;
           errors["driverZip"] = true;
        }
      }

      //Upload ID
      if (!fields["uploadID"]) {
        formIsValid = false;
        errors["uploadID"] = true;
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  };

  setDate = (event, name) => {
    let fields = this.state.fields;
    fields[name] = event;
  }

  handleSubmit = () => {
		const { signup, waiting } = this.props;
		waiting(true);
    const signupData = this.state.fields;
    signup(signupData);
  };

  hideSnackBar = () => {
    this.setState({showSnackBar: false});
  }
  
  render() {

    return(
      <Fragment>
        <div className="iron-registration-page-wrap page-pad">
          <form className="background-3">
            <div className="iron-gogreen-wrapper section-pad">
              <RegistrationCommonFormGroup 
                errors={this.state.errors}
                handleChange={this.handleChange}
              />
            </div>
            <div className="mb-40 mt-40">
              <div className="formgroup-container">
                <div className="mb-20">
                  <FormControl component="fieldset" required>
                    <FormLabel
                      shrink="true"
                      htmlFor="bootstrap-input"
                      className="bootstrapFormLabel"
                    >
                      Register As
                    </FormLabel>
                    <RadioGroup
                      aria-label="usertype"
                      name="usertype"
                      className="usertype-radioGroup"
                      usertype={this.state.fields["usertype"]}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel className="radiolabel" name="usertype" value="Customer" control={<Radio checked={this.state.fields["usertype"] === "Customer"}/>} label="Customer" />
                      <FormControlLabel className="radiolabel" name="usertype" value="Farmer" control={<Radio checked={this.state.fields["usertype"] === "Farmer"}/>} label="Farmer" />
                      <FormControlLabel className="radiolabel" name="usertype" value="Driver" control={<Radio checked={this.state.fields["usertype"] === "Driver"}/>} label="Driver" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  {this.state.fields["usertype"] === "Farmer" ? 
                    <RegistrationFarmerFormGroup 
                      errors={this.state.errors}
                      handleChange={this.handleChange}
                    /> :
                    this.state.fields["usertype"] === "Driver" ? 
                      <RegistrationDriverFormGroup 
                        errors={this.state.errors}
                        handleChange={this.handleChange}
                        uploadLicenseId={this.uploadLicenseId}
                        setDate={this.setDate}
                      /> : ""
                  }
                </div>
                <div className="mt-60 pb-60">
                  <Grid container className="section-content" direction="column" justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
											<Button 
												className="button btn-active btn-reg mb-30" 
												onClick={this.handleClick}
												disabled={this.props.wait}
											>
                        REGISTER
                      </Button>
											{this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "8px", marginLeft: "-105px"}} />}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <p className="mb-40 sign-p">Have an account already? <Link to="/sign-in">Sign In</Link></p>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <SnackBar 
                showSnackBar={this.state.showSnackBar}
                hideSnackBar={this.hideSnackBar}
                message={'Please input the correct value...'}
              />
            </div>
          </form>
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

export default connect(state => {
	var wait = state.Auth.waiting;
	return { wait };
}, { signup, waiting })(HomePage);