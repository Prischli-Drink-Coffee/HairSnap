import React from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { authenticationPaths, paths } from "../paths";
import MyLink from "../link/my_link";
import { useCookies } from "react-cookie";

const NavBar = () => {
  const [cookie, setCookie] = useCookies(["token"]);

  return (
    <VStack align={'flex-start'}>
        {paths.map((item) => {
          if (
            item?.haveAccess?.has(cookie.role) ||
            (item?.haveAccess?.has("AUTH") && cookie.role)
          ) {
            return <MyLink key={item.name} to={item.path} name={item.name} />;
          }
        })}
        {authenticationPaths.map((item) => {
          if (
            item?.haveAccess?.has(cookie.role) ||
            (item?.haveAccess?.has("AUTH") &&
              cookie.role &&
              item.name !== "Имя")
          ) {
            return (
              <MyLink
                key={item.name}
                onClick={item.onClick}
                to={item.path}
                name={item.name}
              />
            );
          } else if (
            item.name === "Имя" &&
            item?.haveAccess?.has("AUTH") &&
            cookie.role
          ) {
            return (
              <Text
                key={item.name}
                fontSize={22}
                fontWeight={"bold"}
                color={"#1a8dff"}
              >
                {cookie.userName}
              </Text>
            );
          }
        })}
    </VStack>
  );
};

export default NavBar;
