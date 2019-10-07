/**
 * Go Green Go Organic component
 */
/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import CustomizedInputs from '../global/forms/CustomizedInputs';
import CustomizedSelect from '../global/forms/CustomizedSelect';
import { abbreviation2Name, states } from '../../assets/data/states';

function RegistrationCommonFormGroup(props) {
  const { errors, handleChange } = props;
  return (
    <div className="iron-sec-heading-wrap heading-font-v2 text-center">
      <div className="heading-title mb-40">
        <h2>Go Green! Go Organic!</h2>
      </div>
      <div className="formgroup-container">
        <Grid container className="section-content" spacing={4}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="First Name" 
              isRequire={true}
              inputType="text" 
              name="firstName" 
              error={errors["firstName"]} 
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Last Name" 
              isRequire={true}
              inputType="text"
              name="lastName"
              error={errors["lastName"]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomizedInputs 
              label="Street Address" 
              isRequire={true}
              inputType="text"
              name="streetAddress"
              error={errors["streetAddress"]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Town/City" 
              isRequire={true}
              inputType="text"
              name="townCity"
              error={errors["townCity"]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomizedSelect 
              label="State"
              isRequire={true}
              name="state"
              error={errors["state"]}
              values={states}
              abbreviation2Name={abbreviation2Name}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
            <CustomizedInputs 
              label="Zip" 
              isRequire={true}
              inputType="text"
              name="zip"
              error={errors["zip"]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Email Address" 
              isRequire={true}
              inputType="email" 
              name="email" 
              error={errors["email"]} 
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Confirm Email Address" 
              isRequire={true}
              inputType="email" 
              name="confirmEmail" 
              error={errors["confirmEmail"]} 
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Password" 
              isRequire={true}
              inputType="password" 
              name="password" 
              error={errors["password"]} 
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Confirm Password" 
              isRequire={true}
              inputType="password" 
              name="confirmPassword" 
              error={errors["confirmPassword"]} 
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CustomizedInputs 
              label="Phone Number" 
              isRequire={true}
              inputType="text" 
              name="phoneNumber" 
              error={errors["phoneNumber"]} 
              handleChange={handleChange}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default RegistrationCommonFormGroup;
