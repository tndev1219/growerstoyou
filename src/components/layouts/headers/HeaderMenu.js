/* eslint-disable */
/**
 * Header menu component
 */
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classnames from "classnames";
import { connect } from "react-redux";
import { showAlert } from '../../../actions/action';

// intl messages
import IntlMessages from '../../../util/IntlMessages';

// nav links
import navLinks from '../../../assets/data/NavLinks.js';

function HeaderMenu(props) {
  const { role, showAlert } = props;
   return (
      <div className="horizontal-menu">
         <ul className="d-inline-block iron-header-menu mb-0">
            {navLinks.map((navLink, index) => {
               return (
                  <li key={index}>
							{String(role) === "1" && (navLink.menu_title === "menu.farmer" || navLink.menu_title === "menu.driver") ? 
								<a href="javascript:void(0)" onClick={() => {showAlert("You have no permission!", 'error')}}><IntlMessages id={navLink.menu_title} /></a>
								:
								String(role) === "4" && navLink.menu_title === "menu.farmer"?
									<a href="javascript:void(0)" onClick={() => {showAlert("You have no permission!", 'error')}}><IntlMessages id={navLink.menu_title} /></a>
									:
									String(role) === "2" && navLink.menu_title === "menu.driver" ?
										<a href="javascript:void(0)" onClick={() => {showAlert("You have no permission!", 'error')}}><IntlMessages id={navLink.menu_title} /></a>
										:
										String(role) === "null" && (navLink.menu_title === "menu.farmer" || navLink.menu_title === "menu.driver") ?
											<Link to={'/sign-in'}><IntlMessages id={navLink.menu_title} /></Link>
											:
											<Link to={navLink.path}><IntlMessages id={navLink.menu_title} /></Link>
							}
                  </li>
               )
            })}
         </ul>
      </div>
   );
}

export default connect(
	state => ({
		role: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile).role : null
	}), {showAlert})(HeaderMenu);
