"use client"
import { Button, Paper, Grid, Group, Space, TextInput, Box, Text } from '@mantine/core';
import { IconPlus, IconLogout2, IconLogin } from '@tabler/icons-react';
import React, { useState } from 'react';
import r from '../../lib/backendRequest';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import Cookies from 'universal-cookie';


export default function LoginPage() {
  const authStatus = {
    display: false,
    success: false,
  };

  const [authConfirmation, setAuthConfirmation] = useState(authStatus);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      email: '',
      pass: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      pass: (value) => (value.length > 6 && value.length <= 20 ? null : 'Password must have between 6 and 20 characters'),
    },
  });

  function displayAuthStatus(success: boolean) {
    if (success) {
      return (
        <Alert
          variant="light"
          color="green"
          radius="md"
          title="Login Successful"
          icon={<IconInfoCircle />}
        />
      );
    }
    return (
      <Alert
        variant="light"
        color="red"
        radius="md"
        title="Wrong Username or Password"
        icon={<IconInfoCircle />}
      />
    );
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function authRequest(data: any) {
    r.post('api/auth/login', data)
      .then((resp) => {
        if (!resp.ok) {
          setAuthConfirmation({ display: true, success: false });
        } else {
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
        }
      })
      .catch((error) => {
        console.error('Error during request:', error);
        setAuthConfirmation({ display: true, success: false });
      });
  }

  return (
    <>
      <Grid columns={9}>
        <Grid.Col span={3} offset={3}>
          <Space h={'15vh'} />
          <Paper shadow="xl" p="50" bd={'0.1px solid grey'}>
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
              <Group justify="flex-end" mt="md">
                <Button
                  type="submit"
                  leftSection={<IconLogin size={14} />}
                >
                  <Text fz={14} fw={600}>
                    Login
                  </Text>
                </Button>
              </Group>
            </form>
            <Text size="12px">
              {' '}
              Don't have an account? <Link href={'/register'}>Register Here</Link>
            </Text>
            <Box mt="20">
              {authConfirmation.display && displayAuthStatus(authConfirmation.success)}
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}