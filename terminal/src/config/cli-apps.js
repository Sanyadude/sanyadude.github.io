import { Find } from '../cli-application/find/find.js'
import { ChangeDirectory } from '../cli-application/change-directory/change-directory.js'
import { Copy } from '../cli-application/copy/copy.js'
import { Move } from '../cli-application/move/move.js'
import { MakeDirectory } from '../cli-application/make-directory/make-directory.js'
import { Directory } from '../cli-application/directory/directory.js'
import { DeleteFile } from '../cli-application/delete-file/delete-file.js'
import { RemoveDirectory } from '../cli-application/remove-directory/remove-directory.js'
import { Type } from '../cli-application/type/type.js'
import { Head } from '../cli-application/head/head.js'
import { Tail } from '../cli-application/tail/tail.js'
import { Uniq } from '../cli-application/uniq/uniq.js'
import { Sort } from '../cli-application/sort/sort.js'
import { Download } from '../cli-application/download/download.js'
import { Calculator } from '../cli-application/calculator/calculator.js'
import { Cowsay } from '../cli-application/cowsay/cowsay.js'
import { Echo } from '../cli-application/echo/echo.js'
import { JSRuntime } from '../cli-application/js-runtime/js-runtime.js'
import { Lipsum } from '../cli-application/lipsum/lipsum.js'
import { Lolcat } from '../cli-application/lolcat/lolcat.js'
import { Figlet } from '../cli-application/figlet/figlet.js'
import { Toilet } from '../cli-application/figlet/toilet.js'
import { Weather } from '../cli-application/weather/weather.js'
import { Zip } from '../cli-application/zip/zip.js'
import { TestRunner } from '../cli-application/test-runner/test-runner.js'
import { Column } from '../cli-application/column/column.js'
import { Fortune } from '../cli-application/fortune/fortune.js'
import { DateInfo } from '../cli-application/date-info/date-info.js'
import { Whoami } from '../cli-application/whoami/whoami.js'
import { Hostname } from '../cli-application/hostname/hostname.js'
import { Uptime } from '../cli-application/uptime/uptime.js'
import { Help } from '../cli-application/help/help.js'
import { Alias } from '../cli-application/alias/alias.js'
import { Declare } from '../cli-application/declare/declare.js'

export const CLI_APPS = Object.freeze({
    changeDirectory: new ChangeDirectory(),
    directory: new Directory(),
    find: new Find(),
    copy: new Copy(),
    move: new Move(),
    type: new Type(),
    head: new Head(),
    tail: new Tail(),
    uniq: new Uniq(),
    sort: new Sort(),
    makeDirectory: new MakeDirectory(),
    removeDirectory: new RemoveDirectory(),
    deleteFile: new DeleteFile(),
    download: new Download(),
    calculator: new Calculator(),
    cowsay: new Cowsay(),
    echo: new Echo(),
    jsRuntime: new JSRuntime(),
    lipsum: new Lipsum(),
    lolcat: new Lolcat(),
    figlet: new Figlet(),
    toilet: new Toilet(),
    weather: new Weather(),
    zip: new Zip(),
    testRunner: new TestRunner(),
    column: new Column(),
    fortune: new Fortune(),
    dateInfo: new DateInfo(),
    whoami: new Whoami(),
    hostname: new Hostname(),
    uptime: new Uptime(),
    help: new Help(),
    alias: new Alias(),
    declare: new Declare(),
});

export default CLI_APPS