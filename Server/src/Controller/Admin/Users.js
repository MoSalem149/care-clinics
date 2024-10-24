const { Model } = require("mongoose");
const userModel = require("../../models/userModel");

const GetAllUsers = async (req, res) => {
  try {
    const Users = await userModel.find();
    res.status(201).json(Users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = GetAllUsers;
