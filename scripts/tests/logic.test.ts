// Unit tests for the deck's pure logic and content invariants. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutSystem, stages } from '../../src/lib/layout.ts';
import { systems, systemsCopy } from '../../src/content/en/systems.ts';
import { slides, variants, brandSlides } from '../../src/content/en/deck.ts';
import { caseStudies } from '../../src/content/en/work.ts';

test('layout: every system node is placed inside the diagram', () => {
  for (const s of systems) {
    const l = layoutSystem(s, 1136, 150, 112, 56);
    for (const n of s.nodes) {
      const p = l.nodes.get(n.id)!;
      assert.ok(p.x - 56 >= -0.01 && p.x + 56 <= 1136.01, `${s.id}/${n.id} x`);
      assert.ok(p.y - 28 >= -0.01 && p.y + 28 <= 150.01, `${s.id}/${n.id} y`);
    }
    assert.equal(l.edges.length, s.edges.length, `${s.id}: all edges resolved`);
  }
});

test('layout: nodes never overlap horizontally', () => {
  for (const s of systems) {
    const l = layoutSystem(s, 1136, 150, 112, 56);
    const cols = Math.max(...s.nodes.map((n) => n.col)) + 1;
    const spacing = cols > 1 ? (1136 - 112) / (cols - 1) : Infinity;
    assert.ok(spacing >= 112, `${s.id}: column spacing ${spacing.toFixed(1)} < node width`);
    assert.equal(stages(s).flat().length, s.nodes.length);
    void l;
  }
});

test('deck: the final commercial deck has exactly 12 slides', () => {
  const full = variants.find((v) => v.id === 'full')!;
  assert.equal(full.slides.length, 12);
  assert.equal(slides.at(-1)?.id,'contact');
  assert.equal(slides.at(-2)?.id,'founder');
  assert.ok(slides.every(s=>s.kind!=='credits'&&s.kind!=='craft'));
  assert.equal(new Set(slides.map((s) => s.id)).size, slides.length, 'slide ids are unique');
});

test('deck: exactly one closing CTA, two case studies', () => {
  assert.equal(slides.filter((s) => s.kind === 'contact').length, 1);
  assert.equal(slides.filter((s) => s.kind === 'case').length, 2);
  assert.equal(caseStudies.length, 2);
});

test('brand guide is separate and concise', () => {
  assert.ok(brandSlides.length <= 8);
  assert.ok(brandSlides.every((s) => s.kind.startsWith('brand-')));
  assert.ok(slides.every((s) => !s.kind.startsWith('brand-')), 'no brand-kit pages inside the deck');
});

test('systems: the PDF system exists', () => {
  assert.ok(systems.some((s) => s.id === systemsCopy.printSystem));
});
