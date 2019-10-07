import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CustomizedInputs from '../../../components/global/forms/CustomizedInputs';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return(
      <Fragment>
        <form>
          <div className="section-pad">
            <div className="iron-sec-heading-wrap heading-font-v2 text-center">
              <div className="heading-title mb-40">
                <h2>You've Got Questions? We've Got Answers!</h2>
              </div>
            </div>
          </div>
          <div className="mt-40">
            <div className="formgroup-container mb-20">
              <Grid container spacing={5}>
                <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CustomizedInputs label="Full Name"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CustomizedInputs label="Email Address" isRequire={true}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CustomizedInputs label="Phone Number (Optional)"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CustomizedInputs label="Message" isRequire={true} isMultiline={true} rowsNumber="12"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mb-30">
                      <Button type="submit" component={Link} to="/#" className="button btn-active btn-sm right-content mb-30">
                        SEND MESSAGE
                      </Button>
                      <p>Please allow up to 24 hours to get a response to your message.</p>
                      <p>Thank you.</p>
                    </Grid>
                  </Grid>                    
                </Grid>
                <Hidden xsDown>
                  <Grid item sm={5} md={5} lg={5} xl={5}>
                    <Grid container spacing={4} justify="flex-end" className="contact-info">
                      <Grid item sm={10} md={10} lg={10} xl={10}>
                        <h4>InstaFarm Inc</h4>
                        <span className="company-info">
                          111 XX Street,<br></br>
                          City,<br></br>
                          State,<br></br>
                          USA
                        </span>
                      </Grid>
                      <Grid item sm={10} md={10} lg={10} xl={10}>
                        <span>support@instafarm.com</span>
                      </Grid>
                      <Grid item sm={10} md={10} lg={10} xl={10}>
                        <span>888-222-2222</span>
                      </Grid>
                    </Grid>
                  </Grid>
                </Hidden>
              </Grid>
            </div>
          </div>
        </form>
      </Fragment>
    )
  }
}

export default HomePage