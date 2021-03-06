const isDepositEnough = require('./deposit').isDepositEnough

module.exports = async (cmd, api, claim) => {
  const hasEnough = await isDepositEnough(api, claim.claimant)
  if (!hasEnough) {
    throw new Error(`
      Your deposited ETH in ClaimManager is lower than minDeposit.`
    )
  }

  try {
    cmd.log(`Creating claim with proposalId ${claim.proposalID}`)
    await api.createClaim(
      claim.input,
      claim.hash,
      claim.proposalID,
      { from: claim.claimant }
    )
  } catch (error) {
    throw new Error(`Could not createClaim ${claim.proposalID} from ${claim.claimant}
      ${error.stack}
    `)
  }

  // update values in the db
  claim.claimID = (await api.claimManager.calcId.call(claim.input, claim.hash, claim.claimant, claim.proposalID)).toString()
  claim.createdAt = (await api.claimManager.createdAt.call(claim.claimID)).toNumber()
  await claim.save()
}
