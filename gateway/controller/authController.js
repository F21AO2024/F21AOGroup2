import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

/*
BUG: password isn't hashed when registering
Postman Incorrect Input:
{
"email":"felix.sej@gmail.com",
"username": "felikx",
"gender": "Male",
"password": "password123",
"firstName": "Felix",
"lastName": "Sej",
"role":"Paramedic",
"phone": "+971501234567"
}
I observe the order matters and hashing is successful when the password is the first key in the object
Postman Correct Input:
{
"email":"felix.sej@gmail.com",
"gender": "Male",
"password": "password123",
"username": "felikx",
"firstName": "Felix",
"lastName": "Sej",
"role":"Paramedic",
"phone": "+971501234567"
}
Explanation:
As a result when the user is added to the DB, the password is not hashed and is stored as plain text
Moreover this causes another bug when logging in as the password is not hashed and the comparison fails
that is why we get "Invalid credentials" when logging in with the correct credentials
*/
export const register = async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const gender = ["male", "female", "others", "prefer not to say"];
  const roles = ["doctor", "nurse", "paramedic", "receptionist", "clerk"];
  try {
    const userExists = await prisma.hospitalEmployee.findFirst({
      where: {
        username: userData.username,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (!roles.includes(userData.role.toLowerCase())) {
      return res.status(400).json({
        message:
          "Please enter either Doctor, Nurse, Paramedic, Receptionist or Clerk as a Role",
      });
    }

    if (userData.gender && !gender.includes(userData.gender.toLowerCase())) {
      return res.status(400).json({
        message:
          "Please enter either male, female, others or prefer not to say",
      });
    }

    const user = await prisma.hospitalEmployee.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res
      .status(201)
      .json({ message: "Employee registered successfully", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req);
    const { username, password } = req.body;

    const user = await prisma.hospitalEmployee.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "You are en employee that does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Your credentials are invalid" });
    }
    //add the role to the token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    //added message for clarity
    res
      .status(200)
      .json({ message: "Employee logged in successfully", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    const user = await prisma.hospitalEmployee.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.hospitalEmployee.update({
      where: {
        username,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//added a controller method to fetch employee by id.
// export const getUserById = async (req, res) => {
//   try {
//     const user = await prisma.hospitalEmployee.findUnique({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ error: "User does not exist" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
