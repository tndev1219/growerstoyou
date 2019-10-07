import React, { Fragment } from 'react';
import WhoWeAre from '../../components/widgets/WhoWeAre';
import AboutTitle from '../../components/widgets/AboutTitle';
import Features from '../../components/widgets/Features';
import HowItWorks from '../../components/widgets/HowItWorks';

class HomePage extends React.Component {
  render() {
    return(
      <Fragment>
        <div className="iron-about-page-wrap page-pad">
          <AboutTitle />
          <div className="iron-welcome-wrapper section-pad background-1" >
            <div className="container">
              <WhoWeAre />              
            </div>
          </div>
          <div className="iron-howitworks-wrapper section-pad">
            <HowItWorks />
          </div>
          <img src={require('../../assets/images/feature-image-1.jpg')} alt='fruit'/>
          <div className="iron-features-wrap" >
              <Features/>
            <div className="container">          
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default HomePage