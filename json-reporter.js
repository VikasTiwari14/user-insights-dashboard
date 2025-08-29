// json-reporter.js
export default class JsonReporter {
  constructor() {
    this._printed = false
    this.reset()
  }

  reset() {
    this.passedSuites = 0
    this.totalSuites = 0
    this.passedTests = 0
    this.totalTests = 0
    this.startTime = Date.now()
  }

  // store vitest context (has snapshot summary etc.)
  onInit(ctx) {
    this.ctx = ctx
    this.reset()
  }

  // helper to read .result() or .result object or .state directly
  _stateOf(entity) {
    if (!entity) return undefined
    try {
      if (typeof entity.result === 'function') {
        const r = entity.result()
        return r && r.state
      }
      if (entity.result && typeof entity.result === 'object' && 'state' in entity.result) {
        return entity.result.state
      }
      if (typeof entity.state === 'string') {
        return entity.state
      }
    } catch (e) {
      // ignore
    }
    return undefined
  }

  // called when a single test has finished (Vitest >= v3 style)
  onTestCaseResult(testCase) {
    // count every test result the hook provides
    this.totalTests++
    const st = this._stateOf(testCase)
    if (st === 'pass' || st === 'passed') this.passedTests++
  }

  // called when a module/file (suite) finished
  onTestModuleEnd(testModule) {
    this.totalSuites++
    const st = this._stateOf(testModule)
    if (st === 'pass' || st === 'passed') this.passedSuites++
  }

  // recommended: called when whole run ends (Vitest v3+)
  onTestRunEnd(testModules, unhandledErrors, reason) {
    // testModules is an array of modules; we already increment counts during per-test/per-module hooks
    this._print(reason === 'passed')
  }

  // fallback for older API (onFinished) — files is usually an array of file objects
  onFinished(files, errors) {
    // prevent duplicate printing if onTestRunEnd already printed
    if (this._printed) return

    // if our test hooks didn't run / we have zero totals, try to derive counts from the old-style 'files' object
    if (this.totalTests === 0 && Array.isArray(files)) {
      try {
        files.forEach((f) => {
          // file-level suite count
          this.totalSuites++
          const fState = f?.result?.state ?? f?.state
          if (fState === 'pass' || fState === 'passed') this.passedSuites++

          // inspect tasks array (tasks may contain suites/tests)
          const tasks = f.tasks || []
          const walk = (task) => {
            if (!task) return
            // a test task may be 'test' type or have result
            if (task.type === 'test') {
              this.totalTests++
              const tState = task?.result?.state ?? task?.state
              if (tState === 'pass' || tState === 'passed') this.passedTests++
            } else if (Array.isArray(task.tasks) && task.tasks.length) {
              task.tasks.forEach(walk)
            }
            // sometimes nested children are in .children or .tasks
            if (Array.isArray(task.children) && task.children.length) {
              task.children.forEach(walk)
            }
          }

          tasks.forEach(walk)
        })
      } catch (e) {
        // ignore parsing errors; we'll print what we have
      }
    }

    this._print(errors === 0)
  }

  // print JSON once
  _print(successFlag) {
    if (this._printed) return
    this._printed = true

    const snapshots = this.ctx?.snapshot?.summary?.files ?? 0
    const time = `${Date.now() - (this.startTime || Date.now())}ms`

    const out = {
      success: Boolean(successFlag),
      result: {
        passedSuites: this.passedSuites,
        totalSuites: this.totalSuites,
        passedTests: this.passedTests,
        totalTests: this.totalTests,
        snapshots,
        time
      }
    }

    // final JSON output
    console.log(JSON.stringify(out, null, 2))
  }
}
