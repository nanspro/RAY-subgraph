import { BigInt, Address, log } from "@graphprotocol/graph-ts"
import {
  PortfolioManager,
  LogMintRAYT,
  LogMintOpportunityToken,
  LogWithdrawFromRAYT,
  LogDepositToRAYT,
  LogBurnRAYT
} from "../generated/Contract/PortfolioManager"
import { NAVCalculator } from "../generated/Contract/NAVCalculator"
import { RayMint, RayDeposit, RayWithdraw, OpportunityMint, RayBurn } from "../generated/schema"

export function handleLogMintRAYT(event: LogMintRAYT): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let navContract = NAVCalculator.bind(Address.fromString("0xD23fA5F1a001eCDed63b45Da426972fB2AAD2760"))
  let entity = new RayMint(event.transaction.hash.toHex())

  // let naValue = navContract.getPortfolioPricePerShare(event.params.portfolioId)
  // log.debug("Portfolio Price per share is {}", [naValue.toHexString()])


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
  entity.rayTokenId = event.params.tokenId
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

export function handleLogDepositToRAYT(event: LogDepositToRAYT): void {
  let entity = new RayDeposit(event.transaction.hash.toHex())

  entity.value = event.params.value;

  entity.rayTokenId = event.params.tokenId
  entity.previousValue = event.params.tokenValue

  entity.save()
}

export function handleLogWithdrawFromRAYT(event: LogWithdrawFromRAYT): void {
  let entity = new RayWithdraw(event.transaction.hash.toHex())

  entity.totalValue = event.params.tokenValue;

  entity.rayTokenId = event.params.tokenId
  entity.valueAfterFee = event.params.value

  entity.save()
}

export function handleLogBurnRAYT(
  event: LogBurnRAYT
): void {
  let entity = new RayBurn(event.transaction.hash.toHex())

  entity.rayTokenId = event.params.tokenId;

  entity.value = event.params.value;
  entity.worth = event.params.tokenValue;

  entity.owner = event.params.beneficiary.toHexString()
  entity.save()
}

export function handleLogMintOpportunityToken(
  event: LogMintOpportunityToken
): void {
  // let navContract = NAVCalculator.bind(Address.fromString("0xD23fA5F1a001eCDed63b45Da426972fB2AAD2760"))
  let entity = new OpportunityMint(event.transaction.hash.toHex())

  // let valueOpportunity = navContract.getOpportunityBalance(event.params.portfolioId, event.params.tokenId)
  entity.opportunityTokenId = event.params.tokenId
  // log.debug("Opportunity Balance is {}", [valueOpportunity.toHexString()])
  entity.portfolioId = event.params.portfolioId
  entity.save()
}
