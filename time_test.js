const fetch = require("node-fetch");
async function checkPage(url) {
    const start = process.hrtime.bigint(); // Start time in nanoseconds
  
    while (true) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        
        if (response.status === 200 && !text.includes("404") && !text.match(/not found/i)) {
          const end = process.hrtime.bigint(); // End time in nanoseconds
          const elapsedTime = Number(end - start) / 1000000; // Convert to seconds with precision
          process.stdout.write(`\n`);
          console.log(`Success! URL responded with 200 and no "404" found in the content.`);
          console.log(`Time elapsed: ${elapsedTime.toFixed(0)} ms`);
          break;
        } else {
          process.stdout.write(`.`);
        }
      } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
      }
  
      await new Promise(resolve => setTimeout(resolve, 1)); // Wait for 1 second before retrying
    }
  }
  
  // Run the function with the provided URL as an argument
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: node script.js <url>");
    process.exit(1);
  }
  
  checkPage(url);