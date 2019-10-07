/**
 * Welcome component
 */
/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { ArrowForwardRounded } from '@material-ui/icons';


function Welcome(props) {
  return (
    <div>
      <div className="iron-sec-heading-wrap heading-font-v2 text-center">
        <div className="heading-title">
          <h2>Welcome to GrowersToYou</h2>
        </div>
        <Grid container className="section-content" spacing={5}>
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4} className="mark-image">
            <img src={require('../../assets/images/image-welcome.png')} alt='static' />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={7} className="mt-30">
            <h4>About Us</h4>
            <p>Mauris id ipsum et magna egestas volutpat in ac neque. Phasellus sit amet risus sit amet elit ultrices rutrum. Proin vel gravida risus, mollis egestas velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque accumsan faucibus arcu id maximus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos</p>
            <Button className="button btn-active right-icon">Learn More
              <ArrowForwardRounded fontSize="small"/>
            </Button>
            <Button className="button-outline ml-40 right-icon">Visit Store
              <ArrowForwardRounded fontSize="small"/>
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Welcome;
