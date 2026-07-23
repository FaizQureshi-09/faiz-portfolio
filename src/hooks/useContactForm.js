import { useState } from 'react';
import { env } from '../config/env';
import { countryCodes, DEFAULT_COUNTRY_ISO2 } from '../data/countryCodes';

/** Shape of an empty contact form. */
const EMPTY_FORM_VALUES = {
  name: '',
  email: '',
  countryIso2: DEFAULT_COUNTRY_ISO2,
  phone: '',
  message: '',
};

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const CONTACT_ENDPOINT = `${env.apiBaseUrl}/contact`;
export const MESSAGE_MAX_LENGTH = 250;
export const PHONE_MAX_LENGTH = 10;

/**
 * Validates a single contact form field.
 * @param {keyof typeof EMPTY_FORM_VALUES} name
 * @param {typeof EMPTY_FORM_VALUES} values
 * @returns {string | undefined} error message, if any
 */
function validateField(name, values) {
  switch (name) {
    case 'name':
      return values.name.trim() ? undefined : 'Please enter your name.';

    case 'email': {
      const email = values.email.trim();
      if (!email) return 'Please enter your email address.';
      if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.';
      return undefined;
    }

    case 'phone': {
      const phone = values.phone.trim();
      if (!phone) return undefined; // optional field
      if (!/^\d+$/.test(phone)) return 'Phone number must contain digits only.';
      if (phone.length > PHONE_MAX_LENGTH) {
        return `Phone number must be at most ${PHONE_MAX_LENGTH} digits.`;
      }
      return undefined;
    }

    case 'message': {
      const message = values.message.trim();
      if (!message) return 'Please enter a message.';
      if (message.length < 10) return 'Your message should be at least 10 characters.';
      if (message.length > MESSAGE_MAX_LENGTH) {
        return `Your message must be at most ${MESSAGE_MAX_LENGTH} characters.`;
      }
      return undefined;
    }

    default:
      return undefined;
  }
}

/**
 * Validates contact form values.
 * @param {typeof EMPTY_FORM_VALUES} values
 * @returns {Record<string, string>} map of field name to error message
 */
function validateContactForm(values) {
  const errors = {};

  for (const name of ['name', 'email', 'phone', 'message']) {
    const error = validateField(name, values);
    if (error) errors[name] = error;
  }

  return errors;
}

/**
 * Encapsulates all state and behavior for the Contact section's form:
 * field values, validation errors, and submission status.
 *
 * @returns {{
 *   values: typeof EMPTY_FORM_VALUES,
 *   errors: Record<string, string>,
 *   submissionStatus: 'idle' | 'submitting' | 'success' | 'error',
 *   submitError: string,
 *   handleFieldChange: (event: React.ChangeEvent) => void,
 *   handleFieldBlur: (event: React.FocusEvent) => void,
 *   handleSubmit: (event: React.FormEvent) => void,
 * }}
 */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH);
      setValues((previousValues) => ({ ...previousValues, phone: digitsOnly }));
      return;
    }

    setValues((previousValues) => ({ ...previousValues, [name]: value }));
  };

  /** Validates a field as soon as the user leaves it, for immediate feedback. */
  const handleFieldBlur = (event) => {
    const { name } = event.target;
    const error = validateField(name, values);

    setErrors((previousErrors) => {
      if (!error) {
        const { [name]: _removed, ...rest } = previousErrors;
        return rest;
      }
      return { ...previousErrors, [name]: error };
    });
  };

  const submitContactForm = async (formValues) => {
    const dialCode = countryCodes.find((country) => country.iso2 === formValues.countryIso2)?.dialCode ?? '';
    const payload = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone ? `${dialCode} ${formValues.phone}` : '',
      message: formValues.message,
    };

    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      throw new Error(result?.message || 'Failed to send your message. Please try again later.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmissionStatus('submitting');
    setSubmitError('');

    submitContactForm(values)
      .then(() => {
        setSubmissionStatus('success');
        setValues(EMPTY_FORM_VALUES);
      })
      .catch((error) => {
        setSubmissionStatus('error');
        setSubmitError(error.message || 'Something went wrong. Please try again later.');
      });
  };

  return {
    values,
    errors,
    submissionStatus,
    submitError,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
  };
}
