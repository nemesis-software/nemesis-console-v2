import React from 'react';

const ProductListerItem = ({product, onProductSelect}) => (
  <div className="product-lister-item" onClick={() => {onProductSelect(product)}}>
    <div className="product-price">{productPrice(product)}$</div>
    <div className="product-image"><img src={productImage(product)}/></div>
    <div className="product-name">{productName(product)}</div>
  </div>
);

const productPrice = (product) => {
  let price = Number(product.price.split(',')[0]);

  return price.toFixed(2);
};

const productName = (product) => {
  if (product.name && product.name.en) {
    return product.name.en.value;
  }

  return product.code;
};

const productImage = (product) => {
  let mainUrl = 'https://dk4bbvhtxx00t.cloudfront.net/solarapparel/catalog/solar/';

  if (product.thumbnail) {
    return `${mainUrl}${product.thumbnail}`;
  }

  return 'resources/no-img.png';
};

export default ProductListerItem;