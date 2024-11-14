import { Button, Input, Text, VStack, Box } from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import UserService from "../API/services/user_service";
import { setUser } from "../API/helper/userCookie";
import { useNavigate } from "react-router";
import { ReactComponent as LoginIcon } from "./authorization.svg"; // Импорт вашего SVG

const SignInPage = () => {
    const navigate = useNavigate();

    // Валидация формы
    const validate = (values) => {
        const errors = {};

        if (!values.login) {
            errors.login = "Логин обязательное поле";
        } else if (values.login.length > 15) {
            errors.login = "Логин не должен превышать 15 символов";
        }
        if (!values.password) {
            errors.password = "Пароль обязательное поле";
        }

        return errors;
    };

    // Функция для входа
    const signIn = async (values) => {
        try {
            const response = await UserService.signIn(values.login, values.password);
            const me = await UserService.me(response.data.token);
            setUser({ ...me.data, token: response.data.token });
            alert("Вы успешно вошли в систему");
            navigate("/materials");
        } catch (error) {
            console.error("Error signIn:", error);
            alert("Ошибка в данных!");
        }
    };

    // Использование useFormik для обработки формы
    const formik = useFormik({
        initialValues: {
            login: "",
            password: "",
        },
        validate,
        onSubmit: (values) => {
            signIn(values);
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
                as={LoginIcon}
                width="100%"
                height="100%"
                position="absolute"
                top="0"
                left="0"
                zIndex="-1" // SVG должен быть фоном
            />

            <VStack minH="100vh" align="center" justify="center" spacing="20px">
                <VStack
                    spacing="20px"
                    align="center"
                    border="1px solid #ddd"
                    p="20px"
                    borderRadius="md"
                    background="rgba(255, 255, 255, 0.8)" // Полупрозрачный фон для формы
                >
                    <Text fontSize="2xl" fontWeight="bold">Вход в систему</Text>

                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing="15px" align="stretch">
                            {/* Поле для логина */}
                            <Input
                                id="login"
                                name="login"
                                type="text"
                                placeholder="Логин"
                                onChange={formik.handleChange}
                                value={formik.values.login}
                                isInvalid={formik.errors.login && formik.touched.login}
                            />
                            {formik.errors.login && formik.touched.login && (
                                <Text color="red.500">{formik.errors.login}</Text>
                            )}

                            {/* Поле для пароля */}
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Пароль"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                isInvalid={formik.errors.password && formik.touched.password}
                            />
                            {formik.errors.password && formik.touched.password && (
                                <Text color="red.500">{formik.errors.password}</Text>
                            )}

                            {/* Кнопка отправки формы */}
                            <Button type="submit" colorScheme="teal" size="lg" width="full">
                                Войти
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </VStack>
        </Box>
    );
};

export default SignInPage;
