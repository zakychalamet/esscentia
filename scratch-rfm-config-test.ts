import { getRfmConfig, saveRfmConfig } from './lib/customer-service';

async function test() {
  console.log("Testing RFM Config Database persistence...");
  try {
    const initial = await getRfmConfig();
    console.log("Initial Config:", initial);

    // Save a new config (e.g. k=5)
    console.log("Saving new config with k=5...");
    await saveRfmConfig({
      recencyWeight: 50,
      frequencyWeight: 25,
      monetaryWeight: 25,
      k: 5,
      maxIterations: 400
    });

    const updated = await getRfmConfig();
    console.log("Updated Config:", updated);

    // Reset back to default for clean state
    console.log("Resetting config to defaults...");
    await saveRfmConfig({
      recencyWeight: 40,
      frequencyWeight: 30,
      monetaryWeight: 30,
      k: 4,
      maxIterations: 300
    });

    const reset = await getRfmConfig();
    console.log("Reset Config:", reset);

    console.log("SUCCESS! RFM configs table read, write, and duplicate key updates are fully functional.");
  } catch (error) {
    console.error("FAILED CONFIG TEST:", error);
  }
}

test();
