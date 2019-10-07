/**
 * App Routes
 */
/* eslint-disable */
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import FarmerAdmin from './farmer-admin';

// router service
import routerService from "../services/_routerService";

import FarmerPanel from "../routes/farmer";

class FarmerLayout extends Component {

   render() {
      const { match } = this.props;
      return (
         <FarmerAdmin>               
            <Route path={`${match.url}/`} name="Farmer" component={FarmerPanel} />            
         </FarmerAdmin>
      );
   }
}

export default withRouter(connect(null)(FarmerLayout));
