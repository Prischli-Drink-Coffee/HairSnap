import { banks } from "./banks";
export const getRequisitesInn = (inn) => {
  let url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
  let token = "5672c4d43f52d70d0c8838b9f65c6b5c63c17122";

  let options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: inn }),
  };

  const result = fetch(url, options).then((response) => response.json());
  return result;
};

export const getBankName = (bic) => {
  let result = banks.find((elem) => `0${elem.Bic}` == bic);
  return result.ShortName;
};

export const getCSCHbyBic = (bic) => {
  let url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank";
  let token = "5672c4d43f52d70d0c8838b9f65c6b5c63c17122";

  let options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: bic }),
  };

  const result = fetch(url, options).then((response) => response.json());
  return result
};
