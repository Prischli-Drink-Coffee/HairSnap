import { Divider, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import side_menu_back from "./../images/background.png";
import logo from "./../images/logo.svg";
import chevron_left from "./../images/chevron-left.svg";
import design_sklad_logo from "./../images/design_sklad_logo.svg";
import poligraphy_sklad_logo from "./../images/poligraphy_sklad_logo.svg";
import promote_sklad_logo from "./../images/promote_sklad_logo.svg";
import souvenirs_sklad_logo from "./../images/souvenirs_sklad_logo.svg";

import useWindowDimensions from "../hooks/window_dimensions";
import { NavLink } from "react-router-dom";

const SideMenu = () => {
  const { height, width } = useWindowDimensions();
  const { display, setDisplay } = useState(false);
  return (
    <VStack
      bgImage={side_menu_back}
      minH="100%"
      minW="200px"
      padding="20px"
      position="fixed"
      width={[200, 200, 200, 210, 220]}
      alignItems="flex-start"
      top={0}
      left={0}
      zIndex={1}
      overflow="hidden"
      overflowX="hidden"
    >
      <HStack justify="space-between" paddingBottom={[10, 15]} w="100%">
        <Image src={logo} w={100} h={61} />
        <Image justifySelf="flex-end" src={chevron_left} />
      </HStack>
      <Divider orientation="horizontal" color="#CCC3C2" />
      <VStack
        alignItems="flex-start"
        paddingBottom={[10, 15]}
        paddingTop={[10, 15]}
      >
        <HStack spacing="13px">
          <Image src={design_sklad_logo} color="white" />
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
          >
            Дизайн и проектирование
          </Text>
        </HStack>
        <HStack spacing="13px">
          <Image src={poligraphy_sklad_logo} />
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
          >
            Прикладная полиграфия
          </Text>
        </HStack>
        <HStack spacing="13px">
          <Image src={souvenirs_sklad_logo} />
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
          >
            Сувенирная продукция
          </Text>
        </HStack>
        <HStack spacing="13px">
          <Image src={promote_sklad_logo} />
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
          >
            Рекламное производство
          </Text>
        </HStack>
      </VStack>
      <Divider orientation="horizontal" color="#CCC3C2" />
      <VStack
        alignItems="flex-start"
        spacing="15px"
        paddingBottom={[10, 15]}
        paddingTop={[10, 15]}
      >
        <Text
          fontSize={[13, 13, 14, 15, 16]}
          fontStyle="normal"
          fontWeight="700"
          textColor="#D3D2D2"
          variant="side_menu_hover"
        >
          Поставщики
        </Text>
        <NavLink to="/materials">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Материалы
          </Text>
        </NavLink>
        <NavLink to="/purchases">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Закупки
          </Text>
        </NavLink>
        <NavLink to="/properties">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Свойства
          </Text>
        </NavLink>
        <NavLink to="/craftifies">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Способы обработки
          </Text>
        </NavLink>
        <NavLink to="/tmcs">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            ТМЦ
          </Text>
        </NavLink>
        <NavLink to="/tmctypes">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Типы ТМЦ
          </Text>
        </NavLink>
        <NavLink to="/delivery_methods">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Методы доставки
          </Text>
        </NavLink>
        <NavLink to="/delivery_places">
          <Text
            fontSize={[13, 13, 14, 15, 16]}
            fontStyle="normal"
            fontWeight="700"
            textColor="#D3D2D2"
            variant="side_menu_hover"
          >
            Места отгрузки
          </Text>
        </NavLink>
        <Text
          fontSize={[13, 13, 14, 15, 16]}
          fontStyle="normal"
          fontWeight="700"
          textColor="#D3D2D2"
          variant="side_menu_hover"
        >
          Перемещение товаров
        </Text>
        <Text
          fontSize={[13, 13, 14, 15, 16]}
          fontStyle="normal"
          fontWeight="700"
          textColor="#D3D2D2"
          variant="side_menu_hover"
        >
          Уровни доступа
        </Text>
      </VStack>
      <Divider orientation="horizontal" color="#CCC3C2" />
    </VStack>
  );
};
export default SideMenu;
