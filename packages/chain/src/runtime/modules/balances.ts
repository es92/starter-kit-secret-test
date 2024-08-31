import { runtimeModule, state, runtimeMethod } from "@proto-kit/module";
import { State, assert } from "@proto-kit/protocol";
import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { PublicKey, Poseidon, Field } from "o1js";

interface BalancesConfig {
  totalSupply: Balance;
  secretHash: Field;
}

@runtimeModule()
export class Balances extends BaseBalances<BalancesConfig> {
  @state() public circulatingSupply = State.from<Balance>(Balance);

  @runtimeMethod()
  public async addBalance(
    tokenId: TokenId,
    address: PublicKey,
    amount: Balance,
    secret: Field,
  ): Promise<void> {
    const circulatingSupply = await this.circulatingSupply.get();
    const newCirculatingSupply = Balance.from(circulatingSupply.value).add(
      amount
    );
    assert(
      newCirculatingSupply.lessThanOrEqual(this.config.totalSupply),
      "Circulating supply would be higher than total supply"
    );
    assert(Poseidon.hash([ secret ]).equals(this.config.secretHash), "correct secret not supplied");
    await this.circulatingSupply.set(newCirculatingSupply);
    await this.mint(tokenId, address, amount);
  }
}
