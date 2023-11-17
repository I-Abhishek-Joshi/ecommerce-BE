const filterProducts = ({products, category, color, size}) => {
    let colorList =  new Set(products.reduce((colors, product) => {
        return colors.concat(product.color);
    }, []));
    
    let sizeList = new Set(products.reduce((colors, product) => {
      return colors.concat(product.size);
    }, []));

    const productList = products.filter((product) => {
        if(color && product.color && !product.color.includes(color)) {
            return false;
        }
        if(size && product.size && !product.size.includes(size)) {
            return false;
        }
        if(category && product.category && !product.category.includes(category)) {
            return false;
        }

        return true;
    })

    colorList = Array.from(colorList)
    sizeList = Array.from(sizeList)

    return {productList, colorList, sizeList};
}

module.exports = { filterProducts }