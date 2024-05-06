const KDA_FIXED_PREFIX = "k:";
const KDA_FIXED_LENGTH = 66;
const KDA_VARIABLE_PREFIXES = ["u:", "w:", "t:", "c:"];

export const validateKadenaAddress = (address) => {
  if (address.startsWith(KDA_FIXED_PREFIX)) {
    return address.length === KDA_FIXED_LENGTH;
  }

  return KDA_VARIABLE_PREFIXES.some((prefix) => address.startsWith(prefix));
};


