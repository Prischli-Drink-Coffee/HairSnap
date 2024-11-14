import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

function Helper() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ position: "fixed", right: "10px", top: "150px" }}>
      <Button
        onClick={openModal}
        bgColor={"transparent"}
        _hover={{ background: "transparent" }}
      >
        <QuestionOutlineIcon boxSize={5} />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="sm"
        isCentered={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent marginStart="0">
          <ModalHeader>FAQ (краткое руководство)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Роли
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Существует всего несколько ролей а именно Администратор ,
                  ответственный за склад, Мастер, менеджер и дизайнер. <br />
                  <br />
                  <b>Администратор</b> может создавать категории товаров
                  карточки товаров вносить в базу их приход перемещать товары
                  между складами резервировать товары и просматривать остатки .{" "}
                  <br />
                  <br />
                  <b>Ответственный за склад</b> может все тоже что и
                  администратор кроме создания категорий товаров и он может
                  проводить все действия только на своем складе. <br />
                  <br />
                  <b>Мастер</b> может все тоже кроме создания карточек товаров и
                  их категорий а также внесения в базу прихода товара. <br />
                  <br />
                  <b>Менеджер и Дизайнер </b>могут только резервировать товар
                  под заказ и просматривать остатки материалов
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Как создать материал ?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <b>Чтобы создать материал</b>, выполните следующие шаги:
                  <br /> Перейдите на вкладку Материалы в боковом меню.
                  <br />
                  <br /> Нажмите на кнопку Добавить материал.
                  <br />
                  <br /> Заполните необходимые поля для материала.
                  <br />
                  <br />
                  <b>Примечание:</b> перед созданием материала, убедитесь, что
                  вы создали свойства ТМЦ, тип ТМЦ и способы обработки на
                  соответствующих вкладках в боковом меню.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Как принять материал ?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <b>Чтобы принять товар на склад</b>, выполните следующие шаги:
                  <br />
                  <br />
                  Перейдите на вкладку Материалы в боковом меню.
                  <br />
                  <br /> Выберите пункт Нераспределенные в выпадающем списке над
                  таблицей материалов.
                  <br />
                  <br />
                  Найдите материал, который вы хотите принять, и нажмите на
                  значок Стрелочки справа от него.
                  <br />
                  <br /> В появившемся окне введите количество материала и
                  склад, на который вы хотите его распределить.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Как заказать материал ?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <b>Чтобы закупить материал</b>, выполните следующие шаги:{" "}
                  <br />
                  <br />
                  Найдите материал, который вы хотите заказать, в таблице
                  материалов и нажмите на иконку Корзинка справа от него.
                  <br />
                  <br /> В появившемся окне введите количество материала, цену
                  за единицу и тд.
                  <br />
                  <br /> Выберите поставщика материала из списка или добавьте
                  нового поставщика, перейдя на вкладку Поставщики в боковом
                  меню и нажав на кнопку Добавить.
                  <br />
                  <br /> Выберите способ доставки материала из списка или
                  добавьте новый способ доставки, перейдя на вкладку Способы
                  доставки в боковом меню и нажав на кнопку Добавить.
                  <br />
                  <br />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Как сменить пароль ?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Если вы хотите сменить пароль или другие данные, пожалуйста,
                  свяжитесь с администратором.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Как списать материал ?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <b>Чтобы списать товар</b>, выполните следующие шаги:
                  <br />
                  <br /> Перейдите на вкладку Списания в боковом меню.
                  <br />
                  <br /> Нажмите на кнопку Создать списание.
                  <br />
                  <br /> Заполните необходимые поля для списания: причина,
                  склад, материал и количество.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Helper;
