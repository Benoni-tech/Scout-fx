/**
 * Invisible field that only bots fill in. Read it on submit with
 * `honeypotValue(e)` and send it as `company`; the API quietly drops
 * submissions where it isn't empty.
 */
export default function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function honeypotValue(e: { currentTarget: HTMLFormElement }) {
  return String(new FormData(e.currentTarget).get("company") ?? "");
}
