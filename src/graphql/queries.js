/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEntry = /* GraphQL */ `
  query GetEntry($id: ID!) {
    getEntry(id: $id) {
      id
      productId
      productSource
      productCategory
      productUrl
      lastFetchedDate
      createdAt
      updatedAt
    }
  }
`;
export const listEntries = /* GraphQL */ `
  query ListEntries(
    $filter: ModelEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productId
        productSource
        productCategory
        productUrl
        lastFetchedDate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
