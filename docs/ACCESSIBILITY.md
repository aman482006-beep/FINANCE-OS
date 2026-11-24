# Accessibility standard

Finance OS targets WCAG 2.2 AA. The automated CI check currently runs axe-core against the primary application workspaces using WCAG 2.1 A/AA rules; automated checks do not replace manual testing.

## Required interaction patterns

- All navigation, dialogs, forms and actions must be keyboard accessible.
- Every input needs an accessible name; placeholders are not labels.
- Focus indicators must remain visible.
- Dialogs should expose an accessible heading, support Escape and return focus to the trigger.
- Dynamic order confirmations and review feedback should be announced with live regions.
- Do not encode buy/sell or pass/fail meaning through colour alone.
- Charts must provide a text summary or tabular equivalent.
- Support reduced motion and browser zoom/reflow.
- Maintain sufficient contrast and target sizes, particularly on mobile.

## Manual release checks

Test with keyboard only, NVDA/VoiceOver, 200% zoom, 320 CSS-pixel width, reduced motion and a touch device. Review charts and complex financial tables with screen readers.
