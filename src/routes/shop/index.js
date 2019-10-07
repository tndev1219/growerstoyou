import React, { Fragment } from 'react';
import { connect } from "react-redux";
import InfiniteScroll from 'react-infinite-scroller';
import Features from '../../components/widgets/Features';
import ProductCard from '../../components/global/forms/ProductCard';
import { 
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  FormControl,
  FormControlLabel,
  CardContent,
  Card,
  TextField,
  Grid 
} from '@material-ui/core';
import { showAlert } from '../../actions/action';
import { api } from '../../api';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      products: [],
      tracks: [],
			hasMoreItems: true,
			fields: {
				searchKey: '',
				pricefilter: '0-10000',
				lower_price: 0,
				upper_price: 10000,
				custom_lower_price: '',
				custom_upper_price: ''
			},
			errors: []
    };
  }

  componentWillMount() {
		const self = this;
		api.POST('pcategory/getall')
			.then(function(res) {
				if (res.data.success) {
					const category = res.data.results;
					var fields = self.state.fields;
					for (var i =0; i < category.length; i++) {
						fields[category[i].name] = true;
					}
					self.setState({ category, fields });
				} else {
					self.props.showAlert(res.data.message, 'error');
				}
			})
			.catch(function(err) {
				self.props.showAlert(err.message, 'error');
      });
    
    api.POST('product/getall')
			.then(function(res) {
				if (res.data.success) {
					const products = res.data.results;
					self.setState({ products });
				} else {
					self.props.showAlert(res.data.message, 'error');
				}
			})
			.catch(function(err) {
				self.props.showAlert(err.message, 'error');
			});
  }

  loadItems(page) {
    var self = this;

    if(self.state.products.length !== 0) {
      var tracks = self.state.tracks;
      self.state.products.map((product) => {
        tracks.push(product);
        return true;
      });

      if(self.state.tracks.length < self.state.products.length) {
        self.setState({
          tracks: tracks
        });
      } else {
        self.setState({
          hasMoreItems: false
        });
      }
    }
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  handleChange = (e) => {
		var fields = this.state.fields;
		fields[e.target.name] = e.target.value;

		if (e.target.name === 'pricefilter') {
			fields['lower_price'] = parseInt(e.target.value.split('-')[0]);
			fields['upper_price'] = parseInt(e.target.value.split('-')[1]);
			fields['custom_lower_price'] = '';
			fields['custom_upper_price'] = '';
		}
		this.setState({ fields });

		if (e.target.name !== 'searchKey' && e.target.name !== 'custom_lower_price' && e.target.name !== 'custom_upper_price') {
			this.search();
		}		
	}

	handleCheck = (e) => {
		var fields = this.state.fields;
		fields[e.target.name] = e.target.checked;
		this.setState({ fields });
		this.search();
	}

	customRangeSearch = () => {
		var errors = this.state.errors;
		var fields = this.state.fields;
		if (fields['custom_lower_price'] === '' || fields['custom_upper_price'] === '' || parseInt(fields['custom_lower_price']) > parseInt(fields['custom_upper_price'])) {
			errors['custom_lower_price'] = true;
			errors['custom_upper_price'] = true;
			this.setState({ errors });
			return;
		} else {
			errors['custom_lower_price'] = false;
			errors['custom_upper_price'] = false;
			this.setState({ errors });
			this.search();
		}	
	}

  search = () => {
		var fields = this.state.fields;
		var category = this.state.category;
		var ids = [];
		var payload = {
			keyword: this.state.fields['searchKey'],
		}

		for (var i = 0; i < category.length; i++) {
			if (fields[category[i].name]) {
				ids.push(i+1);
			}
		}
		payload['ids'] = ids;
		
		if (fields['custom_lower_price'] !== '') {
			payload['lower_price'] = fields['custom_lower_price'];
			payload['upper_price'] = fields['custom_upper_price'];
		} else {
			payload['lower_price'] = fields['lower_price'];
			payload['upper_price'] = fields['upper_price'];
		}

		var self = this;
    api.POST('product/getbyparam', payload)
			.then(function(res) {
				if (res.data.success) {
					const products = res.data.results;
					const tracks = [];
					self.setState({ products, tracks });
					self.loadItems();
				} else {
					self.props.showAlert(res.data.message, 'error');
				}
			})
			.catch(function(err) {
				self.props.showAlert(err.message, 'error');
			});
	}
	
	clearAllFilter = () => {
		var fields = this.state.fields;
		var category = this.state.category;
		fields['searchKey'] = '';
		for (var i = 0; i < category.length; i++) {
			fields[category[i].name] = true;
		}
		fields['pricefilter'] = '0-10000';
		fields['custom_lower_price'] = '';
		fields['custom_upper_price'] = '';
		this.setState({ fields });
		this.search();
	}

  render() {
    return(
      <Fragment>
        <div className="iron-registration-page-wrap page-pad background-1">
          <div className="iron-gogreen-wrapper section-pad">
            <div className="iron-sec-heading-wrap heading-font-v2 text-center">
              <div className="heading-title mb-40">
                <h2>Go Green! Go Organic!</h2>
              </div>
            </div>
          </div>

          <div className="section-pad mt-60 pb-60">
            <div className="container mb-60">       
              <Grid container className="section-content" spacing={5}>
                <Grid item xs={12} sm={12} md={4} lg={3} className="mb-md-0 mb-30 mt-10">
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Card>
                        <CardContent>
                          <TextField
                            className="mt-15"
                            placeholder="Search Products"
														fullWidth
														name="searchKey"
														value={this.state.fields['searchKey']}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyPress}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Card>
                        <CardContent>
                          <h5>Category</h5>
                          <FormControl component="fieldset" className="ml-10">
                            <FormGroup>
                              {this.state.category.length !== 0 && this.state.category.map((category, index) => (
                                <div key={index}>
                                  <FormControlLabel
                                    control={<Checkbox className="checkbox-color" name={category.name} checked={this.state.fields[category.name]} onChange={this.handleCheck} />}
                                    label={category.name}
                                  />
                                </div>
                              ))}
                            </FormGroup>
                          </FormControl>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Card>
                        <CardContent>
                          <h5>Price</h5>
                          <FormControl component="fieldset" className="ml-10 mb-10">
                            <RadioGroup
                              aria-label="pricefilter"
                              name="pricefilter"
                              // pricefilter={this.state.pricefilter}
                              onChange={this.handleChange}
                            >
                              <FormControlLabel name="pricefilter" value="0-10" control={<Radio className="checkbox-color" checked={this.state.fields['pricefilter'] === "0-10"} />} label="Below $10" />
                              <FormControlLabel name="pricefilter" value="10-100" control={<Radio className="checkbox-color" checked={this.state.fields['pricefilter'] === "10-100"} />} label="$10 - $100" />
                              <FormControlLabel name="pricefilter" value="100-500" control={<Radio className="checkbox-color" checked={this.state.fields['pricefilter'] === "100-500"} />} label="$100 - $500" />
                              <FormControlLabel name="pricefilter" value="500-10000" control={<Radio className="checkbox-color" checked={this.state.fields['pricefilter'] === "500-10000"} />} label="Above $500" />
                              <FormControlLabel name="pricefilter" value="0-10000" control={<Radio className="checkbox-color" checked={this.state.fields['pricefilter'] === "0-10000"} />} label="All" />
                            </RadioGroup>
                          </FormControl>
                          <h5>Enter Price Range</h5>
                            <TextField
                              placeholder="0"                            
															name="custom_lower_price"
															value={this.state.fields['custom_lower_price']}
                              onChange={this.handleChange}
															type="number"
															inputProps={{ min: "0" }}
															error={this.state.errors['custom_lower_price']}
                              style={{width: 50}}
                            />
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <TextField
                              placeholder="5000"
															name="custom_upper_price"
															value={this.state.fields['custom_upper_price']}
                              onChange={this.handleChange}
															type="number"
															inputProps={{ min: "0" }}
															error={this.state.errors['custom_upper_price']}
                              style={{width: 50}}
                            />
                          <Button className="button btn-active btn-sm ml-20" onClick={this.customRangeSearch}>Go</Button>    
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Card>
                        <Button className="button btn-active btn-sm mt-20 mb-20 ml-20" onClick={this.clearAllFilter}>Clear all filters</Button>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={9}>
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadItems.bind(this)}
                    hasMore={this.state.hasMoreItems}
                    // loader={<ContentLoader/>}
                  >
                    <Grid container className="section-content text-center " spacing={5}>
                      {this.state.tracks.map((product, key) => (
                        <Grid key={key} item xs={12} sm={6} md={6} lg={4} className="productcard-item">
                          <ProductCard product={product} history={this.props.history} />
                        </Grid>
                      ))}    
                    </Grid>
                  </InfiniteScroll>       
                </Grid>                
              </Grid>    
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