import { create } from "ipfs-http-client";

const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

export async function uploadToIPFS(file) {
  const added = await ipfs.add(file);
  return added.cid.toString();
}
