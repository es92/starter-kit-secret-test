import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";

import { Balances } from "./modules/balances";

import { Poseidon, Field } from "o1js";

export const modules = VanillaRuntimeModules.with({
  Balances,
});

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
    secretHash: Poseidon.hash([ Field(43) ]),
  },
};

export default {
  modules,
  config,
};
