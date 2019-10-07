import React, { Fragment } from 'react';
import { connect } from "react-redux";
//component
import BannerSlider from '../../components/widgets/BannerSlider';
import OurProducts from '../../components/widgets/OurProducts';
import Welcome from '../../components/widgets/Welcome';
import Features from '../../components/widgets/Features';
import MostSellingProducts from '../../components/widgets/MostSellingProducts';
import { api } from '../../api';
import { showAlert } from '../../actions/action';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderdata: [],
      categorydata: []
    }
  }
  componentWillMount() {
    var self = this;
    api.POST('introduction/getall')
      .then(function(res) {
        if (res.data.success) {
          self.setState({ sliderdata: res.data.results });
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
      })

    api.POST('pcategory/getall')
      .then(function(res) {
        if (res.data.success) {
          self.setState({ categorydata: res.data.results });
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
      })
  }
  render() {
    return(
      <Fragment>
        <div className="iron-home-wrap page-pad">
          <div className="iron-banner-wrapper" >
            <BannerSlider sliderdata={this.state.sliderdata} />
          </div>
          <div className="iron-welcome-wrapper section-pad background-1" >
            <div className="container">
              <Welcome />              
            </div>
          </div>
          <div className="iron-ourproducts-wrapper section-pad">
            <OurProducts categorydata={this.state.categorydata} />
          </div>
          <div className="background-3 section-pad mt-60 pb-60">
            <div className="container mb-60">
              <MostSellingProducts />
            </div>            
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

export default connect(null, { showAlert })(HomePage);