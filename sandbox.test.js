// const { sum, substract } = require("./sandbox");

// test("ini test operators", () => {
//   expect(sum(1, 3)).toBe(4);
//   expect(sum(5, 3)).toBe(8);
//   expect(substract(5, 10)).toBe(-5);
// });

// test("object assignment", () => {
//   const data = { one: 1 };
//   data["two"] = 2;
//   expect(data).toEqual({ one: 1, two: 2 });
// });

test("array equality", () => {
  const fruits = ["apple", "banana"];
  fruits.push("orange");

  expect(fruits).toEqual(["apple", "banana", "orange"]);
});

test("nested object equality", () => {
  const user = {
    name: "Budi",
    address: {
      city: "Bandung",
      zip: 40123,
    },
  };

  expect(user).toEqual({
    name: "Budi",
    address: {
      city: "Bandung",
      zip: 40123,
    },
  });
});

test("object inside array", () => {
  const users = [
    { id: 1, name: "Andi" },
    { id: 2, name: "Siti" },
  ];

  expect(users).toEqual([
    { id: 1, name: "Andi" },
    { id: 2, name: "Siti" },
  ]);
});

test("calculation result", () => {
  const result = {
    total: 10000,
    tax: 1000,
    final: 11000,
  };

  expect(result).toEqual({
    total: 10000,
    tax: 1000,
    final: 11000,
  });
});

test("adding positive numbers is not zero", () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});

const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "milk",
];

test("the shopping list has milk on it", () => {
  expect(shoppingList).toContain("milk");
  expect(new Set(shoppingList)).toContain("milk");
});
class Person {
  constructor(name) {
    this.name = name;
  }
}

function compileAndroidCode() {
  throw new Error("you are using the wrong JDK!");
}

test("compiling android goes as expected", () => {
  expect(() => compileAndroidCode()).toThrow(Error);
});
