#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FIXTURE = path.join(ROOT, "editorial", "tests", "CASE-MADURO-SOVEREIGN-IMMUNITY-2026.json");

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

if (!fs.existsSync(FIXTURE)) fail("falta el fixture de aceptación editorial de Maduro");

let test;
try {
  test = JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
} catch (error) {
  fail(`fixture JSON inválido: ${error.message}`);
}

const expected = test.expected ?? {};
const claims = new Map((test.claims ?? []).map((claim) => [claim.claim_id, claim]));

for (const claimId of expected.verified_claims ?? []) {
  const claim = claims.get(claimId);
  if (!claim || claim.status !== "VERIFIED") fail(`claim esperado como VERIFIED no lo está: ${claimId}`);
}

for (const claimId of expected.blocked_claims ?? []) {
  const claim = claims.get(claimId);
  if (!claim) fail(`falta claim bloqueante: ${claimId}`);
  if (claim.status === "VERIFIED") fail(`claim bloqueante aparece indebidamente como VERIFIED: ${claimId}`);
  if (claim.blocking !== true) fail(`claim bloqueante sin flag blocking=true: ${claimId}`);
}

if (expected.must_distinguish_defense_argument_from_court_decision === true) {
  const defenseClaim = [...claims.values()].find((claim) => claim.claim_id.includes("DEFENSE-ASSERTS"));
  const courtClaim = [...claims.values()].find((claim) => claim.claim_id.includes("COURT-GRANTS"));
  if (!defenseClaim || !courtClaim) fail("no se conserva la separación entre alegación de la defensa y decisión judicial");
  if (defenseClaim.status !== "VERIFIED") fail("la alegación atribuida a la defensa no está verificada");
  if (courtClaim.status === "VERIFIED") fail("se ha convertido una alegación en una decisión judicial");
}

if (expected.status !== "PARTIALLY_VERIFIED") fail("estado esperado incompatible con el caso de prueba");
if (expected.publication_allowed !== false) fail("el fixture debe exigir bloqueo de publicación");
if (expected.requires_human_editorial_approval !== true) fail("el fixture debe exigir aprobación humana");

console.log("MALDITOESPEJO — EDITORIAL E2E ACCEPTANCE TEST");
console.log("✓ Entrada aceptada");
console.log("✓ Claims principales identificados");
console.log("✓ Evidencia/corroboración declarada");
console.log("✓ Alegación de la defensa separada de decisión judicial");
console.log("✓ Claim no verificado permanece bloqueado");
console.log("✓ Estado PARTIALLY_VERIFIED");
console.log("✓ Publication Gate esperado: BLOCKED");
console.log("");
console.log("RESULTADO: PASS");
