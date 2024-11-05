"use client"
import { Button, Paper, Grid, Group, Space, TextInput, Popover, Text, SimpleGrid, ScrollArea, Box, LoadingOverlay, Title } from '@mantine/core';
import { IconPlus, IconLogout2, IconLogin } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import ListContainerComponent from "./components/ListContainer"
import type { ListProps } from './components/ListContainer'
import r from "../../lib/backendRequest"
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const router = useRouter(); // For redirection
  const sampleData: ListProps[] = [
    { title: "sample list", 
      products: [
        { itemId: 1, inBasket: false, description: "Apple" },
        { itemId: 2, inBasket: false, description: "Banana" }
      ]
    },
    { title: "sample list2", 
      products: [
        { itemId: 3, inBasket: false, description: "Apple" },
        { itemId: 4, inBasket: false, description: "Banana" }
      ]
    }
  ] 

  const [lists, setLists] = useState<ListProps[]>(sampleData);
  const [newListName, setNewListName] = useState<string>("");
  const [addingNewList, setAddingNewList] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = still checking

  function addNewList(target: JSX.Element) {
    return (
      <Popover width={200} position="bottom" withArrow shadow="md" opened={addingNewList}>
        <Popover.Target>
          {target}
        </Popover.Target>
        <Popover.Dropdown>
          <TextInput 
            label="List Name" 
            onChange={(e) => setNewListName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newList: ListProps = {
                  title: newListName,
                  products: []
                };
                setLists((prevLists) => [...prevLists, newList]);
                setAddingNewList(false);
              }
            }}
          />
        </Popover.Dropdown>
      </Popover>
    );
  }

  useEffect(() => {
    // Check authorization status when component loads
    r.post("api/user/jwt/verify", {})
      .then(resp => {
        if (resp.ok) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      })
      .catch(() => setIsAuthorized(false)); // Assumption: Set to false if API call to verify fails
  }, []);

  useEffect(() => {
    // If authorization check is done and user is unauthorized, redirect to login
    if (isAuthorized === false) {
      router.push('/'); // Redirect immediately when unauthorized
    }
  }, [isAuthorized, router]);

  function logout() {
    const cookies = new Cookies();
    cookies.remove("_GrocPlanner_token");
    window.location.reload(); // Reload page after logout
  }

  // If authorization hasn't been determined yet, return a loading indicator
  if (isAuthorized === null) {
    return (
      <>
        <LoadingOverlay
          visible
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ type: 'bars'}}
        />
    </>
    )
  }

  return (
    <> 
      {isAuthorized && (
        <Grid columns={26}>
          <Grid.Col span={3}>
            <Paper shadow="xl" bd={"0.1px solid grey"} style={{ display: "flex", flexDirection: "column", justifyItems: "center" }} h={"95vh"}>
              {addNewList(<Button variant="default" onClick={() => setAddingNewList(true)} leftSection={<IconPlus size={14} />} bd={"0px"} mt={"md"}>
                <Text fz={14} fw={500}>Add New List</Text>
              </Button>)}
              
              <div style={{ flexGrow: 1 }} />
              <Button variant="default" mb={"md"} leftSection={<IconLogout2 size={14} />} bd={"0px"} onClick={logout}>
                <Text fz={14} fw={500}>Logout</Text>
              </Button>
            </Paper>
          </Grid.Col>

          <Grid.Col span={23}>
            <Paper shadow="xl" pl={50} p={10} bd={"0.1px solid grey"} h={"95vh"}>
              <ScrollArea h={"100%"}>
                <Title mb={25} size="25"> My Lists</Title>
                <SimpleGrid cols={3}>
                  <ListContainerComponent lists={lists} />
                </SimpleGrid>
              </ScrollArea>
            </Paper>
          </Grid.Col>
        </Grid>
      )}
    </>
  );
}