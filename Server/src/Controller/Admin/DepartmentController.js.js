const departmentModel = require("../../models/Departments");

const GetDepartment = async (req, res) => {
  try {
    const GetDepartments = await departmentModel.find();
    const ImageFullPath = GetDepartments.map((department) => ({
      ...department.toObject(),
      image: `/Images/${department.image}`,
    }));

    if (!GetDepartments) {
      res.status(404).json({ message: "Department Not Found" });
    }

    res.status(201).json(ImageFullPath);
  } catch (error) {
    console.error("Error Featching Departmnet", error);
    res.status(500).json({ message: "Internal Server Errror" });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const image = req.file ? req.file.filename : null;

    const newDepartment = new departmentModel({
      name,
      image,
      bio,
    });

    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error("Error Creating Departments: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    const updateData = { name, bio };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const updateDepartment = await departmentModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateDepartment) {
      res.status(404).json({ message: "Department Not Found" });
    }
    res.json(updateDepartment);
  } catch (error) {
    console.error("Errror Updating Deepartment", error);
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
    console.error("Error Deleting Departmnet", error);
    res.status(500).json({ message: "Internal Server Errror" });
  }
};

module.exports = {
  GetDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
