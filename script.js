(() => {

  // ---------------------------------------------------------------------------
  // QUESTION BANK
  // Add questions to this array. Only ever APPEND new questions (never remove,
  // reorder or replace existing ones) so saved progress in localStorage keeps
  // pointing at the right ticket.
  //
  // Format of one question:
  //   {
  //     topic:"Category name",          // groups questions into sections
  //     select:1,                       // how many answers must be picked (1, 2 or 3)
  //     prompt:"Question text",
  //     options:[
  //       {k:"A", t:"Option text"},
  //       {k:"B", t:"Option text"},
  //       {k:"C", t:"Option text"},
  //       {k:"D", t:"Option text"}
  //     ],
  //     correct:["B"],                  // keys of the right answer(s)
  //     explanation:`**Why B is right.** ...\n\n**Why A is wrong.** ...`,
  //     sources:[
  //       {l:"Article title", u:"https://help.salesforce.com/..."}
  //     ],
  //     note:"Optional short tooltip"   // optional
  //   }
  // ---------------------------------------------------------------------------
  const DATA = [
  ];

  const SELECT_WORD = {1:"Select one", 2:"Select two", 3:"Select three"};

  const STORAGE_KEY = "sharingVisibilityQuizState_v1";

  const arraysEqualAsSets = (a, b) => {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
  };

  // Fisher-Yates shuffle — never mutates the input array.
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // A shuffled permutation of DATA's indices — the order tickets are displayed
  // in. Pass a subset of indices to shuffle just that subset (used to build a
  // single-section queue); omit it for the full deck.
  // Shuffle mode. On deals tickets in a random order; off keeps them in the
  // bank's own order (question 1, 2, 3, ...), so a ticket's position matches
  // its question number in the full deck. It always starts On when the page
  // loads and is deliberately NOT saved to localStorage.
  let shuffleOn = true;

  const buildOrder = (indices) => {
    const base = indices || DATA.map((_, i) => i);
    return shuffleOn ? shuffleArray(base) : [...base].sort((a, b) => a - b);
  };

  // Topics as they first appear in DATA — just the raw discovery order,
  // reordered below into the exam guide's own section order.
  const FIRST_SEEN_ORDER = DATA.reduce((acc, q) => (acc.includes(q.topic) ? acc : [...acc, q.topic]), []);

  // Optional exam blueprint, used for the "certification-weighted score" at the
  // end of a round. Left empty for now, so only the plain per-category score is
  // shown. To enable the weighted score, list each official exam category with
  // its percentage weight (in the exam guide's order), e.g.
  //   const EXAM_CATEGORY_WEIGHTS = { "Category One": 40, "Category Two": 60 };
  // and make sure every question's `topic` matches one of those names.
  const EXAM_CATEGORY_WEIGHTS = {};
  const EXAM_CATEGORY_MAP = Object.fromEntries(
    Object.keys(EXAM_CATEGORY_WEIGHTS).map((name) => [name, name])
  );
  const EXAM_PASSING_PCT = 65;

  // The exam guide's own top-to-bottom section order (the insertion order of
  // EXAM_CATEGORY_WEIGHTS above, which is written out in that exact order).
  // Every internal topic is re-sorted by the position of the official
  // category it maps to, so the section picker and both breakdowns below
  // read in the same order the published guide lists its sections in —
  // rather than whatever order questions happen to appear in the bank.
  // Ties (two internal topics folding into the same official category, e.g.
  // Change Management and Sandboxes and Environment Management, both under
  // "Environment Management and Deployment") keep their original first-seen
  // relative order, since Array#sort is stable. A topic with no mapping
  // (shouldn't happen, but a safety net) sorts to the end instead of the
  // front.
  const EXAM_BLUEPRINT_ORDER = Object.keys(EXAM_CATEGORY_WEIGHTS);
  const blueprintRank = (topicName) => {
    const idx = EXAM_BLUEPRINT_ORDER.indexOf(EXAM_CATEGORY_MAP[topicName]);
    return idx === -1 ? 9999 : idx;
  };
  const SECTION_ORDER = FIRST_SEEN_ORDER.slice().sort((a, b) => blueprintRank(a) - blueprintRank(b));

  // Ticket indices whose topic matches a given section name, in DATA order.
  const sectionIndices = (name) => DATA.reduce((acc, q, i) => (q.topic === name ? [...acc, i] : acc), []);

  const freshState = () => ({
    index:0,
    finished:false,
    section:"",
    order: buildOrder(),
    answers:DATA.map(() => ({selected:new Set(), checked:false, correct:null}))
  });

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return freshState();
      const saved = JSON.parse(raw);
      if (!saved || !Array.isArray(saved.answers)) {
        return freshState();
      }

      // The bank grows over time as tickets are added. Previously this meant
      // ANY change to DATA.length wiped a saved session outright — even a
      // pure addition — so adding one question reset every user back to
      // ticket 1 with no memory of where they actually were. As long as
      // tickets are only ever appended (never removed, reordered, or
      // replaced — the pattern this bank follows), every previously-saved
      // index still points at the exact same ticket it always did, so the
      // fix is to pad the saved answers out with fresh, unanswered entries
      // for the newly-added tickets instead of discarding the whole session.
      if (saved.answers.length < DATA.length) {
        const padding = Array.from({length: DATA.length - saved.answers.length}, () => ({selected:[], checked:false, correct:null}));
        saved.answers = [...saved.answers, ...padding];
      } else if (saved.answers.length > DATA.length) {
        // The bank shrank or was restructured — old indices can no longer be
        // trusted to mean the same ticket, so fall back to a clean slate
        // rather than risk showing the wrong ticket's saved history.
        return freshState();
      }

      const answers = saved.answers.map((a) => ({
        selected: new Set(Array.isArray(a.selected) ? a.selected : []),
        checked: !!a.checked,
        correct: a.correct === true ? true : (a.correct === false ? false : null)
      }));

      // A saved section must be "" (all sections) or one of the known domains.
      const section = typeof saved.section === "string" && (saved.section === "" || SECTION_ORDER.includes(saved.section))
        ? saved.section
        : "";

      // Nothing attempted yet — deal a freshly shuffled deck on every reload.
      // Once at least one ticket is checked, the deck order freezes so a
      // reload resumes the exact same shuffle instead of scrambling it again.
      const anyTraversed = answers.some((a) => a.checked);
      if (!anyTraversed) {
        return { index:0, finished:false, section, order: buildOrder(section ? sectionIndices(section) : undefined), answers };
      }

      // A saved order can be the full deck, a single-section queue, OR a
      // shorter "review mode" queue (just the previously-wrong tickets) —
      // accept any length from 1 up to DATA.length, as long as every entry is
      // a distinct valid index, so a reload during a section or review round
      // resumes that same reduced queue instead of discarding it back to the
      // full shuffled deck.
      const validOrder = Array.isArray(saved.order)
        && saved.order.length >= 1
        && saved.order.length <= DATA.length
        && new Set(saved.order).size === saved.order.length
        && saved.order.every((v) => Number.isInteger(v) && v >= 0 && v < DATA.length);

      let order = validOrder ? saved.order : buildOrder();
      let index = Math.max(0, Math.min(order.length - 1, Number(saved.index) || 0));

      // Shuffle always starts On, so a queue that was saved while it was Off
      // (still in ascending question order) is reshuffled on load. The
      // ticket that was on screen stays on screen at its new position.
      const savedInBankOrder = order.length > 1 && order.every((v, k) => k === 0 || order[k - 1] < v);
      if (savedInBankOrder) {
        const currentQi = order[index];
        order = buildOrder(order);
        index = Math.max(0, order.indexOf(currentQi));
      }

      return {
        index,
        finished: !!saved.finished,
        section,
        order,
        answers
      };
    } catch (e) {
      return freshState();
    }
  };

  const state = loadState();

  // Transient "select N answers" nudge — shown when the Next/Check button is
  // clicked with some but not enough options picked. Deliberately kept out
  // of `state`/localStorage: it's a momentary UI toast, not something that
  // should survive a reload or reappear on its own. `qi` scopes it to the
  // exact ticket it was raised for, so it can never bleed onto a different
  // one after navigating away and back.
  let underSelectNotice = null;
  let underSelectNoticeTimer = null;
  const clearUnderSelectNotice = () => {
    if (underSelectNoticeTimer) { clearTimeout(underSelectNoticeTimer); underSelectNoticeTimer = null; }
    underSelectNotice = null;
  };
  const showUnderSelectNotice = (qi, need, have) => {
    clearUnderSelectNotice();
    underSelectNotice = { qi, need, have };
    underSelectNoticeTimer = setTimeout(() => {
      underSelectNoticeTimer = null;
      underSelectNotice = null;
      renderTicket();
    }, 3500);
    renderTicket();
  };

  const saveState = () => {
    try {
      const serializable = {
        index: state.index,
        finished: state.finished,
        section: state.section,
        order: state.order,
        answers: state.answers.map((a) => ({
          selected: [...a.selected],
          checked: a.checked,
          correct: a.correct
        }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      // Storage unavailable (private browsing, quota, etc.) — fail silently, quiz still works in-memory.
    }
  };

  // Deals a brand-new shuffled ticket order, back to the first position. Used
  // whenever the deck should reshuffle (finishing the whole set, or an
  // explicit full reset).
  const reshuffleDeck = () => {
    state.order = buildOrder();
    state.index = 0;
  };

  const els = {
    stats: document.getElementById("stats"),
    queue: document.getElementById("queue"),
    ticket: document.getElementById("ticket"),
    shift: document.getElementById("shift"),
    sectionSelect: document.getElementById("sectionSelect")
  };

  // Fills the "Practice section" dropdown once (the domain list and their
  // ticket counts are static) and reflects whatever section is active.
  const populateSectionPicker = () => {
    if (!els.sectionSelect) return;
    const allOption = `<option value="">All sections (${DATA.length})</option>`;
    const sectionOptions = SECTION_ORDER.map((name) => {
      const count = sectionIndices(name).length;
      return `<option value="${esc(name)}">${esc(name)} (${count})</option>`;
    }).join("");
    els.sectionSelect.innerHTML = allOption + sectionOptions;
    els.sectionSelect.value = state.section || "";
  };

  // Switches the active queue to a single section (or back to "All sections"
  // when name is ""). Existing answers are kept as-is — jumping between
  // sections never erases progress — only the order/position/finished flag
  // change, exactly like starting a review round.
  const selectSection = (name) => {
    clearUnderSelectNotice();
    const valid = name === "" || SECTION_ORDER.includes(name);
    state.section = valid ? name : "";
    state.order = buildOrder(state.section ? sectionIndices(state.section) : undefined);
    state.index = 0;
    state.finished = false;
    if (els.sectionSelect) els.sectionSelect.value = state.section;
    saveState();
    renderAll();
    document.getElementById("ticket")?.scrollIntoView({behavior:"smooth", block:"start"});
  };

  // Flips shuffle mode and rebuilds the current queue (the full deck, a
  // single section, or a review round) in the new order. Answers are kept,
  // and the ticket currently on screen stays on screen at its new position.
  const renderShuffleToggle = () => {
    const input = document.getElementById("shuffleToggle");
    const stateText = document.getElementById("shuffleToggleState");
    if (input) input.checked = shuffleOn;
    if (stateText) stateText.textContent = shuffleOn ? "On" : "Off";
  };

  const toggleShuffle = (on) => {
    clearUnderSelectNotice();
    shuffleOn = !!on;
    const currentQi = state.order[state.index];
    state.order = buildOrder(state.order);
    const newPos = state.order.indexOf(currentQi);
    state.index = newPos === -1 ? 0 : newPos;
    saveState();
    renderShuffleToggle();
    renderAll();
  };

  const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const escAttr = (s) => esc(s).replace(/"/g,"&quot;");

  const mdToHtml = (md) => md.split(/\n\n+/).map((p) => {
    const withBold = esc(p).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return `<p>${withBold}</p>`;
  }).join("");

  const toggleSelect = (qi, key) => {
    const a = state.answers[qi];
    if (a.checked) return;
    clearUnderSelectNotice();
    const q = DATA[qi];
    if (q.select === 1) {
      a.selected = new Set([key]);
    } else if (a.selected.has(key)) {
      a.selected.delete(key);
    } else {
      a.selected.add(key);
    }
    saveState();
    renderTicket();
  };

  const checkAnswer = (qi) => {
    const a = state.answers[qi];
    const q = DATA[qi];
    if (a.selected.size !== q.select) return;
    clearUnderSelectNotice();
    a.checked = true;
    a.correct = arraysEqualAsSets([...a.selected], q.correct);
    saveState();
    renderAll();
  };

  const goTo = (i) => {
    clearUnderSelectNotice();
    state.index = Math.max(0, Math.min(state.order.length - 1, i));
    state.finished = false;
    saveState();
    renderAll();
    document.getElementById("ticket")?.scrollIntoView({behavior:"smooth", block:"start"});
  };

  const finishQuiz = () => {
    clearUnderSelectNotice();
    state.finished = true;
    state.index = 0;
    saveState();
    renderAll();
    document.getElementById("shift")?.scrollIntoView({behavior:"smooth", block:"start"});
  };

  // Re-queues only the tickets that were answered incorrectly, clears their
  // prior selection so they can be attempted fresh, and drops back into the
  // ticket view starting at the first one. Correctly-answered tickets are
  // left untouched — once every missed ticket is checked again, "End of
  // shift" naturally reappears (it triggers off the queue that was just
  // finished — the full deck, a section, or a previous review round — not
  // always the full DATA set) with the updated score.
  const reviewErrors = (wrongOriginalIdx) => {
    if (!wrongOriginalIdx || !wrongOriginalIdx.length) return;
    clearUnderSelectNotice();
    wrongOriginalIdx.forEach((qi) => {
      state.answers[qi] = {selected:new Set(), checked:false, correct:null};
    });
    state.order = wrongOriginalIdx;
    state.index = 0;
    state.finished = false;
    saveState();
    renderAll();
    document.getElementById("ticket")?.scrollIntoView({behavior:"smooth", block:"start"});
  };

  const renderStats = () => {
    const total = DATA.length;
    let resolved = 0, correct = 0;
    for (const a of state.answers) {
      if (a.checked) {
        resolved++;
        if (a.correct) correct++;
      }
    }
    const acc = resolved ? `${Math.round((correct / resolved) * 100)}%` : "—";
    els.stats.innerHTML = `
      <div class="stat"><span class="num mono">${resolved} / ${total}</span><span class="lbl">Resolved</span></div>
      <div class="stat"><span class="num mono">${correct}</span><span class="lbl">Correct</span></div>
      <div class="stat"><span class="num mono">${acc}</span><span class="lbl">Accuracy</span></div>`;
  };

  const renderQueue = () => {
    els.queue.innerHTML = state.order.map((qi, pos) => {
      const a = state.answers[qi];
      const classes = ["chip"];
      if (pos === state.index) classes.push("current");
      if (a.checked) classes.push(a.correct ? "correct" : "wrong");
      return `<button class="${classes.join(" ")}" data-i="${pos}" aria-label="Ticket ${pos + 1}">${pos + 1}</button>`;
    }).join("");
    els.queue.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => goTo(parseInt(btn.dataset.i, 10)));
    });
    // The strip scrolls horizontally (see .queue in styles.css) and can hold
    // a few hundred chips, so the current ticket's chip can easily sit off-screen
    // to either side. Keep it in view — centered when possible — every time
    // the queue re-renders, so the visible range always follows the user's
    // actual position instead of staying wherever it was last scrolled to.
    const currentChip = els.queue.querySelector(".chip.current");
    if (currentChip) {
      currentChip.scrollIntoView({behavior:"smooth", block:"nearest", inline:"center"});
    }
  };

  const renderTicket = () => {
    if (!DATA.length) {
      els.ticket.innerHTML = `
        <div class="perf"></div>
        <div class="ticket-head"><div><span class="ticket-id mono">NO TICKETS YET</span></div></div>
        <p class="prompt">The question bank is empty. Add questions to the <code>DATA</code> array at the top of <code>script.js</code>.</p>`;
      return;
    }
    const i = state.index;
    const qi = state.order[i];
    const q = DATA[qi];
    const a = state.answers[qi];
    const isLastTicket = i === state.order.length - 1;

    const badgeHtml = !a.checked
      ? `<span class="badge open">Open</span>`
      : a.correct
        ? `<span class="badge good">Resolved — Correct</span>`
        : `<span class="badge bad">Resolved — Review</span>`;

    const optionsHtml = q.options.map((opt) => {
      const picked = a.selected.has(opt.k);
      const classes = ["opt"];
      let flag = "";
      if (picked && !a.checked) classes.push("picked");
      if (a.checked) {
        const isCorrectOpt = q.correct.includes(opt.k);
        if (picked && isCorrectOpt) { classes.push("reveal-correct"); flag = `<span class="opt-flag">✓ correct</span>`; }
        else if (picked && !isCorrectOpt) { classes.push("reveal-wrong"); flag = `<span class="opt-flag">✕ incorrect</span>`; }
        else if (!picked && isCorrectOpt) { classes.push("reveal-missed"); flag = `<span class="opt-flag">✓ should be selected</span>`; }
      }
      const markClasses = ["mark", "mono", ...(q.select === 1 ? ["circle"] : [])].join(" ");
      const markContent = a.checked
        ? (q.correct.includes(opt.k) ? "✓" : (picked ? "✕" : opt.k))
        : opt.k;
      return `<button type="button" class="${classes.join(" ")}" data-k="${opt.k}" ${a.checked ? "disabled" : ""}><span class="${markClasses}">${markContent}</span><span class="opt-text">${esc(opt.t)}</span>${flag}</button>`;
    }).join("");

    const resultBanner = !a.checked
      ? ""
      : a.correct
        ? `<div class="result-banner good">Correct — matches Salesforce documentation.</div>`
        : `<div class="result-banner bad">Not quite — read the resolution notes below.</div>`;

    const resolutionHtml = !a.checked ? "" : (() => {
      const refsHtml = q.sources.map((s) => `<a class="ref" href="${s.u}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/></svg>${esc(s.l)}</a>`).join("");
      return `<div class="resolution"><h3>Resolution notes</h3>${mdToHtml(q.explanation)}<div class="refs"><span class="ref-label">Attached knowledge articles</span>${refsHtml}</div></div>`;
    })();

    // The ticketnav's single trailing button now covers three jobs at once,
    // depending on where this ticket stands, instead of a separate "Check
    // answer" / "Try again" pair above the options:
    //  - nothing picked yet: "Skip question" — just advances, exactly like
    //    the plain Next action always has.
    //  - a selection is in progress (or complete) but not checked yet:
    //    "Check answer" — evaluates it, staying disabled until exactly
    //    q.select options are picked (same gate the old Check button used).
    //  - already checked, right or wrong: "Next"/"Finish" — always just
    //    advances. There's no retry loop anymore; a wrong answer moves on
    //    the same as a right one, after the resolution notes are read.
    const hasSelection = a.selected.size > 0;
    const hasFullSelection = a.selected.size === q.select;
    let nextMode, nextLabel;
    if (!a.checked && !hasSelection) {
      nextMode = "skip";
      nextLabel = "Skip question";
    } else if (!a.checked) {
      // Left enabled even when under-selected — clicking without enough
      // options picked doesn't silently do nothing, it raises the toast
      // below telling the user exactly how many more to pick.
      nextMode = "check";
      nextLabel = "Check answer";
    } else {
      nextMode = "advance";
      nextLabel = isLastTicket ? "Finish" : "Next ›";
    }
    const countHintHtml = !a.checked
      ? `<span class="count-hint mono">${a.selected.size} of ${q.select} selected</span>`
      : "";
    const underSelectHtml = (underSelectNotice && underSelectNotice.qi === qi)
      ? `<div class="select-warning" role="status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${SELECT_WORD[q.select]} (${q.select}) — you've picked ${underSelectNotice.have}. Select ${q.select - underSelectNotice.have} more to check this ticket.</span></div>`
      : "";

    els.ticket.innerHTML = `
      <div class="perf"></div>
      <div class="ticket-head">
        <div>
          <span class="ticket-id mono">TICKET #${String(i + 1).padStart(2, "0")} OF ${state.order.length}</span><br>
          <span class="ticket-topic">${esc(q.topic)}</span>
        </div>
        ${badgeHtml}
      </div>
      <p class="prompt">${esc(q.prompt)}</p>
      <span class="select-hint">${SELECT_WORD[q.select]}${q.select > 1 ? ` (${q.select})` : ""}</span>
      ${q.note ? `<span class="q-note" tabindex="0" aria-label="${escAttr(q.note)}" data-tip="${escAttr(q.note)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>Note</span>` : ""}
      ${resultBanner}
      <div class="options">${optionsHtml}</div>
      ${countHintHtml}
      ${underSelectHtml}
      <div class="ticketnav">
        <button class="btn ghost" id="prevBtn" ${i === 0 ? "disabled" : ""}>‹ Previous</button>
        <span class="pos mono">${i + 1} / ${state.order.length}</span>
        <button class="btn-bs btn-bs-primary" id="nextBtn">${nextLabel}</button>
      </div>
      ${resolutionHtml}`;

    els.ticket.querySelectorAll(".opt").forEach((btn) => {
      btn.addEventListener("click", () => toggleSelect(qi, btn.dataset.k));
    });
    document.getElementById("prevBtn").addEventListener("click", () => goTo(i - 1));
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (nextMode === "check") {
        if (!hasFullSelection) { showUnderSelectNotice(qi, q.select, a.selected.size); return; }
        checkAnswer(qi);
        return;
      }
      if (isLastTicket) { finishQuiz(); } else { goTo(i + 1); }
    });
  };

  const renderShift = () => {
    // Scoped to the CURRENT queue (state.order) rather than the full DATA
    // set, so this works the same whether that queue is the full deck, a
    // single section, or a review-errors round.
    const total = state.order.length;
    if (!total) { els.shift.innerHTML = ""; return; }
    const resolved = state.order.filter((qi) => state.answers[qi].checked).length;
    // Show the summary once every ticket has been individually checked, OR
    // once the user has explicitly hit Finish — which can happen with some
    // tickets still skipped/unanswered. Either way, any ticket that was
    // never checked counts as incorrect below rather than blocking the
    // summary from appearing at all.
    if (resolved < total && !state.finished) { els.shift.innerHTML = ""; return; }

    const isCorrect = (qi) => state.answers[qi].checked && state.answers[qi].correct;
    const correct = state.order.filter(isCorrect).length;
    const wrongOriginalIdx = state.order.filter((qi) => !isCorrect(qi));
    const skippedCount = total - resolved;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const scopeLabel = state.section ? esc(state.section) : "all sections";

    // Score broken down by exam domain (topic), for whatever categories are
    // actually present in the current queue — the full deck touches every
    // topic seen so far, a section touches just 1, a review round touches
    // whichever categories its wrong tickets came from. Skipped entirely
    // when there's only one category present, since it would just repeat
    // the overall score line.
    const byCategory = {};
    state.order.forEach((qi) => {
      const topic = DATA[qi].topic;
      const bucket = byCategory[topic] || (byCategory[topic] = { correct: 0, total: 0 });
      bucket.total++;
      if (isCorrect(qi)) bucket.correct++;
    });
    const categoryNames = Object.keys(byCategory);
    const orderedCategoryNames = SECTION_ORDER.filter((name) => byCategory[name])
      .concat(categoryNames.filter((name) => !SECTION_ORDER.includes(name))); // safety net, shouldn't happen
    const categoryBreakdownHtml = orderedCategoryNames.length > 1
      ? `<div class="category-breakdown">
          <span class="ref-label" style="display:block;">By category</span>
          ${orderedCategoryNames.map((name) => {
            const b = byCategory[name];
            const catPct = Math.round((b.correct / b.total) * 100);
            const barColor = catPct >= 80 ? "var(--good)" : catPct < 50 ? "var(--bad)" : "var(--accent)";
            return `<div class="cat-row">
                <span class="cat-name">${esc(name)}</span>
                <div class="cat-bar"><div class="cat-bar-fill" style="width:${catPct}%; background:${barColor};"></div></div>
                <span class="cat-score mono">${b.correct}/${b.total} · ${catPct}%</span>
              </div>`;
          }).join("")}
        </div>`
      : "";

    // Certification-style weighted score: fold this round's per-topic results
    // into Salesforce's official category blueprint, weight each category's
    // accuracy by that category's real exam weight, then renormalize across
    // only the categories this round actually touched. Only worth showing
    // once more than one official category is in play, for the same reason
    // the plain by-topic breakdown above is gated the same way.
    const byOfficialCat = {};
    orderedCategoryNames.forEach((name) => {
      const officialCat = EXAM_CATEGORY_MAP[name];
      if (!officialCat) return;
      const b = byCategory[name];
      const bucket = byOfficialCat[officialCat] || (byOfficialCat[officialCat] = { correct: 0, total: 0 });
      bucket.correct += b.correct;
      bucket.total += b.total;
    });
    const coveredOfficialCats = Object.keys(byOfficialCat)
      .sort((a, b) => EXAM_BLUEPRINT_ORDER.indexOf(a) - EXAM_BLUEPRINT_ORDER.indexOf(b));
    const coveredWeight = coveredOfficialCats.reduce((sum, c) => sum + EXAM_CATEGORY_WEIGHTS[c], 0);
    const missingOfficialCats = Object.keys(EXAM_CATEGORY_WEIGHTS).filter((c) => !byOfficialCat[c]);

    const weightedBreakdownHtml = coveredOfficialCats.length > 1
      ? (() => {
          const weightedSum = coveredOfficialCats.reduce((sum, c) => {
            const b = byOfficialCat[c];
            return sum + (b.correct / b.total) * EXAM_CATEGORY_WEIGHTS[c];
          }, 0);
          const weightedPct = coveredWeight ? Math.round((weightedSum / coveredWeight) * 100) : 0;
          const passed = weightedPct >= EXAM_PASSING_PCT;
          const rowsHtml = coveredOfficialCats.map((c) => {
            const b = byOfficialCat[c];
            const catPct = Math.round((b.correct / b.total) * 100);
            const barColor = catPct >= 80 ? "var(--good)" : catPct < 50 ? "var(--bad)" : "var(--accent)";
            return `<div class="cat-row">
                <span class="cat-name">${esc(c)} <span class="cat-weight mono">${EXAM_CATEGORY_WEIGHTS[c]}%</span></span>
                <div class="cat-bar"><div class="cat-bar-fill" style="width:${catPct}%; background:${barColor};"></div></div>
                <span class="cat-score mono">${b.correct}/${b.total} · ${catPct}%</span>
              </div>`;
          }).join("");
          const coverageNote = missingOfficialCats.length
            ? `Renormalized across the ${coveredOfficialCats.length} of ${EXAM_BLUEPRINT_ORDER.length} official categories this bank covers so far (weights re-summed to 100%). Not yet covered: ${missingOfficialCats.map((c) => `${esc(c)} (${EXAM_CATEGORY_WEIGHTS[c]}%)`).join(", ")}.`
            : `All ${EXAM_BLUEPRINT_ORDER.length} official categories covered — weights used exactly as published.`;
          return `<div class="exam-weighted">
              <span class="ref-label" style="display:block;">Certification-weighted score · exam blueprint</span>
              ${rowsHtml}
              <div class="exam-weighted-total">
                <span>Weighted score (${coveredWeight}% of exam weight covered)</span>
                <span class="exam-weighted-pct ${passed ? "pass" : "fail"} mono">${weightedPct}%</span>
              </div>
              <p class="exam-weighted-note">${coverageNote} Salesforce's real passing bar for this exam is ${EXAM_PASSING_PCT}% — this is an estimate of how that same math would score this round, not an official result.</p>
            </div>`;
        })()
      : "";

    const reviewHtml = wrongOriginalIdx.length
      ? `<div class="review-chips">${wrongOriginalIdx.map((qi) => {
          const pos = state.order.indexOf(qi);
          const skipped = !state.answers[qi].checked;
          return `<button class="chip mono" data-i="${pos}" style="width:auto;padding:0 10px;">Ticket ${pos + 1}${skipped ? " (skipped)" : ""}</button>`;
        }).join("")}</div>`
      : `<p style="margin:0;">Every ticket resolved correctly.</p>`;

    const reviewErrorsBtnHtml = wrongOriginalIdx.length
      ? `<button class="btn" id="reviewErrorsBtn" style="margin-top:14px;">Review errors (${wrongOriginalIdx.length})</button>`
      : "";

    els.shift.innerHTML = `
      <div class="shift">
        <h2>End of shift</h2>
        <p>${resolved === total ? `All ${total} tickets resolved` : `${resolved} of ${total} tickets answered — ${skippedCount} skipped ticket${skippedCount === 1 ? "" : "s"} counted as incorrect`} — ${scopeLabel}.</p>
        <div class="score-line">Score: ${correct}/${total} - ${pct}%</div>
        <div class="row">
          <div><div class="num">${correct} / ${total}</div><div class="lbl">Correct</div></div>
          <div><div class="num">${pct}%</div><div class="lbl">Accuracy</div></div>
        </div>
        ${categoryBreakdownHtml}
        ${weightedBreakdownHtml}
        ${wrongOriginalIdx.length ? `<span class="ref-label" style="margin-bottom:8px;display:block;margin-top:${(categoryBreakdownHtml || weightedBreakdownHtml) ? "16px" : "0"};">Tickets to review</span>` : ""}
        ${reviewHtml}
        ${reviewErrorsBtnHtml}
      </div>`;

    els.shift.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => goTo(parseInt(btn.dataset.i, 10)));
    });
    document.getElementById("reviewErrorsBtn")?.addEventListener("click", () => reviewErrors(wrongOriginalIdx));
  };

  const renderAll = () => {
    renderStats();
    renderQueue();
    renderTicket();
    renderShift();
    document.getElementById("ticketCount").textContent = `${DATA.length} ticket${DATA.length === 1 ? "" : "s"}`;

    els.stats.style.display = state.finished ? "none" : "";
    els.queue.style.display = state.finished ? "none" : "";
    els.ticket.style.display = state.finished ? "none" : "";
  };

  populateSectionPicker();
  els.sectionSelect?.addEventListener("change", (e) => selectSection(e.target.value));
  renderShuffleToggle();
  document.getElementById("shuffleToggle")?.addEventListener("change", (e) => toggleShuffle(e.target.checked));

  document.getElementById("resetAll").addEventListener("click", () => {
    clearUnderSelectNotice();
    state.finished = false;
    state.section = "";
    state.answers = DATA.map(() => ({selected:new Set(), checked:false, correct:null}));
    reshuffleDeck();
    saveState();
    if (els.sectionSelect) els.sectionSelect.value = "";
    renderAll();
  });

  // ---------- Export (Word doc / PDF) — original DATA order, questions +
  // suggested answers + correct answers only, no explanations or sources.

  const buildExportRowsHtml = () => DATA.map((q, idx) => {
    const optionsHtml = q.options.map((o) => `<div class="pq-opt">${esc(o.k)}. ${esc(o.t)}</div>`).join("");
    const correctLabel = q.correct.length > 1 ? "Correct answers" : "Correct answer";
    return `
      <div class="pq">
        <p class="pq-num">Question ${idx + 1}</p>
        <p class="pq-topic">${esc(q.topic)}</p>
        <p class="pq-prompt">${esc(q.prompt)}</p>
        <div class="pq-options">${optionsHtml}</div>
        <p class="pq-correct">${correctLabel}: ${esc(q.correct.join(", "))}</p>
      </div>`;
  }).join("");

  const buildExportBodyHtml = () => `
    <h1>Sharing and Visibility Architect</h1>
    <p class="print-meta">Practice questions — ${DATA.length} total.</p>
    ${buildExportRowsHtml()}`;

  const exportWord = () => {
    const doc = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Sharing and Visibility Architect — Practice Questions</title>
<style>
  body{ font-family: Calibri, Arial, sans-serif; font-size:12pt; color:#111; }
  h1{ font-size:18pt; margin:0 0 4px; }
  .print-meta{ font-size:10pt; color:#555; margin:0 0 24px; }
  .pq{ margin:0 0 20px; }
  .pq-num{ font-weight:700; margin:0 0 2px; }
  .pq-topic{ font-size:9pt; text-transform:uppercase; letter-spacing:0.05em; color:#666; margin:0 0 6px; }
  .pq-prompt{ font-weight:600; margin:0 0 8px; }
  .pq-options{ margin:0 0 8px 18px; }
  .pq-opt{ margin:2px 0; }
  .pq-correct{ margin:0; font-weight:700; }
</style></head>
<body>${buildExportBodyHtml()}</body></html>`;
    const blob = new Blob(["﻿", doc], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sharing-and-Visibility-Architect-Practice-Questions.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportPdf = () => {
    const printArea = document.getElementById("printExport");
    printArea.innerHTML = buildExportBodyHtml();
    document.body.classList.add("printing-export");
    const cleanup = () => {
      document.body.classList.remove("printing-export");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  const exportMenu = document.getElementById("exportMenu");
  const exportBtn = document.getElementById("exportBtn");
  const exportMenuList = document.getElementById("exportMenuList");

  const closeExportMenu = () => {
    if (!exportMenuList) return;
    exportMenuList.hidden = true;
    exportBtn?.setAttribute("aria-expanded", "false");
  };
  const openExportMenu = () => {
    if (!exportMenuList) return;
    exportMenuList.hidden = false;
    exportBtn?.setAttribute("aria-expanded", "true");
  };

  exportBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (exportMenuList?.hidden) openExportMenu();
    else closeExportMenu();
  });
  document.getElementById("exportPdfBtn")?.addEventListener("click", () => {
    closeExportMenu();
    exportPdf();
  });
  document.getElementById("exportWordBtn")?.addEventListener("click", () => {
    closeExportMenu();
    exportWord();
  });
  document.addEventListener("click", (e) => {
    if (exportMenu && !exportMenu.contains(e.target)) closeExportMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeExportMenu();
  });

  renderAll();
})();
