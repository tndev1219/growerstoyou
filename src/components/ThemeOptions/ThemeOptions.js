/**
 * Theme Options
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
// redux actions
import {
   rtlLayoutAction
} from '../../actions/action';

class ThemeOptions extends Component {

   rtlLayoutOption(value) {
      let body = document.body;
      if (value === true) {
         body.classList.add("rtl-layout");
      }
      else {
         body.classList.remove("rtl-layout");
      }
      this.props.rtlLayoutAction(value);
   }

   render() {
      const { rtlLayout } = this.props;
      return (
         <div className="custom-box">
            <div>
               {rtlLayout === false ?
                  <Button className="btn rtl-box py-10 px-0" onClick={() => this.rtlLayoutOption(true)}>RTL</Button>
                  :
                  <Button className="btn rtl-box py-10 px-0" onClick={() => this.rtlLayoutOption(false)}>LTR</Button>
               }
            </div>
         </div>
      );
   }
}

// map state to props
const mapStateToProps = ({ appSettings }) => {
   const { rtlLayout } = appSettings;
   return { rtlLayout };
};

export default connect(mapStateToProps, {
   rtlLayoutAction
})(ThemeOptions);
