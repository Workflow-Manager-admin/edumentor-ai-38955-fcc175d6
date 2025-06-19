/**
 * Script to extract selected exam and retrieve its official syllabus as structured JSON.
 * Usage: Run with Node.js within project root.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

const LOCALSTORAGE_PATH = path.join(
  __dirname,
  '../edumentor_ai_frontend/src/features/ExamContext.js'
);

function getCurrentExam() {
  // Try to read the current exam selection from localStorage (simulated: local json for automation)
  const browserStorage = path.join(
    __dirname,
    '../edumentor_ai_frontend/public/_localstorage_snapshot.json'
  );
  if (fs.existsSync(browserStorage)) {
    const d = JSON.parse(fs.readFileSync(browserStorage, 'utf-8'));
    return d._mapmyprep_exam_v1 || null;
  }
  // Fallback/none
  return null;
}

/**
 * Fetch syllabus for a given exam.
 * Supported: NEET, JEE (mains). Add more as needed - the fetch can be HTML-scrape or use static references.
 */
async function fetchSyllabus(exam) {
  if (!exam) throw new Error('No exam selected.');

  const normalized = String(exam).toUpperCase();

  if (normalized === 'NEET') {
    // Official source: https://neet.nta.nic.in/
    // We'll fetch from https://nta.ac.in/Download/Notice/Notice_20240102114929.pdf or credible 3rd-party with HTML syllabus
    return await fetchNeetSyllabus();
  } else if (normalized === 'JEE') {
    // Official source: https://jeemain.nta.nic.in/
    return await fetchJeeMainSyllabus();
  }
  throw new Error('Syllabus fetch not implemented for exam: ' + exam);
}

// -- NEET syllabus scraping (from BYJU'S public HTML)
async function fetchNeetSyllabus() {
  const url = 'https://byjus.com/neet/neet-syllabus/';
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        // Use cheerio to scrape relevant tables (Physics, Chemistry, Biology)
        const $ = cheerio.load(data);
        const subjects = ['Physics', 'Chemistry', 'Biology'];
        let result = [];
        subjects.forEach(subject => {
          let subjData = { subject, topics: [] };
          // Find table for subject
          $('h2,h3').each((_, el) => {
            const heading = $(el).text().trim();
            if (heading.toLowerCase().includes(subject.toLowerCase())) {
              // Next table after heading
              const table = $(el).nextAll('table').first();
              if (table && table.length) {
                table.find('tr').each((i, row) => {
                  const cols = $(row).find('td');
                  if (cols.length === 0) return;
                  // Each topic row: either as topic or topic + subtopics
                  const topic = $(cols[0]).text().trim();
                  if (!topic) return;
                  const sub = $(cols[1]) ? $(cols[1]).text().trim() : '';
                  let entry = { topic };
                  if (sub) entry.subtopics = sub.split(',').map(s => s.trim()).filter(Boolean);
                  subjData.topics.push(entry);
                });
              }
            }
          });
          if (subjData.topics.length > 0) result.push(subjData);
        });
        resolve(result);
      });
      res.on('error', err => reject(err));
    });
  });
}

// -- JEE Main syllabus scraping (from BYJU'S public HTML)
async function fetchJeeMainSyllabus() {
  const url = 'https://byjus.com/jee/jee-main-syllabus/';
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const $ = cheerio.load(data);
        const subjects = ['Physics', 'Chemistry', 'Mathematics'];
        let result = [];
        subjects.forEach(subject => {
          let subjData = { subject, topics: [] };
          // Find section/header for subject
          $('h2,h3').each((_, el) => {
            const heading = $(el).text().trim();
            if (heading.toLowerCase().includes(subject.toLowerCase())) {
              // Next table after heading
              const table = $(el).nextAll('table').first();
              if (table && table.length) {
                table.find('tr').each((i, row) => {
                  const cols = $(row).find('td');
                  if (cols.length === 0) return;
                  // Topic in first column, subtopics in second (may or may not be there)
                  const topic = $(cols[0]).text().trim();
                  if (!topic) return;
                  const sub = $(cols[1]) ? $(cols[1]).text().trim() : '';
                  let entry = { topic };
                  if (sub) entry.subtopics = sub.split(',').map(s => s.trim()).filter(Boolean);
                  subjData.topics.push(entry);
                });
              }
            }
          });
          if (subjData.topics.length > 0) result.push(subjData);
        });
        resolve(result);
      });
      res.on('error', err => reject(err));
    });
  });
}

// ---- Script runner ----
if (require.main === module) {
  (async () => {
    try {
      // You may extract from browser's localStorage, or for demo just ask for an exam:
      const selectedExam = process.argv[2] || getCurrentExam() || 'NEET';
      console.log('Selected Exam:', selectedExam);
      const syllabus = await fetchSyllabus(selectedExam);
      const jsonPath = path.join(__dirname, `./syllabus_${selectedExam.toLowerCase()}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(syllabus, null, 2), 'utf-8');
      console.log('Syllabus JSON written to', jsonPath);
      // Print a preview:
      console.log(JSON.stringify(syllabus, null, 2));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

module.exports = { fetchSyllabus };
