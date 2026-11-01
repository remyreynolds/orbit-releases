'use strict';
// Download links point at the newest GitHub release. Installer file names are fixed in
// package.json (build.*.artifactName), so "latest/download/<name>" always gets the current version.
const RELEASES = 'https://github.com/remyreynolds/orbit-releases/releases';
const FILES = {
  'mac-arm64': 'Orbit-mac-arm64.dmg',
  'mac-x64': 'Orbit-mac-x64.dmg',
  'win-x64': 'Orbit-windows-x64-setup.exe',
};
const link = key => `${RELEASES}/latest/download/${FILES[key]}`;
document.querySelectorAll('[data-dl]').forEach(a => { a.href = link(a.dataset.dl); });

// Show the right download first.
const ua = navigator.userAgent, isWin = /Windows/.test(ua), isMac = /Macintosh|Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua);
const hero = document.getElementById('hero-dl'), other = document.getElementById('hero-other');
if (isMac) {
  hero.href = link('mac-arm64'); hero.textContent = 'Download for Mac';
  other.innerHTML = 'Apple Silicon · <a href="' + link('mac-x64') + '">Intel Mac</a> · <a href="#download">Windows</a>';
  document.getElementById('dl-mac').classList.add('mine');
} else if (isWin) {
  hero.href = link('win-x64'); hero.textContent = 'Download for Windows';
  other.innerHTML = 'Windows 10 and 11 · <a href="#download">Mac</a>';
  document.getElementById('dl-win').classList.add('mine');
} else {
  other.textContent = 'Orbit runs on Mac and Windows computers.';
}

// Full-desktop slideshow.
const frames = [...document.querySelectorAll('.frame')], dots = [...document.querySelectorAll('#dots button')];
let current = 0, timer = 0;
function showFrame(i) {
  current = (i + frames.length) % frames.length;
  frames.forEach((f, n) => f.classList.toggle('on', n === current));
  dots.forEach((d, n) => { d.classList.toggle('on', n === current); d.setAttribute('aria-selected', n === current); });
  clearTimeout(timer); timer = setTimeout(() => showFrame(current + 1), 6500);
}
dots.forEach((d, i) => d.addEventListener('click', () => showFrame(i)));
showFrame(0);

// Dashboard tour.
const TEXT = {
  home: 'Your next move, front and center, with a live countdown. Around it, widgets in Apple-style sizes that snap into place when you drag them. Only the services you’ve connected show up.',
  tasks: 'Every task from every source in one Reminders-style list. Sorted by priority and due date, color dots instead of exclamation marks. Type “Essay draft fri 11pm” and Orbit sets the date.',
  school: 'Canvas assignments, missing work, recent grades and teacher announcements, per course. Sign in with your school login, two-factor included.',
  calendar: 'A month view with your events and due dates together, and an agenda of what’s coming up. Works with Google, Outlook, iCloud and any iCal link.',
  inbox: 'Texts, email, events and tasks in one list, ranked by what needs you now, with the reason for each. Click one to open it in Messages or your own mail app.',
  controls: 'Pick a wallpaper, upload your own, pause the motion, dim at night, run a 25-minute focus timer and launch your favorite apps.',
  connect: 'Add the accounts you want in a couple of clicks. Each one syncs on its own schedule and shows its status, so you always know what’s current.',
};
const shot = document.getElementById('shot'), text = document.getElementById('tab-text');
function tab(name) {
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.shot === name));
  shot.style.opacity = 0;
  setTimeout(() => { shot.src = `img/panel-${name}.webp`; shot.alt = `Orbit dashboard, ${name} tab`; shot.onload = () => { shot.style.opacity = 1; }; }, 150);
  text.textContent = TEXT[name];
}
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => tab(b.dataset.shot)));
text.textContent = TEXT.home;
['tasks', 'school', 'calendar', 'inbox', 'controls', 'connect'].forEach(n => { const i = new Image(); i.src = `img/panel-${n}.webp`; });
