import CryptoJS from 'crypto-js';

export const hashFunction = async (inputString) => {
  if (!inputString) return null;
  try {
    const sha256Hash = CryptoJS.SHA256(inputString).toString();
    // Return first 15 characters
    return sha256Hash.substring(0, 15);
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
};
