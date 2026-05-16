import { BootLoader } from './system/bootstrap/boot-loader.js'

const bootLoader = new BootLoader();
bootLoader.boot(document.querySelector('#root'));
window.bootLoader = bootLoader;