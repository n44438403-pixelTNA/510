const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const testHtml = `
  <!DOCTYPE html>
  <html>
  <head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  </head>
  <body>
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); overflow: auto;">
        <div id="full-report-print-container" style="position: absolute; top: 0; left: 0; opacity: 0; pointer-events: none; z-index: -1000; width: 800px;">
            <div style="height: 2000px; padding: 20px; background: white; border: 2px solid blue;">
                <h1 style="color: blue;">This is a very long hidden report</h1>
                <p>It should not be cut off.</p>
                <div style="margin-top: 1500px; color: red;">End of report (Should be visible in PDF)</div>
            </div>
        </div>
        <div style="background: white; width: 600px; height: 400px; overflow-y: auto; position: relative;">
            <h1>Modal Title</h1>
            <p>This is what the user sees.</p>
            <button id="btn" style="position:relative; z-index: 1000; padding: 10px; cursor: pointer;">Download PDF</button>
        </div>
    </div>

    <script>
      window.pdfDataUri = null;
      document.getElementById('btn').addEventListener('click', async () => {
        try {
          const elementId = 'full-report-print-container';
          const element = document.getElementById(elementId);
          const originalStyle = element.getAttribute('style');

          element.style.position = 'absolute';
          element.style.top = '0';
          element.style.left = '0';
          element.style.opacity = '1';
          element.style.zIndex = '9999';
          element.style.width = '800px';
          element.style.background = 'white';

          const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true,
                windowWidth: 800,
                onclone: (clonedDoc) => {
                    const clonedEl = clonedDoc.getElementById(elementId);
                    if (clonedEl) {
                        clonedEl.style.opacity = '1';
                        clonedEl.style.display = 'block';
                        clonedEl.style.position = 'absolute'; // ensure it expands fully
                        clonedEl.style.top = '0';
                        clonedEl.style.left = '0';
                        clonedEl.style.height = 'max-content';
                        clonedEl.style.overflow = 'visible';
                        clonedEl.style.zIndex = '9999';

                        // Remove constraints from all parent elements
                        let parent = clonedEl.parentElement;
                        while (parent && parent !== clonedDoc.body) {
                            parent.style.position = 'static';
                            parent.style.overflow = 'visible';
                            parent.style.height = 'auto';
                            parent.style.maxHeight = 'none';
                            parent.style.transform = 'none';
                            parent = parent.parentElement;
                        }
                    }
                }
            });

          if (originalStyle) {
              element.setAttribute('style', originalStyle);
          } else {
              element.removeAttribute('style');
          }

          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const { jsPDF } = window.jspdf;
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

          window.pdfDataUri = pdf.output('datauristring');
        } catch (e) {
          console.error(e);
        }
      });
    </script>
  </body>
  </html>
  `;

  const testHtmlPath = path.join(__dirname, 'test_pdf_generate.html');
  fs.writeFileSync(testHtmlPath, testHtml);

  await page.goto('file://' + testHtmlPath);
  await page.click('#btn');

  // wait until window.pdfDataUri is populated
  const pdfData = await page.waitForFunction(() => window.pdfDataUri, { timeout: 10000 });
  const data = await pdfData.jsonValue();

  if (data) {
    const base64Data = data.split(',')[1];
    fs.writeFileSync('test_output.pdf', base64Data, 'base64');
    console.log('PDF saved successfully to test_output.pdf');
  } else {
    console.log('PDF generation failed');
  }

  await browser.close();
})();
