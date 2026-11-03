"use client";

/**
 * Bot trap. A field real visitors never see (it is moved off-screen and hidden from
 * assistive tech and keyboard focus) but form-filling bots happily complete.
 * The server silently discards any submission where it has a value.
 *
 * Usage:  const [trap, setTrap] = useState("");  ...  <Honeypot value={trap} onChange={setTrap} />
 * and send `website: trap` with the form data.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Leave this field empty
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
