import { request, gql } from 'graphql-request';
import from from '@vercel/fetch-retry';

const ENDPOINT = 'https://interop-mainnet.hasura.app/v1/graphql'

const donateableTokensQuery = gql`
  query donatableTokens {
    nft_tokens(where: {
      owner: { _eq: "benipsen.near"},
      nft_contract: { _eq: "run.mintbase1.near" },
      burned_timestamp: { _is_null: true }
    }){
      token_id
      copies
      reference
    }
  }
`;

const fetchMetadata = async (referenceId: string) => 
  fetch(`https://arweave.net/${referenceId}`)
    .then(
      async res => ({ ...(await res.json()), referenceId })
    );

export const fetchDonatableTokens = async () => {
  const response = await request(ENDPOINT, donateableTokensQuery);
  
  // collect JSON from reference, fold references and create array of token ids
  // TODO: differentiate a pledged token id from a non pledge one
  let uniqueReferenceTokens = {};
  for (let token of response.nft_tokens) {
    if (!uniqueReferenceTokens[token.reference]) {
      uniqueReferenceTokens[token.reference] = {
        reference: token.reference,
        token_ids: [token.token_id]
      }
    }
    uniqueReferenceTokens[token.reference].token_ids.push(token.token_id);
  }
  // get metadata from arweave for each unique reference
  const meta = await Promise.all(Object.keys(uniqueReferenceTokens).map(fetchMetadata));
  
  return meta.map((meta) => ({
    ...uniqueReferenceTokens[meta.referenceId],
    ...meta
  }))
}


