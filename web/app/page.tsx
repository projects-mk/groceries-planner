"use client"
import { SimpleGrid, Grid ,Button, Title, Text } from "@mantine/core";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
    <Grid columns={24}>
      <Grid.Col span={3} offset={21}>
        <Link href={"/login"}><Button w={"100%"} variant="subtle">Login</Button></Link>
      </Grid.Col>
    </Grid>

    <SimpleGrid cols={1}>
      <Title >
        Welcome
      </Title>
    </SimpleGrid>
    </>

  );
}
