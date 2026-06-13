/* ============================================================
   APP
   ============================================================ */

import {
  paellaRecipes
} from "./paella-data.js";

import {
  RecipeAdapter
} from "./recipe-adapter.js";

import {
  scaleIngredient,
  convertAmount,
  getDefaultUnit,
  buildUnitOptions,
  traditionLabel,
  formatAmount
} from "./unit-conversions.js";

/* ============================================================
   STATE
   ============================================================ */

const STORAGE_KEY =
  "paella-builder-state";

let currentLevel = "medium";

let servings = 4;

let customizeMode = false;

let adapter =
  new RecipeAdapter(
    paellaRecipes.medium
  );

let unitSelections = {};

/* ============================================================
   DOM
   ============================================================ */

const ingredientsEl =
  document.getElementById(
    "ingredients"
  );

const stepsEl =
  document.getElementById(
    "steps"
  );

const tipsEl =
  document.getElementById(
    "tips"
  );

const servingsEl =
  document.getElementById(
    "servings"
  );

const customizeEl =
  document.getElementById(
    "customize"
  );

const resetEl =
  document.getElementById(
    "reset"
  );

/* ============================================================
   LOCAL STORAGE
   ============================================================ */

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,

    JSON.stringify({

      currentLevel,

      servings,

      customizeMode,

      unitSelections

    })
  );
}

function loadState() {

  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!raw) {
    return;
  }

  try {

    const state =
      JSON.parse(raw);

    currentLevel =
      state.currentLevel ||
      "medium";

    servings =
      state.servings || 4;

    customizeMode =
      state.customizeMode || false;

    unitSelections =
      state.unitSelections || {};

  } catch {

    console.warn(
      "Kunne ikke laste state."
    );
  }

}

/* ============================================================
   LEVEL
   ============================================================ */

function changeLevel(
  level
) {

  currentLevel =
    level;

  adapter =
    new RecipeAdapter(
      paellaRecipes[level]
    );

  unitSelections = {};

  render();

  saveState();
}

/* ============================================================
   RESET
   ============================================================ */

function resetRecipe() {

  adapter.reset();

  unitSelections = {};

  render();

  saveState();
}

/* ============================================================
   INGREDIENT RENDER
   ============================================================ */

function renderIngredient(
  ingredient
) {

  const sourceId =
    ingredient.originalId ||
    ingredient.id;

  const selectedUnit =
    unitSelections[sourceId] ||
    ingredient.unit ||
    getDefaultUnit(
      ingredient.id
    );

  const scaledAmount =
    scaleIngredient(
      ingredient,
      servings
    );

  const converted =
    convertAmount(

      ingredient.id,

      scaledAmount,

      ingredient.unit,

      selectedUnit
    );

  const tradition =
    traditionLabel(
      ingredient.tradition
    );

  const removable =
    ingredient.removable;

  const swapOptions =
    adapter.getSwapOptions(
      sourceId
    );

  return `

  <div class="ingredient-card">

    <div class="ingredient-main">

      <div>

        <div class="ingredient-name">
          ${ingredient.label}
        </div>

        ${
          tradition
            ? `
          <div class="tradition">
            ${tradition}
          </div>
          `
            : ""
        }

      </div>

      <div class="ingredient-amount">

        ${formatAmount(
          converted
        )}

        <select
          class="unit-select"
          data-unit="${sourceId}"
        >

          ${buildUnitOptions(
            ingredient.id,
            selectedUnit
          )}

        </select>

      </div>

    </div>

    ${
      customizeMode
        ? renderCustomizeControls(
            ingredient,
            sourceId,
            swapOptions
          )
        : ""
    }

  </div>

  `;
}

/* ============================================================
   CUSTOMIZE
   ============================================================ */

function renderCustomizeControls(
  ingredient,
  sourceId,
  swapOptions
) {

  return `

    <div class="customize-row">

      ${
        swapOptions.length
          ? `

          <select
            class="swap-select"
            data-swap="${sourceId}"
          >

            <option value="">
              Ingen bytte
            </option>

            ${swapOptions
              .map(
                option => `
                <option
                  value="${option.id}"
                >
                  ${option.label}
                </option>
              `
              )
              .join("")}

          </select>

          `
          : ""
      }

      ${
        ingredient.removable
          ? `

          <button
            class="remove-btn"
            data-remove="${sourceId}"
          >
            Fjern
          </button>

          `
          : ""
      }

    </div>

  `;
}

/* ============================================================
   STEPS
   ============================================================ */

function renderSteps(
  recipe
) {

  stepsEl.innerHTML =
    recipe.steps
      .map(
        step =>
          `<li>${step}</li>`
      )
      .join("");
}

/* ============================================================
   MESSAGES
   ============================================================ */

function renderMessages() {

  const messages =
    adapter.getMessages();

  tipsEl.innerHTML =
    messages
      .map(
        message => `

        <div
          class="tip tip-${message.type}"
        >
          ${message.text}
        </div>

      `
      )
      .join("");
}

/* ============================================================
   RENDER
   ============================================================ */

function render() {

  servingsEl.value =
    servings;

  customizeEl.checked =
    customizeMode;

  document
    .querySelectorAll(
      "[data-level]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",

        button.dataset.level ===
          currentLevel
      );

    });

  const recipe =
    adapter.getRecipe();

  ingredientsEl.innerHTML =
    recipe.ingredients
      .map(
        ingredient =>
          renderIngredient(
            ingredient
          )
      )
      .join("");

  renderSteps(recipe);

  renderMessages();

  bindEvents();
}

/* ============================================================
   EVENTS
   ============================================================ */

function bindEvents() {

  document
    .querySelectorAll(
      ".unit-select"
    )
    .forEach(select => {

      select.addEventListener(
        "change",

        event => {

          unitSelections[
            event.target.dataset.unit
          ] =
            event.target.value;

          saveState();

          render();
        }
      );
    });

  document
    .querySelectorAll(
      ".swap-select"
    )
    .forEach(select => {

      select.addEventListener(
        "change",

        event => {

          const sourceId =
            event.target.dataset.swap;

          const targetId =
            event.target.value;

          if (!targetId) {

            adapter.clearSwap(
              sourceId
            );

          } else {

            adapter.swapIngredient(
              sourceId,
              targetId
            );
          }

          saveState();

          render();
        }
      );
    });

  document
    .querySelectorAll(
      ".remove-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",

        event => {

          adapter.removeIngredient(
            event.target.dataset.remove
          );

          saveState();

          render();
        }
      );
    });

}

/* ============================================================
   TOP LEVEL EVENTS
   ============================================================ */

document
  .querySelectorAll(
    "[data-level]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",

      () =>
        changeLevel(
          button.dataset.level
        )
    );

  });

servingsEl.addEventListener(
  "input",

  event => {

    servings =
      Number(
        event.target.value
      );

    saveState();

    render();
  }
);

customizeEl.addEventListener(
  "change",

  event => {

    customizeMode =
      event.target.checked;

    saveState();

    render();
  }
);

resetEl.addEventListener(
  "click",

  () => {

    resetRecipe();
  }
);

/* ============================================================
   START
   ============================================================ */

loadState();

changeLevel(
  currentLevel
);

render();
