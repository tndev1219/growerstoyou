/**
 * Fixed header component
 */
/* eslint-disable */
import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";

// components
import HeaderMenu from "./HeaderMenu";
import SidebarMenu from '../sidebar';
import AppConfig from '../../../constants/AppConfig';
import Cart from "./Cart";
import Logout from "./Logout";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

class FixedHeader extends Component {

   render() {
      return (
         <div className="iron-fixed-header bg-primary">
            <div className="container">
               <Grid container spacing={0} >
                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3} className="d-flex justify-content-start align-items-center" >
                     <div className="iron-app-logo py-sm-10">
                        <Link to="/"><img src={AppConfig.AppLogo} alt="header-logo" /></Link>
                     </div>
                  </Grid>
                  <Grid item xs={6} sm={6} md={9} lg={9} xl={9} >
                     <div className="iron-header-widgets d-flex justify-content-end align-items-center">
                        <HeaderMenu />
                        {this.props.isLoggedIn && this.props.isCustomer && <Cart />}
                        {this.props.isLoggedIn && <Logout />}
                        {!this.props.isLoggedIn && <Button component={Link} to={"/sign-in"} className="button-outline btn-white">Sign In</Button>}
                        <SidebarMenu />
                     </div>
                  </Grid>
               </Grid>
            </div>
         </div>
      );
   }
}

export default connect(   
   state => ({
      isLoggedIn: state.Auth.idToken ? true : false,
      isCustomer: !state.Auth.idProfile ? false : JSON.parse(state.Auth.idProfile).role === 1 ? true : false
   })
)(FixedHeader);