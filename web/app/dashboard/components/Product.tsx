import { Button, Menu, Group, Checkbox, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import React from 'react';


export interface ProductProps {
    itemId: number,
    inBasket: boolean,
    description: string
}

export default function ProductComponent({ productData, onDelete, onEdit }: 
    { productData: ProductProps, onDelete: (itemId: number) => void, onEdit: (itemId: number, newDescription: string) => void }) {
    
    const [checked, setChecked] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>(productData.description);

    function strikethrough(flag: boolean) {
        return flag ? "line-through" : "";
    }

    function handleCheck() {
        setChecked(!checked);
    }

    function productMenu(target: JSX.Element) {
        return (
            <Menu>
                <Menu.Target>
                    {target}
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<IconEdit size="15" />}
                        onClick={() => setIsEditing(!isEditing)} // Toggle editing mode
                    >
                        <Text fz="15">Edit</Text>
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconTrash color='red' size="15" />}
                        onClick={() => onDelete(productData.itemId)}  // Trigger delete on click
                    >
                        <Text fz="15">Delete</Text>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        )
    }

    return (
        <Group key={`${productData.itemId}-${productData.description}-${productData.inBasket}`}>
            <Text hidden>{productData.itemId}</Text>
            <Checkbox radius={"sm"} size="15" bd={""} defaultChecked={productData.inBasket} onClick={handleCheck} />
            {isEditing ? (
                <TextInput
                    size="sm"
                    value={editedText}
                    onChange={(e) => setEditedText(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onEdit(productData.itemId, editedText);  // Apply edit on Enter key
                            setIsEditing(false);                // Exit editing mode
                        }
                    }}
                    onBlur={() => {
                        setIsEditing(false);  // Exit editing mode on blur
                        setEditedText(productData.description);  // Reset text on cancel
                    }}
                />
            ) : (
                productMenu(
                    <Button variant="default" style={{border: "0px"}} h={25}>
                        <Text td={strikethrough(checked)}> {productData.description} </Text>
                    </Button>
                )
            )}
        </Group>
    )
}