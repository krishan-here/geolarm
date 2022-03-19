export interface Contact {
  contactId?: string;
  displayName?: string;
  phoneNumbers: PhoneNumber[];
  photoThumbnail?: string;
  organizationName?: string;
  organizationRole?: string;
  birthday?: string;
}

interface PhoneNumber {
  label?: string;
  number?: string;
}

interface EmailAddress {
  label?: string;
  address?: string;
}
