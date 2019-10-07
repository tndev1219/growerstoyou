/**
 * Form Dialog
 */
/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { Button, Dialog, DialogContent, DialogTitle, TextField, CircularProgress } from '@material-ui/core';
import { addNewUser } from '../../../../../actions/action';
import authAction from "../../../../../redux/auth/actions";
import { showAlert } from "../../../../../actions/action";
import api from '../../../../../api/api';
import './custom.scss';

const { waiting } = authAction;

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      fields: {
        password: 'instafarm'
      },
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
      fields: {
      password: 'instafarm'
    },
      errors: {}
    });
  };

  handleClose = () => {
    this.setState({ 
      open: false,
      fields: {
        password: 'instafarm'
      },
      errors: {} 
    });
  };
  //handle form validation
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
    
    //street address
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = true;
    }

    //phone number
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
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  }

  //submit form data
  onFormSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
    this.setState({ open: false });
    this.props.waiting(true);

    var fields = this.state.fields;
    var payload = {
      token: this.props.token,
      farmid: this.props.profile.farminfo.farm_id,
      fname: fields['fname'],
      lname: fields['lname'],
      email: fields['email'],
      phone: fields['phone'],
      password: fields['password']
    }

    var self = this;
    api.POST('farmowner/add_farmer', payload)
      .then(function(res) {
        if (res.data.success) {
          self.props.addNewUser(res.data.results);
        } else if (res.data.errcode === 409) {
          self.props.showAlert('The same email already exists. Please use another email...', 'error');
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
        self.props.waiting(false);
      })
      .catch(function(err) {
        self.props.waiting(false);
        self.props.showAlert('Failed to add farmer. Please try again later...', 'error');
      })
    } else {
      return false;
    }
  }

  render() {
    
    return (
      <div>
        <Button className="rounded-circle px-20 text-capitalize btn-primary btn-active btn-disabled" onClick={this.handleClickOpen} disabled={this.props.wait}>
          add user
        </Button>
        {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "8px", marginLeft: "-60px"}} />}
        <Dialog
          className="add-user-dialog admin-invoice-wrap"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          disableBackdropClick
        >
          <DialogTitle id="form-dialog-title">Add New Farmer</DialogTitle>
          <DialogContent>
            <div >
              <form onSubmit={this.onFormSubmit}>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-20">
                    <TextField
                      fullWidth
                      name="fname"
                      label="First Name"
                      className="iron-form-input-wrap"
                      error={this.state.errors["fname"]}
                      ref="fname"
                      onChange={this.handleChange}
                      value={this.state.fields["fname"] ? this.state.fields["fname"] : ''}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-20">
                    <TextField
                      fullWidth
                      name="lname"
                      label="Last Name"
                      className="iron-form-input-wrap"
                      error={this.state.errors["lname"]}
                      ref="lname"
                      onChange={this.handleChange}
                      value={this.state.fields["lname"] ? this.state.fields["lname"] : ''}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-20">
                    <TextField
                      fullWidth
                      label="email"
                      name="email"
                      className="iron-form-input-wrap"
                      error={this.state.errors["email"]}
                      refs="email"
                      onChange={this.handleChange}
                      value={this.state.fields["email"] ? this.state.fields["email"] : ''}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-20">
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      className="iron-form-input-wrap"
                      error={this.state.errors["password"]}
                      ref="password"
                      onChange={this.handleChange}
                      value={this.state.fields["password"]}
                      type='password'
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12 mb-20">
                    <TextField
                      fullWidth
                      name="phone"
                      label="Phone Number"
                      className="iron-form-input-wrap"
                      error={this.state.errors["phone"]}
                      ref="phone"
                      onChange={this.handleChange}
                      value={this.state.fields["phone"] ? this.state.fields["phone"] : ''}
                    />
                  </div>
                </div>
                <div className="pt-25 text-right">
                  <Button variant="contained" onClick={this.handleClose} className="btn-primary mr-15 text-capitalize mb-15">Cancel</Button>
                  <Button variant="contained" className="btn-active text-white text-capitalize mb-15" type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting
  }), { addNewUser, waiting, showAlert })(AddUser);