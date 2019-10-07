
/**
 * post detail component
*/
/* eslint-disable */
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { Grid, Button, Input, Select, MenuItem, TextField, InputAdornment, FormControlLabel, Checkbox, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ImageUploader from 'react-images-upload';
import { api } from '../../../../api';
import { showAlert } from '../../../../actions/action';
import authAction from "../../../../redux/auth/actions";
import SnackBar from '../../../../components/global/forms/SnackBar';
import appConfig from '../../../../constants/AppConfig';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../../../../aws-exports';
Amplify.configure(awsconfig);

//components
import SocialIcons from '../../../../components/widgets/SocialIcons';
import ContentLoader from '../../../../components/global/loaders/ContentLoader';

const { waiting } = authAction;

class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: ["", "", "", "", ""],
      productId: parseInt(this.props.match.params.id),
      currentDataItem: null,
      category: [],
      selectedCategory: 1,
      selectedUnit: 'lb',
      unit: [],
      fields: {
        count: 1
      },
      errors: {},
      showSnackBar: false,
      previewImage: ''
    };
    this.onDrop = this.onDrop.bind(this);
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
          var previewImage = res.data.results.images[0]
          var selectedCategory = res.data.results.category.category_id;
          var selectedUnit = res.data.results.unit;
          var pictures = res.data.results.images;
          var fields = self.state.fields;

          fields['productName'] = res.data.results.name;
          fields['price'] = res.data.results.price;
          fields['description'] = res.data.results.description;
          fields['count'] = res.data.results.count;
          currentDataItem = res.data.results;

          self.setState({ currentDataItem, fields, selectedCategory, selectedUnit, pictures, previewImage });
        } else {
          self.setState({ currentDataItem });
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.setState({ currentDataItem });
        self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
      })

    api.POST('pcategory/getall')
      .then(function(res) {
        if (res.data.success) {
          const category = res.data.results;
          self.setState({ category });
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
      });

    api.POST('unit/getall', { token: self.props.token })
      .then(function(res) {
        if (res.data.success) {
          const unit = res.data.results;
          self.setState({ unit });
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert(err.message, 'error');
      });
  }

  onDrop(picture, index) {
    if (picture.length === 0) {
      var pictures = this.state.pictures;
      pictures[index] = "";
      this.setState({pictures});
    } else {
      var currentDate = new Date()
      var date = currentDate.getDate();
      var month = currentDate.getMonth();
      var year = currentDate.getFullYear();
      var timeStamp = `${year}${this.pad(month + 1)}${date}${Date.now()}`;
      var extension = picture[0].name.split('.')[picture[0].name.split('.').length-1];

      const { waiting } = this.props;
      const self = this;
      waiting(true);

      Storage.put(`products/${timeStamp}.${extension}`, picture[0], { contentType: 'image/*' })
        .then (result => {
          var pictures = self.state.pictures;
          pictures[index] = result.key;
          self.setState({pictures});
          waiting(false);
        })
        .catch(err => {
          waiting(false);
          self.props.showAlert('Failed to upload image. Please try again later...', 'error');
        });
    }
  }

  handleChange = e => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  };

  handleSelect = e => {
    if (e.target.name === 'category') {
      this.setState({ selectedCategory: e.target.value });
    } else {
      this.setState({ selectedUnit: e.target.value });
    }
  }
  
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Product Name
    if (!fields["productName"]) {
      formIsValid = false;
      errors["productName"] = true;
    }

    //Price
    if (!fields["price"]) {
      formIsValid = false;
      errors["price"] = true;
    } else {
      var isnum = /^\d+$/.test(fields["price"]);
      if (!isnum) {
        formIsValid = false;
        errors["price"] = true;
      }
    }

    //Description
    if (!fields["description"]) {
      formIsValid = false;
      errors["description"] = true;
    }

    //Product Image
    for (var i = 0; i < 5; i++) {
      if (this.state.pictures[i] === "") {
        formIsValid = false;
      } else {
        break;
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleClick = () => {
    if (this.handleValidation()) {
      this.handleSubmit();
    } else {
      this.setState({showSnackBar: true});
    }
  }

  handleSubmit = () => {
    const images = [];
    for (var i = 0; i < 5; i++) {
      if (this.state.pictures[i] !== "") {
        images.push(this.state.pictures[i]);
      }
    }
    var payload = {
      id: this.state.currentDataItem.id,
      name: this.state.fields['productName'],
      categoryid: this.state.selectedCategory,
      price: this.state.fields['price'],
      unit: this.state.fields['unit'],
      description: this.state.fields['description'],
      count: this.state.fields['count'],
      farmid: this.props.farmid,
      images: images
      }
    const { waiting } = this.props;
    const self = this;
    waiting(true);

    api.POST('product/update', payload)
      .then(function(res) {
        if (res.data.success) {
          self.props.history.push('/farmer/products')
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
        waiting(false);
      })
      .catch(function(err) {
        self.props.showAlert('Failed to update product. Please try again later...', 'error');
        waiting(false);
      });
  }

  pad(n) {
    return n<10 ? '0'+n : n;
  }

  hideSnackBar = () => {
    this.setState({showSnackBar: false});
  }

  changePreviewImage = (previewImage) => {
    this.setState({ previewImage });
  };

  render() {
    const { currentDataItem, previewImage } = this.state;
    
    if (currentDataItem) {
      for (var i = currentDataItem.images.length; i < 5; i++) {
        currentDataItem.images.push("");
      }			
    }

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
                              {gallery === "" ? 
                                <div className="image-upload" onMouseOver={() => this.changePreviewImage('products/default_preview.png')}>
                                  <a href="javascript:void(0)">
                                    <img
                                      src={`${appConfig.S3_BUCKET}products/default_preview.png`}
                                      alt="product-item"
                                      height="50"
                                    />
                                  </a>
                                  <div className="image-content d-flex justify-content-center align-items-center">
                                    <ImageUploader
                                      withPreview
                                      withIcon={false}
                                      buttonClassName="primary-color bg-base border-circle"
                                      buttonText=""
                                      onChange={(picture) => this.onDrop(picture, index)}
                                      imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                      maxFileSize={5242880}
                                    />
                                  </div>
                                </div>
                              :
                                <div className="image-upload" onMouseOver={() => this.changePreviewImage(gallery)}>
                                  <a href="javascript:void(0)">
                                    <img
                                      src={`${appConfig.S3_BUCKET}${gallery}`}
                                      alt="product-item"
                                      height="50"
                                    />
                                  </a>
                                  <div className="image-content d-flex justify-content-center align-items-center">
                                    <ImageUploader
                                      withPreview
                                      withIcon={false}
                                      buttonClassName="primary-color bg-base border-circle"
                                      buttonText=""
                                      onChange={(picture) => this.onDrop(picture, index)}
                                      imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                      maxFileSize={5242880}
                                    />
                                  </div>
                                </div>
                              }                                                      
                            </div>
                          )
                        })}
                      </div>
                    </Grid>
                    <Grid item xs={9} sm={10} md={10} lg={10} className="py-0">
                      <div className="preview-full-image iron-shadow product-gallery-item product-preview-image">
                        <a href="javascript:void(0)">
                          <img
                            src={`${appConfig.S3_BUCKET}${previewImage}`}
                            alt="poster-image"
                          />
                        </a>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} className="py-0">
                  <div className="detail-content">
                    <Link to="/farmer/products" className="text-14 d-inline-block font-medium py-10 mb-10">Back to products</Link>
                    <form className="product-values">
                      <div className="d-flex justify-content-start align-items-start mb-10">
                        <i className="zmdi zmdi-edit mr-5 primary-color pt-10 text-h4 "></i>
                        <Input
                          defaultValue={currentDataItem.name}
                          name="productName"
                          className="text-capitalize add-product-input text-h3 product-input-form"
                          inputProps={{
                            'aria-label': 'Description',
                          }}
                          onChange={this.handleChange}
                          required
                          error={this.state.errors['productName']}
                        />
                      </div>
                      <div className="mb-25">
                        <h6 className="text-14 mb-0 edit-text">Edit Price/Unit :</h6>
                        <Input
                          defaultValue={currentDataItem.price}
                          type="number"
                          className="product-input-form"
                          inputProps={{
                            'aria-label': 'Price/Unit',
                            min: "0"
                          }}
                          name="price"
                          onChange={this.handleChange}
                          required
                          error={this.state.errors['price']}
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          endAdornment={<InputAdornment position="end">/</InputAdornment>}
                          style={{marginLeft: 30, width: 80}}
                        />
                        <Select
                          name="unit"
                          value={this.state.selectedUnit}
                          onChange={this.handleSelect}
                          className="unit-select"
                          style={{width: 70}}
                        >
                          {this.state.unit.map((unit, index) => (
                            <MenuItem key={index} value={unit.name}>{unit.name}</MenuItem>	
                          ))}
                        </Select>
                      </div>
                      <div className="mb-10">
                        <h6 className="text-14 mb-0 edit-text">select category :</h6>
                        <Select
                          name="category"
                          value={this.state.selectedCategory}
                          onChange={this.handleSelect}
                          className="iron-select-width2"
                          style={{marginLeft: 30}}
                        >
                          {this.state.category.map((category, index) => (
                            <MenuItem key={index} value={category.id}>{category.name}</MenuItem>	
                          ))}
                        </Select>
                      </div>
                      <div className="mb-10">
                        <h6 className="text-14 mb-0 edit-text">add description :</h6>
                        <TextField
                          fullWidth
                          id="filled-multiline-static"
                          multiline
                          rows="4"
                          defaultValue={currentDataItem.description}
                          className="text-capitalize add-product-input pl-30 product-input-form"
                          name="description"
                          onChange={this.handleChange}
                          required
                          error={this.state.errors['description']}
                        />
                      </div>
                      <div className="mb-10">
                        <h6 className="text-14 mb-0 edit-text">total products :</h6>
                        <TextField
                          id="filled-number"
                          name="count"
                          value={this.state.fields['count']}
                          onChange={this.handleChange}
                          type="number"
                          className="iron-select-width2 pl-30 product-input-form"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{ min: "0" }}
                        />
                      </div>
                    </form>
                    <div className="mb-sm-50 mb-20 detail-btns">
                      <Button
                        className="button btn-active btn-lg btn-disabled mr-15 mb-20 mb-sm-0"
                        onClick={this.handleClick}
                        disabled={this.props.wait}
                      >
                        save
                      </Button>
                      {this.props.wait && <CircularProgress size={24} style={{position: "absolute", marginTop: "14px", marginLeft: "-110px"}} />}
                      <Button
                        to={'/farmer/products'}
                        component={Link}
                        className="button btn-base btn-lg mb-20 mb-sm-0"
                      >
                        discard
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        <SnackBar 
          showSnackBar={this.state.showSnackBar}
          hideSnackBar={this.hideSnackBar}
          message={'Please input the correct value...'}
        />
      </div >
      :
      <ContentLoader />
    }
    </Fragment>
    )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    farmid: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile).farminfo.farm_id : null,
    wait: state.Auth.waiting
  }),{ waiting, showAlert })(ProductEdit);