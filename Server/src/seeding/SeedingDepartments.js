const departmentModel = require("../models/Departments");

async function seedDepartments() {
  const departments = [
    {
      name: "Cardiology",
      image: "cardiology.jpg",
      bio: "Meow Meow Meow Meow",
    },
    {
      name: "Orthopedics",
      image: "orthopedics.jpg",
      bio: "Meow Meow Meow Meow",
    },
    {
      name: "Internal Medicine",
      image: "internal.png",     
      bio: "Meow Meow Meow Meow",
    },
    {
      name: "General Dental Care",
      image: "dental.jpg",
      bio: "Meow Meow Meow Meow",
    },
  ];

  try {
    for (const department of departments) {
      const existingDepartment = await departmentModel.findOne({
        name: department.name,
      });

      if (!existingDepartment) {
        const newDepartment = new departmentModel(department);
        await newDepartment.save();
        console.log(`Department ${department.name} seeded successfully!`);
      } else {
        console.log(
          `Department ${department.name} already exists. Skipping...`
        );
      }
    }
  } catch (error) {
    console.error("Error seeding departments:", error);
  }
}

module.exports = seedDepartments;
