import React, { Component, Fragment } from 'react';
import _SplitFieldsForm from './StripeForm';
import {
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import appConfig from '../../../../constants/AppConfig';

const SplitFieldsForm = injectStripe(_SplitFieldsForm);

export default class SplitFieldsDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
  render() {
    
    return (
      <Fragment>
        <StripeProvider apiKey={appConfig.STRIPE_PUBLIC_KEY}>
          <Elements>
            <SplitFieldsForm type={this.props.type} />
          </Elements>
        </StripeProvider>
      </Fragment>
    );
  }
}