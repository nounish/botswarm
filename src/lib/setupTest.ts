import config from "../../botswarm.config";
import crypto from "crypto";
import { createSpinner } from "nanospinner";

const { NounsDAOLogicV2 } = config.contracts;

export default async function setupTest(callback: () => Promise<void>) {
  const spinner = createSpinner(
    `Retrieving latest proposal from ${config.wallets.sepolia.account.address}...`
  ).start();

  const latestProposal = await NounsDAOLogicV2.sepolia.read.latestProposalIds([
    config.wallets.sepolia.account.address,
  ]);

  spinner.update({ text: `Checking state of proposal ${latestProposal}...` });

  const latestProposalState = await NounsDAOLogicV2.sepolia.read.state([
    latestProposal,
  ]);

  if (latestProposalState === 1) {
    spinner.update({ text: `Canceling active proposal ${latestProposal}...` });
    const cancel = await NounsDAOLogicV2.sepolia.write.cancel([latestProposal]);
    await config.clients.sepolia.waitForTransactionReceipt({
      hash: cancel,
    });
  }

  spinner.update({ text: "Creating new proposal..." });
  const proposal = await NounsDAOLogicV2.sepolia.write.propose([
    ["0xE3ff24a97BFB65CAdEF30F6Ad19a6EA7E6F6149d"],
    [BigInt(1)],
    [""],
    ["0x"],
    crypto.randomBytes(20).toString("hex"),
  ]);
  await config.clients.sepolia.waitForTransactionReceipt({
    hash: proposal,
  });

  spinner.success({
    text: "New proposal sucessfully created, starting...\n",
  });

  callback();
}
