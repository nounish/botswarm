import { contracts, clients, wallets } from "../../botswarm.config";
import crypto from "crypto";
import { createSpinner } from "nanospinner";

const { NounsDAOLogicV2 } = contracts.sepolia;

export default async function setupTest(callback: () => Promise<void>) {
  const spinner = createSpinner(
    `Retrieving latest proposal from ${wallets.sepolia.account.address}...`
  ).start();

  const latestProposal = await NounsDAOLogicV2.read.latestProposalIds([
    wallets.sepolia.account.address,
  ]);

  spinner.update({ text: `Checking state of proposal ${latestProposal}...` });

  const latestProposalState = await NounsDAOLogicV2.read.state([
    latestProposal,
  ]);

  if (latestProposalState === 1) {
    spinner.update({ text: `Canceling active proposal ${latestProposal}...` });
    const cancel = await NounsDAOLogicV2.write.cancel([latestProposal]);
    await clients.sepolia.waitForTransactionReceipt({
      hash: cancel,
    });
  }

  spinner.update({ text: "Creating new proposal..." });
  const proposal = await NounsDAOLogicV2.write.propose([
    ["0xE3ff24a97BFB65CAdEF30F6Ad19a6EA7E6F6149d"],
    [BigInt(1)],
    [""],
    ["0x"],
    crypto.randomBytes(20).toString("hex"),
  ]);
  await clients.sepolia.waitForTransactionReceipt({
    hash: proposal,
  });

  spinner.success({
    text: "New proposal sucessfully created",
  });

  callback();
}
