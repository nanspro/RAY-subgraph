import { BigInt, Address, log } from "@graphprotocol/graph-ts"
import {
  PortfolioManager,
  LogMintRAYT,
  LogMintOpportunityToken,
  LogWithdrawFromRAYT,
  LogDepositToRAYT,
  LogBurnRAYT,
} from "../generated/Contract/PortfolioManager"
import { NAVCalculator } from "../generated/Contract/NAVCalculator"
import { Storage } from "../generated/Contract/Storage"
import { User, RayToken, RayMint, RayDeposit, RayWithdraw, Opportunity, RayBurn } from "../generated/schema"

export function handleLogMintRAYT(event: LogMintRAYT): void {
  // let navContract = NAVCalculator.bind(Address.fromString("0xD23fA5F1a001eCDed63b45Da426972fB2AAD2760"))
  let entity = new RayMint(event.transaction.hash.toHex())
  let entityRay = new RayToken(event.params.tokenId.toHex())
  let entityUser = new User(event.params.tokenId.toHex())

  // let naValue = navContract.getPortfolioPricePerShare(event.params.portfolioId)
  // log.debug("Portfolio Price per share is {}", [naValue.toHexString()])


  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new RAYToken(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // Entity fields can be set based on event parameters
  entity.value = event.params.value;
  entity.rayTokenId = event.params.tokenId
  entity.portfolioId = event.params.portfolioId
  entity.owner = event.params.beneficiary.toHexString()

  entityRay.owner = entityUser.id

  entityUser.address = event.params.beneficiary.toHexString()
  entityUser.portfolioId = event.params.portfolioId
  entityUser.assetValue = event.params.value;

  // Entities can be written to the store with `.save()`
  entity.save()
  entityRay.save()
  entityUser.save()

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
  let entityUser = User.load(event.params.tokenId.toHex())
  let storage = Storage.bind(Address.fromString("0x446711E5ED3013743e40342A0462FBdc437cd43F"))


  if (entityUser == null) {
    log.debug("Cannot be loadeddddd {}", [event.params.tokenId.toHex()])
    entityUser = new User(event.params.tokenId.toHex())
    entityUser.address = event.transaction.from.toHex()
    let portfolioId = storage.getTokenKey(event.params.tokenId)
    entityUser.portfolioId = portfolioId
    
  }
  entity.value = event.params.value;

  entity.rayTokenId = event.params.tokenId
  entity.previousValue = event.params.tokenValue

  entityUser.assetValue = event.params.tokenValue.plus(event.params.value)
  entity.save()
  entityUser.save()
}

export function handleLogWithdrawFromRAYT(event: LogWithdrawFromRAYT): void {
  let entity = new RayWithdraw(event.transaction.hash.toHex())
  let entityUser = User.load(event.params.tokenId.toHex())
  let storage = Storage.bind(Address.fromString("0x446711E5ED3013743e40342A0462FBdc437cd43F"))

  if (entityUser == null) {
    entityUser = new User(event.params.tokenId.toHex())
    entityUser.address = event.transaction.from.toHex()
    let portfolioId = storage.getTokenKey(event.params.tokenId)
    entityUser.portfolioId = portfolioId
  }
  
  entity.totalValue = event.params.tokenValue;

  entity.rayTokenId = event.params.tokenId
  entity.valueAfterFee = event.params.value

  entityUser.assetValue = event.params.tokenValue.minus(event.params.value)

  entity.save()
  // entityUser.save()
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
  let entity = new Opportunity(event.transaction.hash.toHex())

  // let valueOpportunity = navContract.getOpportunityBalance(event.params.portfolioId, event.params.tokenId)
  entity.opportunityTokenId = event.params.tokenId
  // log.debug("Opportunity Balance is {}", [valueOpportunity.toHexString()])
  entity.portfolioId = event.params.portfolioId
  entity.save()
}
