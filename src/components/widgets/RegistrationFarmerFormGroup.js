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
    <Grid container className="section-content" spacing={4}>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <CustomizedInputs 
          label="Farm Name" 
          isRequire={true}
          inputType="text" 
          name="farmName" 
          error={errors["farmName"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <CustomizedInputs 
          label="Farm URL (Optional)" 
          inputType="text" 
          name="farmURL" 
          error={errors["farmURL"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <CustomizedInputs 
          label="Farm Street Address" 
          isRequire={true}
          inputType="text" 
          name="farmStreetAddress" 
          error={errors["farmStreetAddress"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <CustomizedInputs 
          label="Town/City" 
          isRequire={true}
          inputType="text" 
          name="farmTownCity" 
          error={errors["farmTownCity"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <CustomizedSelect 
          label="State"
          isRequire={true}
          name="farmState"
          error={errors["farmState"]}
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
          name="farmZip" 
          error={errors["farmZip"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <CustomizedInputs 
          label="Phone Number" 
          isRequire={true}
          inputType="text" 
          name="farmPhoneNumber" 
          error={errors["farmPhoneNumber"]} 
          handleChange={handleChange}
        />
      </Grid>
    </Grid>
  )
}

export default RegistrationCommonFormGroup;
