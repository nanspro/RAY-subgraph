# RAY-subgraph
Robo-Advisor for Yield (RAY) is a decentralized investment tool that re-balances funds to the highest yielding opportunities.

Users deposit funds into the RAY smart contract, customize which Opportunities should be considered, and an off-chain oracle monitors rates on eligible protocols. RAY automatically moves funds to the highest-yielding at option at any time. Users receive an ERC-721 token representing the value of positions they own.

This subgraph tracks all opportunities, users and RAY tokens and all the activities of users such as minting, depositing, withdrawing. and burning to Ray Contract.
Subgraph is deployed here https://thegraph.com/explorer/subgraph/nanspro/ray, you can run queries there and also use the apis in your dapp. There is one demo dapp which can be found here: http://nanspro.github.io/

## Installation
```
yarn install
yarn codegen
yarn deploy
```

## Example Queries

The subgraph can be queried using graphQL queries and the endpoint for that is https://api.thegraph.com/subgraphs/name/nanspro/ray, you can read more about ray protocol's working and their smart contract functionality here https://staked.gitbook.io/staked/ray/smart-contract-integration

The following entities are present in this subgraph, below are few example queries that can be made on them

**User**

You can query our subgraph to obtain list of all users who have postions on ray protocol.
``` graphql
{
users {
    id
    address
    portfolioId
    tokenValue
  }
}
```

- `id`: Ray Token id of that user
- `address`: Ethereum address of the owner of ray token with id
- `portfolioId`: The corresponding id for the basket of opportunities to associate with this RAY token
- `tokenValue`: The value of this RAY token
- `tokenAddr`: Address of token which is deposited by user
- `isERC20`: Whether user has deposited a ERC20 token or not(deposited ETH)

**RayToken**

You can query our subgraph to obtain list of all ray tokens present on ray protocol.

``` graphql
{
rayTokens {
    id
    owner {
      id
      # can specify any or all user's attributes shown above
    }
  }
}
```

- `id`: Ray Token id
- `owner`: User entity which tells us about the user who owns this ray token

**Opportunity**

You can query our subgraph to obtain list of all opportunities created on ray protocol.

``` graphql
{
opportunities{
    id
    opportunityTokenId
    portfolioId
  }
}
```

- `id`: Unique identifier
- `portfolioId`: The corresponding id for the basket of opportunities associated with this RAY token
- `opportunityTokenId`: It is generated when portfolio lends to a opportunityId

### Queries for fetching information from events caused by user

**Mint**

When user mints a new ray token by creating a postion on ray smart contract.
``` graphql
{
rayMints{
    id
    value
    rayTokenId
    owner
    portfolioId
  }
}
```

- `id`: Unique identifier
- `value`: The amount in the smallest units of the asset that were credited to the minted RAY tokenThe amount in the smallest units of the asset that were credited to the minted RAY token
- `rayTokenId`: The token id of newly generated ERC721 ray token
- `owner`: User who crated this mint(owner of this new minted ray token)

**Deposit**

Users can add additional value to an existing RAY token through the deposit function.

``` graphql
{
rayDeposits{
    id
    value
    rayTokenId
    previousValue
  }
}
```

- `id`: Unique identifier
- `value`: The amount in the smallest units of the asset that were credited to the minted RAY token
- `rayTokenId`: The id of the RAY token the deposit was for
- `previousValue`: The token value before the deposit

**Withdraw**

Withdrawing allows a user to partially or fully withdraw the underlying value from their RAY token.
``` graphql
{
rayWithdraws{
    id
    valueAfterFee
    rayTokenId
    totalValue
  }
}
```

- `id`: Unique identifier
- `valueAfterFee`: The amount in the smallest units of the asset that was withdrawn from the RAY token
- `rayTokenId`: The id of the RAY token the withdrawal was for
- `totalValue`: The token value before the withdraw

**Burn**

Burning allows a user to trade in their full RAY token for all the underlying value.

``` graphql
{
rayBurns{
    id
    value
    rayTokenId
    owner
    worth
  }
}
```

- `id`: Unique identifier
- `value`: The amount transferred to owner after fees
- `rayTokenId`: The id of the RAY token which was burned
- `worth`: The worth of the ray token which was burned
