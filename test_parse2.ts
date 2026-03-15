import { JSDOM } from 'jsdom';

const html = `
<h2>अर्थव्यवस्था का अर्थ और संरचना (Meaning and Structure of Economy)</h2>
<p>Some text</p>
<p>&gt;🔁 Recap</p>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
</ul>
<p>quick revision</p>
<p>Point 3</p>
`;

const dom = new JSDOM(html);
const document = dom.window.document;

function extract(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const currentTopicPoints = [];

    const walker = document.createTreeWalker(tempDiv, 1, {
        acceptNode: (node) => {
            const tag = node.tagName.toLowerCase();
            if (['p', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                return 1;
            }
            return 2;
        }
    });

    let currentNode = walker.nextNode();
    while (currentNode) {
        const text = currentNode.textContent || '';
        const lowerText = text.toLowerCase();

        const triggerRegex = /(quick revision|mini revision|recap|summary|key points|महत्वपूर्ण बिंदु|सार|संशोधन|तथ्य|topic quick recap)/i;
        if (triggerRegex.test(lowerText)) {
            const match = lowerText.match(triggerRegex);
            const prefix = match ? match[1].replace(/\b\w/g, c => c.toUpperCase()) : 'Revision';

            if (/^h[1-6]$/.test(currentNode.tagName.toLowerCase())) {
                // H1-H6 handled
            } else {
                const cleanHtml = currentNode.innerHTML.trim();
                const replaceRegex = new RegExp(`(?:<b>|<strong>)?\\s*[\\u2700-\\u27BF\\uE000-\\uF8FF\\u2011-\\u26FF\\>\\s]*(${triggerRegex.source})[\\u2700-\\u27BF\\uE000-\\uF8FF\\u2011-\\u26FF\\>\\s]*:?\\s*(?:<\\/b>|<\\/strong>)?`, 'gi');
                let strippedHtml = cleanHtml.replace(replaceRegex, '').trim();
                strippedHtml = strippedHtml.replace(/^[>\s🔁🔄📌💡📝]+/, '').trim();
                strippedHtml = strippedHtml.replace(/^&gt;/, '').trim();

                if (strippedHtml && strippedHtml.length > 5) {
                     currentTopicPoints.push(`<b>${prefix}:</b> ${strippedHtml}`);
                } else if (strippedHtml.length <= 5) {
                    // This is the bug. The paragraph just says ">🔁 Recap".
                    // We need to look at the NEXT sibling to find the actual list or content!
                    let nextSibling = currentNode.nextElementSibling;
                    while (nextSibling && !['p', 'ul', 'ol', 'div', 'blockquote'].includes(nextSibling.tagName.toLowerCase())) {
                        nextSibling = nextSibling.nextElementSibling;
                    }
                    if (nextSibling) {
                        if (['ul', 'ol'].includes(nextSibling.tagName.toLowerCase())) {
                            const listItems = Array.from(nextSibling.querySelectorAll('li'));
                            listItems.forEach(li => {
                                const cleanLiHtml = li.innerHTML.trim();
                                if (cleanLiHtml) {
                                    currentTopicPoints.push(`<b>${prefix}:</b> ${cleanLiHtml}`);
                                }
                            });
                        } else {
                            const cleanBlockHtml = nextSibling.innerHTML.trim();
                            if (cleanBlockHtml) {
                                currentTopicPoints.push(`<b>${prefix}:</b> ${cleanBlockHtml}`);
                            }
                        }
                    }
                }
            }
        }
        currentNode = walker.nextNode();
    }
    return currentTopicPoints;
}

console.log(extract(html));
