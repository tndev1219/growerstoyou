/**
 * Products List
 */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Grid, InputLabel, MenuItem, FormControl, Select, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';

//component
import ContentLoader from '../../../components/global/loaders/ContentLoader';
import ProductsGrid from '../../../components/widgets/productGrid';
import ConfirmProduct from './components/ConfirmProduct';
import { showAlert } from '../../../actions/action';
import { api } from '../../../api';
import appConfig from '../../../constants/AppConfig';

class Products extends Component {
  constructor(props) {
    super(props);
    this.confirmationDialog = React.createRef();
    this.state = {
      name: '',
      allProducts: null,
      gridlayout: true,
      products: null,
      originalProductsList: null,
      variations: {
        type: '',
        // time_interval: '',
        // quantity: ''
      }, 
      category: []
    };
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    const self = this;
    const payload = {
      farmid: self.props.farmid
    }
    var products = [];

    api.POST('product/getbyfarmid', payload)
      .then(function(res) {
        if (res.data.success) {
          const originalProductsList = res.data.results;
          
          products = res.data.results;
          self.setState({ products, originalProductsList });
        } else {
          self.setState({ products });
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.setState({ products });
        self.props.showAlert(err.message, 'error');
      });

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
        self.props.showAlert(err.message, 'error');
      });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // show list layout
  gridLayout = () => {
    this.setState({ gridlayout: true });
  };

  // show grid layout
  listLayout = () => {
    this.setState({ gridlayout: false });
  };

  //function for product variation
  changeProductVariation(type, e) {
    this.setState({
      variations: {
        ...this.state.variations,
        [type]: e.target.value
      }
    }, function() {
      this.search();
    })      
  }

  onDeleteProductItem(dataitem) {
    this.dataitem = dataitem;
    this.confirmationDialog.current.openDialog();
  }

  /**
    * function for delete cart product
    * @param {boolean} popupResponse 
    */
  deleteDataItem(popupResponse) {
    if (popupResponse) {
    let deleteItem = this.dataitem;
    var payload = {
      id: deleteItem.id
    };
    var self = this;

    api.POST('product/delete', payload)
      .then(function(res) {
        if (res.data.success) {
          let newData = self.state.products.filter((productsItem) => productsItem.id !== deleteItem.id)
          self.setState({
            products: newData
          })
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to delete product. Please try again later...', 'error');
      })
    }
  }

  handleClick(id) {
    this.props.history.push(`/farmer/product-detail/${id}`);
  }

  search() {
    if (this.state.name === "" && this.state.variations.type === "") {
      return true;
    }
    var originalProductsList = this.state.originalProductsList;
    var newProductsList = originalProductsList.filter((product) => {
      if (this.state.name === "") {
        return (product.category.category_name === this.state.variations.type);
      } else if (this.state.variations.type === "") {
          return (product.name.toLowerCase().includes(this.state.name));
      } else {
        return (product.category.category_name === this.state.variations.type && product.name.toLowerCase().includes(this.state.name));
      }
    })
    this.setState({ products: newProductsList });
  }

  render() {

    const { products } = this.state;
    const columns = [
      {
        maxWidth: 75,
        Header: 'id',
        accessor: 'id'
      },
      {
        sortable: false,
        maxWidth: 100,
        Header: 'image',
        accessor: 'images',
        Cell: props => 
          <span className='avatar'>
            <img src={`${appConfig.S3_BUCKET}${props.value[0]}`} alt="client-avatar" width="30" height="30" />
          </span>
      },
      {
        minWidth: 150,
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'price',
        accessor: 'price',
      },
      {
        Header: 'category',
        accessor: 'category.category_name',
      },
      {
        Header: 'unit',
        accessor: 'unit',
      },
      {
        Header: 'description',
        accessor: 'description',
      },
      {
        Header: 'total procuts',
        accessor: 'count',
      },
      {
        Header: 'action',
        Cell: props => {
          return (
            <div>
              <Button component={Link} to={`/farmer/product-edit/${props.original.id}`} className="action-btn"><i className="material-icons primary-color">edit</i>
              </Button>
              <Button className="action-btn"
                onClick={() => this.onDeleteProductItem(props.original)}
              >
                <i className="material-icons active-color">delete</i></Button>
            </div>
          )
        },
      }
    ]
    
    return (
      <Fragment>
        {products !== null ?
          <div className="inner-container">
            <div className="iron-products-wrap">
              <div className="iron-shadow rounded p-sm-20 p-15 mb-20 bg-base">
                  <Grid container spacing={3} className="search-box-wrap my-0">
                    <Grid item sm={12} md={3} lg={3} className="py-0 d-flex justify-content-start align-items-center">
                        <h4 className="mb-lg-0 mb-5 text-uppercase">Search</h4>
                    </Grid>
                    <Grid item sm={12} md={9} lg={9} className="py-0 d-sm-flex d-block">
                        <div className="search-box d-block d-sm-flex align-items-center">
                          <TextField
                              id="standard-name"
                              label="Search Products"
                              className="my-0 iron-form-input-wrap mr-5"
                              fullWidth
                              value={this.state.name}
                              onChange={this.handleChange('name')}
                          />
                          <Button className="button btn-primary btn-active mx-sm-10 my-10 my-sm-0" onClick={this.search}>search</Button>
                        </div>
                        <div className="btn-wrap d-sm-flex d-block justify-content-between align-items-center">
                          <Button component={Link} to="/farmer/product-add" className="button btn-primary btn-active">add products<i className="material-icons ml-5">add</i></Button>
                        </div>
                    </Grid>
                  </Grid>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center my-15">
                  <h5 className="text-capitalize mb-0">
                      {this.state.gridlayout === true ?
                        'products grid'
                        :
                        'products list'
                      }
                  </h5>
                  <div className="projects-icon">
                      <Button className={`btn-icon ${this.state.gridlayout === true ? 'active' : ''}`} onClick={() => this.gridLayout()}>
                        <i className="material-icons">apps</i>
                      </Button>
                      <Button className={`btn-icon ${this.state.gridlayout === false ? 'active' : ''}`} onClick={() => this.listLayout()}>
                        <i className="material-icons">list</i>
                      </Button>
                  </div>
                </div>
                <div className="mb-10">
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <form className="product-values">
                        <FormControl className="iron-select-width2">
                          <InputLabel htmlFor="age-simple">type</InputLabel>
                          <Select
                            value={this.state.variations.type}
                            onChange={(e) => this.changeProductVariation('type', e)}
                            inputProps={{
                              name: 'age',
                              id: 'age-simple',
                            }}
                          >
                            {this.state.category.map((category, index) => (
                              <MenuItem key={index} value={category.name}>{category.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                            {/* <FormControl className="iron-select-width2">
                              <InputLabel htmlFor="age-simple">Recent</InputLabel>
                              <Select
                                  value={this.state.variations.time_interval}
                                  onChange={(e) => this.changeProductVariation('time_interval', e)}
                                  inputProps={{
                                    name: 'age',
                                    id: 'age-simple',
                                  }}
                              >
                                  <MenuItem value={'this week'}>This week</MenuItem>
                                  <MenuItem value={'this month'}>This month</MenuItem>
                                  <MenuItem value={'past month'}>Past month</MenuItem>
                                  <MenuItem value={'this year'}>This year</MenuItem>
                              </Select>
                            </FormControl>
                            <FormControl className="iron-select-width2">
                              <InputLabel htmlFor="age-simple">Quantity</InputLabel>
                              <Select
                                  value={this.state.variations.quantity}
                                  onChange={(e) => this.changeProductVariation('quantity', e)}
                                  inputProps={{
                                    name: 'age',
                                    id: 'age-simple',
                                  }}
                              >
                                  <MenuItem value={5}>5</MenuItem>
                                  <MenuItem value={10}>10</MenuItem>
                                  <MenuItem value={15}>15</MenuItem>
                                  <MenuItem value={20}>20</MenuItem>
                              </Select>
                            </FormControl> */}
                        </form>
                      </Grid>
                  </Grid>
                </div>
                <div>
                  {this.state.gridlayout === true ?
                    <Fragment>
                      <div className="product-grid-wrap">
                          <Grid container spacing={4}>
                            {products.map((dataitem, index) => {
                                return (
                                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                      <ProductsGrid data={dataitem} deleteProduct={() => this.onDeleteProductItem(dataitem)} />
                                  </Grid>
                                )
                            })}
                          </Grid>
                      </div >
                    </Fragment>
                    :
                    <Fragment>
                      <div className="product-list-wrap iron-shadow p-20 bg-base rounded" >
                        <ReactTable
                          data={products}
                          columns={columns}
                          defaultPageSize={10}
                          getTrProps={(state, rowInfo) => {
                            return {
                              onClick: (e) => {
                                  this.handleClick(rowInfo.original.id);
                              }
                            }
                          }}
                        />
                      </div >
                    </Fragment>
                  }
                </div>
              </div>
            </div>
            <ConfirmProduct
              ref={this.confirmationDialog}
              onConfirm={(res) => this.deleteDataItem(res)}
            />
          </div>
          :
          <ContentLoader />
        }
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    farmid: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile).farminfo.farm_id : null
  }),{ showAlert })(Products);