# mapmyprep

> NOTE: Diagnosing root cause of "Cannot GET /api/syllabus"
- Project appears to contain only frontend (React) and utility scripts, with no backend (Express or similar) present to provide the /api/syllabus endpoint. This causes all frontend fetches to /api/syllabus to fail with "Cannot GET /api/syllabus".
- A backend service (e.g. simple Express server) needs to be added to implement this endpoint, proxying to the utility script or re-using the syllabus fetch logic from `utils/fetch_exam_syllabus.js`.