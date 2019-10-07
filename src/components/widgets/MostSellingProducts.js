/**
 * Go Green Go Organic component
 */
/* eslint-disable */
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import ProductCard from '../global/forms/ProductCard';

const products = [
  {
    category: {category_id: 2, category_name: "Vegetable"},
    count: 67,
    description: "chilly",
    farm: {
      address: "farmer",
      city: "farmer",
      id: 6,
      link_phone: "12345436",
      link_url: null,
      name: "farmer",
      state: "Delaware",
      zipcode: "123"   
    },
    id: 37,
    images: ["products/201907131563016000936.png", "products/201907131563016004375.png", "products/201907131563016007754.png", "products/201907131563016010720.png"],
    name: "Chilly",
    price: 3,
    unit: "kg",
  },
  {
    category: {category_id: 2, category_name: "Vegetable"},
    count: 67,
    description: "chilly",
    farm: {
      address: "farmer",
      city: "farmer",
      id: 6,
      link_phone: "12345436",
      link_url: null,
      name: "farmer",
      state: "Delaware",
      zipcode: "123"   
    },
    id: 37,
    images: ["products/201907131563016000936.png", "products/201907131563016004375.png", "products/201907131563016007754.png", "products/201907131563016010720.png"],
    name: "Chilly",
    price: 3,
    unit: "kg",
  },
  {
    category: {category_id: 2, category_name: "Vegetable"},
    count: 67,
    description: "chilly",
    farm: {
      address: "farmer",
      city: "farmer",
      id: 6,
      link_phone: "12345436",
      link_url: null,
      name: "farmer",
      state: "Delaware",
      zipcode: "123"   
    },
    id: 37,
    images: ["products/201907131563016000936.png", "products/201907131563016004375.png", "products/201907131563016007754.png", "products/201907131563016010720.png"],
    name: "Chilly",
    price: 3,
    unit: "kg",
  },
  {
    category: {category_id: 2, category_name: "Vegetable"},
    count: 67,
    description: "chilly",
    farm: {
      address: "farmer",
      city: "farmer",
      id: 6,
      link_phone: "12345436",
      link_url: null,
      name: "farmer",
      state: "Delaware",
      zipcode: "123"   
    },
    id: 37,
    images: ["products/201907131563016000936.png", "products/201907131563016004375.png", "products/201907131563016007754.png", "products/201907131563016010720.png"],
    name: "Chilly",
    price: 3,
    unit: "kg",
  }
];

class MostSellingProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="iron-sec-heading-wrap heading-font-v2 text-center">
        <div className="heading-title pb-60">
          <h2>Most Selling Products</h2>
        </div>
        <div className="pb-60">
          <Grid container className="section-content" spacing={5}>
            { products.map((product, key) => (
                <Grid key={key} item xs={12} sm={6} md={6} lg={3} className="productcard-item">
                  <ProductCard product={product} img_key={key} />
                </Grid>
            ))}            
          </Grid>
        </div>
      </div>
    )    
  }
}

export default MostSellingProduct;
