import { Text, VStack } from "@chakra-ui/react";
import React from "react";
import TablePurchases from "../components/tables/tablePurchases/table_purchases";

const PurchasesPage = () => {
  return (
    <VStack
      padding={25}
      alignItems="flex-start"
      spacing="20px"
      flexGrow={1}
      width="100%"
    >
      <Text
        color="#000"
        fontSize='22px !important'
        fontWeight={700}
        lineHeight="normal"
        fontStyle="normal"
      >
        Закупки
      </Text>
      <Text fontSize={14} fontWeight={400} marginBottom="20px">
        Информация о закупках
      </Text>
      <TablePurchases />
    </VStack>
  );
};
export default PurchasesPage;
