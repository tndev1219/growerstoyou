import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Button, CircularProgress, Grid } from '@material-ui/core';
import Features from '../../components/widgets/Features';
import CustomizedInputs from '../../components/global/forms/CustomizedInputs';
import authAction from "../../redux/auth/actions";
import SnackBar from '../../components/global/forms/SnackBar';

const { sendEmail, waiting } = authAction;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      showSnackBar: false
    };
  }

  handleChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
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

    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = () => {
    const { sendEmail, waiting } = this.props;
    waiting(true);
		const sendData = this.state.fields;
    sendEmail(sendData);
  };

  hideSnackBar = () => {
    this.setState({showSnackBar: false});
  };
  
  render() {
    return(
      <Fragment>
        <div className="iron-registration-page-wrap page-pad">
          <form className="background-4">
            <div className="iron-gogreen-wrapper section-pad">
              <div className="iron-sec-heading-wrap heading-font-v2 text-center">
                <div className="heading-title mb-40">
                  <h2>Go Green! Go Organic!</h2>
                </div>
              </div>
            </div>
            <div className=" mb-40 mt-40">
              <div className="formgroup-container">
                <div className="mb-20">
                  <Grid container className="section-content" spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CustomizedInputs 
                        label="Email Address" 
                        isRequire={true} 
                        inputType="email" 
                        name="email" 
                        error={this.state.errors["email"]} 
                        handleChange={this.handleChange}
                      />
                    </Grid>
                  </Grid>
                </div>
                <div className="mt-60 pb-60">
                  <Grid container className="section-content" direction="column" justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Button 
                        className="button btn-active btn-reg mb-30" 
                        onClick={this.handleClick}
                        disabled={this.props.wait}
                      >
                        SEND REQUEST
                      </Button>
                      {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "8px", marginLeft: "-130px"}} />}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <p className="mb-40 sign-p">Don't have an account? <Link to="/sign-up">Register</Link></p>
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

export default connect(
  state => ({
    wait: state.Auth.waiting,
    isLoggedIn: state.Auth.idToken ? true : false
  }),
  { sendEmail, waiting }
)(HomePage);