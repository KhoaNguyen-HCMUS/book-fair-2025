import CryptoJS from 'crypto-js';

export const hashFunction = async (inputString) => {
  /*   if (!inputString) return null;
  try {
    const sha256Hash = CryptoJS.SHA256(inputString).toString();
    return sha256Hash.substring(0, 15);
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  } */

  function computeSeed(input) {
    let seed = 0;
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      seed = (seed << 5) - seed + charCode;
      seed ^= charCode * 16777619;
      seed = Math.abs(seed);
    }
    return seed * 2654435761;
  }

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const chars = '123456789abcdefghijklmnopqrstuvwxyz'; // 35 ký tự
  let result = '';
  const seed = computeSeed(inputString);

  for (let i = 0; i < 15; i++) {
    let val = seed * primes[i];
    val ^= val >> i % 16;
    val = Math.abs(val);
    result += chars[val % 35];
  }

  return result.slice(0, 15);
};
