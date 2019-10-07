/**
 * App Routes
 */
/* eslint-disable */
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import DriverAdmin from './driver-admin';

// router service
import routerService from "../services/_routerService";

import DriverPanel from "../routes/driver"

class DriverLayout extends Component {

   render() {
      const { match } = this.props;
      return (
         <DriverAdmin>               
            <Route path={`${match.url}/`} name="Driver" component={DriverPanel} />            
         </DriverAdmin>
      );
   }
}

export default withRouter(connect(null)(DriverLayout));
