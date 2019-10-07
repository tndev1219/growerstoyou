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

const { waiting, profileUpdate } = authAction;

class EditFarm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {
				name: props.profile.farminfo.name,
				link_url: props.profile.farminfo.link_url ? props.profile.farminfo.link_url : '',
				address: props.profile.farminfo.address,
				city: props.profile.farminfo.city,				
				state: name2Abbreviation(props.profile.farminfo.state).abbreviation,
				zipcode: props.profile.farminfo.zipcode,
				link_phone: props.profile.farminfo.link_phone
			},
			errors: {},
			showSnackBar: false
		};
		this.handleFarmEdit = this.handleFarmEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}  

   /**
    * define function for form validation
   */
   handleValidation() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      //Farm Name
      if (!fields["name"]) {
         formIsValid = false;
         errors["name"] = true;
      }

		//farm street address
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
      if (!fields["link_phone"]) {
         formIsValid = false;
         errors["link_phone"] = true;
		}

		if (typeof fields["link_phone"] !== "undefined") {
         if (!fields["link_phone"].match(/^[0-9\s+-]+$/)) {
            formIsValid = false;
            errors["link_phone"] = true;
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
   handleFarmEdit(e) {
      e.preventDefault();
      if (this.handleValidation()) {
			var fields = this.state.fields;
         var payload = {
            token: this.props.token,
            id: this.props.profile.farminfo.farm_id,
				name: fields['name'],
				link_url: fields['link_url'],
				address: fields['address'],
				city: fields['city'],
				state: abbreviation2Name(fields['state']).name,
				zipcode: fields['zipcode'],
				link_phone: fields['link_phone']
			}
			var self = this;

			this.props.waiting(true);
			api.POST('farm/update', payload)
				.then(function(res) {
					if (res.data.success) {
                  var newProfile = self.props.profile;
                  newProfile.farminfo.farm_id = res.data.results.id;
                  newProfile.farminfo.name = res.data.results.name;
                  newProfile.farminfo.link_url = res.data.results.link_url;
                  newProfile.farminfo.address = res.data.results.address;
                  newProfile.farminfo.city = res.data.results.city;
                  newProfile.farminfo.state = res.data.results.state;
                  newProfile.farminfo.zipcode = res.data.results.zipcode;
                  newProfile.farminfo.link_phone = res.data.results.link_phone;

                  self.props.profileUpdate(JSON.stringify(newProfile));
                  self.props.showAlert("Operation Success!", 'success');
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

	hideSnackBar = () => {
		this.setState({showSnackBar: false});
	}

   render() {
      const thumb = require('../../../../../assets/images/shipping-edit.png');
      
      return (
         <div className="profile-wrapper p-sm-15">
            <h4>Edit Farm Information</h4>
            <Grid container spacing={4}>
               <Grid item xs={12} sm={12} md={6} lg={6}>
                  <form onSubmit={this.handleFarmEdit}>
                     <div>
                        <TextField
									name="name"
                           label="Farm Name"
                           className="iron-form-input-wrap"
                           error={this.state.errors["name"]}
                           ref="name"
                           onChange={this.handleChange}
                           value={this.state.fields["name"]}
                        />
                        <TextField
									name="link_url"
                           label="Farm URL (Optional)"
                           className="iron-form-input-wrap"
                           error={this.state.errors["link_url"]}
                           ref="link_url"
                           onChange={this.handleChange}
                           value={this.state.fields["link_url"]}
                        />
                        <TextField
									name="address"
                           label="Farm Street Address"
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
                           name="link_phone"
                           label="Phone Number"
                           className="iron-form-input-wrap"
                           error={this.state.errors["link_phone"]}
                           ref="link_phone"
                           onChange={this.handleChange}
                           value={this.state.fields["link_phone"]}
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
      )
   }
}

export default connect(
	state => ({
		token: state.Auth.idToken,
		profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
		wait: state.Auth.waiting
	}), { waiting, showAlert, profileUpdate })(EditFarm);