"use client"
import { Button, Paper, Grid, Group, Space, TextInput, Text, Alert, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import React from 'react';
import { IconPlus, IconLogout2, IconUserUp, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import r from '../../lib/backendRequest';


export default function RegistrationPage() {
  const authStatus = {
    display: false,
    success: false,
  };

  const [authConfirmation, setAuthConfirmation] = useState(authStatus);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: '',
      pass: '',
      passRepeated: ''

    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      
      pass: (value) =>
        value.length >= 6 && value.length <= 20
          ? null
          : "Password must be between 6 and 20 characters",

          passRepeated: (value, values) =>
        value === values.pass
          ? null
          : "Passwords don't match",
    },
  });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function authRequest(data: any) {

    const requestData = {
      "email": data.email,
      "pass": data.pass
    }

    r.post('api/auth/register', requestData)
      .then((resp) => {
        if (!resp.ok) {
          setAuthConfirmation({ display: true, success: false });
        } else {
          r.post('api/auth/login', requestData).then((resp) => {
            if (resp.ok) {
              setAuthConfirmation({ display: true, success: true });
          
              const jwtToken = resp.json.result;

              // Create cookie and set expiry for 72 hours (72 * 60 * 60 * 1000 = 259200000 ms)
              const cookies = new Cookies();
              const expiryDate = new Date();
              expiryDate.setTime(expiryDate.getTime() + 72 * 60 * 60 * 1000);

              cookies.set('_GrocPlanner_token', jwtToken, {
                path: '/',
                expires: expiryDate,
              });
              console.log("Cookie set:", cookies.get('_GrocPlanner_token'));

              window.location.href = '/dashboard';
            }} 
          )
        }
      })
      .catch((error) => {
        console.error('Error during request:', error);
        setAuthConfirmation({ display: true, success: false });
      });
  }

  function displayAuthStatus(success: boolean) {
    if (success) {
      return (
        <Alert
          variant="light"
          color="green"
          radius="md"
          title="Registration Successful"
          icon={<IconInfoCircle />}
        />
      );
    }
    return (
      <Alert
        variant="light"
        color="red"
        radius="md"
        title="User already exists"
        icon={<IconInfoCircle />}
      />
    );
  }

  return (
    <>

    <Grid columns={9}>
    
      <Grid.Col span={3} offset={3}> 
        
      <Space h={"15vh"}/>
      <Paper shadow="xl" p="50" bd={"0.1px solid grey"} >
      <form onSubmit={form.onSubmit((values) => authRequest(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <TextInput
          withAsterisk
          label="Password"
          type="password"
          placeholder="Password"
          key={form.key('pass')}
          {...form.getInputProps('pass')}
        />

        <TextInput
          withAsterisk
          label="Repeat Password"
          type="password"
          placeholder="Repeat Password"
          key={form.key('passRepeated')}
          {...form.getInputProps('passRepeated')}
        />

        <Group justify="flex-end" mt="md">
        <Button type="submit" leftSection={<IconUserUp size={14} />}><Text fz={14} fw={600}>Register</Text></Button>

        </Group>
      </form>

      <Text size="12px"> Already have an account? <Link href={"/login"}>Login Here</Link></Text>
      <Box mt="20">
        {authConfirmation.display && displayAuthStatus(authConfirmation.success)}
      </Box>
      </Paper>
      </Grid.Col>
    </Grid>

    
    </>

  );
}
