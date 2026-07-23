import { countryCodes, getFlagEmoji } from '../../../data/countryCodes';

/**
 * Phone field: a country-calling-code select paired with a 10-digit number
 * input under one shared label. Kept separate from ContactFormField since
 * it renders two controls instead of one.
 *
 * @param {object} props
 * @param {string} props.countryIso2 - selected country's ISO 3166-1 alpha-2 code
 * @param {string} props.phone - controlled phone number value (digits only)
 * @param {(event: React.ChangeEvent) => void} props.onCountryChange
 * @param {(event: React.ChangeEvent) => void} props.onPhoneChange
 * @param {(event: React.FocusEvent) => void} [props.onPhoneBlur]
 * @param {string} [props.error] - validation error message, if any
 */
export function PhoneField({ countryIso2, phone, onCountryChange, onPhoneChange, onPhoneBlur, error }) {
  return (
    <div className="contact-form-field">
      <label htmlFor="contact-phone" className="contact-form-field__label">
        Contact Number (optional)
      </label>
      <div className="contact-form-field__phone-group">
        <select
          id="contact-country-code"
          name="countryIso2"
          value={countryIso2}
          onChange={onCountryChange}
          className="contact-form-field__country-select"
          aria-label="Country calling code"
        >
          {countryCodes.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {getFlagEmoji(country.iso2)} {country.dialCode} {country.name}
            </option>
          ))}
        </select>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={onPhoneChange}
          onBlur={onPhoneBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'contact-phone-error' : undefined}
          className={`contact-form-field__control ${error ? 'contact-form-field__control--error' : ''}`}
        />
      </div>
      {error ? (
        <p id="contact-phone-error" className="contact-form-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
