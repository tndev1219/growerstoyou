/**
 * site header one component
 */
/* eslint-disable */
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from "@material-ui/core/Grid";

// components
import LanguageProvider from "./LanguageProvider";
import HeaderMenu from "./HeaderMenu";
import CurrencyProvider from "./CurrencyProvider";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import Logout from "./Logout";
import SearchBox from "./SearchBox";
import SidebarMenu from '../sidebar';
import FixedHeader from '../headers/FixedHeader';
import AppConfig from '../../../constants/AppConfig';

class Header extends React.Component {

   render() {
      return (
         <div>
            <AppBar position="static" className={`iron-header-wrapper bg-primary iron-header-v1 header-fixed`}>               
               <FixedHeader />
            </AppBar>
         </div>
      );
   }
}

export default Header;