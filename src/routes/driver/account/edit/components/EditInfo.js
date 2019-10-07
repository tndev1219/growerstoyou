/**
 * edit info component
 */
import React from 'react';
import { connect } from "react-redux";
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@material-ui/core';
import { abbreviation2Name, name2Abbreviation, states } from '../../../../../assets/data/states';
import SnackBar from '../../../../../components/global/forms/SnackBar';
import authAction from "../../../../../redux/auth/actions";
import { showAlert } from '../../../../../actions/action';
import { api } from '../../../../../api';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../../../../../aws-exports';
Amplify.configure(awsconfig);

const { waiting, profileUpdate } = authAction;

class EditInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        fname: props.profile.fname ? props.profile.fname : '',
        lname: props.profile.lname ? props.profile.lname : '',
        address: props.profile.address ? props.profile.address : '',
        city: props.profile.city ? props.profile.city : '',				
        state: name2Abbreviation(props.profile.state).abbreviation ? name2Abbreviation(props.profile.state).abbreviation : '',
        zipcode: props.profile.zipcode ? props.profile.zipcode : '',
        phone: props.profile.phone ? props.profile.phone : ''
      },
      errors: {},
      showSnackBar: false
    };
    this.addUserFormSubmit = this.addUserFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }  

  /**
    * define function for form validation
  */
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
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = true;
    }
    
    //city
    if (!fields["city"]) {
      formIsValid = false;
      errors["city"] = true;
    }
    
    //state
    if (fields["state"] === '') {
      formIsValid = false;
      errors["state"] = true;
    }

    //zip
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
    
    //avatar
    if (!fields['avatar']) {
      formIsValid = false;
      errors["avatar"] = true;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  //define Function for change input data
  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  }

  //define function for submit form 
  addUserFormSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
      var fields = this.state.fields;
        var payload = {
        token: this.props.token,
        fname: fields['fname'],
        lname: fields['lname'],
        address: fields['address'],
        city: fields['city'],
        state: abbreviation2Name(fields['state']).name,
        zipcode: fields['zipcode'],
        phone: fields['phone'],
        avatar: fields['avatar']
      }
      var self = this;

      this.props.waiting(true);
      api.POST('profile/update', payload)
        .then(function(res) {
          if (res.data.success) {
            self.props.profileUpdate(JSON.stringify(res.data.results));
          } else {
            self.props.showAlert(res.data.message, 'error');
          }
          self.props.waiting(false);
        })
        .catch(function(err) {
          self.props.waiting(false);
          self.props.showAlert('Failed to update profile. Please try again later...', 'error');
        })

      return true;
    } else {
      this.setState({showSnackBar: true});
      return false;
    }
  }
  
  pad(n) {
    return n<10 ? '0'+n : n;
  }

  hideSnackBar = () => {
    this.setState({showSnackBar: false});
  }

  render() {
    var { profile } = this.props;
    
    return (
      <div className="profile-wrapper p-sm-15">
        <h4>Edit Profile Information</h4>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <PhotoPicker 
              preview
              onPick={data => {
                var currentDate = new Date()
                var date = currentDate.getDate();
                var month = currentDate.getMonth();
                var year = currentDate.getFullYear();
                var timeStamp = `${year}${this.pad(month + 1)}${date}${Date.now()}`;
                var extension = data.name.split('.')[data.name.split('.').length-1];

                const { waiting } = this.props;
                waiting(true);

                if (profile && profile.avatar) {
                  Storage.remove(profile && profile.avatar);
                }

                var self = this;
                Storage.put(`avatar/${timeStamp}.${extension}`, data.file, { contentType: 'image/*' })
                  .then (result => {
                    var fields = self.state.fields;
                    fields['avatar'] = result.key;
                    waiting(false);
                  })
                  .catch(err => {
                    var fields = self.state.fields;
                    fields['avatar'] = '';
                    waiting(false);
                    self.props.showAlert('Failed to upload image. Please try again later...', 'error');
                  });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <form onSubmit={this.addUserFormSubmit}>
              <div>
                <TextField
                  name="fname"
                  label="first Name"
                  className="iron-form-input-wrap"
                  error={this.state.errors["fname"]}
                  ref="fname"
                  onChange={this.handleChange}
                  value={this.state.fields["fname"]}
                />
                <TextField
                  name="lname"
                  label="last Name"
                  className="iron-form-input-wrap"
                  error={this.state.errors["lname"]}
                  ref="lname"
                  onChange={this.handleChange}
                  value={this.state.fields["lname"]}
                />
                <TextField
                  name="address"
                  label="street Address"
                  className="iron-form-input-wrap"
                  error={this.state.errors["address"]}
                  ref="address"
                  onChange={this.handleChange}
                  value={this.state.fields["address"]}
                />
                <TextField
                  name="city"
                  label="Town/City"
                  className="iron-form-input-wrap"
                  error={this.state.errors["city"]}
                  ref="city"
                  onChange={this.handleChange}
                  value={this.state.fields["city"]}
                />
                <FormControl
                  error={this.state.errors['state']}
                  className="iron-form-input-wrap"
                >
                  <InputLabel htmlFor="state">State</InputLabel>
                  <Select
                    value={this.state.fields["state"]}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'state',
                      id: 'state',
                    }}
                  >
                    {states.map((state, index) => (
                      <MenuItem key={index} value={state.abbreviation}>{state.name}</MenuItem>  
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="zipcode"
                  label="Zip"
                  className="iron-form-input-wrap"
                  error={this.state.errors["zipcode"]}
                  ref="zipcode"
                  onChange={this.handleChange}
                  value={this.state.fields["zipcode"]}
                />
                <TextField
                  name="phone"
                  label="Phone Number"
                  className="iron-form-input-wrap"
                  error={this.state.errors["phone"]}
                  ref="phone"
                  onChange={this.handleChange}
                  value={this.state.fields["phone"]}
                />
              </div>
              <Button type="submit" className="button btn-active btn-disabled mb-15" disabled={this.props.wait}>save</Button>
              {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "8px", marginLeft: "-43px"}} />}
            </form>
          </Grid>
        </Grid>
        <SnackBar 
          showSnackBar={this.state.showSnackBar}
          hideSnackBar={this.hideSnackBar}
          message={'Please input the correct value...'}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting
  }), { waiting, showAlert, profileUpdate })(EditInfo);