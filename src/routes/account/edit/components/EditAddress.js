/**
 * edit address component
 */
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@material-ui/core';
import { abbreviation2Name, name2Abbreviation, states } from '../../../../assets/data/states';
import SnackBar from '../../../../components/global/forms/SnackBar';
import authAction from "../../../../redux/auth/actions";
import { showAlert } from '../../../../actions/action';
import { api } from '../../../../api';
import ContentLoader from '../../../../components/global/loaders/ContentLoader';

const { waiting, profileUpdate } = authAction;

class EditAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        address: props.type && props.type === '?type=address' ? props.profile.address : props.profile.s_address ? props.profile.s_address : props.profile.address,
        city: props.type && props.type === '?type=address' ? props.profile.city : props.profile.s_city ? props.profile.s_city : props.profile.city,				
        state: props.type && props.type === '?type=address' ? name2Abbreviation(props.profile.state).abbreviation : props.profile.s_state ? name2Abbreviation(props.profile.s_state).abbreviation : name2Abbreviation(props.profile.state).abbreviation,
        zipcode: props.type && props.type === '?type=address' ? props.profile.zipcode : props.profile.s_zipcode ? props.profile.s_zipcode : props.profile.zipcode
      },
      errors: {},
      showSnackBar: false
    }
    this.onAddressSubmit = this.onAddressSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
    * define function for form validation
    */
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

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
  onAddressSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
    var fields = this.state.fields;
    var payload = {};
    var url = '';
    if (this.props.type === '?type=address') {
      payload = {
        token: this.props.token,
        address: fields['address'],
        city: fields['city'],
        state: abbreviation2Name(fields['state']).name,
        zipcode: fields['zipcode']
      }
      url = 'profile/b_address';
    } else {
      payload = {
        token: this.props.token,
        s_address: fields['address'],
        s_city: fields['city'],
        s_state: abbreviation2Name(fields['state']).name,
        s_zipcode: fields['zipcode']
      }
      url = 'profile/s_address';
    }
      
    var self = this;

    this.props.waiting(true);
    api.POST(url, payload)
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
        self.props.showAlert('Failed to update address. Please try again later...', 'error');
      })

      return true;
    } else {
    this.setState({showSnackBar: true});
      return false;
    }
  }

  hideSnackBar = () => {
    this.setState({showSnackBar: false});
  }

  render() {

    const { type } = this.props;
    var thumb = type && type === '?type=address' ? require('../../../../assets/images/billing-edit.png') : require('../../../../assets/images/shipping-edit.png');

    return (
      <Fragment>
        {type !== null ?
          <div className="profile-wrapper p-sm-15">
            {type && type === '?type=address' ?
              <h4>Edit billing Information</h4>
            :
              <h4>Edit shipping Information</h4>
            }
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <form onSubmit={this.onAddressSubmit}>
                  <div>
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
                  </div>
                  <Button type="submit" className="button btn-active btn-disabled mb-15" disabled={this.props.wait}>save</Button>
                  {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "8px", marginLeft: "-43px"}} />}
                </form>
              </Grid>
              <Grid item md={6} lg={6} className="edit-window-thumb" style={{ backgroundImage: `url(${thumb})` }}>
              </Grid>
            </Grid>
            <SnackBar 
              showSnackBar={this.state.showSnackBar}
              hideSnackBar={this.hideSnackBar}
              message={'Please input the correct value...'}
            />
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
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting
  }), { waiting, showAlert, profileUpdate })(EditAddress);

