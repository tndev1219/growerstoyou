import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import ContentLoader from '../../../../components/global/loaders/ContentLoader';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from 'react-stripe-elements';
import { Grid, Button, CircularProgress } from "@material-ui/core";
import { api } from '../../../../api';
import SnackBar from '../../../../components/global/forms/SnackBar';
import { showAlert } from '../../../../actions/action';
import authAction from "../../../../redux/auth/actions";

const { waiting } = authAction;

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
				letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: 'red',
      },
    },
  };
};

class _SplitFieldsForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
      errorMessage: '',
      showSnackBar: false
		};
	}

  handleChange = ({error}) => {
    if (error) {
      this.setState({ errorMessage: error.message, showSnackBar: true });
    }
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    if (this.props.stripe) {
      this.props.waiting(true);
      var self = this;

      this.props.stripe.createToken()
        .then(function(res) {

          if (!res.error) {

            var payload = {
              token: self.props.token,
              branch: res.token.card.brand,
              stripetoken: res.token.id,
              number: res.token.card.last4,
              funding: res.token.card.funding
            };
            var url = '';

            if (self.props.type && self.props.type === '?type=add-card') {
              url = 'card/add';
            } else {
              payload['cardid'] = self.props.type.split('&')[1].split('=')[1];
              url = 'card/update';
            }
            
            api.POST(url, payload)
              .then(function(res) {
                if (res.data.success) {
                  self.props.showAlert('Operation Success!', 'success');
                } else {
                  self.props.showAlert(res.data.message, 'error');
                }
                self.props.waiting(false);
              })
              .catch(function(err) {
                self.props.waiting(false);
                self.props.showAlert('Operation failed. Please try again later...', 'error');
              })

          } else {
            self.props.waiting(false);
          }  
        });
    } else {
      this.props.showAlert("Stripe.js hasn't loaded yet.", 'error');
    }
  };

  hideSnackBar = () => {
		this.setState({showSnackBar: false});
	}
  
  render() {
		const thumb = require('../../../../assets/images/card-edit.png');
    const { type } = this.props;

    return (
			<Fragment>
				{type !== null ?
					<div className="card-wrapper p-sm-15">
						{type && type === '?type=add-card' ?
							<h4>add card Information</h4>
						:
							<h4>Edit card Information</h4>
						}
						<Grid container spacing={4} className="mt-20">
							<Grid item xs={12} sm={12} md={6} lg={6}>
								<form onSubmit={this.handleSubmit.bind(this)}>
									<Grid container spacing={4}>
										<Grid item xs={12} sm={12} md={12} lg={12}>
                      <div className="split-form">
                        <label style={{marginBottom: 10}}>
                          Card number
                          <CardNumberElement
                            {...createOptions()}
                            onChange={this.handleChange}
                          />
                        </label>
                      </div>
										</Grid>
										<Grid item xs={12} sm={12} md={12} lg={12}>
											<label>
												Expiration date
												<CardExpiryElement
													{...createOptions()}
													onChange={this.handleChange}
												/>
											</label>
										</Grid>
										<Grid item xs={12} sm={12} md={12} lg={12} className="pb-50">
											<label>
												CVC
												<CardCVCElement
													{...createOptions()}
													onChange={this.handleChange} 
												/>
											</label>
										</Grid>
									</Grid>
									<Button type="submit" className="button btn-active btn-disabled mb-15" disabled={!this.props.stripe || this.props.wait}>save</Button>
                  {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "8px", marginLeft: "-43px"}} />}
								</form>
							</Grid>
							<Grid item md={6} lg={6} className="edit-window-thumb" style={{ backgroundImage: `url(${thumb})` }}>

							</Grid>
						</Grid>
            <SnackBar 
              showSnackBar={this.state.showSnackBar}
              hideSnackBar={this.hideSnackBar}
              message={this.state.errorMessage}
            />
					</div>
				:
					<ContentLoader />
				}
			</Fragment>
    );
  }
}

export default connect(
	state => ({
    token: state.Auth.idToken,
    wait: state.Auth.waiting
	}), { waiting, showAlert })(_SplitFieldsForm);