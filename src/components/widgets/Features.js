/**
 * features component
 */
/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';

const siteFeatures = [
   {
     image: "free-shipping.png",
     title: "Free Shipping",
     desc: " "
   },
   {
     image: "gift-card.png",
     title: "Special Gift Card",
     desc: "THE PERFECT GIFT IDEA"
   },
   {
     image: "discounts.png",
     title: "Special Discounts",
     desc: "WEEKY PROMOTIONS"
   },
   {
     image: "support.png",
     title: "24/7 Customer Care",
     desc: "HOURS: 8:00 – 20:00 MON – SAT"
   },
 ]

function Features(props) {
   return (
      <div>
         <Grid container spacing={0} className="pl-20 pr-20">
            {
               siteFeatures.map((siteFeature, index) => {
                  return (
                     <Grid key={index} item xs={12} sm={3} md={3} lg={3} xl={3} className="iron-col">
                        <div className="iron-features-post p-20 px-sm-30 px-lg-50 pt-sm-10 pb-sm-10 d-md-flex justify-content-start align-items-center text-sm-left text-center ">
                           <div className="iron-features-thumb mr-sm-20 mb-md-0">
                              <img src={require(`../../assets/images/${siteFeature.image}`)} alt="free-delivery"/>
                           </div>
                           <div className="iron-features-content">
                              <h6 className="mb-0">{siteFeature.title}</h6>
                              <p className="text-capitalize mb-0">{siteFeature.desc}</p>
                           </div>
                        </div>
                     </Grid>
                  )
               })
            }
         </Grid>
      </div>
   )
}

export default Features;
