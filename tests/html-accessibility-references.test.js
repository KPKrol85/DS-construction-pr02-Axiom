// @vitest-environment node

import { readFileSync, readdirSync } from "node:fs";
import { URL } from "node:url";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const rootUrl = new URL("../", import.meta.url);
const canonicalPages = [
  "index.html",
  "404.html",
  "offline.html",
  "success.html",
  "services/adaptacje-poddaszy.html",
  "services/budowa-domow.html",
  "services/instalacje-elektryczne.html",
  "services/instalacje-sanitarne.html",
  "services/remonty-mieszkan.html",
  "services/wykonczenia-wnetrz.html",
  "legal/certyfikaty.html",
  "legal/kariera.html",
  "legal/polityka-cookies.html",
  "legal/polityka-prywatnosci.html",
  "legal/regulamin.html",
];
const ariaReferenceAttributes = ["aria-labelledby", "aria-describedby", "aria-controls"];

const collectDiagnostics = (html, source) => {
  // jsdom defaults keep scripts inert and external resource loading disabled.
  const dom = new JSDOM(html);

  try {
    const document = dom.window.document;
    const ids = new Set();
    const diagnostics = [];

    for (const element of document.querySelectorAll("[id]")) {
      const id = element.getAttribute("id");
      if (!id) continue;
      if (ids.has(id)) diagnostics.push(`${source} [id] duplicate ID "${id}"`);
      ids.add(id);
    }

    const checkReference = (attribute, id) => {
      if (id && !ids.has(id)) {
        diagnostics.push(`${source} [${attribute}] unresolved ID "${id}"`);
      }
    };

    for (const label of document.querySelectorAll("label[for]")) {
      checkReference("label[for]", label.getAttribute("for"));
    }

    for (const attribute of ariaReferenceAttributes) {
      for (const element of document.querySelectorAll(`[${attribute}]`)) {
        for (const id of element.getAttribute(attribute).split(/\s+/).filter(Boolean)) {
          checkReference(attribute, id);
        }
      }
    }

    return diagnostics;
  } finally {
    dom.window.close();
  }
};

describe("maintained HTML accessibility references", () => {
  it("includes all 15 canonical documents from root, services and legal", () => {
    const discoveredPages = ["", "services/", "legal/"].flatMap((directory) =>
      readdirSync(new URL(directory, rootUrl), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
        .map((entry) => `${directory}${entry.name}`),
    );

    expect(canonicalPages).toHaveLength(15);
    expect([...canonicalPages].sort()).toEqual(discoveredPages.sort());
  });

  it.each(canonicalPages)("%s has unique IDs and resolved accessibility references", (source) => {
    const html = readFileSync(new URL(source, rootUrl), "utf8");
    const diagnostics = collectDiagnostics(html, source);

    expect(diagnostics, diagnostics.join("\n")).toEqual([]);
  });
});

describe("accessibility reference diagnostics", () => {
  it("accepts resolved references and ignores empty IDs and reference attributes", () => {
    const html = `
      <h1 id="title">Formularz</h1>
      <p id="hint">Opis pola</p>
      <p id="status">Status</p>
      <label for="field">Pole</label>
      <input id="field" aria-labelledby="title hint" aria-describedby=" hint\tstatus\n" />
      <button aria-controls="field panel">Pokaż</button>
      <div id="panel"></div>
      <div id=""></div><div id=""></div>
      <label for=""></label>
      <div aria-labelledby="" aria-describedby="" aria-controls=""></div>
    `;

    expect(collectDiagnostics(html, "fixture:valid")).toEqual([]);
  });

  it("reports duplicate IDs with the source, attribute and offending ID", () => {
    const html = '<div id="repeated"></div><p id="repeated"></p>';

    expect(collectDiagnostics(html, "fixture:duplicate")).toEqual([
      'fixture:duplicate [id] duplicate ID "repeated"',
    ]);
  });

  it.each([
    ["label[for]", '<label for="missing">Pole</label>'],
    ["aria-labelledby", '<button aria-labelledby="missing">Przycisk</button>'],
    ["aria-describedby", '<button aria-describedby="missing">Przycisk</button>'],
    ["aria-controls", '<button aria-controls="missing">Przycisk</button>'],
  ])("reports an unresolved %s target with the source, attribute and ID", (attribute, html) => {
    expect(collectDiagnostics(html, "fixture:missing-target")).toEqual([
      `fixture:missing-target [${attribute}] unresolved ID "missing"`,
    ]);
  });

  it.each(ariaReferenceAttributes)("checks every whitespace-separated token in %s", (attribute) => {
    const html = `
      <div id="existing"></div><div id="ending"></div>
      <button ${attribute}=" existing missing-first\tmissing-second\nending ">Przycisk</button>
    `;

    expect(collectDiagnostics(html, "fixture:multiple-ids")).toEqual([
      `fixture:multiple-ids [${attribute}] unresolved ID "missing-first"`,
      `fixture:multiple-ids [${attribute}] unresolved ID "missing-second"`,
    ]);
  });

  it("does not resolve references using IDs from a different document", () => {
    expect(collectDiagnostics('<div id="other-document"></div>', "fixture:first")).toEqual([]);
    expect(collectDiagnostics('<button aria-controls="other-document">Pokaż</button>', "fixture:second"))
      .toEqual(['fixture:second [aria-controls] unresolved ID "other-document"']);
  });
});
