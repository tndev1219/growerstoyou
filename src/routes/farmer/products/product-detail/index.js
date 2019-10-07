/**
 * post detail component
*/
/* eslint-disable */
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { Grid, Button, Input, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { api } from '../../../../api';
import { showAlert } from '../../../../actions/action';
import appConfig from '../../../../constants/AppConfig';

//components
import ContentLoader from '../../../../components/global/loaders/ContentLoader';

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      productId: parseInt(this.props.match.params.id),
      currentDataItem: null,
      previewImage: ''
    };
  }

  componentWillMount() {
    var payload = {
      id: this.state.productId
    }
    var self = this;
    var currentDataItem = [];

    api.POST('product/getbyid', payload)
    .then(function(res) {
      if (res.data.success) {
        var pictures = res.data.results.images;
        var previewImage = res.data.results.images[0];

        currentDataItem = res.data.results;
        self.setState({ currentDataItem, pictures, previewImage });
      } else {
        self.setState({ currentDataItem });
        self.props.showAlert(res.data.message, 'error');
      }
    })
    .catch(function(err) {
      self.setState({ currentDataItem });
      self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
    })
  }
  
  changePreviewImage = (previewImage) => {
    this.setState({ previewImage });
  };

  render() {
    const { currentDataItem } = this.state;

    return (
      <Fragment>
        {currentDataItem !== null ?
          <div className="iron-product-add-wrap iron-product-edit-wrap pt-50 px-sm-50 px-md-0">
            <Grid container spacing={4} className="my-0">
              <Grid item xs={12} sm={12} md={10} lg={9} className="py-0 mx-auto">
                <Grid container spacing={4} className="my-0">
                  <Grid item xs={12} sm={12} md={6} lg={6} className="py-0 mb-md-0 mb-30">
                    <Grid container spacing={3} className="iron-product-gallery my-0">
                      <Grid item xs={3} sm={2} md={2} lg={2} className="py-0">
                        <div className="product-gallery-nav">
                          {currentDataItem.images && currentDataItem.images.map((gallery, index) => {
                            return (
                              <div key={index} className="iron-shadow product-gallery-item">
                                <div className="image-upload">
                                  <a href="javascript:void(0)">
                                    <img
                                      src={`${appConfig.S3_BUCKET}${gallery}`}
                                      alt="product-item"
                                      height="50"
                                      onMouseOver={() => this.changePreviewImage(gallery)}
                                    />
                                  </a>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </Grid>
                      <Grid item xs={9} sm={10} md={10} lg={10} className="py-0">
                        <div className="preview-full-image iron-shadow product-gallery-item product-preview-image">
                          <a href="javascript:void(0)">
                            <img
                              src={`${appConfig.S3_BUCKET}${this.state.previewImage}`}
                              alt="product-item"
                            />
                          </a>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} className="py-0">
                    <div className="detail-content">
                      <Link to="/farmer/products" className="text-14 d-inline-block font-medium py-10 mb-10">Back to products</Link>
                        <form className="product-values" style={{lineHeight: "40px"}}>
                          <div className="d-flex justify-content-start align-items-start mb-10">
                            <div className="text-capitalize add-product-input text-h3">
                              {currentDataItem.name}
                            </div>
                          </div>
                          <div className="mb-10">
                            <h6 className="text-14 mb-0  ">price/unit :</h6>
                            <Input
                              defaultValue={`$${currentDataItem.price}/${currentDataItem.unit}`}
                              className="add-product-input pl-10 product-input-form"
                              inputProps={{
                                'aria-label': 'Description',
                              }}
                              style={{color: "black"}}
                              disabled
                            />
                          </div>
                          <div className="mb-10">
                            <h6 className="text-14 mb-0  ">category :</h6>
                            <Input
                              defaultValue={currentDataItem.category.category_name}
                              className="text-capitalize add-product-input pl-10 product-input-form"
                              inputProps={{
                                'aria-label': 'Description',
                              }}
                              style={{color: "black"}}
                              disabled
                            />
                          </div>
                          <div className="mb-10">
                            <h6 className="text-14 mb-0  ">description :</h6>
                            <p className="text-capitalize add-product-input pl-10 text-field-color">
                              {currentDataItem.description}
                            </p>
                          </div>
                          <div className="mb-10">
                            <h6 className="text-14 mb-0  ">total products :</h6>
                            <TextField
                              id="filled-number"
                              defaultValue={currentDataItem.count}
                              type="number"
                              className="iron-select-width2 pl-10 text-field-color product-input-form"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              disabled
                            />
                          </div>
                        </form>
                        <div className="mb-sm-50 mb-20 detail-btns">
                          <Button
                            className="button btn-active btn-lg mr-15 mb-20 mb-sm-0"
                            component={Link}
                            to={`/farmer/product-edit/${currentDataItem.id}`}
                          >
                            edit
                          </Button>
                        </div>
                      </div>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div >
          :
          <ContentLoader />
        }
      </Fragment>
    )
  }
}

export default connect(null, { showAlert })(ProductDetail);