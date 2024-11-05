import { Button, Grid, Space, TextInput, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import ProductComponent from './Product'
import React from 'react';


export interface ProductProps {
    itemId: number,
    inBasket: boolean,
    description: string
}

export default function ListComponent({ listOfProducts }: { listOfProducts: ProductProps[] }) {
    const [products, setProducts] = useState<ProductProps[]>([])
    const [newProduct, setNewProduct] = useState<string>('');

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setProducts(listOfProducts)
    }, [])

    const handleDeleteProduct = (itemId: number) => {
        const updatedProducts = products.filter((product) => product.itemId !== itemId);
        setProducts(updatedProducts);
    };

    const handleEditProduct = (itemId: number, newDescription: string) => {
        const updatedProducts = products.map((product) =>
            product.itemId === itemId ? { ...product, description: newDescription } : product
        );
        setProducts(updatedProducts);
    };

    const productComponents = products.map((product) => (
        <ProductComponent
            productData={product}
            key={`${product.description}-${product.inBasket}-${product.itemId}`}
            onDelete={handleDeleteProduct}
            onEdit={handleEditProduct}
        />
    ));

    const handleAddProduct = () => {
        if (newProduct.trim() !== '') {
            const newProductObj = {
                description: newProduct,
                inBasket: false,
                itemId: products.length > 0 ? products[products.length - 1].itemId + 1 : 1,
            };
            setProducts([...products, newProductObj]);
            setNewProduct('');
        }
    };

    return (
        <>
            {productComponents}
            <Space h={"md"} />
            <Grid columns={5}>
                <Grid.Col span={3}>
                    <TextInput
                        size="sm"
                        fz={15}
                        w="100%"
                        value={newProduct}
                        variant="unstyled"
                        
                        onChange={(e) => setNewProduct(e.currentTarget.value)}
                        placeholder="Add Product"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddProduct()
                          }
                      }}
                    />
                </Grid.Col>
            </Grid>
        </>
    )
}