/**
 * FarmerAdminInfo header widget
*/
/* eslint-disable */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import authAction from '../../../redux/auth/actions';
import AccountCircle from '@material-ui/icons/AccountCircle';
import appConfig from '../../../constants/AppConfig';

class DriverInfo extends React.Component {
  state = {
    anchorEl: null,
    user: {
      url: '',
      alt: 'user'
    },
    menus: [
      {
        id: 1,
        title: 'Profile',
        icon: 'account_circle',
        path: '/driver/account/profile'
      }
    ]
  };

  //define function for open dropdown
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  //define function for close dropdown
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSignout = () => {
    this.setState({ anchorEl: null });
    this.props.logout();
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const user = this.state.user;
    const { profile } = this.props;

    if (profile && profile.avatar) {
      user.url = `${appConfig.S3_BUCKET}${profile.avatar}`;
    }
    
    return (
      <div className='iron-logout-wrap'>
        {profile && profile.avatar ? 
          <Avatar
            aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
            className="icon-btn"
            alt={user.alt} src={user.url}
          >
          </Avatar>					
        :
          <Avatar
            aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
            className="icon-btn"
          >
            <AccountCircle />
          </Avatar>					
        }
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
          className="iron-dropdown"
        >
          {this.state.menus.map((menu, index) => (
            <MenuItem
              key={index}
              onClick={this.handleClose}
              to={menu.path}
              component={Link}
            >
              <i className="material-icons">{menu.icon}</i>
              <span className="mb-0">{menu.title}</span>
            </MenuItem>
          ))}
          <MenuItem
            key={2}
            onClick={this.handleSignout}
          >
            <i className="material-icons pr-10">{'power_settings_new'}</i>
            <span className="mb-0">Logout</span>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect(   
  state => ({
    isLoggedIn: state.Auth.idToken ? true : false,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null
  }), {logout: authAction.logout})(DriverInfo);