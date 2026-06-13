/* ============================================================
   UNIT CONVERSIONS
   ============================================================ */

import { unitConversions } from "./paella-data.js";

/* ============================================================
   NORMALISERING
   ============================================================ */

function normalizeKey(id) {

  if (unitConversions[id]) {
    return id;
  }

  if (id === "more_mussels") {
    return "mussels";
  }

  if (id === "fish_stock") {
    return "stock";
  }

  if (id === "veg_stock") {
    return "stock";
  }

  if (id === "artichoke") {
    return "red_pepper";
  }

  if (id === "turmeric_paprika") {
    return "smoked_paprika";
  }

  return id;
}

/* ============================================================
   FINN MULIGE ENHETER
   ============================================================ */

export function getAvailableUnits(id) {

  const key = normalizeKey(id);

  const config =
    unitConversions[key];

  if (!config) {
    return [];
  }

  return Object.keys(
    config.units
  );
}

/* ============================================================
   BASISENHET
   ============================================================ */

export function getDefaultUnit(id) {

  const key = normalizeKey(id);

  const config =
    unitConversions[key];

  if (!config) {
    return null;
  }

  return config.defaultUnit;
}

/* ============================================================
   KONVERTER
   ============================================================ */

export function convertAmount(
  id,
  amount,
  fromUnit,
  toUnit
) {

  if (
    fromUnit === toUnit
  ) {
    return amount;
  }

  const key =
    normalizeKey(id);

  const config =
    unitConversions[key];

  if (!config) {
    return amount;
  }

  const factors =
    config.units;

  const defaultUnit =
    config.defaultUnit;

  if (
    !factors[toUnit]
  ) {
    return amount;
  }

  if (
    fromUnit !== defaultUnit
  ) {

    const reverse =
      factors[fromUnit];

    if (!reverse) {
      return amount;
    }

    amount =
      amount / reverse;
  }

  return Number(
    (
      amount *
      factors[toUnit]
    ).toFixed(2)
  );
}

/* ============================================================
   SKALERING
   ============================================================ */

export function scaleIngredient(
  ingredient,
  servings,
  baseServings = 4
) {

  const factor =
    servings /
    baseServings;

  switch (
    ingredient.scaling
  ) {

    case "fixed":
      return ingredient.amount;

    case "nonlinear":

      return Number(
        (
          ingredient.amount *
          Math.pow(
            factor,
            0.8
          )
        ).toFixed(2)
      );

    case "linear":

    default:

      return Number(
        (
          ingredient.amount *
          factor
        ).toFixed(2)
      );
  }
}

/* ============================================================
   FORMATTERING
   ============================================================ */

export function formatAmount(
  value
) {

  if (
    Number.isInteger(
      value
    )
  ) {
    return String(value);
  }

  return value
    .toFixed(2)
    .replace(/\.?0+$/, "");
}

/* ============================================================
   UI HJELPER
   ============================================================ */

export function buildUnitOptions(
  ingredientId,
  selectedUnit
) {

  const units =
    getAvailableUnits(
      ingredientId
    );

  return units
    .map(unit => {

      const selected =
        unit ===
        selectedUnit
          ? "selected"
          : "";

      return `
        <option
          value="${unit}"
          ${selected}
        >
          ${unit}
        </option>
      `;

    })
    .join("");
}

/* ============================================================
   TRADISJONSTEKST
   ============================================================ */

export function traditionLabel(
  tradition
) {

  switch (
    tradition
  ) {

    case "traditional":
      return "Tradisjonell";

    case "regional":
      return "Regional";

    case "non-traditional":
      return "Ikke tradisjonell";

    default:
      return "";
  }
}
