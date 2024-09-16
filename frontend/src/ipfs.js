import { create } from "ipfs-http-client";

// For local IPFS node
const ipfs = create("http://localhost:5001");

// Upload file function
export const uploadFile = async (fileBuffer) => {
  try {
    // Add file to IPFS
    const added = await ipfs.add(fileBuffer);
    console.log("IPFS file added:", added);

    // Return the CID (Content Identifier)
    return added.cid.toString();
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};
