export const hashFunction = async (inputString) => {
  try {
    // Create UTF-8 encoded array from input string
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

    // Return first 15 characters
    return hashHex.substring(0, 15);
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
};
