/* Keys View Construction Group — site behavior (no libraries needed) */
(function () {
  'use strict';

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A6A2B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-top:3px"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';

  /* ---------- Home: process timeline ---------- */
  var stepsEl = document.getElementById('kv-steps');
  if (stepsEl) {
    var STEPS = [
      { title: 'Consultation', body: 'We walk the property with you, listen to what you want to build or fix, and flag anything that affects permits, zoning or code before you spend a dollar.', deliverable: 'An honest read on what is possible and what it involves' },
      { title: 'Scope & estimate', body: 'You get a written scope, a line-item estimate and a realistic schedule. Everything we discussed is on paper, with nothing buried in the fine print.', deliverable: 'Written scope, estimate and timeline' },
      { title: 'Permits & plans', body: 'We coordinate drawings where they are needed, file the permits, and track them through review so the job can start on schedule.', deliverable: 'Approved permits, ready to build' },
      { title: 'Build', body: 'Our crew builds to plan while you get regular updates, so you always know what is happening this week and what comes next.', deliverable: 'Scheduled progress updates' },
      { title: 'Inspection & closeout', body: 'We schedule inspections, correct anything flagged, and hand you the final documents. The permit is closed and the job is done.', deliverable: 'Passed inspection and a closed permit' }
    ];
    var cur = 0;
    var btns = STEPS.map(function (s, i) {
      var b = el('button', { type: 'button', role: 'tab', 'class': 'step' },
        '<span class="step-num">' + (i + 1) + '</span><span class="step-title">' + esc(s.title) + '</span>');
      b.addEventListener('click', function () { setStep(i); });
      stepsEl.appendChild(b);
      return b;
    });
    var prev = document.getElementById('step-prev');
    var next = document.getElementById('step-next');
    prev.addEventListener('click', function () { setStep(Math.max(0, cur - 1)); });
    next.addEventListener('click', function () { setStep(Math.min(STEPS.length - 1, cur + 1)); });
    function setStep(i) {
      cur = i;
      btns.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.classList.toggle('is-active', j === i);
        b.classList.toggle('is-done', j < i);
      });
      document.getElementById('step-num').textContent = i + 1;
      document.getElementById('step-title').textContent = STEPS[i].title;
      document.getElementById('step-body').textContent = STEPS[i].body;
      document.getElementById('step-deliv').textContent = STEPS[i].deliverable;
      prev.disabled = i === 0;
      next.disabled = i === STEPS.length - 1;
    }
    setStep(0);
  }

  /* ---------- Services: permit & violation checker ---------- */
  var checker = document.getElementById('checker-app');
  if (checker) {
    var Q = [
      { text: 'What is going on with the property?', opts: [
        ['violation', 'I received a code violation notice'],
        ['permit', 'I have an open or expired permit'],
        ['unpermitted', 'I found unpermitted work (buying, selling or refinancing)'],
        ['new', 'I am planning work and need permits']] },
      { text: 'What type of property is it?', opts: [
        ['home', 'Single-family home'],
        ['rental', 'Multi-family or rental property'],
        ['commercial', 'Commercial property']] },
      { text: 'Is there a deadline, closing or hearing date?', opts: [
        ['soon', 'Yes, within 30 days'],
        ['later', 'Yes, more than 30 days out'],
        ['unsure', 'I am not sure'],
        ['none', 'No deadline']] }
    ];
    var R = {
      violation: { title: 'Code violation resolution', steps: ['We review the notice, the case and the property record.', 'We scope the corrections and any permits they require.', 'We complete the work, schedule re-inspection and confirm the case is closed.'], bring: ['The violation notice (photo or PDF)', 'Case number and any hearing date', 'Photos of the area cited'] },
      permit: { title: 'Open permit closeout', steps: ['We pull the permit history and see what is outstanding.', 'We complete or correct the remaining work and documentation.', 'We schedule the final inspection and close the permit.'], bring: ['Permit number or property address', 'Any inspection reports you have', 'The original contractor, if known'] },
      unpermitted: { title: 'After-the-fact permitting', steps: ['We document the existing work against what code requires.', 'We prepare plans and file for after-the-fact permits.', 'We make any required corrections and pass inspection.'], bring: ['Property address and closing date, if any', 'Photos of the work in question', 'Inspection or appraisal reports'] },
      'new': { title: 'Permit-ready project planning', steps: ['We confirm exactly what your project needs to be permitted.', 'We prepare the plans and file the permits.', 'We build and close out with a final inspection.'], bring: ['Property address', 'Ideas, sketches or inspiration photos', 'Your target timeline'] }
    };
    var U = {
      soon: 'Time-sensitive. Reach out as soon as you can so we can review your documents before the date.',
      later: 'You have some time. Starting early leaves more options and less pressure.',
      unsure: 'Check your notice or contract for a compliance, hearing or closing date. We can help you find it.',
      none: ''
    };
    var q = 0, answers = [null, null, null];

    function render() {
      checker.innerHTML = '';
      if (q < Q.length) {
        var head = el('div', { 'class': 'chk-head' },
          '<span class="eyebrow-ink">QUESTION ' + (q + 1) + ' OF 3</span>');
        if (q > 0) {
          var back = el('button', { type: 'button', 'class': 'btn btn-line btn-sm' }, 'Back');
          back.addEventListener('click', function () { q--; render(); });
          head.appendChild(back);
        }
        checker.appendChild(head);
        checker.appendChild(el('div', { 'class': 'chk-bar', 'aria-hidden': 'true' },
          '<div style="width:' + Math.round((q / Q.length) * 100) + '%"></div>'));
        var h = el('h3', { 'class': 'chk-q', id: 'chk-q' }, esc(Q[q].text));
        checker.appendChild(h);
        var group = el('div', { role: 'radiogroup', 'aria-labelledby': 'chk-q', 'class': 'chk-opts' });
        Q[q].opts.forEach(function (o) {
          var sel = answers[q] === o[0];
          var b = el('button', { type: 'button', role: 'radio', 'aria-checked': sel ? 'true' : 'false', 'class': 'opt' + (sel ? ' is-selected' : '') },
            '<span class="opt-dot" aria-hidden="true"><span></span></span><span>' + esc(o[1]) + '</span>');
          b.addEventListener('click', function () { answers[q] = o[0]; q++; render(); });
          group.appendChild(b);
        });
        checker.appendChild(group);
      } else {
        var r = R[answers[0]] || R.violation;
        var labels = Q.map(function (qq, i) {
          var f = qq.opts.filter(function (o) { return o[0] === answers[i]; })[0];
          return f ? f[1] : '';
        }).filter(Boolean);
        var urg = U[answers[2]] || '';
        var html = '<span class="tag tag-green">YOUR LIKELY PATH</span>' +
          '<h3 class="chk-result">' + esc(r.title) + '</h3>' +
          '<p class="muted small" style="margin:0 0 28px">Based on: ' + esc(labels.join(' · ')) + '</p>' +
          (urg ? '<div class="chk-urgent"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A6A2B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg><span>' + esc(urg) + '</span></div>' : '') +
          '<div class="chk-cols"><div style="flex:1 1 320px;min-width:0"><h4 class="chk-h4">HOW WE\'D HANDLE IT</h4><ol class="numlist">' +
          r.steps.map(function (s, i) { return '<li><span class="num">' + (i + 1) + '</span><span>' + esc(s) + '</span></li>'; }).join('') +
          '</ol></div><div class="chk-bring"><h4 class="chk-h4">HAVE THIS READY</h4><ul class="checklist small">' +
          r.bring.map(function (s) { return '<li>' + CHECK + '<span>' + esc(s) + '</span></li>'; }).join('') +
          '</ul></div></div>' +
          '<div class="btn-row" style="margin-top:32px"><a class="btn btn-navy" href="contact.html">Send us the details</a><button type="button" class="btn btn-line" id="chk-restart">Start over</button></div>' +
          '<p class="muted" style="margin:24px 0 0;font-size:14px">This is a general guide, not a legal opinion. Requirements vary by property and municipality; we confirm everything after reviewing your documents.</p>';
        checker.innerHTML = html;
        document.getElementById('chk-restart').addEventListener('click', function () { q = 0; answers = [null, null, null]; render(); });
      }
    }
    render();
  }

  /* ---------- Projects: before/after slider + filters ---------- */
  var grid = document.getElementById('project-grid');
  if (grid) {
    var CATS = { 'new': 'New Construction', remodel: 'Remodeling', additions: 'Additions', code: 'Code Resolution' };
    var P = [
      { cat: 'remodel', name: '[Kitchen remodel]', place: '[City]', scope: '[One or two lines on the scope: what changed, how long it took, and what the client needed.]', before: 'images/kitchen-before.svg', after: 'images/kitchen-after.svg' },
      { cat: 'new', name: '[New single-family home]', place: '[City]', scope: '[One or two lines on the scope: what changed, how long it took, and what the client needed.]', before: 'images/framing.svg', after: 'images/new-home.svg' },
      { cat: 'code', name: '[Violation closeout]', place: '[City]', scope: '[One or two lines: what the city cited, what we corrected, and when the case closed.]', before: 'images/violation-before.svg', after: 'images/violation-after.svg' },
      { cat: 'additions', name: '[Primary suite addition]', place: '[City]', scope: '[One or two lines on the scope: what changed, how long it took, and what the client needed.]', before: 'images/addition-before.svg', after: 'images/addition-after.svg' },
      { cat: 'remodel', name: '[Bathroom renovation]', place: '[City]', scope: '[One or two lines on the scope: what changed, how long it took, and what the client needed.]', before: 'images/bath-before.svg', after: 'images/bath-after.svg' },
      { cat: 'code', name: '[After-the-fact permit]', place: '[City]', scope: '[One or two lines: what was unpermitted, what we filed, and how it passed.]', before: 'images/violation-before.svg', after: 'images/violation-after.svg' }
    ];
    var filter = 'all', feat = 0;
    var range = document.getElementById('ba');
    var afterImg = document.getElementById('ba-after');
    var beforeImg = document.getElementById('ba-before');
    var handle = document.getElementById('ba-handle');
    function setPos(v) {
      afterImg.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      handle.style.left = v + '%';
    }
    range.addEventListener('input', function () { setPos(Number(range.value)); });
    function setFeature(i) {
      feat = i;
      var f = P[i];
      beforeImg.src = f.before; afterImg.src = f.after;
      document.getElementById('ba-wrap').setAttribute('aria-label', 'Before and after comparison for ' + f.name);
      document.getElementById('featured-h').textContent = f.name;
      document.getElementById('feat-meta').textContent = CATS[f.cat] + ' · ' + f.place;
      document.getElementById('feat-scope').textContent = f.scope;
      range.value = 50; setPos(50);
      renderGrid();
    }
    var chipsEl = document.getElementById('project-filters');
    ['all', 'new', 'remodel', 'additions', 'code'].forEach(function (k) {
      var b = el('button', { type: 'button', 'class': 'chip', 'data-k': k, 'aria-pressed': k === 'all' ? 'true' : 'false' }, k === 'all' ? 'All' : CATS[k]);
      b.addEventListener('click', function () {
        filter = k;
        Array.prototype.forEach.call(chipsEl.children, function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-k') === k ? 'true' : 'false'); });
        renderGrid();
      });
      chipsEl.appendChild(b);
    });
    function renderGrid() {
      grid.innerHTML = '';
      var shown = 0;
      P.forEach(function (p, i) {
        if (filter !== 'all' && p.cat !== filter) return;
        shown++;
        var b = el('button', { type: 'button', 'class': 'pcard' + (i === feat ? ' is-current' : ''), 'aria-label': 'Show ' + p.name + ' in the before and after viewer' },
          '<div class="pcard-img"><img src="' + p.after + '" alt="" loading="lazy"><span class="ba-tag">BEFORE / AFTER</span></div>' +
          '<div class="pcard-body"><span class="tag ' + (p.cat === 'code' ? 'tag-green' : '') + '">' + esc(CATS[p.cat]) + '</span>' +
          '<h3>' + esc(p.name) + '</h3><p>' + esc(p.place) + '</p></div>');
        b.addEventListener('click', function () {
          setFeature(i);
          document.getElementById('featured').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        grid.appendChild(b);
      });
      document.getElementById('project-count').textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
    }
    setFeature(0);
  }

  /* ---------- Contact: estimate form ---------- */
  var form = document.getElementById('estimate-form');
  if (form) {
    var done = document.getElementById('form-done');
    var err = document.getElementById('form-error');
    var MIN_SECONDS = 3;               // real people take longer than this to fill the form
    var loadedAt = Date.now();
    function success() { form.hidden = true; done.hidden = false; done.focus(); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var trap = form.querySelector('input[name="botcheck"]');
      var tooFast = (Date.now() - loadedAt) / 1000 < MIN_SECONDS;
      // Bot detected: pretend it worked, but send nothing.
      if ((trap && trap.checked) || tooFast) { success(); return; }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      var data = Object.fromEntries(new FormData(form));
      delete data.botcheck;
      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || j.success === false) throw new Error(j.message || 'bad'); }); })
        .then(function () { success(); form.reset(); loadedAt = Date.now(); })
        .catch(function () { err.hidden = false; })
        .then(function () { btn.disabled = false; btn.textContent = 'Send request'; });
    });
    document.getElementById('form-again').addEventListener('click', function () { done.hidden = true; form.hidden = false; });
  }

  /* footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
