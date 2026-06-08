import app from "./src/app";
import { PORT } from "./src/configs/constant";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`\n VillaBaas API running at http://localhost:${PORT}`);
    console.log(` Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/v1/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/v1/auth/login\n`);
});

