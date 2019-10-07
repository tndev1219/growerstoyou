/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
   AsyncFarmerOrderListComponent,
   AsyncFarmerReportsComponent,
   AsyncProductsGridComponent,
   AsyncProductAddComponent,
   AsyncProductEditComponent,
   AsyncProductDetailComponent,
   AsyncFarmerProfileDetailComponent,
   AsyncPageNotFoundComponent
} from '../../util/AsyncRoutes';
import ContactUs from './contact-us';

const FarmerPanel = ({ match }) => {
   return (
      <div className="dashboard-wrapper">      
         <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
            <Route path={`${match.url}/dashboard`} component={AsyncFarmerReportsComponent} />
            <Route path={`${match.url}/orders`} component={AsyncFarmerOrderListComponent} />
            <Route path={`${match.url}/products`} component={AsyncProductsGridComponent} />
            <Route path={`${match.url}/product-add`} component={AsyncProductAddComponent} />
            <Route path={`${match.url}/product-edit/:id`} component={AsyncProductEditComponent} />
            <Route path={`${match.url}/product-detail/:id`} component={AsyncProductDetailComponent} />
            <Route path={`${match.url}/account`} component={AsyncFarmerProfileDetailComponent} />           
            <Route path={`${match.url}/contact-us`} component={ContactUs} />            
            <Route path={`${match.url}/*`} component={AsyncPageNotFoundComponent} />     
         </Switch>
      </div>
   )
}

export default FarmerPanel;