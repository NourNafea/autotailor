import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';

const execAsync = promisify(exec);

export async function compileLatexToPDF(texFilePath: string): Promise<string> {
  const directory = path.dirname(texFilePath);
  const filename = path.basename(texFilePath, '.tex');
  const pdfPath = path.join(directory, `${filename}.pdf`);

  // Try pdflatex first
  try {
    const command = `pdflatex -interaction=nonstopmode -output-directory="${directory}" "${texFilePath}"`;

    // Run twice to resolve references (pdflatex may return non-zero even on success due to warnings)
    try {
      await execAsync(command);
      await execAsync(command);
    } catch (pdflatexError) {
      // Ignore pdflatex errors if PDF was created successfully
      console.log('pdflatex returned error, checking if PDF was created...');
    }

    // Check if PDF was created
    if (await fs.pathExists(pdfPath)) {
      console.log('PDF created successfully with pdflatex');
      // Clean up auxiliary files
      const auxFiles = [
        path.join(directory, `${filename}.aux`),
        path.join(directory, `${filename}.log`),
        path.join(directory, `${filename}.out`),
      ];

      for (const auxFile of auxFiles) {
        if (await fs.pathExists(auxFile)) {
          await fs.remove(auxFile);
        }
      }

      return pdfPath;
    }
  } catch (error) {
    console.log('pdflatex failed, trying latexmk...');
  }

  // Try latexmk as fallback
  try {
    const latexmkCommand = `latexmk -pdf -interaction=nonstopmode -output-directory="${directory}" "${texFilePath}"`;
    await execAsync(latexmkCommand);

    if (await fs.pathExists(pdfPath)) {
      console.log('PDF created successfully with latexmk');
      // Clean up with latexmk
      try {
        await execAsync(`latexmk -c -output-directory="${directory}"`);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      return pdfPath;
    }
  } catch (latexmkError) {
    console.error('latexmk also failed');
  }

  // Final check - if PDF exists, return it even if there were errors
  if (await fs.pathExists(pdfPath)) {
    console.log('PDF exists despite errors, returning path');
    return pdfPath;
  }

  throw new Error('PDF compilation failed - output file not created');
}
