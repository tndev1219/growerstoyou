/**
 * Welcome component
 */
/* eslint-disable */
import React, {Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { ArrowForwardRounded } from '@material-ui/icons';
import { whoweare } from '../../assets/data/whoweareData';


function WhoWeAre(props) {
  return (
    <div>
      <div className="iron-sec-heading-wrap heading-font-v2 text-center">
        <div className="heading-title">
          <h2>{whoweare.title}</h2>
        </div>
        <Grid container className="section-content" spacing={5}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt-30">
            <p>{whoweare.content}</p>
            {
              whoweare.items.map(item => {
                return(
                  <Fragment key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                  </Fragment>
                )
              })
            }
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default WhoWeAre;
