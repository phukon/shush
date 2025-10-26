<div align="center">
  
![logo](https://github.com/user-attachments/assets/eccaea76-36b4-4e42-b7de-c20d1b7ea980)

*(shush!)*

</div>

A lightweight utility for Node.js projects to selectively suppress unwanted runtime warnings originating from dependencies or older code. This is particularly useful for dealing with "punnycode is deprecated" or similar warnings that you cannot fix directly.

## Installation

```bash
npm install @phukon/shush
```

## Usage

```javascript
import { suppressWarnings, restoreWarnings } from "shush";

// Suppress warnings containing the string "DeprecationWarning"
suppressWarnings(["DeprecationWarning"]);

// This warning will NOT be printed
process.emitWarning("DeprecationWarning: old feature");

// This warning will be printed because it doesn't match
process.emitWarning("Other warning");

console.log("Warnings suppressed!");

// Restore original warning behavior
restoreWarnings();

// Now warnings are printed again
process.emitWarning("DeprecationWarning: old feature");
```

### Using Regular Expressions

```javascript
suppressWarnings([/deprecated/i, /experimental/i]);

process.emitWarning("This feature is deprecated"); // suppressed
process.emitWarning("Experimental API"); // suppressed
process.emitWarning("Other warning"); // still shown

restoreWarnings();
process.emitWarning("This feature is deprecated"); // shown again
```

### Multiple Suppression Rules

```javascript
// Suppress multiple types of warnings
suppressWarnings([
  "DeprecationWarning",
  /experimental/i,
  /punycode/i,
  /legacy/i
]);

// All matching warnings will be suppressed
process.emitWarning("DeprecationWarning: punycode is deprecated");
process.emitWarning("Experimental feature detected");
process.emitWarning("Legacy API usage");
```

## Important Notes

- Shush modifies `process.emitWarning` temporarily. Make sure to call `restoreWarnings()` if you want to revert to the default behavior.
- Supports strings (case-insensitive substring match) and regular expressions.
- Works with Node.js warning messages passed as strings or Error objects.
- Use with caution in production environments - consider the implications of suppressing warnings.
