/**
 * admin header component
 */
/* eslint-disable */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';

// actions
import { collapsedSidebarAction } from '../../../actions/action';
import DriverInfo from './DriverInfo';

class DriverNav extends Component {
   // function to change the state of collapsed sidebar
   onToggleNavCollapsed = (event) => {
      const val = !this.props.navCollapsed;
      this.props.collapsedSidebarAction(val);
   }
   render() {
      return (
         <div>
            <AppBar position="static" className="admin-header-wrap">
               <Toolbar>
                  <div className="d-flex justify-content-between align-items-center w-100">
                     <div className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
                        <Tooltip title="Sidebar Toggle" placement="bottom">
                           <IconButton mini="true" aria-label="Menu" className="humburger p-0 btn-white">
                              <MenuIcon />
                           </IconButton>
                        </Tooltip>
                     </div>
                     <div>
                        <DriverInfo />
                     </div>
                  </div>
               </Toolbar>
            </AppBar>
         </div>
      );
   }
}

// map state to props
const mapStateToProps = ({ appSettings }) => {
   return appSettings;
};

export default withRouter(connect(mapStateToProps, {
   collapsedSidebarAction
})(DriverNav));