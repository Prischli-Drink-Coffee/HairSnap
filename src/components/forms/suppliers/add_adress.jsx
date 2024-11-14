import {
  VStack,
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import DeliveryPlaceService from "../../../API/services/deliveryPlaces_service";

const AddAdress = ({ getAdresses }) => {
  const [adressAlert, setAdressAlert] = useState();
  const createAdress = async (adress) => {
    try {
      await DeliveryPlaceService.createDeliveryPlace(adress);
      getAdresses();
      setAdressAlert(<Text color={"#28D146"}>Успешно</Text>);
      setTimeout(() => {
        setAdressAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error createProperty:", error);
      setAdressAlert(<Text color={"#FF0F00"}>Ошибка</Text>);
      setTimeout(() => {
        setAdressAlert(null);
      }, 3000);
    }
  };
  const [newAdress, setNewAdress] = useState({
    address: "",
    comment: "string",
  });
  return (
    <Accordion allowMultiple width={"100%"}>
      <AccordionItem>
        <AccordionButton>
          Не нашли нужный адрес? <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <VStack width={"100%"} align={"flex-end"}>
            <Input
              placeholder="Адрес"
              onChange={(e) => {
                setNewAdress({
                  address: e.target.value,
                  comment: "string",
                });
              }}
            />
            <Button
              variant={"menu_yellow"}
              onClick={() => {
                newAdress.address.length >= 2
                  ? createAdress(newAdress)
                  : setAdressAlert(<Text color={"#FF0F00"}>Ошибка</Text>);
                setTimeout(() => {
                  setAdressAlert(null);
                }, 3000);
              }}
            >
              Создать
            </Button>
            {adressAlert}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
export default AddAdress;
