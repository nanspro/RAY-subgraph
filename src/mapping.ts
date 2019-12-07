import { BigInt } from "@graphprotocol/graph-ts"
import {
  PortfolioManager,
  LogMintRAYT,
  // LogMintOpportunityToken,
  // LogWithdrawFromRAYT,
  // LogBurnRAYT,
  LogDepositToRAYT
} from "../generated/PortfolioManager/PortfolioManager"
import { RayMint, RayDeposit } from "../generated/schema"

export function handleLogMintRAYT(event: LogMintRAYT): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = new RayMint(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new RAYToken(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // BigInt and BigDecimal math are supported
  entity.value = event.params.value;

  // Entity fields can be set based on event parameters
  entity.tokenId = event.params.tokenId
  entity.portfolioId = event.params.portfolioId
  entity.owner = event.params.beneficiary.toHexString()

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let portfolioManager = PortfolioManager.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.deprecated(...)
  // - contract._storage(...)
  // - contract.redeem(...)
  // - contract.onERC721Received(...)
}

// export function handleLogMintOpportunityToken(
//   event: LogMintOpportunityToken
// ): void {}

// export function handleLogWithdrawFromRAYT(event: LogWithdrawFromRAYT): void {}

// export function handleLogBurnRAYT(event: LogBurnRAYT): void {}

export function handleLogDepositToRAYT(event: LogDepositToRAYT): void {
  let entity = new RayDeposit(event.transaction.hash.toHex())

  entity.value = event.params.value;

  entity.tokenId = event.params.tokenId
  entity.tokenValue = event.params.tokenValue

  entity.save()
}