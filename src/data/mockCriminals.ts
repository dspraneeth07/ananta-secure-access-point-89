
export interface Criminal {
  id: string;
  sno: number;
  name: string;
  fatherName: string;
  address: string;
  uniqueId: string;
  firNumber: string;
  personCategory: string;
  policeStation: string;
  district: string;
  country: string;
  state: string;
  drugType: string;
  noCrimes: number;
  photo: string;
  presentStatus: string;
  physicalVerificationDate: string;
  age: number;
  gender: string;
  occupation: string;
  aadharNo: string;
  voterId: string;
  drivingLicense: string;
  education: string;
  languagesKnown: string;
  passportNo: string;
  socialMedia: string;
  phoneNumber: string;
  imei: string;
  email: string;
  bankAccount: string;
  bankName: string;
  aliasName?: string;
  caseStatus: string;
}

export const telanganaDistricts = [
  'Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Sangareddy', 'Warangal Urban',
  'Khammam', 'Nalgonda', 'Karimnagar', 'Nizamabad', 'Mahbubnagar', 'Warangal Rural',
  'Adilabad', 'Suryapet', 'Siddipet', 'Medak', 'Jagtial', 'Jangaon', 'Bhadradri Kothagudem',
  'Peddapalli', 'Kamareddy', 'Mahabubabad', 'Nirmal', 'Nagarkurnool', 'Wanaparthy',
  'Yadadri Bhuvanagiri', 'Rajanna Sircilla', 'Vikarabad', 'Asifabad', 'Mancherial',
  'Jayashankar Bhupalpally', 'Mulugu'
];

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const countries = [
  'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Afghanistan', 'Myanmar', 'Thailand',
  'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Vietnam', 'Cambodia', 'Laos',
  'China', 'UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Oman'
];

export const drugTypes = ['Cannabis', 'Heroin', 'Cocaine', 'Ganja', 'Opium', 'MDMA', 'Amphetamine', 'Charas', 'Brown Sugar'];
export const categories = ['Peddler', 'Consumer', 'Supplier', 'Kingpin', 'Transporter', 'Financier'];
export const statuses = ['Arrested', 'Absconding'];
export const caseStatuses = ['Under Investigation', 'Pending Trial', 'Chargesheet Created', 'Transfer to Other Dept', 'Reassign', 'Transfer to Other PS', 'Reopened', 'Disposed'];
const occupations = ['Unemployed', 'Driver', 'Laborer', 'Businessman', 'Student', 'Teacher', 'Mechanic', 'Farmer'];
const educations = ['Illiterate', 'Primary', 'Secondary', 'Graduate', 'Post Graduate'];
const bankNames = ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Canara Bank', 'Union Bank', 'PNB', 'BOI'];

function generateRandomName(): string {
  const firstNames = ['Rajesh', 'Suresh', 'Ramesh', 'Mahesh', 'Ganesh', 'Naresh', 'Dinesh', 'Ritesh', 'Mukesh', 'Lokesh',
                     'Priya', 'Sunita', 'Geeta', 'Rita', 'Sita', 'Anita', 'Kavita', 'Savita', 'Lalita', 'Mamta'];
  const lastNames = ['Kumar', 'Singh', 'Sharma', 'Gupta', 'Agarwal', 'Verma', 'Mishra', 'Tiwari', 'Yadav', 'Reddy',
                     'Rao', 'Nair', 'Iyer', 'Patel', 'Shah', 'Jain', 'Bansal', 'Goel', 'Mittal', 'Saxena'];
  
  return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + 
         lastNames[Math.floor(Math.random() * lastNames.length)];
}

function generateMockCriminals(): Criminal[] {
  const criminals: Criminal[] = [];
  let sno = 1;

  // Generate 2 criminals per Telangana district (62 criminals)
  telanganaDistricts.forEach(district => {
    for (let i = 0; i < 2; i++) {
      const name = generateRandomName();
      const criminal: Criminal = {
        id: `tel-${district}-${i + 1}`,
        sno: sno++,
        name,
        fatherName: generateRandomName(),
        address: `${Math.floor(Math.random() * 999) + 1}, ${district}, Telangana`,
        uniqueId: `TGANB${String(sno).padStart(4, '0')}`,
        firNumber: `FIR${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}/2024`,
        personCategory: categories[Math.floor(Math.random() * categories.length)],
        policeStation: `${district} PS`,
        district,
        country: 'India',
        state: 'Telangana',
        drugType: drugTypes[Math.floor(Math.random() * drugTypes.length)],
        noCrimes: Math.floor(Math.random() * 5) + 1,
        photo: '/placeholder.svg',
        presentStatus: statuses[Math.floor(Math.random() * statuses.length)],
        physicalVerificationDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        age: Math.floor(Math.random() * 40) + 20,
        gender: Math.random() > 0.8 ? 'Female' : 'Male',
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        aadharNo: `${Math.floor(Math.random() * 9999) + 1000}-${Math.floor(Math.random() * 9999) + 1000}-${Math.floor(Math.random() * 9999) + 1000}`,
        voterId: `TEL${Math.floor(Math.random() * 9999999) + 1000000}`,
        drivingLicense: `TG${String(Math.floor(Math.random() * 99) + 10)}${String(Math.floor(Math.random() * 9999999999999) + 1000000000000)}`,
        education: educations[Math.floor(Math.random() * educations.length)],
        languagesKnown: 'Telugu, Hindi, English',
        passportNo: `P${Math.floor(Math.random() * 9999999) + 1000000}`,
        socialMedia: `@${name.toLowerCase().replace(' ', '')}`,
        phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        imei: String(Math.floor(Math.random() * 900000000000000) + 100000000000000),
        email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
        bankAccount: String(Math.floor(Math.random() * 90000000000) + 10000000000),
        bankName: bankNames[Math.floor(Math.random() * bankNames.length)],
        aliasName: Math.random() > 0.7 ? generateRandomName() : undefined,
        caseStatus: caseStatuses[Math.floor(Math.random() * caseStatuses.length)]
      };
      criminals.push(criminal);
    }
  });

  // Generate 4 criminals per other Indian state (108 criminals)
  indianStates.forEach(state => {
    for (let i = 0; i < 4; i++) {
      const name = generateRandomName();
      const criminal: Criminal = {
        id: `ind-${state.replace(/\s+/g, '')}-${i + 1}`,
        sno: sno++,
        name,
        fatherName: generateRandomName(),
        address: `${Math.floor(Math.random() * 999) + 1}, ${state}, India`,
        uniqueId: `IND${String(sno).padStart(4, '0')}`,
        firNumber: `FIR${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}/2024`,
        personCategory: categories[Math.floor(Math.random() * categories.length)],
        policeStation: `${state} PS`,
        district: `${state} District`,
        country: 'India',
        state,
        drugType: drugTypes[Math.floor(Math.random() * drugTypes.length)],
        noCrimes: Math.floor(Math.random() * 5) + 1,
        photo: '/placeholder.svg',
        presentStatus: statuses[Math.floor(Math.random() * statuses.length)],
        physicalVerificationDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        age: Math.floor(Math.random() * 40) + 20,
        gender: Math.random() > 0.8 ? 'Female' : 'Male',
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        aadharNo: `${Math.floor(Math.random() * 9999) + 1000}-${Math.floor(Math.random() * 9999) + 1000}-${Math.floor(Math.random() * 9999) + 1000}`,
        voterId: `${state.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 9999999) + 1000000}`,
        drivingLicense: `${state.substring(0, 2).toUpperCase()}${String(Math.floor(Math.random() * 99) + 10)}${String(Math.floor(Math.random() * 9999999999999) + 1000000000000)}`,
        education: educations[Math.floor(Math.random() * educations.length)],
        languagesKnown: 'Hindi, English, Local Language',
        passportNo: `P${Math.floor(Math.random() * 9999999) + 1000000}`,
        socialMedia: `@${name.toLowerCase().replace(' ', '')}`,
        phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        imei: String(Math.floor(Math.random() * 900000000000000) + 100000000000000),
        email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
        bankAccount: String(Math.floor(Math.random() * 90000000000) + 10000000000),
        bankName: bankNames[Math.floor(Math.random() * bankNames.length)],
        aliasName: Math.random() > 0.7 ? generateRandomName() : undefined,
        caseStatus: caseStatuses[Math.floor(Math.random() * caseStatuses.length)]
      };
      criminals.push(criminal);
    }
  });

  // Generate 2 criminals per other country (40 criminals)
  countries.forEach(country => {
    for (let i = 0; i < 2; i++) {
      const name = generateRandomName();
      const criminal: Criminal = {
        id: `int-${country.replace(/\s+/g, '')}-${i + 1}`,
        sno: sno++,
        name,
        fatherName: generateRandomName(),
        address: `${Math.floor(Math.random() * 999) + 1}, ${country}`,
        uniqueId: `INT${String(sno).padStart(4, '0')}`,
        firNumber: `FIR${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}/2024`,
        personCategory: categories[Math.floor(Math.random() * categories.length)],
        policeStation: `${country} Liaison`,
        district: `${country} Region`,
        country,
        state: country,
        drugType: drugTypes[Math.floor(Math.random() * drugTypes.length)],
        noCrimes: Math.floor(Math.random() * 5) + 1,
        photo: '/placeholder.svg',
        presentStatus: statuses[Math.floor(Math.random() * statuses.length)],
        physicalVerificationDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        age: Math.floor(Math.random() * 40) + 20,
        gender: Math.random() > 0.8 ? 'Female' : 'Male',
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        aadharNo: 'N/A',
        voterId: 'N/A',
        drivingLicense: `${country.substring(0, 2).toUpperCase()}${String(Math.floor(Math.random() * 9999999999999) + 1000000000000)}`,
        education: educations[Math.floor(Math.random() * educations.length)],
        languagesKnown: 'English, Local Language',
        passportNo: `${country.substring(0, 1).toUpperCase()}${Math.floor(Math.random() * 9999999) + 1000000}`,
        socialMedia: `@${name.toLowerCase().replace(' ', '')}`,
        phoneNumber: `+${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        imei: String(Math.floor(Math.random() * 900000000000000) + 100000000000000),
        email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
        bankAccount: String(Math.floor(Math.random() * 90000000000) + 10000000000),
        bankName: 'International Bank',
        aliasName: Math.random() > 0.7 ? generateRandomName() : undefined,
        caseStatus: caseStatuses[Math.floor(Math.random() * caseStatuses.length)]
      };
      criminals.push(criminal);
    }
  });

  return criminals;
}

export const mockCriminals = generateMockCriminals();
