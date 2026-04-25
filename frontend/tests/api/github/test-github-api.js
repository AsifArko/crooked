#!/usr/bin/env node

/**
 * GitHub API Integration Test
 *
 * This test file validates the GitHub API integration by testing:
 * - API endpoint connectivity
 * - Response format validation
 * - Error handling
 * - Rate limiting behavior
 *
 * Usage:
 *   node tests/api/github/test-github-api.js
 *
 * Environment Variables Required:
 *   GITHUB_TOKEN - GitHub personal access token
 *   GITHUB_USERNAME - GitHub username to test with
 *
 * @author Your Name
 * @version 1.0.0
 */

const https = require("https");

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "testuser";
const GITHUB_API_BASE = "https://api.github.com";

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  endpoints: [
    "/user",
    `/users/${GITHUB_USERNAME}`,
    `/users/${GITHUB_USERNAME}/repos`,
    `/users/${GITHUB_USERNAME}/events`,
  ],
};

/**
 * Make a GitHub API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
async function makeGitHubRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${GITHUB_API_BASE}${endpoint}`;

    const requestOptions = {
      hostname: "api.github.com",
      path: endpoint,
      method: "GET",
      headers: {
        "User-Agent": "Portfolio-Test-Suite/1.0.0",
        Accept: "application/vnd.github.v3+json",
        Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
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
 * Test GitHub API endpoint with retries
 * @param {string} endpoint - API endpoint to test
 * @param {string} testName - Name of the test
 * @returns {Promise<Object>} Test result
 */
async function testGitHubEndpoint(endpoint, testName) {
  console.log(`\n🔍 Testing ${testName}...`);

  for (let attempt = 1; attempt <= TEST_CONFIG.retries; attempt++) {
    try {
      const response = await makeGitHubRequest(endpoint);

      if (response.status === 200) {
        console.log(`✅ ${testName} - SUCCESS`);
        console.log(`   Status: ${response.status}`);
        console.log(
          `   Rate Limit Remaining: ${response.headers["x-ratelimit-remaining"] || "N/A"}`
        );

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
        console.log(`   Tip: Check your GITHUB_TOKEN environment variable`);

        return {
          success: false,
          status: response.status,
          error: "Unauthorized - Check GITHUB_TOKEN",
        };
      } else if (response.status === 403) {
        console.log(`❌ ${testName} - RATE LIMITED`);
        console.log(`   Status: ${response.status}`);
        console.log(
          `   Rate Limit Reset: ${new Date(response.headers["x-ratelimit-reset"] * 1000).toISOString()}`
        );

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
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

/**
 * Validate GitHub user data structure
 * @param {Object} userData - User data from GitHub API
 * @returns {boolean} Whether the data is valid
 */
function validateUserData(userData) {
  const requiredFields = ["id", "login", "avatar_url", "type"];
  const missingFields = requiredFields.filter((field) => !userData[field]);

  if (missingFields.length > 0) {
    console.log(`   ❌ Missing required fields: ${missingFields.join(", ")}`);
    return false;
  }

  console.log(`   ✅ User data validation passed`);
  console.log(`   👤 User: ${userData.login} (ID: ${userData.id})`);
  console.log(`   📧 Email: ${userData.email || "Not public"}`);
  console.log(`   📍 Location: ${userData.location || "Not specified"}`);

  return true;
}

/**
 * Validate GitHub repository data structure
 * @param {Array} reposData - Repository data from GitHub API
 * @returns {boolean} Whether the data is valid
 */
function validateReposData(reposData) {
  if (!Array.isArray(reposData)) {
    console.log(`   ❌ Repositories data is not an array`);
    return false;
  }

  console.log(`   ✅ Found ${reposData.length} repositories`);

  if (reposData.length > 0) {
    const sampleRepo = reposData[0];
    const requiredFields = ["id", "name", "full_name", "html_url"];
    const missingFields = requiredFields.filter((field) => !sampleRepo[field]);

    if (missingFields.length > 0) {
      console.log(
        `   ❌ Repository missing required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    console.log(`   📦 Sample repo: ${sampleRepo.full_name}`);
    console.log(`   ⭐ Stars: ${sampleRepo.stargazers_count || 0}`);
    console.log(`   🍴 Forks: ${sampleRepo.forks_count || 0}`);
  }

  return true;
}

/**
 * Main test function
 */
async function runGitHubAPITests() {
  console.log("🚀 Starting GitHub API Integration Tests...\n");

  if (!GITHUB_TOKEN) {
    console.log(
      "⚠️  Warning: GITHUB_TOKEN not set. Some tests may fail with 401 errors."
    );
    console.log("   Set GITHUB_TOKEN environment variable for full testing.\n");
  }

  const testResults = [];

  // Test 1: Get authenticated user
  const userResult = await testGitHubEndpoint("/user", "Authenticated User");
  if (userResult.success) {
    validateUserData(userResult.data);
  }
  testResults.push(userResult);

  // Test 2: Get public user profile
  const publicUserResult = await testGitHubEndpoint(
    `/users/${GITHUB_USERNAME}`,
    "Public User Profile"
  );
  if (publicUserResult.success) {
    validateUserData(publicUserResult.data);
  }
  testResults.push(publicUserResult);

  // Test 3: Get user repositories
  const reposResult = await testGitHubEndpoint(
    `/users/${GITHUB_USERNAME}/repos?per_page=5&sort=updated`,
    "User Repositories"
  );
  if (reposResult.success) {
    validateReposData(reposResult.data);
  }
  testResults.push(reposResult);

  // Test 4: Get user events
  const eventsResult = await testGitHubEndpoint(
    `/users/${GITHUB_USERNAME}/events?per_page=5`,
    "User Events"
  );
  if (eventsResult.success) {
    console.log(`   ✅ Found ${eventsResult.data.length} recent events`);
  }
  testResults.push(eventsResult);

  // Test 5: Test local API endpoint (if running)
  console.log("\n🔍 Testing Local GitHub API Endpoint...");
  try {
    const localResponse = await fetch(
      "http://localhost:3000/api/github/activity-overview"
    );

    if (localResponse.ok) {
      const localData = await localResponse.json();
      console.log("✅ Local GitHub API endpoint working");
      console.log(`   Status: ${localResponse.status}`);
      console.log(`   Data keys: ${Object.keys(localData).join(", ")}`);
    } else {
      console.log("❌ Local GitHub API endpoint failed");
      console.log(`   Status: ${localResponse.status}`);
      const errorText = await localResponse.text();
      console.log(`   Response: ${errorText}`);
    }
  } catch (error) {
    console.log("❌ Local GitHub API endpoint not available");
    console.log(`   Error: ${error.message}`);
  }

  // Summary
  console.log("\n📊 Test Summary:");
  const successfulTests = testResults.filter((result) => result.success).length;
  const totalTests = testResults.length;

  console.log(`   ✅ Passed: ${successfulTests}/${totalTests}`);
  console.log(`   ❌ Failed: ${totalTests - successfulTests}/${totalTests}`);

  if (successfulTests === totalTests) {
    console.log("\n🎉 All GitHub API tests passed!");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some tests failed. Check the output above for details.");
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runGitHubAPITests().catch((error) => {
    console.error("❌ Test suite failed with error:", error.message);
    process.exit(1);
  });
}

module.exports = {
  makeGitHubRequest,
  testGitHubEndpoint,
  validateUserData,
  validateReposData,
  runGitHubAPITests,
};
