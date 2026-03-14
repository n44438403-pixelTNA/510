
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadAsPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        // Prepare element for better capture
        const originalStyle = element.getAttribute('style');

        // Temporarily make it visible and absolute positioned to capture everything
        element.style.position = 'absolute';
        element.style.top = '0';
        element.style.left = '0';
        element.style.opacity = '1';
        element.style.zIndex = '9999';
        element.style.width = '800px'; // Set a fixed width for consistent rendering
        element.style.background = 'white'; // Ensure background is white

        // If it's a hidden print container, we might need to attach it to the body temporarily
        // or ensure its parents aren't display:none. The print container in MarksheetCard is
        // already attached but opacity 0.

        const canvas = await html2canvas(element, {
            scale: 2, // High quality
            useCORS: true, // Allow cross-origin images (like external logos)
            logging: false,
            windowWidth: 800,
            onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById(elementId);
                if (clonedEl) {
                    clonedEl.style.opacity = '1';
                    clonedEl.style.display = 'block';
                    clonedEl.style.position = 'static'; // reset in clone
                }
            }
        });

        // Restore original styles
        if (originalStyle) {
            element.setAttribute('style', originalStyle);
        } else {
            element.removeAttribute('style');
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let position = 0;
        let pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        position -= pageHeight;

        // Handle multiple pages if content exceeds A4 height
        while (position > -pdfHeight) {
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
            position -= pageHeight;
        }

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
};

export const downloadAsMHTML = async (elementId: string, filename: string) => {
    // Keep this for backward compatibility or replace it entirely with PDF
    await downloadAsPDF(elementId, filename);
};
