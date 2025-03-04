import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

// Set the worker source
GlobalWorkerOptions.workerSrc = pdfWorker;
export async function readFileContent(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (event) => {
			if (event.target && typeof event.target.result === "string") {
				resolve(event.target.result);
			} else if (event.target && event.target.result instanceof ArrayBuffer) {
				// Handle PDF text extraction
				const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
				try {
					const text = await extractTextFromPDF(pdfData);
					resolve(text);
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
			resolve(
				"Word document content extraction is limited in this demo. For best results, use text files."
			);
		} else {
			reader.readAsText(file);
		}
	});
}

// Function to extract text from a PDF
async function extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
	const pdf = await getDocument({ data: pdfData }).promise;
	let text = "";
	let totalSize = 0;

	console.log("Number of Pages", pdf.numPages);

	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const textContent = await page.getTextContent();
		const pageText =
			textContent.items.map((item) => (item as any).str).join(" ") + "\n";
		text += pageText;
		totalSize += new Blob([pageText]).size;
	}

	console.log("Total Size ", totalSize);

	return text.trim();
}
