require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./src/config/db');
const User = require('./src/models/User.model');
const Document = require('./src/models/Document.model');

const demoUser = {
  name: 'Demo User',
  email: 'demo@lexai.com',
  password: 'demo1234',
  plan: 'pro',
  documentsAnalyzed: 3,
};

const demoDocs = [
  {
    originalName: 'Service_Agreement_TechCorp.pdf',
    fileName: 'demo-1.pdf',
    filePath: '/uploads/demo-1.pdf',
    fileSize: 124000,
    mimeType: 'application/pdf',
    documentType: 'Service',
    riskScore: 62,
    summary:
      'This is a service agreement between TechCorp Solutions and the client for software development services. The contract spans 12 months with automatic renewal and includes IP assignment clauses. Several penalty clauses for delays are present and should be reviewed carefully.',
    riskCount: 3,
    benefitCount: 2,
    opportunityCount: 2,
    neutralCount: 1,
    status: 'completed',
    clauses: [
      { title: 'Automatic Renewal Clause', type: 'risk', severity: 4, text: 'Contract renews automatically for another 12 months unless 30 days written notice is given. This can trap you in an unwanted contract.' },
      { title: 'Delay Penalty', type: 'risk', severity: 3, text: 'Penalties of 2% per week apply for project delays. Without clear milestone definitions this could be misused.' },
      { title: 'IP Ownership', type: 'risk', severity: 5, text: 'All intellectual property created during the engagement is assigned to TechCorp. You retain no rights to custom work.' },
      { title: 'Payment Terms', type: 'benefit', severity: 2, text: 'Monthly payment schedule with 30-day payment window. This is favorable compared to industry standard 15 days.' },
      { title: 'Liability Cap', type: 'benefit', severity: 2, text: 'Total liability is capped at 3 months of contract value, which limits your financial exposure.' },
      { title: 'Exit Clause Negotiation', type: 'opportunity', severity: 2, text: 'The exit clause window can be negotiated from 30 to 60 days which gives more flexibility.' },
      { title: 'IP Carve-out', type: 'opportunity', severity: 3, text: 'You can negotiate a carve-out for pre-existing IP and tools you bring into the engagement.' },
      { title: 'Governing Law', type: 'neutral', severity: 1, text: 'Contract is governed by Maharashtra law, which is standard for Indian tech agreements.' },
    ],
    verification: {
      structureValid: true,
      requiredFieldsPresent: true,
      formatConsistent: true,
      suspiciousPatterns: false,
      verdict: 'authentic',
      verdictText: 'Document structure and formatting are consistent with a legitimate service agreement. All required sections are present.',
    },
  },
  {
    originalName: 'NDA_StartupXYZ.pdf',
    fileName: 'demo-2.pdf',
    filePath: '/uploads/demo-2.pdf',
    fileSize: 68000,
    mimeType: 'application/pdf',
    documentType: 'NDA',
    riskScore: 35,
    summary:
      'A mutual non-disclosure agreement between two parties for evaluating a potential business partnership. The NDA has a reasonable 2-year term with clear definitions of confidential information. Overall this is a balanced agreement.',
    riskCount: 1,
    benefitCount: 3,
    opportunityCount: 1,
    neutralCount: 2,
    status: 'completed',
    clauses: [
      { title: 'Broad Confidentiality Definition', type: 'risk', severity: 3, text: 'Confidential information is defined very broadly and could include publicly known information. Try to narrow this definition.' },
      { title: 'Mutual Obligations', type: 'benefit', severity: 1, text: 'Both parties are equally bound by the same confidentiality obligations, which is fair and balanced.' },
      { title: 'Return of Materials', type: 'benefit', severity: 1, text: 'Clear provisions for returning or destroying confidential materials upon request or agreement termination.' },
      { title: 'Reasonable Term', type: 'benefit', severity: 1, text: '2-year confidentiality term is standard and reasonable for a business partnership NDA.' },
      { title: 'Narrow the Definition', type: 'opportunity', severity: 2, text: 'Negotiate to add a clause that information already in public domain is excluded from confidentiality obligations.' },
      { title: 'Jurisdiction', type: 'neutral', severity: 1, text: 'Delhi courts have jurisdiction — standard for Indian NDAs.' },
      { title: 'No License Grant', type: 'neutral', severity: 1, text: 'NDA explicitly states no license or rights are granted to shared information, which is protective.' },
    ],
    verification: {
      structureValid: true,
      requiredFieldsPresent: true,
      formatConsistent: true,
      suspiciousPatterns: false,
      verdict: 'authentic',
      verdictText: 'This NDA follows standard legal format with all required components. No suspicious patterns detected.',
    },
  },
  {
    originalName: 'Lease_Agreement_Pune.pdf',
    fileName: 'demo-3.pdf',
    filePath: '/uploads/demo-3.pdf',
    fileSize: 210000,
    mimeType: 'application/pdf',
    documentType: 'Lease',
    riskScore: 78,
    summary:
      'A residential lease agreement for a property in Pune for 11 months. The agreement contains several one-sided clauses heavily favoring the landlord including a high security deposit, restrictions on alterations, and strict exit conditions.',
    riskCount: 5,
    benefitCount: 1,
    opportunityCount: 2,
    neutralCount: 1,
    status: 'completed',
    clauses: [
      { title: 'High Security Deposit', type: 'risk', severity: 4, text: 'Security deposit of 6 months rent is significantly above the standard 2-3 months. Negotiate this down before signing.' },
      { title: 'Landlord Entry Rights', type: 'risk', severity: 4, text: 'Landlord can enter the property with just 2 hours notice. This is an invasion of privacy; standard is 24 hours.' },
      { title: 'No Alterations', type: 'risk', severity: 3, text: 'Absolute prohibition on any alterations including hanging pictures or installing hooks. Extremely restrictive.' },
      { title: 'Lock-in Period', type: 'risk', severity: 5, text: '6-month lock-in with no early exit clause means you are fully liable for 6 months rent even if you vacate.' },
      { title: 'Vague Maintenance Clause', type: 'risk', severity: 3, text: 'Tenant is responsible for all maintenance without any monetary limit or definition of what counts as tenant vs landlord responsibility.' },
      { title: 'Rent Stability', type: 'benefit', severity: 1, text: 'Fixed rent for the entire 11-month term with no escalation clause is favorable for the tenant.' },
      { title: 'Reduce Security Deposit', type: 'opportunity', severity: 3, text: 'Negotiate security deposit down to 2 months which is the standard in Pune residential market.' },
      { title: 'Add Maintenance Cap', type: 'opportunity', severity: 2, text: 'Add a clause that tenant maintenance liability is capped at ₹5,000 per month to avoid open-ended liability.' },
      { title: 'Registration', type: 'neutral', severity: 1, text: '11-month agreement does not require mandatory registration under Indian law, saving stamp duty costs.' },
    ],
    verification: {
      structureValid: true,
      requiredFieldsPresent: true,
      formatConsistent: false,
      suspiciousPatterns: true,
      verdict: 'suspicious',
      verdictText: 'Some formatting inconsistencies detected in clause numbering and one section appears to have been inserted after original drafting. Recommend manual review by a lawyer.',
    },
  },
];

async function seed() {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing demo data
  await User.deleteOne({ email: demoUser.email });

  // Create user
  const hashedPwd = await bcrypt.hash(demoUser.password, 12);
  const user = await User.create({ ...demoUser, password: hashedPwd });
  console.log(`✅ Created demo user: ${user.email}`);

  // Clear existing docs for this user
  await Document.deleteMany({ user: user._id });

  // Create demo documents
  for (const doc of demoDocs) {
    await Document.create({ ...doc, user: user._id });
    console.log(`📄 Created demo document: ${doc.originalName}`);
  }

  console.log('\n🎉 Seed complete!');
  console.log('─────────────────────────────');
  console.log('Demo credentials:');
  console.log(`  Email:    ${demoUser.email}`);
  console.log(`  Password: ${demoUser.password}`);
  console.log('─────────────────────────────\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
