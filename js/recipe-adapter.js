/* ============================================================
   RECIPE ADAPTER
   Håndterer:
   - Bytte av ingredienser
   - Fjerning av ingredienser
   - Saltkompensasjon
   - Friskhet-/syretips
   - addStage-notater
   - Tilbakestilling
   ============================================================ */

import {
  servedAcid,
  swapOptions
} from "./paella-data.js";

export class RecipeAdapter {

  constructor(recipe) {

    this.baseRecipe =
      structuredClone(recipe);

    this.removed =
      new Set();

    this.swaps =
      new Map();

    this.messages = [];
  }

  /* ============================================================
     RESET
     ============================================================ */

  reset() {

    this.removed.clear();

    this.swaps.clear();

    this.messages = [];
  }

  /* ============================================================
     REMOVE
     ============================================================ */

  removeIngredient(id) {

    this.removed.add(id);
  }

  restoreIngredient(id) {

    this.removed.delete(id);
  }

  isRemoved(id) {

    return this.removed.has(id);
  }

  /* ============================================================
     SWAP
     ============================================================ */

  swapIngredient(sourceId, targetId) {

    const options =
      swapOptions[sourceId] || [];

    const found =
      options.find(
        option => option.id === targetId
      );

    if (!found) return false;

    this.swaps.set(
      sourceId,
      structuredClone(found)
    );

    return true;
  }

  clearSwap(sourceId) {

    this.swaps.delete(sourceId);
  }

  /* ============================================================
     PUBLIC
     ============================================================ */

  getRecipe() {

    this.messages = [];

    const recipe =
      structuredClone(this.baseRecipe);

    recipe.ingredients =
      recipe.ingredients.map(
        ingredient => this.#applySwap(ingredient)
      );

    recipe.ingredients =
      recipe.ingredients.filter(
        ingredient =>
          !this.removed.has(
            ingredient.originalId || ingredient.id
          )
      );

    this.#applyAdjustments(recipe);

    this.#checkAcidity(recipe);

    return recipe;
  }

  getMessages() {

    return [...this.messages];
  }

  /* ============================================================
     PRIVATE
     ============================================================ */

  #applySwap(ingredient) {

    const swap =
      this.swaps.get(ingredient.id);

    if (!swap) return ingredient;

    const result = {

      ...swap,

      role: ingredient.role,

      scaling: ingredient.scaling,

      removable:
        ingredient.removable,

      originalId:
        ingredient.id
    };

    if (swap.tradition) {

      this.messages.push({
        type: "tradition",
        text:
          `Valgt alternativ er ${swap.tradition}.`
      });
    }

    if (swap.note) {

      this.messages.push({
        type: "note",
        text: swap.note
      });
    }

    if (swap.addStage) {

      const text =
        this.#addStageText(
          swap.addStage,
          swap.label
        );

      this.messages.push({
        type: "timing",
        text
      });
    }

    return result;
  }

  /* ============================================================
     SALTKOMPENSASJON
     ============================================================ */

  #applyAdjustments(recipe) {

    recipe.ingredients.forEach(
      ingredient => {

        const sourceId =
          ingredient.originalId;

        if (!sourceId) return;

        const swap =
          this.swaps.get(sourceId);

        if (!swap) return;

        if (!swap.adjust) return;

        swap.adjust.forEach(rule => {

          const target =
            recipe.ingredients.find(
              item =>
                item.id === rule.target
            );

          if (!target) return;

          if (
            rule.op === "multiply"
          ) {

            target.amount =
              Number(
                (
                  target.amount *
                  rule.value
                ).toFixed(2)
              );

            if (
              target.id ===
              "salt_added"
            ) {

              this.messages.push({
                type: "salt",
                text:
                  "Saltmengden er automatisk redusert."
              });
            }
          }

          if (
            rule.op === "set"
          ) {

            target.amount =
              rule.value;
          }

        });

      }
    );
  }

  /* ============================================================
     SYREBALANSE
     ============================================================ */

  #checkAcidity(recipe) {

    const removedTomato =
      this.removed.has("tomato");

    if (removedTomato) {

      const tomato =
        this.baseRecipe.ingredients.find(
          ingredient =>
            ingredient.id === "tomato"
        );

      if (
        tomato &&
        tomato.onRemove
      ) {

        this.messages.push({
          type: "acid",
          text:
            tomato.onRemove.tip
        });
      }
    }

    else {

      this.messages.push({
        type: "acid",
        text: servedAcid.tip
      });
    }
  }

  /* ============================================================
     STAGE HELPERS
     ============================================================ */

  #addStageText(
    stage,
    label
  ) {

    switch (stage) {

      case "early":

        return `${label} tilsettes tidlig i prosessen.`;

      case "end":

        return `${label} legges på mot slutten.`;

      case "serve":

        return `${label} tilsettes ved servering.`;

      default:

        return "";
    }
  }

  /* ============================================================
     UI HELPERS
     ============================================================ */

  getSwapOptions(id) {

    return swapOptions[id] || [];
  }

  hasSwapOptions(id) {

    return (
      swapOptions[id] &&
      swapOptions[id].length
    );
  }

}
