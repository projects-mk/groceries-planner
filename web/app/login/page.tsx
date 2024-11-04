"use client"
import { Button, Paper, Grid, Group, Space, TextInput, Text } from '@mantine/core';
import { IconPlus, IconLogout2, IconLogin } from '@tabler/icons-react';

import { useForm } from '@mantine/form';
import Link from 'next/link';

export default function LoginPage() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 6 && value.length <= 20 ? null : 'Password must have between 6 and 20 signs')
    },
  });

  return (
    <>

    <Grid columns={9}>
    
      <Grid.Col span={3} offset={3}> 
        
      <Space h={"15vh"}/>
      <Paper shadow="xl" p="50" bd={"0.1px solid grey"} >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Group justify="flex-end" mt="md">
        <Button type="submit" leftSection={<IconLogin size={14} />} ><Text fz={14} fw={600}>Login</Text></Button>

        </Group>
      </form>

      <Text size="12px"> Don't have an account? <Link href={"/register"}>Register Here</Link></Text>
      </Paper>
      </Grid.Col>
    </Grid>

    
    </>

  );
}
