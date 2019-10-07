/**
 * edit info component
 */
import React from 'react';
import { connect } from "react-redux";
import { TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import SnackBar from '../../../../components/global/forms/SnackBar';
import authAction from "../../../../redux/auth/actions";
import { showAlert } from '../../../../actions/action';
import { api } from '../../../../api';

const { waiting, profileUpdate } = authAction;

class ChangePassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {
				oldPass: '',
				newPass: '',
				confirmPass: ''
			},
			errors: {},
			showSnackBar: false
		};
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}  

   /**
    * define function for form validation
   */
   handleValidation() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      //Old Password
      if (!fields["oldPass"]) {
         formIsValid = false;
         errors["oldPass"] = true;
      }

      //New Password
      if (!fields["newPass"]) {
         formIsValid = false;
         errors["newPass"] = true;
		}
		
		//Confirm Password
      if (!fields["confirmPass"]) {
         formIsValid = false;
         errors["confirmPass"] = true;
		}

		if (fields['newPass'] !== fields['confirmPass']) {
			formIsValid = false;
         errors["confirmPass"] = true;
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
   handleChangePassword(e) {
      e.preventDefault();
      if (this.handleValidation()) {
			var fields = this.state.fields;
         var payload = {
				token: this.props.token,
				oldpass: fields['oldPass'],
				newpass: fields['newPass']
			}
			var self = this;

			this.props.waiting(true);
			api.POST('profile/changepass', payload)
				.then(function(res) {
					if (res.data.success) {
						self.props.profileUpdate(JSON.stringify(res.data.results));
						self.props.showAlert('Operation Success!', 'success');
					} else if(res.data.errcode === 502) {
						self.props.showAlert('The old password is incorrect. Please enter the correct password.', 'error');
					} else {
						self.props.showAlert(res.data.message, 'error');
					}
					self.props.waiting(false);
				})
				.catch(function(err) {
					self.props.waiting(false);
					self.props.showAlert('Failed to change password. Please try again later...', 'error');
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
		const thumb = require('../../../../assets/images/user-edit.png');
		
      return (
         <div className="profile-wrapper p-sm-15">
            <h4>Change Password</h4>
            <Grid container spacing={4}>
               <Grid item xs={12} sm={12} md={6} lg={6}>
                  <form onSubmit={this.handleChangePassword}>
                     <div>
                        <TextField
									name="oldPass"
                           label="Old Password"
                           className="iron-form-input-wrap"
                           error={this.state.errors["oldPass"]}
                           ref="oldPass"
                           onChange={this.handleChange}
									value={this.state.fields["oldPass"]}
									type='password'
                        />
                        <TextField
									name="newPass"
                           label="New Password"
                           className="iron-form-input-wrap"
                           error={this.state.errors["newPass"]}
                           ref="newPass"
                           onChange={this.handleChange}
									value={this.state.fields["newPass"]}
									type='password'
                        />
                        <TextField
									name="confirmPass"
                           label="Confirm Password"
                           className="iron-form-input-wrap"
                           error={this.state.errors["confirmPass"]}
                           ref="confirmPass"
                           onChange={this.handleChange}
									value={this.state.fields["confirmPass"]}
									type='password'
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
		wait: state.Auth.waiting
	}), { waiting, showAlert, profileUpdate })(ChangePassword);