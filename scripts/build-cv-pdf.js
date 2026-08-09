#!/usr/bin/env node
/**
 * Render public/cv.pdf from the same JSON the site reads.
 *
 * The PDF is a build artifact, never committed: keeping one source of truth is
 * the whole point, and a checked-in binary drifts from the data behind it.
 * Chrome does the rendering, so this runs on a machine with a browser (a dev
 * machine or the CI runner), not inside the node:alpine build stage.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const experience = require('../src/data/experience.json');
const skills = require('../src/data/skills.json');
const education = require('../src/data/education.json');
const contact = require('../src/data/contact.json');

const OUTPUT = path.resolve(__dirname, '../public/cv.pdf');

const CHROME_CANDIDATES = [
	process.env.CHROME_PATH,
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome-stable',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium-browser',
	'/usr/bin/chromium',
].filter(Boolean);

/**
 * Locate a Chrome binary able to print to PDF.
 * @returns {string} Path to the executable
 */
function findChrome() {
	const found = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));

	if (!found) {
		throw new Error(
			`No Chrome binary found. Set CHROME_PATH, or install Chrome. Looked in:\n  ${CHROME_CANDIDATES.join('\n  ')}`
		);
	}

	return found;
}

/**
 * Escape a value for inclusion in the generated HTML.
 * @param {string} value - Raw value
 * @returns {string}
 */
function escapeHtml(value) {
	return String(value).replace(
		/[&<>"']/g,
		(char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
	);
}

/**
 * Render "2024-10" as "Oct 2024".
 * @param {string|null} value - Month in YYYY-MM form
 * @returns {string}
 */
function formatMonth(value) {
	if (!value) return '';

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	const [year, month] = value.split('-');

	return `${months[Number(month) - 1]} ${year}`;
}

/**
 * Render one position's date range.
 * @param {Object} position - Position entry
 * @returns {string}
 */
function formatPeriod(position) {
	const end = position.current ? 'present' : formatMonth(position.period.end);
	return `${formatMonth(position.period.start)} — ${end}`;
}

function renderContacts() {
	return contact.contacts
		.map((entry) => `<a href="${escapeHtml(entry.link)}">${escapeHtml(entry.value)}</a>`)
		.join('<span class="sep">·</span>');
}

function renderExperience() {
	// Most recent first: a reader scanning a CV starts at the current role.
	return [...experience.positions]
		.reverse()
		.map(
			(position) => `
        <div class="row">
          <div class="period">${escapeHtml(formatPeriod(position))}</div>
          <div class="detail">
            <div class="title">${escapeHtml(position.title)}</div>
          </div>
        </div>`
		)
		.join('');
}

function renderSkills() {
	return skills.categories
		.map((category) => {
			const list = category.skills
				.map((skill) => {
					const years = skill.years ? ` <span class="muted">(${skill.years}y)</span>` : '';
					return `<li>${escapeHtml(skill.name)}${years}</li>`;
				})
				.join('');

			return `
        <div class="row">
          <div class="period">${escapeHtml(category.name)}</div>
          <div class="detail"><ul class="skills">${list}</ul></div>
        </div>`;
		})
		.join('');
}

function renderEducation() {
	const degrees = (education.degrees || [])
		.map(
			(degree) => `
        <div class="row">
          <div class="period">${escapeHtml(
						`${formatMonth(degree.period.start)} — ${formatMonth(degree.period.end)}`
					)}</div>
          <div class="detail">
            <div class="title">${escapeHtml(degree.degree)}</div>
            <div class="muted">${escapeHtml(degree.institution)}${
							degree.field ? `, ${escapeHtml(degree.field)}` : ''
						}</div>
          </div>
        </div>`
		)
		.join('');

	// Credential ids are deliberately left out: the data carries a placeholder.
	const certifications = (education.certifications || [])
		.map(
			(cert) => `
        <div class="row">
          <div class="period">${escapeHtml(formatMonth(cert.date))}</div>
          <div class="detail">
            <div class="title">${escapeHtml(cert.name)}</div>
            <div class="muted">${escapeHtml(cert.issuer)}</div>
          </div>
        </div>`
		)
		.join('');

	return { degrees, certifications };
}

function renderHtml() {
	const { degrees, certifications } = renderEducation();

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sergey Paramoshkin — CV</title>
<style>
  @page { size: A4; margin: 16mm 15mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.5;
    color: #16181d;
  }
  a { color: #1f5fbf; text-decoration: none; }
  h1 { font-size: 22pt; margin: 0; letter-spacing: -0.4pt; }
  .role { font-size: 12pt; color: #3d4450; margin-top: 2pt; }
  .contacts { margin-top: 8pt; font-size: 9.5pt; }
  .sep { color: #9aa1ad; margin: 0 6pt; }
  h2 {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 1pt;
    color: #6b7280;
    border-bottom: 0.6pt solid #d6dae1;
    padding-bottom: 3pt;
    margin: 18pt 0 9pt;
  }
  .row { display: flex; gap: 12pt; margin-bottom: 7pt; page-break-inside: avoid; }
  .period { flex: 0 0 34%; color: #6b7280; font-size: 9.5pt; padding-top: 0.5pt; }
  .detail { flex: 1; }
  .title { font-weight: 600; }
  .muted { color: #6b7280; font-size: 9.5pt; }
  ul.skills { margin: 0; padding: 0; list-style: none; }
  ul.skills li { display: inline; }
  ul.skills li:not(:last-child)::after { content: ' · '; color: #9aa1ad; }
  footer { margin-top: 20pt; font-size: 8.5pt; color: #9aa1ad; }
</style>
</head>
<body>
  <header>
    <h1>Sergey Paramoshkin</h1>
    <div class="role">Technical Lead &amp; DevOps Engineer</div>
    <div class="contacts">${renderContacts()}</div>
  </header>

  <h2>Experience</h2>
  ${renderExperience()}

  <h2>Skills</h2>
  ${renderSkills()}

  <h2>Education</h2>
  ${degrees}
  ${certifications ? `<h2>Certifications</h2>${certifications}` : ''}

  <footer>Generated from cv.psvpro.ru</footer>
</body>
</html>`;
}

function main() {
	const chrome = findChrome();
	const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-pdf-'));
	const htmlPath = path.join(tmpDir, 'cv.html');

	fs.writeFileSync(htmlPath, renderHtml());
	fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

	try {
		execFileSync(
			chrome,
			[
				'--headless',
				'--disable-gpu',
				'--no-sandbox',
				'--no-pdf-header-footer',
				`--print-to-pdf=${OUTPUT}`,
				`file://${htmlPath}`,
			],
			{ stdio: 'pipe' }
		);
	} finally {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	}

	if (!fs.existsSync(OUTPUT)) {
		throw new Error('Chrome exited without writing a PDF');
	}

	const kb = (fs.statSync(OUTPUT).size / 1024).toFixed(1);
	console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)} (${kb} KB) using ${chrome}`);
}

main();
