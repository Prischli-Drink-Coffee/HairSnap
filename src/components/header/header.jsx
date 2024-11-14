import React, { useRef } from "react";
import logo from "./../../images/Logotype.svg";
import {
  Flex,
  Box,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NavBar from "./navBar/navBar";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <Flex
      as="header"
      w="full"
      p={4}
      bg="white"
      color="white"
      align="center"
      justify="space-between"
      paddingLeft={["10px", "15px", "20px", "25px", "30px"]}
      paddingRight={["10px", "15px", "20px", "25px", "30px"]}
      paddingTop={5}
      paddingBottom={5}
      boxShadow="0px 0px 25px 0px rgba(0, 0, 0, 0.10)"
    >
      <Box as="a" href="/" fontSize="xl" fontWeight="bold">
        <Image src={logo} />
      </Box>
      <IconButton
        ref={btnRef}
        aria-label="Открыть меню"
        icon={<HamburgerIcon />}
        bgColor={"menu_white"}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize={22}>Навигация</DrawerHeader>
          <DrawerBody>
            <NavBar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;

// import {
//   HStack,
//   Image,
//   Stack,
//   Text,
//   useDimensions,
//   VStack,
// } from "@chakra-ui/react";
// import starbucks from "../../images/starbucks.svg";
// import logo from "./../../images/Logotype.svg";
// import useWindowDimensions from "../../hooks/window_dimensions";
// import { GoChevronDown } from "react-icons/go";
// import React, { useEffect, useRef, useState } from "react";
// import { useCookies } from "react-cookie";
// import NavBar from "./navBar/navBar";
// import { authenticationPaths, paths } from "./paths";
// import MyLink from "./link/my_link";

// const Header = () => {
//   const { width, height } = useWindowDimensions();
//   const [modalMenu, setModalMenu] = useState([false, null]);
//   const componentRef = useRef(null);
//   const dimensions = useDimensions(componentRef, true);
//   useEffect(() => {
//     if (width >= 966) {
//       setModalMenu([false, null]);
//     }
//   }, [width]);
//   const [cookie, setCookie] = useCookies(["token"]);
//   return (
//     <Stack
//       bg="white"
//       justifyContent="space-between"
//       align="center"
//       width="100%"
// paddingLeft={["10px", "15px", "20px", "25px", "30px"]}
// paddingRight={["10px", "15px", "20px", "25px", "30px"]}
// paddingTop={5}
// paddingBottom={5}
// boxShadow="0px 0px 25px 0px rgba(0, 0, 0, 0.10)"
//       direction="row"
//       spacing="20px"
//       ref={componentRef}
//     >
//       <Image src={logo} />
//       {width >= 1920 ? (
//         <HStack width={"100%"} justifyContent={"space-between"}>
//           <NavBar />
//         </HStack>
//       ) : width >= 1150 ? (
//         <VStack spacing="20px">
//           <NavBar />
//         </VStack>
//       ) : null}
//       <HStack>
//         {width < 1150 ? (
//           <GoChevronDown
//             width="20px"
//             onClick={() => {
//               let copy = Array.from(modalMenu);
//               if (copy[0]) {
//                 copy[0] = false;
//                 copy[1] = null;
//               } else {
//                 copy[0] = true;
//                 copy[1] = (
//                   <VStack
//                     padding="10px"
//                     position="absolute"
//                     top={dimensions.borderBox.height}
//                     right="0px"
//                     zIndex="20"
//                     backgroundColor="white"
//                   >
//                     <Text fontSize={14} fontWeight={"bold"} color={"#1a8dff"}>
//                       {cookie.userName}
//                     </Text>
//                     {paths.map((item) => {
//                       if (
//                         (item?.haveAccess?.has("AUTH") && cookie.role) ||
//                         item?.haveAccess?.has(cookie.role)
//                       ) {
//                         return (
//                           <MyLink
//                             key={item.name}
//                             to={item.path}
//                             name={item.name}
//                           />
//                         );
//                       }
//                     })}
//                     {authenticationPaths.map((item) => {
//                       if (
//                         item?.haveAccess?.has(cookie.role) ||
//                         (item?.haveAccess?.has("AUTH") &&
//                           cookie.role &&
//                           item.name !== "Имя")
//                       ) {
//                         return (
//                           <MyLink
//                             key={item.name}
//                             onClick={item.onClick}
//                             to={item.path}
//                             name={item.name}
//                           />
//                         );
//                       }
//                     })}
//                   </VStack>
//                 );
//               }
//               setModalMenu(copy);
//             }}
//           />
//         ) : null}
//         {modalMenu[1]}
//       </HStack>
//     </Stack>
//   );
// };

// export default Header;
