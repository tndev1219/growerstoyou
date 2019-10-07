import React, {Fragment} from 'react';
import { connect } from "react-redux";
import SweetAlert from 'react-bootstrap-sweetalert';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

// actions
import { hideAlert, hideConfirmAlert } from "./actions/action";

// themes
import primaryTheme from './themes/primaryTheme';

// Admin Layout
import FarmerLayout from './components/FarmerLayout';

import DriverLayout from './components/DriverLayout';

// css
import './lib/embryoCss.js';

// App locale
import AppLocale from './lang';

//layout 
import Header from "./components/layouts/headers/Header";

// footer data
import footerData from './assets/data/footerData';
import Footer from "./components/layouts/footers/Footer";

//Add Loaders
import {
  AsyncHomePageComponent,
  AsyncPageNotFoundComponent,
  AsyncAboutUsPageComponent,
  AsyncRegistrationPageComponent,
  AsyncSignInPageComponent,
  AsyncForgotPasswordPageComponent,
  AsyncResetPasswordPageComponent,
  AsyncContactUsPageComponent,
  AsyncCheckoutPageComponent,
  AsyncShopNowPageComponent,
  AsyncProductDetailPageComponent,
  AsyncCartPageComponent,
  AsyncUserAccountComponent
} from './util/AsyncRoutes';

import './App.css';

class App extends React.Component {
  /**
    * method for update window top when new page render
    */
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
    }
  }

  getUrl(pathname) {
    let pathArray = pathname.split('/');
    const admins = ['/driver', '/farmer'];
    const isAdmin = admins.indexOf(`/${pathArray[1]}`) > -1
    return isAdmin;
  }

  toLoginPage() {
    this.props.hideConfirmAlert();
    this.props.history.push('/sign-in');
  }

  render() {
    const { location } = this.props;
    const { selectedLocale,  alertType } = this.props;
    const currentAppLocale = AppLocale[selectedLocale.locale];
    return (
      <MuiThemeProvider theme={primaryTheme}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <Fragment>
            {
              this.getUrl(location.pathname) ?
              <Fragment>
                <Route path="/farmer" component={FarmerLayout} />
                <Route path="/driver" component={DriverLayout} />
              </Fragment>
              :
              <div className="App frontend">
                <Header />
                <Switch>
                  <Route exact path="/" component={AsyncHomePageComponent} />
                  <Route exact path="/about-us" component={AsyncAboutUsPageComponent} />
                  <Route exact path="/sign-up" component={AsyncRegistrationPageComponent} />
                  <Route exact path="/sign-in" component={AsyncSignInPageComponent} />
                  <Route exact path="/forgot-password" component={AsyncForgotPasswordPageComponent} />
                  <Route exact path="/reset-password" component={AsyncResetPasswordPageComponent} />
                  <Route exact path="/contact-us" component={AsyncContactUsPageComponent} />
                  <Route exact path="/check-out" component={AsyncCheckoutPageComponent} />
                  <Route exact path="/shop" component={AsyncShopNowPageComponent} />
                  <Route exact path="/product-detail/:id" component={AsyncProductDetailPageComponent} />
                  <Route exact path="/cart" component={AsyncCartPageComponent} />
                  <Route path="/account" component={AsyncUserAccountComponent} />
                  <Route path="*" component={AsyncPageNotFoundComponent} />
                </Switch>
                <Footer data={footerData} />
              </div>
            }
            <SweetAlert
              success={alertType === 'success'}
              error={alertType === 'error'}
              title=''
              confirmBtnText="Ok"
              confirmBtnBsStyle="warning"
              // className="iron-alert-box"
              show={this.props.showAlert}
              onConfirm={this.props.hideAlert}
              onCancel={this.props.hideAlert}
              closeOnClickOutside
            >
              {this.props.alertMessage}
            </SweetAlert>
            <SweetAlert
              error
              showCancel
              title=""
              confirmBtnText="Login"
              confirmBtnBsStyle="primary"
              cancelBtnBsStyle="warning"
              className="iron-alert-box"
              show={this.props.showConfirmAlert}
              onConfirm={this.toLoginPage.bind(this)}
              onCancel={this.props.hideConfirmAlert}
              closeOnClickOutside
            >
              {this.props.alertConfirmMessage}
            </SweetAlert>
          </Fragment>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

// map state to props
const mapStateToProps = ({ appSettings }) => {
  const { showAlert, alertMessage, showConfirmAlert, alertConfirmMessage, selectedLocale, alertType } = appSettings;
  return { showAlert, alertMessage, showConfirmAlert, alertConfirmMessage, selectedLocale, alertType };
}

export default connect(mapStateToProps, {
  hideAlert, hideConfirmAlert
})(App);
