import { SecurePassword } from "@blitzjs/auth"
import db from "./index"
import { ratingJson } from "./ratingJson"

const { PORT = "3000" } = process.env

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  const [oilFilters, indexer] = await Promise.all([
    db.item.create({
      data: {
        name: "Oil Filters",
        content: "",
        url: "Oil-Filters",
        type: "COMPARISON",
        children: {
          create: [
            {
              position: 0,
              item: {
                create: {
                  name: "name brand",
                  content: "",
                  url: "name-brand",
                  properties: {
                    create: [
                      {
                        datum: {
                          create: { name: "Price", text: "5.99" },
                        },
                      },
                      {
                        datum: {
                          create: { name: "Rating", text: "4.2" },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              position: 1,
              item: {
                create: {
                  name: "value oil",
                  content: "",
                  url: "value-oil",
                  properties: {
                    create: [
                      {
                        datum: {
                          create: { name: "Price", text: "3.98" },
                        },
                      },
                      {
                        datum: {
                          create: { name: "Rating", text: "3.8" },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        comparisonColumns: {
          create: [{ name: "Price" }, { name: "Rating" }],
        },
      },
    }),
    db.indexer.create({
      data: {
        name: "Page Heading",
        hostname: "localhost",
        selectors: [{ selector: "h1" }],
      },
    }),
  ])

  await Promise.all([
    db.item
      .create({
        data: {
          name: "Change Oil in a Prius",
          content: "",
          contentState: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    text: "All the steps and supplies needed to change the oil in a ",
                    type: "text",
                  },
                  {
                    text: "Prius",
                    type: "text",
                    marks: [
                      {
                        type: "strong",
                      },
                    ],
                  },
                  {
                    text: ". This is for a second generation Prius 2005-2010.",
                    type: "text",
                  },
                ],
              },
            ],
          },
          url: "Change-Oil-in-a-Prius",
          standalone: true,
          properties: {
            create: [
              {
                featured: true,
                datum: {
                  create: {
                    dynamic: true,
                    text: "sum(p('Oil Price'), p('Filter Price'))",
                    name: "Total Price",
                  },
                },
                position: 0,
              },
              {
                featured: true,
                position: 1,
                datum: {
                  create: {
                    text: "",
                    name: "title of page",
                    url: `http://localhost:${PORT}/${hedgeItem.data.url}`,
                    indexer: {
                      connect: { id: indexer.id },
                    },
                  },
                },
              },
              {
                featured: true,
                position: 2,
                datum: {
                  create: {
                    text: "sum(g('Time'))",
                    name: "Total time",
                    dynamic: true,
                    postfix: " minutes",
                  },
                },
              },
              {
                featured: true,
                position: 3,
                datum: {
                  create: {
                    name: "rating",
                    text: "",
                    url: `http://localhost:${PORT}/embed`,
                    indexer: {
                      create: {
                        name: "Rating",
                        hostname: "localhost",
                        selectors: [
                          { selector: "script[type='application/ld+json']" },
                        ],
                        nextIndexer: {
                          create: ratingJson,
                        },
                      },
                    },
                  },
                },
              },
              {
                featured: false,
                position: 0,
                datum: {
                  create: {
                    text: "min(g('Oil Prices'))",
                    name: "Oil Price",
                    dynamic: true,
                    prefix: "$",
                  },
                },
              },
              {
                featured: false,
                position: 1,
                datum: {
                  create: {
                    text: `low("Price", co(${oilFilters.id}))`,
                    name: "Filter Price",
                    dynamic: true,
                  },
                },
              },
              {
                featured: false,
                position: 2,
                datum: {
                  create: {
                    text: "10",
                    name: "Big-box store Oil Price",
                    group: "Oil Prices",
                    url: "https://big-box.com/5w-30-motor-oil",
                  },
                },
              },
              {
                featured: false,
                position: 3,
                datum: {
                  create: {
                    text: "14",
                    name: "Autozone Oil Price",
                    group: "Oil Prices",
                  },
                },
              },
              {
                featured: false,
                position: 4,
                datum: {
                  create: { text: "5", name: "Chock Wheels", group: "Time" },
                },
              },
              {
                featured: false,
                position: 5,
                datum: {
                  create: { text: "10", name: "Jack Up", group: "Time" },
                },
              },
              {
                featured: false,
                position: 6,
                datum: {
                  create: { text: "10", name: "Change oil", group: "Time" },
                },
              },
              {
                featured: false,
                position: 6,
                datum: { create: { text: "NaN", name: "Outdated thing" } },
              },
              {
                datum: {
                  create: {
                    text: `sumOf('Price', co(${gatherToolsId}))`,
                    name: "Total cost of tools",
                    dynamic: true,
                  },
                },
              },
              {
                datum: {
                  create: {
                    text: `low('Price', co(${gatherToolsId}))`,
                    name: "Cheapest Tool",
                    dynamic: true,
                  },
                },
              },
              {
                datum: {
                  create: {
                    text: `high('Price', co(${gatherToolsId}))`,
                    name: "Most expensive Tool",
                    dynamic: true,
                  },
                },
              },
            ],
          },
          children: {
            create: [
              {
                position: 0,
                item: {
                  create: {
                    name: "Chock Wheels",
                    content: "",
                    url: "Chock-Wheels",
                  },
                },
              },
              {
                position: 1,
                item: {
                  create: {
                    id: gatherToolsId,
                    name: "Gather Tools",
                    content: "",
                    url: "Gather-Tools",
                    type: "COMPARISON",
                    comparisonColumns: { create: { name: "Price" } },
                    children: {
                      create: [
                        {
                          position: 1,
                          item: {
                            create: {
                              name: "14mm Wrench",
                              content: "",
                              url: "14mm-wrench",
                              properties: {
                                create: [
                                  {
                                    datum: {
                                      create: {
                                        name: "Price",
                                        text: "min(g('Price'))",
                                        dynamic: true,
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Kmart Price",
                                        text: "12.00",
                                        group: "Price",
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Discount Retailer Price",
                                        text: "6.00",
                                        url: "https://retail.com/wrenchs",
                                        group: "Price",
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                        {
                          position: 2,
                          item: {
                            create: {
                              name: "Jack",
                              content: "",
                              url: "jack",
                              properties: {
                                create: [
                                  {
                                    datum: {
                                      create: {
                                        name: "Price",
                                        text: "32.99",
                                        url: "https://retailer.com/Jack",
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                position: 2,
                item: {
                  connect: { id: oilFilters.id },
                },
              },
              {
                position: 3,
                item: {
                  create: {
                    name: "test cascade",
                    type: "LIST",
                    content: "",
                    url: "test-cascade",
                    standalone: true,
                  },
                },
              },
              {
                position: 4,
                item: {
                  create: {
                    name: "a non standalone step",
                    type: "PAGE",
                    content: "",
                    url: "a-non-standalone-step",
                    standalone: false,
                  },
                },
              },
              {
                position: 5,
                item: {
                  create: {
                    name: "Wheel Chocks",
                    content: "",
                    url: "Wheel-Chocks",
                    type: "COMPARISON",
                    comparisonColumns: {
                      create: [{ name: "Price" }, { name: "Price Per" }],
                    },
                    children: {
                      create: [
                        {
                          position: 1,
                          item: {
                            create: {
                              name: "Plastic chock",
                              content: "",
                              url: "Plastic-chock",
                              properties: {
                                create: [
                                  {
                                    datum: {
                                      create: {
                                        name: "Price",
                                        text: "min(g('Price'))",
                                        dynamic: true,
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Quantity",
                                        text: "2",
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Discount Retailer Price",
                                        text: "6.00",
                                        url: "https://retail.com/plastic-wheel-chocks",
                                        group: "Price",
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Price Per",
                                        dynamic: true,
                                        text: "divide(p('Price'), p('Quantity'))",
                                        digitsAfterDecimal: 2,
                                        prefix: "$",
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                        {
                          position: 2,
                          item: {
                            create: {
                              name: "Rubber chock",
                              content: "",
                              url: "rubber-chock",
                              properties: {
                                create: [
                                  {
                                    datum: {
                                      create: {
                                        name: "Price",
                                        text: "32.99",
                                        url: "https://retailer.com/rubber-chock",
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Quantity",
                                        text: "1",
                                        url: "https://retailer.com/rubber-chock",
                                      },
                                    },
                                  },
                                  {
                                    datum: {
                                      create: {
                                        name: "Price Per",
                                        dynamic: true,
                                        text: "divide(p('Price'), p('Quantity'))",
                                        digitsAfterDecimal: 2,
                                        prefix: "$",
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      })
      .then(async (item) => {
        await db.redirect.create({ data: { itemId: item.id, from: "oldUrl" } })

        return db.setting.create({
          data: { key: "featuredPages", value: [item.id] },
        })
      }),
    db.item.create({
      data: {
        name: "Jack up Prius",
        url: "jack-up-prius",
        content: "",
        standalone: true,
      },
    }),
    db.item.create(hedgeItem),
    db.item.create({
      data: {
        name: "Info to be indexed",
        url: "info-to-be-indexed",
        content: "",
        standalone: true,
      },
    }),
    db.user.create({
      data: {
        email: "jay@test.co",
        hashedPassword: await SecurePassword.hash("letsTest10"),
        role: "user",
      },
    }),
    db.propertyTemplate.create({
      data: {
        name: "test",
        hostnames: ["localhost"],
        properties: {
          create: {
            datum: {
              create: {
                name: "property from template",
                indexer: { connect: { id: indexer.id } },
              },
            },
          },
        },
      },
    }),
  ])
}

const hedgeItem = {
  data: {
    name: "How to Trim Hedges",
    url: "how-to-trim-hedges",
    content: "",
    standalone: true,
  },
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    db.$disconnect().catch(console.error)
  })

const gatherToolsId = 2000

export default seed
