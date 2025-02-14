import '../css/ProductList.css';

import Category from '../components/productList/Category';
import List from '../components/productList/List';

function ProductList() {
    return (
        <div className="ProductList">
            <Category />
            <List />
        </div>
    );
};

export default ProductList;