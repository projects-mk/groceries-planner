"use client"
import { Button, Paper, Grid, Group, Space, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { IconPlus, IconLogout2, IconUserUp, IconRegistered } from '@tabler/icons-react';

export default function RegistrationPage() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: '',
      password: '',
      passwordRepeated: ''

    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      
      password: (value) =>
        value.length >= 6 && value.length <= 20
          ? null
          : "Password must be between 6 and 20 characters",

      passwordRepeated: (value, values) =>
        value === values.password
          ? null
          : "Passwords don't match",
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

        <TextInput
          withAsterisk
          label="Repeat Password"
          type="password"
          placeholder="Repeat Password"
          key={form.key('passwordRepeated')}
          {...form.getInputProps('passwordRepeated')}
        />

        <Group justify="flex-end" mt="md">
        <Button type="submit" leftSection={<IconUserUp size={14} />}><Text fz={14} fw={600}>Register</Text></Button>

        </Group>
      </form>

      <Text size="12px"> Already have an account? <Link href={"/login"}>Login Here</Link></Text>
      </Paper>
      </Grid.Col>
    </Grid>

    
    </>

  );
}
