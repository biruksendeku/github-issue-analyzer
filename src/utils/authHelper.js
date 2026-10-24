import bcrypt from "bcryptjs";
const { SALT } = process.env;

const hashPassword = async (raw) => {
  return await bcrypt.hash(raw, parseInt(SALT));
};
const comparePassword = async (raw, hashed) => {
  return await bcrypt.compare(raw, hashed);
};

export { hashPassword, comparePassword };
