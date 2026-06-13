/* ============================================================
   PAILLA DATA
   ============================================================ */

/* ===== Serveringssyre for oppskrifter uten tomat ===== */

export const servedAcid = {
  label: "Sitronbåter",
  when: "ved servering",
  tip: "Server med sitronbåter for friskhet. Ekstra viktig ved salte ingredienser som chorizo eller ekstra skjell."
};

/* ============================================================
   ENHETSKONVERTERINGER
   Faktorene angir hvor mange target-enheter som tilsvarer
   1 gram eller 1 ml av basisen.
   ============================================================ */

export const unitConversions = {

  rice: {
    defaultUnit: "g",
    units: {
      g: 1,
      ml: 1.25,
      dl: 0.0125
    }
  },

  stock: {
    defaultUnit: "ml",
    units: {
      ml: 1,
      dl: 0.01,
      l: 0.001
    }
  },

  olive_oil: {
    defaultUnit: "ml",
    units: {
      ml: 1,
      ss: 1 / 15,
      ts: 1 / 5,
      g: 0.92
    }
  },

  tomato: {
    defaultUnit: "g",
    units: {
      g: 1,
      ml: 1,
      dl: 0.01
    }
  },

  onion: {
    defaultUnit: "g",
    units: {
      g: 1,
      stk: 1 / 110
    }
  },

  garlic: {
    defaultUnit: "g",
    units: {
      g: 1,
      fedd: 1 / 5
    }
  },

  red_pepper: {
    defaultUnit: "g",
    units: {
      g: 1,
      stk: 1 / 150
    }
  },

  green_beans: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  peas: {
    defaultUnit: "g",
    units: {
      g: 1,
      dl: 0.015
    }
  },

  chicken: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  rabbit: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  pork: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  chorizo: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  prawns: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  mussels: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  squid: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  clams: {
    defaultUnit: "g",
    units: {
      g: 1
    }
  },

  saffron: {
    defaultUnit: "g",
    units: {
      g: 1,
      ts: 0.25
    }
  },

  smoked_paprika: {
    defaultUnit: "g",
    units: {
      g: 1,
      ts: 0.4,
      ss: 0.13
    }
  },

  sweet_paprika: {
    defaultUnit: "g",
    units: {
      g: 1,
      ts: 0.4,
      ss: 0.13
    }
  }
};

/* ============================================================
   FELLES BYTTER
   ============================================================ */

export const swapOptions = {

  chicken: [

    {
      id: "rabbit",
      label: "Kanin (tradisjonell)",
      amount: 300,
      unit: "g",
      sodiumPer100g: 50,
      tradition: "traditional",
      note: "Magrere. Brunes tidlig."
    },

    {
      id: "pork",
      label: "Svineribbe i biter",
      amount: 300,
      unit: "g",
      sodiumPer100g: 60,
      tradition: "regional",
      note: "Litt fetere."
    },

    {
      id: "chorizo",
      label: "Chorizo",
      amount: 250,
      unit: "g",
      sodiumPer100g: 1235,
      tradition: "non-traditional",

      note:
        "Salt og fet. Ikke tradisjonell. Salt reduseres automatisk.",

      adjust: [
        {
          target: "salt_added",
          op: "multiply",
          value: 0.4
        },
        {
          target: "smoked_paprika",
          op: "multiply",
          value: 0.5
        }
      ]
    }
  ],

  prawns: [

    {
      id: "squid",
      label: "Blekksprutringer",
      amount: 200,
      unit: "g",
      sodiumPer100g: 45,
      addStage: "early",
      note: "Surres kort tidlig."
    },

    {
      id: "more_mussels",
      label: "Mer blåskjell",
      amount: 300,
      unit: "g",
      sodiumPer100g: 285,
      addStage: "end",
      note: "Gir mer saltsmak fra skjellkraft."
    }
  ],

  mussels: [
    {
      id: "clams",
      label: "Skjell (clams)",
      amount: 200,
      unit: "g",
      sodiumPer100g: 600
    }
  ],

  stock: [

    {
      id: "fish_stock",
      label: "Fiskekraft",
      amount: 6,
      unit: "dl",
      sodiumPer100g: 200
    },

    {
      id: "veg_stock",
      label: "Grønnsakskraft",
      amount: 6,
      unit: "dl",
      sodiumPer100g: 150
    }
  ],

  saffron: [
    {
      id: "turmeric_paprika",
      label: "Gurkemeie + paprika",
      amount: 1,
      unit: "ts",
      note: "Gir farge, men ikke safranaroma."
    }
  ],

  smoked_paprika: [
    {
      id: "sweet_paprika",
      label: "Søt paprika",
      amount: 1,
      unit: "ts",
      tradition: "traditional"
    }
  ],

  red_pepper: [

    {
      id: "artichoke",
      label: "Artisjokk",
      amount: 200,
      unit: "g",
      tradition: "traditional"
    },

    {
      id: "green_beans",
      label: "Flate grønne bønner",
      amount: 150,
      unit: "g",
      tradition: "traditional"
    }
  ]
};

/* ============================================================
   GRUNNOPPSKRIFTER
   ============================================================ */

export const paellaRecipes = {
  enkel: {
    label: "Enkel",
    servings: 4,

    ingredients: [
      {
        id: "rice",
        label: "Paellaris",
        amount: 3,
        unit: "dl",
        role: "rice",
        essential: true,
        scaling: "linear"
      },

      {
        id: "stock",
        label: "Kyllingkraft",
        amount: 6,
        unit: "dl",
        role: "liquid",
        scaling: "linear"
      },

      {
        id: "chicken",
        label: "Kyllinglår",
        amount: 300,
        unit: "g",
        role: "protein",
        scaling: "linear",
        sodiumPer100g: 75
      },

      {
        id: "prawns",
        label: "Reker",
        amount: 200,
        unit: "g",
        role: "seafood",
        scaling: "linear",
        removable: true,
        addStage: "end"
      },

      {
        id: "salt_added",
        label: "Salt",
        amount: 1,
        unit: "ts",
        role: "seasoning",
        scaling: "nonlinear"
      }
    ],

    steps: [
      "Legg safranen i varm kraft.",
      "Brun kyllingen.",
      "Tilsett ris og kraft.",
      "Legg på rekene mot slutten.",
      "La hvile og server."
    ]
  },

  medium: {
    label: "Medium",
    servings: 4,

    ingredients: [
      {
        id: "rice",
        label: "Paellaris",
        amount: 3,
        unit: "dl",
        role: "rice",
        essential: true,
        scaling: "linear"
      },

      {
        id: "stock",
        label: "Kyllingkraft",
        amount: 6,
        unit: "dl",
        role: "liquid",
        scaling: "linear"
      },

      {
        id: "chicken",
        label: "Kyllinglår",
        amount: 300,
        unit: "g",
        role: "protein",
        scaling: "linear"
      },

      {
        id: "prawns",
        label: "Scampi/reker",
        amount: 200,
        unit: "g",
        role: "seafood",
        scaling: "linear",
        removable: true,
        addStage: "end"
      },

      {
        id: "mussels",
        label: "Blåskjell",
        amount: 150,
        unit: "g",
        role: "seafood",
        scaling: "linear",
        removable: true
      },

      {
        id: "red_pepper",
        label: "Rød paprika",
        amount: 1,
        unit: "stk",
        role: "vegetable",
        scaling: "linear"
      },

      {
        id: "salt_added",
        label: "Salt",
        amount: 1,
        unit: "ts",
        role: "seasoning",
        scaling: "nonlinear"
      }
    ],

    steps: [
      "Brun kylling.",
      "Surr grønnsaker.",
      "Tilsett ris.",
      "Hell over kraft.",
      "Tilsett sjømat.",
      "La hvile."
    ]
  },

  kompleks: {
    label: "Kompleks",
    servings: 4,

    ingredients: [
      {
        id: "rice",
        label: "Paellaris (bomba)",
        amount: 3,
        unit: "dl",
        role: "rice",
        essential: true,
        scaling: "linear"
      },

      {
        id: "stock",
        label: "Skalldyrkraft",
        amount: 7,
        unit: "dl",
        role: "liquid",
        scaling: "linear"
      },

      {
        id: "tomato",
        label: "Revet tomat",
        amount: 150,
        unit: "g",
        role: "acid",
        scaling: "linear",

        removable: true,

        isPrimaryAcid: true,

        onRemove: {
          suggestAcid: {
            label: "litt ekstra sitron",
            when: "ved servering"
          },

          tip:
            "Tomaten er fjernet. Server med ekstra sitron."
        }
      }
    ],

    steps: [
      "Lag kraft.",
      "Lag sofrito.",
      "Tilsett ris.",
      "Kok uten omrøring.",
      "Lag socarrat.",
      "La hvile og server."
    ]
  }
};
