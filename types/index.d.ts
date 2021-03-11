/**
 * Type definitions for Eruda
 * @see https://github.com/liriliri/eruda
 */
declare module 'eruda' {
  export interface InitDefaults {
    /**
     * Transparency, 0 to 1
     */
    transparency?: number
    /**
     * Display size, 0 to 100
     */
    displaySize?: number
    /**
     * Theme, defaults to Light or Dark in dark mode
     */
    theme?: string
  }

  export interface InitOptions {
    /**
     * Container element. If not set, it will append an element directly under html root element
     */
    container?: HTMLElement
    /**
     * Choose which default tools you want, by default all will be added
     */
    tool?: string[]
    /**
     * Auto scale eruda for different viewport settings
     */
    autoScale?: boolean
    /**
     * Use shadow dom for css encapsulation
     */
    useShadowDom?: boolean
    /**
     * Default settings
     */
    defaults?: InitDefaults
  }

  export interface Position {
    x: number
    y: number
  }

  export interface Emitter {}

  /**
   * Eruda Plugin
   * @see https://github.com/liriliri/eruda/blob/master/doc/PLUGIN.md
   */
  export interface Tool {
    /**
     * Every plugin must have a unique name, which will be shown as the tab name on the top.
     */
    name: string
    /**
     * Called when plugin is added, and a document element used to display content is passed in.
     * The element is wrapped as a jQuery like object, provided by the licia utility library.
     */
    init(el: unknown): void
    /**
     * Called when switch to the panel. Usually all you need to do is to show the container element.
     */
    show(): Tool | undefined
    /**
     * Called when switch to other panel. You should at least hide the container element here.
     */
    hide(): Tool | undefined
    /**
     * Called when plugin is removed using `eruda.remove('plugin name')`.
     */
    destroy(): void
  }

  export interface ToolConstructor {
    new (): Tool
    readonly prototype: Tool

    extend(tool: Tool): ToolConstructor
  }

  export interface ConsoleConfig {
    /**
     * Asynchronous rendering
     */
    asyncRender?: boolean
    /**
     * Enable JavaScript execution
     */
    jsExecution?: boolean
    /**
     * Catch global errors
     */
    catchGlobalErr?: boolean
    /**
     * Override console
     */
    overrideConsole?: boolean
    /**
     * Display extra information
     */
    displayExtraInfo?: boolean
    /**
     * Display unenumerable properties
     */
    displayUnenumerable?: boolean
    /**
     * Access getter value
     */
    displayGetterVal?: boolean
    /**
     * Stringify object when clicked
     */
    lazyEvaluation?: boolean
    /**
     * Auto display if error occurs
     */
    displayIfErr?: boolean
    /**
     * Max log number
     */
    maxLogNum?: string
  }

  export interface Log {
    type: string
  }

  export interface ErudaConsole extends Tool, Console {
    config: {
      set<K extends keyof ConsoleConfig>(name: K, value: ConsoleConfig[K]): void
    }
    /**
     * Custom filter
     */
    filter(pattern: string | RegExp | ((log: Log) => boolean)): void
    /**
     * Html string
     */
    html(htmlStr: string): void
  }

  export interface ErudaConsoleConstructor {
    new (): ErudaConsole
    readonly prototype: ErudaConsole
  }

  export interface ElementsConfig {
    /**
     * Catch Event Listeners
     */
    overrideEventTarget?: boolean
    /**
     * Auto Refresh
     */
    observeElement?: boolean
  }

  export interface Elements extends Tool {
    set<K extends keyof ElementsConfig>(name: K, value: ElementsConfig[K]): void
    /**
     * Element to display
     */
    html(el: HTMLElement): void
  }

  export interface ElementsConstructor {
    new (): Elements
    readonly prototype: Elements
  }

  export interface Network extends Tool {
    /**
     * Clear requests
     */
    clear(): void
    /**
     * Get request data
     */
    requests(): object[]
  }

  export interface NetworkConstructor {
    new (): Network
    readonly prototype: Network
  }

  export interface ResourcesConfig {
    /**
     * Hide Eruda Setting
     */
    hideErudaSetting?: boolean
    /**
     * Auto Refresh Elements
     */
    observeElement?: boolean
  }

  export interface Resources extends Tool {
    set<K extends keyof ResourcesConfig>(
      name: K,
      value: ResourcesConfig[K]
    ): void
  }

  export interface ResourcesConstructor {
    new (): Resources
    readonly prototype: Resources
  }

  export interface SourcesConfig {
    /**
     * Show Line Numbers
     */
    showLineNum?: boolean
    /**
     * Beautify Code
     */
    formatCode?: boolean
    /**
     * Indent Size
     */
    indentSize?: string
  }

  export interface Sources extends Tool {
    set<K extends keyof SourcesConfig>(name: K, value: SourcesConfig[K]): void
  }

  export interface SourcesConstructor {
    new (): Sources
    readonly prototype: Sources
  }

  export interface InfoItem {
    name: string
    val: string
  }

  export interface Info extends Tool {
    /**
     * Clear infos
     */
    clear(): void
    /**
     * Add info
     */
    add(name: string, content: string | (() => void)): void
    /**
     * Get info or infos
     */
    get(): InfoItem[]
    get(name: string): string
    /**
     * Remove specified info
     */
    remove(name: string): void
  }

  export interface InfoConstructor {
    new (): Info
    readonly prototype: Info
  }

  export interface Snippets extends Tool {
    /**
     * Clear snippets
     */
    clear(): void
    /**
     * Add snippet
     * @param name Snippet name
     * @param fn Function to be triggered
     * @param desc Snippet description
     */
    add(name: string, fn: Function, desc: string): void
    /**
     * Remove specified snippet
     * @param name Snippet name
     */
    remove(name: string): void
    /**
     * Run specified snippet
     * @param name Snippet name
     */
    run(name: string): void
  }

  export interface SnippetsConstructor {
    new (): Snippets
    readonly prototype: Snippets
  }

  export interface SettingsRangeOptions {
    min?: number
    max?: number
    step?: number
  }

  export interface Settings extends Tool {
    /**
     * Clear settings
     */
    clear(): void
    /**
     * Remove setting
     * @param cfg Config object
     * @param name Option name
     */
    remove(cfj: object, name: string): void
    /**
     * Add text
     */
    text(str: string): void
    /**
     * Add switch to toggle a boolean value
     * @param cfg Config object created by util.createCfg
     * @param name Option name
     * @param desc Option description
     */
    switch(cfg: object, name: string, desc: string): void
    /**
     * Add select to select a number of string values
     * @param cfg Config object
     * @param name Option name
     * @param desc Option description
     * @param values Array of strings to select
     */
    select(cfg: object, name: string, desc: string, values: string[]): void
    /**
     * Add range to input a number
     * @param cfg Config object
     * @param name Option name
     * @param desc Option description
     * @param options Min, max, step
     */
    range(
      cfg: object,
      name: string,
      desc: string,
      options?: SettingsRangeOptions
    ): void
    /**
     * Add color to select a color
     * @param cfg Config object
     * @param name Option name
     * @param desc Option description
     * @param colors Color list
     */
    color(cfg: object, name: string, desc: string, colors: string[]): void
    /**
     * Add a separator
     */
    separator(): void
  }

  export interface SettingsConstructor {
    new (): Settings
    readonly prototype: Settings
  }

  export interface EntryBtn extends Emitter {
    show(): void
    hide(): void
    getPos(): Position
    setPos(pos: Position): void
    destroy(): void
  }

  export interface EntryBtnConstructor {
    new (): EntryBtn
    readonly prototype: EntryBtn
  }

  export interface DevTools extends Emitter {
    show(): DevTools
    hide(): DevTools
    toggle(): void
    add(tool: Tool | object): DevTools
    remove(name: string): DevTools
    removeAll(): DevTools
    get<T extends ToolConstructor>(name: string): InstanceType<T> | undefined
    showTool(name: string): DevTools
    initCfg(settings: Settings): void
    notify(content: string, options: object): void
    destroy(): void
  }

  export interface DevToolsConstructor {
    new (): DevTools
    readonly prototype: DevTools
  }

  /**
   * Eruda Util
   * @see https://github.com/liriliri/eruda/blob/master/doc/UTIL_API.md
   */
  export interface Util {
    createCfg(name: string): object
    defaults(obj: object, ...src: object[]): object
  }

  /**
   * Eruda APIs
   * @see https://github.com/liriliri/eruda/blob/master/doc/API.md
   */
  export interface ErudaApis {
    /**
     * Initialize eruda.
     */
    init(options?: InitOptions): void
    /**
     * Destory eruda.
     * Note: You can call `init` method again after destruction.
     */
    destroy(): void
    /**
     * Set or get scale.
     */
    scale(): number
    scale(s: number): Eruda
    /**
     * Set or get entry button position.
     * It will not take effect if given pos is out of range.
     */
    position(): Position
    position(p: Position): Eruda
    /**
     * Get tool, eg. console, elements panels.
     */
    get<T extends ToolConstructor>(name: string): InstanceType<T> | undefined
    get(
      name: string
    ):
      | InstanceType<EntryBtnConstructor>
      | InstanceType<DevToolsConstructor>
      | undefined
    /**
     * Add tool.
     */
    add<T extends ToolConstructor>(
      tool: InstanceType<T> | ((eruda: Eruda) => InstanceType<T>)
    ): Eruda | undefined
    /**
     * Remove tool.
     */
    remove(name: string): Eruda | undefined
    /**
     * Show eruda panel.
     */
    show(name?: string): Eruda | undefined
    /**
     * Hide eruda panel.
     */
    hide(): Eruda | undefined
  }

  export interface Eruda extends ErudaApis {
    /**
     * Display console logs. Implementation detail follows the console api spec.
     */
    Console: ErudaConsoleConstructor
    /**
     * Check dom element status.
     */
    Elements: ElementsConstructor
    /**
     * Display special information, could be used for displaying user info to track user logs.
     * By default, page url and browser user agent is shown.
     */
    Info: InfoConstructor
    /**
     * Display requests.
     */
    Network: NetworkConstructor
    /**
     * LocalStorage, sessionStorage, cookies, scripts, styleSheets and images.
     */
    Resources: ResourcesConstructor
    /**
     * Customization for all tools.
     */
    Settings: SettingsConstructor
    /**
     * Allow you to register small functions that can be triggered multiple times.
     */
    Snippets: SnippetsConstructor
    /**
     * View object, html, js, and css.
     */
    Sources: SourcesConstructor
    /**
     * Eruda Tool
     */
    Tool: ToolConstructor
    /**
     * Eruda Util
     */
    util: Util
    /**
     * Eruda version
     */
    readonly version: string
  }

  const eruda: Eruda

  export default eruda
}
