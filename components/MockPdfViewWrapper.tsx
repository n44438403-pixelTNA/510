import React, { useEffect, useState } from 'react';
import { PdfView } from './PdfView';

export const MockPdfViewWrapper = () => {
    const mockChapter = { id: 'chap1', title: 'Chapter 1' };
    const mockSubject = { id: 'subj1', name: 'Subject 1' };
    const mockUser = { id: 'user1', name: 'Test User', role: 'STUDENT', credits: 100, isPremium: true, subscriptionEndDate: '2099-12-31', subscriptionTier: 'LIFETIME' };

    // Inject mock data into localStorage for PdfView to fetch
    const mockData = {
        schoolDeepDiveEntries: [
            {
                title: "Deep Dive 1",
                htmlContent: `
                <h2>अर्थव्यवस्था का अर्थ और संरचना (Meaning and Structure of Economy)</h2>
                <p>Some intro text</p>
                <p>&gt;🔁 Recap</p>
                <ul>
                  <li>This is the first recap point.</li>
                  <li>This is the second recap point.</li>
                </ul>
                <p>quick revision</p>
                <p>This is a quick revision point.</p>
                `
            }
        ]
    };

    useEffect(() => {
        localStorage.setItem('nst_content_BOARD_10_Subject 1_chap1', JSON.stringify(mockData));
    }, []);

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <PdfView
                chapter={mockChapter as any}
                subject={mockSubject as any}
                user={mockUser as any}
                board="BOARD"
                classLevel="10"
                stream={null}
                onBack={() => {}}
                onUpdateUser={() => {}}
                settings={{ defaultPdfCost: 0, appName: 'Mock App' } as any}
            />
        </div>
    );
};
