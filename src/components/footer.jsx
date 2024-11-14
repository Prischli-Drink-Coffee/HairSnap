import { HStack, Image, Text } from "@chakra-ui/react";
import up from "./../images/up.svg";

const Footer = () => {
  return (
    <HStack
      backgroundColor="#FFF7EE"
      width="100%"
      minHeight={["60px", "70px", "80px", "90px", "100px"]}
      boxShadow="0px 0px 25px 0px rgba(0, 0, 0, 0.10)"
      padding={["10px", "12px", "15px", "20px", "25px"]}
    >
      <HStack justify="space-between" width="100%" align="center">
        <Text
          color="light_dark"
          fontSize={["12px", "14px", "16px", "16px", "16px"]}
        >
          Дизайн студия RICO DESIGN © 1995–2024
        </Text>
        <HStack
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <Text
            color="light_dark"
            fontSize={["12px", "14px", "16px", "16px", "16px"]}
          >
            Вверх страницы
          </Text>
          <Image src={up} />
        </HStack>
      </HStack>
    </HStack>
  );
};
export default Footer;
