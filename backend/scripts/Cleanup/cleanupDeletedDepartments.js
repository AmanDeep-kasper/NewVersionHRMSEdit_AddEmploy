const cleanupDeletedDepartments = async () => {
  const Department = mongoose.model("Department");
  const Employee = mongoose.model("Employee");

  const validDepartments = await Department.find().select("_id").lean();
  const validIds = validDepartments.map((d) => d._id.toString());

  const employees = await Employee.find().select("department");

  for (const emp of employees) {
    const cleaned = emp.department.filter((d) =>
      validIds.includes(d.toString())
    );

    if (cleaned.length !== emp.department.length) {
      emp.department = cleaned;
      await emp.save();
    }
  }

  console.log("✅ Stale department references removed");
};
