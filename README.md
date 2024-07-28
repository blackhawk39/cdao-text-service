npm install

npx  hardhat compile

## deploy native token -->
npx hardhat run scripts/deploy-token.js

## copy the token contract address and paste in the scripts/deploy-ask.js or use 
Token address 0xAf790fABCf6253D1D621D1bdF04C94060Dc01B2E


## deploy  askAround contract -->
npx hardhat run scripts/deploy-ask.js

or use
0x87752c7d9679B5c3D677c1a72A4A11F9C17aA22C


## mint tokens to the askAround smart contract

## move to frontend folder and run it

## corescan -->
https://scan.test.btcs.network/


#Add Tag value 
0.01 core
10^16 WEI
10 Finney 


Deploying contracts with the account: 0xE41119E28cd9dd227Cf664bDe0d608e776d78e59



## Features of AskAround
Basically a QnA platform for authentic users.
1. Join a Tag by staking some coins (0.01 $), which will be refunded back when you remove a tag. being associated with the Tag for long time earns you loyalty points( more rewards)
2. Ask and Answer Questions for a specific tag to earn SocialToken and it also increases your popularity.
3. look for the most active Tags for more engagement.


## Future scope:
1.(Voting) When userload increase, we will add voting to control behaviour. older users with more time in tag will get to vote. 
  (malicious user behaviour, increasing (refundable)Tag entry fee)
2.(NFTs) Users can showcase trophies bought using the SocialToken , which will be NFTs.
3.(AskExpert) This will be a premium service, one-to-one or one-to-many (selected users) which will have predecided cost based on the popularity of a user(Expert). (Highly active people gets discount)
4. Providing best answers in high userCount Tags will yield higher rewards.
5. (SubTags) addition of subtags. 
eg. (HIKING > India > himachal)
 eg. (HIKING > Nepal > Everest)
 eg. (DSA > Dynamic Programming)
 Proper integration of these subTags
