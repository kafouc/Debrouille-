import { expect, test } from "vitest";
import { formatAge, formatMoney } from "./format";

test("formatMoney suit l'écriture française", () => {
  expect(formatMoney(340)).toBe("340 €");
  expect(formatMoney(18750)).toBe("18 750 €");
  expect(formatMoney(-1234)).toBe("−1 234 €");
  expect(formatMoney(1_200_000)).toBe("1,2 M€");
  expect(formatMoney(1_000_000)).toBe("1 M€");
  expect(formatMoney(-2_500_000)).toBe("−2,5 M€");
  expect(formatMoney(0)).toBe("0 €");
});

test("formatAge", () => {
  expect(formatAge(23)).toBe("23 ans");
});
