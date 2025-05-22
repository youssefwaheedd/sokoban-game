import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
