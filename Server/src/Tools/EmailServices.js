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

  switch (type) {
    case "New":
      subject = "Appointment Confirmation";
      userEmailContent = `
        <p>Dear ${user.fullName},</p>
        <p>Your appointment with Dr. ${
          doctor.name
        } has been successfully booked for ${appointmentDate.toLocaleString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      doctorEmailContent = `
        <p>Dear Dr. ${doctor.name},</p>
        <p>An appointment has been scheduled with ${
          user.fullName
        } on ${appointmentDate.toLocaleString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      break;

    case "Update":
      subject = "Appointment Update Notification";
      userEmailContent = `
        <p>Dear ${user.fullName},</p>
        <p>Your appointment with Dr. ${
          doctor.name
        } has been updated. The new appointment time is ${appointmentDate.toLocaleString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      doctorEmailContent = `
        <p>Dear Dr. ${doctor.name},</p>
        <p>The appointment with ${
          user.fullName
        } has been updated. The new appointment time is ${appointmentDate.toLocaleString()}.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      break;

    case "Delete":
      subject = "Appointment Cancellation Notification";
      userEmailContent = `
        <p>Dear ${user.fullName},</p>
        <p>Your appointment with Dr. ${
          doctor.name
        } scheduled for ${appointmentDate.toLocaleString()} has been canceled.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      doctorEmailContent = `
        <p>Dear Dr. ${doctor.name},</p>
        <p>The appointment with ${
          user.fullName
        } scheduled for ${appointmentDate.toLocaleString()} has been canceled.</p>
        <p>Best regards,<br>The Clinic Team</p>
      `;
      break;

    default:
      throw new Error("Invalid email type");
  }

  await appointmentEmails({
    to: user.email,
    subject: subject,
    html: userEmailContent,
  });

  await appointmentEmails({
    to: doctor.email,
    subject: subject,
    html: doctorEmailContent,
  });
};

module.exports = appointmentEmails;
