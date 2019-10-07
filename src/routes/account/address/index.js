/**
 * user address component
 */
import React from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';


function UserAddress(props) {

   return (
      <div className="profile-wrapper p-sm-15">
         <h4>Address Infomation</h4>
         <Grid container spacing={4} className="my-0">
            <Grid item xs={12} sm={6} md={6} lg={5} xl={4}>
               <h5 className="mb-25">Billing Address</h5>
               <div>
                  <address className="mb-25">
                     {props.profile.address}
                     <br />
                     {props.profile.city}
                     <br />
                     {props.profile.state}
                     <br />
                     {props.profile.zipcode}
                  </address >
                  <Button component={Link} to={{ pathname: "edit", search: "?type=address" }} className="button btn-active">edit</Button>
               </div >
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={5} xl={4}>
               <h5 className="mb-25">Shipping Address</h5>
               <div>
                  <address className="mb-25">
                     {props.profile.s_address ? props.profile.s_address : props.profile.address}
                     <br />
                     {props.profile.s_city ? props.profile.s_city : props.profile.city}
                     <br />
                     {props.profile.s_state ? props.profile.s_state : props.profile.state}
                     <br />
                     {props.profile.s_zipcode ? props.profile.s_zipcode : props.profile.zipcode}
                  </address >
                  <Button component={Link} to={{ pathname: "edit", search: "?type=ship-address" }} className="button btn-active">edit</Button>
               </div >
            </Grid >
         </Grid >
      </div >
   )
}

export default connect(
	state => ({
		profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null
	}), {})(UserAddress);