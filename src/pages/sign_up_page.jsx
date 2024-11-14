import React from "react";
import { Button, Input, SimpleGrid, Text, VStack, Box } from "@chakra-ui/react";
import { useFormik } from "formik";
import UserService from "../API/services/user_service";
import { ReactComponent as RegistrationIcon } from "./registration.svg"; // Импорт вашего SVG

const SignUpPage = () => {
  // Валидация данных
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // Функция регистрации
  const signUp = async (values) => {
    try {
      await UserService.signUp(values);
      alert("User registered successfully");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error during registration");
    }
  };

  // Используем useFormik для обработки формы
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      signUp(values);
    },
  });

  return (
    <Box
      position="relative"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* Фоновый SVG, который занимает всё окно */}
      <Box
        as={RegistrationIcon}
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"  // SVG должен быть фоном
      />
      
      <VStack minH="100vh" align="center" justify="center" spacing="15px">
        <VStack
          spacing="15px"
          align="center"
          border="1px solid #ddd"
          p="10"
          borderRadius="md"
          background="rgba(255, 255, 255, 0.7)" // Полупрозрачный фон для формы
        >
          <form onSubmit={formik.handleSubmit}>
            <SimpleGrid minW="300px" spacing={5}>
              {/* Поле для ввода email */}
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <Text color="red.500">{formik.errors.email}</Text>
              )}

              {/* Поле для ввода пароля */}
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <Text color="red.500">{formik.errors.password}</Text>
              )}

              {/* Кнопка отправки формы */}
              <Button type="submit" colorScheme="teal" size="lg">
                Создать
              </Button>
            </SimpleGrid>
          </form>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SignUpPage;
