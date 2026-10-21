export const companyInfo = {
  email: "info@softelectronicsolutions.com",
  phones: ["9492217575", "9542869275"],
  address: "4, Road Number 2, Gayathri Hills, Balapur, Telangana, India",
  addressDirections: "Near Balaji Furniture; take the left onto Road Number 4.",
  mapsUrl: "https://www.google.com/maps?q=17.307359,78.517289&z=17&hl=en",
  timezone: "Asia/Kolkata",
  businessHours: [
    { days: "Monday – Saturday", hours: "9:30 AM – 6:30 PM" },
    { days: "Sunday", hours: "CLOSED" },
  ],
};

function escapeVCardValue(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export const contactVCard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Soft Electronic Solutions;;;;",
  "FN:Soft Electronic Solutions",
  "ORG:Soft Electronic Solutions",
  `EMAIL;TYPE=INTERNET,WORK:${escapeVCardValue(companyInfo.email)}`,
  ...companyInfo.phones.map(
    (phone) => `TEL;TYPE=WORK,VOICE:+91${escapeVCardValue(phone)}`,
  ),
  `ADR;TYPE=WORK:;;${escapeVCardValue(
    `${companyInfo.address}, ${companyInfo.addressDirections}`,
  )};;;;`,
  `URL:${companyInfo.mapsUrl}`,
  "END:VCARD",
].join("\r\n");
