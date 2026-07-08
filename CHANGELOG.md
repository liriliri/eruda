## 3.5.1 (08 Jul 2026)

* chore: switch publish pipeline to npm trusted publishing with OIDC
* chore: commit package-lock.json and use npm ci in CI
* chore: bump CI node version to 22

## 3.5.0 (11 Jun 2026)

* feat(network): restructure detail view with General, Query Parameters, Payload, and Response Body sections
* feat(network): add configurable display options for Full Name and Full URL in request list
* refactor(network): extract detail rendering into modular helper functions
* chore: fork as @iulo/eruda

## 3.4.3 (15 Jun 2025)

* fix: redundant code imported

## 3.4.2 (15 Jun 2025)

* fix: elements horizontal scrollbar [#504](https://github.com/liriliri/eruda/issues/504)

## 3.4.1 (10 Nov 2024)

* fix: no copy and delete for shadow root
* fix: fetch remains pending when error occurs
* fix: theme not updated if system theme changed

## 3.4.0 (27 Sep 2024)

* feat: support shadow dom [#158](https://github.com/liriliri/eruda/issues/158)
* fix: quirks mode table rendering [#459](https://github.com/liriliri/eruda/issues/459)

## 3.3.0 (9 Sep 2024)

* feat: add vue devtools plugin

## 3.2.3 (10 AUG 2024)

* fix: WebSocket message base64 encoded [#447](https://github.com/liriliri/eruda/issues/447)

## 3.2.2 (8 AUG 2024)

* chore: update plugin versions

## 3.2.1 (20 JUL 2024)

* fix: touches plugin [#344](https://github.com/liriliri/eruda/issues/344)

## 3.2.0 (16 JUL 2024)

* feat: support inline mode
* feat: allow spaces in plugin name
* fix: some typescript d.ts mistakes
* chore: remove elements set api
* chore: update monitor plugin version

## 3.1.0 (9 JUL 2024)

* feat: add AMOLED theme [#414](https://github.com/liriliri/eruda/pull/414)
* feat: support system preference theme config
* feat: add isDarkTheme, getTheme util
* fix: backers.svg lazy loading [#407](https://github.com/liriliri/eruda/issues/407)

## 3.0.1 (18 JUL 2023)

* fix: can not print string with %o [#336](https://github.com/liriliri/eruda/issues/336)
* fix: mouse event on touch device [#302](https://github.com/liriliri/eruda/issues/302)
* fix: unable to remove snippets [#349](https://github.com/liriliri/eruda/issues/349)

## 3.0.0 (2 Apr 2023)

* feat: replace fps and memory with monitor plugin
* fix: resource stylesheet show failed
* chore: remove licia utils
* chore: separate polyfill

## 2.11.3 (3 Mar 2023)

* fix: scale [#307](https://github.com/liriliri/eruda/issues/307)

## 2.11.2 (28 Jan 2023)

* fix: check safe area error

## 2.11.1 (28 Jan 2023)

* fix: bottom safe area
* fix(console): filter function support
* fix: click event stop propagation [#155](https://github.com/liriliri/eruda/issues/155)
* fix: worker null error [#152](https://github.com/liriliri/eruda/issues/152)

## 2.11.0 (19 Jan 2023)

* feat(network): filter
* feat(info): add backers
* feat(settings): use luna setting
* feat(resources): use luna data grid
* feat(resources): copy storage, cookie
* fix(sources): code not selectable
* fix(console): filter api

## 2.10.0 (24 Dec 2022)

* feat(sources): use luna text viewer
* feat(elements): split mode
* feat(network): split mode
* fix(resources): delete cookie

## 2.9.1 (20 Dec 2022)

* fix(elements): select element using touch events

## 2.9.0 (20 Dec 2022)

* feat(elements): integrate dom viewer
* feat(elements): element crumbs
* feat(elements): copy node and delete node
* feat(network): copy response
* feat(network): toggle recording
* chore: remove dom plugin snippet

## 2.8.3 (13 Dec 2022)

* fix(network): remove data grid ios outline
* chore: update luna console and luna object viewer 

## 2.8.2 (12 Dec 2022)

* fix: some variables not reset when destroy

## 2.8.1 (12 Dec 2022)

* fix: remove luna syntax highlighter

## 2.8.0 (11 Dec 2022)

* feat(info): copy
* feat(sources): use luna syntax highlighter
* feat(network): use luna data grid
* feat(network): copy as curl [#220](https://github.com/liriliri/eruda/issues/220)
* fix(network): recognize JSON [#201](https://github.com/liriliri/eruda/issues/201)
* fix: init with shadow dom style error [#195](https://github.com/liriliri/eruda/issues/195)

## 2.7.4 (10 Dec 2022)

* fix: firefox document.body is null error [#293](https://github.com/liriliri/eruda/issues/293)

## 2.7.3 (8 Dec 2022)

* fix: remove tabs horizontal scrollbar [#236](https://github.com/liriliri/eruda/issues/236)

## 2.7.2 (7 Dec 2022)

* fix: luna modal style

## 2.7.1 (7 Dec 2022)

* fix: remove debug log

## 2.7.0 (7 Dec 2022)

* feat: drag to resize
* feat: update icons
* feat: use luna modal to replace browser prompt

## 2.6.2 (3 Dec 2022)

* feat: support android 5.0
* feat(sources): remove code beautify
* fix: code plugin theme

## 2.6.1 (26 Nov 2022)

* fix: dark mode scrollbar style
* fix: unable to load timing plugin

## 2.6.0 (25 Nov 2022)

* feat(console): select and copy
* chore: update luna console
* chore: update chobitsu

## 2.5.0 (9 Jul 2022)

* feat: add ts declaration [#187](https://github.com/liriliri/eruda/pull/187)
* refactor: use luna console
* refactor: use chobitsu for highlighting element

## 2.4.1 (28 Sep 2020)

* fix: remove arrow function [#160](https://github.com/liriliri/eruda/issues/160)

## 2.4.0 (14 Sep 2020)

* feat: default settings [#141](https://github.com/liriliri/eruda/issues/141)
* fix(elements): highlight
* fix(console): blinks frequently as it scroll to the border
* refactor: use chobitsu

## 2.3.3 (3 May 2020)

* fix: unsafe-eval CSP violation [#140](https://github.com/liriliri/eruda/issues/140)

## v2.3.2 (29 Apr 2020)

* fix(console): scroll performance

## v2.3.1 (28 Apr 2020)

* fix(elements): content highlight

## v2.3.0 (28 Apr 2020)

* feat: refresh notification
* fix(console): safari bounce effect
* fix(elements): highlight

## v2.2.2 (17 Apr 2020)

* fix(console): extra info from
* chore: update icons

## v2.2.1 (20 Mar 2020)

* fix: redundant evaluated style
* chore: use [luna-object-viewer](https://github.com/liriliri/luna) for viewing object

## v2.2.0 (9 Feb 2020)

* feat: use dark theme for dark mode
* feat(elements): computed style filter
* feat(resources): storage and cookie filter
* fix(snippet): error loading plugin for local page
* fix(console): unable to clear filter

## v2.1.0 (2 Feb 2020)

* feat: change navigation bar height
* feat: change default transparency to 1
* feat: change loaded plugin position
* feat(console): remove debug filter
* feat(console): improve input style
* feat(console): show filter text
* feat(network): add requests api [#132](https://github.com/liriliri/eruda/issues/132)

## v2.0.2 (9 Jan 2020)

* chore: reduce file size (452kb -> 418kb)

## v2.0.1 (6 Jan 2020)

* chore: update plugins

## v2.0.0 (3 Jan 2020)

* feat: theme support
* feat(console): $x utility
* feat(console): remove useWorker
* feat(sources): indent size configuration
* fix(console): url recognition
* fix(console): log style
* fix(sources): scrolling
* perf(console): large object expansion
* chore: reduce file size (472kb -> 452kb)

## v1.10.3 (8 Nov 2019)

* fix(info): escape location [#127](https://github.com/liriliri/eruda/issues/127)
* chore: update refresh icon
* chore: update timing plugin version

## v1.10.2 (5 Nov 2019)

* fix: must add .default if using require 

## v1.10.1 (4 Nov 2019)

* fix(console): error display when js execution disabled

## v1.10.0 (4 Nov 2019)

* chore: updated to babel7, must add .default if using require 
* feat(console): multiple console instance
* perf(console): rendering for a large number of logs

## v1.9.2 (1 Nov 2019)

* perf(console): rendering

## v1.9.1 (27 Oct 2019)

* perf(console): asynchronous log render
* perf(console): reduce memory usage, 50% drop

## v1.9.0 (20 Oct 2019)

* feat: add snippet for loading touches plugin
* feat: add fit screen snippet
* fix(console): filter shouldn't affect group

## v1.8.1 (14 Oct 2019)

* fix(network): style [#121](https://github.com/liriliri/eruda/issues/121)

## v1.8.0 (13 Oct 2019)

* feat(network): display optimization
* feat: move http view from sources to network
* fix(console): group object expansion

## v1.7.2 (11 Oct 2019)

* fix(console): blank bottom if js input is disabled
* chore: update eruda-dom version

## v1.7.1 (10 Oct 2019)

* fix: resize

## v1.7.0 (8 Oct 2019)

* feat: resize [#89](https://github.com/liriliri/eruda/issues/89)
* feat(console): replace help button with filter
* feat(console): disable js execution
* feat(console): [utilities api](https://developers.google.cn/web/tools/chrome-devtools/console/utilities)
* fix(console): disable log collapsing for group
* fix(elements): select not working for desktop

## v1.6.3 (1 Oct 2019)

* fix(console): log border style

## v1.6.2 (29 Sep 2019)

* fix: container style affected [#119](https://github.com/liriliri/eruda/issues/119)
* fix(console): log style, line-height should be normal

## v1.6.1 (27 Sep 2019)

* feat(network): catch fetch request headers
* feat(console): timeLog, countReset
* fix(console): clear not working
* fix(console): table

## v1.6.0 (26 Sep 2019)

* feat: console group
* fix: console style, width and height is forbidden
* fix: regexp json view
* chore: update fps and memory plugin version

## v1.5.8 (2 Aug 2019)

* fix: safeStorage undefined [#108](https://github.com/liriliri/eruda/issues/108)

## v1.5.7 (15 Jul 2019)

* Fix iOS max log number
* Disable calling init if already initialized
* Disable worker by default
* Support xhr blob response type [#104](https://github.com/liriliri/eruda/issues/100)

## v1.5.6 (17 Jun 2019)

* Disable log collapse for objects

## v1.5.5 (25 May 2019)

* Fix resources error when cookie has % [#100](https://github.com/liriliri/eruda/issues/100)
* Update dom plugin version

## v1.5.4 (23 Sep 2018)

* Fix network url start with //
* Smaller padding for logs

## v1.5.3 (2 Sep 2018)

* Add load dom plugin snippet
* Disable highlight for invisible elements
* Fix unexpected token \t in JSON
* Add load orientation plugin snippet

## v1.5.2 (23 Aug 2018)

* Fix console show in sources panel
* Fix log merge
* Support getting entryBtn instance
* Update timing plugin version
* Add remove setting api
* Fix safari merge log exception

## v1.5.1 (18 Aug 2018)

* Fix uglifyjs unicode escape [#69](https://github.com/liriliri/eruda/issues/69)
* Update icons, use [iconfont](http://www.iconfont.cn) instead of [icomoon](https://icomoon.io/)
* Show custom request headers [#78](https://github.com/liriliri/eruda/pull/78)
* Add get api to info panel [#83](https://github.com/liriliri/eruda/issues/83)
* Fix responseType json error [#82](https://github.com/liriliri/eruda/issues/82)
* Support console lazy evaluation

## v1.5.0 (19 Jun 2018)

* Use shadow dom to encapsulate css
* Enable sources copy [#71](https://github.com/liriliri/eruda/issues/71)
* Improve **borderAll** style
* Add **position** api [#74](https://github.com/liriliri/eruda/issues/74)
* Fix nav bottom bar wrong position when removed

## v1.4.4 (27 May 2018)

* Improve console line break display
* Add **rmCookie** util
* Add **Load Geolocation Plugin** snippet
* Fix Elements cssRules [#63](https://github.com/liriliri/eruda/issues/63)
* Support console events [#66](https://github.com/liriliri/eruda/issues/66)
* Fix Uc browser console worker [#62](https://github.com/liriliri/eruda/issues/62)

## v1.4.3 (7 Feb 2018)

* Dynamic info content support [#51](https://github.com/liriliri/eruda/issues/51)
* Fix console input covered by error log
* Add elements box model chart
* Fix source code white-space style [#53](https://github.com/liriliri/eruda/issues/53)
* Resources support iframe
* Add **Load Benchmark Plugin** snippet

## v1.4.2 (28 Jan 2018)

* Extract viewportScale util into [eris](https://github.com/liriliri/eris)
* Improve image list view using flex
* Add DevTools display event hooks [#50](https://github.com/liriliri/eruda/issues/50)

## v1.4.1 (13 Jan 2018)

* Update timing plugin version
* Fix viewportScale
* Optimize console performance for big data
* Expose snippets run api
* Delete desktop scrollbar style
* Add code plugin to snippets

## v1.4.0 (7 Jan 2018)

* Remove network timing into external plugin
* Add system info
* Add memory plugin snippet
* Monitor fetch requests [#24](https://github.com/liriliri/eruda/issues/24)
* Reduce json viewer click area
* Use resource timing for image capture

## v1.3.2 (14 Dec 2017)

* Fix restore settings snippet
* Extract *features* into an external plugin

## v1.3.1 (19 Nov 2017)

* Observe elements in resources panel
* Fix performance timing not supported [#40](https://github.com/liriliri/eruda/issues/40)

## v1.3.0 (5 Nov 2017)

* Remove log margin
* Fix css custom properties [#33](https://github.com/liriliri/eruda/issues/33)
* Add version info
* Change icomoon generated font name
* Improve snippets style
* Add *Load Fps Plugin* and *Restore Settings* snippets
* Support navbar color customization
* Support range in settings panel
* Support auto scale [#32](https://github.com/liriliri/eruda/issues/32)
* Improve *Border All* snippet
* Use high resolution time for console time

## v1.2.6 (31 Aug 2017)

* Fix catch global errors

## v1.2.5 (20 Aug 2017)

* Fix cookie URI malformed
* Fix single string argument unescaped
* Update util library and dependencies
* Fix catch event listeners [#31](https://github.com/liriliri/eruda/issues/31)
* Console log scroll automatically only at bottom
* Fix unformatted html tag

## v1.2.4 (1 Jul 2017)

* Fix uncaught promise error [#29](https://github.com/liriliri/eruda/issues/23)
* Fix bad classes [#28](https://github.com/liriliri/eruda/issues/23)

## v1.2.3 (15 May 2017)

* Disable modernizr classes
* Update eustia util
* Fix console resize [#23](https://github.com/liriliri/eruda/issues/23)
* Improve object log
* Use outline for borderAll snippet

## v1.2.2 (11 Mar 2017)

* Fix log url recognition
* Fix error log stack url and style
* Fix table log ouput
* Fix storage initialization [#20](https://github.com/liriliri/eruda/issues/20)
* Update eustia lib
* Elements auto refresh
* Add pc scrollbar style