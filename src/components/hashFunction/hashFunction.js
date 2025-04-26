import CryptoJS from 'crypto-js';

export const hashFunction = async (inputString, length = 32) => {
  /*   if (!inputString) return null;
  try {
    const sha256Hash = CryptoJS.SHA256(inputString).toString();
    return sha256Hash.substring(0, 15);
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  } */

  /*   function computeSeed(input) {
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

  return result.slice(0, 15); */

  const MAGIC_NUMBERS = [0x9e3779b1, 0x85ebca6b, 0xc2b2ae35, 0x243f6a88, 0x13198a2e, 0x03707344];

  const encoder = new TextEncoder();
  const data = encoder.encode(String(inputString));

  let state = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a];

  function rotateLeft(value, shift) {
    return (value << shift) | (value >>> (32 - shift));
  }

  for (let i = 0; i < data.length; i++) {
    state[0] ^= data[i] * MAGIC_NUMBERS[i % MAGIC_NUMBERS.length];

    state[0] = rotateLeft(state[0], 5);
    state[1] = rotateLeft(state[1], 13);
    state[2] ^= state[0];
    state[3] += state[1];

    for (let j = 0; j < state.length; j++) {
      state[j] ^= state[(j + 1) % state.length];
      state[j] = rotateLeft(state[j], 7);
    }
  }

  state.forEach((_, index) => {
    state[index] ^= MAGIC_NUMBERS[index];
  });

  const hashArray = state.map((x) => x.toString(16).padStart(8, '0'));

  const fullHash = hashArray.join('');
  return fullHash.slice(0, length);
};
