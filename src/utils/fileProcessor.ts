
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

// Set the worker source
GlobalWorkerOptions.workerSrc = pdfWorker;

export interface FileProcessingResult {
	content: string;
	characterCount: number;
}

export async function readFileContent(file: File): Promise<FileProcessingResult> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (event) => {
			if (event.target && typeof event.target.result === "string") {
				const content = event.target.result;
				resolve({
					content,
					characterCount: content.length
				});
			} else if (event.target && event.target.result instanceof ArrayBuffer) {
				// Handle PDF text extraction
				const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
				try {
					const result = await extractTextFromPDF(pdfData);
					resolve({
						content: result.text,
						characterCount: result.characterCount
					});
				} catch (error) {
					reject(new Error(`Failed to extract text from PDF error ${error}`));
				}
			} else {
				reject(new Error("Failed to read file content"));
			}
		};

		reader.onerror = () => {
			reject(new Error("Error reading file"));
		};

		if (file.type === "application/pdf") {
			reader.readAsArrayBuffer(file);
		} else if (
			file.type ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
			file.type === "application/msword"
		) {
			resolve({
				content: "Word document content extraction is limited in this demo. For best results, use text files.",
				characterCount: 100 // Default character count for Word documents
			});
		} else {
			reader.readAsText(file);
		}
	});
}

// Function to extract text from a PDF with character count
async function extractTextFromPDF(pdfData: Uint8Array): Promise<{ text: string; characterCount: number }> {
	const pdf = await getDocument({ data: pdfData }).promise;
	let text = "";
	let characterCount = 0;

	console.log("Number of Pages", pdf.numPages);

	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const textContent = await page.getTextContent();
		const pageText =
			textContent.items.map((item) => (item as any).str).join(" ") + "\n";
		text += pageText;
		characterCount += pageText.length;
	}

	console.log("Total Character Count: ", characterCount);

	return { text: text.trim(), characterCount };
}
