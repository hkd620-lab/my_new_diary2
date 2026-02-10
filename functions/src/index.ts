cat > functions/src/index.ts << 'EOF'
import * as dotenv from "dotenv";
dotenv.config();

import * as functions from "firebase-functions";

import { generateContextLine } from "./generateContextLine";
import { generateFinalEssay } from "./generateFinalEssay";

// Cloud Functions export
export {
  generateContextLine,
  generateFinalEssay,
};
EOF
