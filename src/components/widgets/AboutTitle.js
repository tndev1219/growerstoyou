/**
 * Page title component
 */
import React from 'react';
import { Button, InputBase, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

function AboutTitle(props) {
  return (
    <div className="about-title-bar text-center">
      <div className="container">
        <h2 className="mb-30">We Are More Than Just A Company</h2>
        <p className="lead text-capitalize mb-50">About Us</p>
        <div>
          <InputBase placeholder="ZIP CODE" className="rounded-input mr-20 text-center" id="zipcode" style={{ 'width': '6rem'}}
            inputProps={{
              style: { textAlign: "center", color: "black"}
            }}
            type="text"
          />
          <Button component={Link} to={"/shop"} className="button btn-active ml-20">shop now</Button>
        </div>
        <IconButton className="mt-50">
          <img src={require('../../assets/images/arrow-down.png')} alt='IF' />
        </IconButton>
      </div>
    </div>
  )
}

export default AboutTitle;