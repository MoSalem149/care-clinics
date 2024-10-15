const appointmentConfirmation = require("./SendEmailToDoctors"); 

const appointmentEmails = async (
  user,
  doctor,
  appointmentDate,
  type = "New"
) => {
  let subject;
  let userEmailContent;
  let doctorEmailContent;

  if (!user || !doctor) {
    throw new Error("User or doctor information is missing.");
  }

  if (!(appointmentDate instanceof Date)) {
    throw new Error("Invalid appointment date.");
  }

  switch (type) {
    case "New":
      subject = "Appointment Confirmation";
      userEmailContent = `
        <p>Dear ${user.fullName},</p>
        <p>Your appointment with Dr. ${doctor.fullName} has been successfully booked for ${appointmentDate.toISOString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      doctorEmailContent = `
        <p>Dear Dr. ${doctor.name},</p>
        <p>An appointment has been scheduled with ${user.fullName} on ${appointmentDate.toISOString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      break;

    case "Update":
      subject = "Appointment Update Notification";
      userEmailContent = `
        <p>Dear ${user.fullName},</p>
        <p>Your appointment with Dr. ${doctor.name} has been updated. The new appointment time is ${appointmentDate.toISOString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      doctorEmailContent = `
        <p>Dear Dr. ${doctor.name},</p>
        <p>The appointment with ${user.fullName} has been updated. The new appointment time is ${appointmentDate.toISOString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      break;

    case "Delete":
      subject = "Appointment Cancellation Notification";
      userEmailContent = `
        <p>Dear ${user.fullName},</p>
        <p>Your appointment with Dr. ${doctor.name} scheduled for ${appointmentDate.toISOString()} has been canceled.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      doctorEmailContent = `
        <p>Dear Dr. ${doctor.name},</p>
        <p>The appointment with ${user.fullName} scheduled for ${appointmentDate.toISOString()} has been canceled.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      break;

    default:
      throw new Error("Invalid email type");
  }

  await appointmentConfirmation({
    to: user.email,
    subject: subject,
    html: userEmailContent,
  });

  await appointmentConfirmation({
    to: doctor.email,
    subject: subject,
    html: doctorEmailContent,
  });
};

module.exports = appointmentEmails;
