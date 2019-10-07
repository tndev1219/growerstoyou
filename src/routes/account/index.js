/**
 * account detail page
 */
/* eslint-disable */
import React from 'react';
import { connect } from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import appConfig from '../../constants/AppConfig';

// async components
import {
  AsyncUserOrderHistoryComponent,
  AsyncUserProfileComponent,
  AsyncUserAddressComponent,
  AsyncUserCardsComponent,
  AsyncUserEditComponent
} from '../../util/AsyncRoutes';

function Account({ match, profile }) {
   const userData = [
      {
         icon: 'history',
         title: 'order history',
         path: "order-history",
      },
      {
         icon: 'account_circle',
         title: 'profile',
         path: "profile",
      },
      {
         icon: 'location_on',
         title: 'address',
         path: "address",
      },
      {
         icon: 'credit_card',
         title: 'saved cards',
         path: "cards",
      }
   ]

   return (
      <div className="iron-user-info-wrap">
         <div className="container section-pad">
            <div className="user-profile-wrap d-flex mb-15">
               <div className="user-avatar">
						{profile && profile.avatar ?
							<Avatar src={`${appConfig.S3_BUCKET}${profile.avatar}`} alt="user-img" />
						:
							<Avatar className="profile-avatar">
								<AccountCircle />
							</Avatar>
						}
                  
               </div>
               <div className="user-info pl-15">
                  <h4>Hi, {profile && profile.fname} {profile && profile.lname}</h4>
                  <span className="secondary-color">{profile && profile.email}</span>
               </div>
            </div>
            <Grid container spacing={2} className="my-0">
               <Grid item xs={12} sm={12} md={3} lg={3} className="py-0 mb-md-0 mb-30">
                  <div className="iron-shadow px-sm-30 px-15 h-100">
                     <ul className="user-info-links pt-10 mb-0">
                        {userData.map((userdata, index) => (
                           <li key={index} className="links d-block">
                              <Link
                                 className="d-flex justify-content-start align-items-center"
                                 to={`${match.url}/${userdata.path}`}
                              >
                                 <i className="material-icons">{userdata.icon}</i>
                                 {userdata.title}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               </Grid>
               <Grid item xs={12} sm={12} md={9} lg={9} className="py-0">
                  <div className="iron-shadow p-15 pt-20">
                     <Switch>
                        <Redirect exact from={`${match.url}`} to={`${match.url}/order-history`} />
                        <Route
                           path={`${match.url}/order-history`}
                           component={AsyncUserOrderHistoryComponent}
                        />
                        <Route
                           path={`${match.url}/profile`}
                           component={AsyncUserProfileComponent}
                        />
                        <Route
                           path={`${match.url}/address`}
                           component={AsyncUserAddressComponent}
                        />
                        <Route
                           path={`${match.url}/cards`}
                           component={AsyncUserCardsComponent}
                        />
                        <Route
                           path={`${match.url}/edit`}
                           component={AsyncUserEditComponent}
                        />
                     </Switch>
                  </div>
               </Grid>
            </Grid>
         </div>
      </div>
   )
}

export default connect(
	state => ({
		profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null
	}), {})(Account);
