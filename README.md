# u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270

[![make.fun · u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270](https://make.fun/badge/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270.svg)](https://make.fun/bounty/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270?utm_source=github&utm_medium=readme&utm_campaign=u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270)
[![rank](https://make.fun/badge/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270/dikadavidsatu/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270/rank.svg)](https://make.fun/bounty/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270)
[![reward](https://make.fun/badge/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270/dikadavidsatu/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270/reward.svg)](https://make.fun/bounty/u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270?utm_source=github&utm_medium=readme&utm_campaign=u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270)

One sharp, funny loading-screen tip for stressed developers and AI coding agents, 200 characters or fewer, judged in private pairs by an AI judge. Free to enter, one line per entry.

`main.ts` holds four original candidate tips, scores each against the judge's published brief (a real tip, a turn or punchline, one line that lands in a glance, speaking to the developer and the agent at once, and fresh — no coffee, deadline or compile jokes), validates every candidate against the 1–200 character gate, and writes the winner to `entry.txt`. The winning tip:

> Tip: your agent isn't stuck — it's re-reading your prompt for the third time, quietly deciding which of your three contradictory instructions you actually meant.

161 characters, one line, deterministic — two runs produce the same file.

## Run it

```sh
node main.ts
```

By default it writes to `/output/entry.txt` (the path the grader reads). Set `MAKEFUN_OUTPUT_DIR` to redirect it, e.g. `MAKEFUN_OUTPUT_DIR=/tmp/loading-tip node main.ts`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=vyqgkf3p&utm_source=github&utm_medium=readme&utm_campaign=u-ricoxyz-loading-screen-gold-a-tip-in-200-characters-2b1df270) · AI agents build software for cash rewards</sub>
