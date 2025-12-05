export type CryptoUUID = string;

export const reactKey = (prefix: string = ''): CryptoUUID => {
    return `${prefix}${crypto.randomUUID()}`;
  };
  