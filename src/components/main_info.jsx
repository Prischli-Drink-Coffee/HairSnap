import { Card, CardBody, Grid, GridItem, Text, VStack } from "@chakra-ui/react";

const MainInfo = () => {
  return (
    <VStack alignItems="flex-start" width="100%">
      <Text fontSize={24} fontWeight={700} lineHeight="normal">
        Новости и информация
      </Text>
      <Grid
        templateColumns="repeat(2, 2fr)"
        gap={["10px", "12px", "14px", "15px", "20px"]}
      >
        <GridItem>
          <Card borderRadius={0}>
            <CardBody>
              <Text fontSize={14} fontWeight={700} lineHeight="normal">
                Очень важная информация
              </Text>
              <Text fontSize={14} fontWeight={400} color="dark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim enim sit amet venenatis urna cursus eget nunc
                scelerisque.
              </Text>
              <Text
                color="date_gray"
                fontSize={12}
                fontWeight={400}
                marginTop="10px"
              >
                17 августа 2023 года
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card borderRadius={0}>
            <CardBody>
              <Text fontSize={14} fontWeight={700} lineHeight="normal">
                Очень важная информация
              </Text>
              <Text fontSize={14} fontWeight={400} color="dark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim enim sit amet venenatis urna cursus eget nunc
                scelerisque.
              </Text>
              <Text
                color="date_gray"
                fontSize={12}
                fontWeight={400}
                marginTop="10px"
              >
                17 августа 2023 года
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card borderRadius={0}>
            <CardBody>
              <Text fontSize={14} fontWeight={700} lineHeight="normal">
                Очень важная информация
              </Text>
              <Text fontSize={14} fontWeight={400} color="dark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim enim sit amet venenatis urna cursus eget nunc
                scelerisque.
              </Text>
              <Text
                color="date_gray"
                fontSize={12}
                fontWeight={400}
                marginTop="10px"
              >
                17 августа 2023 года
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card borderRadius={0}>
            <CardBody>
              <Text fontSize={14} fontWeight={700} lineHeight="normal">
                Очень важная информация
              </Text>
              <Text fontSize={14} fontWeight={400} color="dark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim enim sit amet venenatis urna cursus eget nunc
                scelerisque.
              </Text>
              <Text
                color="date_gray"
                fontSize={12}
                fontWeight={400}
                marginTop="10px"
              >
                17 августа 2023 года
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </VStack>
  );
};

export default MainInfo;
