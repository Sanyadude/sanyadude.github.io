import WindowsDesktopApplication from './components/windows-desktop-application.js'
import BrowserApplication from './window-applications/browser/browser-application.js'
import LibraryDisplayApplication from './window-applications/library-display/library-display-application.js'
import PaintApplication from './window-applications/paint/paint-application.js'
import GalleryApplication from './window-applications/gallery/gallery-application.js'

const rootElement = document.querySelector('#root');
const app = new WindowsDesktopApplication(rootElement);

const browser = new BrowserApplication();
app.installApplication(browser);

app.addApplicationShortcut(browser.id, browser.appName, (process) => {
    process.applicationWindow.start();
    process.applicationWindow.goToHome();
});

const gallery = new GalleryApplication();
app.installApplication(gallery);

app.addApplicationShortcut(gallery.id, gallery.appName, (process) => {
    process.applicationWindow.start();
});

const paint = new PaintApplication();
app.installApplication(paint);

app.addApplicationShortcut(paint.id, paint.appName, (process) => {
    process.applicationWindow.start();
});

const libraryDisplay = new LibraryDisplayApplication();
app.installApplication(libraryDisplay);

app.addApplicationShortcut(libraryDisplay.id, libraryDisplay.appName, (process) => {
    process.applicationWindow.start();
});

app.addShortcut({
    name: 'Open Sanyadude Pixel Simulation',
    iconImage: browser.icon,
    action: () => {
        const PIXEL_SIMULATION_URL = 'https://sanyadude.github.io/pixel-simulation/index.html';
        window.open(PIXEL_SIMULATION_URL);
    }
});

export default app