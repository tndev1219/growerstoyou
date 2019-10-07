/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
   AsyncDriverInvoiceListComponent,
   AsyncDriverReportsComponent,
   AsyncDeliveryListComponent,
   AsyncDriverProfileDetailComponent,
   AsyncPageNotFoundComponent
} from '../../util/AsyncRoutes';
import ContactUs from './contact-us';

const DriverPanel = ({ match }) => {
   return (
      <div className="dashboard-wrapper">      
         <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
            <Route path={`${match.url}/dashboard`} component={AsyncDriverReportsComponent} />
            <Route path={`${match.url}/invoices`} component={AsyncDriverInvoiceListComponent} />
            <Route path={`${match.url}/deliveries`} component={AsyncDeliveryListComponent} />
            <Route path={`${match.url}/account`} component={AsyncDriverProfileDetailComponent} />    
            <Route path={`${match.url}/contact-us`} component={ContactUs} />            
            <Route path={`${match.url}/*`} component={AsyncPageNotFoundComponent} />     
         </Switch>
      </div>
   )
}

export default DriverPanel;