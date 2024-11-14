import React, { useEffect, useState } from "react";
import { Box, CloseButton, Image } from "@chakra-ui/react";
import chevronUp from "../../../../images/chevron-up.svg";
import classNames from "./slider.module.css";

const Slider = ({ deleteImage, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images.length]);

  const reduce = () => {
    if (currentImageIndex <= 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setCurrentImageIndex((prev) => --prev);
    }
  };

  const increase = () => {
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex((prev) => ++prev);
    }
  };

  return (
    <Box position={"relative"}>
      <CloseButton
        onClick={() => deleteImage(currentImageIndex)}
        position={"absolute"}
        zIndex={2}
      />
      <Box
        className={classNames.arrow}
        cursor={"pointer"}
        height={"100%"}
        position={"absolute"}
        width={"64px"}
        alignItems={"center"}
        display={"flex"}
        justifyContent={"center"}
        zIndex={1}
        onClick={reduce}
      >
        <Image src={chevronUp} w="32px" h="32px" transform={"rotate(270deg)"} />
      </Box>
      <Box
        className={classNames.arrow}
        cursor={"pointer"}
        position={"absolute"}
        height={"100%"}
        left={"calc(100% - 64px)"}
        width={"64px"}
        alignItems={"center"}
        display={"flex"}
        justifyContent={"center"}
        zIndex={1}
        onClick={increase}
      >
        <Image src={chevronUp} w="32px" h="32px" transform={"rotate(90deg)"} />
      </Box>
      {images.map((image, index) => {
        return (
          <Box
            key={index}
            alignItems={"center"}
            display={index === currentImageIndex ? "flex" : "none"}
            justifyContent={"center"}
          >
            <Image
              objectFit={"contain"}
              height={"300px"}
              src={image}
              alt={"Изображение"}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default Slider;
