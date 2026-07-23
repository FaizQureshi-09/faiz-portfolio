import { motion } from 'framer-motion';
import { FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { useContactForm } from '../../../hooks/useContactForm';
import { ContactFormField } from './ContactFormField';

/**
 * Contact form UI: name, email, contact number and message fields with
 * client-side validation and a submit button that shows a loading and
 * success state. Submission itself is a placeholder — see
 * `useContactForm`'s `submitContactForm` for where to wire up a backend.
 */
export function ContactForm() {
  const { values, errors, submissionStatus, submitError, handleFieldChange, handleSubmit } =
    useContactForm();

  if (submissionStatus === 'success') {
    return (
      <motion.div
        className="contact-form__success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheckCircle aria-hidden="true" className="contact-form__success-icon" />
        <h3>Message ready to send!</h3>
        <p>Thanks for reaching out — I&apos;ll get back to you soon.</p>
      </motion.div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <ContactFormField
          id="contact-name"
          name="name"
          label="Name"
          value={values.name}
          onChange={handleFieldChange}
          error={errors.name}
          required
        />
        <ContactFormField
          id="contact-email"
          name="email"
          type="email"
          label="Email"
          value={values.email}
          onChange={handleFieldChange}
          error={errors.email}
          required
        />
      </div>

      <ContactFormField
        id="contact-phone"
        name="phone"
        type="tel"
        label="Contact Number (optional)"
        value={values.phone}
        onChange={handleFieldChange}
        error={errors.phone}
      />

      <ContactFormField
        id="contact-message"
        name="message"
        as="textarea"
        label="Message"
        value={values.message}
        onChange={handleFieldChange}
        error={errors.message}
        required
      />

      {submissionStatus === 'error' ? (
        <p className="contact-form__error-banner" role="alert">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="contact-form__submit" disabled={submissionStatus === 'submitting'}>
        {submissionStatus === 'submitting' ? (
          'Sending...'
        ) : (
          <>
            Send Message <FaPaperPlane aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
