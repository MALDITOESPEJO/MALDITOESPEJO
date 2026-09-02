# Calculation & Derived Claims Engine

## Purpose

Control claims that are calculated, transformed, compared or derived from other claims or evidence.

MALDITOESPEJO must distinguish between a source-provided figure and a figure calculated by the editorial system.

## Core rule

> Una operación matemática correcta no convierte automáticamente su resultado en una conclusión editorial correcta.

The engine verifies the calculation path, the inputs, units, time periods and interpretation limits.

## Chain

`SOURCE DATA → INPUT CLAIMS → CALCULATION → DERIVED CLAIM → INTERPRETATION → PUBLICATION SCOPE`

## Calculation types

- `DIFFERENCE`
- `PERCENTAGE_CHANGE`
- `PERCENTAGE_SHARE`
- `RATE`
- `AVERAGE`
- `SUM`
- `SUBTRACTION`
- `RATIO`
- `COMPARISON`
- `AGGREGATION`
- `OTHER_DERIVED`

## Required controls

For every derived claim, the record should identify:

- input claim IDs or evidence IDs;
- operation;
- formula or calculation description;
- units;
- time period for each input;
- result;
- rounding policy;
- source values;
- interpretation limits.

## Temporal rule

Inputs from different periods cannot be combined silently. A comparison must state the periods being compared.

## Unit rule

Values with incompatible units cannot be combined. Currency, percentage points, percentages, people, averages and totals must remain distinguishable.

## Percentage rule

A percentage change and a percentage-point change are different claims and must never be treated as equivalent.

## Rounding rule

Rounding may be applied for presentation, but the underlying values must remain traceable. The rounded result must not create a materially different conclusion.

## Verification inheritance

A derived claim cannot have a stronger verification status than its required inputs.

If an essential input is `PENDING`, `CONTESTED`, `RECHECK_REQUIRED` or otherwise unverified, the derived claim cannot be published as a verified fact.

## Editorial interpretation

The engine verifies arithmetic and documentary inputs. It does not decide whether an observed numerical change means “improvement”, “collapse”, “record”, “cause” or another substantive editorial conclusion unless that interpretation is separately supported.

## Examples

### Difference

`22,345,226 - 22,508,066 = -162,840`

This establishes a difference between two figures. It does not by itself establish that 162,840 jobs were destroyed.

### Percentage change

`(new - old) / old × 100`

The denominator and period must be explicit.

### Percentage points

`new percentage - old percentage`

This is not the same as percentage change.

## Failure states

- `VALID`
- `INVALID_INPUTS`
- `INVALID_FORMULA`
- `UNIT_MISMATCH`
- `PERIOD_MISMATCH`
- `ROUNDING_RISK`
- `INTERPRETATION_REQUIRES_REVIEW`
- `UNVERIFIED_INPUT`

## Fail-safe

When a calculation cannot be reproduced from documented inputs, the system must not publish the derived figure as verified.

Preferred outcome:

`NO PUBLICAR TODAVÍA`

rather than an unsupported numerical conclusion.

## Plain-language rule

The calculation may be technical internally. The published explanation must remain simple and must not confuse a calculated number with what that number means.

> **La investigación puede ser compleja; la explicación no debe serlo.**
