import { changeBackground } from "./imageHandler";

// We probably need to make the CLI create the chron
const zip = process.argv[2];

changeBackground(parseInt(zip));
