/**
 * Test script to verify certificate publishing and verification flow
 */

const BASE_URL = "http://localhost:5000";

async function testCertificateFlow() {
  console.log("🧪 Testing Certificate Publishing and Verification Flow...\n");

  try {
    // Step 1: Login as staff user
    console.log("📝 Step 1: Logging in as staff user...");
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
      credentials: "include",
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    console.log("✅ Login successful\n");

    // Step 2: Create and publish a certificate
    console.log("📝 Step 2: Creating a test certificate...");
    const certData = {
      certificateNumber: `AIGI-2024-TEST${Date.now()}`,
      stoneType: "Natural Diamond",
      carat: "2.50",
      color: "D",
      clarity: "VVS1",
      cut: "Excellent",
      branch: "Head Office",
      notes: "Test certificate for verification",
    };

    const createResponse = await fetch(`${BASE_URL}/api/certificates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certData),
      credentials: "include",
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(
        `Certificate creation failed: ${createResponse.status} - ${errorText}`
      );
    }

    const createdCert = await createResponse.json();
    console.log(`✅ Certificate created with ID: ${createdCert.id}`);
    console.log(`   Certificate Number: ${createdCert.certificateNumber}\n`);

    // Step 3: Verify the certificate through public endpoint
    console.log(
      `📝 Step 3: Verifying certificate via public endpoint...`
    );
    const verifyResponse = await fetch(
      `${BASE_URL}/api/certificates/verify/${encodeURIComponent(
        certData.certificateNumber
      )}`,
      { credentials: "include" }
    );

    if (!verifyResponse.ok) {
      throw new Error(`Certificate verification failed: ${verifyResponse.status}`);
    }

    const verifiedCert = await verifyResponse.json();
    console.log("✅ Certificate verified successfully!");
    console.log(`   Stone Type: ${verifiedCert.stoneType}`);
    console.log(`   Carat: ${verifiedCert.carat}`);
    console.log(`   Color: ${verifiedCert.color}`);
    console.log(`   Clarity: ${verifiedCert.clarity}`);
    console.log(`   Cut: ${verifiedCert.cut}`);
    console.log(`   Branch: ${verifiedCert.branch}`);
    console.log(`   Issued Date: ${verifiedCert.issuedDate}\n`);

    console.log("✅ All tests passed! Certificate publishing and verification works.");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testCertificateFlow();
