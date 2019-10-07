/**
 * Our Products component
 */
/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Button, Paper, ButtonBase, withStyles } from '@material-ui/core';

function HowItWorks(props) {
  const categories = [{
    image: require('../../assets/images/cat-fruit.png'),
    title: 'Fruit',
    url: '/'
  },
  {
    image: require('../../assets/images/cat-vegatable.png'),
    title: 'Vegetable',
    url: '/'
  },
  {
    image: require('../../assets/images/cat-fruit.png'),
    title: 'Dry Fruit',
    url: '/'
  }]
  return (
    <div className="iron-sec-heading-wrap heading-font-v2 text-center background-2">
      <div className="heading-title mb-40">
        <h2>How It Works</h2>
      </div>
      <div className="background-2 mb-40 mt-40">
        <div className="container">
          <h4>
            Shop directly from the farmer’s inventory list from the comfort of your device. Simply put in your zip code and surf through farm produce from farms within your zip code. Add your products to your cart, leave a message for the farmer and relax while we have our driver deliver your produce to your door step in less than&nbsp;
            <span>TWO HOURS</span>
          </h4>
          <h4>
            Subscribe for any of our affordable monthly plans and have your selected produce delivered to you monthly for&nbsp;
            <span className="primary">FREE!</span>
          </h4>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks;
