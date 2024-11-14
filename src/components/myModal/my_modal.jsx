import "./my_modal.css";
import React from "react";

// В данном классе используется именно css, так
// как нужно применять стиль к классу MyModalContent, который находится в body.chakra-ui-dark
// с module.css это не работает
const MyModal = (props) => {
  const rootClasses = ["myModal"];
  if (props.visibleModal) {
    rootClasses.push("active");
  }

  const setVisibleFunc = () => {
    props.setVisibleModal(false);
  };

  return (
    <div className={rootClasses.join(" ")} onClick={() => setVisibleFunc()}>
      <div className={"MyModalContent"} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};

export default MyModal;
