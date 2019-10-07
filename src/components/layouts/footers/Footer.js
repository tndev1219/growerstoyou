/**
 * site footer one component
 */
/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {ArrowForwardRounded} from '@material-ui/icons';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';

// intl message
import IntlMessages from '../../../util/IntlMessages';

//App Config
import AppConfig from '../../../constants/AppConfig';
import { Button } from '@material-ui/core';

export default function Footer(props) {

   const { social, links, categories, about } = props.data;
   return (
      <footer className="iron-footer-v1">
         <div className="iron-footer-top ">
            <div className="container" >
               <Grid container spacing={3} >
                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3} >
                     <div>
                        <div className="footer-widget-title mb-30">
                           <h5>about GrowersToYou</h5>
                        </div>
                        <div className="footer-content">
                           <p>{AppConfig.AboutUs}</p>
                           <Button className="button-outline btn-white right-icon">Learn More
                              <ArrowForwardRounded fontSize="small"/>
                           </Button>
                        </div>
                     </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                     <div>
                        <div className="footer-widget-title mb-30">
                           <h5>Our Products</h5>
                        </div>
                        <List component="nav" className="iron-footer-menu-list">
                           {
                              categories.map((category, key) => {
                                 return (
                                    <li key={key} className="list-item">
                                       <Link to={category.path} xd={12}>
                                          <img src={require('../../../assets/images/leaf.png')} alt='IF' />
                                          <IntlMessages id={category.menu_title} />
                                       </Link>
                                    </li>
                                 )
                              })
                           }
                        </List>
                     </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                     <div>
                        <div className="footer-widget-title mb-30">
                           <h5>Quick Links</h5>
                        </div>
                        <List component="nav" className="iron-footer-menu-list">
                           {
                              links.map((link, key) => {
                                 return (
                                    <li key={key} className="list-item">
                                       <Link to={link.path}>
                                          <img src={require('../../../assets/images/leaf.png')} alt='IF' />
                                          <IntlMessages id={link.menu_title} />
                                       </Link>
                                    </li>
                                 )
                              })
                           }
                        </List>
                     </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                     <div>
                        <div className="footer-widget-title mb-30">
                           <h5>Contact Us</h5>
                        </div>
                        <List component="nav" className="iron-footer-menu-list">
                           <li className="list-item">
                              <Link to="/">
                                 <img src={require('../../../assets/images/phone.png')} alt='IF' />
                                 <span >+1 888-111-1234</span>
                              </Link>
                           </li>
                           <li className="list-item">
                              <Link to="/">
                                 <img src={require('../../../assets/images/mail.png')} alt='IF' />
                                 <span style={{textTransform: 'none'}}>info@growerstoyou.com</span>
                              </Link>
                           </li>
                           <li className="list-item">
                              <Link to="/">
                                 <img src={require('../../../assets/images/globe.png')} alt='IF' />
                                 <span style={{textTransform: 'none'}}>www.growerstoyou.com/</span>
                              </Link>
                           </li>
                        </List>
                     </div>
                  </Grid>
               </Grid>
               <hr className="footer-hr mt-50" />
            </div>
         </div>
         <div className="iron-footer-bottom">
            <div className="container">
               <Grid container >
                  <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className="text-center vertical-center text-lg-left mb-30 mb-lg-0">
                     <div>
                        <span>We accept payments from </span>
                        <img src={require('../../../assets/images/payment-method.png')} alt='payment-method' />
                     </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className="text-center vertical-center-center mb-30 mb-lg-0">
                     <div className="iron-copyright text-center">
                        <span className="mb-0">{AppConfig.CopyrightText}</span>
                     </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                     <div className="iron-copyright text-lg-right text-center">
                        <span className="mb-0">Follow us On</span>
                        <IconButton>
                           <img src={require('../../../assets/images/facebook3.png')} alt='IF' />
                        </IconButton>
                        <IconButton>
                           <img src={require('../../../assets/images/linkedin-with-circle.png')} alt='IF' />
                        </IconButton>
                        <IconButton>
                           <img src={require('../../../assets/images/twitter3.png')} alt='IF' />
                        </IconButton>
                     </div>
                  </Grid>
               </Grid>
            </div>
         </div>
      </footer>
   )
}
