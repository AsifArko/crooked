// Simple test script to verify GitHub API endpoint
// Run with: node test-github-api.js

const testGitHubAPI = async () => {
  try {
    console.log("Testing GitHub Contributions API...");

    const response = await fetch(
      "http://localhost:3000/api/github/contributions?username=asifarko"
    );
    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ API is working correctly!");
      console.log(
        `📊 Found ${data.contributions?.length || 0} contribution days`
      );
      console.log(`🎯 Total contributions: ${data.totalContributions || 0}`);
    } else {
      console.log("❌ API returned an error:", data.error);
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
  }
};

testGitHubAPI();
