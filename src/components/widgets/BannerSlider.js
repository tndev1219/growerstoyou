/**
 * banner slider component
 */
/* eslint-disable */
import React from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import { Button, Grid } from '@material-ui/core';
import appConfig from '../../constants/AppConfig';

function BannerSlider(props) {
   const settings = {
      dots: true,
      infinite: true,
      arrows: true,
      speed: 500,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 600,
            settings: {
               arrows: false,
            }
         }
      ]
   };

   const { sliderdata } = props
   return (
      <div className="iron-banner-slider iron-post-wrap">
         <Slider {...settings}>
            {sliderdata.map((slidedata, index) => {
               return (                  
                  <div key={index} className="iron-post-item iron-shadow">
                     <div className="iron-overlay-wrap">
                        <div className="iron-thumb-wrap">
                           <img src={`${appConfig.S3_BUCKET}${slidedata.image}`} alt="slide-1" />
                        </div>
                        <div className="iron-overlay-content d-flex justify-content-start align-items-center">
                           <Grid container>   
                              <Grid item xs={1} sm={1} md={1} lg={1} xl={1}/>
                              <Grid item xs={10} sm={10} md={8} lg={8} xl={8} className="iron-overlay-holder">
                                 <h2>{slidedata.title}</h2>
                                 <h1>{slidedata.subtitle}</h1>
                                 <h4>{slidedata.description}</h4>
                                 <Button component={Link} to={"/shop"} className="button btn-active">shop now</Button>
                              </Grid>
                           </Grid>
                        </div>
                     </div>
                  </div>
               )
            })}
         </Slider>
      </div>
   );
}

export default BannerSlider;