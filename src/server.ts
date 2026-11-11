import app from "./app";
import config from "./config";
import connectDB from "./config/db";

// Start application
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
app.listen(config.PORT,  () => {
  console.log(`Care Guide task Server running on http://${config.IP_ADDRESS}:${config.PORT}`);
});

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
