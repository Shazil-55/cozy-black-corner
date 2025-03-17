
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { Socket } from "socket.io-client";

// Set the worker source
GlobalWorkerOptions.workerSrc = pdfWorker;

export interface FileProcessingResult {
	content: string;
	characterCount: number;
}

export async function readFileContent(file: File, socket?: Socket): Promise<FileProcessingResult> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (event) => {
			if (event.target && typeof event.target.result === "string") {
				const content = event.target.result;
				
				if (socket) {
					socket.emit('progress', {
						progress: '100%',
						status: 'completed',
						message: 'File processing completed'
					});
				}
				
				resolve({
					content,
					characterCount: content.length
				});
			} else if (event.target && event.target.result instanceof ArrayBuffer) {
				// Handle PDF text extraction
				const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
				try {
					// Emit starting status if socket available
					if (socket) {
						socket.emit('progress', {
							progress: '0%',
							status: 'starting',
							message: 'Starting PDF extraction'
						});
					}
					
					const result = await extractTextFromPDF(pdfData, socket);
					
					if (socket) {
						socket.emit('progress', {
							progress: '100%',
							status: 'completed',
							message: 'PDF extraction completed'
						});
					}
					
					resolve({
						content: result.text,
						characterCount: result.characterCount
					});
				} catch (error) {
					if (socket) {
						socket.emit('progress', {
							progress: '0%',
							status: 'error',
							message: `Failed to extract text: ${error}`
						});
					}
					
					reject(new Error(`Failed to extract text from PDF error ${error}`));
				}
			} else {
				if (socket) {
					socket.emit('progress', {
						progress: '0%',
						status: 'error',
						message: 'Failed to read file content'
					});
				}
				
				reject(new Error("Failed to read file content"));
			}
		};

		reader.onerror = () => {
			if (socket) {
				socket.emit('progress', {
					progress: '0%',
					status: 'error',
					message: 'Error reading file'
				});
			}
			
			reject(new Error("Error reading file"));
		};

		if (file.type === "application/pdf") {
			if (socket) {
				socket.emit('progress', {
					progress: '0%',
					status: 'starting',
					message: 'Reading PDF file'
				});
			}
			
			reader.readAsArrayBuffer(file);
		} else if (
			file.type ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
			file.type === "application/msword"
		) {
			if (socket) {
				socket.emit('progress', {
					progress: '100%',
					status: 'completed',
					message: 'Word document processed'
				});
			}
			
			resolve({
				content: "Word document content extraction is limited in this demo. For best results, use text files.",
				characterCount: 100 // Default character count for Word documents
			});
		} else {
			if (socket) {
				socket.emit('progress', {
					progress: '0%',
					status: 'starting',
					message: 'Reading text file'
				});
			}
			
			reader.readAsText(file);
		}
	});
}

// Function to extract text from a PDF with character count
async function extractTextFromPDF(
	pdfData: Uint8Array, 
	socket?: Socket
): Promise<{ text: string; characterCount: number }> {
	const pdf = await getDocument({ data: pdfData }).promise;
	let text = "";
	let characterCount = 0;

	console.log("Number of Pages", pdf.numPages);

	for (let i = 1; i <= pdf.numPages; i++) {
		// Update progress if socket is available
		if (socket) {
			const progressPercent = Math.round((i / pdf.numPages) * 100);
			socket.emit('progress', {
				progress: `${progressPercent}%`,
				status: 'processing',
				message: `Extracting page ${i} of ${pdf.numPages}`
			});
		}
		
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
