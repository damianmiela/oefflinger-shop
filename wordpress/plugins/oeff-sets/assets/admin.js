/* Öfflinger Sets — admin builder (vanilla JS, no build step). */
(function () {
  "use strict";

  var cfg = window.OeffSets || {};
  var rows = []; // [{ key, id, name, price, qty }]
  var seq = 0;

  var tbody, tfootRow, previewSum, previewPrice, previewSavings, valueInput;

  function euro(n) {
    var v = (Math.round((n || 0) * 100) / 100).toFixed(2).replace(".", ",");
    return (cfg.currency || "€") + " " + v;
  }

  function selectedMode() {
    var el = document.querySelector('input[name="oeff_set_pricing_mode"]:checked');
    return el ? el.value : "percent";
  }

  function recalc() {
    var sum = rows.reduce(function (acc, r) { return acc + r.price * r.qty; }, 0);
    var mode = selectedMode();
    var val = parseFloat(valueInput && valueInput.value) || 0;
    var price = sum, savings = 0;

    if (mode === "fixed") { price = val; savings = sum - val; }
    else if (mode === "percent") { savings = sum * (val / 100); price = sum - savings; }
    else if (mode === "amount") { savings = val; price = sum - val; }

    if (price < 0) price = 0;
    if (savings < 0) savings = 0;
    var pct = sum > 0 ? Math.round((savings / sum) * 100) : 0;

    if (previewSum) previewSum.textContent = euro(sum);
    if (previewPrice) previewPrice.textContent = euro(price);
    if (previewSavings) previewSavings.textContent = euro(savings) + (pct ? " (" + pct + " %)" : "");
  }

  function renderRows() {
    if (!tbody) return;
    tbody.innerHTML = "";

    rows.forEach(function (r) {
      var tr = document.createElement("tr");

      var tdName = document.createElement("td");
      tdName.textContent = r.name;
      tr.appendChild(tdName);

      var tdPrice = document.createElement("td");
      tdPrice.textContent = euro(r.price);
      tr.appendChild(tdPrice);

      var tdQty = document.createElement("td");
      var qty = document.createElement("input");
      qty.type = "number";
      qty.min = "1";
      qty.value = r.qty;
      qty.className = "small-text";
      qty.name = "oeff_set_components[" + r.key + "][qty]";
      qty.addEventListener("input", function () {
        r.qty = Math.max(1, parseInt(qty.value, 10) || 1);
        recalc();
      });
      tdQty.appendChild(qty);

      var hid = document.createElement("input");
      hid.type = "hidden";
      hid.value = r.id;
      hid.name = "oeff_set_components[" + r.key + "][id]";
      tdQty.appendChild(hid);
      tr.appendChild(tdQty);

      var tdRm = document.createElement("td");
      var rm = document.createElement("button");
      rm.type = "button";
      rm.className = "button-link oeff-set-remove";
      rm.setAttribute("aria-label", "Entfernen");
      rm.textContent = "✕";
      rm.addEventListener("click", function () {
        rows = rows.filter(function (x) { return x.key !== r.key; });
        renderRows();
        recalc();
      });
      tdRm.appendChild(rm);
      tr.appendChild(tdRm);

      tbody.appendChild(tr);
    });

    if (tfootRow) tfootRow.style.display = rows.length ? "none" : "";
  }

  function addRow(p) {
    var id = parseInt(p.id, 10);
    if (!id) return;
    if (rows.some(function (r) { return r.id === id; })) return; // no duplicates
    rows.push({ key: ++seq, id: id, name: p.name, price: parseFloat(p.price) || 0, qty: parseInt(p.qty, 10) || 1 });
    renderRows();
    recalc();
  }

  function initSearch() {
    var input = document.getElementById("oeff-set-search-input");
    var results = document.getElementById("oeff-set-search-results");
    if (!input || !results) return;
    var timer;

    input.addEventListener("input", function () {
      clearTimeout(timer);
      var term = input.value.trim();
      if (term.length < 2) { results.hidden = true; results.innerHTML = ""; return; }
      timer = setTimeout(function () { doSearch(term, results, input); }, 250);
    });

    document.addEventListener("click", function (e) {
      if (e.target !== input && !results.contains(e.target)) results.hidden = true;
    });
  }

  function doSearch(term, results, input) {
    var url = cfg.ajaxUrl + "?action=oeff_sets_search&nonce=" + encodeURIComponent(cfg.nonce) +
      "&term=" + encodeURIComponent(term);

    fetch(url, { credentials: "same-origin" })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        results.innerHTML = "";
        var items = (json && json.data) || [];
        if (!items.length) { results.hidden = true; return; }
        items.forEach(function (p) {
          var li = document.createElement("li");
          li.textContent = p.name + " — " + euro(p.price);
          li.addEventListener("click", function () {
            addRow(p);
            results.hidden = true;
            input.value = "";
          });
          results.appendChild(li);
        });
        results.hidden = false;
      })
      .catch(function () { results.hidden = true; });
  }

  // ---- configurable: type toggle + quantity discount tiers ----
  var tierBody, tierFootRow, tierSeq = 0, tiers = [];

  function box(id) { return document.getElementById(id); }

  function applyTypeVisibility(type) {
    var isConf = type === "configurable";
    [box("oeff_set_components"), box("oeff_set_pricing")].forEach(function (b) {
      if (b) b.style.display = isConf ? "none" : "";
    });
    var confBox = box("oeff_set_config");
    if (confBox) confBox.style.display = isConf ? "" : "none";
  }

  function renderTiers() {
    if (!tierBody) return;
    tierBody.innerHTML = "";
    tiers.forEach(function (t) {
      var tr = document.createElement("tr");

      var tdMin = document.createElement("td");
      var min = document.createElement("input");
      min.type = "number"; min.min = "1"; min.className = "small-text";
      min.value = t.min_qty; min.name = "oeff_set_tiers[" + t.key + "][min_qty]";
      tdMin.appendChild(min); tr.appendChild(tdMin);

      var tdPct = document.createElement("td");
      var pct = document.createElement("input");
      pct.type = "number"; pct.min = "0"; pct.max = "100"; pct.step = "0.1"; pct.className = "small-text";
      pct.value = t.percent; pct.name = "oeff_set_tiers[" + t.key + "][percent]";
      tdPct.appendChild(pct); tr.appendChild(tdPct);

      var tdRm = document.createElement("td");
      var rm = document.createElement("button");
      rm.type = "button"; rm.className = "button-link oeff-set-remove";
      rm.setAttribute("aria-label", "Entfernen"); rm.textContent = "✕";
      rm.addEventListener("click", function () {
        tiers = tiers.filter(function (x) { return x.key !== t.key; });
        renderTiers();
      });
      tdRm.appendChild(rm); tr.appendChild(tdRm);

      tierBody.appendChild(tr);
    });
    if (tierFootRow) tierFootRow.style.display = tiers.length ? "none" : "";
  }

  function addTier(t) {
    tiers.push({ key: ++tierSeq, min_qty: (t && t.min_qty) || 1, percent: (t && t.percent) || 0 });
    renderTiers();
  }

  function initConfigurable() {
    tierBody = document.querySelector("#oeff-set-tiers tbody");
    tierFootRow = document.querySelector("#oeff-set-tiers tfoot tr");
    (cfg.tiers || []).forEach(addTier);
    renderTiers();

    var addBtn = document.getElementById("oeff-set-add-tier");
    if (addBtn) addBtn.addEventListener("click", function () { addTier(); });

    var radios = document.querySelectorAll('input[name="oeff_set_type"]');
    Array.prototype.forEach.call(radios, function (el) {
      el.addEventListener("change", function () { applyTypeVisibility(el.value); });
    });
    var checked = document.querySelector('input[name="oeff_set_type"]:checked');
    applyTypeVisibility(checked ? checked.value : (cfg.type || "fixed"));
  }

  function init() {
    tbody = document.querySelector("#oeff-set-rows tbody");
    tfootRow = document.querySelector("#oeff-set-rows tfoot tr");
    var preview = document.getElementById("oeff-set-preview");
    valueInput = document.getElementById("oeff-set-pricing-value");
    if (!tbody || !preview) return;

    previewSum = preview.querySelector('[data-preview="sum"]');
    previewPrice = preview.querySelector('[data-preview="price"]');
    previewSavings = preview.querySelector('[data-preview="savings"]');

    (cfg.existing || []).forEach(addRow);

    if (valueInput) valueInput.addEventListener("input", recalc);
    Array.prototype.forEach.call(
      document.querySelectorAll('input[name="oeff_set_pricing_mode"]'),
      function (el) { el.addEventListener("change", recalc); }
    );

    initSearch();
    recalc();
    initConfigurable();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
