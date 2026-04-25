#!/usr/bin/env node

/**
 * LinkedIn API Integration Test
 *
 * This test file validates the LinkedIn API integration by testing:
 * - API endpoint connectivity
 * - OAuth authentication flow
 * - Recommendations fetching
 * - Profile data retrieval
 * - Error handling and rate limiting
 *
 * Usage:
 *   node tests/integration/linkedin/test-linkedin-api.js
 *
 * Environment Variables Required:
 *   LINKEDIN_ACCESS_TOKEN - LinkedIn access token
 *   LINKEDIN_PERSON_ID - LinkedIn person ID
 *   LINKEDIN_CLIENT_ID - LinkedIn OAuth client ID (for OAuth tests)
 *   LINKEDIN_CLIENT_SECRET - LinkedIn OAuth client secret (for OAuth tests)
 *
 * @author Your Name
 * @version 1.0.0
 */

const https = require("https");

// Configuration
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_PERSON_ID = process.env.LINKEDIN_PERSON_ID;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

// Test configuration
const TEST_CONFIG = {
  timeout: 15000,
  retries: 3,
  apiBase: "https://api.linkedin.com/v2",
  endpoints: [
    "/me",
    `/people/${LINKEDIN_PERSON_ID}`,
    `/people/${LINKEDIN_PERSON_ID}/recommendations`,
    `/people/${LINKEDIN_PERSON_ID}/skills`,
    `/people/${LINKEDIN_PERSON_ID}/positions`,
    `/people/${LINKEDIN_PERSON_ID}/educations`,
  ],
};

/**
 * Make a LinkedIn API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
async function makeLinkedInRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${TEST_CONFIG.apiBase}${endpoint}`;

    const requestOptions = {
      hostname: "api.linkedin.com",
      path: `/v2${endpoint}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
        "User-Agent": "Portfolio-Test-Suite/1.0.0",
        ...options.headers,
      },
      timeout: TEST_CONFIG.timeout,
    };

    const req = https.request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

/**
 * Test LinkedIn API endpoint with retries
 * @param {string} endpoint - API endpoint to test
 * @param {string} testName - Name of the test
 * @returns {Promise<Object>} Test result
 */
async function testLinkedInEndpoint(endpoint, testName) {
  console.log(`\n🔍 Testing ${testName}...`);

  for (let attempt = 1; attempt <= TEST_CONFIG.retries; attempt++) {
    try {
      const response = await makeLinkedInRequest(endpoint);

      if (response.status === 200) {
        console.log(`✅ ${testName} - SUCCESS`);
        console.log(`   Status: ${response.status}`);

        return {
          success: true,
          status: response.status,
          data: response.data,
          headers: response.headers,
        };
      } else if (response.status === 401) {
        console.log(`❌ ${testName} - UNAUTHORIZED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.data.message || "No message"}`);
        console.log(
          `   Tip: Check your LINKEDIN_ACCESS_TOKEN environment variable`
        );

        return {
          success: false,
          status: response.status,
          error: "Unauthorized - Check LINKEDIN_ACCESS_TOKEN",
        };
      } else if (response.status === 403) {
        console.log(`❌ ${testName} - FORBIDDEN`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.data.message || "No message"}`);
        console.log(`   Tip: Check your app permissions and scopes`);

        return {
          success: false,
          status: response.status,
          error: "Forbidden - Check app permissions",
        };
      } else if (response.status === 429) {
        console.log(`❌ ${testName} - RATE LIMITED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.data.message || "No message"}`);

        return {
          success: false,
          status: response.status,
          error: "Rate limited",
        };
      } else {
        console.log(`❌ ${testName} - FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.data.message || "No message"}`);

        return {
          success: false,
          status: response.status,
          error: response.data.message || "Unknown error",
        };
      }
    } catch (error) {
      console.log(`⚠️  ${testName} - ATTEMPT ${attempt} FAILED`);
      console.log(`   Error: ${error.message}`);

      if (attempt === TEST_CONFIG.retries) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
}

/**
 * Validate LinkedIn profile data structure
 * @param {Object} profileData - Profile data from LinkedIn API
 * @returns {boolean} Whether the data is valid
 */
function validateProfileData(profileData) {
  const requiredFields = ["id"];
  const missingFields = requiredFields.filter((field) => !profileData[field]);

  if (missingFields.length > 0) {
    console.log(`   ❌ Missing required fields: ${missingFields.join(", ")}`);
    return false;
  }

  console.log(`   ✅ Profile data validation passed`);
  console.log(`   👤 ID: ${profileData.id}`);

  if (profileData.firstName) {
    const firstName =
      profileData.firstName.localized?.en_US || profileData.firstName;
    const lastName =
      profileData.lastName?.localized?.en_US || profileData.lastName;
    console.log(`   👤 Name: ${firstName} ${lastName || ""}`);
  }

  if (profileData.headline) {
    console.log(`   💼 Headline: ${profileData.headline}`);
  }

  if (profileData.location) {
    console.log(`   📍 Location: ${profileData.location.name}`);
  }

  return true;
}

/**
 * Validate LinkedIn recommendations data structure
 * @param {Object} recommendationsData - Recommendations data from LinkedIn API
 * @returns {boolean} Whether the data is valid
 */
function validateRecommendationsData(recommendationsData) {
  if (!recommendationsData.elements) {
    console.log(`   ❌ Recommendations data missing 'elements' property`);
    return false;
  }

  const recommendations = recommendationsData.elements;
  console.log(`   ✅ Found ${recommendations.length} recommendations`);

  if (recommendations.length > 0) {
    const sampleRec = recommendations[0];
    const requiredFields = ["id", "recommender", "recommendationText"];
    const missingFields = requiredFields.filter((field) => !sampleRec[field]);

    if (missingFields.length > 0) {
      console.log(
        `   ❌ Recommendation missing required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    const recommender = sampleRec.recommender;
    const firstName =
      recommender.firstName?.localized?.en_US || recommender.firstName;
    const lastName =
      recommender.lastName?.localized?.en_US || recommender.lastName;

    console.log(`   👤 Sample recommender: ${firstName} ${lastName || ""}`);
    console.log(
      `   💬 Sample text: ${sampleRec.recommendationText.substring(0, 100)}...`
    );
    console.log(`   📅 Created: ${sampleRec.createdAt || "N/A"}`);
  }

  return true;
}

/**
 * Validate LinkedIn skills data structure
 * @param {Object} skillsData - Skills data from LinkedIn API
 * @returns {boolean} Whether the data is valid
 */
function validateSkillsData(skillsData) {
  if (!skillsData.elements) {
    console.log(`   ❌ Skills data missing 'elements' property`);
    return false;
  }

  const skills = skillsData.elements;
  console.log(`   ✅ Found ${skills.length} skills`);

  if (skills.length > 0) {
    const sampleSkill = skills[0];
    const requiredFields = ["id", "skill"];
    const missingFields = requiredFields.filter((field) => !sampleSkill[field]);

    if (missingFields.length > 0) {
      console.log(
        `   ❌ Skill missing required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    console.log(`   🎯 Sample skill: ${sampleSkill.skill.name}`);
    console.log(`   👍 Endorsements: ${sampleSkill.numEndorsements || 0}`);
  }

  return true;
}

/**
 * Test OAuth flow (if credentials are available)
 * @returns {Promise<Object>} OAuth test result
 */
async function testOAuthFlow() {
  console.log("\n🔍 Testing LinkedIn OAuth Flow...");

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    console.log("⚠️  OAuth credentials not available. Skipping OAuth tests.");
    console.log(
      "   Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET for OAuth testing."
    );
    return { success: false, error: "OAuth credentials not available" };
  }

  try {
    // Test OAuth initiation
    const authResponse = await fetch("http://localhost:3000/api/linkedin/auth");

    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log("✅ OAuth initiation successful");
      console.log(`   Auth URL: ${authData.authUrl.substring(0, 100)}...`);
      console.log(`   State: ${authData.state}`);

      return { success: true, data: authData };
    } else {
      console.log("❌ OAuth initiation failed");
      console.log(`   Status: ${authResponse.status}`);
      const errorText = await authResponse.text();
      console.log(`   Response: ${errorText}`);

      return { success: false, error: "OAuth initiation failed" };
    }
  } catch (error) {
    console.log("❌ OAuth test failed");
    console.log(`   Error: ${error.message}`);

    return { success: false, error: error.message };
  }
}

/**
 * Main test function
 */
async function runLinkedInAPITests() {
  console.log("🚀 Starting LinkedIn API Integration Tests...\n");

  if (!LINKEDIN_ACCESS_TOKEN || !LINKEDIN_PERSON_ID) {
    console.log(
      "❌ Error: LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_ID are required."
    );
    console.log(
      "   Please set these environment variables before running tests."
    );
    process.exit(1);
  }

  const testResults = [];

  // Test 1: Get current user profile
  const meResult = await testLinkedInEndpoint("/me", "Current User Profile");
  if (meResult.success) {
    validateProfileData(meResult.data);
  }
  testResults.push(meResult);

  // Test 2: Get specific user profile
  const profileResult = await testLinkedInEndpoint(
    `/people/${LINKEDIN_PERSON_ID}`,
    "User Profile"
  );
  if (profileResult.success) {
    validateProfileData(profileResult.data);
  }
  testResults.push(profileResult);

  // Test 3: Get recommendations
  const recommendationsResult = await testLinkedInEndpoint(
    `/people/${LINKEDIN_PERSON_ID}/recommendations`,
    "User Recommendations"
  );
  if (recommendationsResult.success) {
    validateRecommendationsData(recommendationsResult.data);
  }
  testResults.push(recommendationsResult);

  // Test 4: Get skills
  const skillsResult = await testLinkedInEndpoint(
    `/people/${LINKEDIN_PERSON_ID}/skills`,
    "User Skills"
  );
  if (skillsResult.success) {
    validateSkillsData(skillsResult.data);
  }
  testResults.push(skillsResult);

  // Test 5: Get experience
  const experienceResult = await testLinkedInEndpoint(
    `/people/${LINKEDIN_PERSON_ID}/positions`,
    "User Experience"
  );
  if (experienceResult.success) {
    console.log(
      `   ✅ Found ${experienceResult.data.elements?.length || 0} experience entries`
    );
  }
  testResults.push(experienceResult);

  // Test 6: Get education
  const educationResult = await testLinkedInEndpoint(
    `/people/${LINKEDIN_PERSON_ID}/educations`,
    "User Education"
  );
  if (educationResult.success) {
    console.log(
      `   ✅ Found ${educationResult.data.elements?.length || 0} education entries`
    );
  }
  testResults.push(educationResult);

  // Test 7: Test local API endpoint (if running)
  console.log("\n🔍 Testing Local LinkedIn API Endpoint...");
  try {
    const localResponse = await fetch(
      "http://localhost:3000/api/linkedin/recommendations"
    );

    if (localResponse.ok) {
      const localData = await localResponse.json();
      console.log("✅ Local LinkedIn API endpoint working");
      console.log(`   Status: ${localResponse.status}`);
      console.log(
        `   Recommendations: ${localData.recommendations?.length || 0}`
      );
    } else {
      console.log("❌ Local LinkedIn API endpoint failed");
      console.log(`   Status: ${localResponse.status}`);
      const errorText = await localResponse.text();
      console.log(`   Response: ${errorText}`);
    }
  } catch (error) {
    console.log("❌ Local LinkedIn API endpoint not available");
    console.log(`   Error: ${error.message}`);
  }

  // Test 8: OAuth flow (optional)
  const oauthResult = await testOAuthFlow();
  testResults.push(oauthResult);

  // Summary
  console.log("\n📊 Test Summary:");
  const successfulTests = testResults.filter((result) => result.success).length;
  const totalTests = testResults.length;

  console.log(`   ✅ Passed: ${successfulTests}/${totalTests}`);
  console.log(`   ❌ Failed: ${totalTests - successfulTests}/${totalTests}`);

  if (successfulTests === totalTests) {
    console.log("\n🎉 All LinkedIn API tests passed!");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some tests failed. Check the output above for details.");
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runLinkedInAPITests().catch((error) => {
    console.error("❌ Test suite failed with error:", error.message);
    process.exit(1);
  });
}

module.exports = {
  makeLinkedInRequest,
  testLinkedInEndpoint,
  validateProfileData,
  validateRecommendationsData,
  validateSkillsData,
  testOAuthFlow,
  runLinkedInAPITests,
};
