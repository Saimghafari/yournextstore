import React, { createContext, useContext, useState, useEffect, Children } from "react";
import { useSelector } from "react-redux";


const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const { products } = useSelector((state) => state.products);
    const [searchData, setSearchData] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])


    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchData(query);

        const filtered = products.filter((product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.price.toString().includes(query)
        );
        setFilteredProducts(filtered);
    };


    return (
        <SearchContext.Provider value={{ searchData, setSearchData, handleInputChange, filteredProducts, }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => useContext(SearchContext);