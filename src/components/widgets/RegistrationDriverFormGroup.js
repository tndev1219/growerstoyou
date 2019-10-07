/**
 * Go Green Go Organic component
 */
/* eslint-disable */
import React from 'react';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import CustomizedInputs from '../global/forms/CustomizedInputs';
import CustomizedSelect from '../global/forms/CustomizedSelect';
import DatePicker from '../global/forms/DatePicker';
import { abbreviation2Name, states } from '../../assets/data/states';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);
import authAction from "../../redux/auth/actions";

const { waiting, showAlert } = authAction;

function RegistrationCommonFormGroup(props) {
  const { errors, handleChange, setDate, uploadLicenseId, waiting, showAlert } = props;

  function pad(n) {
    return n<10 ? '0'+n : n;
  }

  return (
    <Grid container className="section-content" spacing={4}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <CustomizedInputs 
          label="Driver's License No" 
          isRequire={true}
          inputType="text" 
          name="licenseNumber" 
          error={errors["licenseNumber"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <DatePicker 
          label="Issued Date"
          name="issuedDate"
          isRequire={true}
          error={errors["issuedDate"]} 
          setDate={setDate}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <DatePicker 
          label="Expiry Date"
          name="expiryDate"
          isRequire={true}
          error={errors["expiryDate"]} 
          setDate={setDate}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <CustomizedInputs 
          label="Street Address (According to Driver's ID)" 
          isRequire={true}
          inputType="text" 
          name="driverStreetAddress" 
          error={errors["driverStreetAddress"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <CustomizedInputs 
          label="Town/City" 
          isRequire={true}
          inputType="text" 
          name="driverTownCity" 
          error={errors["driverTownCity"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <CustomizedSelect 
          label="State"
          isRequire={true}
          name="driverState"
          error={errors["driverState"]}
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
          name="driverZip" 
          error={errors["driverZip"]} 
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <PhotoPicker 
          title="Upload license image"
          preview
          onPick={data => {
            var currentDate = new Date()
            var date = currentDate.getDate();
            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();
            var timeStamp = `${year}${pad(month + 1)}${date}${Date.now()}`;
            var extension = data.name.split('.')[data.name.split('.').length-1];

            waiting(true);

            Storage.put(`driverLicenseImage/${timeStamp}.${extension}`, data.file, { contentType: 'image/*' })
              .then (result => {
                uploadLicenseId(result.key);
                waiting(false);
              })
              .catch(err => {
                uploadLicenseId('');
                waiting(false);
                showAlert('Failed to upload image. Please try again later...', 'error');
              });
          }}
        />
      </Grid>
    </Grid>
  )
}

export default connect(null, { waiting, showAlert })(RegistrationCommonFormGroup);
