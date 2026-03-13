const fs = require('fs');
const HistoryPage = fs.readFileSync('components/HistoryPage.tsx', 'utf8');
const handleSaveStr = HistoryPage.substring(HistoryPage.indexOf('const handleSaveOfflineLog ='), HistoryPage.indexOf('};', HistoryPage.indexOf('const handleSaveOfflineLog =')) + 2);
console.log(handleSaveStr);
