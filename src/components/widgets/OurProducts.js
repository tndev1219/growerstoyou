/**
 * Our Products component
 */
/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonBase, Grid } from '@material-ui/core';
import appConfig from '../../constants/AppConfig';

function OurProducts(props) {
  const { categorydata } = props;
  return (
    <div>
      <div className="iron-sec-heading-wrap heading-font-v2 text-center">
        <div className="heading-title mb-40">
          <h2>Our Products</h2>
        </div>
        <div className="background-2 mb-40 mt-40 pt-30">
          <div className="container">
            <Grid container className="section-content" spacing={5}>
              {categorydata.map((category, key) => {
                return(
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4} className="mark-image" key={key}>
                    <ButtonBase component={Link} to="/shop">
                      <div className="home-category-item">
                        <img src={`${appConfig.S3_BUCKET}${category.image}`} alt='fruit'/>
                        <h4>{category.name}</h4>
                      </div>
                    </ButtonBase>
                  </Grid>
                )
              })}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurProducts;
