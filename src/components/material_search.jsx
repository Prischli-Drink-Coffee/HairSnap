import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function MaterialSearch() {
  // note: the id field is mandatory
  const items = [
    {
      id: 8,
      name: "Хаскелл, Компилятор, Интерпретатор, ООП, 1961",
      comment: "",
      tmcName: "Язык программирования",
      tmcTypeName: "Кодерство",
      supplierNames: "",
      count: 0,
      trim: true,
      show: true,
    },
    {
      id: 7,
      name: "Руби, Компилятор, Интерпретатор, ООП, 1993",
      comment: null,
      tmcName: "Язык программирования",
      tmcTypeName: "Кодерство",
      supplierNames: "",
      count: 0,
      trim: false,
      show: true,
    },
    {
      id: 6,
      name: "Рулон, 12, 12, 12, Чаехлеб",
      comment: "",
      tmcName: "Англичане",
      tmcTypeName: "Английские",
      supplierNames: "",
      count: 0,
      trim: true,
      show: true,
    },
    {
      id: 4,
      name: "Бумага, 12, 12, 120, Чаехлеб",
      comment: null,
      tmcName: "Англичане",
      tmcTypeName: "Английские",
      supplierNames: "",
      count: 0,
      trim: true,
      show: true,
    },
    {
      id: 3,
      name: "Джон, 130, 130, 100, Чаехлеб",
      comment: null,
      tmcName: "Англичане",
      tmcTypeName: "Английские",
      supplierNames: "",
      count: 0,
      trim: true,
      show: true,
    },
  ];

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
  };

  const handleOnHover = (result) => {
    // the item hovered
  };

  const handleOnSelect = (item) => {
    // the item selected
  };

  const handleOnFocus = () => {};

  const formatResult = (item) => {
    return (
      <>
        {/* <span style={{ display: "block", textAlign: "left" }}>
          id: {item.id}
        </span> */}
        <span style={{ display: "block", textAlign: "left" }}>
          name: {item.name}
        </span>
      </>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 400 }}>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
          />
        </div>
      </header>
    </div>
  );
}

export default MaterialSearch;
