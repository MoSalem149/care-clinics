const departmentModel = require("../../models/Departments");

const GetDepartment = async (req, res) => {
  try {
    const GetDepartments = await departmentModel.find();
    const ImageFullPath = GetDepartments.map((department) => ({
      ...department.toObject(),
      image: `${department.image}`,
    }));

    if (!GetDepartments) {
      res.status(404).json({ message: "Department Not Found" });
    }

    res.status(201).json(ImageFullPath);
  } catch (error) {
    // console.error("Error Featching Departmnet", error);
    res.status(500).json({ message: "Internal Server Errror" });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const image = req.body.ProfileImage || null;

    const newDepartment = new departmentModel({
      name,
      image,
      bio,
    });

    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    // console.error("Error Creating Departments: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, ProfileImage } = req.body;
    const updateData = { name, bio };

    if (ProfileImage) {
      updateData.image = ProfileImage;
    }

    const updatedDepartment = await departmentModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department Not Found" });
    }

    res.json(updatedDepartment);
  } catch (error) {
    // console.error("Error Updating Department", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDepartment = await departmentModel.findByIdAndDelete(id);
    if (!deleteDepartment) {
      res.status(404).json({ message: "Department Not Found" });
    }
    res.status(201).json({ message: "Department Was Deleted Succesfully" });
  } catch (error) {
    // console.error("Error Deleting Departmnet", error);
    res.status(500).json({ message: "Internal Server Errror" });
  }
};

module.exports = {
  GetDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
