import { Button, Paper, Grid, Group, Space, TextInput, Text, SimpleGrid, ScrollArea, Checkbox } from '@mantine/core';
import { useState } from 'react';
import type { ProductProps } from './List'
import ListComponent from './List'
import React from 'react';

export interface ListProps {
    title: string,
    products: ProductProps[]
  }

export default function ListContainerComponent({lists}: {lists:ListProps[]}) {

    function renderComponents(data: ListProps[] | null){
        if (!data){
            return 
          } 

        const components = new Array

        for (const listIdx in lists) {
        const listData: ListProps = lists[listIdx]
        
        const listTitle = listData.title
        const listOfProducts = listData.products
    
        const productComponents = <ListComponent listOfProducts={listOfProducts} />;

        const listComp = (
            <Paper shadow="xl" p="10" bd={"0.1px solid grey"} key={`${listTitle}`}> 
            <Text>{listTitle}</Text>
            {productComponents}
            </Paper>
        )
        
        components.push(listComp)
        }
        
        return components
    }


    

    return (
        <>
        {renderComponents(lists)}
        </>
    )
}