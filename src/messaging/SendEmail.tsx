import { useState } from "react";
import emailjs from "emailjs-com";
import GenericModal from "../components/modals/GenericModal";

const sendEmail = (
  e: React.FormEvent<HTMLFormElement>,
  onSuccess: () => void
) => {
  e.preventDefault();

  const serviceId = import.meta.env.VITE_EMAIL_JS_SERVICE_ID!;
  const publicKey = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY!;

  console.log("Service ID:", serviceId);
  console.log("Public Key:", publicKey);

  emailjs
    .sendForm(serviceId, "template_d36d2o9", e.currentTarget, publicKey)
    .then((res) => {
      console.log("Email sent!", res);
      onSuccess();
    })
    .catch((err) => console.error("Error sending email:", err));
};

const EmailForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <form
        onSubmit={(e) => {
          sendEmail(e, () => setIsModalOpen(true));
          e.preventDefault();
        }}
      >
        <input type="text" name="candidate" placeholder="Candidate Name" required />
        <input type="text" name="company" placeholder="Company Name" required />
        <input type="text" name="candidatePosition" placeholder="Position" required />
        <input type="text" name="passcode" placeholder="Passcode" required />
        <input type="text" name="time" placeholder="OTP Expiry Time" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Send Email</button>
      </form>

      {/* MODAL COMPONENT */}
      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Email Sent Successfully"
        content="Your email has been sent to the candidate!"
      />
    </>
  );
};

export default EmailForm;
